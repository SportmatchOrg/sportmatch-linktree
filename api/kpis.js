// KPIs de SportMatch, leídos del dashboard de la cátedra (lab4-kpis, Supabase).
//
// Los publica todos los días el workflow kpi-report de agents-copilot. Acá solo
// se leen: la `X-Project-Key` de prod queda en el server y nunca llega a la página.
// GET ?granularity=day|week|month: devuelve el catálogo y, por KPI, un valor por
// período agregado con la `aggregation` que declara su catálogo.

// Cada granularidad es cuántos períodos se muestran hacia atrás.
const GRANULARITIES = Object.freeze({
  day: { count: 30 },
  week: { count: 12 },
  month: { count: 12 },
});

// Supabase corta cada respuesta en 1000 filas; se pide de a una página.
const PAGE_SIZE = 1000;
const DAY_MS = 86_400_000;
// Argentina es UTC-3 sin horario de verano: alcanza con restar 3 h.
const AR_OFFSET_MS = 3 * 3_600_000;

class ConfigurationError extends Error {}
class UpstreamError extends Error {}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new ConfigurationError(`Missing ${name}`);
  return value;
}

function json(response, status, payload, cache = 'no-store') {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', cache);
  return response.json(payload);
}

const isoDate = ms => new Date(ms).toISOString().slice(0, 10);
const dateMs = date => Date.parse(`${date}T00:00:00Z`);

/** Ayer en Buenos Aires: el reporte nunca trae el día en curso. */
function yesterday(now = Date.now()) {
  return isoDate(now - AR_OFFSET_MS - DAY_MS);
}

/** Primer día del período que contiene `date`. Las semanas arrancan en lunes. */
function periodStart(date, granularity) {
  if (granularity === 'month') return `${date.slice(0, 7)}-01`;
  if (granularity === 'week') {
    const ms = dateMs(date);
    return isoDate(ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY_MS);
  }
  return date;
}

/** Los `count` períodos que terminan en el que contiene `lastDate`, del más viejo al más nuevo. */
function periods(lastDate, granularity) {
  const starts = [periodStart(lastDate, granularity)];
  while (starts.length < GRANULARITIES[granularity].count) {
    const current = new Date(dateMs(starts[0]));
    starts.unshift(granularity === 'month'
      ? isoDate(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 1, 1))
      : isoDate(current.getTime() - (granularity === 'week' ? 7 : 1) * DAY_MS));
  }
  return starts;
}

// `rows` viene ordenado por fecha, así que `last` es el último día del período.
const AGGREGATE = {
  avg: values => values.reduce((sum, v) => sum + v, 0) / values.length,
  sum: values => values.reduce((sum, v) => sum + v, 0),
  min: values => Math.min(...values),
  max: values => Math.max(...values),
  last: values => values.at(-1),
  count: values => values.length,
};

function aggregate(catalog, rows, granularity, lastDate) {
  const starts = periods(lastDate, granularity);
  return catalog.map(kpi => {
    const aggregation = AGGREGATE[kpi.aggregation] ? kpi.aggregation : 'avg';
    const byPeriod = new Map(starts.map(start => [start, []]));
    for (const row of rows) {
      if (row.kpi_id === kpi.id) byPeriod.get(periodStart(row.date, granularity))?.push(row.value);
    }
    return {
      id: kpi.id,
      name: kpi.name ?? kpi.id,
      kind: kpi.kind,
      unit: kpi.unit,
      description: kpi.description,
      source: kpi.source ?? null,
      justification: kpi.justification ?? null,
      aggregation,
      buckets: starts.map(start => {
        const values = byPeriod.get(start);
        return {
          start,
          samples: values.length,
          value: values.length ? Math.round(AGGREGATE[aggregation](values) * 100) / 100 : null,
        };
      }),
    };
  });
}

async function supabase(path) {
  const response = await fetch(`${requiredEnv('KPI_SUPABASE_URL')}/rest/v1/${path}`, {
    headers: {
      apikey: requiredEnv('KPI_SUPABASE_PUBLISHABLE_KEY'),
      'X-Project-Key': requiredEnv('KPI_PROJECT_KEY'),
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new UpstreamError(`Supabase ${path.split('?')[0]} answered HTTP ${response.status}`);
  return response.json();
}

async function measurementsSince(from) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await supabase(
      `measurement?select=kpi_id,date,value,reported_at&date=gte.${from}&order=date.asc,kpi_id.asc&limit=${PAGE_SIZE}&offset=${offset}`,
    );
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

async function handleRequest(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return json(response, 405, {
      error: { code: 'METHOD_NOT_ALLOWED', message: 'This operation is not supported.' },
    });
  }

  const granularity = request.query?.granularity ?? 'day';
  if (!Object.hasOwn(GRANULARITIES, granularity)) {
    return json(response, 400, {
      error: { code: 'INVALID_GRANULARITY', message: `granularity must be one of: ${Object.keys(GRANULARITIES).join(', ')}.` },
    });
  }

  const lastDate = yesterday();
  const [catalog, rows] = await Promise.all([
    supabase('kpi_catalog?select=*&order=id.asc'),
    measurementsSince(periods(lastDate, granularity)[0]),
  ]);
  const active = catalog.filter(kpi => !kpi.deprecated_at);
  const reportedAt = rows.reduce((latest, row) => (row.reported_at > latest ? row.reported_at : latest), '');

  // Los datos cambian una vez por día: 15 min de CDN alcanzan y evitan pegarle a Supabase en cada visita.
  return json(response, 200, {
    granularity,
    lastDate,
    reportedAt: reportedAt || null,
    kpis: aggregate(active, rows, granularity, lastDate),
  }, 'public, s-maxage=900, stale-while-revalidate=3600');
}

export default async function handler(request, response) {
  try {
    return await handleRequest(request, response);
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error(error.message);
      return json(response, 503, {
        error: { code: 'SERVICE_NOT_CONFIGURED', message: 'The KPI dashboard is not configured yet.' },
      });
    }
    if (error instanceof UpstreamError || error?.name === 'TimeoutError') {
      console.error(error.message);
      return json(response, 502, {
        error: { code: 'UPSTREAM_ERROR', message: 'The KPI platform could not be reached.' },
      });
    }
    console.error('Unexpected KPI API error', error);
    return json(response, 500, {
      error: { code: 'INTERNAL_ERROR', message: 'The KPI API could not complete the request.' },
    });
  }
}

export const testing = { GRANULARITIES, yesterday, periodStart, periods, aggregate };

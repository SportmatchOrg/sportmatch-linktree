// Historial de /api/status.
//
// POST: lo llama cron-job.org cada 5 min con `Authorization: Bearer
// $STATUS_CRON_SECRET`. Una vez cada 30 min corre los mismos probes que la
// página y guarda una fila por target en `status_checks`; el resto de las
// llamadas vuelve sin tocar nada.
// GET ?range=day|week|month|year: devuelve, por target, una barra por intervalo
// con cuántos checks hubo y cuántos dieron el status esperado.
//
// Vive separado de status.js para que el check en vivo siga sin credenciales.

import { timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

import { testing as live } from './status.js';

// Cada rango es una ventana y el tamaño de cada barra dentro de ella.
const RANGES = Object.freeze({
  day: { window: '1 day', bucket: '1 hour' },
  week: { window: '7 days', bucket: '6 hours' },
  month: { window: '30 days', bucket: '1 day' },
  year: { window: '365 days', bucket: '7 days' },
});

// Las barras se alinean a la medianoche de Argentina (UTC-3, sin horario de
// verano) y las semanales arrancan en lunes: 2000-01-03 fue lunes.
const BUCKET_ORIGIN = '2000-01-03T00:00:00-03:00';

class ConfigurationError extends Error {}

let databaseClient;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new ConfigurationError(`Missing ${name}`);
  return value;
}

function database() {
  if (!databaseClient) databaseClient = neon(requiredEnv('DATABASE_URL'));
  return databaseClient;
}

function json(response, status, payload) {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  return response.json(payload);
}

function isCron(request) {
  const expected = Buffer.from(`Bearer ${requiredEnv('STATUS_CRON_SECRET')}`);
  const supplied = Buffer.from(request.headers?.authorization ?? '');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

// `/health` hace un `select 1` y Neon apaga la compute tras 5 min sin uso: un
// probe cada 5 min dejaba prod y dev prendidas 24/7 y agotaba las horas de
// CPU del plan gratis. Cada tick de 5 min cae en una sola ventana [0, 5).
const RECORD_EVERY_MINUTES = 30;
const CRON_TICK_MINUTES = 5;

function isRecordTick(now = new Date()) {
  return now.getUTCMinutes() % RECORD_EVERY_MINUTES < CRON_TICK_MINUTES;
}

async function record(response) {
  if (!isRecordTick()) return json(response, 200, { recorded: 0, skipped: true });

  const results = await Promise.all(live.TARGETS.map(live.probe));
  await database()`
    insert into public.status_checks (target, ok, status, ms)
    select * from unnest(
      ${results.map(r => r.id)}::text[],
      ${results.map(r => r.ok)}::boolean[],
      ${results.map(r => r.status)}::smallint[],
      ${results.map(r => r.ms)}::integer[]
    )`;
  return json(response, 201, { recorded: results.length, targets: results });
}

async function history(response, rangeName) {
  const range = RANGES[rangeName];
  // generate_series arma todas las barras, aunque no tengan checks: un hueco
  // en el historial se tiene que ver como "sin datos", no desaparecer.
  const rows = await database()`
    with buckets as (
      select generate_series(
        date_bin(${range.bucket}::interval, now() - ${range.window}::interval, ${BUCKET_ORIGIN}::timestamptz),
        now(),
        ${range.bucket}::interval
      ) as start
    ), targets as (
      select unnest(${live.TARGETS.map(t => t.id)}::text[]) as target
    )
    select t.target, b.start,
      count(c.id)::int as samples,
      (count(c.id) filter (where c.ok))::int as up,
      round(avg(c.ms))::int as avg_ms
    from targets t
    cross join buckets b
    left join public.status_checks c
      on c.target = t.target
     and c.checked_at >= b.start
     and c.checked_at < b.start + ${range.bucket}::interval
    group by t.target, b.start
    order by t.target, b.start`;

  const targets = live.TARGETS.map(target => ({
    id: target.id,
    name: target.name,
    buckets: rows
      .filter(row => row.target === target.id)
      .map(row => ({ start: row.start, samples: row.samples, up: row.up, avgMs: row.avg_ms })),
  }));
  return json(response, 200, { range: rangeName, bucket: range.bucket, targets });
}

async function handleRequest(request, response) {
  if (request.method === 'POST') {
    if (!isCron(request)) {
      return json(response, 401, { error: { code: 'UNAUTHORIZED', message: 'Missing or invalid cron secret.' } });
    }
    return record(response);
  }

  if (request.method === 'GET') {
    const range = request.query?.range ?? 'day';
    if (!Object.hasOwn(RANGES, range)) {
      return json(response, 400, {
        error: { code: 'INVALID_RANGE', message: `range must be one of: ${Object.keys(RANGES).join(', ')}.` },
      });
    }
    return history(response, range);
  }

  response.setHeader('Allow', 'GET, POST');
  return json(response, 405, {
    error: { code: 'METHOD_NOT_ALLOWED', message: 'This operation is not supported.' },
  });
}

export default async function handler(request, response) {
  try {
    return await handleRequest(request, response);
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error(error.message);
      return json(response, 503, {
        error: { code: 'SERVICE_NOT_CONFIGURED', message: 'The status history is not configured yet.' },
      });
    }
    console.error('Unexpected status history API error', error);
    return json(response, 500, {
      error: { code: 'INTERNAL_ERROR', message: 'The status history could not complete the request.' },
    });
  }
}

export const testing = { RANGES, BUCKET_ORIGIN, isRecordTick };

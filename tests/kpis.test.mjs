import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import handler, { testing } from '../api/kpis.js';

const page = await readFile(new URL('../tools/pages/kpis.html', import.meta.url), 'utf8');
const shell = await readFile(new URL('../tools/index.html', import.meta.url), 'utf8');
const routes = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));

const ENV = {
  KPI_SUPABASE_URL: 'https://kpis.example.test',
  KPI_SUPABASE_PUBLISHABLE_KEY: 'publishable',
  KPI_PROJECT_KEY: 'kpi_secret',
};

/** Llama al handler con un response falso y, si se pasa, un Supabase falso. */
async function call(request, fakeFetch) {
  const original = globalThis.fetch;
  if (fakeFetch) globalThis.fetch = fakeFetch;
  const response = {
    headers: {},
    status(code) { this.code = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(body) { this.body = body; return this; },
  };
  try {
    await handler({ headers: {}, query: {}, ...request }, response);
  } finally {
    globalThis.fetch = original;
  }
  return response;
}

async function withEnv(fn) {
  Object.assign(process.env, ENV);
  try {
    return await fn();
  } finally {
    for (const name of Object.keys(ENV)) delete process.env[name];
  }
}

test('periods start on monday and on the first of the month', () => {
  // 2026-10-29 es jueves.
  assert.equal(testing.periodStart('2026-10-29', 'day'), '2026-10-29');
  assert.equal(testing.periodStart('2026-10-29', 'week'), '2026-10-26');
  assert.equal(testing.periodStart('2026-10-26', 'week'), '2026-10-26');
  assert.equal(testing.periodStart('2026-11-01', 'week'), '2026-10-26');
  assert.equal(testing.periodStart('2026-10-29', 'month'), '2026-10-01');
});

test('each granularity lists its periods oldest first, across year boundaries', () => {
  const months = testing.periods('2027-01-15', 'month');
  assert.equal(months.length, testing.GRANULARITIES.month.count);
  assert.equal(months.at(-1), '2027-01-01');
  assert.equal(months.at(-2), '2026-12-01');
  assert.equal(months[0], '2026-02-01');

  const weeks = testing.periods('2026-10-29', 'week');
  assert.equal(weeks.at(-1), '2026-10-26');
  assert.equal(weeks.at(-2), '2026-10-19');

  const days = testing.periods('2026-03-01', 'day');
  assert.equal(days.at(-2), '2026-02-28');
});

test('yesterday is computed in Buenos Aires time', () => {
  // 02:00 UTC del 29 son las 23:00 del 28 en Buenos Aires: ayer es el 27.
  assert.equal(testing.yesterday(Date.parse('2026-10-29T02:00:00Z')), '2026-10-27');
  assert.equal(testing.yesterday(Date.parse('2026-10-29T04:00:00Z')), '2026-10-28');
});

test('values aggregate with the catalog aggregation and empty periods stay empty', () => {
  const catalog = [{ id: 'a', kind: 'business', unit: '%', description: 'd', aggregation: 'avg' },
    { id: 'b', kind: 'health', unit: '1', description: 'd', aggregation: 'last' }];
  const rows = [
    { kpi_id: 'a', date: '2026-10-26', value: 10 },
    { kpi_id: 'a', date: '2026-10-27', value: 20 },
    { kpi_id: 'b', date: '2026-10-26', value: 0 },
    { kpi_id: 'b', date: '2026-10-27', value: 1 },
    { kpi_id: 'a', date: '2026-01-01', value: 99 },
  ];
  const [a, b] = testing.aggregate(catalog, rows, 'week', '2026-10-28');
  assert.deepEqual(a.buckets.at(-1), { start: '2026-10-26', samples: 2, value: 15 });
  assert.deepEqual(a.buckets.at(-2), { start: '2026-10-19', samples: 0, value: null });
  assert.equal(b.buckets.at(-1).value, 1);
  // Lo que cae fuera de la ventana no se cuela en ningún período.
  assert.equal(a.buckets.reduce((sum, bucket) => sum + bucket.samples, 0), 2);
});

test('an unknown granularity is rejected before calling Supabase', async () => {
  const response = await call({ method: 'GET', query: { granularity: 'decade' } }, () => {
    throw new Error('should not fetch');
  });
  assert.equal(response.code, 400);
  assert.equal(response.body.error.code, 'INVALID_GRANULARITY');
});

test('missing configuration reports it as not configured', async () => {
  const response = await call({ method: 'GET' });
  assert.equal(response.code, 503);
  assert.equal(response.body.error.code, 'SERVICE_NOT_CONFIGURED');
});

test('other methods are refused', async () => {
  const response = await call({ method: 'POST' });
  assert.equal(response.code, 405);
  assert.equal(response.headers.Allow, 'GET');
});

test('reads catalog and measurements with the project key and drops deprecated KPIs', async () => {
  const seen = [];
  const lastDate = testing.yesterday();
  const response = await withEnv(() => call({ method: 'GET', query: { granularity: 'day' } }, async (url, init) => {
    seen.push({ url, headers: init.headers });
    const body = url.includes('kpi_catalog')
      ? [{ id: 'live', name: 'Live', kind: 'technical', unit: 'ms', description: 'd', aggregation: 'avg' },
        { id: 'old', kind: 'technical', unit: 'ms', description: 'd', deprecated_at: '2026-01-01' }]
      : [{ kpi_id: 'live', date: lastDate, value: 540.5, reported_at: '2026-10-29T04:15:26Z' }];
    return { ok: true, status: 200, json: async () => body };
  }));

  assert.equal(response.code, 200);
  assert.deepEqual(response.body.kpis.map(kpi => kpi.id), ['live']);
  assert.equal(response.body.kpis[0].buckets.at(-1).value, 540.5);
  assert.equal(response.body.reportedAt, '2026-10-29T04:15:26Z');
  for (const { url, headers } of seen) {
    assert.ok(url.startsWith(`${ENV.KPI_SUPABASE_URL}/rest/v1/`));
    assert.equal(headers['X-Project-Key'], ENV.KPI_PROJECT_KEY);
    assert.equal(headers.apikey, ENV.KPI_SUPABASE_PUBLISHABLE_KEY);
  }
});

test('a Supabase failure answers 502', async () => {
  const response = await withEnv(() => call({ method: 'GET' }, async () => ({ ok: false, status: 403 })));
  assert.equal(response.code, 502);
  assert.equal(response.body.error.code, 'UPSTREAM_ERROR');
});

test('the KPI page parses, offers every granularity and never sees the project key', () => {
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
  assert.match(page, /const API_URL = "\/api\/kpis"/);
  for (const granularity of Object.keys(testing.GRANULARITIES)) {
    assert.match(page, new RegExp(`data-granularity="${granularity}"`));
  }
  assert.match(page, /aria-describedby/);
  assert.doesNotMatch(page, /X-Project-Key|kpi_[A-Za-z0-9]{16,}|supabase\.co/);
});

test('the shell and the routes reach the KPI page', () => {
  assert.match(shell, /data-src="\/tools\/pages\/kpis\.html" data-label="KPIs"/);
  assert.ok(routes.routes.some(route => route.dest === '/tools/pages/kpis.html'));
});

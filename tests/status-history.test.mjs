import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import handler, { testing } from '../api/status-history.js';

const page = await readFile(new URL('../tools/pages/status.html', import.meta.url), 'utf8');

/** Llama al handler con un response falso. Ningún caso llega a la base. */
async function call(request) {
  const response = {
    headers: {},
    status(code) { this.code = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(body) { this.body = body; return this; },
  };
  await handler({ headers: {}, query: {}, ...request }, response);
  return response;
}

test('history offers day, week, month and year', () => {
  assert.deepEqual(Object.keys(testing.RANGES), ['day', 'week', 'month', 'year']);
  for (const range of Object.values(testing.RANGES)) {
    assert.ok(range.window && range.bucket);
  }
});

test('the cron records once every 30 minutes, not on every 5-minute tick', () => {
  const at = minute => new Date(Date.UTC(2026, 9, 10, 12, minute, 20));
  const recorded = Array.from({ length: 60 }, (_, m) => m).filter(m => testing.isRecordTick(at(m)));
  assert.deepEqual(recorded, [0, 1, 2, 3, 4, 30, 31, 32, 33, 34]);
  const ticks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => at(m + 2));
  assert.equal(ticks.filter(t => testing.isRecordTick(t)).length, 2);
});

test('an unknown range is rejected before touching the database', async () => {
  const response = await call({ method: 'GET', query: { range: 'decade' } });
  assert.equal(response.code, 400);
  assert.equal(response.body.error.code, 'INVALID_RANGE');
});

test('only the cron can record checks', async () => {
  process.env.STATUS_CRON_SECRET = 'test-secret';
  try {
    const missing = await call({ method: 'POST' });
    assert.equal(missing.code, 401);

    const wrong = await call({ method: 'POST', headers: { authorization: 'Bearer nope-secret' } });
    assert.equal(wrong.code, 401);
  } finally {
    delete process.env.STATUS_CRON_SECRET;
  }
});

test('recording without a configured secret reports it as not configured', async () => {
  const response = await call({ method: 'POST', headers: { authorization: 'Bearer anything' } });
  assert.equal(response.code, 503);
  assert.equal(response.body.error.code, 'SERVICE_NOT_CONFIGURED');
});

test('other methods are refused', async () => {
  const response = await call({ method: 'DELETE' });
  assert.equal(response.code, 405);
  assert.equal(response.headers.Allow, 'GET, POST');
});

test('the status page charts every range and labels each state', () => {
  assert.match(page, /const HISTORY_URL = "\/api\/status-history"/);
  for (const range of Object.keys(testing.RANGES)) {
    assert.match(page, new RegExp(`data-range="${range}"`));
  }
  // El color nunca va solo: leyenda con texto y cada barra con su aria-label.
  for (const label of ['Operativo', 'Con fallas', 'Caído', 'Sin datos']) {
    assert.match(page, new RegExp(`"${label}"`));
  }
  assert.match(page, /bar\.setAttribute\("aria-label"/);
});

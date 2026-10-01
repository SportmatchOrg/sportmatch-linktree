import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { testing } from '../api/status.js';

const page = await readFile(new URL('../tools/pages/status.html', import.meta.url), 'utf8');
const shell = await readFile(new URL('../tools/index.html', import.meta.url), 'utf8');
const home = await readFile(new URL('../tools/pages/home.html', import.meta.url), 'utf8');
const routes = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));

/** Corre `probe` contra un `fetch` falso: los tests no tocan la red. */
async function probeWith(target, fakeFetch) {
  const original = globalThis.fetch;
  globalThis.fetch = fakeFetch;
  try {
    return await testing.probe(target);
  } finally {
    globalThis.fetch = original;
  }
}

const target = { id: 't', name: 'T', detail: 'd', url: 'https://example.test/users', expect: 401 };

test('status page inline JavaScript parses', () => {
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
});

test('status page reads through the status API and refreshes itself', () => {
  assert.match(page, /const API_URL = "\/api\/status"/);
  assert.match(page, /setInterval\(check, REFRESH_MS\)/);
  assert.match(page, /cache: "no-store"/);
});

test('every target declares the HTTP status it expects', () => {
  assert.ok(testing.TARGETS.length >= 2);
  for (const entry of testing.TARGETS) {
    assert.ok(entry.id && entry.name && entry.detail, `${entry.id} needs id, name and detail`);
    assert.match(entry.url, /^https:\/\//);
    assert.equal(typeof entry.expect, 'number');
  }
});

test('a target is healthy only when the status matches the one expected', async () => {
  // El 401 del backend es sano: se compara contra `expect`, no contra `response.ok`.
  const healthy = await probeWith(target, async () => ({ status: 401, ok: false }));
  assert.equal(healthy.ok, true);
  assert.equal(healthy.status, 401);
  assert.equal(typeof healthy.ms, 'number');

  // Y un 200 inesperado es una regresión, aunque `response.ok` sea true.
  const unexpected = await probeWith(target, async () => ({ status: 200, ok: true }));
  assert.equal(unexpected.ok, false);
  assert.equal(unexpected.status, 200);
});

test('network failures and timeouts report as down without a status', async () => {
  const offline = await probeWith(target, async () => { throw new Error('connect ECONNREFUSED'); });
  assert.equal(offline.ok, false);
  assert.equal(offline.status, 0);
  assert.equal(offline.error, 'network');

  const timedOut = await probeWith(target, async () => {
    throw Object.assign(new Error('timed out'), { name: 'TimeoutError' });
  });
  assert.equal(timedOut.error, 'timeout');
});

test('probes cannot hang forever', () => {
  assert.ok(testing.TIMEOUT_MS > 0 && testing.TIMEOUT_MS <= 15_000);
  const source = page;
  assert.doesNotMatch(source, /Bearer |DATABASE_URL|postgresql:\/\//);
});

test('the status check carries no credentials', async () => {
  const source = await readFile(new URL('../api/status.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Bearer |Authorization|DATABASE_URL|postgresql:\/\//);
  assert.match(source, /AbortSignal\.timeout/);
});

test('the CDN target is labelled for what it measures', () => {
  const cdn = testing.TARGETS.find(entry => entry.url.includes('vercel.app'));
  assert.ok(cdn, 'the frontend target should still be checked');
  assert.doesNotMatch(cdn.name, /^SportMatch$/);
  assert.match(cdn.name, /CDN/);
});

test('state is never conveyed by colour alone', () => {
  assert.match(page, /label: "Operativo"/);
  assert.match(page, /label: "Respuesta inesperada"/);
  assert.match(page, /Sin respuesta/);
});

test('the shell, the home chips and the routes reach the status page', () => {
  assert.match(shell, /data-src="\/tools\/pages\/status\.html" data-label="Status"/);
  assert.match(home, /href="\/tools\/pages\/status\.html"/);
  assert.ok(routes.routes.some(route => route.dest === '/tools/pages/status.html'));
});

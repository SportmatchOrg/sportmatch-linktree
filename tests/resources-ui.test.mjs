import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const page = await readFile(new URL('../tools/pages/devtools.html', import.meta.url), 'utf8');
const migration = await readFile(new URL('../db/migrations/002_dev_resources.sql', import.meta.url), 'utf8');

test('dev tools inline JavaScript parses', () => {
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
});

test('category filters stay on one horizontally scrollable line', () => {
  assert.match(page, /\.filters\s*\{[\s\S]*?flex-wrap:\s*nowrap;/);
  assert.match(page, /\.filters\s*\{[\s\S]*?overflow-x:\s*auto;/);
  assert.match(page, /\.chip\s*\{[\s\S]*?flex:\s*0 0 auto;/);
});

test('resource UI reads and writes through the resources API', () => {
  assert.match(page, /id="add-resource"/);
  assert.match(page, /id="resource-dialog"/);
  assert.match(page, /const API_URL = "\/api\/resources"/);
  assert.match(page, /method:\s*"POST"/);
  assert.doesNotMatch(page, /const tools = \[/);
});

test('database migration seeds every original directory resource', () => {
  assert.match(migration, /create table if not exists public\.dev_resources/);
  const seededRows = [...migration.matchAll(/^  \(\d+, /gm)];
  assert.equal(seededRows.length, 75);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const bugsHtml = await readFile(new URL('../tools/pages/bugs.html', import.meta.url), 'utf8');
const toolsHtml = await readFile(new URL('../tools/index.html', import.meta.url), 'utf8');

test('bugs page inline JavaScript parses', () => {
  const scripts = [...bugsHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new Function(scripts[0][1]));
});

test('developers navigation links to the bugs page', () => {
  assert.match(toolsHtml, /data-src="\/tools\/pages\/bugs\.html"/);
});

test('public upload warning and planned attachment types are visible', () => {
  assert.match(bugsHtml, /Attachments are public\./);
  assert.match(bugsHtml, /image\/png,image\/jpeg,image\/webp,text\/markdown/);
  assert.match(bugsHtml, /application\/pdf/);
});

test('attachment picker supports drag and drop', () => {
  assert.match(bugsHtml, /Choose files or drag and drop/);
  assert.match(bugsHtml, /uploadPicker\.addEventListener\('dragover'/);
  assert.match(bugsHtml, /uploadPicker\.addEventListener\('drop'/);
});

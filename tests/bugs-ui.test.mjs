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

test('bug export creates a traced CSV and attachment folders', () => {
  assert.match(bugsHtml, /id="export-bugs"/);
  assert.match(bugsHtml, /\?action=export/);
  assert.match(bugsHtml, /'bugs\.csv'/);
  assert.match(bugsHtml, /`assets\/\$\{key\}\/\$\{key\}-\$\{index \+ 1\}-/);
  assert.match(bugsHtml, /'attachment_paths'/);
  assert.match(bugsHtml, /sportmatch-bugs-\$\{new Date\(\)\.toISOString\(\)\.slice\(0, 10\)\}\.zip/);
});

test('generated ZIP has valid local, central-directory, and end records', async () => {
  const start = bugsHtml.indexOf('const crcTable =');
  const end = bugsHtml.indexOf('  function safeFilename', start);
  assert.ok(start >= 0 && end > start);
  const source = bugsHtml.slice(start, end);
  const { makeZip } = new Function(`${source}\nreturn { makeZip };`)();
  const bytes = new Uint8Array(await makeZip([
    { name: 'bugs.csv', data: new TextEncoder().encode('issue_key\\r\\nBUG-1') },
    { name: 'assets/', data: new Uint8Array() },
  ]).arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(bytes.length - 12, true), 2);
  const centralOffset = view.getUint32(bytes.length - 6, true);
  assert.equal(view.getUint32(centralOffset, true), 0x02014b50);
});

test('human-readable bug keys are visible in list and detail views', () => {
  assert.match(bugsHtml, /return `BUG-\$\{bug\.issue_number\}`/);
  assert.match(bugsHtml, /id="detail-issue-key"/);
  assert.match(bugsHtml, /key\.textContent = issueKey\(bug\)/);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { testing } from '../api/bugs.js';
import { readFile } from 'node:fs/promises';

const apiSource = await readFile(new URL('../api/bugs.js', import.meta.url), 'utf8');
const issueNumberMigration = await readFile(new URL('../db/migrations/003_bug_issue_numbers.sql', import.meta.url), 'utf8');

test('cleanText trims valid content and enforces required values', () => {
  assert.equal(testing.cleanText('  Map is blank  ', 'Title', testing.MAX_TITLE), 'Map is blank');
  assert.throws(
    () => testing.cleanText('   ', 'Title', testing.MAX_TITLE),
    error => error.code === 'VALIDATION_ERROR'
  );
});

test('cleanText enforces maximum field lengths', () => {
  assert.throws(
    () => testing.cleanText('x'.repeat(testing.MAX_TITLE + 1), 'Title', testing.MAX_TITLE),
    error => error.code === 'VALIDATION_ERROR'
  );
});

test('fileDetails accepts the planned MIME and extension combinations', () => {
  assert.deepEqual(
    testing.fileDetails('screen.JPEG', 'image/jpeg', 1024),
    { name: 'screen.JPEG', mimeType: 'image/jpeg', size: 1024, outputExtension: '.jpg' }
  );
  assert.equal(testing.fileDetails('notes.md', 'text/markdown', 20).outputExtension, '.md');
  assert.equal(testing.fileDetails('report.pdf', 'application/pdf', testing.MAX_FILE_SIZE).outputExtension, '.pdf');
});

test('fileDetails rejects mismatched extensions, unknown types, and oversized files', () => {
  assert.throws(
    () => testing.fileDetails('payload.exe', 'application/pdf', 100),
    error => error.code === 'INVALID_FILE_TYPE'
  );
  assert.throws(
    () => testing.fileDetails('payload.svg', 'image/svg+xml', 100),
    error => error.code === 'INVALID_FILE_TYPE'
  );
  assert.throws(
    () => testing.fileDetails('large.png', 'image/png', testing.MAX_FILE_SIZE + 1),
    error => error.code === 'INVALID_FILE_SIZE'
  );
});

test('upload tokens round-trip and reject tampering or expiration', () => {
  const secret = 'test-secret-that-is-long-enough-for-hmac';
  const now = Date.now();
  const payload = {
    bug_id: '123e4567-e89b-42d3-a456-426614174000',
    exp: Math.floor(now / 1000) + 60,
  };
  const token = testing.encodeToken(payload, secret);
  assert.deepEqual(testing.decodeToken(token, secret, now), payload);
  assert.throws(
    () => testing.decodeToken(`${token.slice(0, -1)}x`, secret, now),
    error => error.code === 'INVALID_UPLOAD_TOKEN'
  );
  assert.throws(
    () => testing.decodeToken(token, secret, now + 61_000),
    error => error.code === 'EXPIRED_UPLOAD_TOKEN'
  );
});

test('bugs API exposes stable issue numbers and export metadata', () => {
  assert.match(apiSource, /select id, issue_number, title, description, created_at/);
  assert.match(apiSource, /action === 'export'/);
  assert.match(apiSource, /attachments: byBug\.get\(report\.id\)/);
});

test('issue-number migration backfills existing reports and advances the sequence', () => {
  assert.match(issueNumberMigration, /row_number\(\) over \(order by created_at asc, id asc\)/);
  assert.match(issueNumberMigration, /alter column issue_number set default nextval/);
  assert.match(issueNumberMigration, /bug_reports_issue_number_idx/);
});

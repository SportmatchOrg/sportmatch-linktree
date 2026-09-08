import assert from 'node:assert/strict';
import test from 'node:test';
import { testing } from '../api/resources.js';

test('resource input is trimmed, normalized, and derives its domain', () => {
  assert.deepEqual(testing.cleanResource({
    name: '  Example Tool ',
    url: 'https://Example.com/docs#install',
    category: ' Utilities ',
    subcategory: '',
    description: ' A helpful utility. ',
    tags: [' css ', 'layout', 'css'],
  }), {
    name: 'Example Tool',
    url: 'https://example.com/docs',
    domain: 'example.com',
    category: 'Utilities',
    subcategory: null,
    description: 'A helpful utility.',
    tags: ['css', 'layout'],
  });
});

test('resource URLs must be valid HTTP or HTTPS addresses', () => {
  assert.throws(
    () => testing.cleanUrl('javascript:alert(1)'),
    error => error.code === 'VALIDATION_ERROR'
  );
  assert.throws(
    () => testing.cleanUrl('not a URL'),
    error => error.code === 'VALIDATION_ERROR'
  );
});

test('resource tags enforce count and per-tag length limits', () => {
  assert.throws(
    () => testing.cleanTags(Array.from({ length: testing.MAX_TAGS + 1 }, (_, index) => `tag-${index}`)),
    error => error.code === 'VALIDATION_ERROR'
  );
  assert.throws(
    () => testing.cleanTags(['x'.repeat(testing.MAX_TAG + 1)]),
    error => error.code === 'VALIDATION_ERROR'
  );
});

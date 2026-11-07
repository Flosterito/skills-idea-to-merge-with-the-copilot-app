import assert from 'node:assert/strict';
import test from 'node:test';

import { formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.mjs';

test('normalizes URLs with and without https:// to the same value', () => {
  assert.equal(
    normalizeUrl('www.example.com'),
    normalizeUrl('https://www.example.com'),
  );
  assert.equal(normalizeUrl(' www.example.com '), 'https://www.example.com/');
});

test('recovers from empty, corrupted, legacy, and non-array saved values', () => {
  for (const value of [
    null,
    '',
    '{broken json',
    JSON.stringify({ bookmarks: [{ url: 'https://example.com', slug: 'mona-7fk2' }] }),
    JSON.stringify('legacy bookmarks'),
    JSON.stringify(42),
  ]) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed entries and normalizes valid saved bookmarks', () => {
  assert.deepEqual(
    loadBookmarks(
      JSON.stringify([
        { url: 'www.example.com', slug: 'mona-7fk2' },
        { url: 'javascript:alert(1)', slug: 'mona-xxxx' },
        { url: 'https://example.org', slug: 'not-a-slug' },
        null,
      ]),
    ),
    [{ url: 'https://www.example.com/', slug: 'mona-7fk2' }],
  );
});

test('preserves valid bookmarks from the previous slug format', () => {
  assert.deepEqual(
    loadBookmarks(JSON.stringify([{ url: 'https://example.com/', slug: 'mona-123abc' }])),
    [{ url: 'https://example.com/', slug: 'mona-123abc' }],
  );
});

test('formats a saved bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});

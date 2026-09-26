import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, publishYear } from '../src/lib/dates.ts';

test('formatDate gives a long US date', () => {
  assert.equal(formatDate('2026-09-24T19:36:22+01:00'), 'September 24, 2026');
});

test('formatDate handles a bare date without timezone drift', () => {
  assert.equal(formatDate('2026-09-06'), 'September 6, 2026');
});

test('publishYear returns the year', () => {
  assert.equal(publishYear('2014-04-26'), '2014');
});

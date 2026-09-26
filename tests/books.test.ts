import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitTitle, hasPurchaseUrl } from '../src/lib/books.ts';

test('title with a series suffix splits on the last comma', () => {
  assert.deepEqual(splitTitle('The Haunting of Delilah, Thornehaven One'), {
    name: 'The Haunting of Delilah',
    series: 'Thornehaven One',
  });
  assert.deepEqual(splitTitle('Hawthorne House, Book Two'), {
    name: 'Hawthorne House',
    series: 'Book Two',
  });
});

test('title without a comma has no series', () => {
  assert.deepEqual(splitTitle('Portrait of Isabella'), {
    name: 'Portrait of Isabella',
    series: null,
  });
});

test('empty and null purchase URLs are treated as absent', () => {
  assert.equal(hasPurchaseUrl(''), false);
  assert.equal(hasPurchaseUrl(null), false);
  assert.equal(hasPurchaseUrl(undefined), false);
  assert.equal(hasPurchaseUrl('https://www.amazon.com/dp/B000'), true);
});

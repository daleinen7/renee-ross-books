import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStructuredText, excerpt } from '../src/lib/structured-text.ts';

const doc = {
  schema: 'dast' as const,
  document: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [
          { type: 'span' as const, value: 'Welcome to the creepy castle. ' },
          { type: 'span' as const, marks: ['strong' as const], value: 'We don’t get many visitors.' },
        ],
      },
      {
        type: 'paragraph' as const,
        children: [{ type: 'span' as const, value: 'Second paragraph.' }],
      },
    ],
  },
};

test('renders paragraphs and marks to HTML', () => {
  const html = renderStructuredText(doc);
  assert.match(
    html,
    /<p>Welcome to the creepy castle\. <strong>We don’t get many visitors\.<\/strong><\/p>/,
  );
  assert.match(html, /<p>Second paragraph\.<\/p>/);
});

test('excerpt returns only the first paragraph as plain text', () => {
  assert.equal(excerpt(doc), 'Welcome to the creepy castle. We don’t get many visitors.');
});

test('excerpt trims at a word boundary and adds an ellipsis', () => {
  assert.equal(excerpt(doc, 20), 'Welcome to the…');
});

test('excerpt of an empty document is an empty string', () => {
  const empty = { schema: 'dast' as const, document: { type: 'root' as const, children: [] } };
  assert.equal(excerpt(empty), '');
});

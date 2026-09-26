import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { datoQuery, mapBook, mapPost } from '../src/lib/datocms.ts';

const dast = {
  schema: 'dast' as const,
  document: {
    type: 'root' as const,
    children: [
      { type: 'paragraph' as const, children: [{ type: 'span' as const, value: 'Body.' }] },
    ],
  },
};

const image = {
  src: 'https://www.datocms-assets.com/1/a.jpg?w=800',
  srcSet: 'https://www.datocms-assets.com/1/a.jpg?w=400 400w',
  sizes: '(min-width: 48rem) 20rem, 60vw',
  width: 800,
  height: 1200,
  alt: null,
  base64: null,
};

test('datoQuery throws when the token is missing', async () => {
  await assert.rejects(
    () => datoQuery('{ site { locales } }', {}, { token: '' }),
    /DATOCMS_API_TOKEN/,
  );
});

test('datoQuery surfaces GraphQL errors', async () => {
  const fetchMock = mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response(JSON.stringify({ errors: [{ message: 'Field boom does not exist' }] }), {
        status: 200,
      }),
  );
  await assert.rejects(
    () => datoQuery('{ boom }', {}, { token: 'x' }),
    /Field boom does not exist/,
  );
  fetchMock.mock.restore();
});

test('mapBook renders description, falls back alt to title, and nulls empty purchaseUrl', () => {
  const book = mapBook({
    title: 'Portrait of Isabella',
    slug: 'portrait-of-isabella',
    publishDate: '2025-10-26',
    purchaseUrl: '',
    description: { value: dast },
    bookCover: { responsiveImage: image },
  });
  assert.equal(book.descriptionHtml, '<p>Body.</p>');
  assert.equal(book.cover.alt, 'Cover of Portrait of Isabella');
  assert.equal(book.purchaseUrl, null);
});

test('mapPost tolerates a missing image and produces an excerpt', () => {
  const post = mapPost({
    title: 'A Post',
    slug: 'a-post',
    _firstPublishedAt: '2026-09-24T19:36:22+01:00',
    content: { value: dast },
    image: null,
  });
  assert.equal(post.image, null);
  assert.equal(post.excerpt, 'Body.');
  assert.equal(post.contentHtml, '<p>Body.</p>');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSlugPaths } from '../src/lib/routes.ts';

test('builds one path per book and post with a kind prop', () => {
  const paths = buildSlugPaths([{ slug: 'a-book' }], [{ slug: 'a-post' }]);
  assert.deepEqual(paths, [
    { params: { slug: 'a-book' }, props: { kind: 'book' } },
    { params: { slug: 'a-post' }, props: { kind: 'post' } },
  ]);
});

test('throws naming the slug when a book and a post collide', () => {
  assert.throws(() => buildSlugPaths([{ slug: 'same' }], [{ slug: 'same' }]), /same/);
});

export type SlugKind = 'book' | 'post';

export function buildSlugPaths(
  books: Array<{ slug: string }>,
  posts: Array<{ slug: string }>,
): Array<{ params: { slug: string }; props: { kind: SlugKind } }> {
  const bookSlugs = new Set(books.map((b) => b.slug));
  const clash = posts.find((p) => bookSlugs.has(p.slug));
  if (clash) {
    throw new Error(
      `Slug "${clash.slug}" is used by both a book and a blog post. Rename one in DatoCMS.`,
    );
  }
  return [
    ...books.map((b) => ({ params: { slug: b.slug }, props: { kind: 'book' as const } })),
    ...posts.map((p) => ({ params: { slug: p.slug }, props: { kind: 'post' as const } })),
  ];
}

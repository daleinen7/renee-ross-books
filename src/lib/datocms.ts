import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { renderStructuredText, excerpt, type StructuredTextDocument } from './structured-text.ts';

const ENDPOINT = 'https://graphql.datocms.com/';

export const responsiveImageSchema = z.object({
  src: z.string(),
  srcSet: z.string(),
  sizes: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  base64: z.string().nullable(),
});
export type ResponsiveImage = z.infer<typeof responsiveImageSchema>;

export const bookSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishDate: z.string(),
  purchaseUrl: z.string().nullable(),
  descriptionHtml: z.string(),
  cover: responsiveImageSchema,
});
export type Book = z.infer<typeof bookSchema>;

export const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  contentHtml: z.string(),
  excerpt: z.string(),
  image: responsiveImageSchema.nullable(),
});
export type Post = z.infer<typeof postSchema>;

export const homepageSchema = z.object({ introHtml: z.string(), bodyHtml: z.string() });
export type Homepage = z.infer<typeof homepageSchema>;

export const authorPhotoSchema = z.object({ photo: responsiveImageSchema });
export type AuthorPhoto = z.infer<typeof authorPhotoSchema>;

type RawImage = Omit<ResponsiveImage, 'alt'> & { alt: string | null };
type RawBook = {
  title: string;
  slug: string;
  publishDate: string;
  purchaseUrl: string | null;
  description: { value: StructuredTextDocument };
  bookCover: { responsiveImage: RawImage };
};
type RawPost = {
  title: string;
  slug: string;
  _firstPublishedAt: string;
  content: { value: StructuredTextDocument };
  image: { responsiveImage: RawImage } | null;
};
type RawHomepage = {
  landingPageText: { value: StructuredTextDocument };
  landingPageBody: { value: StructuredTextDocument };
};
type RawAuthorPhoto = { authorPhoto: { responsiveImage: RawImage } };

const IMAGE_FIELDS = 'src srcSet sizes width height alt base64';

const COVER_SIZES = '(min-width: 48rem) 20rem, 60vw';
export const HERO_COVER_SIZES = '(min-width: 48rem) 24rem, 80vw';
const POST_IMAGE_SIZES = '(min-width: 48rem) 40rem, 100vw';
const PHOTO_SIZES = '(min-width: 48rem) 16rem, 50vw';

export const BOOKS_QUERY = `
  query Books($sizes: String!) {
    allBooks(first: 100, orderBy: publishDate_DESC) {
      title slug publishDate purchaseUrl
      description { value }
      bookCover { responsiveImage(imgixParams: { fm: webp, w: 800 }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

export const POSTS_QUERY = `
  query Posts($sizes: String!) {
    allBlogPosts(first: 100, orderBy: _firstPublishedAt_DESC) {
      title slug _firstPublishedAt
      content { value }
      image { responsiveImage(imgixParams: { fm: webp, w: 1200 }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

export const HOMEPAGE_QUERY = `
  query Homepage {
    homepage { landingPageText { value } landingPageBody { value } }
  }
`;

export const AUTHOR_PHOTO_QUERY = `
  query AuthorPhoto($sizes: String!) {
    authorPhoto {
      authorPhoto { responsiveImage(imgixParams: { fm: webp, w: 600, h: 600, fit: crop }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

function resolveToken(): string | undefined {
  const fromVite = (import.meta as { env?: { DATOCMS_API_TOKEN?: string } }).env?.DATOCMS_API_TOKEN;
  return fromVite ?? process.env.DATOCMS_API_TOKEN;
}

export async function datoQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: { token?: string } = {},
): Promise<T> {
  const token = opts.token ?? resolveToken();
  if (!token) {
    throw new Error('DATOCMS_API_TOKEN is not set. Copy .env.example to .env and fill it in.');
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (!res.ok || json.errors?.length) {
    const detail = json.errors?.map((e) => e.message).join('; ') ?? `HTTP ${res.status}`;
    throw new Error(`DatoCMS query failed: ${detail}`);
  }
  return json.data as T;
}

function withAlt(img: RawImage, fallback: string): ResponsiveImage {
  return { ...img, alt: img.alt?.trim() || fallback };
}

export function mapBook(raw: RawBook): Book {
  return {
    title: raw.title,
    slug: raw.slug,
    publishDate: raw.publishDate,
    purchaseUrl: raw.purchaseUrl?.trim() ? raw.purchaseUrl.trim() : null,
    descriptionHtml: renderStructuredText(raw.description.value),
    cover: withAlt(raw.bookCover.responsiveImage, `Cover of ${raw.title}`),
  };
}

export function mapPost(raw: RawPost): Post {
  return {
    title: raw.title,
    slug: raw.slug,
    publishedAt: raw._firstPublishedAt,
    contentHtml: renderStructuredText(raw.content.value),
    excerpt: excerpt(raw.content.value),
    image: raw.image ? withAlt(raw.image.responsiveImage, `Illustration for ${raw.title}`) : null,
  };
}

export function mapHomepage(raw: RawHomepage): Homepage {
  return {
    introHtml: renderStructuredText(raw.landingPageText.value),
    bodyHtml: renderStructuredText(raw.landingPageBody.value),
  };
}

export function mapAuthorPhoto(raw: RawAuthorPhoto): AuthorPhoto {
  return { photo: withAlt(raw.authorPhoto.responsiveImage, 'Author Renee Ross') };
}

function loader<TRaw, TData extends Record<string, unknown>>(opts: {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
  pick: (data: unknown) => TRaw[];
  id: (raw: TRaw) => string;
  map: (raw: TRaw) => TData;
  schema: z.ZodType<TData>;
}): Loader {
  return {
    name: opts.name,
    schema: opts.schema,
    async load({ store, parseData, generateDigest, logger }) {
      const data = await datoQuery<unknown>(opts.query, opts.variables);
      const items = opts.pick(data);
      store.clear();
      for (const raw of items) {
        const id = opts.id(raw);
        const parsed = await parseData({ id, data: opts.map(raw) });
        store.set({ id, data: parsed, digest: generateDigest(parsed) });
      }
      logger.info(`Loaded ${items.length} ${opts.name}`);
    },
  };
}

export const booksLoader = () =>
  loader<RawBook, Book>({
    name: 'books',
    query: BOOKS_QUERY,
    variables: { sizes: COVER_SIZES },
    pick: (d) => (d as { allBooks: RawBook[] }).allBooks,
    id: (b) => b.slug,
    map: mapBook,
    schema: bookSchema,
  });

export const postsLoader = () =>
  loader<RawPost, Post>({
    name: 'posts',
    query: POSTS_QUERY,
    variables: { sizes: POST_IMAGE_SIZES },
    pick: (d) => (d as { allBlogPosts: RawPost[] }).allBlogPosts,
    id: (p) => p.slug,
    map: mapPost,
    schema: postSchema,
  });

export const homepageLoader = () =>
  loader<RawHomepage, Homepage>({
    name: 'homepage',
    query: HOMEPAGE_QUERY,
    pick: (d) => [(d as { homepage: RawHomepage }).homepage],
    id: () => 'homepage',
    map: mapHomepage,
    schema: homepageSchema,
  });

export const authorPhotoLoader = () =>
  loader<RawAuthorPhoto, AuthorPhoto>({
    name: 'authorPhoto',
    query: AUTHOR_PHOTO_QUERY,
    variables: { sizes: PHOTO_SIZES },
    pick: (d) => [(d as { authorPhoto: RawAuthorPhoto }).authorPhoto],
    id: () => 'author-photo',
    map: mapAuthorPhoto,
    schema: authorPhotoSchema,
  });

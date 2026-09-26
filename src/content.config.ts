import { defineCollection } from 'astro:content';
import {
  booksLoader,
  postsLoader,
  homepageLoader,
  authorPhotoLoader,
} from './lib/datocms.ts';

export const collections = {
  books: defineCollection({ loader: booksLoader() }),
  posts: defineCollection({ loader: postsLoader() }),
  homepage: defineCollection({ loader: homepageLoader() }),
  authorPhoto: defineCollection({ loader: authorPhotoLoader() }),
};

import { getCollection } from 'astro:content';
import type { Locale } from '@/i18n';

export async function getPostsByLocale(locale: Locale) {
  const allPosts = await getCollection('posts');
  return allPosts
    .filter((post) => post.id.startsWith(`${locale}/`))
    .sort((a, b) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return b.data.date.getTime() - a.data.date.getTime();
    });
}

/** Strip the locale prefix from post ID to get the slug */
export function getSlug(postId: string): string {
  return postId.replace(/^[^/]+\//, '');
}

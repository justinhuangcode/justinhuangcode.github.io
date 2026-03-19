import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content';
import type { Locale } from '@/i18n';

export type LocalizedEntry<K extends CollectionKey> = CollectionEntry<K>;
export type PostEntry = CollectionEntry<'posts'>;

export async function getPostsByLocale(locale: Locale) {
  return getContentByLocale('posts', locale);
}

/** Generic: fetch any content collection filtered by locale, sorted by pin + date */
export async function getContentByLocale<K extends CollectionKey>(
  collection: K,
  locale: Locale,
): Promise<LocalizedEntry<K>[]> {
  const allEntries = await getCollection(collection);
  return allEntries
    .filter((entry) => entry.id.startsWith(`${locale}/`))
    .sort((a, b) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return b.data.date.getTime() - a.data.date.getTime();
    });
}

/** Strip the locale prefix from post ID to get the slug */
export function getSlug(postId: string): string {
  return postId.replace(/^[^/]+\//, '');
}

import {
  getEntrySlug,
  getLocalizedCollectionEntries,
  getLocalizedPosts,
  type AitherLocalizedEntry,
  type AitherPostEntry,
} from '@aither/astro/posts';
import type { CollectionKey } from 'astro:content';
import { resolveSectionContentLocale } from '@/lib/content-sections';
import type { Locale } from '@/i18n';

export type LocalizedEntry<K extends CollectionKey> = AitherLocalizedEntry<K>;
export type PostEntry = AitherPostEntry;

export async function getPostsByLocale(locale: Locale) {
  return getLocalizedPosts(locale);
}

export async function getContentByLocale<K extends CollectionKey>(
  collection: K,
  locale: Locale,
): Promise<LocalizedEntry<K>[]> {
  return getLocalizedCollectionEntries(
    collection,
    resolveSectionContentLocale(collection, locale),
  );
}

export function getSlug(postId: string): string {
  return getEntrySlug(postId);
}

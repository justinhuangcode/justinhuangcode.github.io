import type { CollectionEntry, CollectionKey } from 'astro:content';
import type { AitherLocale } from './constants';

export type AitherLocalizedEntry<K extends CollectionKey> = CollectionEntry<K>;
export type AitherPostEntry = CollectionEntry<'posts'>;

export declare function isLocalizedEntry<K extends CollectionKey>(
  entry: CollectionEntry<K>,
  locale: AitherLocale,
): boolean;

export declare function sortEntriesByPinnedDate<K extends CollectionKey>(
  a: CollectionEntry<K>,
  b: CollectionEntry<K>,
): number;

export declare function getLocalizedCollectionEntries<K extends CollectionKey>(
  collection: K,
  locale: AitherLocale,
): Promise<CollectionEntry<K>[]>;

export declare function getLocalizedPosts(locale: AitherLocale): Promise<CollectionEntry<'posts'>[]>;

export declare function getEntrySlug(entryId: string): string;

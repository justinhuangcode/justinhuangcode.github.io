import { getCollection } from 'astro:content';

export function isLocalizedEntry(entry, locale) {
  return entry.id.startsWith(`${locale}/`);
}

export function sortEntriesByPinnedDate(a, b) {
  if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
  return b.data.date.getTime() - a.data.date.getTime();
}

export async function getLocalizedCollectionEntries(collection, locale) {
  const allEntries = await getCollection(collection);
  return allEntries.filter((entry) => isLocalizedEntry(entry, locale)).sort(sortEntriesByPinnedDate);
}

export async function getLocalizedPosts(locale) {
  return getLocalizedCollectionEntries('posts', locale);
}

export function getEntrySlug(entryId) {
  return entryId.replace(/^[^/]+\//, '');
}

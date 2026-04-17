import { getCollection } from 'astro:content';
import { sortEntriesByPinnedDate } from '@aither/astro/posts';
import { siteConfig } from '@/config/site';
import type { LocalizedEntry } from '@/lib/posts';
import type { Locale } from '@/i18n';

export type GalleryEntry = LocalizedEntry<'gallery'>;

const galleryPageSize = siteConfig.photosGallery?.paginationSize ?? siteConfig.blog.paginationSize;

export async function getGalleryByLocale(locale: Locale): Promise<GalleryEntry[]> {
  const allEntries = await getCollection('gallery');
  return allEntries
    .filter((entry) => entry.id.startsWith(`${locale}/`))
    .sort(sortEntriesByPinnedDate);
}

export async function getPaginatedGallery(locale: Locale, currentPage: number) {
  const allEntries = await getGalleryByLocale(locale);
  const categories = Array.from(
    new Set(allEntries.map((entry) => entry.data.category).filter(Boolean)),
  );
  const totalPages = Math.max(1, Math.ceil(allEntries.length / galleryPageSize));
  const normalizedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const entries = allEntries.slice(
    (normalizedPage - 1) * galleryPageSize,
    normalizedPage * galleryPageSize,
  );

  return {
    allEntries,
    categories,
    entries,
    totalPages,
    currentPage: normalizedPage,
  };
}

export async function getGalleryPaginationStaticPaths(locale: Locale) {
  const { totalPages } = await getPaginatedGallery(locale, 1);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    params: { num: String(i + 2) },
  }));
}

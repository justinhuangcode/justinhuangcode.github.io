import type { CollectionKey } from 'astro:content';
import { siteConfig, type ContentSection } from '@/config/site';
import { htmlLangs, resolveLocale, type Locale } from '@/i18n';

type SectionIdentifier = ContentSection | CollectionKey | string;

function getSectionId(section: SectionIdentifier): string {
  return typeof section === 'string' ? section : section.id;
}

export function getConfiguredSection(section: SectionIdentifier): ContentSection | undefined {
  const sectionId = getSectionId(section);
  return siteConfig.sections.find(({ id }) => id === sectionId);
}

export function resolveSectionContentLocale(
  section: SectionIdentifier,
  requestedLocale: Locale,
): Locale {
  const configuredSection = getConfiguredSection(section);
  return configuredSection?.contentLocale
    ? resolveLocale(configuredSection.contentLocale)
    : requestedLocale;
}

export function getSectionFallbackLocale(section: SectionIdentifier): Locale | undefined {
  const configuredSection = getConfiguredSection(section);
  return configuredSection?.fallbackLocale
    ? resolveLocale(configuredSection.fallbackLocale)
    : undefined;
}

export function sectionHasFixedContentLocale(section: SectionIdentifier): boolean {
  return Boolean(getConfiguredSection(section)?.contentLocale);
}

export function getSectionContentLang(
  section: SectionIdentifier,
  requestedLocale: Locale,
): string {
  return htmlLangs[resolveSectionContentLocale(section, requestedLocale)];
}

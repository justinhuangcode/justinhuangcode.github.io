import { htmlLangs, type Locale } from '@/i18n';
import { recommendationNotes } from '@/data/recommendation-notes';

export function getLocalizedRecommendationDescription(
  slug: string,
  locale: Locale,
  fallbackDescription?: string,
) {
  return recommendationNotes[slug]?.[locale] ?? fallbackDescription;
}

export function getLocalizedRecommendationDescriptionLang(
  slug: string,
  locale: Locale,
  fallbackLang?: string,
) {
  return recommendationNotes[slug]?.[locale] ? htmlLangs[locale] : fallbackLang;
}

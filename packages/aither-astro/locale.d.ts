import type { AitherLocale } from './constants';

export declare const AITHER_PREFERRED_LOCALE_STORAGE_KEY: 'preferred-locale';
export declare const AITHER_LOCALE_BANNER_DISMISSED_SESSION_KEY: 'locale-banner-dismissed';

export declare function isAitherLocale(value: string): value is AitherLocale;
export declare function resolveAitherLocale(value?: string | null): AitherLocale;
export declare function getAitherLocaleFromUrl(url: URL): AitherLocale;
export declare function getAitherLocaleBasePath(locale: AitherLocale): string;
export declare function stripAitherLocalePrefix(path: string): string;
export declare function getAitherLocalizedPath(
  path: string,
  locale: AitherLocale,
): string;
export declare function detectAitherLocaleFromLanguageTag(
  languageTag: string,
): AitherLocale | null;

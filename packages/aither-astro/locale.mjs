import {
  AITHER_DEFAULT_LOCALE,
  AITHER_LOCALES,
} from './constants.mjs';

export const AITHER_PREFERRED_LOCALE_STORAGE_KEY = 'preferred-locale';
export const AITHER_LOCALE_BANNER_DISMISSED_SESSION_KEY = 'locale-banner-dismissed';

const AITHER_NON_DEFAULT_LOCALES = AITHER_LOCALES.filter(
  (locale) => locale !== AITHER_DEFAULT_LOCALE,
);

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const localePrefixPattern = new RegExp(
  `^\\/(${AITHER_NON_DEFAULT_LOCALES.map(escapeForRegex).join('|')})(?=\\/|$)`,
);

export function isAitherLocale(value) {
  return AITHER_LOCALES.includes(value);
}

export function resolveAitherLocale(value) {
  return value && isAitherLocale(value) ? value : AITHER_DEFAULT_LOCALE;
}

export function getAitherLocaleFromUrl(url) {
  const [, segment] = url.pathname.split('/');
  return resolveAitherLocale(segment);
}

export function getAitherLocaleBasePath(locale) {
  return locale === AITHER_DEFAULT_LOCALE ? '' : `/${locale}`;
}

export function stripAitherLocalePrefix(path) {
  const cleanPath = path.replace(localePrefixPattern, '');
  return cleanPath || '/';
}

export function getAitherLocalizedPath(path, locale) {
  const cleanPath = stripAitherLocalePrefix(path);
  return locale === AITHER_DEFAULT_LOCALE
    ? cleanPath
    : `${getAitherLocaleBasePath(locale)}${cleanPath}`;
}

export function detectAitherLocaleFromLanguageTag(languageTag) {
  const normalizedTag = languageTag.trim().toLowerCase();

  if (!normalizedTag) {
    return null;
  }

  const languageCode = normalizedTag.split('-')[0];
  const defaultLanguageCode = AITHER_DEFAULT_LOCALE.split('-')[0];

  if (languageCode === 'zh') {
    if (
      normalizedTag.includes('tw') ||
      normalizedTag.includes('hk') ||
      normalizedTag.includes('hant')
    ) {
      return 'zh-hant';
    }

    return 'zh-hans';
  }

  if (languageCode === 'ko') return 'ko';
  if (languageCode === 'fr') return 'fr';
  if (languageCode === 'de') return 'de';
  if (languageCode === 'it') return 'it';
  if (languageCode === 'es') return 'es';
  if (languageCode === 'ru') return 'ru';
  if (languageCode === 'id' || languageCode === 'ms') return 'id';
  if (languageCode === 'pt') return 'pt-br';
  if (languageCode === defaultLanguageCode) return AITHER_DEFAULT_LOCALE;

  return null;
}

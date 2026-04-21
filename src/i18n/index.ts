import { en } from './messages/en';
import { zhHans } from './messages/zh-hans';
import { zhHant } from './messages/zh-hant';
import { ko } from './messages/ko';
import {
  defaultLocale as configuredDefaultLocale,
  localeMeta as configuredLocaleMeta,
} from '../../config/locale-meta.mjs';

export type Messages = typeof en;

const messages: Record<string, Messages> = {
  en,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
  ko,
};

const localeMeta = configuredLocaleMeta;

export type Locale = (typeof localeMeta)[number]['code'];
export const locales = localeMeta.map((entry) => entry.code) as readonly Locale[];
export const defaultLocale = configuredDefaultLocale as Locale;
export const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale);
export const preferredLocaleStorageKey = 'aither-preferred-locale';
export const localeBannerDismissedSessionKey = 'aither-locale-banner-dismissed';

function buildLocaleRecord<T>(
  mapper: (entry: (typeof localeMeta)[number]) => T,
): Record<Locale, T> {
  return Object.fromEntries(
    localeMeta.map((entry) => [entry.code, mapper(entry)]),
  ) as Record<Locale, T>;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const localePrefixPattern = new RegExp(
  `^\\/(${nonDefaultLocales.map(escapeForRegex).join('|')})(?=\\/|$)`,
);

export const localeLabels: Record<Locale, string> = {
  ...buildLocaleRecord((entry) => entry.label),
};

export const crispLocales: Record<Locale, string> = buildLocaleRecord(
  (entry) => entry.crispLocale,
);

export const giscusLocales: Record<Locale, string> = buildLocaleRecord(
  (entry) => entry.giscusLocale,
);

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(value: string): Locale {
  const normalized = value.trim().toLowerCase();

  if (isLocale(normalized)) {
    return normalized;
  }

  if (normalized === 'zh' || normalized.startsWith('zh-cn') || normalized.startsWith('zh-sg')) {
    return 'zh-hans';
  }

  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk') || normalized.startsWith('zh-mo')) {
    return 'zh-hant';
  }

  if (normalized.startsWith('ko')) {
    return 'ko';
  }

  if (normalized.startsWith('en')) {
    return 'en';
  }

  return defaultLocale;
}

export function getMessages(locale: string = defaultLocale): Messages {
  return messages[resolveLocale(locale)] ?? en;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  if (segment && locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}

function hasMessageKey<T extends object>(
  messages: T,
  key: string,
): key is Extract<keyof T, string> {
  return Object.prototype.hasOwnProperty.call(messages, key);
}

export function translateTag(key: string, locale: string = 'en'): string {
  const { tags } = getMessages(locale);
  return hasMessageKey(tags, key) ? tags[key] : key;
}

export function translateCategory(key: string, locale: string = 'en'): string {
  const { categories } = getMessages(locale);
  return hasMessageKey(categories, key) ? categories[key] : key;
}

export function translateNav(key: string, locale: string = defaultLocale): string {
  const { nav } = getMessages(locale);
  return hasMessageKey(nav, key) ? nav[key] : key;
}

/** Map internal locale to Intl/BCP-47 locale for date formatting etc. */
export const intlLocales: Record<Locale, string> = buildLocaleRecord(
  (entry) => entry.intl,
);

/** Map internal locale to HTML lang attribute / inLanguage value */
export const htmlLangs: Record<Locale, string> = buildLocaleRecord(
  (entry) => entry.htmlLang,
);

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = stripLocalePrefix(path);
  return locale === defaultLocale ? cleanPath : `${getLocaleBasePath(locale)}${cleanPath}`;
}

export function getLocaleBasePath(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

export function stripLocalePrefix(path: string): string {
  const cleanPath = path.replace(localePrefixPattern, '');
  return cleanPath || '/';
}

export function detectLocaleFromLanguageTag(value: string): Locale {
  return resolveLocale(value);
}

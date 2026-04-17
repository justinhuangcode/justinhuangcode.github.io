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

export function getMessages(locale: string = defaultLocale): Messages {
  return messages[locale] ?? en;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  if (segment && locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}

export function translateTag(key: string, locale: string = 'en'): string {
  const m = getMessages(locale);
  return m.tags[key] ?? key;
}

export function translateCategory(key: string, locale: string = 'en'): string {
  const m = getMessages(locale);
  return m.categories[key] ?? key;
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

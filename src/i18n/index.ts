import { en } from './messages/en';
import { zhHans } from './messages/zh-hans';
import { zhHant } from './messages/zh-hant';
import { ko } from './messages/ko';

export type Messages = typeof en;

const messages: Record<string, Messages> = {
  en,
  'zh-hans': zhHans,
  'zh-hant': zhHant,
  ko,
};

export const locales = ['en', 'zh-hans', 'zh-hant', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const nonDefaultLocales = locales.filter(
  (locale): locale is Exclude<Locale, typeof defaultLocale> => locale !== defaultLocale,
);

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const localePrefixPattern = new RegExp(
  `^\\/(${nonDefaultLocales.map(escapeForRegex).join('|')})(?=\\/|$)`,
);

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-hans': '简体中文',
  'zh-hant': '繁體中文',
  ko: '한국어',
};

export function getMessages(locale: string = 'en'): Messages {
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
export const intlLocales: Record<Locale, string> = {
  en: 'en-US',
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
  ko: 'ko-KR',
};

/** Map internal locale to HTML lang attribute / inLanguage value */
export const htmlLangs: Record<Locale, string> = {
  en: 'en',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
  ko: 'ko',
};

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

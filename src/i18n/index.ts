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
  return 'en';
}

export function translateTag(key: string, locale: string = 'en'): string {
  const m = getMessages(locale);
  return m.tags[key] ?? key;
}

export function translateCategory(key: string, locale: string = 'en'): string {
  const m = getMessages(locale);
  return m.categories[key] ?? key;
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove any existing locale prefix
  const localePattern = locales.filter(l => l !== 'en').join('|');
  const cleanPath = path.replace(new RegExp(`^\\/(${localePattern})`), '') || '/';
  if (locale === 'en') return cleanPath;
  return `/${locale}${cleanPath}`;
}

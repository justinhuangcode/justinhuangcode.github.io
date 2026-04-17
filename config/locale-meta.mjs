export const localeMeta = /** @type {const} */ ([
  {
    code: 'en',
    label: 'English',
    intl: 'en-US',
    htmlLang: 'en',
  },
  {
    code: 'zh-hans',
    label: '简体中文',
    intl: 'zh-CN',
    htmlLang: 'zh-Hans',
  },
  {
    code: 'zh-hant',
    label: '繁體中文',
    intl: 'zh-TW',
    htmlLang: 'zh-Hant',
  },
  {
    code: 'ko',
    label: '한국어',
    intl: 'ko-KR',
    htmlLang: 'ko',
  },
]);

export const defaultLocale = 'en';
export const locales = localeMeta.map((entry) => entry.code);

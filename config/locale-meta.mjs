export const localeMeta = /** @type {const} */ ([
  {
    code: 'en',
    label: 'English',
    intl: 'en-US',
    htmlLang: 'en',
    crispLocale: 'en',
    giscusLocale: 'en',
  },
  {
    code: 'zh-hans',
    label: '简体中文',
    intl: 'zh-CN',
    htmlLang: 'zh-Hans',
    crispLocale: 'zh',
    giscusLocale: 'zh-CN',
  },
  {
    code: 'zh-hant',
    label: '繁體中文',
    intl: 'zh-TW',
    htmlLang: 'zh-Hant',
    crispLocale: 'zh',
    giscusLocale: 'zh-TW',
  },
  {
    code: 'ko',
    label: '한국어',
    intl: 'ko-KR',
    htmlLang: 'ko',
    crispLocale: 'ko',
    giscusLocale: 'ko',
  },
]);

export const defaultLocale = 'en';
export const locales = localeMeta.map((entry) => entry.code);

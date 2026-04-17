import type { Locale } from '@/i18n';

interface TranslationUiCopy {
  shelfEyebrow: string;
  shelfTitle: string;
  shelfDescription: string;
  shelfNote: string;
  detailEyebrow: string;
  contentLanguageLabel: string;
  contentLanguageValue: string;
  originalLanguageLabel: string;
  originalTitleLabel: string;
  originalLinkLabel: string;
  originalLinkAction: string;
  translatorLabel: string;
}

const enCopy: TranslationUiCopy = {
  shelfEyebrow: 'Translation shelf',
  shelfTitle: 'Published in Simplified Chinese',
  shelfDescription:
    'This section keeps the surrounding interface in your selected site language, while every translated piece is edited and published in Simplified Chinese.',
  shelfNote: 'Switching the site language changes the interface only.',
  detailEyebrow: 'Translation context',
  contentLanguageLabel: 'Content language',
  contentLanguageValue: 'Simplified Chinese',
  originalLanguageLabel: 'Source language',
  originalTitleLabel: 'Original title',
  originalLinkLabel: 'Original link',
  originalLinkAction: 'Read original',
  translatorLabel: 'Translator',
};

const zhHansCopy: TranslationUiCopy = {
  shelfEyebrow: '翻译栏目',
  shelfTitle: '本栏目固定发布简体中文译文',
  shelfDescription:
    '站点界面会跟随你的语言设置变化，但这里的译文正文统一以简体中文编辑与发布。',
  shelfNote: '切换站点语言只会改变界面，不会改变译文正文。',
  detailEyebrow: '译文信息',
  contentLanguageLabel: '正文语言',
  contentLanguageValue: '简体中文',
  originalLanguageLabel: '原文语言',
  originalTitleLabel: '原文标题',
  originalLinkLabel: '原文链接',
  originalLinkAction: '查看原文',
  translatorLabel: '译者',
};

const zhHantCopy: TranslationUiCopy = {
  shelfEyebrow: '翻譯欄目',
  shelfTitle: '本欄目固定發布簡體中文譯文',
  shelfDescription:
    '站點介面會跟隨你的語言設定變化，但這裡的譯文正文統一以簡體中文編輯與發布。',
  shelfNote: '切換站點語言只會改變介面，不會改變譯文正文。',
  detailEyebrow: '譯文資訊',
  contentLanguageLabel: '正文語言',
  contentLanguageValue: '簡體中文',
  originalLanguageLabel: '原文語言',
  originalTitleLabel: '原文標題',
  originalLinkLabel: '原文連結',
  originalLinkAction: '查看原文',
  translatorLabel: '譯者',
};

export function getTranslationsUiCopy(locale: Locale): TranslationUiCopy {
  if (locale === 'zh-hans') return zhHansCopy;
  if (locale === 'zh-hant') return zhHantCopy;
  return enCopy;
}

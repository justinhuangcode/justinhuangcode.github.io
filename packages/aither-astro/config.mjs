import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { AITHER_DEFAULT_LOCALE, AITHER_LOCALES } from './constants.mjs';
import { aitherMarkdownConfig } from './markdown.mjs';

export function aitherConfig(options = {}) {
  const {
    defaultLocale = AITHER_DEFAULT_LOCALE,
    locales = AITHER_LOCALES,
    prefixDefaultLocale = false,
  } = options;

  return {
    integrations: [react(), astroExpressiveCode(), mdx(), sitemap()],
    i18n: {
      defaultLocale,
      locales: [...locales],
      routing: {
        prefixDefaultLocale,
      },
    },
    markdown: aitherMarkdownConfig(),
    vite: {
      plugins: [tailwindcss()],
    },
  };
}

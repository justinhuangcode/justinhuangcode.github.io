import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, locales } from './config/locale-meta.mjs';

export default defineConfig({
  site: 'https://justinhuangai.github.io',
  integrations: [react(), mdx(), sitemap()],
  i18n: {
    defaultLocale,
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

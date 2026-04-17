import { defineConfig } from 'astro/config';
import aither from '@aither/astro';
import { defaultLocale, locales } from './config/locale-meta.mjs';

export default defineConfig({
  site: 'https://justinhuangai.github.io',
  vite: {
    build: {
      // Markmap is intentionally lazy-loaded into a larger isolated chunk.
      chunkSizeWarningLimit: 650,
    },
  },
  integrations: [aither({ defaultLocale, locales, prefixDefaultLocale: false })],
});

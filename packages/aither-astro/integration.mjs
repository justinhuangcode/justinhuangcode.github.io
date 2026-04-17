import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { AITHER_DEFAULT_LOCALE, AITHER_LOCALES } from './constants.mjs';
import { aitherMarkdownConfig } from './markdown.mjs';

const BUNDLED_INTEGRATION_FACTORIES = [
  ['@astrojs/react', react],
  ['astro-expressive-code', astroExpressiveCode],
  ['@astrojs/mdx', mdx],
  ['@astrojs/sitemap', sitemap],
];

export function aither(options = {}) {
  const {
    defaultLocale = AITHER_DEFAULT_LOCALE,
    locales = AITHER_LOCALES,
    prefixDefaultLocale = false,
  } = options;

  return {
    name: '@aither/astro',
    hooks: {
      'astro:config:setup'({ config, logger, updateConfig }) {
        const activeIntegrationNames = new Set(
          (config.integrations ?? []).map((integration) => integration.name),
        );

        if (
          activeIntegrationNames.has('@astrojs/mdx') &&
          !activeIntegrationNames.has('astro-expressive-code')
        ) {
          throw new Error(
            '@aither/astro requires astro-expressive-code to run before @astrojs/mdx. ' +
              'Remove your manual mdx() integration and let aither() manage the markdown stack, ' +
              'or add astroExpressiveCode() before mdx().',
          );
        }

        const integrations = [];
        const skipped = [];

        for (const [name, createIntegration] of BUNDLED_INTEGRATION_FACTORIES) {
          if (activeIntegrationNames.has(name)) {
            skipped.push(name);
            continue;
          }
          integrations.push(createIntegration());
        }

        updateConfig({
          integrations,
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
        });

        if (skipped.length > 0) {
          logger.info(
            `@aither/astro reused existing integrations: ${skipped.join(', ')}`,
          );
        }
      },
    },
  };
}

export default aither;

# @aither/astro

`@aither/astro` is the shared Astro integration layer behind Aither.

It packages the stable parts of the theme into a reusable npm package:

- Astro integration defaults
- markdown authoring defaults for code, math, and diagram blocks
- locale and routing helpers
- content schema helpers
- site config contracts
- agent protocol and site-content runtime builders

If you want the full Aither site, use the starter repository. If you want the reusable integration layer for an Astro project, install this package.

## Install

```bash
pnpm add @aither/astro astro
```

Add the integration in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import aither from '@aither/astro';

export default defineConfig({
  site: 'https://example.com',
  integrations: [aither()],
});
```

Best practice: let `aither()` own the markdown stack. Do not add `mdx()` separately unless you also manage `astro-expressive-code` ordering yourself.

## What It Includes

- `aither()` integration that wires up `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, Expressive Code, Tailwind Vite, and Astro i18n defaults
- shared markdown defaults for line-numbered code blocks, KaTeX math, Mermaid diagrams, and preprocessed `markmap` blocks
- shared locale constants and routing helpers
- shared content schema utilities
- shared site config typing
- shared post, site-content, and agent protocol helpers

## Exports

- `@aither/astro` -> `aither()` integration
- `@aither/astro/config` -> `aitherConfig()` helper
- `@aither/astro/constants` -> shared locale, engine, and service-locale constants
- `@aither/astro/locale` -> shared locale routing and detection helpers
- `@aither/astro/content` -> shared content schema helpers
- `@aither/astro/markdown` -> shared markdown plugin stack for math, Mermaid, and Markmap
- `@aither/astro/agent-protocol` -> shared agent protocol builders
- `@aither/astro/posts` -> shared locale-aware content collection helpers
- `@aither/astro/site` -> shared site config contract
- `@aither/astro/site-content` -> shared content and machine-doc response builders

## Starter Vs Package

Use the starter repository when you want the full Aither site structure, sample content, pages, and deployment setup.

Use `@aither/astro` when you want the reusable shared layer in your own Astro project and prefer to keep content, routes, and site-owned values in your app.

If your content uses Mermaid diagrams in CI, install Chromium before building:

```bash
pnpm exec playwright install --with-deps chromium
```

## Node And Astro Support

- Node: `^20.19.1 || >=22.12.0`
- Astro: `^6.0.0`

## License

MIT

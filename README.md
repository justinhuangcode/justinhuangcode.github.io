# Aither

**English** | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[Live Preview](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## Why Aither?

Good writing deserves good typography. Most themes bury your words under hero images, animations, and UI chrome. Aither takes the opposite approach -- it lets text be the design.

Clean sans-serif typography with Bricolage Grotesque headings, a carefully tuned reading rhythm, and a layout that stays out of your way. Everything serves one goal: making your writing look and feel beautiful.

## Features

- **Sans-serif typography** -- Bricolage Grotesque headings paired with system-ui body text and CJK-aware fallbacks (PingFang SC, Microsoft YaHei), consistent across macOS, Windows, Linux, and Android
- **Dark mode** -- Light / Dark / System toggle with localStorage persistence, animated via the View Transitions API circular reveal
- **Tailwind CSS v4** -- Utility-first styling with `@theme` design tokens, easy to customize
- **11-language i18n** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **Dynamic OG images** -- Auto-generated Open Graph images per post via Satori + resvg-js
- **Giscus comments** -- GitHub Discussions-powered comments on every post
- **Crisp chat** -- Optional live chat widget via Crisp
- **Categories and tags** -- Organize posts with categories and optional tags
- **Pinned posts** -- Set `pinned: true` in frontmatter to feature posts at the top
- **Pagination** -- Configurable page size for blog listing
- **Table of contents** -- Auto-generated from post headings
- **Author info** -- Configurable author name and avatar displayed on posts
- **AI-native endpoints** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json`, and per-post `.md` endpoints for LLM discoverability
- **RSS feed** -- Built-in `/rss.xml` via `@astrojs/rss`
- **Sitemap** -- Auto-generated via `@astrojs/sitemap`
- **SEO** -- Open Graph meta tags, canonical URLs, per-post descriptions, OpenSearch
- **Responsive** -- Mobile-friendly layout that preserves reading rhythm across screen sizes
- **Google Analytics** -- Optional, zero-config via `PUBLIC_GA_ID` env var
- **Astro Content Collections** -- Type-safe Markdown posts with Zod schema validation
- **GitHub Pages** -- CI/CD workflow included for automatic deployment

## Quick Start

### Use as a GitHub template

1. Click **"Use this template"** on [GitHub](https://github.com/justinhuangcode/astro-theme-aither)
2. Clone your new repo:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. Install dependencies:

```bash
pnpm install
```

4. Configure your site:

```bash
# astro.config.mjs -- set your site URL
site: 'https://your-domain.com'

# src/config/site.ts -- set name, description, social links, nav, footer
```

5. Set up environment variables (optional):

```bash
cp .env.example .env
# Edit .env with your values (GA, Giscus, Crisp)
```

6. Start writing:

```bash
pnpm dev
```

7. Deploy: push to `main`, GitHub Actions builds and deploys automatically.

### Manual setup

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## Post Format

Create Markdown files in `src/content/posts/{locale}/`:

```markdown
---
title: Your Post Title
date: 2026-01-01
description: Optional description for SEO
category: Technology
tags: [optional, tags]
pinned: false
image: ./optional-cover.jpg
---

Your content here.
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | string | Yes | -- | Post title |
| `date` | date | Yes | -- | Publication date (YYYY-MM-DD) |
| `description` | string | No | -- | Used in RSS feed and meta tags |
| `category` | string | No | `"General"` | Post category |
| `tags` | string[] | No | -- | Post tags |
| `pinned` | boolean | No | `false` | `true` features post at top of listing |
| `image` | image | No | -- | Cover image (relative path or import) |

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start local dev server |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview production build locally |

## Configuration

### Site settings (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // Import from src/assets/ for optimization, or use URL string
  },
  url: 'https://your-domain.com',
  social: [
    { title: 'GitHub', href: 'https://github.com/...', icon: 'github' },
    { title: 'Twitter', href: '#', icon: 'x' },
  ],
  blog: { paginationSize: 20 },
  analytics: { googleAnalyticsId: import.meta.env.PUBLIC_GA_ID || '' },
  crisp: { websiteId: import.meta.env.PUBLIC_CRISP_WEBSITE_ID || '' },
  ui: { defaultMode: 'dark', enableModeSwitch: true },
  giscus: { repo: '...', repoId: '...', category: '...', categoryId: '...' },
  nav: [
    { labelKey: 'blog', href: '/' },
    { labelKey: 'about', href: '/about' },
  ],
  footer: { copyrightYear: 'auto', sections: [/* ... */] },
};
```

### Astro config (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### Environment variables (`.env`)

```bash
# Google Analytics (leave empty to disable)
PUBLIC_GA_ID=

# Crisp Chat (leave empty to disable)
PUBLIC_CRISP_WEBSITE_ID=

# Giscus Comments (leave all empty to disable)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

Language config is in `src/i18n/index.ts`, translations in `src/i18n/messages/*.ts`.

| Code | Language |
|---|---|
| `en` | English (default) |
| `zh-cn` | 简体中文 |
| `zh-tw` | 繁體中文 |
| `ko` | 한국어 |
| `fr` | Français |
| `de` | Deutsch |
| `it` | Italiano |
| `es` | Español |
| `ru` | Русский |
| `id` | Bahasa Indonesia |
| `pt-br` | Português (BR) |

The default locale (`en`) has no URL prefix. Other locales use their code as prefix (e.g. `/zh-cn/`, `/ko/`).

## Project Structure

```
src/
├── config/
│   └── site.ts              # Site name, social links, nav, footer, analytics, Giscus, Crisp
├── content.config.ts         # Content Collections schema (Zod)
├── i18n/
│   ├── index.ts              # Locale definitions, getMessages(), routing helpers
│   └── messages/             # Translation files (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # Global layout (head, nav, theme switcher, analytics)
├── components/
│   ├── Navbar.astro          # Bootstrap 3-style gradient navbar
│   ├── BlogGrid.astro        # Post grid with pagination
│   ├── BlogCard.astro        # Post card with category, tags, date
│   ├── TableOfContents.astro # Auto-generated TOC from headings
│   ├── AuthorInfo.astro      # Author name and avatar
│   ├── Giscus.astro          # GitHub Discussions comments
│   ├── Crisp.astro           # Crisp chat widget
│   ├── Analytics.astro       # Google Analytics script
│   ├── Prose.astro           # Typography wrapper for post content
│   └── react/                # React components (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # Home (English, default locale)
│   ├── about.astro           # About page
│   ├── page/                 # Paginated blog listing
│   ├── posts/
│   │   ├── [slug].astro      # Post detail (English)
│   │   └── [slug].md.ts      # Per-post Markdown endpoint for AI
│   ├── og/
│   │   ├── index.png.ts      # Dynamic OG image for home
│   │   └── [...slug].png.ts  # Dynamic OG image per post
│   ├── rss.xml.ts            # RSS feed
│   ├── llms.txt.ts           # AI-agent-friendly llms.txt
│   ├── llms-full.txt.ts      # Full content for LLMs
│   ├── skill.md.ts           # AI skill descriptor
│   ├── api/
│   │   └── posts.json.ts     # JSON API for posts
│   ├── zh-cn/              # Simplified Chinese pages
│   ├── zh-tw/              # Traditional Chinese pages
│   └── {locale}/             # Pages for each supported locale
├── content/
│   └── posts/
│       ├── en/*.md           # English posts (default locale)
│       └── {locale}/*.md     # Posts for each supported locale
└── styles/
    └── global.css            # Tailwind CSS v4 @theme tokens + base styles
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    ├── deploy-github-pages.yml     # GitHub Pages deployment (default)
```

## Deployment

### GitHub Pages (default)

The included workflow (`.github/workflows/deploy-github-pages.yml`) deploys automatically:

1. Go to your repo **Settings** > **Pages** > **Source**: select **GitHub Actions**
2. Update `site` in `astro.config.mjs` to your GitHub Pages URL
3. Push to `main` -- the site deploys automatically

### Other platforms

Since the output is static HTML in `dist/`, you can deploy anywhere:

```bash
pnpm build
# Upload dist/ to Netlify, Vercel, or any static host
```

## Design Philosophy

1. **Typography is the design** -- Sans-serif headings in Bricolage Grotesque, clean body text in system-ui, and a carefully tuned reading rhythm. The typeface *is* the visual identity.
2. **Text is beautiful** -- Well-set text on a quiet page is the most elegant interface.
3. **Works everywhere** -- Cross-platform font stacks with CJK-aware fallbacks (PingFang SC, Microsoft YaHei). No web font loading delays, no layout shift.
4. **AI-native** -- First-class LLM discoverability with llms.txt, structured endpoints, and machine-readable content.
5. **Crafted, not complex** -- Tailwind CSS v4 `@theme` design tokens make customization straightforward. One config file (`src/config/site.ts`) controls the entire site.

## Acknowledgments

Inspired by [yinwang.org](https://www.yinwang.org).

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)

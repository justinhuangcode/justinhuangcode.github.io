# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | **Deutsch** | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-cloudflare-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[Live-Vorschau](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## Warum Aither?

Gutes Schreiben verdient gute Typografie. Die meisten Themes begraben Ihre Worte unter Hero-Bildern, Animationen und UI-Dekoration. Aither geht den umgekehrten Weg — es lässt den Text das Design sein.

Klare serifenlose Typografie mit Bricolage Grotesque-Überschriften, ein sorgfältig abgestimmter Lesefluss und ein Layout, das nicht im Weg steht. Alles dient einem Ziel: Ihr Schreiben schön aussehen und sich schön lesen zu lassen.

## Funktionen

- **Serifenlose Typografie** -- Bricolage Grotesque-Überschriften mit system-ui-Fließtext und CJK-bewussten Fallbacks (PingFang SC, Microsoft YaHei), konsistent auf macOS, Windows, Linux und Android
- **Dunkelmodus** -- Hell / Dunkel / System-Umschaltung mit localStorage-Persistenz, animiert über die View Transitions API (kreisförmige Enthüllung)
- **Tailwind CSS v4** -- Utility-first-Styling mit `@theme`-Design-Tokens, einfach anzupassen
- **11 Sprachen i18n** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **Dynamische OG-Bilder** -- Automatisch generierte Open Graph-Bilder pro Beitrag via Satori + resvg-js
- **Giscus-Kommentare** -- Kommentarsystem basierend auf GitHub Discussions
- **Crisp-Chat** -- Optionales Live-Chat-Widget via Crisp
- **Kategorien und Tags** -- Beiträge mit Kategorien und optionalen Tags organisieren
- **Angeheftete Beiträge** -- `pinned: true` im Frontmatter setzt Beiträge an die Spitze
- **Paginierung** -- Konfigurierbare Seitengröße für die Blog-Liste
- **Inhaltsverzeichnis** -- Automatisch aus den Überschriften des Beitrags generiert
- **Autoreninfo** -- Konfigurierbarer Autorenname und Avatar
- **AI-native Endpunkte** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json` und `.md`-Endpunkte pro Beitrag
- **RSS-Feed** -- Integriertes `/rss.xml` via `@astrojs/rss`
- **Sitemap** -- Automatisch generiert via `@astrojs/sitemap`
- **SEO** -- Open Graph-Meta-Tags, kanonische URLs, Beschreibungen pro Beitrag, OpenSearch
- **Responsive** -- Mobilfreundliches Layout, das den Lesefluss über alle Bildschirmgrößen bewahrt
- **Google Analytics** -- Optional, Zero-Config via Umgebungsvariable `PUBLIC_GA_ID`
- **Astro Content Collections** -- Typsichere Markdown-Beiträge mit Zod-Schema-Validierung
- **GitHub Pages** -- CI/CD-Workflow für automatisches Deployment enthalten

## Schnellstart

### Als GitHub-Template verwenden

1. Klicken Sie auf **"Use this template"** auf [GitHub](https://github.com/justinhuangcode/astro-theme-aither)
2. Klonen Sie Ihr neues Repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. Abhängigkeiten installieren:

```bash
pnpm install
```

4. Konfigurieren Sie Ihre Seite:

```bash
# astro.config.mjs -- Ihre Site-URL festlegen
site: 'https://your-domain.com'

# src/config/site.ts -- Name, Beschreibung, Social Links, Navigation, Footer festlegen
```

5. Umgebungsvariablen einrichten (optional):

```bash
cp .env.example .env
# .env mit Ihren Werten bearbeiten (GA, Giscus, Crisp)
```

6. Schreiben beginnen:

```bash
pnpm dev
```

7. Deployment: Pushen Sie nach `main`, GitHub Actions baut und deployed automatisch.

### Manuelle Installation

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## Beitragsformat

Erstellen Sie Markdown-Dateien in `src/content/posts/{locale}/`:

```markdown
---
title: Ihr Beitragstitel
date: 2026-01-01
description: Optionale Beschreibung für SEO
category: Technology
tags: [optional, tags]
pinned: false
image: ./optional-cover.jpg
---

Ihr Inhalt hier.
```

| Feld | Typ | Erforderlich | Standard | Beschreibung |
|---|---|---|---|---|
| `title` | string | Ja | -- | Beitragstitel |
| `date` | date | Ja | -- | Veröffentlichungsdatum (JJJJ-MM-TT) |
| `description` | string | Nein | -- | Für RSS-Feed und Meta-Tags |
| `category` | string | Nein | `"General"` | Beitragskategorie |
| `tags` | string[] | Nein | -- | Beitrags-Tags |
| `pinned` | boolean | Nein | `false` | `true` heftet den Beitrag an die Spitze |
| `image` | image | Nein | -- | Titelbild (relativer Pfad oder Import) |

## Befehle

| Befehl | Beschreibung |
|---|---|
| `pnpm dev` | Lokalen Entwicklungsserver starten |
| `pnpm build` | Statische Seite in `dist/` bauen |
| `pnpm preview` | Produktionsbuild lokal vorschauen |

## Konfiguration

### Site-Einstellungen (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // Aus src/assets/ importieren für Optimierung, oder URL-String verwenden
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

### Astro-Konfiguration (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Erforderlich für RSS und Sitemap
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### Umgebungsvariablen (`.env`)

```bash
# Google Analytics (leer lassen zum Deaktivieren)
PUBLIC_GA_ID=

# Crisp-Chat (leer lassen zum Deaktivieren)
PUBLIC_CRISP_WEBSITE_ID=

# Giscus-Kommentare (alle leer lassen zum Deaktivieren)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

Sprachkonfiguration in `src/i18n/index.ts`, Übersetzungen in `src/i18n/messages/*.ts`.

| Code | Sprache |
|---|---|
| `en` | English (Standard) |
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

Die Standard-Locale (`en`) hat kein URL-Präfix. Andere Locales verwenden ihren Code als Präfix (z.B. `/de/`, `/ko/`).

## Projektstruktur

```
src/
├── config/
│   └── site.ts              # Site-Name, Social Links, Navigation, Footer, Analytics, Giscus, Crisp
├── content.config.ts         # Content Collections Schema (Zod)
├── i18n/
│   ├── index.ts              # Locale-Definitionen, getMessages(), Routing-Helpers
│   └── messages/             # Übersetzungsdateien (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # Globales Layout (Head, Navigation, Theme-Wechsler, Analytics)
├── components/
│   ├── Navbar.astro          # Bootstrap 3-Stil Gradient-Navbar
│   ├── BlogGrid.astro        # Beitrags-Grid mit Paginierung
│   ├── BlogCard.astro        # Beitragskarte mit Kategorie, Tags, Datum
│   ├── TableOfContents.astro # Auto-generiertes Inhaltsverzeichnis
│   ├── AuthorInfo.astro      # Autorenname und Avatar
│   ├── Giscus.astro          # GitHub Discussions Kommentare
│   ├── Crisp.astro           # Crisp Chat-Widget
│   ├── Analytics.astro       # Google Analytics Script
│   ├── Prose.astro           # Typografie-Wrapper für Beitragsinhalte
│   └── react/                # React-Komponenten (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # Startseite (English, Standard-Locale)
│   ├── about.astro           # Über-Seite
│   ├── page/                 # Paginierte Blog-Liste
│   ├── posts/
│   │   ├── [slug].astro      # Beitragsdetail (English)
│   │   └── [slug].md.ts      # Markdown-Endpunkt pro Beitrag für AI
│   ├── og/                   # Dynamische OG-Bildgenerierung
│   ├── rss.xml.ts            # RSS-Feed
│   ├── llms.txt.ts           # AI-Agent-freundliches llms.txt
│   ├── llms-full.txt.ts      # Vollständiger Inhalt für LLMs
│   ├── skill.md.ts           # AI-Skill-Deskriptor
│   ├── api/
│   │   └── posts.json.ts     # JSON-API für Beiträge
│   └── {locale}/             # Seiten für jede unterstützte Locale
├── content/
│   └── posts/
│       ├── en/*.md           # English-Beiträge (Standard-Locale)
│       └── {locale}/*.md     # Beiträge für jede unterstützte Locale
└── styles/
    └── global.css            # Tailwind CSS v4 @theme-Tokens + Basis-Styles
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-cloudflare-pages.yml     # GitHub Pages Deployment (Standard)
```

## Deployment

### GitHub Pages (Standard)

Der enthaltene Workflow (`.github/workflows/deploy-cloudflare-pages.yml`) deployed automatisch:

1. Gehen Sie zu **Settings** > **Pages** > **Source**: wählen Sie **GitHub Actions**
2. Aktualisieren Sie `site` in `astro.config.mjs` mit Ihrer GitHub Pages URL
3. Pushen Sie nach `main` — die Seite wird automatisch deployed

### Andere Plattformen

Die Ausgabe ist statisches HTML in `dist/`, überall deploybar:

```bash
pnpm build
# Laden Sie dist/ auf Netlify, Vercel oder einen beliebigen statischen Host hoch
```

## Design-Philosophie

1. **Typografie ist das Design** -- Serifenlose Überschriften in Bricolage Grotesque, klarer Fließtext in system-ui und ein sorgfältig abgestimmter Lesefluss. Die Schrift *ist* die visuelle Identität.
2. **Text ist schön** -- Gut gesetzter Text auf einer ruhigen Seite ist das eleganteste Interface.
3. **Funktioniert überall** -- Plattformübergreifende Schriftstapel mit CJK-bewussten Fallbacks (PingFang SC, Microsoft YaHei). Keine Ladezeiten für Web-Schriften, kein Layout-Shift.
4. **AI-nativ** -- Erstklassige LLM-Auffindbarkeit mit llms.txt, strukturierten Endpunkten und maschinenlesbarem Inhalt.
5. **Raffiniert, nicht komplex** -- Tailwind CSS v4 `@theme`-Design-Tokens machen die Anpassung einfach. Eine Konfigurationsdatei (`src/config/site.ts`) steuert die gesamte Seite.

## Danksagung

Inspiriert von [yinwang.org](https://www.yinwang.org).

## Mitwirken

Beiträge sind willkommen. Bitte öffnen Sie zuerst ein Issue, um zu besprechen, was Sie ändern möchten.

## Lizenz

[MIT](LICENSE)

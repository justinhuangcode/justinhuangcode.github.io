---
title: 👋 Hello World
date: 2026-01-01
category: Tutorial
description: Willkommen bei Astro-Theme-Aither — ein Blog-Theme, bei dem Typografie das Design bestimmt
tags: [Hello, Astro]
pinned: true
---

Willkommen bei Astro-Theme-Aither.

Dieses Blog-Theme basiert auf einer Überzeugung: Gutes Schreiben verdient gute Typografie. Serifenschriften für Überschriften, ein sauberer Lesefluss und ein Layout, das sich zurückhält. Alles hier dient einem einzigen Ziel — Ihre Worte schön aussehen und sich gut anfühlen zu lassen.

## Warum noch ein Blog-Theme

Das Web ist voller Blog-Themes, also ist die Frage berechtigt: Warum noch eines? Die Antwort liegt in den Prioritäten. Die meisten Themes optimieren für visuellen Impact. Astro-Theme-Aither startet von einer anderen Prämisse. Der Inhalt ist das Produkt.

Diese Philosophie erstreckt sich auf die technischen Entscheidungen. Das Theme liefert etwa 0,5 KB clientseitiges JavaScript — gerade genug für den Theme-Umschalter. Alles andere ist statisches HTML und CSS.

## Erste Schritte

1. **Repository klonen** — GitHub-Template-Button oder `git clone`
2. **Abhängigkeiten installieren** — `pnpm install`
3. **Site konfigurieren** — `src/config/site.ts` bearbeiten
4. **Beispielinhalt ersetzen** — eigene Markdown-Dateien in `src/content/posts/`
5. **Entwickeln** — `pnpm dev`
6. **Deployen** — Push zu GitHub, CI-Workflow übernimmt Deployment zu Cloudflare Pages

### Projektstruktur

```
src/
├── components/     # Wiederverwendbare Astro-Komponenten
├── config/         # Site-Konfiguration
├── content/        # Markdown-Posts und Inhalte
├── layouts/        # Seitenlayouts (Layout.astro)
├── pages/          # Routenseiten
└── styles/         # Globales CSS mit Tailwind v4 Tokens
```

## Was Sie bekommen

### Content-Features

- **RSS-Feed** — automatisch generiert unter `/rss.xml`
- **Sitemap** — auto-generiert via `@astrojs/sitemap`
- **SEO-Meta-Tags** — Open Graph, Twitter Cards, kanonische URLs
- **Dark Mode** — Drei-Wege-Umschalter (Hell / Dunkel / System)

### Entwickler-Features

- **TypeScript throughout** — strikter Modus, vollständig typisierte Komponenten
- **Content Collections** — typsicheres Markdown mit Frontmatter-Validierung
- **Tailwind CSS v4** — `@theme` Design Tokens
- **Vitest + Playwright** — Unit- und E2E-Tests im CI integriert
- **Cloudflare Pages** — automatische PR-Vorschau-URLs

## Design-Philosophie

Die visuelle Einfachheit dieses Themes ist beabsichtigt, unterscheidet sich aber von technischer Einfachheit. Unter der Haube behandelt das Theme überraschend viele Aspekte: responsive Typografie, barrierefreie Farbkontraste, korrekte semantische HTML-Struktur.

Gutes Design ist unsichtbar. Wenn Sie einen Artikel lesen und das Theme gar nicht bemerken — dann funktioniert das Design genau wie beabsichtigt.

Viel Freude beim Schreiben.

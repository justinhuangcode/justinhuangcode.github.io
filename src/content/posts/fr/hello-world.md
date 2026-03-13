---
title: 👋 Hello World
date: 2026-01-01
category: Tutorial
description: Bienvenue dans Astro-Theme-Aither — un thème de blog où la typographie guide le design
tags: [Hello, Astro]
pinned: true
---

Bienvenue dans Astro-Theme-Aither.

Ce thème repose sur une conviction : une bonne écriture mérite une bonne typographie. Des titres sérifs, un rythme de lecture fluide et une mise en page qui s'efface. Tout ici sert un seul objectif — donner à vos mots la beauté qu'ils méritent.

## Pourquoi un autre thème de blog

Le web regorge de thèmes, et il est donc légitime de se demander pourquoi en créer un nouveau. La réponse tient aux priorités. La plupart des thèmes optimisent l'impact visuel — grandes images d'en-tête, mises en page complexes, transitions animées. C'est saisissant en démo, mais gênant quand quelqu'un s'assoit pour lire un article de 2 000 mots.

Astro-Theme-Aither part d'une prémisse différente. Le contenu est le produit. Le rôle du thème est de présenter ce contenu avec le soin qu'il mérite : des associations typographiques réfléchies, des espaces généreux et un rythme vertical qui rend la lecture longue confortable plutôt qu'épuisante.

Cette philosophie s'étend aux choix techniques. Le thème envoie environ 0,5 Ko de JavaScript côté client — juste assez pour le commutateur de thème. Tout le reste est du HTML et CSS statiques.

## Démarrage

La mise en route prend quelques minutes :

1. **Cloner le dépôt** — utilisez le bouton template GitHub ou clonez directement avec `git clone`
2. **Installer les dépendances** — exécutez `pnpm install`
3. **Configurer votre site** — éditez `src/config/site.ts`
4. **Remplacer le contenu** — remplacez les articles dans `src/content/posts/` par vos propres fichiers Markdown
5. **Développer** — lancez `pnpm dev`
6. **Déployer** — poussez sur GitHub et le workflow CI intégré gère le déploiement sur Cloudflare Pages

### Structure du projet

```
src/
├── components/     # Composants Astro réutilisables
├── config/         # Configuration du site
├── content/        # Vos articles et contenus Markdown
├── layouts/        # Mises en page (Layout.astro)
├── pages/          # Pages de routes
└── styles/         # CSS global avec tokens Tailwind v4
```

### Écrire votre premier article

Créez un nouveau fichier `.md` dans `src/content/posts/` avec le frontmatter suivant :

```markdown
---
title: Titre de l'article
date: 2026-01-15
category: General
description: Un bref résumé pour le SEO et les aperçus sociaux
tags: [Sujet, Autre]
---

Votre contenu commence ici.
```

## Ce que vous obtenez

### Fonctionnalités de contenu

- **Flux RSS** — généré automatiquement à `/rss.xml`
- **Plan du site** — auto-généré via `@astrojs/sitemap`
- **Balises SEO** — Open Graph, Twitter Cards, URLs canoniques
- **Mode sombre** — commutateur à trois positions (Clair / Sombre / Système)
- **Pages catégories et tags** — archives organisées par sujet

### Fonctionnalités développeur

- **TypeScript strict** — composants et utilitaires entièrement typés
- **Content Collections** — Markdown type-safe avec validation du frontmatter
- **Tailwind CSS v4** — tokens de design via `@theme`
- **Vitest + Playwright** — tests unitaires et E2E intégrés au CI
- **Cloudflare Pages** — URLs de prévisualisation automatiques
- **Google Analytics** — optionnel, isolé dans un Web Worker Partytown

## Philosophie de design

La simplicité visuelle de ce thème est intentionnelle, mais elle diffère de la simplicité d'ingénierie. Sous le capot, le thème gère de nombreuses préoccupations : typographie responsive, contrastes de couleurs accessibles, structure HTML sémantique correcte et attention portée à l'expérience de lecture.

Bon design signifie design invisible. Quand vous lisez un article sur ce thème sans même le remarquer — c'est que le design fonctionne exactement comme prévu.

Bonne écriture.

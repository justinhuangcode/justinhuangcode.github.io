---
title: ✨ Pourquoi Astro-Theme-Aither
date: 2026-01-03
category: Design
description: Un thème Astro AI-natif qui croit que le texte est beau en soi.
tags: [Design, Astro]
pinned: true
---

Un thème Astro AI-natif qui croit que le texte est beau en soi. Astro-Theme-Aither est conçu pour les lecteurs qui viennent pour les mots, pas pour la décoration.

## Philosophie de design

La plupart des thèmes rivalisent d'attention avec des images héros, des animations, des barres latérales et des popups. Rien de tout cela n'aide à lire — cela aide à regarder, ce qui est une activité différente.

Astro-Theme-Aither prend l'approche inverse : un design minimal, pas une ingénierie minimale. Quand aucun visuel tape-à-l'œil ne masque les problèmes, chaque défaut typographique, chaque délai de chargement, chaque accroc d'interaction est amplifié. Un design minimal exige une qualité d'ingénierie supérieure, pas inférieure.

## Typographie

La police est l'identité visuelle. Chaque page utilise une pile de polices système sans-sérif unifiée — nette, rapide et cohérente entre les plateformes. Les paramètres typographiques suivent les Apple Human Interface Guidelines :

- **Taille de police** — 17px, le point idéal pour la lecture sur écran
- **Hauteur de ligne** — 1.47
- **Espacement des lettres** — -0.022em
- **Échelle des titres** — 31px → 22px → 19px → 17px
- **Largeur de lecture** — contrainte à 65-75 caractères par ligne

## Construit sur Astro

Astro est le meilleur framework pour les sites orientés contenu aujourd'hui. Il produit du HTML statique par défaut. L'architecture îlots signifie que les composants interactifs s'hydratent indépendamment.

Les îlots interactifs d'Astro-Theme-Aither sont minimaux :

- **Commutateur de thème** — toggle Clair / Sombre / Système avec animation circulaire View Transitions API
- **Commutateur de langue** — changement de locale fluide avec persistance localStorage
- **Détection de locale** — détecte automatiquement la langue du navigateur
- **Navigation mobile** — menu hamburger responsive

## Fonctionnalités

- **Tailwind CSS v4** — tokens de design `@theme`
- **Typographie Apple HIG** — paramètres 17px / 1.47 / -0.022em
- **View Transitions API** — animation de révélation circulaire
- **i18n** — support multilingue avec détection automatique
- **Épinglage d'articles** — épinglez les articles importants en haut de la liste
- **Content Collections** — Markdown type-safe
- **Mode sombre** — Clair / Sombre / Système
- **SEO** — Open Graph, URLs canoniques
- **RSS + Sitemap** — auto-générés
- **Google Analytics** — optionnel, dans un Web Worker Partytown
- **Tests** — Vitest + Playwright, intégrés au CI
- **Cloudflare Pages** — workflow de déploiement avec URLs de prévisualisation

## Pour qui ?

Si vous croyez que la bonne écriture parle d'elle-même :

- **Blogueurs personnels** — qui veulent leur écriture au premier plan
- **Rédacteurs techniques** — qui ont besoin d'un excellent rendu des blocs de code
- **Auteurs multilingues** — qui ont besoin du i18n intégré
- **Développeurs** — qui apprécient un code bien conçu

Écrivez sur n'importe quel sujet — la typographie le rendra beau.

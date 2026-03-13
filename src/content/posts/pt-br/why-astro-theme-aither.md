---
title: ✨ Por que Astro-Theme-Aither
date: 2026-01-03
category: Design
description: Um tema Astro AI-nativo que acredita que o texto por si só é bonito.
tags: [Design, Astro]
pinned: true
---

Um tema Astro AI-nativo que acredita que o texto por si só é bonito. Astro-Theme-Aither é construído para leitores que vêm pelas palavras, não pela decoração.

## Filosofia de Design

A maioria dos temas de blog compete por atenção com imagens hero, animações, sidebars e popups. Nada disso ajuda na leitura — ajuda na visualização, que é uma atividade completamente diferente.

Astro-Theme-Aither adota a abordagem oposta: design mínimo, não engenharia mínima. Quando não há visuais chamativos para distrair dos problemas, cada falha tipográfica e cada atraso de carregamento é amplificado. Design mínimo exige qualidade de engenharia mais alta.

## Tipografia

Parâmetros tipográficos seguem as Apple Human Interface Guidelines:

- **Tamanho de fonte** — base 17px
- **Altura de linha** — 1.47
- **Espaçamento entre letras** — -0.022em
- **Escala de títulos** — 31px → 22px → 19px → 17px
- **Largura de leitura** — limitada a 65–75 caracteres por linha

## Construído sobre Astro

Astro gera HTML estático por padrão. A arquitetura de islands significa que componentes interativos hidratam independentemente enquanto o resto da página permanece estático.

## Recursos

- **Tailwind CSS v4** — tokens de design `@theme`
- **Tipografia Apple HIG**
- **View Transitions API** — animação circular reveal para troca de tema
- **i18n** — suporte multilíngue com detecção automática de idioma do navegador
- **Fixação de posts** — fixe posts importantes no topo
- **Content Collections** — Markdown type-safe
- **Modo escuro** — Claro / Escuro / Sistema
- **SEO** — Open Graph, URLs canônicas
- **RSS + Sitemap** — auto-gerados
- **Google Analytics** — opcional, em Partytown Web Worker
- **Testes** — Vitest + Playwright
- **Cloudflare Pages** — workflow de deploy com previews de PR

## Para Quem É

- **Blogueiros pessoais** que querem sua escrita em primeiro plano
- **Escritores técnicos** que precisam de boa renderização de blocos de código
- **Autores multilíngues** que precisam de i18n embutido
- **Desenvolvedores** que apreciam uma codebase bem engenheirada

Escreva sobre qualquer coisa — a tipografia vai fazer parecer bonito.

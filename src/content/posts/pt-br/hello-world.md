---
title: 👋 Olá Mundo
date: 2026-01-01
category: Tutorial
description: Bem-vindo ao Astro-Theme-Aither — um tema para blog onde a tipografia conduz o design
tags: [Hello, Astro]
pinned: true
---

Bem-vindo ao Astro-Theme-Aither.

Este é um tema para blog construído sobre uma crença: boa escrita merece boa tipografia. Fontes sans-serif, um ritmo de leitura limpo e um layout que não atrapalha. Tudo aqui serve a um único objetivo — fazer suas palavras parecerem e se sentirem bonitas.

## Por que Outro Tema para Blog

A web está cheia de temas para blog, então uma pergunta justa é: por que construir outro? A resposta está nas prioridades. A maioria dos temas otimiza para impacto visual — imagens hero grandes, layouts complexos, transições animadas. Isso é impressionante em demos, mas atrapalha quando alguém realmente senta para ler um artigo de 2.000 palavras.

Astro-Theme-Aither parte de uma premissa diferente. O conteúdo é o produto. O trabalho do tema é apresentar esse conteúdo com o cuidado que ele merece.

## Começando

1. **Clone o repositório** — use o botão de template do GitHub ou clone diretamente com `git clone`
2. **Instale dependências** — execute `pnpm install`
3. **Configure seu site** — edite `src/config/site.ts`
4. **Substitua o conteúdo de exemplo** — troque os posts em `src/content/posts/`
5. **Comece a desenvolver** — execute `pnpm dev`
6. **Deploy** — faça push para o GitHub e deixe o CI workflow cuidar do deploy no Cloudflare Pages

### Estrutura do Projeto

```
src/
├── components/     # Componentes Astro reutilizáveis
├── config/         # Configuração do site
├── content/        # Seus posts Markdown e conteúdo
├── layouts/        # Layouts de página (Layout.astro)
├── pages/          # Páginas de rotas
└── styles/         # CSS global com tokens Tailwind v4
```

### Escrevendo Seu Primeiro Post

Crie um novo arquivo `.md` em `src/content/posts/` com o seguinte frontmatter:

```markdown
---
title: Título do Seu Post
date: 2026-01-15
category: General
description: Um breve resumo para SEO e previews sociais
tags: [Topic, Another]
---

Seu conteúdo começa aqui.
```

## O Que Você Recebe

### Recursos de Conteúdo

- **Feed RSS** — gerado automaticamente em `/rss.xml`
- **Sitemap** — auto-gerado via `@astrojs/sitemap`
- **Meta tags SEO** — Open Graph, Twitter cards e URLs canônicas
- **Modo escuro** — toggle de três vias (Claro / Escuro / Sistema) com persistência `localStorage`

### Recursos para Desenvolvedores

- **TypeScript** — modo strict, componentes e utilitários totalmente tipados
- **Content Collections** — Markdown type-safe com validação de frontmatter
- **Tailwind CSS v4** — tokens de design `@theme`
- **Vitest + Playwright** — testes unitários e E2E integrados ao CI
- **Cloudflare Pages** — workflow de deploy com URLs de preview de PR

### Performance

Como o tema gera HTML estático com JavaScript mínimo, a performance é excelente por padrão. Espere pontuações Lighthouse de 100 em todas as categorias.

## Nota sobre Filosofia de Design

A simplicidade visual deste tema é intencional, mas não é o mesmo que simplicidade de engenharia. Sob o capô, o tema lida com uma quantidade surpreendente de preocupações: escalas tipográficas responsivas, contraste de cores acessível, estrutura HTML semântica e atenção cuidadosa à experiência de leitura em todas as telas.

Bom design é invisível. Quando você lê um artigo neste tema e simplesmente aprecia a escrita — o design está funcionando exatamente como planejado.

Boa escrita.

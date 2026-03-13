# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | **Português (BR)**

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-cloudflare-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[Pré-visualização ao vivo](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## Por que Aither?

Uma boa escrita merece uma boa tipografia. A maioria dos temas enterra suas palavras sob imagens hero, animações e decorações de UI. Aither toma a abordagem oposta — deixa o texto ser o design.

Tipografia sans-serif limpa com títulos Bricolage Grotesque, um ritmo de leitura cuidadosamente ajustado e um layout que não atrapalha. Tudo serve a um único objetivo: fazer sua escrita parecer e se sentir bonita.

## Funcionalidades

- **Tipografia sans-serif** -- Títulos Bricolage Grotesque combinados com corpo em system-ui e fallbacks CJK (PingFang SC, Microsoft YaHei), consistente no macOS, Windows, Linux e Android
- **Modo escuro** -- Alternância Claro / Escuro / Sistema com persistência localStorage, animado via API View Transitions (revelação circular)
- **Tailwind CSS v4** -- Estilização utility-first com tokens de design `@theme`, fácil de personalizar
- **i18n de 11 idiomas** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **Imagens OG dinâmicas** -- Imagens Open Graph geradas automaticamente por artigo via Satori + resvg-js
- **Comentários Giscus** -- Sistema de comentários baseado em GitHub Discussions
- **Chat Crisp** -- Widget de chat ao vivo opcional via Crisp
- **Categorias e tags** -- Organização de artigos com categorias e tags opcionais
- **Artigos fixados** -- Defina `pinned: true` no frontmatter para fixar artigos no topo
- **Paginação** -- Tamanho de página configurável para a listagem do blog
- **Índice** -- Gerado automaticamente a partir dos títulos do artigo
- **Informações do autor** -- Nome e avatar do autor configuráveis
- **Endpoints AI-nativos** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json` e endpoints `.md` por artigo
- **Feed RSS** -- `/rss.xml` integrado via `@astrojs/rss`
- **Sitemap** -- Gerado automaticamente via `@astrojs/sitemap`
- **SEO** -- Tags Open Graph, URLs canônicas, descrições por artigo, OpenSearch
- **Responsivo** -- Layout mobile-friendly que preserva o ritmo de leitura em todos os tamanhos de tela
- **Google Analytics** -- Opcional, zero configuração via variável de ambiente `PUBLIC_GA_ID`
- **Astro Content Collections** -- Artigos Markdown type-safe com validação de esquema Zod
- **GitHub Pages** -- Workflow CI/CD incluído para deploy automático

## Início Rápido

### Usar como template do GitHub

1. Clique em **"Use this template"** no [GitHub](https://github.com/justinhuangcode/astro-theme-aither)
2. Clone seu novo repositório:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. Instale as dependências:

```bash
pnpm install
```

4. Configure seu site:

```bash
# astro.config.mjs -- defina a URL do seu site
site: 'https://your-domain.com'

# src/config/site.ts -- defina nome, descrição, links sociais, navegação, rodapé
```

5. Configure as variáveis de ambiente (opcional):

```bash
cp .env.example .env
# Edite .env com seus valores (GA, Giscus, Crisp)
```

6. Comece a escrever:

```bash
pnpm dev
```

7. Deploy: faça push para `main`, GitHub Actions compila e faz deploy automaticamente.

### Instalação manual

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## Formato dos Artigos

Crie arquivos Markdown em `src/content/posts/{locale}/`:

```markdown
---
title: Título do Artigo
date: 2026-01-01
description: Descrição opcional para SEO
category: Technology
tags: [opcional, tags]
pinned: false
image: ./optional-cover.jpg
---

Seu conteúdo aqui.
```

| Campo | Tipo | Obrigatório | Padrão | Descrição |
|---|---|---|---|---|
| `title` | string | Sim | -- | Título do artigo |
| `date` | date | Sim | -- | Data de publicação (AAAA-MM-DD) |
| `description` | string | Não | -- | Usado no feed RSS e meta tags |
| `category` | string | Não | `"General"` | Categoria do artigo |
| `tags` | string[] | Não | -- | Tags do artigo |
| `pinned` | boolean | Não | `false` | `true` fixa o artigo no topo da listagem |
| `image` | image | Não | -- | Imagem de capa (caminho relativo ou import) |

## Comandos

| Comando | Descrição |
|---|---|
| `pnpm dev` | Iniciar servidor de desenvolvimento local |
| `pnpm build` | Compilar site estático em `dist/` |
| `pnpm preview` | Pré-visualizar build de produção localmente |

## Configuração

### Configurações do site (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // Importar de src/assets/ para otimização, ou usar string URL
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

### Configuração Astro (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Obrigatório para RSS e sitemap
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### Variáveis de ambiente (`.env`)

```bash
# Google Analytics (deixe vazio para desabilitar)
PUBLIC_GA_ID=

# Chat Crisp (deixe vazio para desabilitar)
PUBLIC_CRISP_WEBSITE_ID=

# Comentários Giscus (deixe todos vazios para desabilitar)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

A configuração de idiomas está em `src/i18n/index.ts`, as traduções em `src/i18n/messages/*.ts`.

| Código | Idioma |
|---|---|
| `en` | English (padrão) |
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

A locale padrão (`en`) não tem prefixo de URL. As outras locales usam seu código como prefixo (ex. `/pt-br/`, `/ko/`).

## Estrutura do Projeto

```
src/
├── config/
│   └── site.ts              # Nome do site, links sociais, navegação, rodapé, analytics, Giscus, Crisp
├── content.config.ts         # Esquema Content Collections (Zod)
├── i18n/
│   ├── index.ts              # Definições de locale, getMessages(), helpers de roteamento
│   └── messages/             # Arquivos de tradução (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # Layout global (head, navegação, alternador de tema, analytics)
├── components/
│   ├── Navbar.astro          # Navbar estilo Bootstrap 3 com gradiente
│   ├── BlogGrid.astro        # Grid de artigos com paginação
│   ├── BlogCard.astro        # Card de artigo com categoria, tags, data
│   ├── TableOfContents.astro # Índice gerado automaticamente
│   ├── AuthorInfo.astro      # Nome e avatar do autor
│   ├── Giscus.astro          # Comentários GitHub Discussions
│   ├── Crisp.astro           # Widget de chat Crisp
│   ├── Analytics.astro       # Script Google Analytics
│   ├── Prose.astro           # Wrapper tipográfico para o conteúdo
│   └── react/                # Componentes React (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # Página inicial (English, locale padrão)
│   ├── about.astro           # Página Sobre
│   ├── page/                 # Listagem paginada do blog
│   ├── posts/
│   │   ├── [slug].astro      # Detalhe do artigo (English)
│   │   └── [slug].md.ts      # Endpoint Markdown por artigo para IA
│   ├── og/                   # Geração dinâmica de imagens OG
│   ├── rss.xml.ts            # Feed RSS
│   ├── llms.txt.ts           # llms.txt para agentes de IA
│   ├── llms-full.txt.ts      # Conteúdo completo para LLMs
│   ├── skill.md.ts           # Descritor de habilidade IA
│   ├── api/
│   │   └── posts.json.ts     # API JSON de artigos
│   └── {locale}/             # Páginas para cada locale suportada
├── content/
│   └── posts/
│       ├── en/*.md           # Artigos English (locale padrão)
│       └── {locale}/*.md     # Artigos para cada locale suportada
└── styles/
    └── global.css            # Tokens @theme Tailwind CSS v4 + estilos base
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-cloudflare-pages.yml     # Deploy GitHub Pages (padrão)
```

## Implantação

### GitHub Pages (padrão)

O workflow incluído (`.github/workflows/deploy-cloudflare-pages.yml`) faz deploy automaticamente:

1. Vá em **Settings** > **Pages** > **Source** do repositório: selecione **GitHub Actions**
2. Atualize `site` em `astro.config.mjs` com sua URL do GitHub Pages
3. Faça push para `main` — o site é implantado automaticamente

### Outras plataformas

A saída é HTML estático em `dist/`, implantável em qualquer lugar:

```bash
pnpm build
# Faça upload de dist/ para Netlify, Vercel ou qualquer host estático
```

## Filosofia de Design

1. **A tipografia é o design** -- Títulos sans-serif em Bricolage Grotesque, corpo de texto limpo em system-ui e um ritmo de leitura cuidadosamente ajustado. A tipografia *é* a identidade visual.
2. **O texto é belo** -- Um texto bem composto em uma página tranquila é a interface mais elegante.
3. **Funciona em qualquer lugar** -- Pilhas de fontes multiplataforma com fallbacks CJK (PingFang SC, Microsoft YaHei). Sem atrasos de carregamento de fontes web, sem mudança de layout.
4. **AI-nativo** -- Descobribilidade LLM de primeira classe com llms.txt, endpoints estruturados e conteúdo legível por máquinas.
5. **Refinado, não complexo** -- Os tokens de design `@theme` do Tailwind CSS v4 tornam a personalização simples. Um único arquivo de configuração (`src/config/site.ts`) controla todo o site.

## Agradecimentos

Inspirado por [yinwang.org](https://www.yinwang.org).

## Contribuindo

Contribuições são bem-vindas. Por favor, abra primeiro uma issue para discutir as mudanças que você gostaria de fazer.

## Licença

[MIT](LICENSE)

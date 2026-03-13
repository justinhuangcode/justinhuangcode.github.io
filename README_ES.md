# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | **Español** | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[Vista previa en vivo](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## ¿Por qué Aither?

Una buena escritura merece una buena tipografía. La mayoría de los temas entierran tus palabras bajo imágenes hero, animaciones y decoraciones de UI. Aither toma el enfoque opuesto — deja que el texto sea el diseño.

Tipografía sans-serif limpia con encabezados Bricolage Grotesque, un ritmo de lectura cuidadosamente ajustado y un diseño que no estorba. Todo sirve a un único objetivo: hacer que tu escritura se vea y se sienta hermosa.

## Características

- **Tipografía sans-serif** -- Encabezados Bricolage Grotesque con cuerpo en system-ui y fallbacks CJK (PingFang SC, Microsoft YaHei), consistente en macOS, Windows, Linux y Android
- **Modo oscuro** -- Alternancia Claro / Oscuro / Sistema con persistencia localStorage, animado a través de la API View Transitions (revelación circular)
- **Tailwind CSS v4** -- Estilado utility-first con tokens de diseño `@theme`, fácil de personalizar
- **i18n de 11 idiomas** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **Imágenes OG dinámicas** -- Imágenes Open Graph generadas automáticamente por artículo vía Satori + resvg-js
- **Comentarios Giscus** -- Sistema de comentarios basado en GitHub Discussions
- **Chat Crisp** -- Widget de chat en vivo opcional vía Crisp
- **Categorías y etiquetas** -- Organización de artículos con categorías y etiquetas opcionales
- **Artículos fijados** -- Establecer `pinned: true` en el frontmatter para destacar artículos
- **Paginación** -- Tamaño de página configurable para el listado del blog
- **Tabla de contenidos** -- Generada automáticamente a partir de los encabezados del artículo
- **Información del autor** -- Nombre y avatar del autor configurables
- **Endpoints AI-nativos** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json` y endpoints `.md` por artículo
- **Feed RSS** -- `/rss.xml` integrado vía `@astrojs/rss`
- **Sitemap** -- Generado automáticamente vía `@astrojs/sitemap`
- **SEO** -- Etiquetas Open Graph, URLs canónicas, descripciones por artículo, OpenSearch
- **Responsive** -- Diseño adaptado a móviles que preserva el ritmo de lectura en todos los tamaños de pantalla
- **Google Analytics** -- Opcional, cero configuración vía variable de entorno `PUBLIC_GA_ID`
- **Astro Content Collections** -- Artículos Markdown type-safe con validación de esquema Zod
- **GitHub Pages** -- Workflow CI/CD incluido para despliegue automático

## Inicio rápido

### Usar como plantilla de GitHub

1. Haz clic en **"Use this template"** en [GitHub](https://github.com/justinhuangcode/astro-theme-aither)
2. Clona tu nuevo repositorio:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. Instala las dependencias:

```bash
pnpm install
```

4. Configura tu sitio:

```bash
# astro.config.mjs -- establece la URL de tu sitio
site: 'https://your-domain.com'

# src/config/site.ts -- establece nombre, descripción, enlaces sociales, navegación, pie de página
```

5. Configura las variables de entorno (opcional):

```bash
cp .env.example .env
# Edita .env con tus valores (GA, Giscus, Crisp)
```

6. Comienza a escribir:

```bash
pnpm dev
```

7. Despliegue: haz push a `main`, GitHub Actions compila y despliega automáticamente.

### Instalación manual

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## Formato de artículos

Crea archivos Markdown en `src/content/posts/{locale}/`:

```markdown
---
title: Título del artículo
date: 2026-01-01
description: Descripción opcional para SEO
category: Technology
tags: [opcional, etiquetas]
pinned: false
image: ./optional-cover.jpg
---

Tu contenido aquí.
```

| Campo | Tipo | Requerido | Predeterminado | Descripción |
|---|---|---|---|---|
| `title` | string | Sí | -- | Título del artículo |
| `date` | date | Sí | -- | Fecha de publicación (AAAA-MM-DD) |
| `description` | string | No | -- | Usado en el feed RSS y etiquetas meta |
| `category` | string | No | `"General"` | Categoría del artículo |
| `tags` | string[] | No | -- | Etiquetas del artículo |
| `pinned` | boolean | No | `false` | `true` fija el artículo en la parte superior |
| `image` | image | No | -- | Imagen de portada (ruta relativa o import) |

## Comandos

| Comando | Descripción |
|---|---|
| `pnpm dev` | Iniciar servidor de desarrollo local |
| `pnpm build` | Compilar sitio estático en `dist/` |
| `pnpm preview` | Vista previa local de la compilación de producción |

## Configuración

### Ajustes del sitio (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // Importar desde src/assets/ para optimización, o usar cadena URL
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

### Configuración de Astro (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Requerido para RSS y sitemap
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### Variables de entorno (`.env`)

```bash
# Google Analytics (dejar vacío para deshabilitar)
PUBLIC_GA_ID=

# Chat Crisp (dejar vacío para deshabilitar)
PUBLIC_CRISP_WEBSITE_ID=

# Comentarios Giscus (dejar todos vacíos para deshabilitar)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

La configuración de idiomas está en `src/i18n/index.ts`, las traducciones en `src/i18n/messages/*.ts`.

| Código | Idioma |
|---|---|
| `en` | English (predeterminado) |
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

La locale predeterminada (`en`) no tiene prefijo URL. Las demás locales usan su código como prefijo (ej. `/es/`, `/ko/`).

## Estructura del proyecto

```
src/
├── config/
│   └── site.ts              # Nombre del sitio, enlaces sociales, navegación, pie de página, analytics, Giscus, Crisp
├── content.config.ts         # Esquema Content Collections (Zod)
├── i18n/
│   ├── index.ts              # Definiciones de locale, getMessages(), helpers de enrutamiento
│   └── messages/             # Archivos de traducción (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # Layout global (head, navegación, cambio de tema, analytics)
├── components/
│   ├── Navbar.astro          # Barra de navegación estilo Bootstrap 3 con gradiente
│   ├── BlogGrid.astro        # Cuadrícula de artículos con paginación
│   ├── BlogCard.astro        # Tarjeta de artículo con categoría, etiquetas, fecha
│   ├── TableOfContents.astro # Tabla de contenidos auto-generada
│   ├── AuthorInfo.astro      # Nombre y avatar del autor
│   ├── Giscus.astro          # Comentarios GitHub Discussions
│   ├── Crisp.astro           # Widget de chat Crisp
│   ├── Analytics.astro       # Script de Google Analytics
│   ├── Prose.astro           # Wrapper tipográfico para el contenido
│   └── react/                # Componentes React (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # Inicio (English, locale predeterminada)
│   ├── about.astro           # Página Acerca de
│   ├── page/                 # Listado de blog paginado
│   ├── posts/
│   │   ├── [slug].astro      # Detalle del artículo (English)
│   │   └── [slug].md.ts      # Endpoint Markdown por artículo para IA
│   ├── og/                   # Generación dinámica de imágenes OG
│   ├── rss.xml.ts            # Feed RSS
│   ├── llms.txt.ts           # llms.txt para agentes de IA
│   ├── llms-full.txt.ts      # Contenido completo para LLMs
│   ├── skill.md.ts           # Descriptor de habilidad IA
│   ├── api/
│   │   └── posts.json.ts     # API JSON de artículos
│   └── {locale}/             # Páginas para cada locale soportada
├── content/
│   └── posts/
│       ├── en/*.md           # Artículos English (locale predeterminada)
│       └── {locale}/*.md     # Artículos para cada locale soportada
└── styles/
    └── global.css            # Tokens @theme Tailwind CSS v4 + estilos base
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    ├── deploy-github-pages.yml     # Despliegue GitHub Pages (predeterminado)
```

## Despliegue

### GitHub Pages (predeterminado)

El workflow incluido (`.github/workflows/deploy-github-pages.yml`) despliega automáticamente:

1. Ve a **Settings** > **Pages** > **Source** del repositorio: selecciona **GitHub Actions**
2. Actualiza `site` en `astro.config.mjs` con tu URL de GitHub Pages
3. Haz push a `main` — el sitio se despliega automáticamente

### Otras plataformas

La salida es HTML estático en `dist/`, desplegable en cualquier lugar:

```bash
pnpm build
# Sube dist/ a Netlify, Vercel o cualquier host estático
```

## Filosofía de diseño

1. **La tipografía es el diseño** -- Encabezados sans-serif en Bricolage Grotesque, cuerpo de texto limpio en system-ui y un ritmo de lectura cuidadosamente ajustado. La tipografía *es* la identidad visual.
2. **El texto es bello** -- Un texto bien compuesto en una página tranquila es la interfaz más elegante.
3. **Funciona en todas partes** -- Pilas de fuentes multiplataforma con fallbacks CJK (PingFang SC, Microsoft YaHei). Sin retrasos de carga de fuentes web, sin cambios de diseño.
4. **AI-nativo** -- Descubribilidad LLM de primera clase con llms.txt, endpoints estructurados y contenido legible por máquinas.
5. **Refinado, no complejo** -- Los tokens de diseño `@theme` de Tailwind CSS v4 hacen la personalización sencilla. Un solo archivo de configuración (`src/config/site.ts`) controla todo el sitio.

## Agradecimientos

Inspirado por [yinwang.org](https://www.yinwang.org).

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre primero un issue para discutir los cambios que te gustaría realizar.

## Licencia

[MIT](LICENSE)

# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | **Bahasa Indonesia** | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[Pratinjau Langsung](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## Mengapa Aither?

Tulisan yang baik layak mendapatkan tipografi yang baik. Kebanyakan tema mengubur kata-kata Anda di bawah gambar hero, animasi, dan dekorasi UI. Aither mengambil pendekatan sebaliknya — membiarkan teks menjadi desain.

Tipografi sans-serif yang bersih dengan heading Bricolage Grotesque, ritme baca yang disetel dengan cermat, dan tata letak yang tidak menghalangi. Semuanya melayani satu tujuan: membuat tulisan Anda terlihat dan terasa indah.

## Fitur

- **Tipografi sans-serif** -- Heading Bricolage Grotesque dipasangkan dengan body text system-ui dan fallback CJK (PingFang SC, Microsoft YaHei), konsisten di macOS, Windows, Linux, dan Android
- **Mode gelap** -- Toggle Terang / Gelap / Sistem dengan persistensi localStorage, dianimasikan melalui View Transitions API (reveal melingkar)
- **Tailwind CSS v4** -- Styling utility-first dengan token desain `@theme`, mudah dikustomisasi
- **i18n 11 bahasa** -- English, 简体中文, 繁體中文, 한국어, Français, Deutsch, Italiano, Español, Русский, Bahasa Indonesia, Português (BR)
- **Gambar OG dinamis** -- Gambar Open Graph yang dihasilkan otomatis per artikel melalui Satori + resvg-js
- **Komentar Giscus** -- Sistem komentar berbasis GitHub Discussions
- **Chat Crisp** -- Widget chat langsung opsional melalui Crisp
- **Kategori dan tag** -- Organisasi artikel dengan kategori dan tag opsional
- **Artikel disematkan** -- Atur `pinned: true` di frontmatter untuk menyematkan artikel di atas
- **Paginasi** -- Ukuran halaman yang dapat dikonfigurasi untuk daftar blog
- **Daftar isi** -- Dihasilkan otomatis dari heading artikel
- **Info penulis** -- Nama dan avatar penulis yang dapat dikonfigurasi
- **Endpoint AI-native** -- `/llms.txt`, `/llms-full.txt`, `/skill.md`, `/api/posts.json`, dan endpoint `.md` per artikel
- **Feed RSS** -- `/rss.xml` bawaan melalui `@astrojs/rss`
- **Sitemap** -- Dihasilkan otomatis melalui `@astrojs/sitemap`
- **SEO** -- Tag Open Graph, URL kanonik, deskripsi per artikel, OpenSearch
- **Responsif** -- Tata letak ramah seluler yang menjaga ritme baca di semua ukuran layar
- **Google Analytics** -- Opsional, tanpa konfigurasi melalui variabel lingkungan `PUBLIC_GA_ID`
- **Astro Content Collections** -- Artikel Markdown type-safe dengan validasi skema Zod
- **GitHub Pages** -- Workflow CI/CD disertakan untuk deployment otomatis

## Mulai Cepat

### Gunakan sebagai template GitHub

1. Klik **"Use this template"** di [GitHub](https://github.com/justinhuangcode/astro-theme-aither)
2. Clone repositori baru Anda:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. Instal dependensi:

```bash
pnpm install
```

4. Konfigurasi situs Anda:

```bash
# astro.config.mjs -- atur URL situs Anda
site: 'https://your-domain.com'

# src/config/site.ts -- atur nama, deskripsi, tautan sosial, navigasi, footer
```

5. Atur variabel lingkungan (opsional):

```bash
cp .env.example .env
# Edit .env dengan nilai Anda (GA, Giscus, Crisp)
```

6. Mulai menulis:

```bash
pnpm dev
```

7. Deploy: push ke `main`, GitHub Actions membangun dan men-deploy secara otomatis.

### Instalasi manual

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## Format Artikel

Buat file Markdown di `src/content/posts/{locale}/`:

```markdown
---
title: Judul Artikel
date: 2026-01-01
description: Deskripsi opsional untuk SEO
category: Technology
tags: [opsional, tag]
pinned: false
image: ./optional-cover.jpg
---

Konten Anda di sini.
```

| Field | Tipe | Wajib | Default | Deskripsi |
|---|---|---|---|---|
| `title` | string | Ya | -- | Judul artikel |
| `date` | date | Ya | -- | Tanggal publikasi (TTTT-BB-HH) |
| `description` | string | Tidak | -- | Digunakan di feed RSS dan tag meta |
| `category` | string | Tidak | `"General"` | Kategori artikel |
| `tags` | string[] | Tidak | -- | Tag artikel |
| `pinned` | boolean | Tidak | `false` | `true` menyematkan artikel di atas daftar |
| `image` | image | Tidak | -- | Gambar sampul (path relatif atau import) |

## Perintah

| Perintah | Deskripsi |
|---|---|
| `pnpm dev` | Mulai server pengembangan lokal |
| `pnpm build` | Bangun situs statis ke `dist/` |
| `pnpm preview` | Pratinjau build produksi secara lokal |

## Konfigurasi

### Pengaturan situs (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // Import dari src/assets/ untuk optimisasi, atau gunakan string URL
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

### Konfigurasi Astro (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // Diperlukan untuk RSS dan sitemap
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### Variabel lingkungan (`.env`)

```bash
# Google Analytics (kosongkan untuk menonaktifkan)
PUBLIC_GA_ID=

# Chat Crisp (kosongkan untuk menonaktifkan)
PUBLIC_CRISP_WEBSITE_ID=

# Komentar Giscus (kosongkan semua untuk menonaktifkan)
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n

Konfigurasi bahasa ada di `src/i18n/index.ts`, terjemahan di `src/i18n/messages/*.ts`.

| Kode | Bahasa |
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

Locale default (`en`) tidak memiliki prefiks URL. Locale lainnya menggunakan kode mereka sebagai prefiks (misal `/id/`, `/ko/`).

## Struktur Proyek

```
src/
├── config/
│   └── site.ts              # Nama situs, tautan sosial, navigasi, footer, analytics, Giscus, Crisp
├── content.config.ts         # Skema Content Collections (Zod)
├── i18n/
│   ├── index.ts              # Definisi locale, getMessages(), helper routing
│   └── messages/             # File terjemahan (en.ts, zh-cn.ts, ko.ts, fr.ts, ...)
├── layouts/
│   └── Layout.astro          # Layout global (head, navigasi, pengalih tema, analytics)
├── components/
│   ├── Navbar.astro          # Navbar gaya Bootstrap 3 dengan gradien
│   ├── BlogGrid.astro        # Grid artikel dengan paginasi
│   ├── BlogCard.astro        # Kartu artikel dengan kategori, tag, tanggal
│   ├── TableOfContents.astro # Daftar isi yang dihasilkan otomatis
│   ├── AuthorInfo.astro      # Nama dan avatar penulis
│   ├── Giscus.astro          # Komentar GitHub Discussions
│   ├── Crisp.astro           # Widget chat Crisp
│   ├── Analytics.astro       # Skrip Google Analytics
│   ├── Prose.astro           # Wrapper tipografi untuk konten
│   └── react/                # Komponen React (ModeSwitcher, LanguageSwitcher, NavbarMobile)
├── pages/
│   ├── index.astro           # Beranda (English, locale default)
│   ├── about.astro           # Halaman Tentang
│   ├── page/                 # Daftar blog berpaginasi
│   ├── posts/
│   │   ├── [slug].astro      # Detail artikel (English)
│   │   └── [slug].md.ts      # Endpoint Markdown per artikel untuk AI
│   ├── og/                   # Pembuatan gambar OG dinamis
│   ├── rss.xml.ts            # Feed RSS
│   ├── llms.txt.ts           # llms.txt untuk agen AI
│   ├── llms-full.txt.ts      # Konten lengkap untuk LLM
│   ├── skill.md.ts           # Deskriptor skill AI
│   ├── api/
│   │   └── posts.json.ts     # API JSON artikel
│   └── {locale}/             # Halaman untuk setiap locale yang didukung
├── content/
│   └── posts/
│       ├── en/*.md           # Artikel English (locale default)
│       └── {locale}/*.md     # Artikel untuk setiap locale yang didukung
└── styles/
    └── global.css            # Token @theme Tailwind CSS v4 + gaya dasar
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-github-pages.yml     # Deploy GitHub Pages (default)
```

## Deployment

### GitHub Pages (default)

Workflow yang disertakan (`.github/workflows/deploy-github-pages.yml`) men-deploy secara otomatis:

1. Buka **Settings** > **Pages** > **Source** repositori: pilih **GitHub Actions**
2. Perbarui `site` di `astro.config.mjs` dengan URL GitHub Pages Anda
3. Push ke `main` — situs di-deploy secara otomatis

### Platform lain

Output adalah HTML statis di `dist/`, dapat di-deploy di mana saja:

```bash
pnpm build
# Upload dist/ ke Netlify, Vercel, atau host statis mana pun
```

## Filosofi Desain

1. **Tipografi adalah desain** -- Heading sans-serif Bricolage Grotesque, body text bersih system-ui, dan ritme baca yang disetel dengan cermat. Tipografi *adalah* identitas visual.
2. **Teks itu indah** -- Teks yang diatur dengan baik di halaman yang tenang adalah antarmuka yang paling elegan.
3. **Berfungsi di mana saja** -- Stack font lintas platform dengan fallback CJK (PingFang SC, Microsoft YaHei). Tanpa penundaan pemuatan font web, tanpa pergeseran tata letak.
4. **AI-native** -- Discoverability LLM kelas satu dengan llms.txt, endpoint terstruktur, dan konten yang dapat dibaca mesin.
5. **Halus, bukan rumit** -- Token desain `@theme` Tailwind CSS v4 membuat kustomisasi mudah. Satu file konfigurasi (`src/config/site.ts`) mengontrol seluruh situs.

## Penghargaan

Terinspirasi oleh [yinwang.org](https://www.yinwang.org).

## Berkontribusi

Kontribusi disambut. Silakan buka issue terlebih dahulu untuk mendiskusikan perubahan yang ingin Anda lakukan.

## Lisensi

[MIT](LICENSE)

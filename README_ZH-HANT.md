# Aither

[English](./README.md) | [简体中文](./README_ZH-HANS.md) | **繁體中文** | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[線上預覽](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## 為什麼選擇 Aither？

好的文字值得好的排版。大多數主題把你的文字埋在 hero 圖片、動畫和 UI 裝飾之下。Aither 反其道而行——讓文字本身成為設計。

統一的無襯線字體系統（Bricolage Grotesque + system-ui）、精心調校的閱讀節奏、不喧賓奪主的版面。一切服務於一個目標：讓你的文字看起來、讀起來都很美。

## 功能特性

- **無襯線排版系統** -- Bricolage Grotesque 標題搭配 system-ui 正文，CJK 智慧回退（PingFang SC、Microsoft YaHei），全平台優美一致
- **暗色模式** -- 亮色 / 暗色 / 系統三檔切換，localStorage 持久化，View Transitions API 圓形揭幕動畫
- **Tailwind CSS v4** -- 工具類優先的樣式方案，`@theme` 設計權杖，易於自訂
- **11 種語言** -- 內建 Astro i18n 路由，支援 English、简体中文、繁體中文、한국어、Français、Deutsch、Italiano、Español、Русский、Bahasa Indonesia、Português (BR)
- **動態 OG 圖片** -- 基於 Satori + resvg-js 自動產生社群分享圖，無需手動製作
- **Giscus 評論** -- 基於 GitHub Discussions 的評論系統，透過環境變數設定
- **Crisp 客服** -- 選填的即時聊天，透過環境變數啟用
- **分類與標籤** -- 文章支援分類和選填標籤
- **置頂文章** -- frontmatter 設定 `pinned: true` 即可置頂顯示
- **分頁** -- 內建分頁元件，預設每頁 20 篇
- **目錄導覽** -- 文章頁自動產生 Table of Contents
- **作者資訊** -- 可設定的作者名稱和頭像
- **AI 端點** -- `/llms.txt`、`/llms-full.txt`、`/skill.md`、`/api/posts.json`、每篇文章的 `.md` 端點，LLM 友善
- **RSS 訂閱** -- 內建 `/rss.xml`，基於 `@astrojs/rss`
- **Sitemap** -- 透過 `@astrojs/sitemap` 自動產生
- **SEO** -- Open Graph 標籤、canonical URL、每篇文章獨立 description、OpenSearch
- **響應式** -- 行動端友善，在不同螢幕尺寸下保持閱讀節奏
- **Google Analytics** -- 選填，透過 `PUBLIC_GA_ID` 環境變數零設定啟用
- **Astro Content Collections** -- 型別安全的 Markdown 文章，frontmatter 自動校驗
- **GitHub Pages** -- 內建部署工作流，自動部署

## 快速開始

### 使用 GitHub 範本

1. 點擊 **"Use this template"** > **"Create a new repository"**
2. 複製你的新倉庫：

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. 安裝依賴：

```bash
pnpm install
```

4. 設定站台：

```bash
# astro.config.mjs -- 設定你的站台 URL
site: 'https://your-domain.com'

# src/config/site.ts -- 設定站名、社交連結、導覽等
```

5. （選填）設定環境變數：

```bash
cp .env.example .env
# 編輯 .env，填入 GA、Giscus、Crisp 等設定
```

6. 開始寫作：

```bash
pnpm dev
```

7. 部署：推送到 `main` 分支，GitHub Actions 自動建構和部署。

### 手動安裝

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## 文章格式

在 `src/content/posts/{locale}/` 中建立 Markdown 檔案：

```markdown
---
title: 文章標題
date: 2026-01-01
description: 選填的描述，用於 SEO 和社群分享
category: Tutorial
tags: [選填, 標籤]
pinned: false
image: ./optional-cover.jpg
---

正文內容。
```

| 欄位 | 型別 | 必填 | 預設值 | 說明 |
|---|---|---|---|---|
| `title` | string | 是 | -- | 文章標題 |
| `date` | date | 是 | -- | 發佈日期（YYYY-MM-DD） |
| `description` | string | 否 | -- | 用於 RSS、meta 標籤和 OG 圖片 |
| `category` | string | 否 | `"General"` | 文章分類 |
| `tags` | string[] | 否 | -- | 文章標籤 |
| `pinned` | boolean | 否 | `false` | `true` 置頂文章 |
| `image` | image | 否 | -- | 封面圖片（支援相對路徑） |

## 命令

| 命令 | 說明 |
|---|---|
| `pnpm dev` | 啟動本地開發伺服器 |
| `pnpm build` | 建構靜態站台到 `dist/` |
| `pnpm preview` | 本地預覽生產建構 |

## 設定

### 站台設定（`src/config/site.ts`）

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // 從 src/assets/ 匯入最佳化，或使用 URL 字串
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

### Astro 設定（`astro.config.mjs`）

```javascript
export default defineConfig({
  site: 'https://your-domain.com', // RSS 和 sitemap 必需
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'zh-tw', 'ko', 'fr', 'de', 'it', 'es', 'ru', 'id', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```

### 環境變數（`.env`）

```bash
# Google Analytics（留空則停用）
PUBLIC_GA_ID=

# Crisp 客服（留空則停用）
PUBLIC_CRISP_WEBSITE_ID=

# Giscus 評論（全部留空則停用）
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### 國際化（i18n）

語言設定位於 `src/i18n/index.ts`，翻譯檔案位於 `src/i18n/messages/*.ts`。

| 代碼 | 語言 |
|---|---|
| `en` | English（預設） |
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

預設語言（`en`）不帶 URL 前綴，其他語言使用各自的前綴路由（如 `/zh-tw/`、`/ko/`）。

## 專案結構

```
src/
├── config/
│   └── site.ts              # 站台設定（名稱、社交連結、導覽、分析、Giscus、Crisp）
├── content.config.ts         # Content Collections 結構定義（Zod）
├── i18n/
│   ├── index.ts              # 語言定義、工具函式
│   └── messages/             # 各語言翻譯檔案（en.ts、zh-tw.ts、ko.ts...）
├── layouts/
│   └── Layout.astro          # 全域佈局（head、導覽、主題切換、分析）
├── components/
│   ├── Navbar.astro          # Bootstrap 3 風格漸層導覽列
│   ├── BlogGrid.astro        # 文章網格
│   ├── BlogCard.astro        # 文章卡片（分類、標籤、日期）
│   ├── TableOfContents.astro # 目錄導覽
│   ├── AuthorInfo.astro      # 作者資訊
│   ├── Giscus.astro          # Giscus 評論
│   ├── Crisp.astro           # Crisp 客服
│   ├── Analytics.astro       # Google Analytics
│   ├── Prose.astro           # 文章排版容器
│   └── react/                # React 互動元件（暗色模式、語言切換、行動導覽）
├── pages/
│   ├── index.astro           # 首頁（English，預設語言）
│   ├── about.astro           # 關於頁面
│   ├── page/                 # 分頁
│   ├── posts/
│   │   ├── [slug].astro      # 文章詳情
│   │   └── [slug].md.ts      # 文章 Markdown 端點（AI 友善）
│   ├── og/                   # 動態 OG 圖片產生
│   ├── rss.xml.ts            # RSS 訂閱
│   ├── llms.txt.ts           # llms.txt 端點
│   ├── llms-full.txt.ts      # llms-full.txt 端點
│   ├── skill.md.ts           # AI skill 端點
│   ├── api/
│   │   └── posts.json.ts     # 文章 JSON API
│   └── {locale}/             # 各語言頁面
├── content/
│   └── posts/
│       └── {locale}/*.md     # 各語言文章
└── styles/
    └── global.css            # Tailwind CSS v4 @theme 設計權杖 + 基礎樣式
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-github-pages.yml     # GitHub Pages 部署（預設）
```

## 部署

### GitHub Pages（預設）

內建工作流自動部署：

1. 前往倉庫 **Settings** > **Pages** > **Source** 選擇 **GitHub Actions**
2. 在 `astro.config.mjs` 中設定 `site` 為你的 GitHub Pages URL
3. 推送到 `main`——站台自動部署

### 其他平台

輸出是 `dist/` 中的純靜態 HTML，可以部署到任何平台：

```bash
pnpm build
# 將 dist/ 上傳到 Netlify、Vercel 或任何靜態託管服務
```

## 設計哲學

1. **排版即設計** -- 無襯線字體系統（Bricolage Grotesque + system-ui），精心調校的閱讀節奏。字體*就是*視覺識別。
2. **文字即美** -- 排版精良的文字在安靜的頁面上，就是最優雅的介面。
3. **全球化** -- 跨平台字體堆疊，CJK 智慧回退（PingFang SC、Microsoft YaHei）。零網路字體載入，零佈局偏移。
4. **AI 原生** -- 內建 llms.txt、結構化端點和機器可讀內容，讓 AI Agent 能直接理解你的內容。
5. **精巧不複雜** -- 一個設定檔（`src/config/site.ts`）控制整個站台。

## 致謝

靈感來自 [yinwang.org](https://www.yinwang.org)。

## 貢獻

歡迎貢獻。請先開 issue 討論你想要的改動。

## 授權條款

[MIT](LICENSE)

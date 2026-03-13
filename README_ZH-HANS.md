# Aither

[English](./README.md) | **简体中文** | [繁體中文](./README_ZH-HANT.md) | [한국어](./README_KO.md) | [Français](./README_FR.md) | [Deutsch](./README_DE.md) | [Italiano](./README_IT.md) | [Español](./README_ES.md) | [Русский](./README_RU.md) | [Bahasa Indonesia](./README_ID.md) | [Português (BR)](./README_PT-BR.md)

[![Deploy](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml/badge.svg)](https://github.com/justinhuangcode/astro-theme-aither/actions/workflows/deploy-github-pages.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Astro](https://img.shields.io/badge/astro-6.0%2B-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-v4-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GitHub Stars](https://img.shields.io/github/stars/justinhuangcode/astro-theme-aither?style=flat-square&logo=github)](https://github.com/justinhuangcode/astro-theme-aither/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/justinhuangcode/astro-theme-aither?style=flat-square)](https://github.com/justinhuangcode/astro-theme-aither/commits/main)

**[在线预览](https://astro-theme-aither.pages.dev)**

An AI-native Astro theme that believes text itself is beautiful.  ✍️

## 为什么选择 Aither？

好的文字值得好的排版。大多数主题把你的文字埋在 hero 图片、动画和 UI 装饰之下。Aither 反其道而行——让文字本身成为设计。

统一的无衬线字体系统（Bricolage Grotesque + system-ui）、精心调校的阅读节奏、不喧宾夺主的版面。一切服务于一个目标：让你的文字看起来、读起来都很美。

## 功能特性

- **无衬线排版系统** -- Bricolage Grotesque 标题搭配 system-ui 正文，CJK 智能回退（PingFang SC、Microsoft YaHei），全平台优美一致
- **暗色模式** -- 亮色 / 暗色 / 系统三档切换，localStorage 持久化，View Transitions API 圆形揭幕动画
- **Tailwind CSS v4** -- 工具类优先的样式方案，`@theme` 设计令牌，易于自定义
- **11 种语言** -- 内置 Astro i18n 路由，支持 English、简体中文、繁體中文、한국어、Français、Deutsch、Italiano、Español、Русский、Bahasa Indonesia、Português (BR)
- **动态 OG 图片** -- 基于 Satori + resvg-js 自动生成社交分享图，无需手动制作
- **Giscus 评论** -- 基于 GitHub Discussions 的评论系统，通过环境变量配置
- **Crisp 客服** -- 可选的在线客服聊天，通过环境变量启用
- **分类与标签** -- 文章支持分类和可选标签
- **置顶文章** -- frontmatter 设置 `pinned: true` 即可置顶显示
- **分页** -- 内置分页组件，默认每页 20 篇
- **目录导航** -- 文章页自动生成 Table of Contents
- **作者信息** -- 可配置的作者名称和头像
- **AI 端点** -- `/llms.txt`、`/llms-full.txt`、`/skill.md`、`/api/posts.json`、每篇文章的 `.md` 端点，LLM 友好
- **RSS 订阅** -- 内置 `/rss.xml`，基于 `@astrojs/rss`
- **Sitemap** -- 通过 `@astrojs/sitemap` 自动生成
- **SEO** -- Open Graph 标签、canonical URL、每篇文章独立 description、OpenSearch
- **响应式** -- 移动端友好，在不同屏幕尺寸下保持阅读节奏
- **Google Analytics** -- 可选，通过 `PUBLIC_GA_ID` 环境变量零配置启用
- **Astro Content Collections** -- 类型安全的 Markdown 文章，frontmatter 自动校验
- **GitHub Pages** -- 内置部署工作流，自动部署

## 快速开始

### 使用 GitHub 模板

1. 点击 **"Use this template"** > **"Create a new repository"**
2. 克隆你的新仓库：

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

3. 安装依赖：

```bash
pnpm install
```

4. 配置站点：

```bash
# astro.config.mjs -- 设置你的站点 URL
site: 'https://your-domain.com'

# src/config/site.ts -- 设置站点名称、社交链接、导航等
```

5. （可选）配置环境变量：

```bash
cp .env.example .env
# 编辑 .env 填入你的值（GA、Giscus、Crisp）
```

6. 开始写作：

```bash
pnpm dev
```

7. 部署：推送到 `main` 分支，GitHub Actions 自动构建和部署。

### 手动安装

```bash
git clone https://github.com/justinhuangcode/astro-theme-aither.git my-blog
cd my-blog
rm -rf .git && git init
pnpm install
pnpm dev
```

## 文章格式

在 `src/content/posts/{locale}/` 中创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2026-01-01
description: 可选的描述，用于 SEO 和社交分享
category: Tutorial
tags: [可选, 标签]
pinned: false
image: ./optional-cover.jpg
---

正文内容。
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `title` | string | 是 | -- | 文章标题 |
| `date` | date | 是 | -- | 发布日期（YYYY-MM-DD） |
| `description` | string | 否 | -- | 用于 RSS、meta 标签和 OG 图片 |
| `category` | string | 否 | `"General"` | 文章分类 |
| `tags` | string[] | 否 | -- | 文章标签 |
| `pinned` | boolean | 否 | `false` | `true` 置顶文章 |
| `image` | image | 否 | -- | 封面图片（支持相对路径） |

## 命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建静态站点到 `dist/` |
| `pnpm preview` | 本地预览生产构建 |

## 配置

### 站点设置（`src/config/site.ts`）

```typescript
export const siteConfig = {
  name: 'Aither',
  title: 'An AI-native Astro theme that believes text itself is beautiful.',
  description: '...',
  author: {
    name: 'Aither',
    avatar: '', // 从 src/assets/ 导入优化，或使用 URL 字符串
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

### Astro 配置（`astro.config.mjs`）

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

### 环境变量（`.env`）

```bash
# Google Analytics（留空则禁用）
PUBLIC_GA_ID=

# Crisp 客服（留空则禁用）
PUBLIC_CRISP_WEBSITE_ID=

# Giscus 评论（全部留空则禁用）
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
```

### i18n 国际化

语言配置位于 `src/i18n/index.ts`，翻译文件位于 `src/i18n/messages/*.ts`。

| 代码 | 语言 |
|---|---|
| `en` | English（默认） |
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

默认语言（`en`）不带 URL 前缀，其他语言使用各自的前缀路由（如 `/zh-cn/`、`/ko/`）。

## 项目结构

```
src/
├── config/
│   └── site.ts              # 站点名称、社交链接、导航、分析、Giscus、Crisp
├── content.config.ts         # Content Collections 模式定义（Zod）
├── i18n/
│   ├── index.ts              # 语言定义、工具函数
│   └── messages/             # 各语言翻译文件（en.ts、zh-cn.ts、ko.ts...）
├── layouts/
│   └── Layout.astro          # 全局布局（head、导航、主题切换、分析）
├── components/
│   ├── Navbar.astro          # Bootstrap 3 风格渐变导航栏
│   ├── BlogGrid.astro        # 文章列表网格
│   ├── BlogCard.astro        # 文章卡片（分类、标签、日期）
│   ├── TableOfContents.astro # 目录导航
│   ├── AuthorInfo.astro      # 作者信息
│   ├── Giscus.astro          # Giscus 评论
│   ├── Crisp.astro           # Crisp 客服
│   ├── Analytics.astro       # Google Analytics
│   ├── Prose.astro           # 文章排版容器
│   └── react/                # React 交互组件（暗色模式、语言切换、移动导航）
├── pages/
│   ├── index.astro           # 首页（English，默认语言）
│   ├── about.astro           # 关于页面
│   ├── page/                 # 分页
│   ├── posts/
│   │   ├── [slug].astro      # 文章详情
│   │   └── [slug].md.ts      # 文章 Markdown 端点（AI 友好）
│   ├── og/                   # 动态 OG 图片生成
│   ├── rss.xml.ts            # RSS 订阅
│   ├── llms.txt.ts           # llms.txt 端点
│   ├── llms-full.txt.ts      # llms-full.txt 端点
│   ├── skill.md.ts           # AI skill 端点
│   ├── api/
│   │   └── posts.json.ts     # 文章 JSON API
│   └── {locale}/             # 各语言页面
├── content/
│   └── posts/
│       └── {locale}/*.md     # 各语言文章
└── styles/
    └── global.css            # Tailwind CSS v4 @theme 设计令牌 + 基础样式
public/
├── favicon.svg
├── robots.txt
├── opensearch.xml
└── .well-known/
.github/
└── workflows/
    └── deploy-github-pages.yml     # GitHub Pages 部署（默认）
```

## 部署

### GitHub Pages（默认）

内置工作流自动部署：

1. 在仓库 **Settings** > **Pages** 中，Source 选择 **GitHub Actions**
2. 在 `astro.config.mjs` 中设置 `site` 为你的 GitHub Pages URL
3. 推送到 `main` 分支——站点自动部署

### 其他平台

输出是 `dist/` 中的纯静态 HTML，可以部署到任何平台：

```bash
pnpm build
# 将 dist/ 上传到 Netlify、Vercel 或任何静态托管服务
```

## 设计哲学

1. **排版即设计** -- 无衬线字体系统（Bricolage Grotesque + system-ui），精心调校的阅读节奏。字体*就是*视觉识别。
2. **文字即美** -- 排版精良的文字在安静的页面上，就是最优雅的界面。
3. **全球化** -- 跨平台字体堆栈，CJK 智能回退（PingFang SC、Microsoft YaHei）。零网络字体加载，零布局偏移。
4. **AI 原生** -- 内置 llms.txt、结构化端点和机器可读内容，让 AI Agent 能直接理解你的内容。
5. **精巧不复杂** -- 一个配置文件（`src/config/site.ts`）控制整个站点。

## 致谢

灵感来自 [yinwang.org](https://www.yinwang.org)。

## 贡献

欢迎贡献。请先开 issue 讨论你想要的改动。

## 许可证

[MIT](LICENSE)

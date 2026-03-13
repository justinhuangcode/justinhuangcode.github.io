---
title: ✨ 为什么选择 Astro-Theme-Aither
date: 2026-01-03
category: Design
description: 一个相信文字本身就很美的 AI 原生 Astro 主题。
tags: [Design, Astro]
pinned: true
---

一个相信文字本身就很美的 AI 原生 Astro 主题。

## 设计理念

极简设计，不极简工程。当页面上没有花哨的视觉元素来掩盖问题时，任何瑕疵都会被放大。极简设计对工程质量的要求更高，而不是更低。

排版参数遵循 Apple 人机界面指南：17px / 1.47 / -0.022em。全站统一无衬线系统字体栈。字体本身就是视觉标识。

## AI 原生

为 AI agent 时代而生。每个页面都天然可被机器阅读：

- **llms.txt** — AI agent 内容索引，`/llms.txt`
- **llms-full.txt** — 全文输出，`/llms-full.txt`
- **Markdown 端点** — 任何文章 URL 后加 `.md` 获取源文件
- **JSON-LD** — 每篇文章的 Article 结构化数据
- **robots.txt** — 明确欢迎 GPTBot、ClaudeBot、PerplexityBot

你的内容不只是发布了——它是 AI 可发现的。

## 基于 Astro

Astro 的岛屿架构意味着只有交互组件加载 JavaScript。其他一切都是静态 HTML 和 CSS，瞬间加载。

交互式岛屿：主题切换器（View Transitions API 圆形展开动画）、语言切换器、浏览器语言检测、移动端导航。

## 功能

- **Tailwind CSS v4** — `@theme` 设计令牌，完整明暗主题定制
- **i18n** — 多语言支持，自动浏览器语言检测
- **文章置顶** — 将重要文章固定在列表顶部
- **深色模式** — 浅色 / 深色 / 系统，View Transitions API 动画
- **Content Collections** — 构建时类型安全 Markdown 验证
- **SEO** — Open Graph、规范 URL、Twitter Cards
- **RSS + 站点地图** — 自动生成，零配置
- **Google Analytics / Crisp Chat / Giscus** — 可选，通过 `.env` 配置
- **Vitest + Playwright** — 单元 + E2E 测试，集成 CI
- **部署** — GitHub Pages（默认）+ Cloudflare Pages（可选）

## 适合谁

如果你相信好的文字自己会说话：

- **博客作者** — 想让文字成为绝对主角
- **技术写作者** — 需要清晰的代码块和内容结构
- **多语言作者** — 需要内置 i18n 和语言检测
- **开发者** — 欣赏工程质量过硬、可放心扩展的代码库

写任何话题——排版会让它看起来很好。

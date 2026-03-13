---
title: ✨ 為什麼選擇 Astro-Theme-Aither
date: 2026-01-03
category: Design
description: 一個相信文字本身就很美的 AI 原生 Astro 主題。
tags: [Design, Astro]
pinned: true
---

一個相信文字本身就很美的 AI 原生 Astro 主題。

## 設計理念

極簡設計，不極簡工程。當頁面上沒有花俏的視覺元素來掩蓋問題時，任何瑕疵都會被放大。極簡設計對工程品質的要求更高，而不是更低。

排版參數遵循 Apple 人機介面指南：17px / 1.47 / -0.022em。全站統一無襯線系統字型棧。字型本身就是視覺標識。

## AI 原生

為 AI agent 時代而生。每個頁面都天然可被機器閱讀：

- **llms.txt** — AI agent 內容索引，`/llms.txt`
- **llms-full.txt** — 全文輸出，`/llms-full.txt`
- **Markdown 端點** — 任何文章 URL 後加 `.md` 取得源檔案
- **JSON-LD** — 每篇文章的 Article 結構化資料
- **robots.txt** — 明確歡迎 GPTBot、ClaudeBot、PerplexityBot

你的內容不只是發布了——它是 AI 可發現的。

## 基於 Astro

Astro 的島嶼架構意味著只有互動元件載入 JavaScript。其他一切都是靜態 HTML 和 CSS，瞬間載入。

互動式島嶼：主題切換器（View Transitions API 圓形展開動畫）、語言切換器、瀏覽器語言偵測、行動端導覽。

## 功能

- **Tailwind CSS v4** — `@theme` 設計令牌，完整明暗主題自訂
- **i18n** — 多語言支援，自動瀏覽器語言偵測
- **文章置頂** — 將重要文章固定在列表頂部
- **深色模式** — 淺色 / 深色 / 系統，View Transitions API 動畫
- **Content Collections** — 建構時型別安全 Markdown 驗證
- **SEO** — Open Graph、規範 URL、Twitter Cards
- **RSS + 網站地圖** — 自動產生，零設定
- **Google Analytics / Crisp Chat / Giscus** — 可選，透過 `.env` 設定
- **Vitest + Playwright** — 單元 + E2E 測試，整合 CI
- **部署** — GitHub Pages（預設）+ Cloudflare Pages（可選）

## 適合誰

如果你相信好的文字自己會說話：

- **部落客** — 想讓文字成為絕對主角
- **技術寫作者** — 需要清晰的程式碼區塊和內容結構
- **多語系作者** — 需要內建 i18n 和語言偵測
- **開發者** — 欣賞工程品質過硬、可放心擴展的程式碼庫

寫任何話題——排版會讓它看起來很好。

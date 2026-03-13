---
title: ✨ Mengapa Astro-Theme-Aither
date: 2026-01-03
category: Design
description: Tema Astro AI-native yang percaya teks itu sendiri sudah indah.
tags: [Design, Astro]
pinned: true
---

Tema Astro AI-native yang percaya teks itu sendiri sudah indah. Astro-Theme-Aither dibangun untuk pembaca yang datang demi kata-kata, bukan dekorasi.

## Filosofi Desain

Kebanyakan tema blog berkompetisi untuk perhatian dengan gambar hero, animasi, sidebar, dan popup. Semua itu tidak membantu membaca — mereka membantu melihat, yang merupakan aktivitas berbeda.

Astro-Theme-Aither mengambil pendekatan sebaliknya: desain minimal, bukan engineering minimal. Ketika tidak ada visual mencolok yang mengalihkan dari masalah, setiap cacat tipografi, setiap keterlambatan loading diperkuat. Desain minimal menuntut kualitas engineering yang lebih tinggi.

## Tipografi

Typeface adalah identitas visual. Setiap halaman menggunakan stack font sistem sans-serif yang konsisten. Parameter tipografi mengikuti Apple Human Interface Guidelines:

- **Ukuran font** — basis 17px
- **Line height** — 1.47
- **Letter spacing** — -0.022em
- **Skala heading** — 31px → 22px → 19px → 17px
- **Lebar baca** — dibatasi 65–75 karakter per baris

## Dibangun di Atas Astro

Astro menghasilkan HTML statis secara default. Arsitektur islands berarti komponen interaktif melakukan hydrate secara independen sementara sisanya tetap statis.

Island interaktif di Astro-Theme-Aither minimal:

- **Theme switcher** — toggle Light / Dark / System dengan animasi View Transitions API
- **Language switcher** — perpindahan lokal mulus dengan persistence localStorage
- **Deteksi lokal** — deteksi otomatis bahasa browser
- **Navigasi mobile** — menu hamburger responsif

## Fitur

- **Tailwind CSS v4** — token desain `@theme`
- **Tipografi Apple HIG** — parameter teks body 17px / 1.47 / -0.022em
- **View Transitions API** — animasi circular reveal untuk switching tema
- **i18n** — dukungan multi-bahasa
- **Post pinning** — pin post penting ke atas
- **Content Collections** — Markdown type-safe
- **Mode gelap** — Light / Dark / System
- **SEO** — Open Graph, URL kanonik
- **RSS + Sitemap** — otomatis
- **Google Analytics** — opsional, di Partytown Web Worker
- **Testing** — Vitest + Playwright
- **Cloudflare Pages** — workflow deploy dengan PR preview

## Untuk Siapa Ini

- **Blogger personal** yang ingin tulisan mereka jadi pusat perhatian
- **Penulis teknis** yang butuh rendering blok kode yang baik
- **Penulis multibahasa** yang butuh i18n bawaan
- **Developer** yang menghargai codebase yang well-engineered

Tulis tentang apa saja — tipografi akan membuatnya terlihat bagus.

---
title: 👋 Halo Dunia
date: 2026-01-01
category: Tutorial
description: Selamat datang di Astro-Theme-Aither — tema blog yang mengutamakan tipografi
tags: [Hello, Astro]
pinned: true
---

Selamat datang di Astro-Theme-Aither.

Ini adalah tema blog yang dibangun atas satu keyakinan: tulisan yang baik layak mendapat tipografi yang baik. Font sans-serif, ritme baca yang bersih, dan tata letak yang tidak menghalangi. Semuanya di sini melayani satu tujuan — membuat kata-kata Anda terlihat dan terasa indah.

## Mengapa Tema Blog Lagi

Web penuh dengan tema blog, jadi pertanyaan yang wajar: mengapa membuat yang lain? Jawabannya ada pada prioritas. Kebanyakan tema mengoptimalkan dampak visual — gambar hero besar, tata letak kompleks, transisi animasi. Ini terlihat memukau di demo tapi menghalangi saat seseorang benar-benar duduk membaca artikel 2.000 kata.

Astro-Theme-Aither dimulai dari premis berbeda. Konten adalah produknya. Tugas tema adalah menyajikan konten itu dengan perhatian yang layak.

Filosofi ini juga berlaku untuk keputusan teknis. Tema ini mengirim sekitar 0,5 KB JavaScript sisi klien — cukup untuk toggle tema. Sisanya adalah HTML dan CSS statis. Tidak ada pergeseran layout, spinner loading, atau framework JavaScript yang melakukan hydration di latar belakang.

## Memulai

1. **Clone repositori** — gunakan tombol template GitHub atau clone langsung dengan `git clone`
2. **Install dependensi** — jalankan `pnpm install`
3. **Konfigurasi situs** — edit `src/config/site.ts`
4. **Ganti konten sampel** — ganti post di `src/content/posts/` dengan file Markdown Anda
5. **Mulai development** — jalankan `pnpm dev`
6. **Deploy** — push ke GitHub dan biarkan CI workflow menangani deployment ke Cloudflare Pages

### Struktur Proyek

```
src/
├── components/     # Komponen Astro yang dapat digunakan ulang
├── config/         # Konfigurasi situs
├── content/        # Post Markdown dan konten Anda
├── layouts/        # Layout halaman (Layout.astro)
├── pages/          # Halaman route
└── styles/         # CSS global dengan token Tailwind v4
```

### Menulis Post Pertama

Buat file `.md` baru di `src/content/posts/` dengan frontmatter berikut:

```markdown
---
title: Judul Post Anda
date: 2026-01-15
category: General
description: Ringkasan singkat untuk SEO dan preview sosial
tags: [Topic, Another]
---

Konten Anda dimulai di sini.
```

## Yang Anda Dapatkan

### Fitur Konten

- **RSS feed** — otomatis di `/rss.xml`
- **Sitemap** — otomatis via `@astrojs/sitemap`
- **Tag meta SEO** — Open Graph, Twitter cards, URL kanonik
- **Mode gelap** — toggle tiga arah (Terang / Gelap / Sistem) dengan persistence `localStorage`
- **Halaman kategori dan tag** — arsip terorganisir

### Fitur Developer

- **TypeScript** — mode strict, komponen dan utilitas bertipe penuh
- **Content Collections** — Markdown type-safe dengan validasi frontmatter
- **Tailwind CSS v4** — token desain `@theme`
- **Vitest + Playwright** — unit test dan E2E test terintegrasi di CI
- **Cloudflare Pages** — workflow deployment dengan URL preview PR

### Performa

Karena tema menghasilkan HTML statis dengan JavaScript minimal, performa sangat baik secara default. Harapkan skor Lighthouse 100 di semua kategori.

## Kustomisasi

- **Warna** — edit custom properties CSS di `src/styles/global.css`
- **Font** — ganti nilai font-family di konfigurasi tema Tailwind
- **Navigasi** — update array link navigasi di `src/config/site.ts`
- **Analytics** — tambahkan ID Google Analytics di konfigurasi situs

## Catatan tentang Filosofi Desain

Kesederhanaan visual tema ini disengaja, tapi bukan berarti kesederhanaan teknis. Di balik layar, tema ini menangani banyak hal: skala tipografi responsif, rasio kontras warna yang aksesibel, struktur HTML semantik yang benar, dan perhatian cermat pada pengalaman baca di semua ukuran layar.

Desain yang baik tidak terlihat. Saat Anda membaca artikel dengan tema ini dan hanya menikmati tulisannya tanpa menyadari temanya — itulah desain bekerja seperti yang dimaksudkan.

Selamat menulis.

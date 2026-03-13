---
title: 📝 Panduan Gaya Markdown
date: 2026-01-02
category: Tutorial
description: Panduan lengkap semua fitur Markdown yang didukung di Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Post ini mendemonstrasikan setiap fitur Markdown yang didukung oleh Astro-Theme-Aither. Gunakan sebagai referensi saat menulis post Anda sendiri. Bookmark halaman ini — panduan ini mencakup seluruh opsi pemformatan yang tersedia.

## Heading

Gunakan `##` untuk heading seksi, `###` untuk subseksi, dan `####` untuk sub-subseksi. Hindari `#` dalam konten post — judul post sudah dirender sebagai heading level atas.

### Heading Level Ketiga

Heading level ketiga ideal untuk memecah seksi menjadi topik-topik yang berbeda. Mereka menciptakan hierarki visual tanpa terlalu menonjol.

#### Heading Level Keempat

Heading level keempat cocok untuk subseksi yang lebih detail. Gunakan dengan hemat — jika outline Anda lebih dalam dari empat level, pertimbangkan untuk merestrukturisasi konten Anda.

### Praktik Terbaik Heading

Beberapa panduan untuk penggunaan heading yang efektif:

- **Jangan lewati level** — dari `##` ke `###`, jangan dari `##` langsung ke `####`. Melewati level merusak outline dokumen dan bisa membingungkan screen reader.
- **Buat heading deskriptif** — "Konfigurasi" lebih baik dari "Hal-hal Setup". Pembaca memindai heading sebelum memutuskan apakah akan membaca suatu seksi.
- **Gunakan sentence case** — hanya kapitalisasi kata pertama dan nama proper.

## Paragraf dan Line Break

Teks paragraf mengalir secara natural. Sisakan baris kosong antar paragraf untuk memisahkannya.

Ini adalah paragraf kedua. Jaga paragraf tetap fokus pada satu ide untuk pengalaman membaca terbaik.

Saat menulis untuk web, paragraf yang lebih pendek cenderung bekerja lebih baik dari blok teks yang panjang. Paragraf tiga hingga lima kalimat adalah unit membaca yang nyaman di layar. Jika paragraf melebihi enam atau tujuh kalimat, pertimbangkan untuk memecahnya.

Line break tunggal dalam paragraf (tanpa baris kosong) akan diperlakukan sebagai spasi, bukan baris baru. Jika Anda membutuhkan line break keras tanpa paragraf baru, akhiri baris dengan dua spasi atau gunakan tag `<br>` — meskipun ini jarang diperlukan dalam praktik.

## Penekanan

- **Teks tebal** dengan `**tanda bintang ganda**`
- *Teks miring* dengan `*tanda bintang tunggal*`
- ***Tebal dan miring*** dengan `***tanda bintang tiga***`
- ~~Coret~~ dengan `~~tilde ganda~~`

### Kapan Menggunakan Setiap Gaya

**Tebal** paling cocok untuk istilah kunci, peringatan penting, atau definisi — apapun yang tidak boleh terlewat pembaca bahkan saat memindai. Gunakan untuk frasa paling penting dalam paragraf, bukan untuk seluruh kalimat.

*Miring* untuk penekanan dalam kalimat, judul buku dan publikasi, istilah teknis saat penggunaan pertama, dan frasa asing. Memberikan penekanan lebih ringan dari tebal.

~~Coret~~ berguna untuk menunjukkan koreksi, informasi yang sudah usang, atau item yang selesai dalam changelog. Memiliki cakupan penggunaan yang lebih sempit tapi berharga saat dibutuhkan.

## Link

[Link inline](https://astro.build) dengan sintaks `[teks](url)`.

Link juga bisa mereferensikan post lain di situs Anda menggunakan path relatif. Gunakan teks link yang deskriptif — "baca panduan markdown" lebih baik dari "klik di sini." Teks link yang baik membantu pembaca dan mesin pencari memahami ke mana link mengarah.

Anda juga bisa membuat link yang terbaca alami dalam konteks kalimat. Misalnya: [dokumentasi Astro](https://docs.astro.build) mencakup setiap fitur secara detail.

## Daftar

Daftar tak berurutan:

- Item pertama
- Item kedua
  - Item bersarang
  - Item bersarang lain
- Item ketiga

Daftar berurutan:

1. Langkah pertama
2. Langkah kedua
   1. Sub-langkah satu
   2. Sub-langkah dua
3. Langkah ketiga

Daftar tugas:

- [x] Setup proyek
- [x] Tulis post pertama
- [ ] Deploy ke produksi

### Tips Format Daftar

Daftar adalah salah satu alat paling efektif dalam penulisan web. Mereka memecah teks padat, membuat informasi bisa dipindai, dan mengkomunikasikan urutan atau koleksi item dengan jelas.

**Gunakan daftar tak berurutan** saat item tidak memiliki urutan inheren — fitur, persyaratan, opsi, atau contoh.

**Gunakan daftar berurutan** saat urutan penting — langkah dalam proses, item berperingkat, atau instruksi yang harus diikuti secara berurutan.

**Gunakan daftar tugas** untuk melacak kemajuan, checklist proyek, atau item to-do.

Jaga item daftar parallel dalam struktur. Jika item pertama dimulai dengan kata kerja, semua item harus dimulai dengan kata kerja.

## Kutipan

> Tujuan abstraksi bukan untuk menjadi samar, tapi untuk menciptakan level semantik baru di mana seseorang bisa sepenuhnya presisi.
>
> — Edsger W. Dijkstra

Kutipan bersarang:

> Level pertama
>
> > Level kedua
> >
> > > Level ketiga

### Penggunaan Kutipan

Kutipan melayani beberapa tujuan di luar mengutip orang terkenal:

- **Mengutip sumber** — saat mereferensikan artikel, buku, atau dokumen lain
- **Callout** — menyoroti informasi penting atau peringatan
- **Kutipan gaya email** — menunjukkan apa yang seseorang katakan dalam percakapan yang Anda tanggapi
- **Pull quote** — menarik perhatian pada bagian kunci dari artikel Anda sendiri

Saat menggunakan kutipan dengan atribusi, tempatkan nama penulis di baris terpisah didahului dengan tanda dash em, seperti yang ditunjukkan pada contoh Dijkstra di atas.

## Kode

`Kode` inline dengan backtick. Gunakan kode inline untuk nama fungsi seperti `getPublishedPosts()`, path file seperti `src/content/posts/`, instruksi command-line seperti `pnpm dev`, dan nilai literal apapun yang muncul dalam teks berjalan.

Blok kode dengan syntax highlighting:

```typescript
interface Post {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

function getPublishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
```

```css
@theme {
  --font-sans: 'system-ui', sans-serif;
  --font-serif: 'ui-serif', 'Georgia', serif;
}
```

### Tips Blok Kode

Selalu tentukan identifier bahasa setelah triple backtick pembuka. Ini mengaktifkan syntax highlighting, yang secara dramatis meningkatkan keterbacaan. Identifier umum termasuk `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python`, dan `markdown`.

Untuk perintah shell, gunakan `bash` atau `sh`:

```bash
# Install dependensi
pnpm install

# Jalankan server development
pnpm dev

# Build untuk produksi
pnpm build
```

Untuk file konfigurasi JSON:

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

Jaga blok kode tetap fokus. Tampilkan hanya baris yang relevan daripada menempel seluruh file. Jika konteks diperlukan, tambahkan komentar yang menunjukkan di mana kode berada.

## Tabel

| Fitur | Status | Catatan |
|---|---|---|
| Mode gelap | Didukung | Terang / Gelap / Sistem |
| RSS feed | Bawaan | `/rss.xml` |
| Sitemap | Otomatis | Via `@astrojs/sitemap` |
| SEO | Bawaan | Open Graph + canonical |

Kolom rata kanan dan tengah:

| Kiri | Tengah | Kanan |
|:---|:---:|---:|
| Teks | Teks | Teks |
| Teks lebih panjang | Teks lebih panjang | Teks lebih panjang |

### Panduan Tabel

Tabel paling cocok untuk data terstruktur dengan kolom dan baris yang jelas. Ideal untuk perbandingan fitur, opsi konfigurasi, parameter API, dan data referensi.

Jaga tabel tetap sederhana. Jika tabel memiliki lebih dari lima atau enam kolom, akan sulit dibaca di perangkat mobile. Pertimbangkan untuk memecah tabel kompleks menjadi beberapa tabel lebih kecil, atau gunakan format daftar sebagai gantinya.

Perataan kolom dikontrol dengan tanda titik dua di baris pemisah:

- `:---` untuk rata kiri (default)
- `:---:` untuk rata tengah
- `---:` untuk rata kanan

Gunakan rata kanan untuk data numerik agar titik desimal sejajar secara visual.

## Garis Horizontal

Gunakan `---` untuk membuat garis horizontal:

---

Konten setelah garis.

Garis horizontal berguna untuk memisahkan seksi utama post, menandakan pergeseran topik, atau memecah secara visual artikel yang sangat panjang. Gunakan dengan bijak — jika Anda membutuhkan pemisah yang sering, heading mungkin pilihan struktural yang lebih baik.

## Gambar

Gambar didukung dengan sintaks Markdown standar:

```markdown
![Teks alt](./image.jpg)
```

Theme ini berfokus pada tipografi, tapi gambar berfungsi saat Anda membutuhkannya.

### Praktik Terbaik Gambar

- **Selalu sertakan teks alt** — penting untuk aksesibilitas dan juga muncul saat gambar gagal dimuat
- **Gunakan nama file deskriptif** — `dashboard-error-state.png` lebih baik dari `screenshot-2.png`
- **Optimalkan ukuran file** — kompres gambar sebelum menambahkannya ke repositori; gambar besar memperlambat loading halaman
- **Pertimbangkan alur baca** — tempatkan gambar dekat teks yang mereferensikannya, bukan paragraf jauhnya

## Kesimpulan

Fitur Markdown yang dijelaskan dalam panduan ini mencakup sebagian besar yang Anda butuhkan untuk menulis blog. Kunci Markdown yang baik adalah menggunakan elemen yang tepat untuk tujuan yang tepat: heading untuk struktur, penekanan untuk kepentingan, daftar untuk koleksi, blok kode untuk konten teknis, dan paragraf untuk yang lainnya.

Tulis dengan jelas, format dengan konsisten, dan biarkan tipografi bekerja.

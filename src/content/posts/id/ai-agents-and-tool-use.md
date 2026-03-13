---
title: Agen AI dan Penggunaan Alat (Sampel)
date: 2026-01-09
category: AI
description: Bagaimana model AI melampaui chat dengan mengeksekusi aksi di dunia nyata
tags: [AI, Agents]
pinned: false
---

Agen AI adalah model bahasa yang bisa mengambil tindakan — bukan sekadar menghasilkan teks. Ia bisa mencari di web, menjalankan kode, memanggil API, membaca file, dan memutuskan apa yang harus dilakukan selanjutnya. Pergeseran dari generasi teks pasif ke pemecahan masalah aktif ini merupakan salah satu perkembangan paling signifikan dalam AI terapan.

## Dari Chat ke Aksi

Chatbot menjawab pertanyaan. Agen memecahkan masalah. Perbedaannya adalah otonomi: agen memutuskan alat mana yang digunakan, dalam urutan apa, dan bagaimana menangani error.

Pertimbangkan perbedaannya dalam praktik. Anda bertanya ke chatbot: "Bagaimana cuaca di Tokyo?" Ia mungkin menjawab berdasarkan data pelatihannya — yang berumur berbulan-bulan atau bertahun-tahun dan hampir pasti salah. Anda bertanya hal yang sama ke agen, dan ia memanggil API cuaca, mengambil data terkini, dan mengembalikan jawaban yang akurat dan terbaru.

Chatbot menghasilkan teks yang masuk akal. Agen berinteraksi dengan dunia.

### Spektrum Otonomi

Tidak semua agen sama otonomnya. Ada spektrum:

1. **Chat berbantuan alat** — model bisa memanggil alat, tapi hanya sebagai respons langsung terhadap permintaan pengguna. Satu panggilan alat per giliran.
2. **Agen multi-langkah** — model bisa merangkai beberapa panggilan alat untuk menyelesaikan tugas, memutuskan urutannya sendiri.
3. **Agen sepenuhnya otonom** — model beroperasi secara independen dalam periode yang diperpanjang, membuat keputusan, menangani error, dan mengejar tujuan dengan pengawasan manusia minimal.

Sebagian besar sistem produksi saat ini berada di level 1-2. Agen sepenuhnya otonom adalah area penelitian aktif dengan tantangan keamanan signifikan yang masih harus dipecahkan.

## Penggunaan Alat

Tool use memungkinkan model AI memanggil fungsi eksternal. Model memutuskan kapan alat dibutuhkan, menghasilkan parameter yang tepat, dan menggabungkan hasilnya ke dalam responsnya. Ini mengubah generator teks menjadi asisten yang kapabel.

### Cara Kerja Tool Use

Mekanikanya sederhana:

1. **Definisi alat** — Anda mendeskripsikan alat yang tersedia ke model, termasuk nama, parameter, dan fungsinya. Ini biasanya disediakan sebagai JSON terstruktur dalam system prompt atau melalui field API khusus.
2. **Keputusan** — saat memproses permintaan pengguna, model memutuskan apakah alat akan membantu. Jika ya, ia menghasilkan panggilan alat dengan parameter yang sesuai.
3. **Eksekusi** — aplikasi Anda mengeksekusi panggilan alat (model tidak mengeksekusinya langsung) dan mengembalikan hasilnya.
4. **Integrasi** — model menggabungkan hasil alat ke dalam responsnya kepada pengguna.

### Contoh Definisi Alat

```json
{
  "name": "search_documentation",
  "description": "Search the product documentation for relevant articles",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "default": 5
      }
    },
    "required": ["query"]
  }
}
```

Model melihat definisi ini dan tahu ia bisa mencari dokumentasi. Ketika pengguna mengajukan pertanyaan produk, model menghasilkan panggilan seperti `search_documentation(query="how to reset password")`, sistem Anda mengeksekusi pencarian, dan model menggunakan hasilnya untuk menyusun jawaban yang akurat.

### Kategori Alat Umum

Sistem agen produksi biasanya menawarkan alat dalam beberapa kategori:

- **Pengambilan informasi** — pencarian web, kueri database, pembacaan file, panggilan API
- **Eksekusi kode** — menjalankan Python, JavaScript, atau perintah shell dalam lingkungan sandbox
- **Komunikasi** — mengirim email, memposting pesan, membuat tiket
- **Manipulasi file** — membuat, mengedit, dan mengorganisasi file
- **Operasi sistem** — mendeploy kode, mengelola infrastruktur, menjalankan pipeline CI

Alat yang Anda sediakan mendefinisikan batas dari apa yang bisa dilakukan agen. Satu set alat yang dirancang dengan baik memberikan agen kemampuan yang cukup untuk berguna tanpa kekuatan yang cukup untuk berbahaya.

## Loop Agentik

Pola paling kuat adalah loop agentik: model merencanakan langkah, mengeksekusinya, mengobservasi hasilnya, dan memutuskan langkah berikutnya. Loop ini berlanjut hingga tugas selesai atau model menentukan bahwa ia tidak bisa melanjutkan.

### Loop dalam Praktik

Pertimbangkan agen yang ditugaskan mendebug test yang gagal:

1. **Rencanakan** — "Saya harus membaca file test terlebih dahulu untuk memahami apa yang ditest"
2. **Eksekusi** — memanggil `read_file("tests/auth.test.ts")`
3. **Observasi** — melihat test mengharapkan status 200 tapi mendapat 401
4. **Rencanakan** — "Saya harus memeriksa auth middleware untuk melihat apa yang mengembalikan 401"
5. **Eksekusi** — memanggil `read_file("src/middleware/auth.ts")`
6. **Observasi** — menemukan bug di logika pemeriksaan kedaluwarsa token
7. **Rencanakan** — "Saya harus memperbaiki perbandingan kedaluwarsa"
8. **Eksekusi** — memanggil `edit_file(...)` dengan perbaikan
9. **Observasi** — mengkonfirmasi bahwa perubahan telah dibuat
10. **Rencanakan** — "Saya harus menjalankan test untuk memverifikasi perbaikan"
11. **Eksekusi** — memanggil `run_command("pnpm test tests/auth.test.ts")`
12. **Observasi** — test lulus
13. **Selesai** — melaporkan perbaikan kepada pengguna

Setiap langkah melibatkan model yang berpikir tentang keadaan saat ini, memutuskan apa yang harus dilakukan selanjutnya, dan beradaptasi berdasarkan apa yang ditemukannya. Ini secara fundamental berbeda dari skrip linear — agen menangani temuan tak terduga dan mengubah arah saat diperlukan.

### Menangani Error dalam Loop

Agen yang robust harus menangani kegagalan dengan elegan. Alat mungkin mengembalikan error, file mungkin tidak ada, atau API mungkin dibatasi rate-nya. Desain agen yang baik mencakup:

- **Logika retry** — coba ulang kegagalan transien dengan backoff
- **Strategi alternatif** — jika satu pendekatan gagal, coba yang lain
- **Degradasi graceful** — jika tugas tidak bisa diselesaikan sepenuhnya, selesaikan sebanyak mungkin dan jelaskan apa yang tersisa
- **Batas loop** — tetapkan jumlah iterasi maksimum untuk mencegah loop tak terbatas saat agen terjebak

## Merancang Alat yang Efektif

Kualitas sistem agen sangat bergantung pada kualitas alatnya. Alat yang dirancang buruk menghasilkan agen yang bingung dan hasil yang salah.

### Prinsip Desain Alat

- **Nama jelas** — `search_users` lebih baik dari `query_db_1`. Model menggunakan nama untuk memutuskan kapan memanggil alat.
- **Parameter deskriptif** — sertakan deskripsi untuk setiap parameter. Model membaca deskripsi ini untuk menentukan nilai apa yang harus dikirim.
- **Fokus sempit** — setiap alat harus melakukan satu hal dengan baik. Alat `read_file` dan alat `write_file` lebih baik dari alat `file_operations` dengan parameter mode.
- **Error berguna** — kembalikan pesan error yang jelas yang membantu model memahami apa yang salah dan apa yang harus dicoba selanjutnya.
- **Idempoten bila mungkin** — alat yang bisa dicoba ulang dengan aman menyederhanakan penanganan error.

## Risiko

Agen yang bisa mengambil tindakan bisa mengambil tindakan yang salah. Sandboxing, langkah konfirmasi, dan review manusia adalah langkah keamanan esensial untuk setiap sistem agen produksi.

### Kategori Risiko

- **Aksi destruktif** — agen dengan akses sistem file bisa menghapus file penting. Agen dengan akses database bisa menghapus tabel. Lingkungan sandbox dan batas permission sangat penting.
- **Eksfiltrasi data** — agen yang bisa membaca data sensitif dan membuat permintaan jaringan bisa secara tidak sengaja (atau melalui prompt injection) membocorkan informasi.
- **Biaya tak terkendali** — agen dalam loop yang memanggil API mahal bisa menumpuk biaya signifikan dengan cepat. Batas anggaran dan rate limiting adalah kebutuhan praktis.
- **Aksi salah yang dilakukan dengan percaya diri** — agen mungkin salah memahami permintaan dan mengambil aksi yang tidak bisa dibatalkan. Untuk operasi berisiko tinggi, selalu minta konfirmasi manusia.

### Pola Keamanan

Sistem agen produksi harus mengimplementasikan beberapa pola keamanan:

1. **Privilege minimum** — berikan agen hanya alat yang dibutuhkan untuk tugas spesifiknya, tidak lebih
2. **Sandboxing** — eksekusi kode dan operasi file dalam lingkungan terisolasi
3. **Gerbang konfirmasi** — minta persetujuan manusia untuk aksi destruktif atau tidak bisa dibatalkan
4. **Audit logging** — catat setiap panggilan alat dan hasilnya untuk review
5. **Kill switch** — sediakan mekanisme untuk segera menghentikan agen yang sedang berjalan
6. **Batas anggaran** — tetapkan batas keras untuk panggilan API, penggunaan token, dan waktu komputasi

Tujuannya bukan untuk mencegah agen menjadi berguna — tetapi untuk memastikan mereka berguna dalam batas-batas yang terdefinisi dengan baik.

# Portofolio Alya Khairunnisa

Website portofolio pribadi yang menampilkan profil, keahlian, pengalaman, sertifikasi, dan proyek Alya Khairunnisa.

## Fitur

- Halaman profil, tech stack, perjalanan dan penghargaan.
- Showcase proyek dengan filter kategori dan detail case study.
- Preview gambar proyek melalui lightbox.
- Interaksi scrapbook, efek suara, sparkle trail, dan guestbook.
- Layout responsif untuk desktop dan perangkat mobile.

## Teknologi

- PHP untuk menyusun halaman dari file include.
- HTML, CSS, dan JavaScript untuk tampilan serta interaksi.
- SVG dan gambar di folder `assets/images/`.

## Menjalankan secara lokal

Pastikan PHP tersedia, lalu buka terminal di folder proyek dan jalankan:

```powershell
php -S localhost:8000
```

Buka `http://localhost:8000` di browser. Hentikan server dengan `Ctrl+C`.

## Struktur proyek

```text
.
├── index.php
├── includes/
│   ├── header.php
│   ├── about.php
│   ├── skills.php
│   ├── experiences.php
│   ├── projects.php
│   ├── guestbook.php
│   ├── footer.php
│   └── modals.php
├── assets/
│   └── images/
├── style.css
└── script.js
```

## Deployment

Deploy ke layanan hosting yang mendukung PHP. GitHub Pages hanya menyajikan file statis dan tidak menjalankan `index.php`.

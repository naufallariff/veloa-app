# ✨ Veloa — Learn Languages Through Patterns & Nuance

**Platform pembelajaran multibahasa interaktif berbasis pola kognitif, _Active Recall_, dan _Spaced Repetition (SM-2)_ dengan antarmuka Bento Grid modern.**

[Tentang](https://www.google.com/search?q=%23-tentang-veloa) •
[Kurikulum](https://www.google.com/search?q=%23-cakupan-kurikulum-5-bahasa) •
[Pedagogi 6-Kartu](https://www.google.com/search?q=%23-pedagogi-6-kartu-terstruktur) •
[Fitur Unggulan](https://www.google.com/search?q=%23-fitur-unggulan) •
[Arsitektur](https://www.google.com/search?q=%23-arsitektur-proyek) •
[Instalasi](https://www.google.com/search?q=%23-instalasi--pengembangan)

---

## 🌟 Tentang Veloa

**Veloa** bukan sekadar aplikasi hafalan kosakata biasa—melainkan sebuah **Linguistic Studio** yang dirancang untuk membantu pembelajar memahami **cara berpikir penutur asli** (_native mindset_).

Alih-alih menerjemahkan kata demi kata secara kaku, Veloa membedah setiap topik bahasa melalui **Peta Kurikulum Bercabang**, **Matriks Aksara Interaktif**, **Tabel Pola Kognitif**, serta **Simulasi Dialog** dengan pelafalan audio kecepatan normal maupun lambat (`0.72x`).

---

## 🌍 Cakupan Kurikulum 5 Bahasa

Setiap bahasa disusun mengikuti standar kemahiran internasional dengan jalur pembelajaran paralel (**Pondasi → Jenjang Utama → Sastra & Retorika**):

| Kode     | Bahasa       | Aksara Asli | Standar Kerangka | Fokus Pilar Linguistik                                      |
| -------- | ------------ | ----------- | ---------------- | ----------------------------------------------------------- |
| **`EN`** | **English**  | `English`   | **CEFR A1–C2**   | Fonetik IPA, Sintaksis Klausa, Leksikon & Stilistika Sastra |
| **`ZH`** | **Mandarin** | `普通话`    | **HSK 1–6**      | Radikal Hanzi, Kontur Nada Pinyin, Struktur Topik-Komen     |
| **`JA`** | **Jepang**   | `日本語`    | **JLPT N5–N1**   | Hiragana/Katakana/Kanji, Sistem Partikel & Ragam Keigo      |
| **`AR`** | **Arab**     | `العربية`   | **Naḥwu & CEFR** | Huruf Hijaiyah & Harakat, Ṣarf (Morfologi Akar) & I‘rāb     |
| **`KO`** | **Korea**    | `한국어`    | **TOPIK I–II**   | Blok Suku Kata Hangeul, Hukum Asimilasi Bunyi & Honorifik   |

---

## 🧩 Pedagogi 6-Kartu Terstruktur

Setiap modul pelajaran di dalam **Lesson Engine** otomatis diperkaya menjadi **6 Kartu Pembelajaran Progresif** yang dapat ditandai paham satu per satu:

---

## 🚀 Fitur Unggulan

### 🎨 1. Antarmuka Bento Grid & Apple-Style Chrome

- **Kanvas Desktop Lega (`1480px`):** Tata letak _Bento Grid_ 12-kolom dengan ruang napas proporsional di layar lebar maupun perangkat seluler.
- **Floating Translucent Navbar:** Bilah navigasi mengambang bergaya kaca yang otomatis bersembunyi saat halaman digulir ke bawah dan muncul kembali saat digulir ke atas, lengkap dengan kontrol kontekstual saat berada di dalam modul.
- **Collapsible Desktop Sidebar:** Navigasi samping yang dapat dilipat (`w-64` ↔ `w-18.5`) dan otomatis menyesuaikan mode fokus saat membaca materi.
- **Toggle Fonetik Instan (`Fonetik: On/Off`):** Sembunyikan Pinyin, Furigana, Harakat/Transliterasi, atau Romanisasi kapan saja untuk menguji kemampuan membaca aksara asli.

### 🧠 2. Active Recall & Spaced Repetition (SM-2)

- **Active Recall Arena:** Menghasilkan 10 soal latihan acak (_Recognition_, _Audio Listening / Dictation_, dan _Reading_) secara dinamis dari isi modul yang sedang dipelajari.
- **Algoritma Memori SM-2:** Menjadwalkan ulang kaji kosakata dan pola yang tersimpan di **Knowledge Library (Study Vault)** tepat sebelum kurva lupa menurun.
- **Gamifikasi Real-Time:** Pelacakan **XP**, **Level**, **Daily Streak**, serta pemetaan kompetensi pada **My Progress**.

### 🔐 3. Arsitektur Multi-Role & PWA Offline

- **Mode Tamu (Guest):** Langsung belajar tanpa login; progres tersimpan aman di penyimpanan lokal perangkat.
- **Member:** Sinkronisasi cloud lintas perangkat, kustomisasi avatar, dan penguncian _streak_.
- **Curator (`Content Studio`):** Ruang kerja penyusunan modul kurikulum, narasi pemandu Veloa, dan blok materi interaktif.
- **Superadmin (`Admin Console`):** Manajemen pengguna terdaftar, peran akses, serta pemantauan XP global.
- **Offline-First PWA:** Dukungan _Service Worker_ & _Prefetching_ modul berikutnya saat kursor diarahkan ke kartu pelajaran.

---

## 🏗️ Arsitektur Proyek

```text
veloa/
├── public/                        # Aset statis, ikon PWA & manifest
├── src/
│   ├── app/
│   │   └── App.tsx                # Root state, sinkronisasi hash routing & shortcut Ctrl+K
│   ├── content/
│   │   └── curriculum-tree.ts     # Definisi pohon kurikulum bercabang (5 bahasa)
│   ├── features/
│   │   ├── admin/                 # SuperadminConsoleView (manajemen role & pengguna)
│   │   ├── auth/                  # AuthContext, ProtectedRoute, AuthModal & ProfileSettingsView
│   │   ├── lesson-engine/         # LessonPlayerPage, 6-card enrichment, audio & block renderers
│   │   ├── practice-engine/       # ActiveRecallArena, SM-2 SRS modal, Study Vault & Progress
│   │   ├── roadmap-graph/         # HomeDashboardView, LearningHubView & GlobalQuickSearchModal
│   │   └── studio/                # ContentStudioView (editor modul & blok kurikulum)
│   ├── shared/
│   │   ├── hooks/                 # Custom hooks performa (debounce, dll.)
│   │   ├── pwa/                   # Registrasi Service Worker untuk mode offline
│   │   └── ui/                    # AppShellLayout, InteractiveScriptCharts & ErrorPages
│   ├── styles/
│   │   └── globals.css            # Token desain Aurora, Glassmorphism, Light & Dark theme
│   └── main.tsx                   # Entry point aplikasi
└── package.json

```

---

## ⌨️ Pintasan Keyboard & Navigasi Cepat

| Pintasan         | Fungsi                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Ctrl + K / ⌘ + K | Membuka **Global Quick Search** untuk melompat cepat ke modul, aksara, atau topik apa pun |
| 1 – 4            | Memilih opsi jawaban secara cepat di dalam **Active Recall Arena**                        |
| Esc              | Menutup modal pencarian, dropdown bahasa, atau _drawer_ navigasi                          |

---

## 🛠️ Instalasi & Pengembangan

### Prasyarat

- **Node.js** versi `18.x` atau lebih baru
- **npm**, **pnpm**, atau **yarn**

### Langkah Menjalankan Secara Lokal

```bash
# 1. Kloning repositori
git clone https://github.com/username/veloa.git
cd veloa

# 2. Instal seluruh dependensi
npm install

# 3. Jalankan server pengembangan (Vite)
npm run dev

```

Aplikasi akan berjalan secara default di `http://localhost:5173`.

### Build untuk Produksi

```bash
# Kompilasi TypeScript & bundel produksi teroptimasi
npm run build

# Pratinjau hasil build produksi
npm run preview

```

---

<sub>Dirancang dengan presisi linguistik dan estetika modern untuk pembelajar bahasa di seluruh dunia. ✨</sub>
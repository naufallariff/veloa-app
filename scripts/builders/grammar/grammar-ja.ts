// scripts/builders/grammar-ja.ts
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';

export const JA_GRAMMAR_MODULES: LessonModule[] = [
    // =========================================================================
    // MODUL 1: RAIL PARTIKEL SOV DASAR (JLPT N5–N4) — BEGINNER
    // =========================================================================
    {
        id: 'ja-02-beg-grammar-core-particles',
        lang: 'ja',
        pillar: 'syntax',
        tier: 'beginner',
        order: 2,
        title: 'JLPT N5–N4 | Joshi (助詞): Rail Partikel SOV Lengkap (は vs が, を, に vs で, へ, の)',
        subtitle:
            'Bedah mendalam tiap partikel penanda fungsi kalimat Jepang yang selalu menempel di belakang kata benda',
        estimatedMinutes: 70,
        blocks: [
            // -------------------- UNIT 1.1: PARTIKEL は (WA) VS が (GA) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.1 Partikel は (wa — Topik) vs が (ga — Subjek Fokus / Informasi Baru)',
                grammaticalTradition: 'Unit 1/3: 係助詞「は」と格助詞「が」 (Struktur Informasi Wacana)',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel & Fungsi', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus & Kondisi Pakai', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Kontras Nuansa', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-wa-topic',
                        cells: {
                            particle: { script: 'は (dibaca wa)', gloss: 'Penanda Topik (Given Information)' },
                            formula: {
                                script: '[Topik Lama / Sudah Diketahui] + は + [Komentar / Predikat]',
                                gloss: 'Membuka panggung pembicaraan: "Adapun mengenai X..."',
                            },
                            example: {
                                script: '私はエンジニアです。 (Watashi wa enjinia desu.)',
                                gloss: 'Tentang saya (topik), saya adalah seorang insinyur.',
                            },
                        },
                        fullTranslation: 'Saya adalah seorang insinyur.',
                    },
                    {
                        id: 'ja-ga-focus',
                        cells: {
                            particle: { script: 'が (ga)', gloss: 'Penanda Subjek Fokus (New Information)' },
                            formula: {
                                script: '[Subjek Baru / Jawaban Kata Tanya] + が + Predikat',
                                gloss: 'Wajib dipakai setelah kata tanya (誰が, 何が) dan kata sifat kemampuan/keinginan (好き, 上手, 分かる)',
                            },
                            example: {
                                script: '誰が来ましたか？ — 田中さんが来ました。',
                                gloss: 'Siapa yang datang? — Tanaka-san-lah yang datang (lampu sorot pada Tanaka).',
                            },
                        },
                        fullTranslation: 'Siapa yang datang? — Tanaka yang datang.',
                    },
                    {
                        id: 'ja-wa-ga-phenomenon',
                        cells: {
                            particle: { script: 'Fenomena Alam & Keberadaan', gloss: 'が untuk persepsi langsung' },
                            formula: {
                                script: '[Fenomena / Benda] + が + 降る / ある / いる',
                                gloss: 'Menyatakan apa yang tertangkap indra seketika tanpa topik sebelumnya',
                            },
                            example: {
                                script: '雨が降っています。 / 机の上に本があります。',
                                gloss: 'Hujan sedang turun. / Di atas meja ada buku.',
                            },
                        },
                        fullTranslation: 'Hujan sedang turun. / Di atas meja ada buku.',
                    },
                ],
                nativeMindset: {
                    headline: 'Rahasia Kognitif は vs が: "Panggung" vs "Lampu Sorot"',
                    psychologyExplanation:
                        'Bayangkan sebuah panggung teater: は menyiapkan latar belakang panggung ("Mengenai pesta kemarin..."), sedangkan が menyorotkan lampu sorot tajam ke aktor yang melakukan tindakan ("...SIAPA yang datang terlambat? Budi-lah yang datang terlambat"). Selain itu, begitu topik ditetapkan dengan は, subjek tidak perlu diulang lagi pada kalimat-kalimat berikutnya.',
                    literalTrap:
                        'Jangan pernah memakai は setelah kata tanya ("誰は来ましたか" — SALAH TOTAL; wajib "誰が来ましたか").',
                },
            },

            // -------------------- UNIT 1.2: PARTIKEL に (NI) VS で (DE) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.2 Partikel に (ni) vs で (de) — Titik Koordinat Statis vs Panggung Aksi Dinamis',
                grammaticalTradition: 'Unit 2/3: 場所格助詞「に」と「で」 (Semantik Spasial & Temporal)',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel & Peran', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus & Jenis Kata Kerja', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-ni-static',
                        cells: {
                            particle: { script: 'に (ni) — Keberadaan, Tujuan & Waktu Spesifik', gloss: 'Titik statis / arah tiba / jadwal jam' },
                            formula: {
                                script: '[Lokasi] + に + いる / ある / 住む | [Tujuan] + に + 行く / 来る | [Jam/Hari] + に',
                                gloss: 'Dipakai bersama kata kerja statis (ada, tinggal) dan perpindahan titik akhir (pergi ke)',
                            },
                            example: {
                                script: '私は東京に住んでいます。明日七時に会社に行きます。',
                                gloss: 'Saya tinggal di Tokyo (statis). Besok jam 7 (waktu spesifik) pergi ke kantor (tujuan).',
                            },
                        },
                        fullTranslation: 'Saya tinggal di Tokyo. Besok jam 7 pergi ke kantor.',
                    },
                    {
                        id: 'ja-de-action',
                        cells: {
                            particle: { script: 'で (de) — Panggung Aktivitas & Alat/Sarana', gloss: 'Tempat berlangsungnya aksi aktif / instrumen' },
                            formula: {
                                script: '[Lokasi Aksi] + で + [Kata Kerja Dinamis] | [Alat / Bahasa / Transportasi] + で',
                                gloss: 'Makan, belajar, bekerja, membeli, dan bertemu semuanya memakai で',
                            },
                            example: {
                                script: '図書館で日本語でレポートを書きます。電車で行きます。',
                                gloss: 'Di perpustakaan (lokasi aksi) menulis laporan dengan bahasa Jepang (sarana). Pergi naik kereta.',
                            },
                        },
                        fullTranslation: 'Saya menulis laporan dalam bahasa Jepang di perpustakaan. Saya pergi naik kereta.',
                    },
                ],
                nativeMindset: {
                    headline: 'Tes 1 Detik: Apakah Kata Kerjanya Hanya "Ada/Tinggal/Tiba" atau "Beraktivitas"?',
                    psychologyExplanation:
                        'Jika subjek hanya berada di titik koordinat itu atau mendarat di sana (いる, ある, 住む, 着く), pakai に. Jika subjek melakukan aksi aktif yang menghabiskan energi di dalam ruangan/tempat itu (勉強する, 食べる, 働く), pakai で.',
                    literalTrap:
                        'Jangan memakai に untuk waktu relatif seperti 今日 (hari ini), 明日 (besok), atau 毎日 (setiap hari)—kata waktu relatif tidak memakai partikel に.',
                },
            },

            // -------------------- UNIT 1.3: PARTIKEL を (O), へ (E), の (NO), から/まで --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.3 Partikel を (o), へ (e), の (no) & から〜まで — Objek, Arah, Kepemilikan & Rentang',
                grammaticalTradition: 'Unit 3/3: 格助詞の基本体系 (Penanda Hubungan Nomina)',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Struktur', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-o-obj',
                        cells: {
                            particle: { script: 'を (dibaca o)', gloss: 'Penanda Objek Langsung & Titik Lintasan' },
                            formula: {
                                script: '[Objek] + を + [Kata Kerja Transitif] | [Jalan/Taman] + を + 歩く / 走る',
                                gloss: 'Juga menandai tempat yang dilalui (berjalan menyusuri jalan) atau ditinggalkan (keluar dari)',
                            },
                            example: {
                                script: '毎朝コーヒーを飲みます。公園を散歩します。',
                                gloss: 'Setiap pagi minum kopi. Berjalan-jalan menyusuri taman.',
                            },
                        },
                        fullTranslation: 'Setiap pagi saya minum kopi. Saya berjalan-jalan di taman.',
                    },
                    {
                        id: 'ja-no-poss',
                        cells: {
                            particle: { script: 'の (no)', gloss: 'Modifikator Nomina (Dari Makro ke Mikro)' },
                            formula: {
                                script: '[Pemilik / Kategori Umum] + の + [Benda Inti]',
                                gloss: 'Urutan terbalik dari bahasa Indonesia: "Buku saya" = 私の本 (Saya の Buku)',
                            },
                            example: {
                                script: '日本の大学のコンピューター科学の学生',
                                gloss: 'Mahasiswa ilmu komputer universitas Jepang (berurutan dari terbesar ke terkecil).',
                            },
                        },
                        fullTranslation: 'Mahasiswa ilmu komputer di universitas Jepang.',
                    },
                    {
                        id: 'ja-kara-made',
                        cells: {
                            particle: { script: 'から (dari) 〜 まで (sampai)', gloss: 'Titik Awal & Batas Akhir Ruang/Waktu' },
                            formula: {
                                script: '[Titik Mulai] + から + [Titik Akhir] + まで',
                                gloss: 'Berlaku untuk jam, hari, maupun jarak stasiun/kota',
                            },
                            example: {
                                script: '九時から五時まで働きます。ジャカルタから東京まで飛びます。',
                                gloss: 'Bekerja dari jam 9 sampai jam 5. Terbang dari Jakarta sampai Tokyo.',
                            },
                        },
                        fullTranslation: 'Saya bekerja dari jam 9 sampai jam 5. Saya terbang dari Jakarta ke Tokyo.',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Halus へ (dibaca e) vs に untuk Arah Tujuan',
                    psychologyExplanation:
                        'に menyoroti TITIK TUJUAN AKHIR pendaratan ("Saya tiba di Jepang" = 日本に着きました). へ menyoroti ARAH PERGERAKAN menuju ke sana ("Saya bertolak menuju Jepang" = 日本へ行きます).',
                    literalTrap:
                        'Ingat bahwa partikel は dibaca "wa", を dibaca "o", dan へ dibaca "e" secara eksklusif ketika berfungsi sebagai partikel.',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 2: SISTEM KONJUGASI KATSUYŌ (MASU, TE, NAI, TA TERPISAH UTUH) — BEGINNER
    // =========================================================================
    {
        id: 'ja-03-beg-grammar-katsuyo-conjugation',
        lang: 'ja',
        pillar: 'morphology',
        tier: 'beginner',
        order: 3,
        title: 'JLPT N5–N4 | Katsuyō (活用): Sistem Konjugasi Kata Kerja & Kata Sifat Lengkap',
        subtitle:
            'Bedah aturan 3 golongan kata kerja (Godan, Ichidan, Irregular) untuk bentuk Masu, Te-form (Onbin), Nai-form, dan Ta-form',
        estimatedMinutes: 80,
        blocks: [
            // -------------------- UNIT 2.1: KLASIFIKASI 3 GOLONGAN & MASU-FORM --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.1 Klasifikasi 3 Golongan Kata Kerja & Konjugasi Sopan (Masu-form / ます形)',
                grammaticalTradition: 'Unit 1/4: 五段動詞・一段動詞・変格活用 (Akar Kata & Akhiran Sopan)',
                direction: 'ltr',
                columns: [
                    { key: 'group', roleLabel: 'Golongan Kata Kerja', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus Perubahan ke ます形', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Transformasi Lengkap (+ / - / Lampau)', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-katsu-ichidan',
                        cells: {
                            group: { script: 'Golongan II: Ichidan (一段 / Ru-verbs)', gloss: 'Berakhiran -iru atau -eru' },
                            formula: {
                                script: 'Buang る (-ru) + ます / ません / ました / ませんでした',
                                gloss: 'Akar kata tidak pernah berubah saat dikonjugasikan',
                            },
                            example: {
                                script: '食べる (taberu) → 食べます (makan) • 食べません (tidak) • 食べました (lampau)',
                                gloss: 'Juga: 見る → 見ます, 起きる → 起きます, 教える → 教えます',
                            },
                        },
                        fullTranslation: 'Makan → Makan (sopan) / Tidak makan / Sudah makan',
                    },
                    {
                        id: 'ja-katsu-godan',
                        cells: {
                            group: { script: 'Golongan I: Godan (五段 / U-verbs)', gloss: 'Akhiran vokal -u (く, す, つ, ぬ, む, る, う, ぐ, ぶ)' },
                            formula: {
                                script: 'Geser vokal akhir kolom -u ke kolom -i + ます',
                                gloss: 'u→i, ku→ki, gu→gi, su→shi, tsu→chi, nu→ni, bu→bi, mu→mi, ru→ri',
                            },
                            example: {
                                script: '書く (kaku) → 書きます | 話す (hanasu) → 話します | 帰る (kaeru — pengecualian Godan!) → 帰ります',
                                gloss: 'Hati-hati: 帰る (pulang), 走る (berlari), 入る (masuk), 知る (tahu) adalah Godan!',
                            },
                        },
                        fullTranslation: 'Menulis → Menulis (sopan) | Berbicara → Berbicara (sopan)',
                    },
                    {
                        id: 'ja-katsu-irreg',
                        cells: {
                            group: { script: 'Golongan III: Irregular (不規則動詞)', gloss: 'Hanya 2 kata kerja dasar di seluruh bahasa Jepang!' },
                            formula: {
                                script: 'する (suru) → します | 来る (kuru) → 来ます (kimasu)',
                                gloss: 'Seluruh kata kerja majemuk [Nomina + する] mengikuti pola します (勉強する → 勉強します)',
                            },
                            example: {
                                script: 'する → します / しません / しました | 来る → 来ます (kimasu) / 来ません (kimasen)',
                                gloss: 'Perhatikan perubahan bacaan Kanji 来 dari ku- menjadi ki-',
                            },
                        },
                        fullTranslation: 'Melakukan → Melakukan (sopan) | Datang → Datang (sopan)',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Disebut "Godan" (5 Tingkat) dan "Ichidan" (1 Tingkat)?',
                    psychologyExplanation:
                        'Kata kerja Godan menggeser vokal akhirnya melintasi 5 baris tabel Kana (a - i - u - e - o) sesuai fungsinya: 書か (a = negatif), 書き (i = sopan), 書く (u = kamus), 書け (e = perintah/potensi), 書こ (o = ajakan). Sebaliknya, Ichidan hanya memiliki 1 batang tetap.',
                    literalTrap:
                        'Jangan terkecoh oleh kata kerja berakhiran -iru/-eru yang termasuk Godan: 帰る (kaeru = pulang), 切る (kiru = memotong), 知る (shiru = tahu), 入る (hairu = masuk).',
                },
            },

            // -------------------- UNIT 2.2: BENTUK TE (TE-FORM & HUKUM ONBIN) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.2 Bentuk Te (て形 / Te-form) — Hukum Perubahan Bunyi Onbin (音便) & 5 Fungsi Utama',
                grammaticalTradition: 'Unit 2/4: て形の作り方と用法 (Jembatan Penghubung Kalimat Jepang)',
                direction: 'ltr',
                columns: [
                    { key: 'ending', roleLabel: 'Akhiran Bentuk Kamus', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Perubahan ke て形', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kata & Penggunaan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-te-sokuon',
                        cells: {
                            ending: { script: 'Godan: 〜う, 〜つ, 〜る', gloss: 'Sokuonbin (Konsonan Ganda っ)' },
                            formula: {
                                script: 'Buang う/つ/る + って (-tte)',
                                gloss: 'Mempercepat transisi bunyi menuju konsonan t',
                            },
                            example: {
                                script: '買う → 買って | 待つ → 待って | 帰る → 帰って',
                                gloss: 'Membeli → Beli lalu... | Menunggu → Tunggu lalu... | Pulang → Pulang lalu...',
                            },
                        },
                        fullTranslation: 'Perubahan akhiran -u, -tsu, -ru menjadi -tte',
                    },
                    {
                        id: 'ja-te-hatsuon',
                        cells: {
                            ending: { script: 'Godan: 〜ぬ, 〜ぶ, 〜む', gloss: 'Hatsuonbin (Sengau ん + で)' },
                            formula: {
                                script: 'Buang ぬ/ぶ/む + んで (-nde)',
                                gloss: 'Bunyi sengau ん otomatis menyuarakan て menjadi で (de)',
                            },
                            example: {
                                script: '飲む → 飲んで | 読む → 読んで | 遊ぶ → 遊んで',
                                gloss: 'Minum → Minum lalu... | Membaca → Baca lalu... | Bermain → Bermain lalu...',
                            },
                        },
                        fullTranslation: 'Perubahan akhiran -nu, -bu, -mu menjadi -nde',
                    },
                    {
                        id: 'ja-te-ionbin',
                        cells: {
                            ending: { script: 'Godan: 〜く, 〜ぐ & 〜す', gloss: 'Ionbin & Pengecualian 行く' },
                            formula: {
                                script: '〜く → いて | 〜ぐ → いで | 〜す → して | Pengecualian: 行く (iku) → 行って (itte)',
                                gloss: 'Ichidan: buang る + て (食べる → 食べて) | する → して | 来る → 来て (kite)',
                            },
                            example: {
                                script: '書く → 書いて | 泳ぐ → 泳いで | 話す → 話して | 行く → 行って',
                                gloss: 'Gunakan て形 untuk: 〜てください (tolong), 〜ています (sedang), 〜てもいいです (boleh)',
                            },
                        },
                        fullTranslation: 'Perubahan akhiran -ku, -gu, -su dan pengecualian 行く → 行って',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bentuk Te Adalah "Pisau Swiss Army" Tata Bahasa Jepang?',
                    psychologyExplanation:
                        'Dalam bahasa Jepang, kamu tidak bisa menyambung dua kalimat kata kerja memakai kata "dan" (と hanya untuk kata benda). Bentuk Te-lah yang merangkai urutan tindakan ("朝起きて、顔を洗って、ご飯を食べます" = Bangun pagi, cuci muka, lalu makan), membentuk permintaan sopan (〜てください), sedang berlangsung (〜ています), hingga izin (〜てもいいです).',
                    literalTrap:
                        'Ingat pengecualian tunggal: 行く (iku = pergi) menjadi 行って (itte), BUKAN 行いて.',
                },
            },

            // -------------------- UNIT 2.3: NAI-FORM & TA-FORM (BENTUK KASUAL) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.3 Bentuk Negatif Kasual (ない形) & Lampau Kasual (た形)',
                grammaticalTradition: 'Unit 3/4: 普通形 (Plain Form / Futsūkei)',
                direction: 'ltr',
                columns: [
                    { key: 'form', roleLabel: 'Bentuk Konjugasi', semanticColor: 'rose' },
                    { key: 'formula', roleLabel: 'Rumus Perubahan', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kata & Pola Penting', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-nai-form',
                        cells: {
                            form: { script: 'Nai-form (ない形 — Negatif Kasual)', gloss: 'Dasar untuk Larangan & Keharusan' },
                            formula: {
                                script: 'Godan: geser -u ke baris -a + ない (〜う menjadi 〜わない!) | Ichidan: buang る + ない',
                                gloss: 'Pengecualian mutlak: ある (ada) → ない (bukan あらない)',
                            },
                            example: {
                                script: '書く → 書かない | 買う → 買わない | 食べる → 食べない | する → しない | 来る → 来ない (konai)',
                                gloss: 'Pola wajib N4: 〜ないでください (tolong jangan) & 〜なければなりません (harus)',
                            },
                        },
                        fullTranslation: 'Tidak menulis / Tidak membeli / Tidak makan / Tidak melakukan / Tidak datang',
                    },
                    {
                        id: 'ja-ta-form',
                        cells: {
                            form: { script: 'Ta-form (た形 — Lampau Kasual)', gloss: 'Identik 100% dengan Aturan Te-form!' },
                            formula: {
                                script: 'Ganti て pada Te-form menjadi た, dan ganti で menjadi だ',
                                gloss: 'Jika kamu sudah hafal Te-form, kamu otomatis menguasai Ta-form dalam 1 detik',
                            },
                            example: {
                                script: '食べて → 食べた (sudah makan) | 飲んで → 飲んだ (sudah minum) | 行って → 行った (sudah pergi)',
                                gloss: 'Pola wajib N4: 〜たことがあります (pernah) & 〜たり〜たりします (melakukan A, B, dll)',
                            },
                        },
                        fullTranslation: 'Sudah makan / Sudah minum / Sudah pergi (bentuk kasual)',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bentuk Kasual (Plain Form) Wajib Dikuasai Bahkan Jika Kamu Hanya Bicara Sopan?',
                    psychologyExplanation:
                        'Dalam bahasa Jepang, seluruh anak kalimat (sebelum から "karena", と思います "saya pikir", とき "ketika", dan modifikator kata benda) WAJIB memakai Plain Form (Kamus / Nai / Ta), sedangkan kesopanan (です/ます) hanya muncul di ujung paling akhir kalimat utama.',
                    literalTrap:
                        'Untuk kata kerja Godan berakhiran huruf vokal う (seperti 買う kau, 会う au), bentuk negatifnya memakai わ (買わない kawanai), BUKAN あ (買あない).',
                },
            },

            // -------------------- UNIT 2.4: KONJUGASI KATA SIFAT-I VS KATA SIFAT-NA --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.4 Konjugasi Kata Sifat-i (い形容詞) vs Kata Sifat-na (な形容詞)',
                grammaticalTradition: 'Unit 4/4: 形容詞の活用 (Predikat Adjektiva Berkonjugasi)',
                direction: 'ltr',
                columns: [
                    { key: 'adjType', roleLabel: 'Jenis Kata Sifat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Positif / Negatif / Lampau', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Lengkap & Pengecualian', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-adj-i',
                        cells: {
                            adjType: { script: 'Kata Sifat-i (い形容詞)', gloss: 'Bisa berkonjugasi sendiri tanpa です!' },
                            formula: {
                                script: 'Negatif: buang い + くない | Lampau: buang い + かった | Lampau Negatif: buang い + くなかった',
                                gloss: 'Pengecualian mutlak: いい (baik) dikonjugasi dari akar よい → よくない / よかった',
                            },
                            example: {
                                script: '高い (mahal) → 高くない (tidak mahal) → 高かった (dulu mahal) → 高くなかった',
                                gloss: 'Tambahkan です di belakang untuk kesopanan (高くないです / 高かったです)',
                            },
                        },
                        fullTranslation: 'Mahal → Tidak mahal → Dulu mahal → Dulu tidak mahal',
                    },
                    {
                        id: 'ja-adj-na',
                        cells: {
                            adjType: { script: 'Kata Sifat-na (な形容詞)', gloss: 'Berkonjugasi persis seperti Kata Benda!' },
                            formula: {
                                script: 'Sebelum Nomina: Adj + な + Nomina | Negatif: Adj + ではありません | Lampau: Adj + でした',
                                gloss: 'Hati-hati pengecualian: きれい (cantik/bersih) dan 有名 (terkenal) adalah Kata Sifat-NA!',
                            },
                            example: {
                                script: '静かな町 (kota yang tenang) | 静かではありません (tidak tenang) | 静かでした (dulu tenang)',
                                gloss: 'SALAH: きれいくない. BENAR: きれいではありません / きれいじゃない',
                            },
                        },
                        fullTranslation: 'Kota yang tenang | Tidak tenang | Dulu tenang',
                    },
                ],
                nativeMindset: {
                    headline: 'Jebakan Klasik Pemula: "きれい" (Kirei) dan "有名" (Yūmei) Bukan Kata Sifat-i!',
                    psychologyExplanation:
                        'Meskipun huruf terakhir saat ditulis dalam Hiragana adalah い, dalam tulisan Kanji huruf い tersebut adalah bagian dari bunyi Kanji itu sendiri (綺麗 / 有名), bukan akhiran okurigana. Oleh karena itu keduanya termasuk Kata Sifat-na.',
                    literalTrap:
                        'Jangan pernah mengatakan "おいしかったです" (salah) — pada Kata Sifat-i lampau sopan, konjugasi sudah terjadi pada kata sifatnya (おいしかった), sehingga cukup tambahkan です (おいしかったです).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 3: DIATESIS PASIF/KAUSATIF & 4 KALIMAT PENGANDAIAN (JLPT N3–N2) — INTERMEDIATE
    // =========================================================================
    {
        id: 'ja-05-inter-grammar-voice-conditionals',
        lang: 'ja',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 5,
        title: 'JLPT N3–N2 | Diatesis (Pasif Ukemi & Kausatif Shieki) & 4 Pengandaian (と, ば, たら, なら)',
        subtitle:
            'Bedah sintaksis menengah Jepang satu per satu: Pasif Merugikan, Kausatif, dan nuansa presisi 4 bentuk pengandaian',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 3.1: BENTUK PASIF (UKEMI 受身形) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.1 Bentuk Pasif (Ukemi / 受身形) — Pasif Langsung vs Pasif Merugikan (Meiwaku no Ukemi)',
                grammaticalTradition: 'Unit 1/3: 受身表現 (Diatesis Pasif Jepang)',
                direction: 'ltr',
                columns: [
                    { key: 'variant', roleLabel: 'Jenis Kalimat Pasif', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus Konjugasi & Partikel', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis Emosi', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-ukemi-direct',
                        cells: {
                            variant: { script: 'Konjugasi & Pasif Langsung', gloss: 'Godan: -a + れる | Ichidan: -ru + られる' },
                            formula: {
                                script: '[Korban/Penerima] は [Pelaku] に + V-(ら)れる (する → される | 来る → 来られる)',
                                gloss: 'Pelaku tindakan dalam kalimat pasif ditandai dengan partikel に',
                            },
                            example: {
                                script: '私は先生に褒められました。 (Watashi wa sensei ni homeraremashita.)',
                                gloss: 'Saya dipuji oleh guru.',
                            },
                        },
                        fullTranslation: 'Saya dipuji oleh guru.',
                    },
                    {
                        id: 'ja-ukemi-adversative',
                        cells: {
                            variant: { script: 'Pasif Merugikan (迷惑の受身)', gloss: 'Bisa memakai Kata Kerja Intransitif!' },
                            formula: {
                                script: '[Pihak Terdampak] は [Penyebab] に + V-(ら)れる',
                                gloss: 'Menyatakan bahwa subjek merasa terganggu/dirugikan oleh peristiwa yang terjadi',
                            },
                            example: {
                                script: '昨日、帰り道で雨に降られました。 (Kinō, kaerimichi de ame ni furaremashita.)',
                                gloss: 'Kemarin di jalan pulang saya "dihujani" (kehujanan dan merasa terganggu).',
                            },
                        },
                        fullTranslation: 'Kemarin di jalan pulang saya kehujanan.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Penutur Jepang Jarang Menjadikan Benda Mati sebagai Subjek Pasif?',
                    psychologyExplanation:
                        'Bahasa Jepang sangat berpusat pada empati manusia (User-Centric Empathy). Alih-alih berkata "Kue saya dimakan oleh adik" (fokus ke kue), penutur Jepang berkata "Saya mengalami kerugian kue saya dimakan oleh adik" (私は弟にケーキを食べられました).',
                    literalTrap:
                        'Perhatikan bahwa untuk kata kerja Ichidan (食べる), bentuk Pasif (食べられる) identik tulisannya dengan bentuk Potensial ("bisa makan")—bedakan lewat partikel: pelaku pasif memakai に, sedangkan objek potensial memakai が.',
                },
            },

            // -------------------- UNIT 3.2: BENTUK KAUSATIF (SHIEKI 使役形) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.2 Bentuk Kausatif (Shieki / 使役形) — "Menyuruh / Memaksa" vs "Mengizinkan"',
                grammaticalTradition: 'Unit 2/3: 使役表現 (Konstruksi Kausatif)',
                direction: 'ltr',
                columns: [
                    { key: 'variant', roleLabel: 'Konjugasi & Nuansa', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus Konjugasi & Partikel', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-shieki-rule',
                        cells: {
                            variant: { script: 'Rumus Kausatif (Membuat / Mengizinkan)', gloss: 'Godan: -a + せる | Ichidan: -ru + させる' },
                            formula: {
                                script: '[Atasan/Orang Tua] は [Pelaksana] に/を + V-(さ)せる (する → させる | 来る → 来させる)',
                                gloss: 'Jika kata kerja sudah punya objek (を), maka pelaksana wajib ditandai dengan に',
                            },
                            example: {
                                script: '部長は部下に新しいシステムをテストさせました。',
                                gloss: 'Kepala departemen menyuruh bawahan menguji sistem baru.',
                            },
                        },
                        fullTranslation: 'Kepala departemen menugaskan bawahan menguji sistem baru.',
                    },
                    {
                        id: 'ja-shieki-teitadaku',
                        cells: {
                            variant: { script: 'Kausatif + ていただく (Izin Sopan)', gloss: 'Ungkapan kunci dunia kerja Jepang' },
                            formula: {
                                script: 'V-(さ)せていただく / V-(さ)せてください',
                                gloss: 'Secara harfiah: "Izinkan saya melakukan..." — sangat sopan untuk menawarkan aksi',
                            },
                            example: {
                                script: '私に説明させてください。 (Watashi ni setsumei sasete kudasai.)',
                                gloss: 'Izinkan saya yang menjelaskannya.',
                            },
                        },
                        fullTranslation: 'Mohon izinkan saya untuk menjelaskannya.',
                    },
                ],
                nativeMindset: {
                    headline: 'Kontras Etika Sosial: Kausatif Hanya Dipakai dari Posisi Lebih Tinggi ke Bawah',
                    psychologyExplanation:
                        'Menggunakan bentuk kausatif polos terhadap atasan atau orang asing terdengar sangat kasar karena menyiratkan kamu berkuasa menyuruh mereka. Untuk menawarkan bantuan kepada atasan, bungkuslah kausatif dengan 〜せていただきます.',
                    literalTrap:
                        'Jangan menggandakan partikel を ("部下をレポートを書かせる" — SALAH; wajib "部下にレポートを書かせる").',
                },
            },

            // -------------------- UNIT 3.3: 4 KALIMAT PENGANDAIAN (と, ば, たら, なら) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.3 Empat Bentuk Kalimat Pengandaian Jepang (と, ば, たら, なら) — Perbedaan Presisi',
                grammaticalTradition: 'Unit 3/3: 条件表現の使い分け (Semantik Kondisional Jepang)',
                direction: 'ltr',
                columns: [
                    { key: 'cond', roleLabel: 'Penanda Pengandaian', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus & Kondisi Khusus', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Nuansa', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-cond-to',
                        cells: {
                            cond: { script: '1. 〜と (Konsekuensi Otomatis / Hukum Alam)', gloss: 'Bentuk Kamus + と' },
                            formula: {
                                script: 'V-Kamus / V-ない + と、[Hasil Otomatis Pasti]',
                                gloss: 'DILARANG memakai kalimat perintah/ajakan/keinginan (〜てください, 〜たい) di klausa belakang!',
                            },
                            example: {
                                script: 'このボタンを押すと、お釣りが出ます。',
                                gloss: 'Kalau menekan tombol ini, uang kembalian otomatis keluar.',
                            },
                        },
                        fullTranslation: 'Jika tombol ini ditekan, uang kembaliannya akan keluar.',
                    },
                    {
                        id: 'ja-cond-ba',
                        cells: {
                            cond: { script: '2. 〜ば (Syarat Logis / Hipotetis Umum)', gloss: 'Godan: -e + ば | Ichidan: -れば | Adj-i: -ければ' },
                            formula: {
                                script: '[Syarat] + ば、[Hasil Logis yang Diharapkan]',
                                gloss: 'Sering digunakan untuk peribahasa, saran umum, dan pola 〜ば〜ほど (semakin... semakin...)',
                            },
                            example: {
                                script: '毎日練習すれば、日本語が上手になります。',
                                gloss: 'Jika berlatih setiap hari, bahasa Jepangmu akan menjadi mahir.',
                            },
                        },
                        fullTranslation: 'Jika berlatih setiap hari, bahasa Jepang akan menjadi mahir.',
                    },
                    {
                        id: 'ja-cond-tara',
                        cells: {
                            cond: { script: '3. 〜たら (Setelah / Jika Terjadi — Paling Serbaguna)', gloss: 'Ta-form + ら' },
                            formula: {
                                script: 'V-た / Adj-かった / Nomina-だった + ら、[Aksi Berikutnya]',
                                gloss: 'Boleh diikuti perintah, ajakan, maupun peristiwa satu kali di masa depan/lampau',
                            },
                            example: {
                                script: '日本に着いたら、すぐ連絡してください。',
                                gloss: 'Kalau/setelah tiba di Jepang, tolong segera hubungi saya.',
                            },
                        },
                        fullTranslation: 'Setelah tiba di Jepang, tolong segera hubungi saya.',
                    },
                    {
                        id: 'ja-cond-nara',
                        cells: {
                            cond: { script: '4. 〜なら (Kontekstual: "Kalau Mengenai X yang Kamu Sebut...")', gloss: 'Plain Form / Nomina + なら' },
                            formula: {
                                script: '[Topik dari Lawan Bicara] + なら、[Saran / Rekomendasi]',
                                gloss: 'Menanggapi informasi atau rencana yang baru saja diucapkan lawan bicara',
                            },
                            example: {
                                script: '「カメラを買いたいんです。」「カメラなら、新宿が安いですよ。」',
                                gloss: '"Saya ingin beli kamera." "Kalau soal beli kamera, Shinjuku murah lho."',
                            },
                        },
                        fullTranslation: '"Saya ingin membeli kamera." "Kalau mengenai kamera, di Shinjuku murah."',
                    },
                ],
                nativeMindset: {
                    headline: 'Panduan Cepat Memilih Antara と, ば, たら, dan なら',
                    psychologyExplanation:
                        'Gunakan と untuk mesin/arah jalan/hukum alam; ば untuk syarat logis umum; たら untuk rencana masa depan atau setelah aksi selesai (paling aman di percakapan); dan なら untuk menanggapi topik lawan bicara.',
                    literalTrap:
                        'Jangan katakan "時間があると、遊びに来てください" (salah karena と tidak boleh diikuti permintaan)—ganti dengan "時間があったら、遊びに来てください".',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 4: KEIGO KORPORAT & TATA BAHASA TINGKAT TINGGI (JLPT N1) — ADVANCED
    // =========================================================================
    {
        id: 'ja-06-adv-grammar-keigo-n1',
        lang: 'ja',
        pillar: 'syntax',
        tier: 'advanced',
        order: 6,
        title: 'JLPT N1 | Sistem Keigo Korporat (Sonkeigo, Kenjōgo, Teineigo) & Pola Sintaksis N1',
        subtitle:
            'Navigasi hirarki sosial Uchi–Soto dalam bisnis Jepang, konjugasi hormat khusus, dan tata bahasa jurnalistik N1',
        estimatedMinutes: 65,
        blocks: [
            {
                type: 'cognitive-pattern-table',
                title: 'Matriks Transformasi Keigo: Menaikkan Lawan (Sonkeigo) vs Merendahkan Diri (Kenjōgo)',
                grammaticalTradition: '敬語体系とウチ・ソト意識 (Sosiolinguistik Bisnis Jepang)',
                direction: 'ltr',
                columns: [
                    { key: 'plain', roleLabel: 'Bentuk Kamus (Netral)', semanticColor: 'amber' },
                    { key: 'sonkeigo', roleLabel: 'Sonkeigo (Aksi Lawan/Klien)', semanticColor: 'violet' },
                    { key: 'kenjogo', roleLabel: 'Kenjōgo (Aksi Diri/Tim Kita)', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ja-keigo-go',
                        cells: {
                            plain: { script: '行く / 来る (Pergi / Datang)', gloss: 'Perpindahan tempat' },
                            sonkeigo: { script: 'いらっしゃる / お越しになる', gloss: 'Klien/Atasan datang atau pergi' },
                            kenjogo: { script: '参る (mairu) / 伺う (ukagau)', gloss: 'Saya pergi / berkunjung ke tempat klien' },
                        },
                        fullTranslation: 'Pergi / Datang dalam 3 tingkat kesopanan',
                    },
                    {
                        id: 'ja-keigo-say',
                        cells: {
                            plain: { script: '言う (Berkata / Menyatakan)', gloss: 'Komunikasi verbal' },
                            sonkeigo: { script: 'おっしゃる (ossharu)', gloss: 'Yang dikatakan oleh klien/profesor' },
                            kenjogo: { script: '申す (mōsu) / 申し上げる', gloss: 'Saya katakan / laporkan kepada klien' },
                        },
                        fullTranslation: 'Berkata dalam 3 tingkat kesopanan',
                    },
                    {
                        id: 'ja-keigo-do',
                        cells: {
                            plain: { script: 'する (Melakukan)', gloss: 'Tindakan umum' },
                            sonkeigo: { script: 'なさる (nasaru) / お〜になる', gloss: 'Yang dilakukan oleh klien/atasan' },
                            kenjogo: { script: 'いたす (itasu) / お〜する', gloss: 'Saya kerjakan untuk klien' },
                        },
                        fullTranslation: 'Melakukan dalam 3 tingkat kesopanan',
                    },
                    {
                        id: 'ja-n1-pattern',
                        cells: {
                            plain: { script: 'Pola Jurnalistik N1: 〜を余儀なくされる', gloss: 'Terpaksa melakukan karena keadaan' },
                            sonkeigo: { script: '[Nomina] + を余儀なくされる', gloss: 'Sering muncul di koran ekonomi & berita' },
                            kenjogo: { script: '台風の影響で、イベントは中止を余儀なくされた。', gloss: 'Akibat topan, acara tersebut terpaksa dibatalkan.' },
                        },
                        fullTranslation: 'Akibat pengaruh topan, acara tersebut terpaksa dibatalkan.',
                    },
                ],
                nativeMindset: {
                    headline: 'Hukum Uchi (Dalam) vs Soto (Luar): Mengapa Harus Merendahkan Bos Sendiri di Depan Klien?',
                    psychologyExplanation:
                        'Saat menelepon klien eksternal (Soto), seluruh anggota perusahaanmu sendiri (termasuk direktur utama) dianggap berada di lingkaran dalam (Uchi). Karena itu, kamu WAJIB memakai Kenjōgo untuk atasanmu sendiri saat berbicara dengan klien ("Tanaka [bos saya] sedang keluar kantor" = 田中はただいま席を外しております, bukan いらっしゃいます).',
                    literalTrap:
                        'Jangan pernah mencampur Sonkeigo untuk diri sendiri ("私がおっしゃいました" — kesalahan fatal dalam wawancara kerja Jepang).',
                },
            },
        ],
    },
];
// scripts/builders/grammar-zh.ts
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';

export const ZH_GRAMMAR_MODULES: LessonModule[] = [
    // =========================================================================
    // MODUL 1: PREDIKAT DASAR & HUKUM URUTAN KALIMAT (HSK 1–2) — BEGINNER
    // =========================================================================
    {
        id: 'zh-02-beg-grammar-core-sentences',
        lang: 'zh',
        pillar: 'syntax',
        tier: 'beginner',
        order: 2,
        title: 'HSK 1–2 | Tiga Tipe Kalimat Dasar & Hukum Urutan Waktu–Tempat (STPVO)',
        subtitle:
            'Bedah terpisah: Kalimat Nomina (是), Kalimat Adjektiva (很), Kalimat Kepemilikan (有), & Urutan Waktu–Tempat',
        estimatedMinutes: 65,
        blocks: [
            // -------------------- UNIT 1.1: KALIMAT NOMINA (是 SHÌ) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.1 Kalimat Nomina dengan 是 (shì) — Rumus Identitas & Klasifikasi',
                grammaticalTradition: 'Unit 1/4: 是字句 (Kalimat Kopula Nomina)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-shi-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Menghubungkan Subjek dengan Kata Benda' },
                            formula: {
                                script: 'Subjek + 是 (shì) + Kata Benda (Nomina)',
                                gloss: '是 tidak berubah bentuk untuk tunggal/jamak maupun waktu lampau/kini',
                            },
                            example: {
                                script: '我是印尼工程师。 (Wǒ shì Yìnní gōngchéngshī.)',
                                gloss: 'Saya adalah insinyur Indonesia.',
                            },
                        },
                        fullTranslation: 'Saya adalah seorang insinyur Indonesia.',
                    },
                    {
                        id: 'zh-shi-neg',
                        cells: {
                            polarity: { script: 'Negatif (-)', gloss: 'Negasi dengan 不是 (bú shì)' },
                            formula: {
                                script: 'Subjek + 不是 (bú shì) + Kata Benda',
                                gloss: 'Tone Sandhi wajib: bù (Nada 4) berubah jadi bú (Nada 2) sebelum shì (Nada 4)',
                            },
                            example: {
                                script: '他不是老师，他是医生。 (Tā bú shì lǎoshī, tā shì yīshēng.)',
                                gloss: 'Dia bukan guru, dia adalah dokter.',
                            },
                        },
                        fullTranslation: 'Dia bukan guru, dia dokter.',
                    },
                    {
                        id: 'zh-shi-int',
                        cells: {
                            polarity: { script: 'Interogatif (?)', gloss: 'Partikel Tanya 吗 (ma) atau A-not-A' },
                            formula: {
                                script: 'S + 是 + O + 吗？ | S + 是不是 (shì bu shì) + O？',
                                gloss: 'Jangan menggabungkan 吗 dengan kata tanya (什么/谁) dalam satu kalimat',
                            },
                            example: {
                                script: '你是学生吗？ / 你是不是学生？',
                                gloss: 'Apakah kamu mahasiswa?',
                            },
                        },
                        fullTranslation: 'Apakah kamu mahasiswa?',
                    },
                ],
                nativeMindset: {
                    headline: 'Larangan Keras: Jangan Pernah Memakai 是 (shì) Sebelum Kata Sifat!',
                    psychologyExplanation:
                        'Dalam bahasa Inggris atau Indonesia, kita terbiasa menghubungkan subjek dengan kata sifat memakai "is/adalah" ("She is busy"). Dalam bahasa Mandarin, kata sifat sudah mengandung fungsi predikat di dalam dirinya sendiri, sehingga menyisipkan 是 sebelum kata sifat dianggap kesalahan gramatikal fatal.',
                    literalTrap:
                        'SALAH: 我是很忙 (Wǒ shì hěn máng). BENAR: 我很忙 (Wǒ hěn máng = Saya sibuk).',
                },
            },

            // -------------------- UNIT 1.2: KALIMAT ADJEKTIVA (很 HĚN) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.2 Kalimat Predikat Adjektiva (很 hěn) — Mengapa "Sangat" Kehilangan Makna Intensitasnya?',
                grammaticalTradition: 'Unit 2/4: 形容词谓语句 (Kalimat Predikat Kata Sifat)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-adj-pos',
                        cells: {
                            polarity: { script: 'Positif Netral (+)', gloss: 'Wajib menyisipkan 很 sebagai penyeimbang ritme' },
                            formula: {
                                script: 'Subjek + 很 (hěn) + Kata Sifat (Adjektiva)',
                                gloss: 'Di sini 很 berfungsi sebagai jembatan ritmis netral ("...itu..."), bukan berarti "sangat"',
                            },
                            example: {
                                script: '今天很冷。 (Jīntiān hěn lěng.)',
                                gloss: 'Hari ini dingin (pernyataan netral tanpa perbandingan).',
                            },
                        },
                        fullTranslation: 'Hari ini dingin.',
                    },
                    {
                        id: 'zh-adj-contrast',
                        cells: {
                            polarity: { script: 'Adjektiva Polos (Tanpa 很)', gloss: 'Otomatis Bermakna Perbandingan!' },
                            formula: {
                                script: 'S1 + Adj，S2 + Adj (Kontras Eksplisit)',
                                gloss: 'Jika 很 dihilangkan pada kalimat positif, pendengar langsung menganggap kamu sedang membandingkan dua hal',
                            },
                            example: {
                                script: '咖啡苦，茶不苦。 (Kāfēi kǔ, chá bù kǔ.)',
                                gloss: 'Kopi itu pahit (dibandingkan teh), teh tidak pahit.',
                            },
                        },
                        fullTranslation: 'Kopi pahit, sedangkan teh tidak pahit.',
                    },
                    {
                        id: 'zh-adj-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: '很 Dihilangkan Saat Negasi/Tanya' },
                            formula: {
                                script: 'S + 不 (bù) + Adj | S + Adj + 吗？',
                                gloss: 'Saat memakai 不 atau 吗, jembatan 很 otomatis gugur',
                            },
                            example: {
                                script: '这个语法不难。你累吗？ (Zhège yǔfǎ bù nán. Nǐ lèi ma?)',
                                gloss: 'Tata bahasa ini tidak sulit. Apakah kamu lelah?',
                            },
                        },
                        fullTranslation: 'Tata bahasa ini tidak sulit. Apakah kamu lelah?',
                    },
                ],
                nativeMindset: {
                    headline: 'Psikologi Keseimbangan Ritmis Suku Kata Mandarin',
                    psychologyExplanation:
                        'Penutur asli Mandarin menghindari predikat tunggal satu suku kata yang menggantung ("我忙" terasa terpotong dan menyiratkan kontras "...tapi dia tidak"). Menyisipkan 很 melengkapi irama dua ketukan yang alami. Jika ingin benar-benar mengatakan "sangat", penutur asli menggunakan 非常 (fēicháng) atau 真 (zhēn).',
                    literalTrap:
                        'Jangan menerjemahkan "她很漂亮" menjadi "Dia sangat cantik" dalam konteks biasa—terjemahan naturalnya adalah "Dia cantik".',
                },
            },

            // -------------------- UNIT 1.3: KEPEMILIKAN & EKSISTENSI (有 YǑU) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.3 Kata Kerja 有 (yǒu) — Kepemilikan ("Punya") & Eksistensi Lokasi ("Ada")',
                grammaticalTradition: 'Unit 3/4: 有字句 (Kalimat Kepemilikan & Keberadaan)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk & Fungsi', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-you-pos',
                        cells: {
                            polarity: { script: 'Kepemilikan & Eksistensi (+)', gloss: 'Subjek Orang vs Subjek Tempat' },
                            formula: {
                                script: '[Pemilik / Lokasi] + 有 (yǒu) + [Objek]',
                                gloss: 'Jika subjeknya tempat, 有 berarti "di tempat itu ada..."',
                            },
                            example: {
                                script: '我有一只猫。 / 桌子上有一本书。',
                                gloss: 'Saya punya seekor kucing. / Di atas meja ada sebuah buku.',
                            },
                        },
                        fullTranslation: 'Saya punya seekor kucing. / Di atas meja ada sebuah buku.',
                    },
                    {
                        id: 'zh-you-neg',
                        cells: {
                            polarity: { script: 'Negatif Wajib 没有 (méiyǒu)', gloss: 'HARAM Memakai 不有 (bùyǒu)!' },
                            formula: {
                                script: 'S + 没有 (méiyǒu) + Objek',
                                gloss: '有 adalah satu-satunya kata kerja Mandarin yang negasinya SELALU memakai 没 (méi)',
                            },
                            example: {
                                script: '我今天没有时间。 (Wǒ jīntiān méiyǒu shíjiān.)',
                                gloss: 'SALAH: 我不有时间',
                            },
                        },
                        fullTranslation: 'Hari ini saya tidak punya waktu.',
                    },
                    {
                        id: 'zh-you-int',
                        cells: {
                            polarity: { script: 'Interogatif (?)', gloss: 'Pola 有没有 (yǒu méiyǒu)' },
                            formula: {
                                script: 'S + 有没有 + Objek？ | S + 有 + Objek + 吗？',
                                gloss: 'Pola A-not-A 有没有 adalah bentuk tanya paling alami bagi penutur asli',
                            },
                            example: {
                                script: '你有没有问题？ (Nǐ yǒu méiyǒu wèntí?)',
                                gloss: 'Apakah kamu punya pertanyaan?',
                            },
                        },
                        fullTranslation: 'Apakah kamu ada pertanyaan?',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Vital 在 (zài) vs 有 (yǒu) untuk Menyatakan Lokasi',
                    psychologyExplanation:
                        'Gunakan 在 ketika benda spesifik sudah diketahui dan kamu memberi tahu lokasinya ("Buku saya ada di atas meja" = 我的书在桌子上). Gunakan 有 ketika kamu memperkenalkan keberadaan benda baru di suatu lokasi ("Di atas meja ada sebuah buku" = 桌子上有一本书).',
                    literalTrap:
                        'Jangan pernah menulis 不有 (bùyǒu) untuk apa pun; bentuk negatif dari 有 mutlak 没有 (méiyǒu).',
                },
            },

            // -------------------- UNIT 1.4: HUKUM URUTAN STPVO --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.4 Hukum Sintaksis STPVO — Urutan Wajib Subjek + Waktu + Tempat + Aksi + Objek',
                grammaticalTradition: 'Unit 4/4: 汉语基本语序 (Hukum Panggung Spasial-Temporal)',
                direction: 'ltr',
                columns: [
                    { key: 's', roleLabel: '1. Subjek', semanticColor: 'violet' },
                    { key: 't', roleLabel: '2. Waktu', semanticColor: 'cyan' },
                    { key: 'p', roleLabel: '3. Tempat [在]', semanticColor: 'amber' },
                    { key: 'vo', roleLabel: '4. Predikat + Objek', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-stpvo-1',
                        cells: {
                            s: { script: '我', reading: 'wǒ', gloss: 'Saya' },
                            t: { script: '每天晚上八点', reading: 'měitiān wǎnshang bā diǎn', gloss: 'Setiap malam jam 8' },
                            p: { script: '在家里', reading: 'zài jiālǐ', gloss: 'Di rumah' },
                            vo: { script: '学习汉语。', reading: 'xuéxí Hànyǔ', gloss: 'Belajar bahasa Mandarin.' },
                        },
                        fullTranslation: 'Setiap malam pukul 8 saya belajar bahasa Mandarin di rumah.',
                    },
                    {
                        id: 'zh-stpvo-2',
                        cells: {
                            s: { script: '明天', reading: 'míngtiān', gloss: 'Besok (Waktu boleh di depan S)' },
                            t: { script: '我们', reading: 'wǒmen', gloss: 'Kami (Subjek)' },
                            p: { script: '在机场', reading: 'zài jīchǎng', gloss: 'Di bandara' },
                            vo: { script: '见面。', reading: 'jiànmiàn', gloss: 'Bertemu.' },
                        },
                        fullTranslation: 'Besok kami bertemu di bandara.',
                    },
                ],
                nativeMindset: {
                    headline: 'Prinsip Kamera Sinematik: Setting Latar Dulu, Aksi Kemudian',
                    psychologyExplanation:
                        'Penutur Mandarin menata kalimat dari bingkai terbesar ke aksi spesifik: Siapa pelakunya → Kapan waktunya → Di mana lokasinya → Apa tindakannya. Keterangan waktu boleh diletakkan sebelum atau sesudah Subjek, tetapi WAJIB berada sebelum kata kerja.',
                    literalTrap:
                        'Jangan menaruh "di rumah" atau "jam 8" di akhir kalimat setelah objek ("我学习汉语在家里" — SALAH TOTAL).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 2: TIGA PARTIKEL ASPEK MANDARIN (了, 过, 着 TERPISAH UTUH) — BEGINNER/INTERMEDIATE
    // =========================================================================
    {
        id: 'zh-03-beg-grammar-aspect-particles',
        lang: 'zh',
        pillar: 'morphology',
        tier: 'beginner',
        order: 3,
        title: 'HSK 2–3 | Tiga Partikel Aspek Mandarin (了 le, 过 guo, 着 zhe Terpisah Utuh)',
        subtitle:
            'Mandarin tidak memiliki konjugasi tenses; pelajari secara terpisah bagaimana 了, 过, dan 着 menandai status peristiwa',
        estimatedMinutes: 70,
        blocks: [
            // -------------------- UNIT 2.1: PARTIKEL 了 (LE) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.1 Partikel 了 (le) — Penyelesaian Aksi (Verb-了) vs Perubahan Situasi (Sentence-了)',
                grammaticalTradition: 'Unit 1/3: 动态助词与语气助词 了 (Aspek Perfektif & Perubahan Status)',
                direction: 'ltr',
                columns: [
                    { key: 'variant', roleLabel: 'Posisi & Fungsi 了', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Struktur', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-le-verb',
                        cells: {
                            variant: { script: 'Verb-了 (Tepat Setelah Kata Kerja)', gloss: 'Menandai Aksi Sudah Terlaksana' },
                            formula: {
                                script: 'S + Kata Kerja + 了 + [Kuantitas / Objek Spesifik]',
                                gloss: 'Wajib ada pengukur jumlah (satu cangkir, tiga buku) atau komplemen',
                            },
                            example: {
                                script: '我今天早上喝了两杯咖啡。 (Wǒ jīntiān zǎoshang hē le liǎng bēi kāfēi.)',
                                gloss: 'Tindakan minum 2 cangkir kopi telah terlaksana',
                            },
                        },
                        fullTranslation: 'Pagi ini saya sudah minum dua cangkir kopi.',
                    },
                    {
                        id: 'zh-le-sentence',
                        cells: {
                            variant: { script: 'Sentence-了 (Di Ujung Kalimat)', gloss: 'Menandai Situasi Baru / Perubahan Status' },
                            formula: {
                                script: 'Kalimat / Kondisi Baru + 了',
                                gloss: 'Bisa merujuk perubahan yang baru terjadi sekarang atau perubahan yang segera tiba',
                            },
                            example: {
                                script: '下雨了！ / 我会说汉语了。',
                                gloss: 'Hujan turun (tadi tidak hujan, sekarang hujan)! / Saya sudah bisa bicara Mandarin (dulu tidak bisa).',
                            },
                        },
                        fullTranslation: 'Hujan turun! / Saya sekarang sudah bisa berbahasa Mandarin.',
                    },
                    {
                        id: 'zh-le-neg',
                        cells: {
                            polarity: { script: 'Negasi Aksi Lampau: 没 (méi) + V', gloss: 'HARAM Memakai 不 + 了 untuk Aksi Belum Terjadi!' },
                            formula: {
                                script: 'S + 没有 (méiyǒu) / 没 + Kata Kerja + Objek (TANPA 了!)',
                                gloss: 'Saat memakai 没 untuk menyangkal kejadian lampau, partikel 了 wajib dicabut',
                            },
                            example: {
                                script: '我昨天没去学校。 (Wǒ zuótiān méi qù xuéxiào.)',
                                gloss: 'SALAH: 我昨天没去了学校',
                            },
                        },
                        fullTranslation: 'Kemarin saya tidak pergi ke sekolah.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mitos Terbesar: 了 BUKAN Penanda Past Tense!',
                    psychologyExplanation:
                        '了 bisa muncul di masa depan ("明天我吃了饭就去" = Besok setelah saya selesai makan, saya langsung pergi) dan sering TIDAK dipakai di masa lampau jika menceritakan kebiasaan lampau ("小时候我每天游泳" = Waktu kecil saya berenang setiap hari — tanpa 了!).',
                    literalTrap:
                        'Jangan pernah menaruh 了 di akhir kalimat negatif lampau ("我没吃了" — SALAH TOTAL).',
                },
            },

            // -------------------- UNIT 2.2: PARTIKEL 过 (GUO) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.2 Partikel 过 (guo) — Penanda Pengalaman Hidup ("Pernah")',
                grammaticalTradition: 'Unit 2/3: 经历体助词 过 (Aspek Eksperiensial)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-guo-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Pernah Mengalami di Masa Lalu' },
                            formula: {
                                script: 'S + Kata Kerja + 过 (guo) + Objek',
                                gloss: 'Menyiratkan pengalaman itu sudah selesai dan subjek sudah kembali ke keadaan semula',
                            },
                            example: {
                                script: '我去过北京三次。 (Wǒ qù guo Běijīng sān cì.)',
                                gloss: 'Saya pernah pergi ke Beijing tiga kali (dan sekarang sudah pulang).',
                            },
                        },
                        fullTranslation: 'Saya pernah pergi ke Beijing tiga kali.',
                    },
                    {
                        id: 'zh-guo-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: '没 + V + 过 (过 Tetap Dipertahankan!)' },
                            formula: {
                                script: 'S + 没(有) + V + 过 + O | S + V + 过 + O + 没有？',
                                gloss: 'Berbeda dengan 了 yang hilang saat dinegasi 没, partikel 过 TETAP ADA setelah 没',
                            },
                            example: {
                                script: '你吃过北京烤鸭没有？ — 我没吃过。',
                                gloss: 'Apakah kamu pernah makan bebek panggang Beijing? — Saya belum pernah makan.',
                            },
                        },
                        fullTranslation: 'Apakah kamu pernah makan bebek panggang Beijing? — Belum pernah.',
                    },
                ],
                nativeMindset: {
                    headline: 'Kontras Tajam: "他去了中国" vs "他去过中国"',
                    psychologyExplanation:
                        '"他去了中国" (memakai 了) artinya dia pergi ke Tiongkok dan sekarang MASIH DI SANA atau baru saja berangkat. "他去过中国" (memakai 过) artinya dia PERNAH ke Tiongkok di masa lalu dan sekarang SUDAH KEMBALI.',
                    literalTrap:
                        'Jangan menghapus 过 dalam kalimat negatif "Belum pernah" (wajib "没去过", bukan "没去").',
                },
            },

            // -------------------- UNIT 2.3: PARTIKEL 着 (ZHE) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.3 Partikel 着 (zhe) — Keadaan Statis yang Sedang Berlangsung & Latar Aksi',
                grammaticalTradition: 'Unit 3/3: 持续体助词 着 (Aspek Duratif Statis)',
                direction: 'ltr',
                columns: [
                    { key: 'usage', roleLabel: 'Fungsi Kognitif', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-zhe-state',
                        cells: {
                            usage: { script: 'Kondisi Bertahan (Static State)', gloss: 'Hasil aksi yang masih bertahan' },
                            formula: {
                                script: 'S + Kata Kerja + 着 (zhe) + Objek',
                                gloss: 'Misal: Pintu dalam keadaan terbuka, pakaian sedang dikenakan',
                            },
                            example: {
                                script: '门开着，灯也亮着。 (Mén kāi zhe, dēng yě liàng zhe.)',
                                gloss: 'Pintunya dalam keadaan terbuka, lampunya juga menyala.',
                            },
                        },
                        fullTranslation: 'Pintunya terbuka dan lampunya juga menyala.',
                    },
                    {
                        id: 'zh-zhe-simultaneous',
                        cells: {
                            usage: { script: 'Dua Aksi Bersamaan (Sambil)', gloss: 'V1 + 着 menjadi cara melakukan V2' },
                            formula: {
                                script: 'S + V1 + 着 + (O1) + V2 + (O2)',
                                gloss: 'V1 merupakan postur/keadaan penyerta saat melakukan V2',
                            },
                            example: {
                                script: '他喜欢听着音乐写代码。 (Tā xǐhuan tīng zhe yīnyuè xiě dàimǎ.)',
                                gloss: 'Dia suka menulis kode sambil mendengarkan musik.',
                            },
                        },
                        fullTranslation: 'Dia suka menulis kode sambil mendengarkan musik.',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan 正在 (zhèngzài) vs 着 (zhe)',
                    psychologyExplanation:
                        '正在 menekankan AKTIVITAS DINAMIS yang sedang dikerjakan ("我正在穿衣服" = Saya sedang proses memakai baju). 着 menekankan KEADAAN HASIL yang menempel ("我穿着一件红衣服" = Saya sedang mengenakan baju merah).',
                    literalTrap:
                        'Jangan memakai 着 untuk aksi singkat seketika seperti "mati" atau "menemukan".',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 3: KONSTRUKSI把 (BǍ), PASIF 被 (BÈI), KOMPLEMEN & 是...的 (HSK 3–4) — INTERMEDIATE
    // =========================================================================
    {
        id: 'zh-04-inter-grammar-ba-bei-complements',
        lang: 'zh',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 4,
        title: 'HSK 3–4 | Konstruksi 把 (Bǎ), Pasif 被 (Bèi), Komplemen Hasil & Fokus 是...的',
        subtitle:
            'Bedah sintaksis menengah Mandarin satu per satu: manipulasi objek, pasif, komplemen hasil/arah, dan penekanan detail',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 3.1: KALIMAT DISPOSAL 把 (BǍ) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.1 Kalimat Disposal 把 (Bǎ) — Memindahkan Objek Spesifik ke Depan Kata Kerja',
                grammaticalTradition: 'Unit 1/4: 把字句 (Sintaksis Manipulasi Objek)',
                direction: 'ltr',
                columns: [
                    { key: 'slot', roleLabel: 'Komponen Wajib', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus & Syarat Ketat', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-ba-pos',
                        cells: {
                            slot: { script: 'Struktur Positif 把', gloss: 'Objek harus spesifik/diketahui pembicara' },
                            formula: {
                                script: 'S + 把 + [Objek Spesifik] + Kata Kerja + [Komplemen Hasil/Arah/了]',
                                gloss: 'Kata kerja TIDAK BOLEH berdiri polos tanpa komplemen di belakangnya',
                            },
                            example: {
                                script: '请把你的护照放在桌子上。 (Qǐng bǎ nǐ de hùzhào fàng zài zhuōzi shang.)',
                                gloss: 'Tolong letakkan paspormu di atas meja.',
                            },
                        },
                        fullTranslation: 'Tolong letakkan paspormu di atas meja.',
                    },
                    {
                        id: 'zh-ba-neg-modal',
                        cells: {
                            slot: { script: 'Negasi & Modal Verbs', gloss: '没 / 不 / 想 / 要 diletakkan SEBELUM 把' },
                            formula: {
                                script: 'S + [没 / 不 / 别 / Modal] + 把 + Objek + V + Komplemen',
                                gloss: 'Dilarang menaruh negasi atau modal setelah 把',
                            },
                            example: {
                                script: '我还没把报告发给经理。 / 别把手机忘在家里！',
                                gloss: 'Saya belum mengirimkan laporan ke manajer. / Jangan tinggalkan ponsel di rumah!',
                            },
                        },
                        fullTranslation: 'Saya belum mengirimkan laporan ke manajer. / Jangan tinggalkan ponsel di rumah!',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Kalimat 把 (Bǎ) Wajib Dipakai oleh Penutur Asli?',
                    psychologyExplanation:
                        'Ketika sebuah tindakan memindahkan lokasi benda ("taruh buku ke dalam tas"), mengubah bentuknya ("potong apel jadi potongan kecil"), atau menuntaskannya ("habiskan kopi itu"), penutur asli wajib memakai 把 karena bahasa Mandarin tidak mengizinkan objek dan lokasi tujuan menumpuk bersama di belakang kata kerja.',
                    literalTrap:
                        'SALAH: 请放你的护照在桌子上. BENAR: 请把你的护照放在桌子上.',
                },
            },

            // -------------------- UNIT 3.2: KALIMAT PASIF 被 (BÈI) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.2 Kalimat Pasif 被 (Bèi) — Struktur Pasif & Nuansa Dampak Tak Terduga',
                grammaticalTradition: 'Unit 2/4: 被字句 (Konstruksi Pasif Mandarin)',
                direction: 'ltr',
                columns: [
                    { key: 'variant', roleLabel: 'Bentuk Pasif', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-bei-agent',
                        cells: {
                            variant: { script: 'Pasif dengan Pelaku', gloss: 'Menyebutkan siapa pelakunya' },
                            formula: {
                                script: 'Penderita (O) + 被 / 让 / 叫 + [Pelaku] + Kata Kerja + Komplemen',
                                gloss: 'Dalam percakapan lisan, 让 (ràng) dan 叫 (jiào) sering menggantikan 被',
                            },
                            example: {
                                script: '我的自行车被小偷偷走了。 (Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.)',
                                gloss: 'Sepeda saya dicuri pergi oleh pencuri.',
                            },
                        },
                        fullTranslation: 'Sepeda saya telah dicuri oleh pencuri.',
                    },
                    {
                        id: 'zh-bei-no-agent',
                        cells: {
                            variant: { script: 'Pasif Tanpa Pelaku', gloss: 'Pelaku tidak diketahui/tidak penting' },
                            formula: {
                                script: 'Penderita (O) + 被 + Kata Kerja + Komplemen',
                                gloss: 'Hanya 被 yang boleh langsung diikuti kata kerja tanpa pelaku (让/叫 tidak bisa)',
                            },
                            example: {
                                script: '最后一个苹果被吃掉了。 (Zuìhòu yí gè píngguǒ bèi chī diào le.)',
                                gloss: 'Apel terakhir sudah habis dimakan.',
                            },
                        },
                        fullTranslation: 'Apel terakhir sudah habis dimakan.',
                    },
                ],
                nativeMindset: {
                    headline: 'Nuansa Emosional di Balik 被 (Bèi)',
                    psychologyExplanation:
                        'Secara historis, 被 sering digunakan untuk peristiwa yang merugikan, mengejutkan, atau di luar kendali subjek (dicuri, basah kuyup, dikritik). Untuk peristiwa positif netral, penutur asli sering memakai pasif tanpa penanda ("信写好了" = Suratnya sudah selesai ditulis).',
                    literalTrap:
                        'Sama seperti 把, kata kerja dalam kalimat 被 juga wajib memiliki komplemen hasil/arah di belakangnya.',
                },
            },

            // -------------------- UNIT 3.3: KOMPLEMEN HASIL (结果补语) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.3 Komplemen Hasil (结果补语 Jiéguǒ Bǔyǔ) — Membedakan "Melihat" vs "Terlihat"',
                grammaticalTradition: 'Unit 3/4: 结果补语 (Kata Kerja + Hasil Tindakan)',
                direction: 'ltr',
                columns: [
                    { key: 'comp', roleLabel: 'Komplemen Hasil', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus & Makna', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Kontras Aksi vs Hasil', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-comp-jian-dong',
                        cells: {
                            comp: { script: '见 (jiàn) & 懂 (dǒng)', gloss: 'Hasil persepsi indra & pemahaman' },
                            formula: {
                                script: '看 (melihat) → 看见 (terlihat) | 听 (mendengar) → 听懂 (mendengar & paham)',
                                gloss: 'Negasi selalu memakai 没 (没看见 = tidak terlihat / tidak melihat)',
                            },
                            example: {
                                script: '我听见了，但是没听懂。 (Wǒ tīngjiàn le, dànshì méi tīngdǒng.)',
                                gloss: 'Saya mendengarnya (suara masuk telinga), tetapi tidak memahaminya.',
                            },
                        },
                        fullTranslation: 'Saya mendengarnya, tetapi tidak mengerti maksudnya.',
                    },
                    {
                        id: 'zh-comp-wan-hao',
                        cells: {
                            comp: { script: '完 (wán) & 好 (hǎo)', gloss: 'Selesai tuntas vs Selesai siap pakai' },
                            formula: {
                                script: '做完 (selesai dikerjakan) | 准备好 (selesai dipersiapkan dengan baik)',
                                gloss: '完 menekankan habisnya pekerjaan; 好 menekankan kesiapan hasil akhir',
                            },
                            example: {
                                script: '晚饭做好了，大家快来吃吧！',
                                gloss: 'Makan malam sudah siap dimasak, semuanya ayo makan!',
                            },
                        },
                        fullTranslation: 'Makan malam sudah matang dan siap, ayo semuanya makan!',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa "我找了钥匙" Tidak Berarti "Saya Menemukan Kunci"?',
                    psychologyExplanation:
                        'Kata kerja Mandarin hanya menyatakan USAHA tindakannya (找 = mencari, 看 = memandang, 听 = menyimak). Untuk menyatakan bahwa usaha itu BERHASIL mencapai hasil, wajib menempelkan komplemen hasil di belakangnya (找到 = berhasil menemukan, 看见 = berhasil melihat).',
                    literalTrap:
                        'Jangan katakan "我看了他" untuk "Saya melihat dia"—gunakan "我看见他了".',
                },
            },

            // -------------------- UNIT 3.4: KONSTRUKSI FOKUS 是...的 (SHÌ...DE) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.4 Konstruksi Penekanan 是...的 (Shì...de) — Menyoroti Waktu, Tempat & Cara Kejadian Lampau',
                grammaticalTradition: 'Unit 4/4: “是……的”强调句 (Fokus Informasi Spesifik)',
                direction: 'ltr',
                columns: [
                    { key: 'focus', roleLabel: 'Detail yang Disorot', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-shide-1',
                        cells: {
                            focus: { script: 'Waktu / Tempat / Cara / Pelaku', gloss: 'Aksi sudah diketahui; detailnya yang ditanya' },
                            formula: {
                                script: 'S + 是 + [Waktu / Tempat / Cara] + Kata Kerja + 的',
                                gloss: '是 diletakkan tepat di depan unsur yang ingin ditekankan',
                            },
                            example: {
                                script: '我是坐高铁来上海的。 / 你是什么时候到的？',
                                gloss: 'Saya datang ke Shanghai naik kereta cepat (menekankan caranya). / Kapan kamu tibanya?',
                            },
                        },
                        fullTranslation: 'Saya datang ke Shanghai naik kereta cepat. / Kapan kamu tibanya?',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Memakai 是...的 vs Partikel 了?',
                    psychologyExplanation:
                        'Jika pendengar BELUM tahu peristiwa itu terjadi, pakai 了 ("他昨天来了" = Dia datang kemarin). Jika pendengar SUDAH tahu dia datang, dan kalian sedang menyoroti KAPAN, BAGAIMANA, atau DENGAN SIAPA dia datang, pakai 是...的 ("他是昨天来的" = Datangnya dia itu kemarin).',
                    literalTrap:
                        'Jangan menggabungkan 了 dan 是...的 secara bersamaan dalam satu klausa fokus.',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 4: SINTAKSIS BAHASA TULIS FORMAL SHŪMIÀNYǓ (HSK 5–9) — ADVANCED
    // =========================================================================
    {
        id: 'zh-05-adv-grammar-shumianyu-formal',
        lang: 'zh',
        pillar: 'syntax',
        tier: 'advanced',
        order: 5,
        title: 'HSK 5–9 | Shūmiànyǔ (书面语): Sintaksis Bahasa Tulis Formal, Berita & Akademik',
        subtitle:
            'Transformasi bahasa lisan (Kǒuyǔ) ke bahasa tulis ringkas menggunakan partikel klasik 即, 乃, 颇, 所, 以, serta konjungsi akademik',
        estimatedMinutes: 60,
        blocks: [
            {
                type: 'cognitive-pattern-table',
                title: 'Matriks Transformasi Kǒuyǔ (Lisan) → Shūmiànyǔ (Tulis Formal)',
                grammaticalTradition: 'Advanced Written Chinese Register (现代汉语书面语)',
                direction: 'ltr',
                columns: [
                    { key: 'register', roleLabel: 'Konstruksi Formal', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Pola & Padanan Lisan', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat Jurnalistik / Akademik', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'zh-adv-1',
                        cells: {
                            register: { script: '结构助词 所 (suǒ) + Kata Kerja', gloss: 'Nominalisasi objek tindakan formal' },
                            formula: {
                                script: 'S + 所 + Kata Kerja + 的 + Nomina',
                                gloss: 'Memadatkan klausa panjang menjadi frasa nomina padat bergaya editorial',
                            },
                            example: {
                                script: '人工智能所带来的变革正在重塑全球产业格局。',
                                gloss: 'Transformasi yang dibawa oleh kecerdasan buatan sedang membentuk ulang lanskap industri global.',
                            },
                        },
                        fullTranslation: 'Transformasi yang dibawa oleh kecerdasan buatan sedang membentuk ulang lanskap industri global.',
                    },
                    {
                        id: 'zh-adv-2',
                        cells: {
                            register: { script: 'Konjungsi Kausal Formal: 鉴于 / 因而 / 从而', gloss: 'Padanan lisan 因为...所以...' },
                            formula: {
                                script: '鉴于 [Fakta/Premis]，[Subjek] 决定/采取 [Tindakan]，从而 [Hasil]',
                                gloss: 'Digunakan dalam laporan kebijakan, hukum, dan abstrak jurnal ilmiah',
                            },
                            example: {
                                script: '鉴于数据安全的重要性，我们采用了端到端加密技术，从而有效防止了信息泄露。',
                                gloss: 'Mengingat pentingnya keamanan data, kami mengadopsi enkripsi ujung-ke-ujung, sehingga efektif mencegah kebocoran informasi.',
                            },
                        },
                        fullTranslation:
                            'Mengingat pentingnya keamanan data, kami mengadopsi enkripsi ujung-ke-ujung sehingga efektif mencegah kebocoran informasi.',
                    },
                    {
                        id: 'zh-adv-3',
                        cells: {
                            register: { script: 'Kopula Klasik: 即 (jí) & 乃 (nǎi)', gloss: 'Padanan lisan 就是 ("yaitu / adalah")' },
                            formula: {
                                script: 'A 即 B (A yaitu B) | A 乃 B 之本 (A adalah akar dari B)',
                                gloss: 'Memberikan bobot definisi ilmiah atau peribahasa formal',
                            },
                            example: {
                                script: '失败乃成功之母。 (Shībài nǎi chénggōng zhī mǔ.)',
                                gloss: 'Kegagalan adalah ibu dari keberhasilan.',
                            },
                        },
                        fullTranslation: 'Kegagalan adalah ibu dari keberhasilan.',
                    },
                ],
                nativeMindset: {
                    headline: 'Prinsip Ekonomis Bahasa Tulis Tiongkok (双音节化 — Pasangan Dua Suku Kata)',
                    psychologyExplanation:
                        'Bahasa lisan Mandarin sering menggunakan kata 1 suku kata + kata bantu (seperti 在 + Tempat = 在北京), sedangkan Shūmiànyǔ memadatkannya menjadi kata depan klasik 于 (yú) di belakang kata kerja (位于北京 = berlokasi di Beijing) agar ritme tulisan berpasangan dua-dua karakter secara elegan.',
                    literalTrap:
                        'Jangan mencampur kosakata sangat kasual (seperti 东西 atau 搞) di dalam paragraf Shūmiànyǔ yang memakai 鉴于 atau 从而.',
                },
            },
        ],
    },
];
// scripts/builders/grammar-en.ts
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';

export const EN_GRAMMAR_MODULES: LessonModule[] = [
    // =========================================================================
    // MODUL 1: SISTEM PRESENT TENSE (4 TURUNAN TERPISAH UTUH) — BEGINNER
    // =========================================================================
    {
        id: 'en-02-beg-grammar-present-system',
        lang: 'en',
        pillar: 'syntax',
        tier: 'beginner',
        order: 2,
        title: 'CEFR A1–B1 | Sistem Present Tense Lengkap (4 Turunan Terpisah Utuh)',
        subtitle:
            'Bedah mendalam satu per satu: Simple Present, Present Continuous, Present Perfect, dan Present Perfect Continuous',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 1.1: SIMPLE PRESENT --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.1 Simple Present Tense — Rumus, Aturan -s/-es/-ies & Stative Verbs',
                grammaticalTradition: 'Unit 1/4: Simple Aspect (Fakta Permanen, Kebiasaan & Jadwal Tetap)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis Ejaan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-sp-pos-verbal',
                        cells: {
                            polarity: { script: 'Positif Verbal (+)', gloss: 'I/You/We/They vs He/She/It' },
                            formula: {
                                script: 'S + V1 (I/You/We/They) | S + V1 + -s/-es/-ies (He/She/It)',
                                gloss: 'Akhiran -es untuk akhiran -o, -ch, -sh, -ss, -x, -z; konsonan+y menjadi -ies',
                            },
                            example: {
                                script: 'She teaches physics and studies robotics every night.',
                                gloss: 'teach → teaches; study → studies; play → plays (vokal+y tetap +s)',
                            },
                        },
                        fullTranslation: 'Dia mengajar fisika dan belajar robotika setiap malam.',
                    },
                    {
                        id: 'en-sp-pos-nominal',
                        cells: {
                            polarity: { script: 'Positif Nominal (+)', gloss: 'Tanpa kata kerja aksi (To Be)' },
                            formula: {
                                script: 'S + am / is / are + Adjective / Noun / Prepositional Phrase',
                                gloss: 'I → am | He/She/It → is | You/We/They → are',
                            },
                            example: {
                                script: 'Water boils at 100 degrees Celsius.',
                                gloss: 'Kebenaran ilmiah universal wajib Simple Present',
                            },
                        },
                        fullTranslation: 'Air mendidih pada suhu 100 derajat Celcius.',
                    },
                    {
                        id: 'en-sp-neg',
                        cells: {
                            polarity: { script: 'Negatif (-)', gloss: 'Auxiliary Do/Does + Not' },
                            formula: {
                                script: 'S + do/does + not + V1 (Bare Infinitive)',
                                gloss: 'Akhiran -s pada kata kerja utama HILANG karena diserap oleh "does"',
                            },
                            example: {
                                script: 'He does not (doesn’t) commute on Fridays.',
                                gloss: 'SALAH: He doesn’t commutes',
                            },
                        },
                        fullTranslation: 'Dia tidak pulang-pergi ke kantor pada hari Jumat.',
                    },
                    {
                        id: 'en-sp-int',
                        cells: {
                            polarity: { script: 'Interogatif (?)', gloss: 'Inversi Do/Does ke Depan Subjek' },
                            formula: {
                                script: '(Wh-) + Do/Does + S + V1 + ?',
                                gloss: 'Penanda waktu: always, usually, often, sometimes, seldom, never, every day',
                            },
                            example: {
                                script: 'What time does the Shinkansen depart from Tokyo?',
                                gloss: 'Jadwal transportasi publik & acara resmi selalu memakai Simple Present',
                            },
                        },
                        fullTranslation: 'Jam berapa Shinkansen berangkat dari Tokyo?',
                    },
                ],
                nativeMindset: {
                    headline: 'Hukum Stative Verbs: Mengapa "I am knowing" Dilarang Keras?',
                    psychologyExplanation:
                        'Penutur asli Inggris membagi kata kerja menjadi Action Verbs (proses fisik yang bisa dimulai dan dihentikan: run, build, write) dan Stative Verbs (keadaan mental, emosi, indra, kepemilikan: know, believe, understand, remember, own, belong, want, love, hate). Stative verbs dianggap sebagai kondisi utuh, sehingga memakai Simple Present bahkan jika sedang dirasakan detik ini.',
                    literalTrap:
                        'Jangan menerjemahkan "Saya sedang mengerti" menjadi "I am understanding". Gunakan "I understand".',
                },
            },

            // -------------------- UNIT 1.2: PRESENT CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.2 Present Continuous Tense — Rumus, Ejaan V-ing & Situasi Sementara',
                grammaticalTradition: 'Unit 2/4: Progressive Aspect (Sedang Berlangsung & Agenda Pasti)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-pc-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'To Be + Present Participle' },
                            formula: {
                                script: 'S + am/is/are + V-ing',
                                gloss: 'Aturan ejaan: write → writing; run → running (CVC ganda); lie → lying (-ie → -y)',
                            },
                            example: {
                                script: 'Look! The engineer is deploying the patch right now.',
                                gloss: 'Aksi aktif yang berlangsung tepat pada saat berbicara',
                            },
                        },
                        fullTranslation: 'Lihat! Insinyur itu sedang merilis pembaruan sekarang juga.',
                    },
                    {
                        id: 'en-pc-temp',
                        cells: {
                            polarity: { script: 'Situasi Sementara', gloss: 'Temporary State / Tren Berubah' },
                            formula: {
                                script: 'S + am/is/are + V-ing + (this week / these days / currently)',
                                gloss: 'Berbeda dengan Simple Present yang bersifat permanen',
                            },
                            example: {
                                script: 'I am staying in Bandung this month while renovating my house.',
                                gloss: 'Bukan tempat tinggal permanen, hanya sementara bulan ini',
                            },
                        },
                        fullTranslation: 'Saya sedang tinggal di Bandung bulan ini selagi merenovasi rumah saya.',
                    },
                    {
                        id: 'en-pc-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Negasi & Inversi To Be' },
                            formula: {
                                script: 'S + am/is/are + not + V-ing | (Wh-) + Am/Is/Are + S + V-ing + ?',
                                gloss: 'Juga dipakai untuk rencana pribadi yang sudah memiliki pengaturan konkret (tiket/janji)',
                            },
                            example: {
                                script: 'Are you meeting the client tomorrow afternoon? — No, I’m not.',
                                gloss: 'Janji temu sudah dijadwalkan pasti',
                            },
                        },
                        fullTranslation: 'Apakah kamu bertemu klien besok sore? — Tidak.',
                    },
                ],
                nativeMindset: {
                    headline: 'Kontras Nuansa: "She works at Google" vs "She is working on a new AI model"',
                    psychologyExplanation:
                        'Present Continuous membingkai sebuah tindakan di dalam "jendela waktu sementara yang sedang berputar". Saat kamu mengatakan "Your English is improving", bentuk -ing menekankan perubahan dinamis yang sedang terjadi dari hari ke hari.',
                    literalTrap:
                        'Jangan pernah meninggalkan To Be ("She working now" — SALAH; wajib "She is working now").',
                },
            },

            // -------------------- UNIT 1.3: PRESENT PERFECT --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.3 Present Perfect Tense — Rumus Have/Has + V3 & 4 Fungsi Inti',
                grammaticalTradition: 'Unit 3/4: Perfect Aspect (Jembatan Masa Lampau ke Masa Kini)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk & Fungsi', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Penanda Waktu', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-pp-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Pengalaman Hidup & Hasil Kini' },
                            formula: {
                                script: 'S + have/has + V3 (Past Participle)',
                                gloss: 'I/You/We/They → have | He/She/It → has',
                            },
                            example: {
                                script: 'I have already published three research papers this year.',
                                gloss: 'Jendela waktu "this year" masih terbuka; hasil karya ada sekarang',
                            },
                        },
                        fullTranslation: 'Saya sudah menerbitkan tiga makalah riset tahun ini.',
                    },
                    {
                        id: 'en-pp-for-since',
                        cells: {
                            polarity: { script: 'For vs Since', gloss: 'Durasi vs Titik Awal Waktu' },
                            formula: {
                                script: 'for + [rentang durasi] | since + [titik awal spesifik]',
                                gloss: 'for three years / for two hours | since 2022 / since Monday / since I graduated',
                            },
                            example: {
                                script: 'She has lived in Jakarta since 2021 (for five years).',
                                gloss: 'Dimulai di masa lalu dan masih berlanjut hingga sekarang',
                            },
                        },
                        fullTranslation: 'Dia telah tinggal di Jakarta sejak 2021 (selama lima tahun).',
                    },
                    {
                        id: 'en-pp-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Penggunaan Yet, Ever & Never' },
                            formula: {
                                script: 'S + haven’t/hasn’t + V3 + yet | Have/Has + S + ever + V3 + ?',
                                gloss: '"never" dipakai pada kalimat positif secara struktur (I have never been there)',
                            },
                            example: {
                                script: 'Have you finished the migration yet? — Not yet, I haven’t tested the API.',
                                gloss: '"Yet" selalu di akhir kalimat tanya dan negatif',
                            },
                        },
                        fullTranslation: 'Apakah kamu sudah menyelesaikan migrasinya? — Belum, saya belum menguji API-nya.',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Vital "Have been to" vs "Have gone to"',
                    psychologyExplanation:
                        '"Naufal has been to Seoul" artinya Naufal pernah pergi ke Seoul dan sekarang SUDAH PULANG ke Indonesia. Sebaliknya, "Naufal has gone to Seoul" artinya Naufal berangkat ke Seoul dan sekarang MASIH BERADA DI SEOUL.',
                    literalTrap:
                        'Dilarang keras menggabungkan Present Perfect dengan waktu lampau yang sudah tertutup ("I have visited Bali last year" — SALAH; wajib Past Simple: "I visited Bali last year").',
                },
            },

            // -------------------- UNIT 1.4: PRESENT PERFECT CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.4 Present Perfect Continuous — Rumus Have/Has Been + V-ing & Fokus Durasi',
                grammaticalTradition: 'Unit 4/4: Perfect Progressive Aspect (Proses Berkelanjutan Hingga Detik Ini)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-ppc-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Menekankan Lamanya Durasi Proses' },
                            formula: {
                                script: 'S + have/has + been + V-ing + (for / since / all day)',
                                gloss: 'Aksi dimulai di masa lalu, terus berlangsung tanpa putus, dan masih berjalan saat ini',
                            },
                            example: {
                                script: 'We have been training this language model since 6 AM.',
                                gloss: 'Menyoroti berapa lama proses berlangsung hingga detik ini',
                            },
                        },
                        fullTranslation: 'Kami sudah melatih model bahasa ini sejak pukul 6 pagi (dan masih berjalan).',
                    },
                    {
                        id: 'en-ppc-evidence',
                        cells: {
                            polarity: { script: 'Bukti Fisik Terkini', gloss: 'Aksi Baru Saja Berhenti dengan Bukti' },
                            formula: {
                                script: 'S + have/has + been + V-ing (tanpa for/since)',
                                gloss: 'Menjelaskan penyebab kondisi yang terlihat sekarang',
                            },
                            example: {
                                script: 'Why are your eyes red? — I have been reading documentation all night.',
                                gloss: 'Dampak fisik dari aktivitas panjang yang baru selesai',
                            },
                        },
                        fullTranslation: 'Kenapa matamu merah? — Saya sudah membaca dokumentasi semalaman.',
                    },
                    {
                        id: 'en-ppc-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Pertanyaan Durasi "How long"' },
                            formula: {
                                script: 'S + haven’t/hasn’t + been + V-ing | How long + have/has + S + been + V-ing + ?',
                                gloss: 'Pertanyaan durasi yang masih berjalan wajib memakai pola ini',
                            },
                            example: {
                                script: 'How long have you been working on Veloa?',
                                gloss: 'SALAH: How long are you working on Veloa?',
                            },
                        },
                        fullTranslation: 'Sudah berapa lama kamu mengerjakan Veloa?',
                    },
                ],
                nativeMindset: {
                    headline: 'Present Perfect Simple (Hasil/Angka) vs Present Perfect Continuous (Durasi/Proses)',
                    psychologyExplanation:
                        'Bandingkan: "I have written 500 lines of code" (fokus pada HASIL/KUANTITAS 500 baris yang selesai) vs "I have been writing code for four hours" (fokus pada DURASI 4 jam aktivitas menulis kode).',
                    literalTrap:
                        'Tetap patuhi aturan Stative Verbs: gunakan "I have known him for ten years", BUKAN "I have been knowing him for ten years".',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 2: SISTEM PAST TENSE (4 TURUNAN TERPISAH UTUH) — BEGINNER/INTERMEDIATE
    // =========================================================================
    {
        id: 'en-03-beg-grammar-past-system',
        lang: 'en',
        pillar: 'syntax',
        tier: 'beginner',
        order: 3,
        title: 'CEFR A2–B1 | Sistem Past Tense Lengkap (4 Turunan Terpisah Utuh)',
        subtitle:
            'Bedah mendalam satu per satu: Simple Past, Past Continuous, Past Perfect, dan Past Perfect Continuous',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 2.1: SIMPLE PAST --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.1 Simple Past Tense — Rumus V2, Regular/Irregular & Did/Didn’t',
                grammaticalTradition: 'Unit 1/4: Past Simple (Peristiwa Selesai di Titik Waktu Lampau Tertutup)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-past-s-pos',
                        cells: {
                            polarity: { script: 'Positif Verbal (+)', gloss: 'Semua subjek memakai V2 yang sama' },
                            formula: {
                                script: 'S + V2 (Regular -ed atau Irregular)',
                                gloss: 'Aturan -ed: stop → stopped; study → studied; play → played',
                            },
                            example: {
                                script: 'They launched the first prototype in 2025.',
                                gloss: 'Penanda waktu lampau tertutup: yesterday, last night, two days ago, in 2025',
                            },
                        },
                        fullTranslation: 'Mereka meluncurkan prototipe pertama pada tahun 2025.',
                    },
                    {
                        id: 'en-past-s-nom',
                        cells: {
                            polarity: { script: 'Positif Nominal (+)', gloss: 'Was vs Were' },
                            formula: {
                                script: 'S + was (I/He/She/It) / were (You/We/They) + Complement',
                                gloss: 'Menyatakan kondisi/lokasi di masa lampau',
                            },
                            example: {
                                script: 'The conference in Jakarta was extremely insightful.',
                                gloss: 'Tidak memakai did/didn’t pada kalimat nominal was/were',
                            },
                        },
                        fullTranslation: 'Konferensi di Jakarta tersebut sangat membuka wawasan.',
                    },
                    {
                        id: 'en-past-s-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Did mengembalikan V2 menjadi V1' },
                            formula: {
                                script: 'S + did + not + V1 | (Wh-) + Did + S + V1 + ?',
                                gloss: 'Kata kerja utama WAJIB kembali ke bentuk dasar V1 saat ada "did"',
                            },
                            example: {
                                script: 'Did you attend the workshop yesterday? — No, I didn’t go.',
                                gloss: 'SALAH: Did you went? / I didn’t went.',
                            },
                        },
                        fullTranslation: 'Apakah kamu menghadiri lokakarya kemarin? — Tidak, saya tidak pergi.',
                    },
                ],
                nativeMindset: {
                    headline: 'Pelafalan Akhiran "-ed" Punya 3 Bunyi Berbeda (/t/, /d/, /ɪd/)',
                    psychologyExplanation:
                        'Penutur asli tidak pernah mengucapkan "-ed" sebagai suku kata terpisah kecuali setelah huruf T atau D: (1) Setelah bunyi tak bersuara (p, k, s, sh, ch, f) dibaca /t/: worked /wɜːrkt/, watched /wɒtʃt/. (2) Setelah bunyi bersuara dibaca /d/: played /pleɪd/, cleaned /kliːnd/. (3) Hanya setelah /t/ atau /d/ dibaca /ɪd/: wanted /ˈwɒntɪd/, needed /ˈniːdɪd/.',
                    literalTrap:
                        'Jangan mengucapkan "worked" menjadi dua suku kata "wor-ked"—ucapkan satu suku kata tajam /wɜːrkt/.',
                },
            },

            // -------------------- UNIT 2.2: PAST CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.2 Past Continuous Tense — Rumus Was/Were + V-ing & Interupsi When vs While',
                grammaticalTradition: 'Unit 2/4: Past Progressive (Latar Adegan Lampau yang Sedang Berjalan)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk & Pola', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-past-c-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Was/Were + V-ing' },
                            formula: {
                                script: 'S + was/were + V-ing',
                                gloss: 'Menggambarkan aktivitas yang sedang berlangsung pada jam tertentu di masa lampau',
                            },
                            example: {
                                script: 'At 9 PM last night, I was compiling the TypeScript modules.',
                                gloss: 'Tepat pada titik jam 9 malam, proses kompilasi sedang berjalan',
                            },
                        },
                        fullTranslation: 'Pada pukul 9 malam tadi malam, saya sedang mengompilasi modul TypeScript.',
                    },
                    {
                        id: 'en-past-c-when-while',
                        cells: {
                            polarity: { script: 'Pola When vs While', gloss: 'Aksi Panjang Diinterupsi Aksi Singkat' },
                            formula: {
                                script: 'Past Continuous (aksi panjang) + when + Simple Past (interupsi) | While + Past Continuous',
                                gloss: '"While" mengiringi aksi panjang; "When" biasanya mengiringi aksi pemotong singkat',
                            },
                            example: {
                                script: 'While we were testing the server, the power suddenly went out.',
                                gloss: 'Aksi panjang: were testing | Aksi pemotong singkat: went out',
                            },
                        },
                        fullTranslation: 'Ketika kami sedang menguji server, listrik tiba-tiba padam.',
                    },
                    {
                        id: 'en-past-c-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Negasi & Inversi Was/Were' },
                            formula: {
                                script: 'S + wasn’t/weren’t + V-ing | (Wh-) + Was/Were + S + V-ing + ?',
                                gloss: 'Menanyakan latar situasi saat kejadian lampau terjadi',
                            },
                            example: {
                                script: 'What were you doing when the earthquake happened?',
                                gloss: 'Meminta gambaran latar saat gempa terjadi',
                            },
                        },
                        fullTranslation: 'Apa yang sedang kamu lakukan ketika gempa terjadi?',
                    },
                ],
                nativeMindset: {
                    headline: 'Psikologi Sinematik: Past Continuous Adalah "Latar Belakang Kamera", Simple Past Adalah "Adegan Utama"',
                    psychologyExplanation:
                        'Saat bercerita dalam bahasa Inggris, penutur asli memakai Past Continuous untuk melukiskan suasana latar ("The rain was pouring, people were rushing home...") lalu memasukkan Simple Past untuk peristiwa utama yang menggerakkan alur cerita ("...when a taxi stopped right in front of me").',
                    literalTrap:
                        'Jangan memakai Past Continuous untuk dua aksi singkat yang terjadi berurutan ("I came home, took a shower, and slept" — semuanya Simple Past).',
                },
            },

            // -------------------- UNIT 2.3: PAST PERFECT --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.3 Past Perfect Tense — Rumus Had + V3 ("Masa Lampau di Dalam Masa Lampau")',
                grammaticalTradition: 'Unit 3/4: Past Perfect (Urutan Dua Kejadian Lampau: Yang Lebih Dulu Terjadi)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis Urutan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-past-p-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Had + V3 (Untuk Semua Subjek)' },
                            formula: {
                                script: 'S + had + V3 (Kejadian #1) + before/when + S + V2 (Kejadian #2)',
                                gloss: 'Past Perfect menandai kejadian yang SUDAH SELESAI lebih dulu sebelum kejadian lampau lainnya',
                            },
                            example: {
                                script: 'When I arrived at the station, the train had already left.',
                                gloss: 'Urutan 1: Kereta berangkat (had left) → Urutan 2: Saya tiba (arrived)',
                            },
                        },
                        fullTranslation: 'Ketika saya tiba di stasiun, kereta sudah berangkat lebih dulu.',
                    },
                    {
                        id: 'en-past-p-neg',
                        cells: {
                            polarity: { script: 'Negatif (-)', gloss: 'Had + Not + V3' },
                            formula: {
                                script: 'S + had not (hadn’t) + V3 + before + S + V2',
                                gloss: 'Menyatakan pengalaman yang belum pernah terjadi hingga titik waktu lampau tertentu',
                            },
                            example: {
                                script: 'She hadn’t seen snow before she moved to Sapporo in 2024.',
                                gloss: 'Hingga titik kepindahan di 2024, pengalaman itu belum terjadi',
                            },
                        },
                        fullTranslation: 'Dia belum pernah melihat salju sebelum pindah ke Sapporo pada 2024.',
                    },
                    {
                        id: 'en-past-p-int',
                        cells: {
                            polarity: { script: 'Interogatif (?)', gloss: 'Inversi Had ke Depan Subjek' },
                            formula: {
                                script: '(Wh-) + Had + S + V3 + before/when + S + V2 + ?',
                                gloss: 'Mengonfirmasi apa yang sudah tuntas sebelum momen lampau tersebut',
                            },
                            example: {
                                script: 'Had you backed up the database before the crash occurred?',
                                gloss: 'Menanyakan apakah backup dilakukan sebelum sistem crash',
                            },
                        },
                        fullTranslation: 'Apakah kamu sudah mencadangkan basis data sebelum kerusakan terjadi?',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Past Perfect Wajib Dipakai vs Kapan Tidak Perlu?',
                    psychologyExplanation:
                        'Jika kejadian diceritakan berurutan secara kronologis ("I woke up, brushed my teeth, and left"), cukup pakai Simple Past semua. Past Perfect hanya dibutuhkan saat kamu MELOMPAT MUNDUR ke masa lalu yang lebih awal di tengah cerita lampau.',
                    literalTrap:
                        'Jangan memakai Past Perfect untuk satu kejadian lampau tunggal tanpa pembanding kejadian lampau kedua.',
                },
            },

            // -------------------- UNIT 2.4: PAST PERFECT CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.4 Past Perfect Continuous — Rumus Had Been + V-ing (Durasi Sebelum Titik Lampau)',
                grammaticalTradition: 'Unit 4/4: Past Perfect Progressive (Durasi Aktivitas Sebelum Interupsi Lampau)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-past-pc-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Durasi Sebelum Momen Lampau' },
                            formula: {
                                script: 'S + had + been + V-ing + for/since + before/when + S + V2',
                                gloss: 'Menekankan berapa lama proses berlangsung sebelum kejadian lampau kedua terjadi',
                            },
                            example: {
                                script: 'They had been negotiating for six hours before they finally signed the deal.',
                                gloss: 'Proses negosiasi 6 jam terjadi sebelum penandatanganan',
                            },
                        },
                        fullTranslation: 'Mereka telah bernegosiasi selama enam jam sebelum akhirnya menandatangani kesepakatan.',
                    },
                    {
                        id: 'en-past-pc-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Hadn’t Been + V-ing' },
                            formula: {
                                script: 'S + hadn’t + been + V-ing | How long + had + S + been + V-ing + when + S + V2 + ?',
                                gloss: 'Menanyakan durasi yang telah berjalan hingga titik lampau',
                            },
                            example: {
                                script: 'How long had you been waiting before the bus arrived?',
                                gloss: 'Fokus pada lamanya menunggu sebelum bus tiba',
                            },
                        },
                        fullTranslation: 'Sudah berapa lama kamu menunggu sebelum bus tiba?',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Past Continuous vs Past Perfect Continuous',
                    psychologyExplanation:
                        '"I was coding when you called" hanya memberi tahu aktivitas yang sedang berlangsung tepat saat telepon berdering. "I had been coding for three hours when you called" menekankan akumulasi durasi 3 jam yang sudah dijalani sebelum telepon berdering.',
                    literalTrap:
                        'Past Perfect Continuous selalu berjangkar pada titik masa lampau (had been), sedangkan Present Perfect Continuous berjangkar pada detik sekarang (have been).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 3: SISTEM FUTURE TENSE (4 TURUNAN TERPISAH UTUH) — INTERMEDIATE
    // =========================================================================
    {
        id: 'en-04-inter-grammar-future-system',
        lang: 'en',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 4,
        title: 'CEFR B1–B2 | Sistem Future Tense Lengkap (4 Turunan Terpisah Utuh)',
        subtitle:
            'Bedah mendalam satu per satu: Simple Future (Will vs Be Going To), Future Continuous, Future Perfect, dan Future Perfect Continuous',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 3.1: SIMPLE FUTURE --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.1 Simple Future Tense — Kontras Will + V1 vs Be Going To + V1',
                grammaticalTradition: 'Unit 1/4: Future Simple (Keputusan Spontan vs Rencana Terprogram & Bukti Visual)',
                direction: 'ltr',
                columns: [
                    { key: 'variant', roleLabel: 'Varian & Bentuk', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Psikologi Penggunaan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-fut-will',
                        cells: {
                            variant: { script: 'Will (Keputusan Spontan / Janji)', gloss: 'Diputuskan tepat saat berbicara' },
                            formula: {
                                script: 'S + will / won’t + V1 | Will + S + V1 + ?',
                                gloss: 'Digunakan untuk tawaran bantuan, janji, dan prediksi berbasis opini pribadi',
                            },
                            example: {
                                script: 'The server is down? Don’t worry, I’ll restart the container right now.',
                                gloss: 'Keputusan spontan yang baru diambil setelah mendengar masalah',
                            },
                        },
                        fullTranslation: 'Server-nya mati? Jangan khawatir, saya akan me-restart container-nya sekarang juga.',
                    },
                    {
                        id: 'en-fut-goingto',
                        cells: {
                            variant: { script: 'Be Going To (Rencana Awal / Bukti)', gloss: 'Sudah diniatkan sebelumnya' },
                            formula: {
                                script: 'S + am/is/are + going to + V1',
                                gloss: 'Digunakan untuk niat matang atau prediksi berdasarkan bukti fisik di depan mata',
                            },
                            example: {
                                script: 'Look at those dark clouds—it’s going to rain heavily.',
                                gloss: 'Ada bukti visual (awan gelap), sehingga wajib memakai "going to"',
                            },
                        },
                        fullTranslation: 'Lihat awan gelap itu—hujan deras akan turun.',
                    },
                ],
                nativeMindset: {
                    headline: 'Aturan Klausa Waktu (Time Clauses): Haram Memakai "Will" Setelah When/If/Before/After/As Soon As!',
                    psychologyExplanation:
                        'Dalam kalimat majemuk masa depan, klausa utama memakai "will", tetapi klausa waktu yang diawali when, as soon as, before, after, until WAJIB memakai Simple Present ("I will call you as soon as I arrive", BUKAN "as soon as I will arrive").',
                    literalTrap:
                        'Jangan memakai "will" untuk rencana yang sudah kamu susun sejak minggu lalu; gunakan "I am going to..." atau Present Continuous.',
                },
            },

            // -------------------- UNIT 3.2: FUTURE CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.2 Future Continuous Tense — Rumus Will Be + V-ing (Aksi Berjalan di Masa Depan)',
                grammaticalTradition: 'Unit 2/4: Future Progressive (Sedang Berlangsung pada Titik Waktu Masa Depan)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'cyan' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-fut-c-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Will Be + V-ing' },
                            formula: {
                                script: 'S + will + be + V-ing + (at this time tomorrow)',
                                gloss: 'Menggambarkan aktivitas yang sudah berada di tengah proses pada jam tertentu di masa depan',
                            },
                            example: {
                                script: 'At 10 AM tomorrow, we will be presenting our architecture to the board.',
                                gloss: 'Presentasi dimulai sebelum jam 10 dan masih berlangsung tepat jam 10',
                            },
                        },
                        fullTranslation: 'Pada pukul 10 pagi besok, kami akan sedang mempresentasikan arsitektur kami kepada dewan direksi.',
                    },
                    {
                        id: 'en-fut-c-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya Sopan (?)', gloss: 'Won’t Be + V-ing' },
                            formula: {
                                script: 'S + won’t + be + V-ing | Will + S + be + V-ing + ?',
                                gloss: 'Pertanyaan "Will you be using...?" terdengar jauh lebih sopan daripada "Will you use...?"',
                            },
                            example: {
                                script: 'Will you be passing by the post office on your way home?',
                                gloss: 'Menanyakan rencana rutin tanpa memberi tekanan',
                            },
                        },
                        fullTranslation: 'Apakah kamu akan melewati kantor pos dalam perjalanan pulangmu?',
                    },
                ],
                nativeMindset: {
                    headline: 'Strategi Kesopanan Tingkat Tinggi dengan Future Continuous',
                    psychologyExplanation:
                        'Penutur asli sering memakai Future Continuous untuk menanyakan agenda seseorang tanpa terkesan memaksa ("Will you be joining us for dinner?"). Ini memberi ruang bagi lawan bicara untuk menjawab secara alami.',
                    literalTrap:
                        'Jangan lupa kata kerja bantu "be" di antara "will" dan "V-ing" ("I will studying" — SALAH; wajib "I will be studying").',
                },
            },

            // -------------------- UNIT 3.3: FUTURE PERFECT --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.3 Future Perfect Tense — Rumus Will Have + V3 (Tuntas Sebelum Deadline)',
                grammaticalTradition: 'Unit 3/4: Future Perfect (Target yang Sudah Selesai Sebelum Titik Waktu Masa Depan)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Penanda Deadline', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-fut-p-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Will Have + V3' },
                            formula: {
                                script: 'S + will + have + V3 + by [deadline] / by the time + S + V1',
                                gloss: 'Penanda wajib: by tomorrow, by next Friday, by 2027, by the time you arrive',
                            },
                            example: {
                                script: 'By the end of this quarter, we will have migrated all seventy-five modules.',
                                gloss: 'Sebelum kuartal berakhir, seluruh proses migrasi sudah tuntas',
                            },
                        },
                        fullTranslation: 'Menjelang akhir kuartal ini, kami akan sudah memigrasikan seluruh tujuh puluh lima modul.',
                    },
                    {
                        id: 'en-fut-p-neg-int',
                        cells: {
                            polarity: { script: 'Negatif (-) & Tanya (?)', gloss: 'Won’t Have + V3' },
                            formula: {
                                script: 'S + won’t + have + V3 + by... | Will + S + have + V3 + by... + ?',
                                gloss: 'Mengecek kesiapan target sebelum tenggat waktu tiba',
                            },
                            example: {
                                script: 'Will you have finished the report by 5 PM?',
                                gloss: 'Berfokus pada status penyelesaian sebelum jam 5 sore',
                            },
                        },
                        fullTranslation: 'Apakah kamu akan sudah menyelesaikan laporan itu menjelang pukul 5 sore?',
                    },
                ],
                nativeMindset: {
                    headline: 'Proyeksi Waktu Mundur dari Masa Depan',
                    psychologyExplanation:
                        'Dalam Future Perfect, otakmu melompat berdiri di sebuah titik masa depan (misal: tahun 2027), lalu menoleh ke belakang untuk melihat pencapaian yang sudah tuntas sebelum titik itu tiba.',
                    literalTrap:
                        'Gunakan "by" (menjelang/paling lambat pada), bukan "until" (sampai terus-menerus), untuk tenggat waktu Future Perfect.',
                },
            },

            // -------------------- UNIT 3.4: FUTURE PERFECT CONTINUOUS --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.4 Future Perfect Continuous — Rumus Will Have Been + V-ing (Akumulasi Durasi)',
                grammaticalTradition: 'Unit 4/4: Future Perfect Progressive (Total Durasi Berjalan Hingga Titik Masa Depan)',
                direction: 'ltr',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk Kalimat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Baku', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-fut-pc-pos',
                        cells: {
                            polarity: { script: 'Positif (+)', gloss: 'Will Have Been + V-ing' },
                            formula: {
                                script: 'By [titik waktu masa depan], S + will + have + been + V-ing + for [durasi]',
                                gloss: 'Mengukur total durasi aktivitas yang masih terus berjalan saat milestone masa depan tercapai',
                            },
                            example: {
                                script: 'By next November, I will have been developing software for five years.',
                                gloss: 'Menyoroti pencapaian durasi kerja berkelanjutan hingga November depan',
                            },
                        },
                        fullTranslation: 'Menjelang November depan, saya akan sudah mengembangkan perangkat lunak selama lima tahun.',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Future Perfect Continuous Digunakan dalam Dunia Profesional?',
                    psychologyExplanation:
                        'Sangat umum digunakan dalam laporan pencapaian karier, riset jangka panjang, dan proyeksi proyek untuk menekankan konsistensi durasi ("By the time the satellite reaches Mars, it will have been traveling for seven months").',
                    literalTrap:
                        'Sama seperti seluruh keluarga Continuous lainnya, kata kerja statis (know, own, be) harus diturunkan ke Future Perfect Simple ("I will have known him for ten years").',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 4: CONDITIONALS (TYPE 0, 1, 2, 3, MIXED) — INTERMEDIATE
    // =========================================================================
    {
        id: 'en-05-inter-grammar-conditionals',
        lang: 'en',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 5,
        title: 'CEFR B1–B2 | Kalimat Pengandaian Lengkap (Conditionals Type 0, 1, 2, 3 & Mixed)',
        subtitle: 'Peta probabilitas logika dari fakta ilmiah hingga penyesalan masa lampau yang mustahil diubah',
        estimatedMinutes: 55,
        blocks: [
            {
                type: 'cognitive-pattern-table',
                title: 'Matriks 5 Tipe Kalimat Pengandaian Bahasa Inggris',
                grammaticalTradition: 'Conditional Mood & Counterfactual Logic',
                direction: 'ltr',
                columns: [
                    { key: 'condType', roleLabel: 'Tipe & Tingkat Kemungkinan', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus If-Clause + Main Clause', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Makna Nyata', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-cond-0',
                        cells: {
                            condType: { script: 'Type 0 (100% Fakta / Hukum Alam)', gloss: 'Selalu benar kapan pun terjadi' },
                            formula: { script: 'If + Simple Present, Simple Present', gloss: '"If" dapat diganti dengan "When" tanpa mengubah arti' },
                            example: { script: 'If you heat ice above 0°C, it melts.', gloss: 'Hukum fisika universal' },
                        },
                        fullTranslation: 'Jika kamu memanaskan es di atas 0°C, es itu mencair.',
                    },
                    {
                        id: 'en-cond-1',
                        cells: {
                            condType: { script: 'Type 1 (Kemungkinan Nyata Masa Depan)', gloss: 'Realistis terjadi (50%–90%)' },
                            formula: { script: 'If + Simple Present, S + will/can/may + V1', gloss: 'Haram memakai "will" di dalam If-Clause' },
                            example: { script: 'If the tests pass, we will deploy to production tonight.', gloss: 'Syarat realistis untuk rilis malam ini' },
                        },
                        fullTranslation: 'Jika pengujiannya lolos, kita akan merilis ke produksi malam ini.',
                    },
                    {
                        id: 'en-cond-2',
                        cells: {
                            condType: { script: 'Type 2 (Khayalan / Tidak Nyata Sekarang)', gloss: 'Bertentangan dengan fakta kini' },
                            formula: { script: 'If + Simple Past (were untuk semua subjek), S + would/could + V1', gloss: 'Subjunctive "were" dipakai untuk I/He/She/It dalam gaya formal' },
                            example: { script: 'If I were the CTO, I would open-source the core engine.', gloss: 'Fakta: Sekarang saya bukan CTO' },
                        },
                        fullTranslation: 'Seandainya saya adalah CTO, saya akan menjadikan mesin intinya open-source.',
                    },
                    {
                        id: 'en-cond-3',
                        cells: {
                            condType: { script: 'Type 3 (Penyesalan / Imajinasi Lampau)', gloss: '0% kemungkinan — masa lalu sudah lewat' },
                            formula: { script: 'If + Past Perfect (had + V3), S + would/could + have + V3', gloss: 'Membayangkan skenario alternatif dari peristiwa yang sudah terjadi' },
                            example: { script: 'If we had cached the queries earlier, the database wouldn’t have crashed.', gloss: 'Fakta: Kemarin tidak di-cache sehingga database crash' },
                        },
                        fullTranslation: 'Seandainya kita men-cache kueri lebih awal, basis data tidak akan mengalami crash.',
                    },
                    {
                        id: 'en-cond-mixed',
                        cells: {
                            condType: { script: 'Mixed Conditional (Lampau → Dampak Kini)', gloss: 'Syarat lampau, hasil sekarang' },
                            formula: { script: 'If + Past Perfect (had + V3), S + would + V1 (now)', gloss: 'Menghubungkan keputusan masa lalu dengan kondisi hari ini' },
                            example: { script: 'If I had taken that flight last night, I would be in Tokyo right now.', gloss: 'Keputusan tadi malam → posisi saat ini' },
                        },
                        fullTranslation: 'Seandainya saya naik penerbangan tadi malam itu, saya pasti sudah berada di Tokyo sekarang.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bahasa Inggris Memundurkan Tenses Saat Berkhayal (Backshifting)?',
                    psychologyExplanation:
                        'Dalam kognisi bahasa Inggris, "jarak waktu lampau" digunakan sebagai metafora untuk "jarak dari kenyataan". Semakin jauh tenses dimundurkan ke belakang (Present → Past → Past Perfect), semakin tidak nyata atau mustahil pengandaian tersebut.',
                    literalTrap:
                        'Jangan pernah menulis "If I would have known..." — dalam bahasa Inggris standar, "would" hanya berada di klausa hasil, sedangkan klausa "If" memakai "had + V3" ("If I had known...").',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 5: PASSIVE VOICE, INVERSION & SUBJUNCTIVE — ADVANCED
    // =========================================================================
    {
        id: 'en-06-adv-grammar-passive-inversion-subjunctive',
        lang: 'en',
        pillar: 'syntax',
        tier: 'advanced',
        order: 6,
        title: 'CEFR C1–C2 | Passive Voice Lintas Tenses, Negative Inversion & Mandative Subjunctive',
        subtitle: 'Struktur sintaksis tingkat tinggi untuk penulisan akademik, jurnal ilmiah, dan retorika formal',
        estimatedMinutes: 60,
        blocks: [
            {
                type: 'cognitive-pattern-table',
                title: 'Transformasi Passive Voice & Struktur Inversi Akademik (C1–C2)',
                grammaticalTradition: 'Advanced English Syntax & Academic Register',
                direction: 'ltr',
                columns: [
                    { key: 'construct', roleLabel: 'Konstruksi Sintaksis', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus Transformasi', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat Akademik / Formal', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'en-adv-pass',
                        cells: {
                            construct: { script: 'Passive Voice Universal Formula', gloss: 'Memindahkan fokus ke objek tindakan' },
                            formula: { script: 'Object + [To Be sesuai Tenses] + V3 + (by Agent)', gloss: 'Continuous Passive: is being V3 | Perfect Passive: has been V3' },
                            example: { script: 'The encryption protocol is currently being audited by security researchers.', gloss: 'Present Continuous Passive (is being + V3)' },
                        },
                        fullTranslation: 'Protokol enkripsi tersebut saat ini sedang diaudit oleh para peneliti keamanan.',
                    },
                    {
                        id: 'en-adv-inv',
                        cells: {
                            construct: { script: 'Negative Adverbial Inversion', gloss: 'Penekanan dramatis di awal kalimat' },
                            formula: { script: 'Negative Adverb (Never / Rarely / Not only / Seldom) + Auxiliary + S + V', gloss: 'Urutan kata dibalik seperti kalimat tanya setelah kata keterangan negatif di awal' },
                            example: { script: 'Not only did the algorithm reduce latency, but it also cut memory usage in half.', gloss: 'Inversi "did the algorithm reduce" setelah "Not only"' },
                        },
                        fullTranslation: 'Algoritma tersebut tidak hanya mengurangi latensi, tetapi juga memangkas penggunaan memori hingga setengahnya.',
                    },
                    {
                        id: 'en-adv-subj',
                        cells: {
                            construct: { script: 'Mandative Subjunctive', gloss: 'Tuntutan / Rekomendasi / Keharusan' },
                            formula: { script: 'S + insist/recommend/require/essential + that + S + V1 (Bare Infinitive)', gloss: 'Tanpa -s untuk he/she/it dan tanpa "should" dalam bahasa Inggris Amerika/akademik' },
                            example: { script: 'The committee recommended that every applicant submit a working prototype.', gloss: 'Memakai "submit" (V1 polos), BUKAN "submits"' },
                        },
                        fullTranslation: 'Komite merekomendasikan agar setiap pelamar menyerahkan prototipe yang berfungsi.',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Penulisan Ilmiah Mewajibkan Passive Voice vs Active Voice?',
                    psychologyExplanation:
                        'Gunakan Passive Voice ketika pelaku tidak diketahui, tidak penting, atau ketika kamu ingin menjaga objektivitas laporan eksperimen ("The samples were heated to 300°C"). Gunakan Active Voice saat menyampaikan argumen atau kontribusi penulis ("We propose a novel architecture...").',
                    literalTrap:
                        'Setelah "Never have I..." atau "Rarely does...", jangan lupa membalik posisi kata kerja bantu (auxiliary) ke depan subjek.',
                },
            },
        ],
    },
];
// scripts/builders/corpus-en.ts
import {
    fetchTextWithFallback,
    logStep,
    writeValidatedModule,
    type BuildOptions,
} from '../../lib/etl-utils.ts';
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';
import { EN_GRAMMAR_MODULES } from '../grammar/grammar-en.ts';

export async function buildEnglishModules(options: BuildOptions) {
    const modules: LessonModule[] = [
        // =========================================================================
        // TIER 0: FOUNDATION — SEJARAH BAHASA INGGRIS & SISTEM FONETIK IPA
        // =========================================================================
        {
            id: 'en-00-found-origin-history-phonetics',
            lang: 'en',
            pillar: 'phonetics',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sejarah Bahasa Inggris, Great Vowel Shift & Sistem IPA',
            subtitle:
                'Mengapa ejaan Inggris sering berbeda dari bunyinya, tiga lapisan sejarah kosakata, dan ritme Stress-Timed',
            estimatedMinutes: 40,
            blocks: [
                {
                    type: 'linguistic-lore',
                    title: 'Tiga Lapisan Sejarah & Misteri Ejaan Bahasa Inggris',
                    eraOrDomain: 'Sejarah Linguistik Inggris (Old English → Middle English → Modern English)',
                    direction: 'ltr',
                    narrativeSummary:
                        'Bahasa Inggris adalah bahasa Jermanik yang menyerap lebih dari 60% kosakatanya dari bahasa Prancis Norman dan Latin. Struktur tiga lapis ini menjelaskan mengapa bahasa Inggris memiliki sinonim bertingkat untuk konsep yang sama (misal: ask [Jermanik/kasual] → question [Prancis/formal] → interrogate [Latin/akademik]).',
                    milestones: [
                        {
                            stage: '1. Old English / Anglo-Saxon (450–1066 M)',
                            scriptSample: 'house • water • bread • friend • strong • sleep',
                            reading: 'Kosakata dasar sehari-hari berakar Jermanik',
                            explanation:
                                'Kata-kata pendek 1–2 suku kata yang menyangkut tubuh, keluarga, alam, dan emosi dasar berasal dari suku Anglo-Saxon dan pengaruh Viking (Old Norse seperti sky, egg, window, they).',
                        },
                        {
                            stage: '2. Penaklukan Norman 1066 & Middle English (1066–1500 M)',
                            scriptSample: 'cow (Anglo-Saxon) → beef (Prancis) | pig → pork | sheep → mutton',
                            reading: 'Diferensiasi kelas sosial dalam kosakata',
                            explanation:
                                'Petani Inggris merawat hewan ternak di ladang (cow, pig, sheep), sementara bangsawan berbahasa Prancis menyantap dagingnya di meja makan (boeuf → beef, porc → pork, mouton → mutton).',
                        },
                        {
                            stage: '3. The Great Vowel Shift (1400–1700 M)',
                            scriptSample: 'name (/naːmə/ → /neɪm/) • time (/tiːmə/ → /taɪm/) • knight (/knɪçt/ → /naɪt/)',
                            reading: 'Pergeseran pelafalan vokal panjang sementara ejaan cetak sudah dibekukan',
                            explanation:
                                'Mesin cetak William Caxton (1476) membekukan ejaan bahasa Inggris tepat sebelum lidah penutur Inggris menggeser seluruh posisi vokal panjang mereka. Inilah penyebab utama mengapa alfabet Latin tidak lagi mencerminkan bunyi Inggris secara 1:1—dan mengapa IPA (International Phonetic Alphabet) wajib dikuasai.',
                        },
                    ],
                    structuralRules: [
                        {
                            conceptName: 'Stress-Timed Rhythm & The Schwa (/ə/)',
                            definition:
                                'Bahasa Inggris menjaga jarak ketukan antar suku kata BERTEKANAN (stressed syllables). Vokal di suku kata lemah otomatis direduksi menjadi bunyi netral Schwa (/ə/).',
                            whyItMatters:
                                'Schwa (/ə/) adalah bunyi vokal paling sering muncul dalam percakapan penutur asli (misal pada kata about /əˈbaʊt/, banana /bəˈnæn.ə/, support /səˈpɔːrt/).',
                            examples: [
                                'PHOtograph (/ˈfoʊ.tə.ɡræf/)',
                                'phoTOgraphy (/fəˈtɑː.ɡrə.fi/)',
                                'photoGRAphic (/ˌfoʊ.təˈɡræf.ɪk/)',
                            ],
                        },
                        {
                            conceptName: 'Pola Phonics & Magic-E (Silent E)',
                            definition:
                                'Huruf "e" bisu di akhir kata pola Vokal + Konsonan + e memanjangkan bunyi vokal sebelumnya menjadi bunyi nama huruf alfabetnya.',
                            whyItMatters:
                                'Membantu membaca ribuan kata baru tanpa perlu menebak.',
                            examples: [
                                'cap (/kæp/) → cape (/keɪp/)',
                                'bit (/bɪt/) → bite (/baɪt/)',
                                'note (/noʊt/) → not (/nɑːt/)',
                            ],
                        },
                    ],
                    funFactsAndTips: [
                        'Lebih dari 84% kata bahasa Inggris mengikuti aturan posisi huruf yang konsisten jika kamu memahami digraf (th, sh, ch, ph, gh) dan pola suku kata.',
                        'Tips Mengingat: Pada kata akademik berakhiran -tion, -sion, atau -ic, tekanan kata hampir selalu jatuh tepat satu suku kata sebelum akhiran tersebut (in-for-MA-tion, e-co-NO-mic).',
                    ],
                },
                {
                    type: 'script-matrix',
                    title: 'Tabel Simbol IPA Kritis & Pola Ejaan Inggris (Grapheme Matrix)',
                    scriptSystem: 'International Phonetic Alphabet (en-US / en-GB)',
                    direction: 'ltr',
                    description: 'Kunci membaca transkripsi kamus internasional tanpa menebak-nebak.',
                    cells: [
                        {
                            glyph: '/ə/',
                            reading: 'Schwa (Vokal Netral)',
                            transliteration: 'about, banana, problem',
                            componentRole: 'Vokal Tak Bertekanan',
                            mnemonic: 'Rahang rileks 0.05 detik — bunyi paling hemat energi',
                        },
                        {
                            glyph: '/ɪ/ vs /iː/',
                            reading: 'Lax vs Tense High Front',
                            transliteration: 'ship vs sheep • live vs leave',
                            componentRole: 'Kontras Vokal',
                            mnemonic: 'Bukan pendek vs panjang, melainkan otot lidah rileks vs tegang',
                        },
                        {
                            glyph: '/θ/ vs /ð/',
                            reading: 'Voiceless vs Voiced Dental',
                            transliteration: 'think, bath vs this, mother',
                            componentRole: 'Konsonan Dental',
                            mnemonic: 'Ujung lidah menyentuh gigi seri atas tanpa suara vs bergetar',
                        },
                        {
                            glyph: '/ʃ/ vs /tʃ/',
                            reading: 'Fricative vs Affricate',
                            transliteration: 'ship, nation vs chip, watch',
                            componentRole: 'Konsonan Palatal',
                            mnemonic: 'Desis mengalir (sh) vs letupan + desis (ch)',
                        },
                        {
                            glyph: '/æ/ vs /e/',
                            reading: 'Ash vs Open-Mid Front',
                            transliteration: 'bad vs bed • man vs men',
                            componentRole: 'Kontras Vokal Depan',
                            mnemonic: 'Mulut terbuka lebar untuk /æ/ (bad) vs sedang untuk /e/ (bed)',
                        },
                        {
                            glyph: '/ʒ/ vs /dʒ/',
                            reading: 'Voiced Palatal Fricative vs Affricate',
                            transliteration: 'vision, measure vs judge, bridge',
                            componentRole: 'Konsonan Palatal Bersuara',
                            mnemonic: 'Getaran lembut di tengah kata (vision) vs letupan tegas (judge)',
                        },
                    ],
                },
            ],
        },

        // =========================================================================
        // SUNTIKKAN SELURUH MODUL TATA BAHASA TERPISAH (GRAMMAR-EN.TS)
        // =========================================================================
        ...EN_GRAMMAR_MODULES,

        // =========================================================================
        // TIER 4: NATIVE, DIALECTS & ENGLISH STYLISTICS
        // =========================================================================
        {
            id: 'en-10-native-rhetoric-stylistics-varieties',
            lang: 'en',
            pillar: 'lexicon-dialogue',
            tier: 'native',
            order: 10,
            title: 'Native & Stylistics | English Rhetoric, Stylistics, Global Dialects & Idioms',
            subtitle:
                'Seni persuasi retorika Inggris (Chiasmus, Anaphora, Litotes), perbandingan UK vs US vs Aussie, & idiom alami',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'rhetoric-stylistics',
                    title: 'English Rhetoric & Stylistics (Seni Persuasi & Stilistika Sastra)',
                    traditionName: 'Classical & Modern English Stylistics',
                    direction: 'ltr',
                    overview:
                        'Retorika bahasa Inggris memadukan keseimbangan klausa paralel, pembalikan struktur (Chiasmus), dan kontras pilihan kata Anglo-Saxon vs Latinate untuk membangun pidato, esai, dan narasi berkelas.',
                    devices: [
                        {
                            deviceName: 'Struktur Silang Terbalik (Chiasmus)',
                            nativeTerm: 'Chiasmus (A-B → B-A)',
                            mechanism:
                                'Membalik urutan kata atau konsep pada klausa kedua untuk menciptakan efek filosofis yang tak terlupakan.',
                            literaryExample: 'Ask not what your country can do for you—ask what you can do for your country.',
                            translation:
                                'Jangan tanyakan apa yang dapat negara berikan kepadamu—tanyakan apa yang dapat kamu berikan kepada negaramu.',
                            aestheticEffect: 'Simetri cermin yang menggeser fokus dari pasif menjadi tanggung jawab aktif.',
                        },
                        {
                            deviceName: 'Repetisi Pembuka Berantai (Anaphora)',
                            nativeTerm: 'Anaphora',
                            mechanism:
                                'Mengulang kata atau frasa yang sama pada awal beberapa klausa berturut-turut untuk membangun momentum.',
                            literaryExample: 'We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields.',
                            translation:
                                'Kita akan berjuang di pantai-pantai, kita akan berjuang di tempat-tempat pendaratan, kita akan berjuang di ladang-ladang.',
                            aestheticEffect: 'Menciptakan keteguhan ritmis yang kuat dalam pidato publik.',
                        },
                        {
                            deviceName: 'Penegasan Melalui Negasi (Litotes)',
                            nativeTerm: 'Litotes (Understatement)',
                            mechanism: 'Menyatakan makna positif kuat dengan menegasi kebalikannya.',
                            literaryExample: 'Deploying a zero-downtime architecture at global scale is no small feat.',
                            translation:
                                'Merilis arsitektur tanpa henti di skala global bukanlah pencapaian kecil (pencapaian luar biasa).',
                            aestheticEffect: 'Memberikan nada elegan, rendah hati, namun penuh penekanan.',
                        },
                    ],
                    dialectAndSlangNotes: [
                        {
                            varietyName: 'British English (Received Pronunciation / UK)',
                            regionOrContext: 'Inggris & Persemakmuran (Non-Rhotic: huruf r di akhir tidak dibunyikan)',
                            sampleExpression: 'schedule /ˈʃedʒ.uːl/ • flat • lift • queue • brilliant',
                            standardEquivalent: 'schedule /ˈskedʒ.uːl/ • apartment • elevator • line • awesome',
                            meaning: 'Perbedaan pelafalan rhotic, vokal /ɒ/ pada "hot", dan kosakata harian.',
                        },
                        {
                            varietyName: 'Australian English (Aussie Vernacular)',
                            regionOrContext: 'Australia & Selandia Baru',
                            sampleExpression: 'Arvo (afternoon) • Brekkie (breakfast) • No worries, mate!',
                            standardEquivalent: 'Afternoon • Breakfast • You are welcome / No problem!',
                            meaning: 'Kecenderungan penyingkatan kata berakhiran -o dan -ie yang akrab.',
                        },
                        {
                            varietyName: 'Modern Tech & Workplace Idioms',
                            regionOrContext: 'Komunikasi Tim Global & Startup',
                            sampleExpression: 'Ballpark figure • Low-hanging fruit • On the same page',
                            standardEquivalent: 'Rough estimate • Easiest high-impact task • Having shared understanding',
                            meaning: 'Idiom metaforis yang wajib dipahami dalam rapat internasional.',
                        },
                    ],
                },
            ],
        },
    ];

    // =========================================================================
    // KORPUS KOSAKATA TERBUKA: 15.000+ ENTRI BER-IPA DARI EN_US.TXT
    // =========================================================================
    logStep('en', 'Mengunduh kamus fonetik terbuka en_US IPA (15.000+ kata)...');
    const ipaRaw = await fetchTextWithFallback([
        'https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data/en_US.txt',
    ]);

    const allEnEntries: Array<{
        id: string;
        term: string;
        reading: string;
        meaning: string;
        partOfSpeech: string;
    }> = [];

    if (ipaRaw) {
        const lines = ipaRaw.split('\n');
        for (const line of lines) {
            if (allEnEntries.length >= 15000) break;
            const [word, ipa] = line.split('\t');
            if (!word || !ipa || !/^[a-z]{2,18}$/.test(word.trim())) continue;
            const cleanWord = word.trim();
            allEnEntries.push({
                id: `en-ipa-${allEnEntries.length + 1}`,
                term: cleanWord,
                reading: ipa.split(',')[0]?.trim() ?? ipa.trim(),
                meaning: 'Transkripsi Fonetik Standar Amerika (en-US IPA)',
                partOfSpeech:
                    cleanWord.length <= 5
                        ? 'CEFR A1–A2 Core'
                        : cleanWord.length <= 9
                            ? 'CEFR B1–B2'
                            : 'CEFR C1–C2 Academic',
            });
        }
    }

    const enBeg = allEnEntries.filter((e) => e.partOfSpeech === 'CEFR A1–A2 Core');
    const enInt = allEnEntries.filter((e) => e.partOfSpeech === 'CEFR B1–B2');
    const enAdv = allEnEntries.filter((e) => e.partOfSpeech === 'CEFR C1–C2 Academic');

    if (enBeg.length > 0) {
        modules.push({
            id: 'en-07-beg-lexicon-cefr-a1-a2',
            lang: 'en',
            pillar: 'lexicon-dialogue',
            tier: 'beginner',
            order: 7,
            title: `CEFR A1–A2 | Dialog Harian & Bank Fonetik IPA (${enBeg.length} Kata)`,
            subtitle: 'Percakapan profesional + kosakata inti ber-IPA Amerika',
            estimatedMinutes: 50,
            blocks: [
                {
                    type: 'dialogue-theater',
                    title: 'Workplace Register: Sinkronisasi Arsitektur Produk',
                    contextSituation: 'Diskusi teknis antara Engineer dan Tech Lead',
                    registerLevel: 'Professional Consultative',
                    direction: 'ltr',
                    turns: [
                        {
                            speaker: 'Alex',
                            line: 'Have you had a chance to benchmark the new caching layer yet?',
                            reading: '/hæv juː hæd ə tʃæns tə ˈbentʃ.mɑːrk ðə njuː ˈkæʃ.ɪŋ ˈleɪ.ər jet/',
                            translation: 'Apakah kamu sudah sempat menguji lapisan cache yang baru?',
                            grammarHighlight: 'Present Perfect (Have you had... yet?)',
                        },
                        {
                            speaker: 'Naufal',
                            line: 'Yes, I ran the suite this morning and latency dropped by eighty percent.',
                            reading: '/jes aɪ ræn ðə swiːt ðɪs ˈmɔːr.nɪŋ/',
                            translation: 'Ya, saya menjalankan pengujian pagi ini dan latensi turun 80 persen.',
                            grammarHighlight: 'Past Simple (this morning sudah lewat)',
                        },
                    ],
                },
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Inggris Fondasi + IPA (en-US)',
                    direction: 'ltr',
                    totalCount: enBeg.length,
                    entries: enBeg,
                },
            ],
        });
    }

    if (enInt.length > 0) {
        modules.push({
            id: 'en-08-inter-lexicon-cefr-b1-b2',
            lang: 'en',
            pillar: 'lexicon-dialogue',
            tier: 'intermediate',
            order: 8,
            title: `CEFR B1–B2 | Bank Kosakata Menengah & IPA (${enInt.length} Kata)`,
            subtitle: 'Ribuan kosakata menengah lengkap dengan transkripsi fonetik IPA',
            estimatedMinutes: 75,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Inggris Menengah + IPA',
                    direction: 'ltr',
                    totalCount: enInt.length,
                    entries: enInt,
                },
            ],
        });
    }

    if (enAdv.length > 0) {
        modules.push({
            id: 'en-09-adv-lexicon-cefr-c1-c2',
            lang: 'en',
            pillar: 'lexicon-dialogue',
            tier: 'advanced',
            order: 9,
            title: `CEFR C1–C2 | Bank Kosakata Akademik & Mahir + IPA (${enAdv.length} Kata)`,
            subtitle: 'Kosakata multi-morfem tingkat lanjut untuk jurnalistik, bisnis, dan esai akademik',
            estimatedMinutes: 90,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Inggris Akademik + IPA',
                    direction: 'ltr',
                    totalCount: enAdv.length,
                    entries: enAdv,
                },
            ],
        });
    }

    return Promise.all(modules.map((m) => writeValidatedModule(m, options)));
}
// scripts/builders/corpus-ja.ts
import {
    fetchJsonWithFallback,
    logStep,
    writeValidatedModule,
    type BuildOptions,
} from '../../lib/etl-utils.ts';
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';
import { JA_GRAMMAR_MODULES } from '../grammar/grammar-ja.ts';

interface JlptWord {
    word: string;
    meaning: string;
    furigana: string;
    romaji: string;
    level: number;
}

interface KanjiDetail {
    kanji: string;
    grade?: number;
    stroke_count?: number;
    meanings: string[];
    kun_readings: string[];
    on_readings: string[];
}

export async function buildJapaneseModules(options: BuildOptions) {
    const modules: LessonModule[] = [
        // =========================================================================
        // TIER 0: FOUNDATION — SEJARAH & LOGIKA 3 SISTEM AKSARA JEPANG
        // =========================================================================
        {
            id: 'ja-00-found-origin-three-scripts',
            lang: 'ja',
            pillar: 'script',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sejarah & Logika 3 Sistem Aksara Jepang: Kanji, Hiragana & Katakana',
            subtitle:
                'Mengapa Jepang tidak memakai spasi, bagaimana Man’yōgana melahirkan Kana, dan pembagian tugas visual ketiga aksara',
            estimatedMinutes: 35,
            blocks: [
                {
                    type: 'linguistic-lore',
                    title: 'Evolusi Aksara Jepang: Dari Kanji Tiongkok Menuju Simfoni Tiga Aksara',
                    eraOrDomain: 'Sejarah Ortografi Jepang (Era Nara & Heian, Abad ke-5 – ke-9 M)',
                    direction: 'ltr',
                    narrativeSummary:
                        'Jepang awalnya tidak memiliki sistem tulisan sendiri dan mengadopsi aksara Han (Kanji) dari Tiongkok. Namun, struktur bahasa Jepang memiliki akhiran konjugasi kata kerja dan partikel yang tidak ada dalam Mandarin. Untuk mencatat bunyi tata bahasa Jepang, lahirlah dua aksara silabis asli Jepang (Kana) yang bekerja harmonis bersama Kanji.',
                    milestones: [
                        {
                            stage: '1. Man’yōgana (万葉仮名 — Abad ke-7)',
                            scriptSample: '安 (a) → あ (Hiragana) | 阿 (a) → ア (Katakana)',
                            reading: 'Meminjam Kanji hanya untuk bunyinya tanpa peduli maknanya',
                            explanation:
                                'Dalam antologi puisi Man’yōshū, penyair Jepang memakai karakter Kanji tertentu secara fonetis untuk menuliskan partikel dan akhiran bahasa Jepang.',
                        },
                        {
                            stage: '2. Hiragana (ひらがな — Tulisan Kursif Melengkung)',
                            scriptSample: '私は日本語を勉強します。',
                            reading: 'Kanji (akar makna) + Hiragana (partikel は・を & akhiran します)',
                            explanation:
                                'Dikembangkan melalui kaligrafi cepat yang dipopulerkan oleh penulis sastra wanita istana era Heian (seperti Murasaki Shikibu dalam Genji Monogatari). Berfungsi menandai partikel, konjugasi, dan kata asli Jepang.',
                        },
                        {
                            stage: '3. Katakana (カタカナ — Tulisan Sudut Tajam)',
                            scriptSample: 'コーヒー • コンピューター • テレビ',
                            reading: 'Kōhī (Kopi) • Konpyūtā (Komputer) • Terebi (TV)',
                            explanation:
                                'Diciptakan oleh para biksu Buddha era Nara sebagai catatan singkat (shorthand) dari bagian sudut karakter Kanji. Kini berfungsi menandai kata serapan asing (Gairaigo), istilah ilmiah, nama asing, dan efek suara onomatope.',
                        },
                    ],
                    structuralRules: [
                        {
                            conceptName: 'Mengapa Kalimat Jepang Tidak Menggunakan Spasi?',
                            definition:
                                'Pergantian kontras visual antara Kanji yang padat bersegi dan Hiragana yang melengkung terbuka otomatis memberi sinyal bagi otak pembaca di mana satu kata berakhir dan partikel dimulai.',
                            whyItMatters:
                                'Menulis seluruh kalimat Jepang dengan Hiragana semua ("ははははながすき") sangat sulit dibaca dibandingkan campuran Kanji-Hiragana ("母は花が好き" = Ibu menyukai bunga).',
                            examples: [
                                '食べる (Kanji 食 = makan + Hiragana べる = akhiran kamus)',
                                '食べました (akar tetap 食, ekor berubah jadi べました)',
                            ],
                        },
                        {
                            conceptName: 'Aturan Dasar Urutan Guratan (Kakijun — 書き順)',
                            definition:
                                'Kiri ke kanan, atas ke bawah, garis horizontal mendahului garis vertikal yang memotongnya, dan garis tengah ditulis lebih dulu pada bentuk simetris.',
                            whyItMatters: 'Menjamin keseimbangan proporsi karakter Kana dan Kanji.',
                            examples: [
                                'あ (1. datar → 2. vertikal melengkung → 3. simpul melingkar)',
                                '十 (1. datar 一 → 2. tegak 丨)',
                            ],
                        },
                    ],
                    funFactsAndTips: [
                        'Setiap karakter Hiragana dan Katakana mewakili tepat 1 ketukan waktu (Mora), bukan sekadar huruf konsonan/vokal terpisah.',
                        'Sebagian besar Kanji memiliki dua cara baca: On’yomi (音読み — bunyi serapan Tionghoa, dipakai dalam kata majemuk) dan Kun’yomi (訓読み — bacaan kata asli Jepang, biasanya berdiri sendiri).',
                    ],
                },
                {
                    type: 'script-matrix',
                    title: 'Tabel Referensi Hiragana & Katakana Fondasi (Gojūon)',
                    scriptSystem: 'Kana Foundation Table (五十音図)',
                    direction: 'ltr',
                    description: 'Pasangan karakter Hiragana (melengkung) dan Katakana (menyudut) beserta aturan guratannya.',
                    cells: [
                        { glyph: 'あ / ア', reading: 'a', transliteration: 'Vokal A', componentRole: 'Baris Vokal (母音)', strokeOrderRule: '3 guratan (Hiragana) / 2 guratan (Katakana)', strokeCount: 3, mnemonic: 'Bentuk huruf "a" melengkung di dalam あ' },
                        { glyph: 'い / イ', reading: 'i', transliteration: 'Vokal I', componentRole: 'Baris Vokal (母音)', strokeOrderRule: 'Kiri turun berkait, lalu kanan pendek', strokeCount: 2, mnemonic: 'Dua garis vertikal sejajar seperti huruf "ii"' },
                        { glyph: 'う / ウ', reading: 'u', transliteration: 'Vokal U', componentRole: 'Baris Vokal (母音)', strokeOrderRule: 'Titik atas dulu, lalu lengkungan bawah', strokeCount: 2, mnemonic: 'Seperti telinga (mimi) yang mendengar bunyi "u"' },
                        { glyph: 'え / エ', reading: 'e', transliteration: 'Vokal E', componentRole: 'Baris Vokal (母音)', strokeOrderRule: 'Titik atas → garis zig-zag melengkung', strokeCount: 2, mnemonic: 'Katakana エ menyerupai balok besi huruf I kapital' },
                        { glyph: 'お / オ', reading: 'o', transliteration: 'Vokal O', componentRole: 'Baris Vokal (母音)', strokeOrderRule: '1. Datar → 2. Vertikal melingkar → 3. Titik kanan', strokeCount: 3, mnemonic: 'Pemain golf mengayunkan stik bola "o"' },
                        { glyph: 'か / カ', reading: 'ka', transliteration: 'Suku Kata KA', componentRole: 'Baris K (か行)', strokeOrderRule: 'Lengkung kait → garis potong → titik kanan', strokeCount: 3, mnemonic: 'Berasal dari Kanji 加 (menambah)' },
                        { glyph: 'さ / サ', reading: 'sa', transliteration: 'Suku Kata SA', componentRole: 'Baris S (さ行)', strokeOrderRule: 'Datar → miring memotong → lengkung dasar', strokeCount: 3, mnemonic: 'Hiragana さ adalah cerminan dari ち (chi)' },
                        { glyph: 'た / タ', reading: 'ta', transliteration: 'Suku Kata TA', componentRole: 'Baris T (た行)', strokeOrderRule: 'Tanda silang kiri + dua garis kanan', strokeCount: 4, mnemonic: 'Hiragana た terlihat persis seperti huruf "t" dan "a"' },
                    ],
                },
            ],
        },
        {
            id: 'ja-01-found-phonetics-mora-pitch',
            lang: 'ja',
            pillar: 'phonetics',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | On’in & Pitch Accent (高低アクセント): Ritme Mora Jepang',
            subtitle:
                'Memahami ketukan waktu Mora, bunyi panjang Chōon, konsonan ganda Sokuon (っ), dan aksen nada Tokyo',
            estimatedMinutes: 25,
            blocks: [
                {
                    type: 'cognitive-pattern-table',
                    title: 'Kontras Pitch Accent & Ketukan Mora',
                    grammaticalTradition: 'Fonologi Jepang (日本語音声学)',
                    direction: 'ltr',
                    columns: [
                        { key: 'word', roleLabel: 'Kata & Jumlah Mora', semanticColor: 'cyan' },
                        { key: 'pitch', roleLabel: 'Kontur Nada (Tinggi/Rendah)', semanticColor: 'violet' },
                        { key: 'meaning', roleLabel: 'Perbedaan Makna', semanticColor: 'rose' },
                    ],
                    rows: [
                        {
                            id: 'ja-f-ph1',
                            cells: {
                                word: { script: 'はし (ha-shi)', reading: '2 Mora', gloss: 'Ejaan Kana identik' },
                                pitch: { script: 'HA-shi (Tinggi→Rendah) vs ha-SHI (Rendah→Tinggi)', gloss: 'Posisi jatuh nada menentukan arti' },
                                meaning: { script: 'Sumpit (箸) vs Jembatan (橋)', gloss: 'Membedakan homofon dalam bicara alami' },
                            },
                            fullTranslation: '箸 (Sumpit) vs 橋 (Jembatan)',
                        },
                        {
                            id: 'ja-f-ph2',
                            cells: {
                                word: { script: 'きて vs きって', reading: 'ki-te (2) vs ki-t-te (3)', gloss: 'Tsu kecil (っ) = 1 ketukan diam' },
                                pitch: { script: 'Jeda glotal penuh 1 mora', gloss: 'Menahan udara sebelum konsonan t' },
                                meaning: { script: 'Datanglah (来て) vs Perangko (切手)', gloss: 'Mora kosong mengubah identitas kata' },
                            },
                            fullTranslation: '来て (Datanglah) vs 切手 (Perangko)',
                        },
                    ],
                    nativeMindset: {
                        headline: 'Mengapa Bahasa Jepang Diukur dengan Metronom Mora?',
                        psychologyExplanation:
                            'Setiap karakter Kana mendapat porsi waktu identik. Huruf ん (n) dan jeda っ masing-masing dihitung 1 ketukan penuh, sehingga kata "Ni-p-po-n" (日本) memiliki 4 ketukan ritmis yang rata.',
                        literalTrap:
                            'Jangan menekan volume suara (stress) seperti bahasa Inggris; cukup ubah tinggi-rendah nada (pitch) secara lembut.',
                    },
                },
            ],
        },

        // =========================================================================
        // SUNTIKKAN SELURUH MODUL TATA BAHASA TERPISAH (GRAMMAR-JA.TS)
        // =========================================================================
        ...JA_GRAMMAR_MODULES,

        // =========================================================================
        // TIER 4: NATIVE, DIALECTS & SHŪJIGAKU
        // =========================================================================
        {
            id: 'ja-11-native-rhetoric-shujigaku-dialects',
            lang: 'ja',
            pillar: 'lexicon-dialogue',
            tier: 'native',
            order: 11,
            title: 'Native & Stylistics | Shūjigaku (修辞学), Yojijukugo, Kansai-ben & Slang',
            subtitle:
                'Ilmu retorika sastra Jepang, idiom 4 Kanji, puisi Haiku, dialek Kansai, dan bahasa gaul anak muda Tokyo',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'rhetoric-stylistics',
                    title: 'Shūjigaku (修辞学 — Ilmu Retorika & Estetika Sastra Jepang)',
                    traditionName: 'Nihon Shūjigaku (日本修辞学) & Tradisi Waka/Haiku',
                    direction: 'ltr',
                    overview:
                        'Retorika Jepang mengutamakan keindahan tersirat (Yojō 余情 — resonansi makna tak terucap), harmoni alam musiman (Kigo), permainan kata ganda (Kakekotoba), dan idiom 4 karakter Yojijukugo.',
                    devices: [
                        {
                            deviceName: 'Kata Ganda Puitis (Kakekotoba — 掛詞)',
                            nativeTerm: '掛詞 (Pivot Word)',
                            mechanism:
                                'Satu bunyi kata memikul dua makna berbeda sekaligus untuk menjembatani citraan alam dan emosi manusia.',
                            literaryExample: '花の色は移りにけりないたづらに（Ono no Komachi）',
                            reading: 'Hana no iro wa utsurinikeri na itazura ni',
                            translation:
                                'Warna bunga sakura telah memudar sia-sia (seiring pudarnya kecantikan dan waktu hidupku).',
                            aestheticEffect: 'Menciptakan kedalaman melankolis khas estetika Mono no Aware (物の哀れ).',
                        },
                        {
                            deviceName: 'Idiom 4 Karakter Kanji (Yojijukugo — 四字熟語)',
                            nativeTerm: '一期一会 (Ichi-go Ichi-e)',
                            mechanism: 'Empat karakter Kanji padat makna yang berakar pada filosofi Zen dan upacara minum teh (Sadō).',
                            literaryExample: 'すべての出会いを一期一会として大切にする。',
                            reading: 'Subete no deai o ichigo ichie to shite taisetsu ni suru.',
                            translation:
                                'Menghargai setiap pertemuan sebagai "satu kali seumur hidup, satu kesempatan" yang takkan terulang.',
                            aestheticEffect: 'Ungkapan filosofis yang sangat dihormati dalam budaya maupun pidato bisnis Jepang.',
                        },
                    ],
                    dialectAndSlangNotes: [
                        {
                            varietyName: 'Dialek Kansai (Kansai-ben — 関西弁)',
                            regionOrContext: 'Osaka, Kyoto, Kobe (Wilayah Kansai)',
                            sampleExpression: 'なんでやねん！ • めっちゃええやん • おおきに',
                            standardEquivalent: 'どうしてだよ！ • すごくいいね • ありがとう',
                            meaning: 'Kenapa begitu sih! • Bagus banget kan • Terima kasih (ekspresif dan hangat).',
                        },
                        {
                            varietyName: 'Wakamono Kotoba (若者言葉 — Slang Anak Muda)',
                            regionOrContext: 'Percakapan Kasual Generasi Muda & Media Sosial Jepang',
                            sampleExpression: 'エモい (Emoi) • 推す (Osu) • ヤバい (Yabai)',
                            standardEquivalent: '感動的・懐かしい • 応援する • すごい / 危険',
                            meaning: 'Menyentuh perasaan/nostalgik • Mendukung idola/favorit • Luar biasa / gawat.',
                        },
                    ],
                },
            ],
        },
    ];

    // =========================================================================
    // KORPUS 1: FULL 2.136 JŌYŌ KANJI DARI KANJIAPI.DEV
    // =========================================================================
    logStep('ja', 'Mengambil daftar lengkap 2.136 Jōyō Kanji dari KanjiAPI...');
    const joyoList = await fetchJsonWithFallback<string[]>([
        'https://kanjiapi.dev/v1/kanji/joyo',
        'https://kanjiapi.dev/v1/kanji/kyoiku',
    ]);

    if (Array.isArray(joyoList) && joyoList.length > 0) {
        const kanjiCells: Array<{
            glyph: string;
            reading: string;
            transliteration: string;
            componentRole: string;
            strokeCount?: number;
            mnemonic: string;
        }> = [];

        const batchSize = 30;
        for (let i = 0; i < joyoList.length; i += batchSize) {
            logStep('ja', `Mengunduh detail Jōyō Kanji ${Math.min(i + batchSize, joyoList.length)}/${joyoList.length}...`);
            const slice = joyoList.slice(i, i + batchSize);
            const details = await Promise.all(
                slice.map((ch) =>
                    fetchJsonWithFallback<KanjiDetail>([
                        `https://kanjiapi.dev/v1/kanji/${encodeURIComponent(ch)}`,
                    ]),
                ),
            );
            for (const d of details) {
                if (!d) continue;
                kanjiCells.push({
                    glyph: d.kanji,
                    reading: [...d.on_readings.slice(0, 2), ...d.kun_readings.slice(0, 2)].join(' / ') || 'Kanji',
                    transliteration: d.meanings.slice(0, 3).join(', '),
                    componentRole: d.grade ? `Grade ${d.grade} Jōyō Kanji` : 'Secondary School Jōyō Kanji',
                    strokeCount: d.stroke_count,
                    mnemonic: `On: ${d.on_readings.join('、') || '-'} | Kun: ${d.kun_readings.join('、') || '-'}`,
                });
            }
        }

        if (kanjiCells.length > 0) {
            modules.push({
                id: 'ja-04-beg-script-joyo-kanji-full',
                lang: 'ja',
                pillar: 'script',
                tier: 'beginner',
                order: 4,
                title: `JLPT N5–N1 | Bank Jōyō Kanji Lengkap (${kanjiCells.length} Karakter Resmi)`,
                subtitle: 'Seluruh Jōyō Kanji lengkap dengan bacaan On’yomi, Kun’yomi, arti, dan jumlah guratan',
                estimatedMinutes: 120,
                blocks: [
                    {
                        type: 'script-matrix',
                        title: `Matriks ${kanjiCells.length} Jōyō Kanji`,
                        scriptSystem: 'Jōyō Kanji (常用漢字)',
                        direction: 'ltr',
                        description: 'Setiap karakter memuat bacaan On’yomi, Kun’yomi, arti, dan jumlah guratan.',
                        cells: kanjiCells,
                    },
                ],
            });
        }
    }

    // =========================================================================
    // KORPUS 2: FULL JLPT N5 - N1 VOCABULARY (~7.900 KATA)
    // =========================================================================
    const allJlptEntries: Array<{
        id: string;
        term: string;
        reading: string;
        meaning: string;
        partOfSpeech: string;
        patternNote?: string;
    }> = [];

    for (const lvl of [5, 4, 3, 2, 1]) {
        logStep('ja', `Mengunduh kosakata JLPT N${lvl} (Terkumpul: ${allJlptEntries.length})...`);
        const res = await fetchJsonWithFallback<JlptWord[] | { words: JlptWord[] }>([
            `https://jlpt-vocab-api.vercel.app/api/words?level=${lvl}&limit=3000`,
        ]);
        const list = Array.isArray(res) ? res : (res?.words ?? []);
        list.forEach((w, idx) => {
            if (w.word && w.meaning) {
                allJlptEntries.push({
                    id: `ja-n${lvl}-${idx + 1}`,
                    term: w.word,
                    reading: w.furigana || w.romaji,
                    meaning: w.meaning,
                    partOfSpeech: `JLPT N${lvl}`,
                    patternNote: w.romaji ? `Romaji: ${w.romaji}` : undefined,
                });
            }
        });
    }

    const jlptBeg = allJlptEntries.filter((e) => e.partOfSpeech === 'JLPT N5' || e.partOfSpeech === 'JLPT N4');
    const jlptInt = allJlptEntries.filter((e) => e.partOfSpeech === 'JLPT N3' || e.partOfSpeech === 'JLPT N2');
    const jlptAdv = allJlptEntries.filter((e) => e.partOfSpeech === 'JLPT N1');

    if (jlptBeg.length > 0) {
        modules.push({
            id: 'ja-07-beg-lexicon-jlpt-n5-n4',
            lang: 'ja',
            pillar: 'lexicon-dialogue',
            tier: 'beginner',
            order: 7,
            title: `JLPT N5–N4 | Kaiwa & Bank Kosakata Pemula (${jlptBeg.length} Kata)`,
            subtitle: 'Percakapan Teineigo + seluruh bank kosakata JLPT N5 & N4',
            estimatedMinutes: 50,
            blocks: [
                {
                    type: 'dialogue-theater',
                    title: 'Kaiwa: Menanyakan Arah Stasiun Tokyo',
                    contextSituation: 'Bertanya kepada petugas stasiun',
                    registerLevel: 'Teineigo (丁寧語)',
                    direction: 'ltr',
                    turns: [
                        {
                            speaker: 'ケンジ',
                            line: 'すみません、東京駅はどこですか。',
                            reading: 'Sumimasen, Tōkyō-eki wa doko desu ka.',
                            translation: 'Permisi, Stasiun Tokyo ada di sebelah mana?',
                            grammarHighlight: 'はどこですか',
                        },
                        {
                            speaker: '駅員',
                            line: 'この道をまっすぐ行って、左に曲がってください。',
                            reading: 'Kono michi o massugu itte, hidari ni magatte kudasai.',
                            translation: 'Jalan lurus di jalan ini, lalu belok ke kiri.',
                            grammarHighlight: '〜て、〜てください',
                        },
                    ],
                },
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap JLPT N5 – N4',
                    direction: 'ltr',
                    totalCount: jlptBeg.length,
                    entries: jlptBeg,
                },
            ],
        });
    }

    if (jlptInt.length > 0) {
        modules.push({
            id: 'ja-08-inter-lexicon-jlpt-n3-n2',
            lang: 'ja',
            pillar: 'lexicon-dialogue',
            tier: 'intermediate',
            order: 8,
            title: `JLPT N3–N2 | Bank Kosakata Menengah (${jlptInt.length} Kata)`,
            subtitle: 'Ribuan kosakata JLPT N3 & N2 untuk berita, novel, dan percakapan bisnis',
            estimatedMinutes: 75,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap JLPT N3 – N2',
                    direction: 'ltr',
                    totalCount: jlptInt.length,
                    entries: jlptInt,
                },
            ],
        });
    }

    if (jlptAdv.length > 0) {
        modules.push({
            id: 'ja-09-adv-lexicon-jlpt-n1',
            lang: 'ja',
            pillar: 'lexicon-dialogue',
            tier: 'advanced',
            order: 9,
            title: `JLPT N1 | Bank Kosakata Mahir & Sastra (${jlptAdv.length} Kata)`,
            subtitle: 'Kosakata tingkat tertinggi JLPT N1 untuk editorial koran dan wacana akademik',
            estimatedMinutes: 90,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap JLPT N1',
                    direction: 'ltr',
                    totalCount: jlptAdv.length,
                    entries: jlptAdv,
                },
            ],
        });
    }

    return Promise.all(modules.map((m) => writeValidatedModule(m, options)));
}
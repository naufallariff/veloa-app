// scripts/builders/corpus-zh.ts
import {
    fetchJsonWithFallback,
    fetchTextWithFallback,
    logStep,
    writeValidatedModule,
    type BuildOptions,
} from '../../lib/etl-utils.ts';
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';
import { ZH_GRAMMAR_MODULES } from '../grammar/grammar-zh.ts';

interface HskRaw {
    hanzi?: string;
    simplified?: string;
    pinyin: string;
    translations?: string[];
    meaning?: string;
}

export async function buildMandarinModules(options: BuildOptions) {
    const modules: LessonModule[] = [
        // =========================================================================
        // TIER 0: FOUNDATION — SEJARAH AKSARA TIONGKOK, BIHUA, BUSHOU & PIANPANG
        // =========================================================================
        {
            id: 'zh-00-found-origin-hanzi-anatomy',
            lang: 'zh',
            pillar: 'script',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sejarah Aksara Tiongkok: Jiǎgǔwén, Bǐhuà, Bùshǒu & Piānpáng',
            subtitle:
                'Mengapa Mandarin tidak memakai alfabet, bagaimana gambar tulang ramalan berevolusi jadi Hanzi, dan cara merakit karakter',
            estimatedMinutes: 40,
            blocks: [
                {
                    type: 'linguistic-lore',
                    title: 'Dari Tulang Ramalan Dinasti Shang (Jiǎgǔwén) Menuju Hanzi Modern',
                    eraOrDomain: 'Sejarah & Anatomi Ortografi Tionghoa (±1200 SM – Sekarang)',
                    direction: 'ltr',
                    narrativeSummary:
                        'Berbeda dari bahasa beralfabet yang merekam bunyi, aksara Tionghoa (Hànzì 汉字) adalah sistem logografis-morfosilabis yang mengodekan MAKNA dan BUNYI sekaligus dalam kotak persegi imajiner. Karena itu, penutur dialek Mandarin, Kanton, dan Hokkien yang berbeda cara bacanya tetap dapat membaca koran dan buku yang sama persis.',
                    milestones: [
                        {
                            stage: '1. Jiǎgǔwén (甲骨文 — Tulang Ramalan, ±1200 SM)',
                            scriptSample: '日 • 月 • 山 • 水 • 木',
                            reading: 'rì • yuè • shān • shuǐ • mù',
                            explanation:
                                'Piktograf murni yang digoreskan pada tempurung kura-kura dan tulang belikat sapi untuk ritual ramalan kerajaan Dinasti Shang. Bentuk matahari (日), bulan sabit (月), pegunungan (山), dan pohon (木) masih terlihat seperti gambar objek aslinya.',
                        },
                        {
                            stage: '2. Jīnwén (金文) & Xiǎozhuàn (小篆 — Aksara Segel Dinasti Qin, 221 SM)',
                            scriptSample: '秦始皇统一文字',
                            reading: 'Qín Shǐhuáng tǒngyī wénzì',
                            explanation:
                                'Kaisar pertama Qin Shi Huang menstandardisasi ribuan variasi aksara lokal menjadi satu sistem nasional (Xiǎozhuàn) dengan garis melengkung simetris yang elegan.',
                        },
                        {
                            stage: '3. Lìshū (隶书) & Kǎishū (楷书 — Aksara Standar Modern)',
                            scriptSample: '永字八法 (Yǒngzì Bāfǎ)',
                            reading: 'Delapan Prinsip Goresan pada Karakter 永 (Abadi)',
                            explanation:
                                'Transisi dari media bambu ke kertas melahirkan Kǎishū (aksara reguler) yang memadatkan lengkungan menjadi 8 tipe goresan dasar (Bǐhuà) agar cepat ditulis dengan kuas maupun pena.',
                        },
                    ],
                    structuralRules: [
                        {
                            conceptName: 'Bǐhuà (笔画 — Goresan Dasar Pembentuk Karakter)',
                            definition:
                                'Unit garis terkecil dalam penulisan Hanzi yang ditarik dalam satu tarikan pena tanpa mengangkat ujung pena.',
                            whyItMatters:
                                'Semua ribuan karakter Hanzi hanyalah kombinasi dari 8 goresan dasar: 点 (diǎn/titik), 横 (héng/datar), 竖 (shù/tegak), 撇 (piě/sapuan kiri), 捺 (nà/sapuan kanan), 提 (tí/angkat), 折 (zhé/tekuk), dan 钩 (gōu/kait).',
                            examples: [
                                '一 (1 goresan 横)',
                                '十 (横 lalu 竖)',
                                '人 (撇 lalu 捺)',
                                '永 (memuat seluruh 8 goresan dasar)',
                            ],
                        },
                        {
                            conceptName: 'Bǐshùn (笔顺 — 7 Hukum Urutan Goresan)',
                            definition:
                                'Aturan baku arah penulisan karakter: (1) Atas ke bawah, (2) Kiri ke kanan, (3) Horizontal dulu baru vertikal, (4) Sapuan kiri dulu baru kanan, (5) Luar dulu baru dalam, (6) Tengah dulu baru kiri-kanan, (7) Tutup kotak paling akhir.',
                            whyItMatters:
                                'Urutan goresan menjaga keseimbangan proporsi karakter di dalam kotak persegi dan memungkinkan aplikasi kamus/ponsel mengenali tulisan tanganmu secara akurat.',
                            examples: [
                                '三 (atas → tengah → bawah)',
                                '川 (kiri → tengah → kanan)',
                                '国 (bingkai luar → isi 玉 → garis penutup bawah)',
                            ],
                        },
                        {
                            conceptName: 'Bùshǒu (部首 — Radikal Indeks) vs Piānpáng (偏旁 — Komponen Sisi)',
                            definition:
                                'Piānpáng adalah setiap bagian penyusun karakter majemuk (sisi kiri/kanan/atas/bawah). Dari sekian banyak Piānpáng, satu komponen utama yang menjadi penunjuk kategori makna dan indeks kamus disebut Bùshǒu (214 Radikal Kangxi).',
                            whyItMatters:
                                'Lebih dari 80% Hanzi adalah karakter Fono-Semantik (形声字): satu Piānpáng memberi petunjuk MAKNA (Radikal), sedangkan Piānpáng lainnya memberi petunjuk BUNYI.',
                            examples: [
                                '妈 (mā = ibu): Radikal 女 (perempuan/makna) + Piānpáng 马 (mǎ/petunjuk bunyi)',
                                '河 (hé = sungai): Radikal 氵 (air/makna) + Piānpáng 可 (kě/petunjuk bunyi)',
                                '请 (qǐng = silakan): Radikal 讠 (bicara/makna) + Piānpáng 青 (qīng/petunjuk bunyi)',
                            ],
                        },
                    ],
                    funFactsAndTips: [
                        'Karakter 汉字 tidak memiliki spasi antar kata karena setiap karakter menempati luas kotak persegi yang sama persis (monospaced block).',
                        'Tips Menghafal Cepat: Jangan pernah menghafal Hanzi sebagai kumpulan garis acak; pecah menjadi 2–3 blok komponen Piānpáng (misal: 好 = 女 ibu + 子 anak = baik).',
                    ],
                },
                {
                    type: 'script-matrix',
                    title: 'Tabel Referensi 8 Goresan Dasar (Bǐhuà) & Radikal Fundamental',
                    scriptSystem: 'Hanzi Foundation Matrix',
                    direction: 'ltr',
                    description:
                        'Panduan visual goresan dasar beserta contoh karakter fondasi yang wajib dikuasai sebelum membaca kosakata.',
                    cells: [
                        {
                            glyph: '一',
                            reading: 'héng',
                            transliteration: 'Goresan Datar',
                            componentRole: 'Bǐhuà Dasar',
                            strokeOrderRule: 'Kiri ke kanan lurus',
                            strokeCount: 1,
                            mnemonic: 'Angka satu — fondasi garis horizontal',
                        },
                        {
                            glyph: '丨',
                            reading: 'shù',
                            transliteration: 'Goresan Tegak',
                            componentRole: 'Bǐhuà Dasar',
                            strokeOrderRule: 'Atas ke bawah lurus',
                            strokeCount: 1,
                            mnemonic: 'Tiang vertikal penyangga karakter',
                        },
                        {
                            glyph: '丿',
                            reading: 'piě',
                            transliteration: 'Sapuan Kiri',
                            componentRole: 'Bǐhuà Dasar',
                            strokeOrderRule: 'Atas kanan melengkung ke kiri bawah',
                            strokeCount: 1,
                            mnemonic: 'Selalu ditulis lebih dulu sebelum sapuan kanan 捺',
                        },
                        {
                            glyph: '丶',
                            reading: 'diǎn',
                            transliteration: 'Titik Tetes',
                            componentRole: 'Bǐhuà Dasar',
                            strokeOrderRule: 'Tekan singkat ke kanan bawah',
                            strokeCount: 1,
                            mnemonic: 'Tetesan kuas di puncak atau sisi karakter',
                        },
                        {
                            glyph: '亻',
                            reading: 'dānrénpáng',
                            transliteration: 'Piānpáng Orang',
                            componentRole: 'Bùshǒu (Radikal #9)',
                            strokeOrderRule: '1. Piě (丿) → 2. Shù (丨)',
                            strokeCount: 2,
                            mnemonic: 'Muncul di sisi kiri kata terkait manusia: 你, 他, 休, 作',
                        },
                        {
                            glyph: '氵',
                            reading: 'sāndiǎnshuǐ',
                            transliteration: 'Piānpáng 3 Tetes Air',
                            componentRole: 'Bùshǒu (Radikal #85)',
                            strokeOrderRule: '1. Titik atas → 2. Titik tengah → 3. Angkat (提)',
                            strokeCount: 3,
                            mnemonic: 'Muncul di kata cairan/sungai: 河, 海, 洗, 渴, 汁',
                        },
                        {
                            glyph: '讠',
                            reading: 'yánzìpáng',
                            transliteration: 'Piānpáng Ucapan',
                            componentRole: 'Bùshǒu (Radikal #149)',
                            strokeOrderRule: '1. Diǎn (丶) → 2. Héngzhétí (㇊)',
                            strokeCount: 2,
                            mnemonic: 'Muncul di kata bahasa/komunikasi: 说, 话, 语, 请, 谢',
                        },
                        {
                            glyph: '木',
                            reading: 'mùzìpáng',
                            transliteration: 'Radikal Pohon/Kayu',
                            componentRole: 'Bùshǒu (Radikal #75)',
                            strokeOrderRule: '1. 横 → 2. 竖 → 3. 撇 → 4. 捺',
                            strokeCount: 4,
                            mnemonic: 'Gambar akar dan dahan pohon: 林 (hutan), 桌 (meja), 椅 (kursi)',
                        },
                    ],
                },
            ],
        },
        {
            id: 'zh-01-found-phonetics-pinyin-tones',
            lang: 'zh',
            pillar: 'phonetics',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sistem Fonetik Pīnyīn, 4 Nada (Shēngdiào) & Hukum Tone Sandhi',
            subtitle:
                'Mengapa sistem ejaan Latin Pinyin dirancang dan bagaimana nada mengubah makna kata secara total',
            estimatedMinutes: 25,
            blocks: [
                {
                    type: 'cognitive-pattern-table',
                    title: 'Matriks 4 Nada Utama & Perubahan Nada Otomatis (Tone Sandhi)',
                    grammaticalTradition: 'Fonologi Mandarin Standar (汉语语音学)',
                    direction: 'ltr',
                    columns: [
                        { key: 'orig', roleLabel: 'Bentuk & Nada Kamus', semanticColor: 'violet' },
                        { key: 'spoken', roleLabel: 'Pelafalan Penutur Asli', semanticColor: 'cyan' },
                        { key: 'rule', roleLabel: 'Aturan Fonologis', semanticColor: 'amber' },
                    ],
                    rows: [
                        {
                            id: 'zh-f-ph1',
                            cells: {
                                orig: { script: 'mā • má • mǎ • mà', reading: 'Nada 1, 2, 3, 4', gloss: 'Ibu • Rami • Kuda • Memarahi' },
                                spoken: { script: '55 • 35 • 214 • 51', reading: 'Skala Pitch Chao', gloss: 'Kontur tinggi datar, naik, rendah lengkung, jatuh tajam' },
                                rule: { script: 'Fonem Suprasegmental', gloss: 'Nada melekat pada vokal inti suku kata' },
                            },
                            fullTranslation: 'Satu suku kata "ma" melahirkan 4 kata berbeda berkat kontur nada',
                        },
                        {
                            id: 'zh-f-ph2',
                            cells: {
                                orig: { script: '你好 (nǐ + hǎo)', reading: 'Nada 3 + Nada 3', gloss: 'Halo' },
                                spoken: { script: 'ní hǎo', reading: 'Nada 2 + Nada 3', gloss: 'Nada 3 pertama otomatis naik menjadi Nada 2' },
                                rule: { script: 'Tone Sandhi Nada 3', gloss: 'Mencegah pita suara turun rendah dua kali beruntun' },
                            },
                            fullTranslation: 'Halo (dilafalkan ní hǎo)',
                        },
                    ],
                    nativeMindset: {
                        headline: 'Mengapa Pīnyīn Diciptakan Tahun 1958 Padahal Tiongkok Sudah Punya Hanzi?',
                        psychologyExplanation:
                            'Hanzi tidak memberi tahu cara pelafalan secara eksplisit bagi pemula atau mesin ketik. Ahli bahasa Zhou Youguang merancang Hànyǔ Pīnyīn sebagai jembatan fonetik standar untuk memberantas buta huruf, menyeragamkan pelafalan nasional Pǔtōnghuà, dan memungkinkan input digital modern.',
                        literalTrap:
                            'Jangan membaca huruf Pinyin dengan ejaan Inggris/Indonesia: "q" dibaca seperti "c" tipis (qī = chi), "x" seperti "sy" (xiè = syie), dan "zh" seperti "j" lidah ditekuk ke atas.',
                    },
                },
            ],
        },

        // =========================================================================
        // SUNTIKKAN SELURUH MODUL TATA BAHASA TERPISAH (GRAMMAR-ZH.TS)
        // =========================================================================
        ...ZH_GRAMMAR_MODULES,

        // =========================================================================
        // TIER 4: NATIVE, DIALECTS & XIŪCÍXÚE
        // =========================================================================
        {
            id: 'zh-09-native-rhetoric-xiucixue-dialects',
            lang: 'zh',
            pillar: 'lexicon-dialogue',
            tier: 'native',
            order: 9,
            title: 'Native & Stylistics | Xiūcíxué (修辞学), Chéngyǔ, Aksara Tradisional & Slang',
            subtitle:
                'Seni memperindah bahasa Mandarin, idiom 4 karakter klasik, perbandingan Fántǐzì, dan bahasa gaul internet',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'rhetoric-stylistics',
                    title: 'Xiūcíxué (修辞学 — Ilmu Retorika & Keindahan Bahasa Mandarin)',
                    traditionName: 'Hànyǔ Xiūcíxué (汉语修辞学) & Sastra Klasik',
                    direction: 'ltr',
                    overview:
                        'Dalam tradisi sastra dan retorika Tiongkok, Xiūcíxué (修辞学) adalah ilmu mengolah diksi, paralelisme empat karakter (Chéngyǔ), dan citraan puitis agar kalimat terdengar ringkas, berwibawa, dan menggugah emosi.',
                    devices: [
                        {
                            deviceName: 'Metafora & Perumpamaan (Bǐyù — 比喻)',
                            nativeTerm: '明喻 (Míngyù) & 暗喻 (Ànyù)',
                            mechanism:
                                'Menyandingkan konsep abstrak dengan citraan alam konkret menggunakan penanda 像/如 (seperti) atau 是 (adalah).',
                            literaryExample: '时间就是生命，效率就是金钱。',
                            reading: 'Shíjiān jiùshì shēngmìng, xiàolǜ jiùshì jīnqián.',
                            translation: 'Waktu adalah nyawa, efisiensi adalah emas.',
                            aestheticEffect: 'Menciptakan ritme simetris 6+6 karakter yang tegas dan berwibawa.',
                        },
                        {
                            deviceName: 'Paralelisme Berantai (Páibǐ — 排比)',
                            nativeTerm: '排比句 (Páibǐjù)',
                            mechanism:
                                'Menyusun tiga atau lebih klausa dengan struktur tata bahasa identik untuk membangun klimaks emosional.',
                            literaryExample: '读书使人充实，讨论使人机智，笔记使人准确。',
                            reading: 'Dúshū shǐ rén chōngshí, tǎolùn shǐ rén jīzhì, bǐjì shǐ rén zhǔnquè.',
                            translation: 'Membaca membuat manusia berisi, berdiskusi membuat cerdas, mencatat membuat presisi.',
                            aestheticEffect: 'Menghasilkan gelombang retorika akademik dan pidato yang sangat persuasif.',
                        },
                        {
                            deviceName: 'Idiom 4 Karakter Historis (Chéngyǔ — 成语)',
                            nativeTerm: '画蛇添足 (Huà shé tiān zú)',
                            mechanism: 'Memadatkan kisah filsafat/sejarah kuno menjadi 4 karakter padat makna.',
                            literaryExample: '这件事已经很完美了，不要画蛇添足。',
                            reading: 'Zhè jiàn shì yǐjīng hěn wánměi le, búyào huà shé tiān zú.',
                            translation:
                                'Hal ini sudah sangat sempurna, jangan "menggambar ular lalu menambahinya kaki" (melakukan hal berlebihan yang justru merusak).',
                            aestheticEffect: 'Menunjukkan kedalaman literasi budaya penutur terdidik.',
                        },
                    ],
                    dialectAndSlangNotes: [
                        {
                            varietyName: 'Aksara Tradisional (Fántǐzì — 繁体字)',
                            regionOrContext: 'Taiwan, Hong Kong, Makau & Teks Klasik',
                            sampleExpression: '學習語言、愛與書 (vs 简体: 学习语言、爱与书)',
                            standardEquivalent: 'xuéxí yǔyán, ài yǔ shū',
                            meaning: 'Mempertahankan komponen historis utuh (seperti 心 "hati" di dalam 愛 "cinta").',
                        },
                        {
                            varietyName: 'Bahasa Kanton (Yuèyǔ — 粤语)',
                            regionOrContext: 'Guangdong, Hong Kong & Diaspora Global',
                            sampleExpression: '唔该 (m̀h’gōi) / 多谢 (dōjeh)',
                            standardEquivalent: '谢谢 (xièxie)',
                            meaning: 'Mempertahankan 6–9 nada dan akhiran konsonan kuno (-p, -t, -k) dari era Dinasti Tang.',
                        },
                        {
                            varietyName: 'Wǎngluò Yòngyǔ (网络用语 — Slang Internet Tiongkok)',
                            regionOrContext: 'Percakapan Kasual & Media Sosial (WeChat/Xiaohongshu)',
                            sampleExpression: '内卷 (nèijuǎn) • 躺平 (tǎngpíng) • 666 (liùliùliù)',
                            standardEquivalent: 'Kompetisi ekstrem • Rebahan santai • Keren banget (溜溜溜)',
                            meaning: 'Permainan homofon angka dan metafora sosiologis anak muda Tiongkok modern.',
                        },
                    ],
                },
            ],
        },
    ];

    // =========================================================================
    // KORPUS 1: FULL DATASET HSK 1 - HSK 6 (5.000 KATA)
    // =========================================================================
    const allHskEntries: Array<{
        id: string;
        term: string;
        reading: string;
        meaning: string;
        partOfSpeech: string;
    }> = [];

    for (const lvl of [1, 2, 3, 4, 5, 6]) {
        logStep('zh', `Mengunduh HSK Level ${lvl} (Terkumpul: ${allHskEntries.length} kata)...`);
        const raw = await fetchJsonWithFallback<HskRaw[]>([
            `https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json/hsk-level-${lvl}.json`,
        ]);
        if (Array.isArray(raw)) {
            raw.forEach((item, idx) => {
                const hanzi = item.hanzi ?? item.simplified ?? '';
                const meaning = Array.isArray(item.translations)
                    ? item.translations.join('; ')
                    : (item.meaning ?? '');
                if (hanzi && meaning) {
                    allHskEntries.push({
                        id: `zh-hsk${lvl}-${idx + 1}`,
                        term: hanzi,
                        reading: item.pinyin,
                        meaning,
                        partOfSpeech: `HSK ${lvl}`,
                    });
                }
            });
        }
    }

    // =========================================================================
    // KORPUS 2: EKSPANSI KAMUS CC-CEDICT (+10.000 ENTRI HANZI SEDERHANA/TRADISIONAL)
    // =========================================================================
    logStep('zh', 'Mengunduh korpus terbuka CC-CEDICT (10.000+ entri tambahan)...');
    const cedictRaw = await fetchTextWithFallback([
        'https://raw.githubusercontent.com/nieldk/cedict/master/cedict_ts.u8',
        'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt',
    ]);

    const hskSet = new Set(allHskEntries.map((e) => e.term));
    const cedictExtra: Array<{
        id: string;
        term: string;
        reading: string;
        meaning: string;
        partOfSpeech: string;
        patternNote?: string;
    }> = [];

    if (cedictRaw) {
        const lineRegex = /^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\//;
        for (const line of cedictRaw.split('\n')) {
            if (cedictExtra.length >= 10000) break;
            if (!line || line.startsWith('#')) continue;
            const match = lineRegex.exec(line.trim());
            if (!match) continue;
            const trad = match[1] ?? '';
            const simp = match[2] ?? '';
            const pinyin = match[3] ?? '';
            const defs = (match[4] ?? '').split('/').slice(0, 3).join('; ');
            if (!simp || hskSet.has(simp) || defs.startsWith('variant of')) continue;
            hskSet.add(simp);
            cedictExtra.push({
                id: `zh-cedict-${cedictExtra.length + 1}`,
                term: simp,
                reading: pinyin,
                meaning: defs,
                partOfSpeech: 'CC-CEDICT Extended',
                patternNote: trad !== simp ? `Tradisional: ${trad}` : undefined,
            });
        }
    }

    const hskBeg = allHskEntries.filter((e) => e.partOfSpeech === 'HSK 1' || e.partOfSpeech === 'HSK 2');
    const hskInt = allHskEntries.filter((e) => e.partOfSpeech === 'HSK 3' || e.partOfSpeech === 'HSK 4');
    const hskAdv = [
        ...allHskEntries.filter((e) => e.partOfSpeech === 'HSK 5' || e.partOfSpeech === 'HSK 6'),
        ...cedictExtra,
    ];

    if (hskBeg.length > 0) {
        modules.push({
            id: 'zh-06-beg-lexicon-hsk1-2',
            lang: 'zh',
            pillar: 'lexicon-dialogue',
            tier: 'beginner',
            order: 6,
            title: `HSK 1–2 | Duìhuà & Bank Kosakata Pemula (${hskBeg.length} Kata)`,
            subtitle: 'Percakapan restoran & bank kosakata lengkap HSK 1–2',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'dialogue-theater',
                    title: 'Duìhuà: Memesan Makanan di Restoran Beijing',
                    contextSituation: 'Interaksi sehari-hari pelanggan dan pelayan',
                    registerLevel: 'Pǔtōnghuà Sopan',
                    direction: 'ltr',
                    turns: [
                        {
                            speaker: '服务员',
                            line: '你好！请问你们几位？',
                            reading: 'Nǐ hǎo! Qǐngwèn nǐmen jǐ wèi?',
                            translation: 'Halo! Permisi, kalian berberapa orang?',
                            grammarHighlight: '几位 (Penggolong sopan)',
                        },
                        {
                            speaker: '林娜',
                            line: '我们两位。我要一杯热茶。',
                            reading: 'Wǒmen liǎng wèi. Wǒ yào yì bēi rè chá.',
                            translation: 'Kami berdua. Saya mau secangkir teh panas.',
                            grammarHighlight: '一杯 (Tone sandhi yī → yì)',
                        },
                    ],
                },
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap HSK 1 – HSK 2',
                    direction: 'ltr',
                    totalCount: hskBeg.length,
                    entries: hskBeg,
                },
            ],
        });
    }

    if (hskInt.length > 0) {
        modules.push({
            id: 'zh-07-inter-lexicon-hsk3-4',
            lang: 'zh',
            pillar: 'lexicon-dialogue',
            tier: 'intermediate',
            order: 7,
            title: `HSK 3–4 | Bank Kosakata Menengah (${hskInt.length} Kata)`,
            subtitle: 'Seluruh kosakata HSK 3 & HSK 4 lengkap dengan Hanzi, Pinyin, dan definisi',
            estimatedMinutes: 60,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap HSK 3 – HSK 4',
                    direction: 'ltr',
                    totalCount: hskInt.length,
                    entries: hskInt,
                },
            ],
        });
    }

    if (hskAdv.length > 0) {
        modules.push({
            id: 'zh-08-adv-lexicon-hsk5-6-cedict',
            lang: 'zh',
            pillar: 'lexicon-dialogue',
            tier: 'advanced',
            order: 8,
            title: `HSK 5–9 & CC-CEDICT | Bank Kosakata Mahir & Klasik (${hskAdv.length} Kata)`,
            subtitle: 'Gabungan lengkap HSK 5–6 dan 10.000+ entri kamus CC-CEDICT (Sederhana & Tradisional)',
            estimatedMinutes: 90,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Lengkap HSK 5–6 + CC-CEDICT',
                    direction: 'ltr',
                    totalCount: hskAdv.length,
                    entries: hskAdv,
                },
            ],
        });
    }

    return Promise.all(modules.map((m) => writeValidatedModule(m, options)));
}
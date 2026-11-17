// scripts/builders/corpus-ko.ts
import {
    fetchTextWithFallback,
    logStep,
    writeValidatedModule,
    type BuildOptions,
} from '../../lib/etl-utils.ts';
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';
import { KO_GRAMMAR_MODULES } from '../grammar/grammar-ko.ts';

export async function buildKoreanModules(options: BuildOptions) {
    const modules: LessonModule[] = [
        // =========================================================================
        // TIER 0: FOUNDATION — SEJARAH PENCIPTAAN HANGEUL & REKAYASA BLOK SUKU KATA
        // =========================================================================
        {
            id: 'ko-00-found-origin-hangeul-engineering',
            lang: 'ko',
            pillar: 'script',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sejarah Penciptaan Hangeul (1443) & Rekayasa Blok Suku Kata',
            subtitle:
                'Bagaimana Raja Sejong merancang alfabet paling ilmiah di dunia berdasarkan bentuk organ bicara dan filosofi Cheon-Ji-In',
            estimatedMinutes: 35,
            blocks: [
                {
                    type: 'linguistic-lore',
                    title: 'Hunminjeongeum (훈민정음 — 1446): Satu-Satunya Aksara dengan Cetak Biru Ilmiah Terdokumentasi',
                    eraOrDomain: 'Sejarah Ortografi Korea (Dinasti Joseon, Abad ke-15)',
                    direction: 'ltr',
                    narrativeSummary:
                        'Sebelum abad ke-15, rakyat Korea menulis menggunakan karakter Hanja Tiongkok yang membutuhkan bertahun-tahun untuk dikuasai dan tidak cocok dengan tata bahasa Korea. Pada tahun 1443, Raja Sejong Agung bersama para cendekiawan Jiphyeonjeon merancang Hangeul (한글) secara sistematis agar setiap warga dapat melek huruf dalam hitungan hari.',
                    milestones: [
                        {
                            stage: '1. Desain Konsonan Dasar dari Anatomi Organ Bicara (1443)',
                            scriptSample: 'ㄱ (g/k) • ㄴ (n) • ㅁ (m) • ㅅ (s) • ㅇ (ng/kosong)',
                            reading: 'Lima Konsonan Dasar (기본 자음) Meniru Bentuk Lidah, Bibir, Gigi & Tenggorokan',
                            explanation:
                                'ㄱ menggambarkan pangkal lidah menyentuh langit-langit lunak; ㄴ menggambarkan ujung lidah menyentuh gusi atas; ㅁ menggambarkan bentuk mulut tertutup; ㅅ menggambarkan bentuk gigi tajam; dan ㅇ menggambarkan lubang tenggorokan.',
                        },
                        {
                            stage: '2. Penambahan Goresan untuk Konsonan Aspirasi & Ganda (가획자)',
                            scriptSample: 'ㄱ → ㅋ (kʰ) → ㄲ (k͈) | ㄴ → ㄷ (t) → ㅌ (tʰ) → ㄸ (t͈)',
                            reading: 'Sistem Fitur Fonetik (Featural Alphabet)',
                            explanation:
                                'Dengan menambahkan satu garis hembusan udara (aspirasi), konsonan lembut ㄱ berubah menjadi ㅋ, ㄷ menjadi ㅌ, ㅂ menjadi ㅍ, dan ㅈ menjadi ㅊ—sehingga hubungan bunyi dan bentuk hurufnya 100% logis.',
                        },
                        {
                            stage: '3. Desain Vokal dari Tiga Elemen Kosmologi: Cheon-Ji-In (천지인)',
                            scriptSample: 'ㆍ (Langit/Matahari) + ㅡ (Bumi Datar) + ㅣ (Manusia Berdiri)',
                            reading: 'Kombinasi Tiga Unsur Alam Melahirkan Seluruh Vokal Korea',
                            explanation:
                                'Matahari (ㆍ) di kanan manusia (ㅣ) membentuk ㅏ (a); di kiri membentuk ㅓ (eo); di atas bumi (ㅡ) membentuk ㅗ (o); dan di bawah bumi membentuk ㅜ (u).',
                        },
                    ],
                    structuralRules: [
                        {
                            conceptName: 'Arsitektur Blok Suku Kata (Syllable Block Assembly)',
                            definition:
                                'Huruf Hangeul (Jamo) tidak ditulis berderet mendatar seperti alfabet Latin, melainkan dirakit ke dalam kotak suku kata dengan rumus wajib: Konsonan Awal (Choseong) + Vokal Tengah (Jungseong) + [Opsional Konsonan Akhir / Batchim (Jongseong)].',
                            whyItMatters:
                                'Jika sebuah suku kata dimulai dengan bunyi vokal (seperti "a" pada 안녕), konsonan kosong ㅇ wajib ditempatkan di posisi awal sebagai penyangga visual.',
                            examples: [
                                '한 = ㅎ (awal) + ㅏ (tengah kanan) + ㄴ (Batchim bawah)',
                                '글 = ㄱ (awal) + ㅡ (tengah bawah) + ㄹ (Batchim bawah)',
                                '안녕 = ㅇ+ㅏ+ㄴ (an) + ㄴ+ㅕ+ㅇ (nyeong)',
                            ],
                        },
                        {
                            conceptName: 'Aturan Urutan Guratan Hangeul',
                            definition:
                                'Selalu tulis dari kiri ke kanan dan atas ke bawah: (1) Konsonan awal, (2) Vokal vertikal di kanan atau vokal horizontal di bawah, (3) Batchim di lantai paling bawah.',
                            whyItMatters:
                                'Menjaga proporsi kotak yang seragam dan memudahkan penulisan cepat.',
                            examples: [
                                '문 = ㅁ (atas) → ㅜ (tengah) → ㄴ (bawah)',
                                '국 = ㄱ (atas) → ㅜ (tengah) → ㄱ (bawah)',
                            ],
                        },
                    ],
                    funFactsAndTips: [
                        'Setiap tahun pada tanggal 9 Oktober, Korea Selatan merayakan Hari Hangeul (한글날) sebagai hari libur nasional untuk menghormati penciptaan aksara ini.',
                        'Hangeul sangat efisien untuk pengetikan digital dan ponsel karena seluruh 24 huruf dasarnya hanya membutuhkan 14 tombol konsonan di kiri dan 10 tombol vokal di kanan.',
                    ],
                },
                {
                    type: 'script-matrix',
                    title: 'Tabel Matriks Jamo Dasar Hangeul (Konsonan Anatomis & Vokal Cheon-Ji-In)',
                    scriptSystem: 'Hangeul Jamo Matrix (한글 자모)',
                    direction: 'ltr',
                    description: 'Fondasi konsonan dasar dan vokal utama pembentuk seluruh suku kata bahasa Korea.',
                    cells: [
                        { glyph: 'ㄱ / ㅋ / ㄲ', reading: 'g/k • kʰ • k͈', transliteration: 'Velar (Pangkal Lidah)', componentRole: 'Konsonan Dasar #1', mnemonic: 'Bentuk lidah menyentuh langit-langit belakang' },
                        { glyph: 'ㄴ / ㄷ / ㅌ', reading: 'n • d/t • tʰ', transliteration: 'Alveolar (Ujung Lidah)', componentRole: 'Konsonan Dasar #2', mnemonic: 'Ujung lidah menempel di belakang gigi atas' },
                        { glyph: 'ㅁ / ㅂ / ㅍ', reading: 'm • b/p • pʰ', transliteration: 'Bilabial (Dua Bibir)', componentRole: 'Konsonan Dasar #3', mnemonic: 'Kotak ㅁ meniru bentuk mulut tertutup' },
                        { glyph: 'ㅅ / ㅈ / ㅊ', reading: 's • j • chʰ', transliteration: 'Dental/Palatal (Gigi)', componentRole: 'Konsonan Dasar #4', mnemonic: 'ㅅ meniru bentuk gigi seri' },
                        { glyph: 'ㅇ / ㅎ', reading: '∅/ng • h', transliteration: 'Glotal (Tenggorokan)', componentRole: 'Konsonan Dasar #5', mnemonic: 'ㅇ diam di awal suku kata, dibaca [ng] saat di posisi Batchim' },
                        { glyph: 'ㅏ / ㅓ', reading: 'a • eo', transliteration: 'Vokal Vertikal', componentRole: 'Jungseong Kanan', mnemonic: 'Garis menghadap keluar (ㅏ = a) vs menghadap ke dalam (ㅓ = eo)' },
                        { glyph: 'ㅗ / ㅜ', reading: 'o • u', transliteration: 'Vokal Horizontal', componentRole: 'Jungseong Bawah', mnemonic: 'Di atas garis bumi (ㅗ = o) vs di bawah garis bumi (ㅜ = u)' },
                        { glyph: 'ㅡ / ㅣ', reading: 'eu • i', transliteration: 'Bumi & Manusia', componentRole: 'Jungseong Dasar', mnemonic: 'ㅡ (bibir datar tersenyum tanpa membuka rahang) • ㅣ (seperti huruf i)' },
                    ],
                },
            ],
        },
        {
            id: 'ko-01-found-phonetics-batchim-rules',
            lang: 'ko',
            pillar: 'phonetics',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Hukum Fonologi & Asimilasi Batchim (연음, 비음화, 격음화, 유음화)',
            subtitle:
                'Mengapa tulisan Hangeul sering berbunyi berbeda saat dua suku kata bertemu dan cara membacanya seperti penutur asli',
            estimatedMinutes: 30,
            blocks: [
                {
                    type: 'cognitive-pattern-table',
                    title: 'Empat Hukum Perubahan Bunyi Paling Kritis dalam Bahasa Korea',
                    grammaticalTradition: '한국어 음운 변동 (Fonologi Interaksi Suku Kata)',
                    direction: 'ltr',
                    columns: [
                        { key: 'written', roleLabel: 'Ejaan Tertulis', semanticColor: 'violet' },
                        { key: 'spoken', roleLabel: 'Pelafalan Penutur Asli', semanticColor: 'cyan' },
                        { key: 'rule', roleLabel: 'Nama Hukum Fonologi', semanticColor: 'amber' },
                    ],
                    rows: [
                        {
                            id: 'ko-f-ph1',
                            cells: {
                                written: { script: '한국어 • 먹어요 • 직업', reading: 'han-guk-eo • meok-eo-yo • jik-eop', gloss: 'Batchim bertemu vokal (ㅇ)' },
                                spoken: { script: '[한구거] • [머거요] • [지겁]', reading: 'han-gu-geo • meo-geo-yo • ji-geop', gloss: 'Batchim melompat mengisi posisi ㅇ kosong' },
                                rule: { script: 'Yeon-eum (연음 — Liaison)', gloss: 'Paling sering muncul di seluruh bahasa Korea' },
                            },
                            fullTranslation: 'Bahasa Korea • Makan • Pekerjaan',
                        },
                        {
                            id: 'ko-f-ph2',
                            cells: {
                                written: { script: '감사합니다 • 작년에 • 못 먹어요', reading: 'gam-sa-hap-ni-da • jak-nyeon-e • mot meok-eo-yo', gloss: 'ㅂ/ㄱ/ㄷ bertemu konsonan sengau ㄴ/ㅁ' },
                                spoken: { script: '[감사함니다] • [장녀네] • [몬 머거요]', reading: 'gam-sa-ham-ni-da • jang-nyeo-ne • mon meo-geo-yo', gloss: 'ㅂ→ㅁ, ㄱ→ㅇ, ㄷ→ㄴ sebelum ㄴ/ㅁ' },
                                rule: { script: 'Bi-eumhwa (비음화 — Nasalisasi)', gloss: 'Menghaluskan transisi letupan ke sengau' },
                            },
                            fullTranslation: 'Terima kasih • Tahun lalu • Tidak bisa makan',
                        },
                        {
                            id: 'ko-f-ph3',
                            cells: {
                                written: { script: '축하해요 • 좋다 • 어떻게', reading: 'chuk-ha-hae-yo • joh-da • eo-tteoh-ge', gloss: 'ㄱ/ㄷ/ㅂ/ㅈ bertemu ㅎ' },
                                spoken: { script: '[추카해요] • [조타] • [어떠케]', reading: 'chu-ka-hae-yo • jo-ta • eo-tteo-ke', gloss: 'Melebur menjadi konsonan aspirasi ㅋ/ㅌ/ㅍ/ㅊ' },
                                rule: { script: 'Gyeok-eumhwa (격음화 — Aspirasi)', gloss: 'Hembusan udara ㅎ menyatu dengan konsonan letup' },
                            },
                            fullTranslation: 'Selamat • Bagus • Bagaimana',
                        },
                        {
                            id: 'ko-f-ph4',
                            cells: {
                                written: { script: '신라 • 연락 • 설날', reading: 'sin-ra • yeon-rak • seol-nal', gloss: 'Pertemuan ㄴ + ㄹ atau ㄹ + ㄴ' },
                                spoken: { script: '[실라] • [열락] • [설랄]', reading: 'sil-la • yeol-lak • seol-lal', gloss: 'Bunyi ㄴ otomatis berubah menjadi ㄹ ganda [ll]' },
                                rule: { script: 'Yu-eumhwa (유음화 — Likuidasi)', gloss: 'Melancarkan gerakan ujung lidah' },
                            },
                            fullTranslation: 'Kerajaan Silla • Kontak • Tahun Baru Imlek Korea',
                        },
                    ],
                    nativeMindset: {
                        headline: 'Mengapa Ejaan Korea Tidak Diubah Mengikuti Bunyi Bicara?',
                        psychologyExplanation:
                            'Hangeul menganut prinsip Morfofonemik: akar kata dipertahankan bentuk aslinya (먹다 → 먹어요, 먹습니다, 먹는다) agar mata pembaca langsung mengenali makna dasarnya ("makan"), sementara mulut penutur asli secara otomatis menerapkan hukum asimilasi bunyi saat melafalkannya.',
                        literalTrap:
                            'Jangan pernah membaca "합니다" sebagai [hap-ni-da]—selalu baca sebagai [함니다 / ham-ni-da].',
                    },
                },
            ],
        },

        // =========================================================================
        // SUNTIKKAN SELURUH MODUL TATA BAHASA TERPISAH (GRAMMAR-KO.TS)
        // =========================================================================
        ...KO_GRAMMAR_MODULES,

        // =========================================================================
        // TIER 4: NATIVE, DIALECTS & SUSABEOP
        // =========================================================================
        {
            id: 'ko-09-native-rhetoric-susabeop-dialects',
            lang: 'ko',
            pillar: 'lexicon-dialogue',
            tier: 'native',
            order: 9,
            title: 'Native & Stylistics | Susabeop (수사법), Sajaseongeo, Dialek Satoori & Slang Seoul',
            subtitle:
                'Seni gaya bahasa retorika Korea, idiom 4 karakter Sino-Korea, logat Busan & Jeju, serta bahasa gaul anak muda (Sinjoeo)',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'rhetoric-stylistics',
                    title: 'Susabeop (수사법 — Ilmu Retorika & Keindahan Gaya Bahasa Korea)',
                    traditionName: '한국어 수사학 & 사자성어 (Sajaseongeo)',
                    direction: 'ltr',
                    overview:
                        'Retorika Korea memadukan kehalusan perumpamaan (Biyubeop), paralelisme ritmis (Daegubeop), dan peribahasa empat suku kata Sino-Korea (Sajaseongeo) untuk menyampaikan kebijaksanaan maupun argumen persuasif.',
                    devices: [
                        {
                            deviceName: 'Perumpamaan & Metafora (Biyubeop — 비유법)',
                            nativeTerm: '직유법 (Simile) & 은유법 (Metaphor)',
                            mechanism:
                                'Membandingkan fenomena abstrak dengan citraan alam memakai penanda -처럼 / -같이 (seperti) atau persamaan langsung.',
                            literaryExample: '세월은 흐르는 강물과 같아서 한 번 지나가면 다시 돌아오지 않는다.',
                            reading: 'Seworeun heureuneun gangmulgwa gataseo han beon jinagamyeon dasi doraoji anneunda.',
                            translation: 'Waktu bagaikan air sungai yang mengalir; sekali berlalu takkan pernah kembali lagi.',
                            aestheticEffect: 'Menciptakan resonansi puitis yang lembut dan reflektif.',
                        },
                        {
                            deviceName: 'Idiom 4 Suku Kata Klasik (Sajaseongeo — 사자성어)',
                            nativeTerm: '일석이조 (一石二鳥 — Ilseok-ijo)',
                            mechanism: 'Empat karakter berakar Hanja yang merangkum strategi atau pelajaran hidup dalam satu frasa padat.',
                            literaryExample: '책을 원서로 읽으면 지식도 얻고 외국어 실력도 늘어서 일석이조예요.',
                            reading: 'Chaegeul wonseoro ilgeumyeon jisikdo eotgo oegugeo sillyeokdo neureoseo ilseokijoyeyo.',
                            translation:
                                'Jika membaca buku dalam bahasa aslinya, ilmu didapat dan kemampuan bahasa asing juga meningkat—"satu batu dua burung" (sekali mendayung dua tiga pulau terlampaui).',
                            aestheticEffect: 'Sangat dihargai dalam esai TOPIK II (soal 54) dan diskusi profesional.',
                        },
                    ],
                    dialectAndSlangNotes: [
                        {
                            varietyName: 'Gyeongsang Satoori (Dialek Busan & Daegu)',
                            regionOrContext: 'Korea Bagian Tenggara (Busan, Ulsan, Daegu)',
                            sampleExpression: '밥 뭇나? (Bap munna?) • 억수로 좋다 • 살아있네!',
                            standardEquivalent: '밥 먹었어? • 아주 좋다 • 살아있네!',
                            meaning: 'Mempertahankan aksen nada (Pitch Accent) kuno dan intonasi tegas yang akrab.',
                        },
                        {
                            varietyName: 'Jeju-eo (Dialek Pulau Jeju)',
                            regionOrContext: 'Pulau Jeju (Diakui UNESCO sebagai bahasa daerah terancam punah)',
                            sampleExpression: '혼저 옵서예 (Honjeo opseoye) • 하르방 • 고맙수다',
                            standardEquivalent: '어서 오세요 • 할아버지 • 고맙습니다',
                            meaning: 'Mempertahankan vokal kuno Araea (ㆍ) dari abad ke-15.',
                        },
                        {
                            varietyName: 'Sinjoeo (신조어 — Slang & Penyingkatan Anak Muda Seoul)',
                            regionOrContext: 'Percakapan Kasual & Media Sosial Korea Selatan',
                            sampleExpression: '대박 (Daebak) • 꿀팁 (Kkultip) • 워라밸 (Worabael)',
                            standardEquivalent: '정말 대단하다 • 아주 좋은 팁 • Work-Life Balance',
                            meaning: 'Luar biasa! • Tips super manis/bermanfaat • Keseimbangan kerja dan hidup.',
                        },
                    ],
                },
            ],
        },
    ];

    // =========================================================================
    // KORPUS TERBUKA KENGDIC.TSV: 15.000 ENTRI KOREA (TOPIK I – TOPIK II MAHIR)
    // =========================================================================
    logStep('ko', 'Mengunduh korpus terbuka kengdic.tsv (15.000 entri Korea)...');
    const kengdicTsv = await fetchTextWithFallback([
        'https://raw.githubusercontent.com/garfieldnate/kengdic/master/kengdic.tsv',
    ]);

    const validWords: Array<{ korean: string; english: string; hanja?: string }> = [];

    if (kengdicTsv) {
        const lines = kengdicTsv.split('\n').slice(1);
        for (const line of lines) {
            if (validWords.length >= 15000) break;
            const cols = line.split('\t');
            const hangul = cols[1]?.trim();
            const hanja = cols[2]?.trim();
            const gloss = cols[3]?.trim();
            if (hangul && gloss && /^[가-힣\s]+$/.test(hangul)) {
                validWords.push({
                    korean: hangul,
                    english: gloss,
                    hanja: hanja && hanja !== 'NULL' ? hanja : undefined,
                });
            }
        }
    }

    const topik1Entries = validWords.slice(0, 3000).map((w, idx) => ({
        id: `ko-t1-${idx + 1}`,
        term: w.korean,
        reading: 'Hangeul Dasar (TOPIK I)',
        meaning: w.english,
        partOfSpeech: 'TOPIK I (1–2)',
        patternNote: w.hanja ? `Hanja: ${w.hanja}` : undefined,
    }));

    const topik2Entries = validWords.slice(3000, 9000).map((w, idx) => ({
        id: `ko-t2-${idx + 1}`,
        term: w.korean,
        reading: 'Hangeul Menengah (TOPIK II)',
        meaning: w.english,
        partOfSpeech: 'TOPIK II (3–4)',
        patternNote: w.hanja ? `Hanja: ${w.hanja}` : undefined,
    }));

    const topikAdvEntries = validWords.slice(9000, 15000).map((w, idx) => ({
        id: `ko-t3-${idx + 1}`,
        term: w.korean,
        reading: 'Hangeul Mahir (TOPIK II)',
        meaning: w.english,
        partOfSpeech: 'TOPIK II (5–6)',
        patternNote: w.hanja ? `Hanja: ${w.hanja}` : undefined,
    }));

    if (topik1Entries.length > 0) {
        modules.push({
            id: 'ko-06-beg-lexicon-topik1',
            lang: 'ko',
            pillar: 'lexicon-dialogue',
            tier: 'beginner',
            order: 6,
            title: `TOPIK I (1–2) | Daehwa & Bank Kosakata Pemula (${topik1Entries.length} Kata)`,
            subtitle: 'Percakapan kafe Seoul (Haeyoche) + 3.000 entri kosakata Korea dasar',
            estimatedMinutes: 50,
            blocks: [
                {
                    type: 'dialogue-theater',
                    title: 'Daehwa: Memesan Kopi di Kafe Seoul',
                    contextSituation: 'Interaksi pelanggan dan barista',
                    registerLevel: 'Haeyoche (해요체)',
                    direction: 'ltr',
                    turns: [
                        {
                            speaker: '직원',
                            line: '어서 오세요! 무엇을 드릴까요?',
                            reading: 'Eoseo oseyo! Mueoseul deurilkkayo?',
                            translation: 'Selamat datang! Mau pesan apa?',
                            grammarHighlight: '-(으)ㄹ까요? (Tawaran sopan)',
                        },
                        {
                            speaker: '나우팔',
                            line: '아이스 아메리카노 한 잔 주세요.',
                            reading: 'Aiseu amerikano han jan juseyo.',
                            translation: 'Tolong satu gelas es Americano.',
                            grammarHighlight: '한 잔 (Kata bantu bilangan gelas)',
                        },
                    ],
                },
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Korea Dasar (TOPIK I)',
                    direction: 'ltr',
                    totalCount: topik1Entries.length,
                    entries: topik1Entries,
                },
            ],
        });
    }

    if (topik2Entries.length > 0) {
        modules.push({
            id: 'ko-07-inter-lexicon-topik2-mid',
            lang: 'ko',
            pillar: 'lexicon-dialogue',
            tier: 'intermediate',
            order: 7,
            title: `TOPIK II (3–4) | Bank Kosakata Menengah (${topik2Entries.length} Kata)`,
            subtitle: '6.000 entri kosakata menengah Korea beserta akar Hanja',
            estimatedMinutes: 75,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Korea Menengah (TOPIK II 3–4)',
                    direction: 'ltr',
                    totalCount: topik2Entries.length,
                    entries: topik2Entries,
                },
            ],
        });
    }

    if (topikAdvEntries.length > 0) {
        modules.push({
            id: 'ko-08-adv-lexicon-topik2-high',
            lang: 'ko',
            pillar: 'lexicon-dialogue',
            tier: 'advanced',
            order: 8,
            title: `TOPIK II (5–6) | Bank Kosakata Mahir & Akademik (${topikAdvEntries.length} Kata)`,
            subtitle: '6.000 entri kosakata tingkat lanjut untuk berita, jurnal ilmiah, dan esai',
            estimatedMinutes: 90,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Korea Mahir (TOPIK II 5–6)',
                    direction: 'ltr',
                    totalCount: topikAdvEntries.length,
                    entries: topikAdvEntries,
                },
            ],
        });
    }

    return Promise.all(modules.map((m) => writeValidatedModule(m, options)));
}
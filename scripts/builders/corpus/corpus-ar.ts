// scripts/builders/corpus-ar.ts
import {
    fetchTextWithFallback,
    logStep,
    writeValidatedModule,
    type BuildOptions,
} from '../../lib/etl-utils.ts';
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';
import { AR_GRAMMAR_MODULES } from '../grammar/grammar-ar.ts';

interface RawArabicEntry {
    ar: string;
    en: string;
    pos: string;
}

export async function buildArabicModules(options: BuildOptions) {
    const modules: LessonModule[] = [
        // =========================================================================
        // TIER 0: FOUNDATION — SEJARAH AKSARA ARAB, 4 POSISI HURUF & ḤARAKĀT
        // =========================================================================
        {
            id: 'ar-00-found-origin-hijaiyyah-harakat',
            lang: 'ar',
            pillar: 'script',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Sejarah Aksara Arab, 4 Posisi Sambung Hijā’iyyah & Sistem Ḥarakāt',
            subtitle:
                'Evolusi dari Nabataean & Khat Kufi ke Naskhi, 6 huruf pemutus sambungan, Ḥarakāt, serta Al-Qamariyyah vs Asy-Syamsiyyah',
            estimatedMinutes: 40,
            blocks: [
                {
                    type: 'linguistic-lore',
                    title: 'Evolusi Aksara Arab & Kelahiran Sistem Diakritik Ḥarakāt',
                    eraOrDomain: 'Sejarah Ortografi & Kaligrafi Arab (Abad ke-4 – ke-8 M)',
                    direction: 'rtl',
                    narrativeSummary:
                        'Aksara Arab adalah sistem Abjad (konsonan utama) yang ditulis dari kanan ke kiri (RTL) secara kursif (bersambung). Setiap huruf dapat memiliki hingga 4 variasi bentuk tergantung posisinya dalam kata: Terpisah (مُنفَصِل), Awal (أَوَّل), Tengah (وَسَط), dan Akhir (آخِر).',
                    milestones: [
                        {
                            stage: '1. Akar Nabataean & Inskripsi Namāra (328 M)',
                            scriptSample: 'ا ب ج د ه و ز ح ط ي ك ل م ن س ع ف ص ق ر ش ت',
                            reading: 'Urutan Abjadī Klasik (أَبْجَد هَوَّز حُطِّي كَلَمُن...)',
                            explanation:
                                'Aksara Arab berevolusi dari tulisan kursif bangsa Nabataean di Petra (Yordania/Arab Utara). Awalnya huruf-huruf tidak memiliki titik pembeda (Rasm tanpa Nuqaṭ).',
                        },
                        {
                            stage: '2. Reformasi Titik (Nuqaṭ) & Ḥarakāt oleh Abū al-Aswad ad-Du’alī & Al-Khalīl (Abad ke-7–8 M)',
                            scriptSample: 'بـ / تـ / ثـ  |  ـَ (Fatḥah) • ـِ (Kasrah) • ـُ (Ḍammah)',
                            reading: 'Pembedaan huruf kembar dengan titik & penambahan tanda vokal pendek',
                            explanation:
                                'Untuk menjaga akurasi pembacaan Al-Qur’an dan sastra klasik bagi penutur non-Arab, ulama Basrah menambahkan titik pembeda konsonan (ب ت ث) serta tanda vokal pendek di atas/bawah huruf (Ḥarakāt) yang dikembangkan oleh Al-Khalīl ibn Aḥmad al-Farāhīdī.',
                        },
                        {
                            stage: '3. Khat Kufi Geometris & Khat Naskhi Standar Cetak',
                            scriptSample: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
                            reading: 'Bismillāhi ar-Raḥmāni ar-Raḥīm',
                            explanation:
                                'Khat Naskhi dikembangkan oleh Ibnu Muqlah dengan proporsi geometris berbasis titik belah ketupat dan menjadi standar buku cetak serta tipografi digital Arab modern.',
                        },
                    ],
                    structuralRules: [
                        {
                            conceptName: '6 Huruf Pemutus Kiri (الحُرُوفُ الرَّافِسَة / Non-Connectors)',
                            definition:
                                'Enam huruf (ا ، د ، ذ ، ر ، ز ، و) dapat menyambung dengan huruf sebelumnya (kanan), tetapi TIDAK PERNAH menyambung ke huruf sesudahnya (kiri).',
                            whyItMatters:
                                'Memahami 6 huruf ini mencegah kesalahan menyambung huruf yang mengubah identitas kata.',
                            examples: [
                                'دَرَسَ (d-r-s: ketiganya pemutus kiri sehingga tertulis terpisah semua)',
                                'مَدْرَسَة (m-d bersambung, setelah د terputus ke ر, terputus ke سَة)',
                            ],
                        },
                        {
                            conceptName: 'Al-Qamariyyah (ال القمرية) vs Asy-Syamsiyyah (ال الشمسية)',
                            definition:
                                'Ketika awalan definit "ال" (al-) bertemu 14 huruf Syamsiyyah (ت ث د ذ ر ز س ش ص ض ط ظ ل ن), bunyi "l" melebur total menjadi tasydīd pada huruf berikutnya.',
                            whyItMatters:
                                'Kunci kelancaran membaca teks Arab berharakat maupun gundul.',
                            examples: [
                                'القَمَرُ → al-qamaru (L dibaca jelas)',
                                'الشَّمْسُ → asy-syamsu (L melebur ke Syīn, bukan al-syamsu)',
                                'الرَّحْمٰنُ → ar-raḥmānu (L melebur ke Rā’)',
                            ],
                        },
                    ],
                    funFactsAndTips: [
                        'Hamzah Qaṭ‘ (أَ / إِ) wajib selalu dibaca jelas di mana pun posisinya, sedangkan Hamzah Waṣl (اِ) hanya dibaca di awal kalimat dan luluh saat disambung dari kata sebelumnya (فِي البَيْتِ dibaca fil-bayti, bukan fī al-bayti).',
                        'Tā’ Marbūṭah (ـة / ة) di akhir kata dibaca "t" saat disambung harakat (مَدْرَسَةٌ = madrasatun) dan berubah menjadi bunyi "h" lembut saat berhenti/waqaf (مَدْرَسَة = madrasah).',
                    ],
                },
                {
                    type: 'script-matrix',
                    title: 'Tabel 4 Posisi Sambung Huruf Hijā’iyyah & Tanda Ḥarakāt',
                    scriptSystem: 'Arabic Script Positional Matrix (RTL)',
                    direction: 'rtl',
                    description: 'Perbandingan bentuk Terpisah, Awal, Tengah, dan Akhir untuk huruf-huruf utama serta tanda baca.',
                    cells: [
                        { glyph: 'ا / ـا', reading: 'Alif (ا)', transliteration: 'ā / hamzah', componentRole: 'Pemutus Kiri (1/6)', mnemonic: 'Hanya punya 2 bentuk: terpisah (ا) & akhir (ـا)' },
                        { glyph: 'ب • بـ • ـبـ • ـب', reading: 'Bā’ (ب)', transliteration: 'b', componentRole: '4 Posisi Penuh', mnemonic: '1 titik di bawah perahu (Ba = Bawah)' },
                        { glyph: 'ج • جـ • ـجـ • ـج', reading: 'Jīm (ج)', transliteration: 'j', componentRole: '4 Posisi Penuh', mnemonic: '1 titik di dalam perut (Jīm)' },
                        { glyph: 'ع • عـ • ـعـ • ـع', reading: '‘Ayn (ع)', transliteration: '‘ (faringal)', componentRole: '4 Posisi Penuh', mnemonic: 'Kepala terbuka di awal, segitiga tertutup di tengah/akhir' },
                        { glyph: 'م • مـ • ـمـ • ـم', reading: 'Mīm (م)', transliteration: 'm', componentRole: '4 Posisi Penuh', mnemonic: 'Lingkaran kecil tertutup dengan ekor turun di akhir' },
                        { glyph: 'ه • هـ • ـهـ • ـه', reading: 'Hā’ (ه)', transliteration: 'h', componentRole: '4 Posisi Penuh', mnemonic: 'Bentuk pita simpul di tengah (ـهـ) dan lingkaran di akhir' },
                        { glyph: 'ـَ  ـِ  ـُ', reading: 'Fatḥah, Kasrah, Ḍammah', transliteration: 'a • i • u', componentRole: 'Ḥarakāt Vokal Pendek', mnemonic: 'Garis atas (a), garis bawah (i), koma kecil atas (u)' },
                        { glyph: 'ـْ  ـّ  ـً', reading: 'Sukūn, Syaddah, Tanwīn', transliteration: 'mati • ganda • -an', componentRole: 'Tanda Konsonan & Tanwīn', mnemonic: 'Syaddah (ـّ) menggandakan konsonan; Sukūn mematikan vokal' },
                    ],
                },
            ],
        },
        {
            id: 'ar-01-found-phonetics-makharij',
            lang: 'ar',
            pillar: 'phonetics',
            tier: 'foundation',
            order: 1,
            title: 'Foundation | Makhārij al-Ḥurūf & Kontras Konsonan Emfatik (Tafkhīm vs Tarqīq)',
            subtitle:
                'Peta artikulasi tenggorokan–bibir dan perbedaan fatal konsonan tipis vs tebal dalam bahasa Arab',
            estimatedMinutes: 25,
            blocks: [
                {
                    type: 'cognitive-pattern-table',
                    title: 'Pasangan Minimal Konsonan Tipis (Tarqīq) vs Tebal/Emfatik (Tafkhīm)',
                    grammaticalTradition: 'عِلْمُ الأَصْوَاتِ وَمَخَارِجُ الحُرُوفِ',
                    direction: 'rtl',
                    columns: [
                        { key: 'pair', roleLabel: 'Pasangan Huruf', semanticColor: 'cyan' },
                        { key: 'articulation', roleLabel: 'Makhraj & Posisi Pangkal Lidah', semanticColor: 'violet' },
                        { key: 'contrast', roleLabel: 'Perbedaan Makna Fatal', semanticColor: 'rose' },
                    ],
                    rows: [
                        {
                            id: 'ar-f-ph1',
                            cells: {
                                pair: { script: 'س (s) vs ص (ṣ)', reading: 'Sīn vs Ṣād', gloss: 'Desis tipis vs tebal faringal' },
                                articulation: { script: 'Pangkal lidah datar (س) vs terangkat ke langit-langit lunak (ص)', gloss: 'Tafkhīm menebalkan resonansi vokal di sekitarnya' },
                                contrast: { script: 'سَيْفٌ (pedang) vs صَيْفٌ (musim panas)', gloss: 'Satu perubahan huruf mengubah arti sepenuhnya' },
                            },
                            fullTranslation: 'سَيْفٌ (Pedang) vs صَيْفٌ (Musim panas)',
                        },
                        {
                            id: 'ar-f-ph2',
                            cells: {
                                pair: { script: 'ك (k) vs ق (q)', reading: 'Kāf vs Qāf', gloss: 'Velar vs Uvular dalam' },
                                articulation: { script: 'Langit-langit keras (ك) vs pangkal lidah menyentuh anak tekak (ق)', gloss: 'Letupan dalam pada ق' },
                                contrast: { script: 'كَلْبٌ (anjing) vs قَلْبٌ (hati)', gloss: 'Kontras makhraj paling fundamental' },
                            },
                            fullTranslation: 'كَلْبٌ (Anjing) vs قَلْبٌ (Hati)',
                        },
                        {
                            id: 'ar-f-ph3',
                            cells: {
                                pair: { script: 'ح (ḥ) vs ه (h) & ع (‘) vs أ (’)', reading: 'Ḥā’ vs Hā’ & ‘Ayn vs Hamzah', gloss: 'Tenggorokan tengah (Ḥalq)' },
                                articulation: { script: 'Penyempitan otot tenggorokan tengah (ح / ع) vs pita suara bawah (ه / أ)', gloss: 'Suara bersih berhembus tajam pada ح' },
                                contrast: { script: 'عَلِمَ (mengetahui) vs أَلِمَ (merasa sakit)', gloss: 'Makhraj tenggorokan membedakan akar kata' },
                            },
                            fullTranslation: 'عَلِمَ (Mengetahui) vs أَلِمَ (Merasa sakit)',
                        },
                    ],
                    nativeMindset: {
                        headline: 'Tafkhīm (Penebalan) Bukan Sekadar Memonyongkan Bibir!',
                        psychologyExplanation:
                            'Kesalahan umum pembelajar non-Arab saat mengucapkan huruf Tafkhīm (خ ص ض غ ط ق ظ) adalah memonyongkan bibir seperti mengucapkan "o". Penutur asli Arab menjaga bibir tetap netral dan mengangkat PANGKAL LIDAH ke arah langit-langit belakang sehingga ruang rongga mulut bergema dalam.',
                        literalTrap:
                            'Jangan mengucapkan ص atau ق dengan bibir monyong; latih mengangkat bagian belakang lidah saat mengucapkan vokal fatḥah.',
                    },
                },
            ],
        },

        // =========================================================================
        // SUNTIKKAN SELURUH MODUL TATA BAHASA TERPISAH (GRAMMAR-AR.TS)
        // =========================================================================
        ...AR_GRAMMAR_MODULES,

        // =========================================================================
        // TIER 4: NATIVE, DIALECTS & AL-BALĀGHAH
        // =========================================================================
        {
            id: 'ar-08-native-rhetoric-balaghah-dialects',
            lang: 'ar',
            pillar: 'lexicon-dialogue',
            tier: 'native',
            order: 8,
            title: 'Native & Stylistics | Al-Balāghah (البلاغة), Syi’ir Klasik & Dialek Arab Modern',
            subtitle:
                'Tiga pilar retorika Arab (Ma’ānī, Bayān, Badī’), keindahan Jinās & Ṭibāq, serta peta dialek Mesir, Syam & Teluk',
            estimatedMinutes: 45,
            blocks: [
                {
                    type: 'rhetoric-stylistics',
                    title: 'Al-Balāghah al-‘Arabiyyah (البلاغة العربية — Ilmu Retorika & Sastra Arab)',
                    traditionName: 'عُلُومُ البَلَاغَةِ الثَّلَاثَةُ: المَعَانِي وَالبَيَانُ وَالبَدِيعُ',
                    direction: 'rtl',
                    overview:
                        'Al-Balāghah adalah puncak kemahiran berbahasa Arab: menyampaikan makna mendalam secara presisi sesuai konteks pendengar (Muqtaḍā al-Ḥāl) melalui tiga cabang ilmu: Al-Ma’ānī (struktur kalimat), Al-Bayān (citraan metaforis), dan Al-Badī’ (keindahan bunyi dan kontras).',
                    devices: [
                        {
                            deviceName: 'Metafora & Perumpamaan (Tasybīh & Isti’ārah — التشبيه والاستعارة)',
                            nativeTerm: 'عِلْمُ البَيَانِ',
                            mechanism:
                                'Meminjam sifat konkret alam untuk menghidupkan konsep abstrak tanpa menyebut kata pembanding secara langsung.',
                            literaryExample: 'العِلْمُ نُورٌ يَهْدِي العُقُولَ فِي ظُلُمَاتِ الجَهْلِ.',
                            reading: 'Al-‘ilmu nūrun yahdī al-‘uqūla fī ẓulumāti al-jahli.',
                            translation: 'Ilmu adalah cahaya yang membimbing akal di tengah kegelapan kebodohan.',
                            aestheticEffect: 'Menciptakan kontras visual cahaya vs kegelapan yang abadi.',
                        },
                        {
                            deviceName: 'Antitesis Kontras (Aṭ-Ṭibāq — الطِّبَاق)',
                            nativeTerm: 'عِلْمُ البَدِيعِ (الطِّبَاقُ وَالجِنَاسُ)',
                            mechanism:
                                'Menyandingkan dua kata berlawanan makna dalam satu napas kalimat untuk mempertegas pesan.',
                            literaryExample: 'وَتَحْسَبُهُمْ أَيْقَاظًا وَهُمْ رُقُودٌ',
                            reading: 'Wa taḥsabuhum ayqāẓan wa hum ruqūdun',
                            translation: 'Dan engkau mengira mereka terjaga, padahal mereka tertidur.',
                            aestheticEffect: 'Keseimbangan retoris yang memikat pendengar.',
                        },
                        {
                            deviceName: 'Permainan Bunyi Kembar (Al-Jinās — الجِنَاس)',
                            nativeTerm: 'الجِنَاسُ التَّامُّ وَالنَّاقِصُ',
                            mechanism:
                                'Menggunakan dua kata dengan pelafalan identik atau hampir mirip tetapi bermakna berbeda.',
                            literaryExample: 'الوقتُ كالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ.',
                            reading: 'Al-waqtu kas-sayfi in lam taqṭa‘hu qaṭa‘aka.',
                            translation:
                                'Waktu itu bagaikan pedang; jika engkau tidak memotongnya (memanfaatkannya), ia akan memotongmu.',
                            aestheticEffect: 'Musikalitas tinggi yang membuat pepatah Arab mudah dihafal lintas generasi.',
                        },
                    ],
                    dialectAndSlangNotes: [
                        {
                            varietyName: 'Fuṣḥā Mu’āṣirah (Modern Standard Arabic / MSA)',
                            regionOrContext: 'Berita Al-Jazeera, Buku, Pidato Resmi, Jurnal & Komunikasi Lintas Negara Arab',
                            sampleExpression: 'كَيْفَ حَالُكَ؟ • أُرِيدُ أَنْ أَذْهَبَ الآنَ • مَاذَا تُرِيدُ؟',
                            standardEquivalent: 'Standar Pan-Arab (Dipahami di seluruh 22 negara Liga Arab)',
                            meaning: 'Apa kabarmu? • Saya ingin pergi sekarang • Apa yang kamu inginkan?',
                        },
                        {
                            varietyName: 'Al-Lahjah al-Maṣriyyah (Dialek Mesir)',
                            regionOrContext: 'Kairo & Media Hiburan Arab (Paling luas dipahami)',
                            sampleExpression: 'إِزَّيَّك؟ (Izzayyak?) • عَايِز أَرُوح دِلْوَقْتِي • إِيه دَه؟',
                            standardEquivalent: 'كَيْفَ حَالُكَ؟ • أُرِيدُ أَنْ أَذْهَبَ الآنَ • مَا هٰذَا؟',
                            meaning: 'Huruf ق diucapkan sebagai hamzah (قَلْب → ’alb) dan ج diucapkan /g/ keras.',
                        },
                        {
                            varietyName: 'Al-Lahjah asy-Syāmiyyah (Dialek Levantine)',
                            regionOrContext: 'Suriah, Lebanon, Yordania & Palestina',
                            sampleExpression: 'كِيفَك؟ (Kīfak?) • بَدِّي رُوح هَلَّأ • شُو هَاد؟',
                            standardEquivalent: 'كَيْفَ حَالُكَ؟ • أُرِيدُ أَنْ أَذْهَبَ الآنَ • مَا هٰذَا؟',
                            meaning: 'Intonasi melodius yang banyak digunakan dalam podcast dan serial modern.',
                        },
                    ],
                },
            ],
        },
    ];

    // =========================================================================
    // KORPUS KOSAKATA BERHARAKAT TERBUKA: 30.000+ ENTRI DARI AR.TXT
    // =========================================================================
    logStep('ar', 'Mengunduh korpus leksikon Arab berharakat penuh (30.000+ entri)...');
    const arabicTsv = await fetchTextWithFallback([
        'https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data/ar.txt',
    ]);

    const parsedArabic: RawArabicEntry[] = [];
    if (arabicTsv) {
        for (const line of arabicTsv.split('\n')) {
            if (parsedArabic.length >= 30000) break;
            const [word, ipa] = line.split('\t');
            if (word && ipa && /[\u0600-\u06FF]/.test(word)) {
                parsedArabic.push({
                    ar: word.trim(),
                    en: `Transkripsi Fonetik IPA: ${ipa.split(',')[0]?.trim() ?? ipa.trim()}`,
                    pos: 'Fuṣḥā Berharakat',
                });
            }
        }
    }

    const begEntries = parsedArabic.slice(0, 5000).map((item, idx) => ({
        id: `ar-beg-${idx + 1}`,
        term: item.ar,
        reading: 'Fuṣḥā Dasar (A1–A2)',
        meaning: item.en,
        partOfSpeech: 'Mufradāt Dasar',
    }));

    const interEntries = parsedArabic.slice(5000, 15000).map((item, idx) => ({
        id: `ar-int-${idx + 1}`,
        term: item.ar,
        reading: 'Fuṣḥā Menengah (B1–B2)',
        meaning: item.en,
        partOfSpeech: 'Mufradāt Menengah',
    }));

    const advEntries = parsedArabic.slice(15000, 30000).map((item, idx) => ({
        id: `ar-adv-${idx + 1}`,
        term: item.ar,
        reading: 'Fuṣḥā Mahir (C1–C2)',
        meaning: item.en,
        partOfSpeech: 'Mufradāt Lanjutan',
    }));

    if (begEntries.length > 0) {
        modules.push({
            id: 'ar-05-beg-lexicon-a1-a2',
            lang: 'ar',
            pillar: 'lexicon-dialogue',
            tier: 'beginner',
            order: 5,
            title: `CEFR A1–A2 | Hiwār & Bank Mufradāt Berharakat (${begEntries.length} Kata)`,
            subtitle: 'Percakapan Fuṣḥā harian + 5.000 entri Arab berharakat & fonetik IPA',
            estimatedMinutes: 55,
            blocks: [
                {
                    type: 'dialogue-theater',
                    title: 'Ḥiwār: Ta’āruf di Universitas Kairo (Fuṣḥā Berharakat)',
                    contextSituation: 'Perkenalan akademik antar mahasiswa internasional',
                    registerLevel: 'Fuṣḥā Mu’āṣirah',
                    direction: 'rtl',
                    turns: [
                        {
                            speaker: 'أَحْمَدُ',
                            line: 'السَّلَامُ عَلَيْكُمْ، أَنَا أَحْمَدُ مِنْ مِصْرَ. مِنْ أَيْنَ أَنْتَ؟',
                            reading: 'As-salāmu ‘alaykum, anā Aḥmadu min Miṣra. Min ayna anta?',
                            translation: 'Semoga keselamatan tercurah atasmu, saya Ahmad dari Mesir. Dari mana asalmu?',
                            grammarHighlight: 'مِنْ مِصْرَ (Mamnu’ min aṣ-Ṣarf)',
                        },
                        {
                            speaker: 'نَوْفَلُ',
                            line: 'وَعَلَيْكُمُ السَّلَامُ، أَنَا نَوْفَلُ مِنْ إِنْدُونِيسِيَا، أَدْرُسُ عُلُومَ الحَاسُوبِ.',
                            reading: 'Wa ‘alaykumu as-salāmu, anā Nawfalu min Indūnīsiyā, adrusu ‘ulūma al-ḥāsūbi.',
                            translation: 'Dan atasmu keselamatan, saya Naufal dari Indonesia, saya belajar ilmu komputer.',
                            grammarHighlight: 'عُلُومَ الحَاسُوبِ (Idhāfah)',
                        },
                    ],
                },
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Arab Berharakat Dasar + IPA',
                    direction: 'rtl',
                    totalCount: begEntries.length,
                    entries: begEntries,
                },
            ],
        });
    }

    if (interEntries.length > 0) {
        modules.push({
            id: 'ar-06-inter-lexicon-b1-b2',
            lang: 'ar',
            pillar: 'lexicon-dialogue',
            tier: 'intermediate',
            order: 6,
            title: `CEFR B1–B2 | Bank Mufradāt Menengah Berharakat (${interEntries.length} Kata)`,
            subtitle: '10.000 entri kosakata menengah berharakat lengkap dengan fonetik IPA',
            estimatedMinutes: 80,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Arab Menengah Berharakat + IPA',
                    direction: 'rtl',
                    totalCount: interEntries.length,
                    entries: interEntries,
                },
            ],
        });
    }

    if (advEntries.length > 0) {
        modules.push({
            id: 'ar-07-adv-lexicon-c1-c2',
            lang: 'ar',
            pillar: 'lexicon-dialogue',
            tier: 'advanced',
            order: 7,
            title: `CEFR C1–C2 | Bank Mufradāt Mahir & Klasik Berharakat (${advEntries.length} Kata)`,
            subtitle: '15.000 entri kosakata tingkat lanjut berharakat untuk sastra, hukum, dan jurnal ilmiah',
            estimatedMinutes: 95,
            blocks: [
                {
                    type: 'vocabulary-deck',
                    title: 'Leksikon Arab Lanjutan Berharakat + IPA',
                    direction: 'rtl',
                    totalCount: advEntries.length,
                    entries: advEntries,
                },
            ],
        });
    }

    return Promise.all(modules.map((m) => writeValidatedModule(m, options)));
}
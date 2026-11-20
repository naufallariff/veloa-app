// src/shared/ui/InteractiveScriptCharts.tsx
import React, { useCallback, useState } from 'react';
import { BookOpen, Compass, Grid, Layers, Sparkles, Volume2 } from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';
import { PaginatedDataView } from '@/components/ui/PaginatedDataView';

interface InteractiveScriptChartsProps {
    selectedLang: LanguageCode;
}

interface CharacterEncyclopediaEntry {
    id: string;
    glyph: string;
    secondaryGlyph?: string;
    reading: string;
    meaning?: string; // ← Jadikan opsional agar 4 item lama tidak error
    strokeInfo: string;
    origin: string;
    mnemonic: string;
    exampleWord: string;
    exampleMeaning: string;
}

/* ============================================================================
   1. BAHASA JEPANG: HIRAGANA TERPISAH, KATAKANA TERPISAH & BANK KANJI
   ============================================================================ */
const JP_HIRAGANA_LIST: CharacterEncyclopediaEntry[] = [
    { id: 'hira-a', glyph: 'あ', reading: 'a', meaning: 'Vokal A (Baris ∅)', strokeInfo: '3 guratan (horizontal → vertikal melengkung → simpul bulat)', origin: 'Berasal dari penyederhanaan kursif (Sōsho) Kanji 安 (aman/damai).', mnemonic: 'Bentuknya seperti huruf "a" kecil yang dilingkari tali simpul.', exampleWord: 'あさ (asa)', exampleMeaning: 'Pagi hari' },
    { id: 'hira-i', glyph: 'い', reading: 'i', meaning: 'Vokal I (Baris ∅)', strokeInfo: '2 guratan (kiri melengkung kait → kanan pendek miring)', origin: 'Berasal dari bentuk kursif Kanji 以 (dengan/oleh).', mnemonic: 'Dua garis berdiri berdampingan seperti huruf "ii" miring.', exampleWord: 'いぬ (inu)', exampleMeaning: 'Anjing' },
    { id: 'hira-u', glyph: 'う', reading: 'u', meaning: 'Vokal U (Baris ∅)', strokeInfo: '2 guratan (titik miring atas → lengkungan telinga ke bawah)', origin: 'Berasal dari bentuk kursif Kanji 宇 (alam semesta/atap).', mnemonic: 'Seperti telinga yang sedang mendengarkan bunyi "u".', exampleWord: 'うみ (umi)', exampleMeaning: 'Laut' },
    { id: 'hira-e', glyph: 'え', reading: 'e', meaning: 'Vokal E (Baris ∅)', strokeInfo: '2 guratan (titik atas → garis zig-zag mengalir)', origin: 'Berasal dari bentuk kursif Kanji 衣 (pakaian).', mnemonic: 'Seperti burung eksotis dengan jambul di atas kepalanya.', exampleWord: 'えき (eki)', exampleMeaning: 'Stasiun kereta' },
    { id: 'hira-o', glyph: 'お', reading: 'o', meaning: 'Vokal O (Baris ∅)', strokeInfo: '3 guratan (horizontal → vertikal melingkar → titik kanan atas)', origin: 'Berasal dari bentuk kursif Kanji 於 (di/pada).', mnemonic: 'Pemain golf memukul bola "o" ke kanan atas.', exampleWord: 'おちゃ (ocha)', exampleMeaning: 'Teh hijau' },
    { id: 'hira-ka', glyph: 'か', reading: 'ka', meaning: 'Konsonan K + a', strokeInfo: '3 guratan (lengkungan kiri → garis miring → titik kanan)', origin: 'Berasal dari Kanji 加 (menambah).', mnemonic: 'Bilah pedang "ka-tana" memotong dengan percikan di kanan.', exampleWord: 'かさ (kasa)', exampleMeaning: 'Payung' },
    { id: 'hira-ki', glyph: 'き', reading: 'ki', meaning: 'Konsonan K + i', strokeInfo: '4 guratan (dua garis miring → batang miring → lengkungan bawah)', origin: 'Berasal dari Kanji 幾 (berapa/beberapa).', mnemonic: 'Mirip kunci klasik ("key" / ki) bergerigi dua.', exampleWord: 'きって (kitte)', exampleMeaning: 'Perangko' },
    { id: 'hira-ku', glyph: 'く', reading: 'ku', meaning: 'Konsonan K + u', strokeInfo: '1 guratan (sudut lancip menghadap ke kiri)', origin: 'Berasal dari Kanji 久 (lama/abadi).', mnemonic: 'Paruh burung "ku-ku" yang terbuka ke kanan.', exampleWord: 'くも (kumo)', exampleMeaning: 'Awan' },
    { id: 'hira-ke', glyph: 'け', reading: 'ke', meaning: 'Konsonan K + e', strokeInfo: '3 guratan (vertikal kiri → horizontal atas → vertikal melengkung)', origin: 'Berasal dari Kanji 計 (menghitung/rencana).', mnemonic: 'Tong kayu ("keg") dengan satu papan melengkung.', exampleWord: 'けさ (kesa)', exampleMeaning: 'Tadi pagi' },
    { id: 'hira-ko', glyph: 'こ', reading: 'ko', meaning: 'Konsonan K + o', strokeInfo: '2 guratan (lengkungan atas → lengkungan bawah sejajar)', origin: 'Berasal dari Kanji 己 (diri sendiri).', mnemonic: 'Dua "ko-in" atau dua cacing sejajar.', exampleWord: 'こども (kodomo)', exampleMeaning: 'Anak-anak' },
    { id: 'hira-sa', glyph: 'さ', reading: 'sa', meaning: 'Konsonan S + a', strokeInfo: '3 guratan (horizontal → miring melintang → lengkungan bawah)', origin: 'Berasal dari Kanji 左 (kiri).', mnemonic: 'Cerminan terbalik dari き (ki) dengan satu garis mendatar.', exampleWord: 'さくら (sakura)', exampleMeaning: 'Bunga sakura' },
    { id: 'hira-shi', glyph: 'し', reading: 'shi', meaning: 'Konsonan S + i (dibaca shi)', strokeInfo: '1 guratan (vertikal turun lalu melengkung ke kanan)', origin: 'Berasal dari Kanji 之 (ini/menuju).', mnemonic: 'Mata kail pancing ("fishing" / shi).', exampleWord: 'しろ (shiro)', exampleMeaning: 'Putih / Kastil' },
    { id: 'hira-su', glyph: 'す', reading: 'su', meaning: 'Konsonan S + u', strokeInfo: '2 guratan (horizontal → vertikal dengan simpul tengah)', origin: 'Berasal dari Kanji 寸 (ukuran inci).', mnemonic: 'Ayunan ("swing" / su) yang berputar di tengah.', exampleWord: 'すし (sushi)', exampleMeaning: 'Sushi' },
    { id: 'hira-se', glyph: 'せ', reading: 'se', meaning: 'Konsonan S + e', strokeInfo: '3 guratan (horizontal → vertikal kanan → kait kiri-bawah)', origin: 'Berasal dari Kanji 世 (dunia/generasi).', mnemonic: 'Mulut yang sedang mengucapkan "se-lamat".', exampleWord: 'せかい (sekai)', exampleMeaning: 'Dunia' },
    { id: 'hira-so', glyph: 'そ', reading: 'so', meaning: 'Konsonan S + o', strokeInfo: '1 guratan (zig-zag atas menyambung ke lengkungan C)', origin: 'Berasal dari Kanji 曽 (pernah/dahulu).', mnemonic: 'Jahitan benang zig-zag ("sewing" / so).', exampleWord: 'そら (sora)', exampleMeaning: 'Langit' },
    { id: 'hira-ta', glyph: 'た', reading: 'ta', meaning: 'Konsonan T + a', strokeInfo: '4 guratan (tanda tambah kiri + dua garis kanan)', origin: 'Berasal dari Kanji 太 (gemuk/besar).', mnemonic: 'Terlihat jelas seperti huruf "t" dan "a" berdampingan.', exampleWord: 'たべる (taberu)', exampleMeaning: 'Makan' },
    { id: 'hira-chi', glyph: 'ち', reading: 'chi', meaning: 'Konsonan T + i (dibaca chi)', strokeInfo: '2 guratan (horizontal → vertikal melengkung ke kanan)', origin: 'Berasal dari Kanji 知 (mengetahui).', mnemonic: 'Mirip angka 5 atau wajah ceria ("cheer" / chi).', exampleWord: 'ちず (chizu)', exampleMeaning: 'Peta' },
    { id: 'hira-tsu', glyph: 'つ', reading: 'tsu', meaning: 'Konsonan T + u (dibaca tsu)', strokeInfo: '1 guratan (lengkungan ombak dari kiri ke bawah)', origin: 'Berasal dari Kanji 川 (sungai).', mnemonic: 'Gelombang ombak "tsu-nami" yang menggulung.', exampleWord: 'つき (tsuki)', exampleMeaning: 'Bulan' },
    { id: 'hira-te', glyph: 'て', reading: 'te', meaning: 'Konsonan T + e', strokeInfo: '1 guratan (horizontal atas berbelok melengkung ke bawah)', origin: 'Berasal dari Kanji 天 (langit/surga).', mnemonic: 'Telapak tangan ("te" dalam bahasa Jepang berarti tangan).', exampleWord: 'てがみ (tegami)', exampleMeaning: 'Surat' },
    { id: 'hira-to', glyph: 'と', reading: 'to', meaning: 'Konsonan T + o', strokeInfo: '2 guratan (garis miring pendek → lengkungan C)', origin: 'Berasal dari Kanji 止 (berhenti).', mnemonic: 'Jari kaki ("toe") tertancap duri kecil.', exampleWord: 'とり (tori)', exampleMeaning: 'Burung' },
];

const JP_KATAKANA_LIST: CharacterEncyclopediaEntry[] = [
    { id: 'kata-a', glyph: 'ア', reading: 'a', meaning: 'Vokal A (Serapan Asing)', strokeInfo: '2 guratan (horizontal berbelok miring → garis lengkung bawah)', origin: 'Diambil dari bagian kiri Kanji 阿 (sudut/bukit).', mnemonic: 'Kapak ("axe") tajam menghadap ke kiri.', exampleWord: 'アイス (aisu)', exampleMeaning: 'Es krim' },
    { id: 'kata-i', glyph: 'イ', reading: 'i', meaning: 'Vokal I (Serapan Asing)', strokeInfo: '2 guratan (miring kiri atas → vertikal tegak tengah)', origin: 'Diambil dari radikal kiri Kanji 伊 (dia/itu).', mnemonic: 'Stand penyangga lukisan ("easel").', exampleWord: 'インク (inku)', exampleMeaning: 'Tinta' },
    { id: 'kata-u', glyph: 'ウ', reading: 'u', meaning: 'Vokal U (Serapan Asing)', strokeInfo: '3 guratan (vertikal pendek atas → garis samping → sudut kanan)', origin: 'Diambil dari bagian atas Kanji 宇 (atap/ruang).', mnemonic: 'Versi bersudut tajam dari Hiragana う.', exampleWord: 'ウール (ūru)', exampleMeaning: 'Wol' },
    { id: 'kata-e', glyph: 'エ', reading: 'e', meaning: 'Vokal E (Serapan Asing)', strokeInfo: '3 guratan (horizontal atas → vertikal tengah → horizontal bawah)', origin: 'Diambil dari bagian kanan Kanji 江 (sungai besar).', mnemonic: 'Bentuk balok "I" besar atau rel kereta ("elevated rail").', exampleWord: 'エアコン (eakon)', exampleMeaning: 'Pendingin ruangan (AC)' },
    { id: 'kata-o', glyph: 'オ', reading: 'o', meaning: 'Vokal O (Serapan Asing)', strokeInfo: '3 guratan (horizontal → vertikal kait → miring kiri bawah)', origin: 'Diambil dari bagian kiri Kanji 於.', mnemonic: 'Penyanyi opera mengangkat tangan kirinya.', exampleWord: 'オレンジ (orenji)', exampleMeaning: 'Jeruk' },
    { id: 'kata-ka', glyph: 'カ', reading: 'ka', meaning: 'Konsonan K + a', strokeInfo: '2 guratan (sudut kanan atas → garis miring kiri)', origin: 'Diambil langsung dari Kanji 加 tanpa bagian mulutnya.', mnemonic: 'Sama persis dengan Hiragana か tetapi bersudut tegas tanpa titik.', exampleWord: 'カメラ (kamera)', exampleMeaning: 'Kamera' },
    { id: 'kata-ki', glyph: 'キ', reading: 'ki', meaning: 'Konsonan K + i', strokeInfo: '3 guratan (dua garis miring → satu batang miring panjang)', origin: 'Diambil dari bagian atas Kanji 幾.', mnemonic: 'Bagian atas kunci dari Hiragana き tanpa lengkungan bawah.', exampleWord: 'ギター (gitā)', exampleMeaning: 'Gitar (dengan dakuten)' },
    { id: 'kata-ku', glyph: 'ク', reading: 'ku', meaning: 'Konsonan K + u', strokeInfo: '2 guratan (miring pendek kiri → sudut kanan melengkung)', origin: 'Diambil dari bagian atas Kanji 久.', mnemonic: 'Ekor burung "ku-ku" yang runcing.', exampleWord: 'クラス (kurasu)', exampleMeaning: 'Kelas' },
    { id: 'kata-ke', glyph: 'ケ', reading: 'ke', meaning: 'Konsonan K + e', strokeInfo: '3 guratan (miring kiri → horizontal → lengkungan tengah)', origin: 'Diambil dari bagian atas Kanji 介.', mnemonic: 'Huruf "K" yang sedikit dimiringkan.', exampleWord: 'ケーキ (kēki)', exampleMeaning: 'Kue' },
    { id: 'kata-ko', glyph: 'コ', reading: 'ko', meaning: 'Konsonan K + o', strokeInfo: '2 guratan (sudut atas kanan → garis bawah sejajar)', origin: 'Diambil dari bagian atas Kanji 己.', mnemonic: 'Sudut kotak ("corner" / ko).', exampleWord: 'コーヒー (kōhī)', exampleMeaning: 'Kopi' },
    { id: 'kata-sa', glyph: 'サ', reading: 'sa', meaning: 'Konsonan S + a', strokeInfo: '3 guratan (horizontal → vertikal kiri → vertikal kanan melengkung)', origin: 'Diambil dari bagian atas Kanji 散.', mnemonic: 'Pelana kuda ("saddle" / sa).', exampleWord: 'サラダ (sarada)', exampleMeaning: 'Salad' },
    { id: 'kata-shi', glyph: 'シ', reading: 'shi', meaning: 'Konsonan S + i (dibaca shi)', strokeInfo: '3 guratan (dua titik vertikal kiri → sapuan naik dari bawah ke atas)', origin: 'Diambil dari bagian kiri Kanji 之.', mnemonic: 'Wajah tersenyum miring ke kanan ("she" is smiling); sapuan dari bawah ke atas.', exampleWord: 'シャツ (shatsu)', exampleMeaning: 'Kemeja' },
    { id: 'kata-su', glyph: 'ス', reading: 'su', meaning: 'Konsonan S + u', strokeInfo: '2 guratan (horizontal berbelok miring → kaki penyangga kanan)', origin: 'Diambil dari bagian bawah Kanji 須.', mnemonic: 'Pemain ski meluncur kencang ("super" / su).', exampleWord: 'スポーツ (supōtsu)', exampleMeaning: 'Olahraga' },
    { id: 'kata-se', glyph: 'セ', reading: 'se', meaning: 'Konsonan S + e', strokeInfo: '2 guratan (horizontal kait → vertikal melengkung kanan)', origin: 'Diambil langsung dari Kanji 世.', mnemonic: 'Bentuk bersudut dari Hiragana せ.', exampleWord: 'セーター (sētā)', exampleMeaning: 'Sweter' },
    { id: 'kata-so', glyph: 'ソ', reading: 'so', meaning: 'Konsonan S + o', strokeInfo: '2 guratan (titik miring atas → sapuan turun dari atas ke bawah)', origin: 'Diambil dari bagian atas Kanji 曽.', mnemonic: 'Jangan tertukar dengan ン (n): ソ disapu dari atas ke bawah!', exampleWord: 'ソファ (sofa)', exampleMeaning: 'Sofa' },
];

const JP_KANJI_LIST: CharacterEncyclopediaEntry[] = [
    { id: 'kanji-nichi', glyph: '日', reading: 'ニチ・ジツ / ひ・か', meaning: 'Matahari / Hari', strokeInfo: '4 guratan (kiri → atas-kanan → tengah → tutup bawah)', origin: 'Piktogram cakram matahari dengan titik sinar di tengahnya.', mnemonic: 'Jendela yang dilalui cahaya matahari pagi.', exampleWord: '日本 (Nihon)', exampleMeaning: 'Jepang (Asal Matahari)' },
    { id: 'kanji-getsu', glyph: '月', reading: 'ゲツ・ガツ / つき', meaning: 'Bulan', strokeInfo: '4 guratan (kiri melengkung → atas-kanan kait → dua garis dalam)', origin: 'Piktogram bulan sabit dengan garis bayangan permukaan bulan.', mnemonic: 'Bulan sabit dengan dua tangga menuju langit.', exampleWord: '月曜日 (Getsuyōbi)', exampleMeaning: 'Hari Senin' },
    { id: 'kanji-sui', glyph: '水', reading: 'スイ / みず', meaning: 'Air', strokeInfo: '4 guratan (tengah kait → kiri → kanan atas → kanan bawah)', origin: 'Piktogram aliran sungai di tengah dengan percikan air di kiri dan kanan.', mnemonic: 'Aliran air mancur yang memercik ke samping.', exampleWord: '水曜日 (Suiyōbi)', exampleMeaning: 'Hari Rabu' },
    { id: 'kanji-ka', glyph: '火', reading: 'カ / ひ', meaning: 'Api', strokeInfo: '4 guratan (titik kiri → titik kanan → garis orang di tengah)', origin: 'Piktogram lidah api yang berkobar ke atas.', mnemonic: 'Orang (人) yang dikelilingi percikan api di kiri dan kanan.', exampleWord: '火山 (Kazan)', exampleMeaning: 'Gunung berapi' },
    { id: 'kanji-moku', glyph: '木', reading: 'ボク・モク / き', meaning: 'Pohon / Kayu', strokeInfo: '4 guratan (horizontal → vertikal → miring kiri → miring kanan)', origin: 'Piktogram batang pohon dengan dahan di atas dan akar di bawah.', mnemonic: 'Pohon cemara lengkap dengan dahan dan akar.', exampleWord: '木曜日 (Mokuyōbi)', exampleMeaning: 'Hari Kamis' },
    { id: 'kanji-kin', glyph: '金', reading: 'キン・コン / かね', meaning: 'Emas / Logam / Uang', strokeInfo: '8 guratan (atap 人 → dua garis → vertikal → dua butir emas → alas)', origin: 'Bongkahan logam mulia yang terkubur di bawah atap tanah (土).', mnemonic: 'Atap tambang yang melindungi dua bongkah emas di bawah tanah.', exampleWord: 'お金 (Okane)', exampleMeaning: 'Uang' },
    { id: 'kanji-do', glyph: '土', reading: 'ド・ト / つち', meaning: 'Tanah / Bumi', strokeInfo: '3 guratan (horizontal pendek → vertikal → horizontal panjang bawah)', origin: 'Piktogram gundukan tanah yang berdiri di atas permukaan bumi.', mnemonic: 'Tunas kecil yang tumbuh di atas permukaan tanah datar.', exampleWord: '土曜日 (Doyōbi)', exampleMeaning: 'Hari Sabtu' },
    { id: 'kanji-jin', glyph: '人', reading: 'ジン・ニン / ひと', meaning: 'Orang / Manusia', strokeInfo: '2 guratan (miring panjang ke kiri → miring menyangga ke kanan)', origin: 'Piktogram manusia tampak samping yang sedang melangkah.', mnemonic: 'Dua kaki manusia yang saling menopang saat berjalan.', exampleWord: '日本人 (Nihonjin)', exampleMeaning: 'Orang Jepang' },
    { id: 'kanji-gaku', glyph: '学', reading: 'ガク / まな.ぶ', meaning: 'Belajar / Ilmu', strokeInfo: '8 guratan (tiga titik atas → atap 冖 → anak 子)', origin: 'Kedua tangan guru menanamkan pengetahuan kepada anak (子) di bawah atap sekolah.', mnemonic: 'Anak (子) yang belajar di bawah atap sekolah bercahaya.', exampleWord: '学生 (Gakusei)', exampleMeaning: 'Pelajar / Mahasiswa' },
    { id: 'kanji-go', glyph: '語', reading: 'ゴ / かた.る', meaning: 'Bahasa / Kata', strokeInfo: '14 guratan (radikal kata 言 kiri + 五 + 口 kanan)', origin: 'Fono-semantik: radikal ucapan (言) sebagai makna + 吾 sebagai petunjuk bunyi.', mnemonic: 'Ucapan (言) dari lima (五) mulut (口) membentuk bahasa.', exampleWord: '日本語 (Nihongo)', exampleMeaning: 'Bahasa Jepang' },
];

/* ============================================================================
   2. BAHASA MANDARIN: 6 KATEGORI LIÙSHŪ TERPISAH + BANK HANZI INTI
   ============================================================================ */
interface LiushuCategorySpec {
    id: string;
    badge: string;
    title: string;
    formula: string;
    description: string;
    items: CharacterEncyclopediaEntry[];
}

const ZH_LIUSHU_CATEGORIES: LiushuCategorySpec[] = [
    {
        id: 'xiangxing',
        badge: 'Kategori 1 · 象形 Xiàngxíng',
        title: 'Piktogram (Gambar Benda Nyata → Garis Karakter)',
        formula: 'Sketsa Objek Alam → Standarisasi Guratan Baku',
        description: 'Karakter tertua dalam aksara tulang ramalan (Jiǎgǔwén) yang meniru bentuk fisik objek alam secara langsung.',
        items: [
            { id: 'ls-xx-ri', glyph: '日', reading: 'rì', meaning: 'Matahari / Hari', strokeInfo: '4 guratan', origin: 'Sketsa lingkaran matahari dengan titik inti cahaya di tengah.', mnemonic: 'Kotak jendela tempat cahaya matahari masuk.', exampleWord: '日光 (rìguāng)', exampleMeaning: 'Sinar matahari' },
            { id: 'ls-xx-yue', glyph: '月', reading: 'yuè', meaning: 'Bulan', strokeInfo: '4 guratan', origin: 'Sketsa bulan sabit dengan dua garis kawah bayangan.', mnemonic: 'Bulan sabit bertingkat dua.', exampleWord: '月亮 (yuèliang)', exampleMeaning: 'Bulan di langit' },
            { id: 'ls-xx-shan', glyph: '山', reading: 'shān', meaning: 'Gunung', strokeInfo: '3 guratan (tengah → kiri-bawah → kanan)', origin: 'Tiga puncak pegunungan dengan puncak tertinggi di tengah.', mnemonic: 'Tiga puncak gunung berjajar.', exampleWord: '山水 (shānshuǐ)', exampleMeaning: 'Pemandangan gunung & air' },
            { id: 'ls-xx-shui', glyph: '水', reading: 'shuǐ', meaning: 'Air', strokeInfo: '4 guratan', origin: 'Aliran arus sungai utama di tengah dan riak air di samping.', mnemonic: 'Arus sungai berliku dengan percikan air.', exampleWord: '水果 (shuǐguǒ)', exampleMeaning: 'Buah-buahan' },
            { id: 'ls-xx-mu', glyph: '木', reading: 'mù', meaning: 'Pohon / Kayu', strokeInfo: '4 guratan', origin: 'Batang pohon tegak dengan cabang atas dan akar bawah.', mnemonic: 'Batang pohon lengkap dengan dahan dan akar.', exampleWord: '木头 (mùtou)', exampleMeaning: 'Kayu' },
            { id: 'ls-xx-ren', glyph: '人', reading: 'rén', meaning: 'Manusia / Orang', strokeInfo: '2 guratan', origin: 'Siluet manusia berdiri menyamping dengan dua kaki.', mnemonic: 'Dua garis kaki manusia yang saling menopang.', exampleWord: '人们 (rénmen)', exampleMeaning: 'Orang-orang' },
        ],
    },
    {
        id: 'zhishi',
        badge: 'Kategori 2 · 指事 Zhǐshì',
        title: 'Ideogram Indikatif (Simbol Abstrak + Penunjuk Posisi)',
        formula: 'Garis Acuan + Tanda Penunjuk Arah / Bagian',
        description: 'Menyatakan konsep abstrak (atas, bawah, akar, ujung, angka) dengan menambahkan tanda penunjuk pada simbol dasar.',
        items: [
            { id: 'ls-zs-shang', glyph: '上', reading: 'shàng', meaning: 'Atas / Naik', strokeInfo: '3 guratan (vertikal → pendek kanan → garis dasar)', origin: 'Penanda titik/garis berdiri di atas garis cakrawala.', mnemonic: 'Tiang berdiri di atas lantai.', exampleWord: '上午 (shàngwǔ)', exampleMeaning: 'Pagi menjelang siang' },
            { id: 'ls-zs-xia', glyph: '下', reading: 'xià', meaning: 'Bawah / Turun', strokeInfo: '3 guratan (garis atas → vertikal → titik kanan)', origin: 'Penanda menggantung di bawah garis cakrawala.', mnemonic: 'Akar menggantung di bawah permukaan tanah.', exampleWord: '下午 (xiàwǔ)', exampleMeaning: 'Sore hari' },
            { id: 'ls-zs-ben', glyph: '本', reading: 'běn', meaning: 'Akar / Asal / Buku', strokeInfo: '5 guratan (pohon 木 + garis penunjuk di bawah)', origin: 'Karakter pohon (木) diberi garis penunjuk tepat pada bagian akarnya.', mnemonic: 'Pohon 木 dengan garis merah di bagian akar = asal mula.', exampleWord: '书本 (shūběn)', exampleMeaning: 'Buku' },
            { id: 'ls-zs-mo', glyph: '末', reading: 'mò', meaning: 'Ujung / Akhir', strokeInfo: '5 guratan (garis panjang atas + pohon 木)', origin: 'Karakter pohon (木) diberi garis panjang pada pucuk tertingginya.', mnemonic: 'Garis atas lebih panjang dari garis bawah = pucuk tertinggi.', exampleWord: '周末 (zhōumò)', exampleMeaning: 'Akhir pekan' },
            { id: 'ls-zs-ren', glyph: '刃', reading: 'rèn', meaning: 'Mata Pisau / Tajam', strokeInfo: '3 guratan (pisau 刀 + titik di sisi tajam)', origin: 'Karakter pisau (刀) diberi titik penunjuk tepat pada sisi bilah tajamnya.', mnemonic: 'Pisau 刀 dengan titik penunjuk bagian tajamnya.', exampleWord: '刀刃 (dāorèn)', exampleMeaning: 'Mata pisau' },
        ],
    },
    {
        id: 'huiyi',
        badge: 'Kategori 3 · 会意 Huìyì',
        title: 'Ideogram Majemuk (Gabungan Makna Dua Radikal)',
        formula: 'Radikal Makna A + Radikal Makna B = Gagasan Baru',
        description: 'Menggabungkan dua atau lebih komponen bermakna untuk melahirkan konsep baru yang logis secara asosiatif.',
        items: [
            { id: 'ls-hy-hao', glyph: '好', reading: 'hǎo', meaning: 'Baik / Harmonis', strokeInfo: '6 guratan (女 kiri + 子 kanan)', origin: 'Ibu/perempuan (女) menggendong anak (子) melambangkan kebaikan & harmoni.', mnemonic: 'Perempuan 女 + anak 子 = kebahagiaan & kebaikan.', exampleWord: '你好 (nǐ hǎo)', exampleMeaning: 'Halo / Apa kabar' },
            { id: 'ls-hy-ming', glyph: '明', reading: 'míng', meaning: 'Terang / Jelas / Besok', strokeInfo: '8 guratan (日 kiri + 月 kanan)', origin: 'Gabungan cahaya matahari (日) dan bulan (月) menghasilkan terang benderang.', mnemonic: 'Matahari 日 + bulan 月 = cahaya terang.', exampleWord: '明白 (míngbai)', exampleMeaning: 'Mengerti / Paham' },
            { id: 'ls-hy-xiu', glyph: '休', reading: 'xiū', meaning: 'Beristirahat', strokeInfo: '6 guratan (亻 kiri + 木 kanan)', origin: 'Seseorang (亻) bersandar berteduh di samping pohon (木).', mnemonic: 'Orang 亻 bersandar di pohon 木 = beristirahat.', exampleWord: '休息 (xiūxi)', exampleMeaning: 'Istirahat' },
            { id: 'ls-hy-lin', glyph: '林', reading: 'lín', meaning: 'Hutan / Rimbun', strokeInfo: '8 guratan (木 kiri + 木 kanan)', origin: 'Dua pohon (木) berdiri berdampingan membentuk kawasan hutan.', mnemonic: 'Dua pohon 木 + 木 = hutan.', exampleWord: '森林 (sēnlín)', exampleMeaning: 'Hutan belantara' },
            { id: 'ls-hy-xin', glyph: '信', reading: 'xìn', meaning: 'Percaya / Surat / Jujur', strokeInfo: '9 guratan (亻 kiri + 言 kanan)', origin: 'Seseorang (亻) memegang teguh ucapannya (言).', mnemonic: 'Orang 亻 + perkataan 言 = kepercayaan.', exampleWord: '相信 (xiāngxìn)', exampleMeaning: 'Mempercayai' },
        ],
    },
    {
        id: 'xingsheng',
        badge: 'Kategori 4 · 形声 Xíngshēng (80%+ Hanzi)',
        title: 'Fono-Semantik (Radikal Makna + Komponen Bunyi)',
        formula: 'Radikal Kategori Makna + Komponen Petunjuk Pelafalan',
        description: 'Mencakup lebih dari 80% kosakata Mandarin modern: satu bagian memberi petunjuk bidang makna, bagian lain memberi petunjuk bunyi.',
        items: [
            { id: 'ls-xs-ma', glyph: '妈', reading: 'mā', meaning: 'Ibu', strokeInfo: '6 guratan (女 makna + 马 bunyi)', origin: 'Radikal perempuan (女) menunjukkan makna + kuda (马 mǎ) memberi petunjuk bunyi mā.', mnemonic: 'Perempuan 女 yang berbunyi seperti 马 (mǎ) = ibu (mā).', exampleWord: '妈妈 (māma)', exampleMeaning: 'Mama / Ibu' },
            { id: 'ls-xs-he', glyph: '河', reading: 'hé', meaning: 'Sungai', strokeInfo: '8 guratan (氵 makna air + 可 bunyi)', origin: 'Radikal tiga tetes air (氵) menunjukkan makna air + 可 (kě) memberi petunjuk bunyi.', mnemonic: 'Air 氵 + 可 = sungai (hé).', exampleWord: '黄河 (Huáng Hé)', exampleMeaning: 'Sungai Kuning' },
            { id: 'ls-xs-yu', glyph: '语', reading: 'yǔ', meaning: 'Bahasa / Ucapan', strokeInfo: '9 guratan (讠 makna ucapan + 吾 bunyi)', origin: 'Radikal ucapan (讠) menunjukkan makna bahasa + 吾 (wú) memberi petunjuk bunyi.', mnemonic: 'Ucapan 讠 + 吾 = bahasa (yǔ).', exampleWord: '汉语 (Hànyǔ)', exampleMeaning: 'Bahasa Mandarin' },
            { id: 'ls-xs-qing', glyph: '清', reading: 'qīng', meaning: 'Jernih / Bersih', strokeInfo: '11 guratan (氵 makna air + 青 bunyi)', origin: 'Radikal air (氵) sebagai makna + 青 (qīng) memberi bunyi persis qīng.', mnemonic: 'Air 氵 yang berwarna biru-hijau 青 = air jernih.', exampleWord: '清楚 (qīngchu)', exampleMeaning: 'Jelas / Terang' },
            { id: 'ls-xs-wen', glyph: '问', reading: 'wèn', meaning: 'Bertanya', strokeInfo: '6 guratan (门 bunyi + 口 makna mulut)', origin: 'Pintu (门 mén) memberi petunjuk bunyi + mulut (口) di dalam pintu untuk bertanya.', mnemonic: 'Mulut 口 di balik pintu 门 = mengetuk dan bertanya.', exampleWord: '问题 (wèntí)', exampleMeaning: 'Pertanyaan / Masalah' },
        ],
    },
    {
        id: 'zhuanzhu',
        badge: 'Kategori 5 · 转注 Zhuǎnzhù',
        title: 'Transformasi / Pendorongan Makna Serumpun',
        formula: 'Akar Makna & Radikal Sama → Pasangan Karakter Saling Menjelaskan',
        description: 'Karakter-karakter yang berbagi radikal dan medan makna yang sama serta saling menafsirkan dalam tradisi filologi Shuōwén Jiězì.',
        items: [
            { id: 'ls-zz-lao', glyph: '老', reading: 'lǎo', meaning: 'Tua / Berpengalaman / Guru', strokeInfo: '6 guratan (radikal 耂 + 匕)', origin: 'Orang tua berambut panjang bertumpu pada tongkat; berpasangan langsung dengan 考 (kǎo).', mnemonic: 'Orang tua bertongkat yang dihormati sebagai guru (老师).', exampleWord: '老师 (lǎoshī)', exampleMeaning: 'Guru' },
            { id: 'ls-zz-kao', glyph: '考', reading: 'kǎo', meaning: 'Usia Lanjut / Menguji / Meneliti', strokeInfo: '6 guratan (radikal 耂 + 丂)', origin: 'Berbagi akar radikal yang sama dengan 老 (lǎo); berkembang dari makna sesepuh menjadi menguji kebijaksanaan.', mnemonic: 'Berbagi atap radikal 耂 dengan 老 = ujian kebijaksanaan.', exampleWord: '考试 (kǎoshì)', exampleMeaning: 'Ujian' },
            { id: 'ls-zz-qiao', glyph: '窍', reading: 'qiào', meaning: 'Lubang / Inti / Celah Akal', strokeInfo: '10 guratan (穴 atas + 巧 bawah)', origin: 'Berbagi medan makna rongga/lubang dengan 空 (kōng) di bawah radikal gua (穴).', mnemonic: 'Gua 穴 yang terampil 巧 = celah kunci pemahaman.', exampleWord: '诀窍 (juéqiào)', exampleMeaning: 'Kiat jitu / Rahasia trik' },
            { id: 'ls-zz-kong', glyph: '空', reading: 'kōng', meaning: 'Kosong / Langit / Ruang', strokeInfo: '8 guratan (穴 atas + 工 bawah)', origin: 'Radikal gua (穴) + pekerjaan (工) melambangkan ruang kosong yang digali; berpasangan dengan 窍.', mnemonic: 'Gua 穴 yang digali 工 = ruang kosong.', exampleWord: '天空 (tiānkōng)', exampleMeaning: 'Langit' },
        ],
    },
    {
        id: 'jiajie',
        badge: 'Kategori 6 · 假借 Jiǎjiè',
        title: 'Pinjaman Fonetik (Kata Abstrak Meminjam Karakter Homofon)',
        formula: 'Konsep Sulit Digambar → Pinjam Karakter yang Bunyinya Sama',
        description: 'Ketika suatu kata (seperti kata ganti, kata bantu, atau konsep abstrak) sulit digambar, penutur meminjam karakter lain yang bunyinya identik atau mirip.',
        items: [
            { id: 'ls-jj-lai', glyph: '来', reading: 'lái', meaning: 'Datang / Tiba', strokeInfo: '7 guratan', origin: 'Awalnya piktogram tanaman gandum (麦); dipinjam karena bunyinya sama dengan kata kerja "datang" (lái).', mnemonic: 'Gandum yang dibawa pulang ke rumah = datang (lái).', exampleWord: '来到 (láidào)', exampleMeaning: 'Tiba / Datang ke' },
            { id: 'ls-jj-wo', glyph: '我', reading: 'wǒ', meaning: 'Saya / Aku', strokeInfo: '7 guratan', origin: 'Awalnya gambar senjata tombak bergerigi; dipinjam secara fonetik untuk kata ganti orang pertama "saya".', mnemonic: 'Tangan memegang tombak menjaga diri sendiri = aku (wǒ).', exampleWord: '我们 (wǒmen)', exampleMeaning: 'Kami / Kita' },
            { id: 'ls-jj-zi', glyph: '自', reading: 'zì', meaning: 'Diri Sendiri / Dari', strokeInfo: '6 guratan', origin: 'Awalnya piktogram hidung (orang menunjuk hidungnya saat menyebut diri sendiri); dipinjam untuk makna "diri / dari".', mnemonic: 'Menunjuk hidung sendiri = diri sendiri (zì).', exampleWord: '自己 (zìjǐ)', exampleMeaning: 'Diri sendiri' },
            { id: 'ls-jj-wan', glyph: '万', reading: 'wàn', meaning: 'Sepuluh Ribu (10.000)', strokeInfo: '3 guratan', origin: 'Awalnya piktogram kalajengking; dipinjam secara fonetik untuk bilangan 10.000.', mnemonic: 'Tiga guratan ringkas untuk angka besar 10.000.', exampleWord: '一万 (yī wàn)', exampleMeaning: 'Sepuluh ribu' },
        ],
    },
];

/* ============================================================================
   3. BAHASA KOREA: ENSIKLOPEDIA JAMO HANGEUL & BLOK SUKU KATA
   ============================================================================ */
const KO_ENCYCLOPEDIA: CharacterEncyclopediaEntry[] = [
    { id: 'ko-g', glyph: 'ㄱ', secondaryGlyph: '가 / 각', reading: 'g / k (Giyeok 기역)', meaning: 'Konsonan Dasar Velar', strokeInfo: '1 guratan (horizontal kiri-kanan berbelok turun vertikal)', origin: 'Diciptakan Raja Sejong (1443) meniru bentuk pangkal lidah yang menyentuh langit-langit lunak.', mnemonic: 'Bentuk sudut siku lidah bagian belakang saat mengucapkan "g/k".', exampleWord: '가방 (gabang)', exampleMeaning: 'Tas' },
    { id: 'ko-n', glyph: 'ㄴ', secondaryGlyph: '나 / 난', reading: 'n (Nieun 니은)', meaning: 'Konsonan Dasar Alveolar', strokeInfo: '1 guratan (vertikal turun berbelok horizontal ke kanan)', origin: 'Meniru bentuk ujung lidah yang menempel pada gusi atas bagian depan.', mnemonic: 'Kebalikan dari ㄱ; ujung lidah menyentuh lantai mulut bagian depan.', exampleWord: '나라 (nara)', exampleMeaning: 'Negara' },
    { id: 'ko-d', glyph: 'ㄷ', secondaryGlyph: '다 / 닫', reading: 'd / t (Digeut 디귿)', meaning: 'Konsonan Aspirasi-Ringan Alveolar', strokeInfo: '2 guratan (horizontal atas → vertikal melengkung ke kanan)', origin: 'Pengembangan dari ㄴ dengan tambahan garis atap untuk menunjukkan letupan lidah lebih kuat.', mnemonic: 'Seperti pintu ("door" / d) yang terbuka ke kanan.', exampleWord: '다리 (dari)', exampleMeaning: 'Kaki / Jembatan' },
    { id: 'ko-r', glyph: 'ㄹ', secondaryGlyph: '라 / 달', reading: 'r / l (Rieul 리을)', meaning: 'Konsonan Likuid / Getar Ringan', strokeInfo: '3 guratan (sudut atas → tengah → sudut bawah)', origin: 'Menggambarkan lidah yang melengkung bergetar di langit-langit mulut.', mnemonic: 'Bentuk ular melingkar ("rattlesnake" / r-l).', exampleWord: '라면 (ramyeon)', exampleMeaning: 'Mi instan Korea' },
    { id: 'ko-m', glyph: 'ㅁ', secondaryGlyph: '마 / 밤', reading: 'm (Mieum 미음)', meaning: 'Konsonan Bilabial Sengau', strokeInfo: '3 guratan (vertikal kiri → sudut atas-kanan → tutup bawah)', origin: 'Meniru bentuk dua bibir yang tertutup rapat (juga identik dengan radikal mulut 口).', mnemonic: 'Bentuk mulut tertutup rapat saat bergumam "mmm".', exampleWord: '마음 (maeum)', exampleMeaning: 'Hati / Perasaan' },
    { id: 'ko-b', glyph: 'ㅂ', secondaryGlyph: '바 / 밥', reading: 'b / p (Bieup 비읍)', meaning: 'Konsonan Letup Bilabial', strokeInfo: '4 guratan (vertikal kiri → vertikal kanan → tengah → bawah)', origin: 'Pengembangan dari mulut (ㅁ) dengan dua sisi ke atas yang melepaskan letupan bibir.', mnemonic: 'Ember ("bucket" / b) berisi air.', exampleWord: '바다 (bada)', exampleMeaning: 'Laut' },
    { id: 'ko-s', glyph: 'ㅅ', secondaryGlyph: '사 / 옷', reading: 's (Siot 시옷)', meaning: 'Konsonan Geser Gigi', strokeInfo: '2 guratan (miring kiri panjang → miring kanan cabang)', origin: 'Meniru bentuk gigi seri tempat aliran udara mendesis keluar.', mnemonic: 'Bentuk gigi tajam atau atap rumah ("shelter" / s).', exampleWord: '사람 (saram)', exampleMeaning: 'Orang / Manusia' },
    { id: 'ko-ng', glyph: 'ㅇ', secondaryGlyph: '아 / 강', reading: '∅ awal / ng batchim (Ieung 이응)', meaning: 'Konsonan Tenggorokan (Glotal)', strokeInfo: '1 guratan (lingkaran penuh berlawanan arah jarum jam)', origin: 'Meniru bentuk tenggorokan yang terbuka bulat; tidak berbunyi di awal suku kata, berbunyi "-ng" di akhir (batchim).', mnemonic: 'Lingkaran kosong "0" = tidak berbunyi di depan, berbunyi "ng" di bawah.', exampleWord: '아이 (ai)', exampleMeaning: 'Anak' },
    { id: 'ko-a', glyph: 'ㅏ', secondaryGlyph: '아 / 가', reading: 'a (Vokal Terang Yang)', strokeInfo: '2 guratan (vertikal panjang → garis pendek ke kanan)', origin: 'Filosofi Cheon-Ji-In (天地人): Manusia berdiri (ㅣ) dengan Matahari (ㆍ) terbit di sebelah timur (kanan).', mnemonic: 'Titik menghadap ke kanan (arah matahari terbit) = bunyi terang "a".', exampleWord: '아버지 (abeoji)', exampleMeaning: 'Ayah' },
    { id: 'ko-eo', glyph: 'ㅓ', secondaryGlyph: '어 / 거', reading: 'eo (Vokal Gelap Yin)', strokeInfo: '2 guratan (garis pendek kiri → vertikal panjang)', origin: 'Filosofi Cheon-Ji-In: Matahari (ㆍ) berada di sebelah barat/dalam (kiri) dari manusia berdiri (ㅣ).', mnemonic: 'Titik menghadap ke dalam/kiri = bunyi dalam "eo" (seperti "o" pada "orang").', exampleWord: '어머니 (eomeoni)', exampleMeaning: 'Ibu' },
    { id: 'ko-o', glyph: 'ㅗ', secondaryGlyph: '오 / 고', reading: 'o (Vokal Terang Yang)', strokeInfo: '2 guratan (vertikal pendek atas → horizontal bumi)', origin: 'Filosofi Cheon-Ji-In: Matahari (ㆍ) terbit di atas garis Bumi datar (ㅡ).', mnemonic: 'Matahari naik di atas garis bumi = "o" bulat.', exampleWord: '오늘 (oneul)', exampleMeaning: 'Hari ini' },
    { id: 'ko-u', glyph: 'ㅜ', secondaryGlyph: '우 / 구', reading: 'u (Vokal Gelap Yin)', strokeInfo: '2 guratan (horizontal bumi → vertikal pendek ke bawah)', origin: 'Filosofi Cheon-Ji-In: Matahari (ㆍ) terbenam di bawah garis Bumi (ㅡ).', mnemonic: 'Air menetes ke bawah garis = "u".', exampleWord: '우유 (uyu)', exampleMeaning: 'Susu' },
];

/* ============================================================================
   4. BAHASA ARAB: 28 HURUF HIJAIYAH LENGKAP + HARAKAT
   ============================================================================ */
const AR_ENCYCLOPEDIA: CharacterEncyclopediaEntry[] = [
    { id: 'ar-alif', glyph: 'ا', secondaryGlyph: 'ا · ـا', reading: 'Alif (أَلِف)', meaning: 'Huruf Tegak & Penyangga Hamzah / Madd', strokeInfo: '1 guratan vertikal dari atas ke bawah (tidak menyambung ke kiri)', origin: 'Berasal dari aksara Nabatea & Fenisia (ʾālep); berfungsi sebagai pemanjang vokal ā atau kursi Hamzah.', mnemonic: 'Tiang tegak lurus berdiri sendiri.', exampleWord: 'أَبٌ (abun)', exampleMeaning: 'Ayah' },
    { id: 'ar-ba', glyph: 'ب', secondaryGlyph: 'بـ · ـبـ · ـب', reading: 'Bāʾ (بَاء)', meaning: 'Konsonan Bilabial Letup', strokeInfo: '1 mangkuk datar dari kanan ke kiri + 1 titik di bawah', origin: 'Bentuk perahu dengan satu titik di bawah sebagai pembeda dari Tāʾ dan Thāʾ.', mnemonic: 'Satu titik di Bawah = Bāʾ.', exampleWord: 'بَيْتٌ (baytun)', exampleMeaning: 'Rumah' },
    { id: 'ar-ta', glyph: 'ت', secondaryGlyph: 'تـ · ـتـ · ـت', reading: 'Tāʾ (تَاء)', meaning: 'Konsonan Alveolar Letup', strokeInfo: '1 mangkuk datar + 2 titik sejajar di atas', origin: 'Berbagi kerangka mangkuk dengan Bāʾ dan Thāʾ; dibedakan dengan dua titik di atas.', mnemonic: 'Dua mata di aTas = Tāʾ.', exampleWord: 'تُفَّاحٌ (tuffāḥun)', exampleMeaning: 'Apel' },
    { id: 'ar-tha', glyph: 'ث', secondaryGlyph: 'ثـ · ـثـ · ـث', reading: 'Thāʾ (ثَاء)', meaning: 'Konsonan Interdental Geser (ujung lidah)', strokeInfo: '1 mangkuk datar + 3 titik segitiga di atas', origin: 'Ujung lidah menyentuh ujung gigi seri atas (mirip bunyi "th" pada kata "think").', mnemonic: 'Tiga titik (Three) di atas = Thāʾ.', exampleWord: 'ثَوْبٌ (thawbun)', exampleMeaning: 'Pakaian' },
    { id: 'ar-jim', glyph: 'ج', secondaryGlyph: 'جـ · ـجـ · ـج', reading: 'Jīm (جِيم)', meaning: 'Konsonan Palatal (Tengah Lidah)', strokeInfo: '1 lengkungan paruh atas + perut besar ke bawah + 1 titik di dalam', origin: 'Kerangka kembar dengan Ḥāʾ dan Khāʾ; titik berada tepat di rongga perut huruf.', mnemonic: 'Titik di dalam perut = Jīm.', exampleWord: 'جَمَلٌ (jamalun)', exampleMeaning: 'Unta' },
    { id: 'ar-ha', glyph: 'ح', secondaryGlyph: 'حـ · ـحـ · ـح', reading: 'Ḥāʾ (حَاء)', meaning: 'Konsonan Tenggorokan Tengah (Pedas/Bersih)', strokeInfo: '1 lengkungan paruh atas + perut besar tanpa titik', origin: 'Keluar dari tengah tenggorokan (Al-Ḥalq) dengan hembusan udara bersih tanpa getaran.', mnemonic: 'Polos tanpa titik (Hampa titik) = Ḥāʾ.', exampleWord: 'حَلِيبٌ (ḥalībun)', exampleMeaning: 'Susu' },
    { id: 'ar-kha', glyph: 'خ', secondaryGlyph: 'خـ · ـخـ · ـخ', reading: 'Khāʾ (خَاء)', meaning: 'Konsonan Tenggorokan Atas', strokeInfo: '1 lengkungan paruh atas + perut besar + 1 titik di atas kepala', origin: 'Keluar dari ujung tenggorokan bagian atas dengan gesekan ringan.', mnemonic: 'Satu titik di atas Kepala = Khāʾ.', exampleWord: 'خُبْزٌ (khubzun)', exampleMeaning: 'Roti' },
    { id: 'ar-dal', glyph: 'د', secondaryGlyph: 'د · ـد', reading: 'Dāl (دَال)', meaning: 'Konsonan Alveolar (Non-Sambung Kiri)', strokeInfo: '1 sudut melengkung dari atas ke kiri bawah (tanpa titik)', origin: 'Termasuk 6 huruf yang hanya menyambung dari kanan (ا د ذ ر ز و).', mnemonic: 'Sudut duduk tanpa titik = Dāl.', exampleWord: 'دَرْسٌ (darsun)', exampleMeaning: 'Pelajaran' },
    { id: 'ar-sin', glyph: 'س', secondaryGlyph: 'سـ · ـسـ · ـس', reading: 'Sīn (سِين)', meaning: 'Konsonan Desis Tipis', strokeInfo: '3 gigi kecil dari kanan ke kiri + mangkuk besar ke bawah', origin: 'Keluar dari ujung lidah dan dinding gigi seri bawah dengan bunyi tipis (Tarqīq).', mnemonic: 'Tiga gigi gergaji tanpa titik = Sīn.', exampleWord: 'سَمَاءٌ (samāʾun)', exampleMeaning: 'Langit' },
    { id: 'ar-shin', glyph: 'ش', secondaryGlyph: 'شـ · ـشـ · ـش', reading: 'Shīn (شِين)', meaning: 'Konsonan Palatal Menyebar (Tafashshī)', strokeInfo: '3 gigi kecil + mangkuk besar + 3 titik di atas', origin: 'Angin menyebar di tengah langit-langit mulut dengan tiga titik di atas gigi huruf.', mnemonic: 'Sīn dengan 3 percikan titik di atas = Shīn.', exampleWord: 'شَمْسٌ (shamsun)', exampleMeaning: 'Matahari' },
    { id: 'ar-ayn', glyph: 'ع', secondaryGlyph: 'عـ · ـعـ · ـع', reading: 'ʿAyn (عَيْن)', meaning: 'Konsonan Tenggorokan Tengah Dalam', strokeInfo: 'Lengkungan kepala kecil + perut besar ke bawah (tanpa titik)', origin: 'Berasal dari piktogram mata; diucapkan dengan menekan otot tengah tenggorokan.', mnemonic: 'Kepala kecil terbuka ke kanan tanpa titik = ʿAyn.', exampleWord: 'عِلْمٌ (ʿilmun)', exampleMeaning: 'Ilmu pengetahuan' },
    { id: 'ar-qaf', glyph: 'ق', secondaryGlyph: 'قـ · ـقـ · ـق', reading: 'Qāf (قَاف)', meaning: 'Konsonan Uvular Tebal (Qalqalah)', strokeInfo: 'Kepala bulat + mangkuk dalam ke bawah + 2 titik di atas', origin: 'Pangkal lidah paling belakang menyentuh langit-langit lunak dengan pantulan kuat.', mnemonic: 'Dua titik di atas kepala bulat = Qāf.', exampleWord: 'قَلَمٌ (qalamun)', exampleMeaning: 'Pena' },
];

/* ============================================================================
   5. BAHASA INGGRIS: 26 ALFABET FONETIK & ORTOGRAFI
   ============================================================================ */
const EN_ENCYCLOPEDIA: CharacterEncyclopediaEntry[] = [
    { id: 'en-a', glyph: 'Aa', reading: '/eɪ/ (nama huruf) · /æ/ /eɪ/ /ɑː/', meaning: 'Vokal Utama Pertama', strokeInfo: 'Kapital: 3 guratan segitiga · Kecil: 1 lengkungan + 1 batang', origin: 'Berasal dari piktogram kepala lembu (Aleph) yang diputar 180 derajat oleh bangsa Yunani menjadi Alpha.', mnemonic: 'Puncak segitiga huruf A menyerupai tanduk lembu.', exampleWord: 'apple', exampleMeaning: 'Apel (/ˈæp.əl/)' },
    { id: 'en-c', glyph: 'Cc', reading: '/siː/ · Hard /k/ & Soft /s/', meaning: 'Konsonan Ganda (K / S)', strokeInfo: '1 guratan melengkung terbuka ke kanan', origin: 'Berasal dari Gimel (unta); sebelum e/i/y dibaca lembut /s/ (city), selainnya dibaca keras /k/ (cat).', mnemonic: 'C + e/i/y = lembut /s/ (cinema); C + a/o/u = keras /k/ (camera).', exampleWord: 'city', exampleMeaning: 'Kota (/ˈsɪt.i/)' },
    { id: 'en-g', glyph: 'Gg', reading: '/dʒiː/ · Hard /ɡ/ & Soft /dʒ/', meaning: 'Konsonan Velar / Palatal', strokeInfo: 'Kapital: lengkungan C + palang dalam · Kecil: lingkaran + kait bawah', origin: 'Diciptakan bangsa Romawi dengan menambah garis palang pada C untuk membedakan bunyi /ɡ/ dari /k/.', mnemonic: 'G + a/o/u = keras /ɡ/ (garden); G + e/i/y = lembut /dʒ/ (giant).', exampleWord: 'garden', exampleMeaning: 'Taman (/ˈɡɑːr.dən/)' },
    { id: 'en-h', glyph: 'Hh', reading: '/eɪtʃ/ · Hembusan Glotal /h/', meaning: 'Konsonan Frikatif Glotal', strokeInfo: 'Kapital: 3 guratan · Kecil: 1 vertikal tinggi + 1 lengkungan', origin: 'Berasal dari huruf Heth (pagar); sering menjadi huruf bisu (silent H) pada kata seperti "hour" dan "honest".', mnemonic: 'Bentuk tangga/pagar dua tiang.', exampleWord: 'house', exampleMeaning: 'Rumah (/haʊs/)' },
    { id: 'en-q', glyph: 'Qq', reading: '/kjuː/ · Digraf /kw/', meaning: 'Konsonan Berpasangan Wajib U', strokeInfo: 'Lingkaran penuh + ekor miring di kanan bawah', origin: 'Dalam ortografi bahasa Inggris asli, Q hampir selalu diikuti oleh huruf U membentuk gugus bunyi /kw/.', mnemonic: 'Q selalu menggandeng U seperti "Queen" dan "Question".', exampleWord: 'question', exampleMeaning: 'Pertanyaan (/ˈkwes.tʃən/)' },
    { id: 'en-r', glyph: 'Rr', reading: '/ɑːr/ · Aproksiman /ɹ/', meaning: 'Konsonan Retrofleks / Rhotic', strokeInfo: 'Kapital: 3 guratan · Kecil: 1 vertikal + 1 lengkungan bahu', origin: 'Dalam aksen Amerika (General American) R selalu diucapkan jelas, sedangkan di British (RP) R di akhir suku kata luluh memanjangkan vokal.', mnemonic: 'Ujung lidah melengkung ke atas tanpa menyentuh langit-langit.', exampleWord: 'river', exampleMeaning: 'Sungai (/ˈrɪv.ər/)' },
    { id: 'en-th', glyph: 'Th', reading: '/θ/ (nirsuara) & /ð/ (bersuara)', meaning: 'Digraf Interdental Khas Inggris', strokeInfo: 'Gabungan 2 huruf (T + H) mewakili 1 fonem tunggal', origin: 'Menggantikan huruf Inggris Kuno Þ (Thorn) dan Ð (Eth) setelah mesin cetak masuk ke Inggris.', mnemonic: 'Nirsuara /θ/ pada "think"; bersuara /ð/ pada "this".', exampleWord: 'thought', exampleMeaning: 'Pemikiran (/θɔːt/)' },
    { id: 'en-w', glyph: 'Ww', reading: '/ˈdʌb.əl.juː/ · Semivokal /w/', meaning: 'Konsonan Labio-Velar', strokeInfo: '4 guratan zig-zag menyambung', origin: 'Muncul pada abad pertengahan dari penulisan dua huruf U/V berdampingan ("double U").', mnemonic: 'Dua huruf V berdampingan membentuk gelombang air ("water").', exampleWord: 'water', exampleMeaning: 'Air (/ˈwɔː.tər/)' },
];

export const InteractiveScriptCharts: React.FC<InteractiveScriptChartsProps> = ({
    selectedLang,
}) => {
    const { speak, speakingKey } = useSpeechPronunciation();
    const [jpSubTab, setJpSubTab] = useState<'HIRAGANA' | 'KATAKANA' | 'KANJI'>('HIRAGANA');
    const [activeLiushuId, setActiveLiushuId] = useState<string>('xiangxing');

    const filterEntryFn = useCallback((item: CharacterEncyclopediaEntry, q: string) => {
        return (
            item.glyph.toLowerCase().includes(q) ||
            (item.secondaryGlyph?.toLowerCase().includes(q) ?? false) ||
            item.reading.toLowerCase().includes(q) ||
            (item.meaning?.toLowerCase().includes(q) ?? false) ||
            item.origin.toLowerCase().includes(q) ||
            item.mnemonic.toLowerCase().includes(q) ||
            item.exampleWord.toLowerCase().includes(q)
        );
    }, []);

    const renderEncyclopediaCards = (
        items: CharacterEncyclopediaEntry[],
        lang: LanguageCode,
        scriptClass: string,
        isRtl = false,
    ) => (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
                const key = `${lang}-script-${item.id}`;
                const isSpeaking = speakingKey === key;

                return (
                    <article
                        key={item.id}
                        className="veloa-surface-card flex flex-col justify-between gap-3.5 p-5"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                                <div
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                    lang={lang}
                                    className={`${scriptClass} flex h-14 min-w-14 items-center justify-center rounded-2xl bg-(--accent-primary-soft) px-3 text-2xl font-extrabold text-(--accent-primary)`}
                                >
                                    {item.glyph}
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-extrabold text-(--text-primary)">
                                            {item.meaning ?? item.exampleMeaning}
                                        </h3>
                                        {item.secondaryGlyph && (
                                            <span
                                                dir={isRtl ? 'rtl' : 'ltr'}
                                                className={`${scriptClass} rounded-md border border-(--border-subtle) bg-(--surface-elevated) px-2 py-0.5 text-xs font-bold text-(--text-secondary)`}
                                            >
                                                {item.secondaryGlyph}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 font-mono text-xs font-bold text-(--accent-primary)">
                                        {item.reading}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => speak(item.exampleWord.split(' ')[0] ?? item.glyph, lang, key)}
                                aria-label={`Lafalkan ${item.glyph}`}
                                className={`veloa-tactile-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${isSpeaking
                                    ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                    : 'border-(--border-subtle) bg-(--surface-elevated) text-(--accent-primary) hover:border-(--accent-primary)'
                                    }`}
                            >
                                <Volume2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/50 p-3 text-xs leading-relaxed">
                            <p className="text-(--text-primary)">
                                <strong className="text-(--accent-primary)">Urutan Guratan &amp; Cara Susun:</strong>{' '}
                                {item.strokeInfo}
                            </p>
                            <p className="text-(--text-secondary)">
                                <strong className="text-(--text-primary)">Asal-Usul &amp; Alasan Linguistik:</strong>{' '}
                                {item.origin}
                            </p>
                            <p className="rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-amber-900 dark:text-amber-200">
                                <strong>💡 Trik Hafalan:</strong> {item.mnemonic}
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-(--border-subtle) pt-2.5 text-xs">
                            <span className={`${scriptClass} font-bold text-(--text-primary)`}>
                                Contoh: {item.exampleWord}
                            </span>
                            <span className="text-(--text-muted)">{item.exampleMeaning}</span>
                        </div>
                    </article>
                );
            })}
        </div>
    );

    const activeLiushuCategory =
        ZH_LIUSHU_CATEGORIES.find((cat) => cat.id === activeLiushuId) ?? ZH_LIUSHU_CATEGORIES[0]!;

    return (
        <div className="space-y-6">
            {/* ====================================================================
          1. BAHASA JEPANG: HIRAGANA TERPISAH, KATAKANA TERPISAH & KANJI
         ==================================================================== */}
            {selectedLang === 'ja' && (
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-(--text-primary)">
                                Ensiklopedia Aksara Jepang (Hiragana, Katakana &amp; Kanji Terpisah)
                            </h2>
                            <p className="text-xs text-(--text-secondary)">
                                Setiap sistem aksara dipisahkan lengkap dengan urutan guratan, asal-usul Kanji
                                induknya, dan trik hafalan.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                            <button
                                type="button"
                                onClick={() => setJpSubTab('HIRAGANA')}
                                className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold ${jpSubTab === 'HIRAGANA'
                                    ? 'bg-(--accent-primary) text-white'
                                    : 'text-(--text-secondary)'
                                    }`}
                            >
                                <Grid className="h-3.5 w-3.5" />
                                <span>Tabel Hiragana ({JP_HIRAGANA_LIST.length})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setJpSubTab('KATAKANA')}
                                className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold ${jpSubTab === 'KATAKANA'
                                    ? 'bg-(--accent-primary) text-white'
                                    : 'text-(--text-secondary)'
                                    }`}
                            >
                                <Layers className="h-3.5 w-3.5" />
                                <span>Tabel Katakana ({JP_KATAKANA_LIST.length})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setJpSubTab('KANJI')}
                                className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold ${jpSubTab === 'KANJI'
                                    ? 'bg-(--accent-primary) text-white'
                                    : 'text-(--text-secondary)'
                                    }`}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>Bank Kanji ({JP_KANJI_LIST.length})</span>
                            </button>
                        </div>
                    </div>

                    {jpSubTab === 'HIRAGANA' && (
                        <PaginatedDataView
                            key="jp-hiragana-view"
                            data={JP_HIRAGANA_LIST}
                            pageSize={6}
                            itemLabel="huruf Hiragana"
                            searchPlaceholder="Cari Hiragana (romaji, bunyi, asal kanji, contoh)..."
                            filterFn={filterEntryFn}
                            renderItems={(items) => renderEncyclopediaCards(items, 'ja', 'veloa-script-ja')}
                        />
                    )}

                    {jpSubTab === 'KATAKANA' && (
                        <PaginatedDataView
                            key="jp-katakana-view"
                            data={JP_KATAKANA_LIST}
                            pageSize={6}
                            itemLabel="huruf Katakana"
                            searchPlaceholder="Cari Katakana (romaji, kata serapan, mnemonik)..."
                            filterFn={filterEntryFn}
                            renderItems={(items) => renderEncyclopediaCards(items, 'ja', 'veloa-script-ja')}
                        />
                    )}

                    {jpSubTab === 'KANJI' && (
                        <PaginatedDataView
                            key="jp-kanji-view"
                            data={JP_KANJI_LIST}
                            pageSize={6}
                            itemLabel="karakter Kanji"
                            searchPlaceholder="Cari Kanji (arti, on'yomi, kun'yomi, kosakata)..."
                            filterFn={filterEntryFn}
                            renderItems={(items) => renderEncyclopediaCards(items, 'ja', 'veloa-script-ja')}
                        />
                    )}
                </div>
            )}

            {/* ====================================================================
          2. BAHASA MANDARIN: 6 TABEL TERPISAH LIÙSHŪ (六书)
         ==================================================================== */}
            {selectedLang === 'zh' && (
                <div className="space-y-5">
                    <div className="veloa-surface-card space-y-4 p-5">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                                <Compass className="h-3.5 w-3.5" />
                                <span>6 Kategori Pembentukan Hanzi Klasik (六书 Liùshū)</span>
                            </div>
                            <h2 className="mt-2 text-lg font-extrabold text-(--text-primary)">
                                Ensiklopedia 6 Jenis Pembentukan Aksara Mandarin Terpisah
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                                Pilih salah satu dari 6 kategori <strong>Liùshū</strong> di bawah untuk mempelajari
                                asal-usul piktogram, ideogram, gabungan radikal, hingga pinjaman fonetik lengkap
                                dengan urutan guratan dan mnemonik.
                            </p>
                        </div>

                        {/* 6 Tab Kategori Liùshū Terpisah */}
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                            {ZH_LIUSHU_CATEGORIES.map((cat, idx) => {
                                const isSelected = cat.id === activeLiushuCategory.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveLiushuId(cat.id)}
                                        className={`veloa-tactile-btn flex flex-col items-start justify-between rounded-xl border p-3 text-start transition-all ${isSelected
                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white shadow-xs'
                                            : 'border-(--border-subtle) bg-(--surface-elevated)/60 text-(--text-primary) hover:border-(--accent-primary)'
                                            }`}
                                    >
                                        <span
                                            className={`font-mono text-[10px] font-bold ${isSelected ? 'text-white/85' : 'text-(--accent-primary)'
                                                }`}
                                        >
                                            0{idx + 1} · {cat.items.length} Hanzi
                                        </span>
                                        <span className="mt-1 line-clamp-1 text-xs font-extrabold">
                                            {cat.badge.replace(/^Kategori \d · /, '')}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Header Penjelasan Kategori Liùshū Aktif */}
                    <div className="rounded-2xl border border-(--border-strong) bg-(--accent-primary-soft) p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-base font-extrabold text-(--text-primary)">
                                {activeLiushuCategory.title}
                            </h3>
                            <span className="rounded-full bg-(--surface-card) px-3 py-1 font-mono text-xs font-bold text-(--accent-primary)">
                                {activeLiushuCategory.formula}
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">
                            {activeLiushuCategory.description}
                        </p>
                    </div>

                    {/* Tabel/Kartu Terpaginasi per Kategori Liùshū */}
                    <PaginatedDataView
                        key={`zh-liushu-${activeLiushuCategory.id}`}
                        data={activeLiushuCategory.items}
                        pageSize={4}
                        itemLabel={`karakter ${activeLiushuCategory.badge}`}
                        searchPlaceholder="Cari Hanzi, pinyin, arti, atau radikal..."
                        filterFn={filterEntryFn}
                        renderItems={(items) => renderEncyclopediaCards(items, 'zh', 'veloa-script-zh')}
                    />
                </div>
            )}

            {/* ====================================================================
          3. BAHASA KOREA: ENSIKLOPEDIA HANGEUL & FILOSOFI CHEON-JI-IN
         ==================================================================== */}
            {selectedLang === 'ko' && (
                <div className="space-y-5">
                    <div className="veloa-surface-card p-5">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Hunminjeongeum · Anatomi Artikulasi &amp; Cheon-Ji-In</span>
                        </div>
                        <h2 className="mt-2 text-lg font-extrabold text-(--text-primary)">
                            Ensiklopedia Jamo Hangeul, Asal Bentuk Organ Bicara &amp; Blok Suku Kata
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                            Setiap konsonan Hangeul dirancang berdasarkan posisi lidah, bibir, dan tenggorokan,
                            sedangkan vokal dibangun dari filosofi Langit (ㆍ), Bumi (ㅡ), dan Manusia (ㅣ).
                        </p>
                    </div>

                    <PaginatedDataView
                        key="ko-script-view"
                        data={KO_ENCYCLOPEDIA}
                        pageSize={6}
                        itemLabel="huruf Jamo Hangeul"
                        searchPlaceholder="Cari Jamo (ㄱ, ㅏ, nama huruf, contoh kata)..."
                        filterFn={filterEntryFn}
                        renderItems={(items) => renderEncyclopediaCards(items, 'ko', 'veloa-script-ko')}
                    />
                </div>
            )}

            {/* ====================================================================
          4. BAHASA ARAB: ENSIKLOPEDIA HIJAIYAH, MAKHRAJ & BENTUK SAMBUNG
         ==================================================================== */}
            {selectedLang === 'ar' && (
                <div className="space-y-5">
                    <div className="veloa-surface-card p-5">
                        <h2 className="text-lg font-extrabold text-(--text-primary)">
                            Ensiklopedia Huruf Hijaiyah, Makhraj &amp; Perubahan Bentuk Sambung
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                            Pelajari tempat keluar bunyi (<strong>Makhārij al-Ḥurūf</strong>), urutan penulisan
                            dari kanan ke kiri, serta trik membedakan huruf-huruf kembar bertitik.
                        </p>
                    </div>

                    <PaginatedDataView
                        key="ar-script-view"
                        data={AR_ENCYCLOPEDIA}
                        pageSize={6}
                        itemLabel="huruf Hijaiyah"
                        searchPlaceholder="Cari huruf Arab (Alif, Ba, Makhraj, contoh kata)..."
                        filterFn={filterEntryFn}
                        renderItems={(items) =>
                            renderEncyclopediaCards(items, 'ar', 'veloa-script-ar', true)
                        }
                    />
                </div>
            )}

            {/* ====================================================================
          5. BAHASA INGGRIS: FONETIK, DIGRAF & ORTOGRAFI ALFABET
         ==================================================================== */}
            {selectedLang === 'en' && (
                <div className="space-y-5">
                    <div className="veloa-surface-card p-5">
                        <h2 className="text-lg font-extrabold text-(--text-primary)">
                            Ensiklopedia Ortografi &amp; Fonetik Alfabet Inggris
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                            Pahami aturan perubahan bunyi huruf keras vs lembut (Hard/Soft C &amp; G), huruf bisu,
                            serta sejarah bentuk alfabet Latin.
                        </p>
                    </div>

                    <PaginatedDataView
                        key="en-script-view"
                        data={EN_ENCYCLOPEDIA}
                        pageSize={6}
                        itemLabel="huruf & digraf Inggris"
                        searchPlaceholder="Cari huruf Inggris (C, G, Th, aturan bunyi)..."
                        filterFn={filterEntryFn}
                        renderItems={(items) => renderEncyclopediaCards(items, 'en', '')}
                    />
                </div>
            )}
        </div>
    );
};
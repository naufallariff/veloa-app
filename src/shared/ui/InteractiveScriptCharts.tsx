// src/shared/ui/InteractiveScriptCharts.tsx
import React, { useState } from 'react';
import { BookOpen, Grid, Layers, Sparkles, Volume2 } from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';

interface InteractiveScriptChartsProps {
    selectedLang: LanguageCode;
}

/* ============================================================================
   1. DATA JEPANG: HIRAGANA & KATAKANA MATRIX + KANJI RADICAL/VOCAB CARDS
   ============================================================================ */
const JP_VOWELS = ['a', 'i', 'u', 'e', 'o'] as const;

const JP_GOJUON_ROWS: Array<{
    consonant: string;
    cells: Array<{ hira: string; kata: string; romaji: string } | null>;
}> = [
        {
            consonant: '∅ (Vokal)',
            cells: [
                { hira: 'あ', kata: 'ア', romaji: 'a' },
                { hira: 'い', kata: 'イ', romaji: 'i' },
                { hira: 'う', kata: 'ウ', romaji: 'u' },
                { hira: 'え', kata: 'エ', romaji: 'e' },
                { hira: 'お', kata: 'オ', romaji: 'o' },
            ],
        },
        {
            consonant: 'K (か行)',
            cells: [
                { hira: 'か', kata: 'カ', romaji: 'ka' },
                { hira: 'き', kata: 'キ', romaji: 'ki' },
                { hira: 'く', kata: 'ク', romaji: 'ku' },
                { hira: 'け', kata: 'ケ', romaji: 'ke' },
                { hira: 'こ', kata: 'コ', romaji: 'ko' },
            ],
        },
        {
            consonant: 'S (さ行)',
            cells: [
                { hira: 'さ', kata: 'サ', romaji: 'sa' },
                { hira: 'し', kata: 'シ', romaji: 'shi' },
                { hira: 'す', kata: 'ス', romaji: 'su' },
                { hira: 'せ', kata: 'セ', romaji: 'se' },
                { hira: 'そ', kata: 'ソ', romaji: 'so' },
            ],
        },
        {
            consonant: 'T (た行)',
            cells: [
                { hira: 'た', kata: 'タ', romaji: 'ta' },
                { hira: 'ち', kata: 'チ', romaji: 'chi' },
                { hira: 'つ', kata: 'ツ', romaji: 'tsu' },
                { hira: 'て', kata: 'テ', romaji: 'te' },
                { hira: 'と', kata: 'ト', romaji: 'to' },
            ],
        },
        {
            consonant: 'N (な行)',
            cells: [
                { hira: 'な', kata: 'ナ', romaji: 'na' },
                { hira: 'に', kata: 'ニ', romaji: 'ni' },
                { hira: 'ぬ', kata: 'ヌ', romaji: 'nu' },
                { hira: 'ね', kata: 'ネ', romaji: 'ne' },
                { hira: 'の', kata: 'ノ', romaji: 'no' },
            ],
        },
        {
            consonant: 'H (は行)',
            cells: [
                { hira: 'は', kata: 'ハ', romaji: 'ha' },
                { hira: 'ひ', kata: 'ヒ', romaji: 'hi' },
                { hira: 'ふ', kata: 'フ', romaji: 'fu' },
                { hira: 'へ', kata: 'ヘ', romaji: 'he' },
                { hira: 'ほ', kata: 'ホ', romaji: 'ho' },
            ],
        },
        {
            consonant: 'M (ま行)',
            cells: [
                { hira: 'ま', kata: 'マ', romaji: 'ma' },
                { hira: 'み', kata: 'ミ', romaji: 'mi' },
                { hira: 'む', kata: 'ム', romaji: 'mu' },
                { hira: 'め', kata: 'メ', romaji: 'me' },
                { hira: 'も', kata: 'モ', romaji: 'mo' },
            ],
        },
        {
            consonant: 'Y (や行)',
            cells: [
                { hira: 'や', kata: 'ヤ', romaji: 'ya' },
                null,
                { hira: 'ゆ', kata: 'ユ', romaji: 'yu' },
                null,
                { hira: 'よ', kata: 'ヨ', romaji: 'yo' },
            ],
        },
        {
            consonant: 'R (ら行)',
            cells: [
                { hira: 'ら', kata: 'ラ', romaji: 'ra' },
                { hira: 'り', kata: 'リ', romaji: 'ri' },
                { hira: 'る', kata: 'ル', romaji: 'ru' },
                { hira: 'れ', kata: 'レ', romaji: 're' },
                { hira: 'ろ', kata: 'ロ', romaji: 'ro' },
            ],
        },
        {
            consonant: 'W / N',
            cells: [
                { hira: 'わ', kata: 'ワ', romaji: 'wa' },
                null,
                { hira: 'ん', kata: 'ン', romaji: 'n' },
                null,
                { hira: 'を', kata: 'ヲ', romaji: 'wo' },
            ],
        },
        {
            consonant: 'G (が · Dakuon)',
            cells: [
                { hira: 'が', kata: 'ガ', romaji: 'ga' },
                { hira: 'ぎ', kata: 'ギ', romaji: 'gi' },
                { hira: 'ぐ', kata: 'グ', romaji: 'gu' },
                { hira: 'げ', kata: 'ゲ', romaji: 'ge' },
                { hira: 'ご', kata: 'ゴ', romaji: 'go' },
            ],
        },
        {
            consonant: 'Z (ざ · Dakuon)',
            cells: [
                { hira: 'ざ', kata: 'ザ', romaji: 'za' },
                { hira: 'じ', kata: 'ジ', romaji: 'ji' },
                { hira: 'ず', kata: 'ズ', romaji: 'zu' },
                { hira: 'ぜ', kata: 'ゼ', romaji: 'ze' },
                { hira: 'ぞ', kata: 'ゾ', romaji: 'zo' },
            ],
        },
        {
            consonant: 'D (だ · Dakuon)',
            cells: [
                { hira: 'だ', kata: 'ダ', romaji: 'da' },
                { hira: 'ぢ', kata: 'ヂ', romaji: 'ji' },
                { hira: 'づ', kata: 'ヅ', romaji: 'zu' },
                { hira: 'で', kata: 'デ', romaji: 'de' },
                { hira: 'ど', kata: 'ド', romaji: 'do' },
            ],
        },
        {
            consonant: 'B (ば · Dakuon)',
            cells: [
                { hira: 'ば', kata: 'バ', romaji: 'ba' },
                { hira: 'び', kata: 'ビ', romaji: 'bi' },
                { hira: 'ぶ', kata: 'ブ', romaji: 'bu' },
                { hira: 'べ', kata: 'ベ', romaji: 'be' },
                { hira: 'ぼ', kata: 'ボ', romaji: 'bo' },
            ],
        },
        {
            consonant: 'P (ぱ · Handakuon)',
            cells: [
                { hira: 'ぱ', kata: 'パ', romaji: 'pa' },
                { hira: 'ぴ', kata: 'ピ', romaji: 'pi' },
                { hira: 'ぷ', kata: 'プ', romaji: 'pu' },
                { hira: 'ぺ', kata: 'ペ', romaji: 'pe' },
                { hira: 'ぽ', kata: 'ポ', romaji: 'po' },
            ],
        },
    ];

const JP_KANJI_CARDS = [
    { kanji: '日', on: 'ニチ・ジツ', kun: 'ひ・か', meaning: 'Matahari / Hari', vocab: '日本 (Nihon · Jepang)' },
    { kanji: '月', on: 'ゲツ・ガツ', kun: 'つき', meaning: 'Bulan', vocab: '月曜日 (Getsuyōbi · Senin)' },
    { kanji: '水', on: 'スイ', kun: 'みず', meaning: 'Air', vocab: '水曜日 (Suiyōbi · Rabu)' },
    { kanji: '火', on: 'カ', kun: 'ひ', meaning: 'Api', vocab: '火山 (Kazan · Gunung Berapi)' },
    { kanji: '木', on: 'ボク・モク', kun: 'き', meaning: 'Pohon / Kayu', vocab: '木曜日 (Mokuyōbi · Kamis)' },
    { kanji: '金', on: 'キン・コン', kun: 'かね', meaning: 'Emas / Uang', vocab: 'お金 (Okane · Uang)' },
    { kanji: '土', on: 'ド・ト', kun: 'つち', meaning: 'Tanah', vocab: '土曜日 (Doyōbi · Sabtu)' },
    { kanji: '人', on: 'ジン・ニン', kun: 'ひと', meaning: 'Orang / Manusia', vocab: '日本人 (Nihonjin · Orang Jepang)' },
    { kanji: '学', on: 'ガク', kun: 'まな.ぶ', meaning: 'Belajar / Ilmu', vocab: '学生 (Gakusei · Pelajar)' },
    { kanji: '語', on: 'ゴ', kun: 'かた.る', meaning: 'Bahasa / Kata', vocab: '日本語 (Nihongo · Bahasa Jepang)' },
    { kanji: '食', on: 'ショク', kun: 'た.べる', meaning: 'Makan', vocab: '食事 (Shokuji · Makanan)' },
    { kanji: '見', on: 'ケン', kun: 'み.る', meaning: 'Melihat', vocab: '見学 (Kengaku · Observasi)' },
];

/* ============================================================================
   2. DATA KOREA: HANGEUL SYLLABLE FORMULA MATRIX (19 KONSONAN × 10 VOKAL)
   ============================================================================ */
const KO_VOWELS = [
    { jamo: 'ㅏ', rom: 'a' },
    { jamo: 'ㅑ', rom: 'ya' },
    { jamo: 'ㅓ', rom: 'eo' },
    { jamo: 'ㅕ', rom: 'yeo' },
    { jamo: 'ㅗ', rom: 'o' },
    { jamo: 'ㅛ', rom: 'yo' },
    { jamo: 'ㅜ', rom: 'u' },
    { jamo: 'ㅠ', rom: 'yu' },
    { jamo: 'ㅡ', rom: 'eu' },
    { jamo: 'ㅣ', rom: 'i' },
] as const;

const KO_CONSONANTS = [
    { jamo: 'ㄱ', rom: 'g/k', syllables: ['가', '갸', '거', '겨', '고', '교', '구', '규', '그', '기'] },
    { jamo: 'ㄴ', rom: 'n', syllables: ['나', '냐', '너', '녀', '노', '뇨', '누', '뉴', '느', '니'] },
    { jamo: 'ㄷ', rom: 'd/t', syllables: ['다', '댜', '더', '뎌', '도', '됴', '두', '듀', '드', '디'] },
    { jamo: 'ㄹ', rom: 'r/l', syllables: ['라', '랴', '러', '려', '로', '료', '루', '류', '르', '리'] },
    { jamo: 'ㅁ', rom: 'm', syllables: ['마', '먀', '머', '며', '모', '묘', '무', '뮤', '므', '미'] },
    { jamo: 'ㅂ', rom: 'b/p', syllables: ['바', '뱌', '버', '벼', '보', '뵤', '부', '뷰', '브', '비'] },
    { jamo: 'ㅅ', rom: 's', syllables: ['사', '샤', '서', '셔', '소', '쇼', '수', '슈', '스', '시'] },
    { jamo: 'ㅇ', rom: 'silent', syllables: ['아', '야', '어', '여', '오', '요', '우', '유', '으', '이'] },
    { jamo: 'ㅈ', rom: 'j', syllables: ['자', '쟈', '저', '져', '조', '죠', '주', '쥬', '즈', '지'] },
    { jamo: 'ㅊ', rom: 'ch', syllables: ['차', '챠', '처', '쳐', '초', '쵸', '추', '츄', '츠', '치'] },
    { jamo: 'ㅋ', rom: 'k', syllables: ['카', '캬', '커', '켜', '코', '쿄', '쿠', '큐', '크', '키'] },
    { jamo: 'ㅌ', rom: 't', syllables: ['타', '탸', '터', '텨', '토', '툐', '투', '튜', '트', '티'] },
    { jamo: 'ㅍ', rom: 'p', syllables: ['파', '퍄', '퍼', '펴', '포', '표', '푸', '퓨', '프', '피'] },
    { jamo: 'ㅎ', rom: 'h', syllables: ['하', '햐', '허', '혀', '호', '효', '후', '휴', '흐', '히'] },
    { jamo: 'ㄲ', rom: 'kk', syllables: ['까', '꺄', '꺼', '껴', '꼬', '꾜', '꾸', '뀨', '끄', '끼'] },
    { jamo: 'ㄸ', rom: 'tt', syllables: ['따', '땨', '떠', '뗘', '또', '뚀', '뚜', '뜌', '뜨', '띠'] },
    { jamo: 'ㅃ', rom: 'pp', syllables: ['빠', '뺘', '뻐', '뼈', '뽀', '뾰', '뿌', '쀼', '쁘', '삐'] },
    { jamo: 'ㅆ', rom: 'ss', syllables: ['싸', '쌰', '써', '쎠', '쏘', '쑈', '쑤', '쓔', '쓰', '씨'] },
    { jamo: 'ㅉ', rom: 'jj', syllables: ['짜', '쨔', '쩌', '쪄', '쪼', '쬬', '쭈', '쮸', '쯔', '찌'] },
];

/* ============================================================================
   3. DATA ARAB: 28 HURUF HIJAIYAH LENGKAP + TABEL HARAKAT
   ============================================================================ */
const AR_HIJAIYAH = [
    { name: 'Alif', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', makhraj: 'Rongga tenggorokan (Al-Jauf)' },
    { name: 'Bāʾ', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', makhraj: 'Dua bibir rapat' },
    { name: 'Tāʾ', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', makhraj: 'Ujung lidah & pangkal gigi seri atas' },
    { name: 'Thāʾ', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', makhraj: 'Ujung lidah & ujung gigi seri atas' },
    { name: 'Jīm', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', makhraj: 'Tengah lidah & langit-langit tengah' },
    { name: 'Ḥāʾ', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', makhraj: 'Tengah tenggorokan (bersih/pedas)' },
    { name: 'Khāʾ', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', makhraj: 'Ujung tenggorokan atas' },
    { name: 'Dāl', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', makhraj: 'Ujung lidah & pangkal gigi seri atas' },
    { name: 'Dhāl', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', makhraj: 'Ujung lidah & ujung gigi seri atas' },
    { name: 'Rāʾ', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', makhraj: 'Punggung ujung lidah & gusi atas' },
    { name: 'Zāy', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', makhraj: 'Ujung lidah & dinding gigi seri bawah' },
    { name: 'Sīn', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', makhraj: 'Ujung lidah & dinding gigi seri bawah' },
    { name: 'Shīn', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', makhraj: 'Tengah lidah & langit-langit' },
    { name: 'Ṣād', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', makhraj: 'Sīn tebal (Itbāq & Istiʿlāʾ)' },
    { name: 'Ḍād', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', makhraj: 'Sisi tepi lidah & gigi geraham atas' },
    { name: 'Ṭāʾ', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', makhraj: 'Tāʾ tebal (pangkal lidah terangkat)' },
    { name: 'Ẓāʾ', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', makhraj: 'Dhāl tebal (ujung lidah keluar sedikit)' },
    { name: 'ʿAyn', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', makhraj: 'Tengah tenggorokan (ditekan dalam)' },
    { name: 'Ghayn', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', makhraj: 'Ujung tenggorokan atas (bergetar)' },
    { name: 'Fāʾ', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', makhraj: 'Bibir bawah dalam & ujung gigi atas' },
    { name: 'Qāf', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', makhraj: 'Pangkal lidah paling belakang & langit lunak' },
    { name: 'Kāf', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', makhraj: 'Pangkal lidah sedikit di depan Qāf' },
    { name: 'Lām', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', makhraj: 'Tepi ujung lidah & gusi atas' },
    { name: 'Mīm', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', makhraj: 'Dua bibir tertutup lembut' },
    { name: 'Nūn', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', makhraj: 'Ujung lidah & gusi atas (dengan dengung)' },
    { name: 'Hāʾ', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه', makhraj: 'Pangkal tenggorokan paling bawah' },
    { name: 'Wāw', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', makhraj: 'Dua bibir membulat' },
    { name: 'Yāʾ', isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي', makhraj: 'Tengah lidah & langit-langit tengah' },
];

const AR_HARAKAT = [
    { name: 'Fatḥah (فَتْحَة)', mark: 'بَ', sound: 'ba (vokal "a" pendek terbuka)', role: 'Tanda vokal atas; juga penanda kasus Naṣb pada isim' },
    { name: 'Kasrah (كَسْرَة)', mark: 'بِ', sound: 'bi (vokal "i" pendek tajam)', role: 'Tanda vokal bawah; juga penanda kasus Jarr pada isim' },
    { name: 'Ḍammah (ضَمَّة)', mark: 'بُ', sound: 'bu (vokal "u" pendek bulat)', role: 'Tanda vokal melengkung atas; penanda kasus Rafʿ' },
    { name: 'Fatḥatain (تَنْوِين فَتْح)', mark: 'بًا', sound: 'ban (akhiran "-an")', role: 'Menandakan kata benda tak tentu (Nakirah) berakhiran -an' },
    { name: 'Kasratain (تَنْوِين كَسْر)', mark: 'بٍ', sound: 'bin (akhiran "-in")', role: 'Menandakan kata benda Nakirah dalam posisi Jarr' },
    { name: 'Ḍammatain (تَنْوِين ضَمّ)', mark: 'بٌ', sound: 'bun (akhiran "-un")', role: 'Menandakan kata benda Nakirah dalam posisi Rafʿ' },
    { name: 'Sukūn (سُكُون)', mark: 'بْ', sound: 'b (konsonan mati tanpa vokal)', role: 'Menghentikan bunyi vokal setelah huruf konsonan' },
    { name: 'Shaddah / Tasydīd (شَدَّة)', mark: 'بَّ', sound: 'bba (konsonan ganda ditekan)', role: 'Menggabungkan 2 huruf kembar (sukūn + berharakat)' },
];

/* ============================================================================
   4. DATA MANDARIN: PIKTOGRAM, IDEOGRAM, RADIKAL & RUMUS PENGGABUNGAN HANZI
   ============================================================================ */
const ZH_FORMATION_RULES = [
    {
        type: '1. Piktogram (象形 · Xiàngxíng)',
        formula: 'Gambar Benda Nyata → Garis Karakter Baku',
        examples: [
            { char: '日', pinyin: 'rì', meaning: 'Matahari (kotak dengan titik sinar di tengah)' },
            { char: '月', pinyin: 'yuè', meaning: 'Bulan sabit dengan dua garis bayangan' },
            { char: '山', pinyin: 'shān', meaning: 'Tiga puncak pegunungan menjulang' },
            { char: '水', pinyin: 'shuǐ', meaning: 'Aliran sungai utama dengan percikan air' },
        ],
    },
    {
        type: '2. Ideogram Sederhana (指事 · Zhǐshì)',
        formula: 'Simbol Abstrak + Penunjuk Arah/Posisi',
        examples: [
            { char: '上', pinyin: 'shàng', meaning: 'Atas (garis vertikal berdiri di atas garis dasar)' },
            { char: '下', pinyin: 'xià', meaning: 'Bawah (garis vertikal menggantung di bawah garis)' },
            { char: '本', pinyin: 'běn', meaning: 'Akar / Asal (pohon 木 diberi tanda garis di akarnya)' },
            { char: '末', pinyin: 'mò', meaning: 'Ujung / Akhir (pohon 木 diberi tanda di pucuk atas)' },
        ],
    },
    {
        type: '3. Ideogram Gabungan (会意 · Huìyì)',
        formula: 'Radikal Makna A + Radikal Makna B = Konsep Baru',
        examples: [
            { char: '好', pinyin: 'hǎo', meaning: '女 (perempuan) + 子 (anak) = Baik / Harmonis' },
            { char: '明', pinyin: 'míng', meaning: '日 (matahari) + 月 (bulan) = Terang / Jelas' },
            { char: '休', pinyin: 'xiū', meaning: '亻 (orang) + 木 (pohon) = Beristirahat' },
            { char: '林', pinyin: 'lín', meaning: '木 (pohon) + 木 (pohon) = Hutan / Rimbun' },
        ],
    },
    {
        type: '4. Fono-Semantik (形声 · Xíngshēng — 80%+ Hanzi)',
        formula: 'Radikal Kategori Makna + Komponen Petunjuk Bunyi',
        examples: [
            { char: '妈', pinyin: 'mā', meaning: '女 (perempuan = makna) + 马 (mǎ = bunyi) = Ibu' },
            { char: '河', pinyin: 'hé', meaning: '氵 (air = makna) + 可 (kě = bunyi) = Sungai' },
            { char: '语', pinyin: 'yǔ', meaning: '讠 (ucapan = makna) + 吾 (wú = bunyi) = Bahasa' },
            { char: '清', pinyin: 'qīng', meaning: '氵 (air = makna) + 青 (qīng = bunyi) = Jernih' },
        ],
    },
];

const ZH_CORE_VOCAB = [
    { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Halo / Apa kabar' },
    { hanzi: '谢谢', pinyin: 'xièxie', meaning: 'Terima kasih' },
    { hanzi: '学习', pinyin: 'xuéxí', meaning: 'Belajar / Mempelajari' },
    { hanzi: '中文', pinyin: 'Zhōngwén', meaning: 'Bahasa Mandarin' },
    { hanzi: '朋友', pinyin: 'péngyou', meaning: 'Teman / Sahabat' },
    { hanzi: '老师', pinyin: 'lǎoshī', meaning: 'Guru / Pengajar' },
    { hanzi: '学生', pinyin: 'xuésheng', meaning: 'Pelajar / Mahasiswa' },
    { hanzi: '今天', pinyin: 'jīntiān', meaning: 'Hari ini' },
    { hanzi: '明天', pinyin: 'míngtiān', meaning: 'Besok' },
    { hanzi: '时间', pinyin: 'shíjiān', meaning: 'Waktu' },
    { hanzi: '喜欢', pinyin: 'xǐhuan', meaning: 'Suka / Menyukai' },
    { hanzi: '明白', pinyin: 'míngbai', meaning: 'Mengerti / Paham' },
];

/* ============================================================================
   5. DATA INGGRIS: 26 ALFABET LENGKAP + CARA BACA & BUNYI FONETIK
   ============================================================================ */
const EN_ALPHABET = [
    { letter: 'Aa', name: 'ei', sound: 'æ (apple) · eɪ (cake)', example: 'apple' },
    { letter: 'Bb', name: 'bi', sound: 'b (bibir rapat)', example: 'book' },
    { letter: 'Cc', name: 'si', sound: 'k (cat) · s (city)', example: 'city' },
    { letter: 'Dd', name: 'di', sound: 'd (ujung lidah)', example: 'desk' },
    { letter: 'Ee', name: 'i', sound: 'e (bed) · iː (see)', example: 'elephant' },
    { letter: 'Ff', name: 'ef', sound: 'f (gigi atas + bibir)', example: 'forest' },
    { letter: 'Gg', name: 'ji', sound: 'ɡ (go) · dʒ (gym)', example: 'garden' },
    { letter: 'Hh', name: 'eich', sound: 'h (hembusan glotal)', example: 'house' },
    { letter: 'Ii', name: 'ai', sound: 'ɪ (sit) · aɪ (time)', example: 'island' },
    { letter: 'Jj', name: 'jei', sound: 'dʒ (letupan lembut)', example: 'journey' },
    { letter: 'Kk', name: 'kei', sound: 'k (pangkal lidah)', example: 'knowledge' },
    { letter: 'Ll', name: 'el', sound: 'l (light & dark L)', example: 'language' },
    { letter: 'Mm', name: 'em', sound: 'm (sengau bibir)', example: 'morning' },
    { letter: 'Nn', name: 'en', sound: 'n (sengau alveolar)', example: 'nature' },
    { letter: 'Oo', name: 'ou', sound: 'ɒ (hot) · oʊ (go)', example: 'ocean' },
    { letter: 'Pp', name: 'pi', sound: 'pʰ (aspirasi kuat)', example: 'paper' },
    { letter: 'Qq', name: 'kyu', sound: 'kw (selalu diikuti u)', example: 'question' },
    { letter: 'Rr', name: 'ar', sound: 'ɹ (lidah melengkung)', example: 'river' },
    { letter: 'Ss', name: 'es', sound: 's (sun) · z (roses)', example: 'science' },
    { letter: 'Tt', name: 'ti', sound: 'tʰ (aspirasi / flap)', example: 'teacher' },
    { letter: 'Uu', name: 'yu', sound: 'ʌ (cup) · juː (music)', example: 'universe' },
    { letter: 'Vv', name: 'vi', sound: 'v (getaran bibir-gigi)', example: 'voice' },
    { letter: 'Ww', name: 'dabelyu', sound: 'w (bibir membulat)', example: 'water' },
    { letter: 'Xx', name: 'eks', sound: 'ks (box) · gz (exam)', example: 'example' },
    { letter: 'Yy', name: 'wai', sound: 'j (yes) · i (happy)', example: 'yellow' },
    { letter: 'Zz', name: 'zi / zed', sound: 'z (mendengung)', example: 'zebra' },
];

export const InteractiveScriptCharts: React.FC<InteractiveScriptChartsProps> = ({
    selectedLang,
}) => {
    const { speak, speakingKey } = useSpeechPronunciation();
    const [jpSubTab, setJpSubTab] = useState<'KANA' | 'KANJI'>('KANA');
    const [arSubTab, setArSubTab] = useState<'HIJAIYAH' | 'HARAKAT'>('HIJAIYAH');

    return (
        <div className="space-y-6">
            {/* ====================================================================
          1. BAHASA JEPANG: HIRAGANA & KATAKANA MATRIX + KANJI CARDS
         ==================================================================== */}
            {selectedLang === 'ja' && (
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-(--text-primary)">
                                Tabel Rumus Aksara Jepang (Hiragana, Katakana & Kanji)
                            </h2>
                            <p className="text-xs text-(--text-secondary)">
                                Klik sel mana pun untuk mendengarkan pelafalan penutur asli Jepang.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                            <button
                                type="button"
                                onClick={() => setJpSubTab('KANA')}
                                className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold ${jpSubTab === 'KANA'
                                        ? 'bg-(--accent-primary) text-white'
                                        : 'text-(--text-secondary)'
                                    }`}
                            >
                                <Grid className="h-3.5 w-3.5" />
                                <span>Hiragana & Katakana (Gojūon)</span>
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
                                <span>Kartu Kanji & Kosakata</span>
                            </button>
                        </div>
                    </div>

                    {jpSubTab === 'KANA' ? (
                        <div className="veloa-surface-card overflow-x-auto p-4">
                            <table className="w-full min-w-135 border-collapse text-center">
                                <thead>
                                    <tr className="border-b border-(--border-subtle) bg-(--surface-elevated)">
                                        <th className="p-2.5 text-start text-xs font-extrabold text-(--text-muted)">
                                            Baris \ Vokal
                                        </th>
                                        {JP_VOWELS.map((v) => (
                                            <th
                                                key={v}
                                                className="p-2.5 font-mono text-sm font-extrabold uppercase text-(--accent-primary)"
                                            >
                                                {v}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-(--border-subtle)">
                                    {JP_GOJUON_ROWS.map((row) => (
                                        <tr key={row.consonant} className="hover:bg-(--surface-elevated)/40">
                                            <td className="p-2.5 text-start font-mono text-xs font-bold text-(--text-secondary)">
                                                {row.consonant}
                                            </td>
                                            {row.cells.map((cell, idx) => {
                                                if (!cell) {
                                                    return (
                                                        <td key={idx} className="p-2 text-xs text-(--text-muted)/40">
                                                            —
                                                        </td>
                                                    );
                                                }
                                                const key = `jp-kana-${cell.romaji}-${idx}`;
                                                const active = speakingKey === key;

                                                return (
                                                    <td key={idx} className="p-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => speak(cell.hira, 'ja', key, false)}
                                                            className={`flex min-h-14 w-full flex-col items-center justify-center rounded-xl border p-1.5 transition-all ${active
                                                                    ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                                    : 'border-(--border-subtle) bg-(--surface-card) hover:border-(--accent-primary)'
                                                                }`}
                                                        >
                                                            <div className="veloa-script-ja flex items-center gap-1.5 text-base font-extrabold">
                                                                <span>{cell.hira}</span>
                                                                <span className="opacity-45">/</span>
                                                                <span>{cell.kata}</span>
                                                            </div>
                                                            <span
                                                                className={`font-mono text-[11px] font-semibold ${active ? 'text-white' : 'text-(--accent-primary)'
                                                                    }`}
                                                            >
                                                                {cell.romaji}
                                                            </span>
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            {JP_KANJI_CARDS.map((item) => {
                                const key = `jp-kanji-${item.kanji}`;
                                return (
                                    <div
                                        key={item.kanji}
                                        className="veloa-surface-card flex items-start justify-between gap-3 p-4"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="veloa-script-ja flex h-12 w-12 items-center justify-center rounded-xl bg-(--accent-primary-soft) text-2xl font-extrabold text-(--accent-primary)">
                                                    {item.kanji}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-extrabold text-(--text-primary)">
                                                        {item.meaning}
                                                    </p>
                                                    <p className="text-xs text-(--text-secondary)">{item.vocab}</p>
                                                </div>
                                            </div>
                                            <div className="pt-1 text-[11px] text-(--text-muted)">
                                                <p>
                                                    <strong>On&apos;yomi:</strong> {item.on}
                                                </p>
                                                <p>
                                                    <strong>Kun&apos;yomi:</strong> {item.kun}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => speak(item.vocab.split(' ')[0] ?? item.kanji, 'ja', key)}
                                            aria-label={`Lafalkan ${item.kanji}`}
                                            className="veloa-tactile-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--accent-primary)"
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ====================================================================
          2. BAHASA KOREA: MATRIKS RUMUS SUKU KATA HANGEUL (KONSONAN × VOKAL)
         ==================================================================== */}
            {selectedLang === 'ko' && (
                <div className="space-y-5">
                    <div className="veloa-surface-card p-5">
                        <h2 className="text-lg font-extrabold text-(--text-primary)">
                            Rumus Pembentukan Blok Suku Kata Hangeul (Konsonan + Vokal)
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                            Hangeul tidak ditulis berderet seperti Latin, melainkan dirakit menjadi{' '}
                            <strong>Blok Suku Kata</strong>: Konsonan Awal (<strong>초성 Choseong</strong>) +
                            Vokal (<strong>중성 Jungseong</strong>) + opsional Konsonan Akhir (
                            <strong>종성 Batchim</strong>). Klik sel blok di bawah untuk mendengar bunyinya.
                        </p>
                    </div>

                    <div className="veloa-surface-card overflow-x-auto p-4">
                        <table className="w-full min-w-170 border-collapse text-center">
                            <thead>
                                <tr className="border-b border-(--border-subtle) bg-(--surface-elevated)">
                                    <th className="p-2 text-start text-xs font-extrabold text-(--text-muted)">
                                        Konsonan \ Vokal
                                    </th>
                                    {KO_VOWELS.map((v) => (
                                        <th key={v.jamo} className="p-2">
                                            <div className="veloa-script-ko text-sm font-extrabold text-(--text-primary)">
                                                {v.jamo}
                                            </div>
                                            <div className="font-mono text-[10px] font-bold text-(--accent-primary)">
                                                {v.rom}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-(--border-subtle)">
                                {KO_CONSONANTS.map((row) => (
                                    <tr key={row.jamo} className="hover:bg-(--surface-elevated)/35">
                                        <td className="p-2 text-start">
                                            <span className="veloa-script-ko font-extrabold text-(--text-primary)">
                                                {row.jamo}
                                            </span>{' '}
                                            <span className="font-mono text-[11px] text-(--text-muted)">({row.rom})</span>
                                        </td>
                                        {row.syllables.map((syl) => {
                                            const key = `ko-syl-${syl}`;
                                            const active = speakingKey === key;

                                            return (
                                                <td key={syl} className="p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => speak(syl, 'ko', key, false)}
                                                        className={`flex min-h-11 w-full items-center justify-center rounded-lg border text-sm font-bold transition-all ${active
                                                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                                : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--accent-primary)'
                                                            }`}
                                                    >
                                                        <span className="veloa-script-ko">{syl}</span>
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ====================================================================
          3. BAHASA ARAB: 28 HURUF HIJAIYAH LENGKAP & PENGHARAKATAN DETAIL
         ==================================================================== */}
            {selectedLang === 'ar' && (
                <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-(--text-primary)">
                                Tabel 28 Huruf Hijaiyah & Sistem Pengharakatan Arab
                            </h2>
                            <p className="text-xs text-(--text-secondary)">
                                Perubahan bentuk huruf (Terpisah, Awal, Tengah, Akhir) serta fungsi harakat vokal
                                dan Iʿrāb.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                            <button
                                type="button"
                                onClick={() => setArSubTab('HIJAIYAH')}
                                className={`veloa-tactile-btn rounded-lg px-3.5 text-xs font-bold ${arSubTab === 'HIJAIYAH'
                                        ? 'bg-(--accent-primary) text-white'
                                        : 'text-(--text-secondary)'
                                    }`}
                            >
                                28 Huruf Hijaiyah
                            </button>
                            <button
                                type="button"
                                onClick={() => setArSubTab('HARAKAT')}
                                className={`veloa-tactile-btn rounded-lg px-3.5 text-xs font-bold ${arSubTab === 'HARAKAT'
                                        ? 'bg-(--accent-primary) text-white'
                                        : 'text-(--text-secondary)'
                                    }`}
                            >
                                Pengharakatan Lengkap
                            </button>
                        </div>
                    </div>

                    {arSubTab === 'HIJAIYAH' ? (
                        <div className="veloa-surface-card overflow-x-auto p-4">
                            <table className="w-full min-w-145 border-collapse text-center">
                                <thead>
                                    <tr className="border-b border-(--border-subtle) bg-(--surface-elevated) text-xs font-extrabold text-(--text-muted)">
                                        <th className="p-2.5 text-start">Nama Huruf</th>
                                        <th className="p-2.5">Terpisah</th>
                                        <th className="p-2.5">Awal</th>
                                        <th className="p-2.5">Tengah</th>
                                        <th className="p-2.5">Akhir</th>
                                        <th className="p-2.5 text-start">Makhraj (Tempat Keluar Bunyi)</th>
                                        <th className="p-2.5">Audio</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-(--border-subtle)">
                                    {AR_HIJAIYAH.map((h) => {
                                        const key = `ar-hijaiyah-${h.name}`;
                                        return (
                                            <tr key={h.name} className="hover:bg-(--surface-elevated)/35">
                                                <td className="p-2.5 text-start text-xs font-bold text-(--text-primary)">
                                                    {h.name}
                                                </td>
                                                <td dir="rtl" lang="ar" className="veloa-script-ar p-2 text-xl font-bold">
                                                    {h.isolated}
                                                </td>
                                                <td dir="rtl" lang="ar" className="veloa-script-ar p-2 text-xl font-bold">
                                                    {h.initial}
                                                </td>
                                                <td dir="rtl" lang="ar" className="veloa-script-ar p-2 text-xl font-bold">
                                                    {h.medial}
                                                </td>
                                                <td dir="rtl" lang="ar" className="veloa-script-ar p-2 text-xl font-bold">
                                                    {h.final}
                                                </td>
                                                <td className="p-2.5 text-start text-xs text-(--text-secondary)">
                                                    {h.makhraj}
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => speak(`${h.isolated}َ`, 'ar', key)}
                                                        aria-label={`Lafalkan ${h.name}`}
                                                        className="veloa-tactile-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--accent-primary)"
                                                    >
                                                        <Volume2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            {AR_HARAKAT.map((hk) => {
                                const key = `ar-harakat-${hk.name}`;
                                return (
                                    <div
                                        key={hk.name}
                                        className="veloa-surface-card flex items-start justify-between gap-4 p-4"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    dir="rtl"
                                                    lang="ar"
                                                    className="veloa-script-ar flex h-12 w-12 items-center justify-center rounded-xl bg-(--accent-primary-soft) text-2xl font-extrabold text-(--accent-primary)"
                                                >
                                                    {hk.mark}
                                                </span>
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-(--text-primary)">
                                                        {hk.name}
                                                    </h3>
                                                    <p className="font-mono text-xs text-(--accent-primary)">{hk.sound}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs leading-relaxed text-(--text-secondary)">{hk.role}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => speak(hk.mark, 'ar', key)}
                                            aria-label={`Lafalkan ${hk.name}`}
                                            className="veloa-tactile-btn inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--accent-primary)"
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ====================================================================
          4. BAHASA MANDARIN: PIKTOGRAM, IDEOGRAM, RADIKAL & DAFTAR HANZI
         ==================================================================== */}
            {selectedLang === 'zh' && (
                <div className="space-y-6">
                    {/* Tahap 1: Piktogram, Ideogram & Rumus Penggabungan Radikal */}
                    <div className="space-y-4">
                        <div className="veloa-surface-card p-5">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                                <Layers className="h-3.5 w-3.5" />
                                <span>Tahap 1 · Anatomi & Rumus Pembentukan Hanzi (六书 Liùshū)</span>
                            </div>
                            <h2 className="mt-2 text-lg font-extrabold text-(--text-primary)">
                                Dari Piktogram & Ideogram Hingga Penggabungan Radikal
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                                Sebelum menghafal ribuan kosakata Mandarin, pahami terlebih dahulu 4 rumus utama
                                bagaimana gambar benda (<strong>Piktogram</strong>) dan simbol gagasan (
                                <strong>Ideogram</strong>) digabungkan menjadi karakter utuh.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {ZH_FORMATION_RULES.map((rule) => (
                                <div key={rule.type} className="veloa-surface-card space-y-3 p-5">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-(--text-primary)">{rule.type}</h3>
                                        <p className="mt-0.5 font-mono text-xs font-semibold text-(--accent-primary)">
                                            {rule.formula}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        {rule.examples.map((ex) => {
                                            const key = `zh-rule-${ex.char}`;
                                            return (
                                                <button
                                                    key={ex.char}
                                                    type="button"
                                                    onClick={() => speak(ex.char, 'zh', key)}
                                                    className="flex flex-col items-start rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/50 p-3 text-start transition-colors hover:border-(--accent-primary)"
                                                >
                                                    <div className="flex w-full items-center justify-between">
                                                        <span className="veloa-script-zh text-2xl font-extrabold text-(--text-primary)">
                                                            {ex.char}
                                                        </span>
                                                        <span className="font-mono text-xs font-bold text-(--accent-primary)">
                                                            {ex.pinyin}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] leading-snug text-(--text-secondary)">
                                                        {ex.meaning}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tahap 2: Daftar Kosakata Hanzi Terstruktur */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-(--accent-primary)" />
                            <h3 className="text-base font-extrabold text-(--text-primary)">
                                Tahap 2 · Daftar Kosakata Gabungan Hanzi Inti
                            </h3>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {ZH_CORE_VOCAB.map((v) => {
                                const key = `zh-vocab-${v.hanzi}`;
                                return (
                                    <button
                                        key={v.hanzi}
                                        type="button"
                                        onClick={() => speak(v.hanzi, 'zh', key)}
                                        className="veloa-surface-card veloa-tactile-btn flex items-center justify-between p-3.5 text-start hover:border-(--accent-primary)"
                                    >
                                        <div>
                                            <p className="veloa-script-zh text-lg font-extrabold text-(--text-primary)">
                                                {v.hanzi}
                                            </p>
                                            <p className="font-mono text-xs font-semibold text-(--accent-primary)">
                                                {v.pinyin}
                                            </p>
                                            <p className="mt-0.5 text-xs text-(--text-secondary)">{v.meaning}</p>
                                        </div>
                                        <Volume2 className="h-4 w-4 shrink-0 text-(--text-muted)" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ====================================================================
          5. BAHASA INGGRIS: 26 ALFABET LENGKAP + CARA BACA & CONTOH
         ==================================================================== */}
            {selectedLang === 'en' && (
                <div className="space-y-4">
                    <div className="veloa-surface-card p-5">
                        <h2 className="text-lg font-extrabold text-(--text-primary)">
                            Tabel 26 Alfabet Inggris Lengkap, Cara Baca Nama Huruf & Bunyi Fonetik
                        </h2>
                        <p className="mt-1 text-xs text-(--text-secondary) sm:text-sm">
                            Klik kartu huruf untuk mendengar pelafalan contoh kata dalam aksen standar Inggris
                            tanpa pembacaan simbol teknis.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {EN_ALPHABET.map((item) => {
                            const key = `en-alpha-${item.letter}`;
                            return (
                                <button
                                    key={item.letter}
                                    type="button"
                                    onClick={() => speak(item.example, 'en', key)}
                                    className="veloa-surface-card veloa-tactile-btn flex flex-col justify-between p-3.5 text-start hover:border-(--accent-primary)"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-extrabold text-(--text-primary)">
                                            {item.letter}
                                        </span>
                                        <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[11px] font-bold text-(--accent-primary)">
                                            /{item.name}/
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[11px] leading-snug text-(--text-secondary)">
                                        {item.sound}
                                    </p>
                                    <p className="mt-1.5 border-t border-(--border-subtle) pt-1.5 font-mono text-xs font-semibold text-(--text-primary)">
                                        🔊 {item.example}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
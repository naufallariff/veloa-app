// scripts/builders/grammar-ar.ts
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';

export const AR_GRAMMAR_MODULES: LessonModule[] = [
    // =========================================================================
    // MODUL 1: ILMU NAḤWU DASAR — JUMLAH ISMIYYAH, FI'LIYYAH & IDHĀFAH (A1–A2)
    // =========================================================================
    {
        id: 'ar-02-beg-nahwu-core-sentences',
        lang: 'ar',
        pillar: 'syntax',
        tier: 'beginner',
        order: 2,
        title: 'CEFR A1–A2 | Ilmu Naḥwu Dasar: Jumlah Ismiyyah, Jumlah Fi’liyyah, Idhāfah & Na’at',
        subtitle:
            'Bedah terpisah empat fondasi sintaksis bahasa Arab Fuṣḥā beserta hukum kesesuaian gender dan jumlah',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 1.1: JUMLAH ISMIYYAH --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.1 Jumlah Ismiyyah (الجملة الاسمية) — Mubtada’ & 3 Jenis Khabar',
                grammaticalTradition: 'Ilmu Naḥwu Unit 1/3: المبتدأ والخبر (Sintaksis Nomina Tanpa Kopula)',
                direction: 'rtl',
                columns: [
                    { key: 'polarity', roleLabel: 'Bentuk & Jenis Khabar', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus I’rāb & Kesesuaian', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-ism-mufrad',
                        cells: {
                            polarity: { script: 'خَبَر مُفْرَد (Khabar Tunggal)', gloss: 'Satu kata (bukan kalimat/preposisi)' },
                            formula: {
                                script: 'المُبْتَدَأ (مَعْرِفَة + مَرْفُوع ـُ) + الخَبَر (نَكِرَة + مَرْفُوع ـٌ)',
                                gloss: 'Wajib selaras dalam Gender (Mudzakkar/Mu’annats) & Jumlah (Mufrad/Mutsannā/Jamak)',
                            },
                            example: {
                                script: 'الطَّالِبُ مُجْتَهِدٌ. / الطَّالِبَةُ مُجْتَهِدَةٌ. / الطُّلَّابُ مُجْتَهِدُونَ.',
                                reading: 'Aṭ-ṭālibu mujtahidun. / Aṭ-ṭālibatu mujtahidatun. / Aṭ-ṭullābu mujtahidūna.',
                                gloss: 'Mahasiswa itu rajin. / Mahasiswi itu rajin. / Para mahasiswa itu rajin.',
                            },
                        },
                        fullTranslation: 'Mahasiswa itu rajin. / Mahasiswi itu rajin. / Para mahasiswa itu rajin.',
                    },
                    {
                        id: 'ar-ism-jumlah',
                        cells: {
                            polarity: { script: 'خَبَر جُمْلَة (Khabar Berupa Kalimat)', gloss: 'Fi’liyyah atau Ismiyyah dengan Dhamir Pengikat' },
                            formula: {
                                script: 'المُبْتَدَأ + [جُمْلَة فِعْلِيَّة / اسْمِيَّة تَحْتَوِي عَلَى ضَمِيرٍ رَابِطٍ]',
                                gloss: 'Wajib ada kata ganti (ـهُ / ـهَا) yang merujuk kembali ke Mubtada’',
                            },
                            example: {
                                script: 'المُبَرْمِجُ يَكْتُبُ الشِّيفْرَةَ. / الحَدِيقَةُ أَشْجَارُهَا عَالِيَةٌ.',
                                reading: 'Al-mubarmiju yaktubu asy-syīfrata. / Al-ḥadīqatu asyjāruhā ‘āliyatun.',
                                gloss: 'Programmer itu menulis kode. / Taman itu pepohonannya tinggi.',
                            },
                        },
                        fullTranslation: 'Programmer itu menulis kode. / Taman itu pepohonannya tinggi.',
                    },
                    {
                        id: 'ar-ism-syibh',
                        cells: {
                            polarity: { script: 'خَبَر شِبْهُ الجُمْلَة (Preposisi / Keterangan Tempat)', gloss: 'Jārr-Majrūr atau Ẓarf' },
                            formula: {
                                script: 'المُبْتَدَأ (مَعْرِفَة) + [حَرْفُ جَرٍّ / ظَرْفٌ + مَجْرُورٌ] (atau Khabar di depan jika Mubtada’ Nakirah)',
                                gloss: 'Jika Mubtada’ tidak memakai ال ("sebuah buku"), Khabar tempat WAJIB didahulukan',
                            },
                            example: {
                                script: 'الكِتَابُ عَلَى المَكْتَبِ. / عَلَى المَكْتَبِ كِتَابٌ.',
                                reading: 'Al-kitābu ‘alā al-maktabi. / ‘Alā al-maktabi kitābun.',
                                gloss: 'Buku itu ada di atas meja. / Di atas meja ada sebuah buku.',
                            },
                        },
                        fullTranslation: 'Buku itu ada di atas meja. / Di atas meja ada sebuah buku.',
                    },
                    {
                        id: 'ar-ism-laysa',
                        cells: {
                            polarity: { script: 'النَّفْيُ بِـ لَيْسَ (Negasi Kalimat Nominal)', gloss: 'Bukan / Tidak' },
                            formula: {
                                script: 'لَيْسَ / لَيْسَتْ + اسْمُ لَيْسَ (مَرْفُوع ـُ) + خَبَرُ لَيْسَ (مَنْصُوب ـًا)',
                                gloss: 'Laysa mengubah harakat akhir Khabar dari Ḍammah (-u) menjadi Fatḥah (-an)',
                            },
                            example: {
                                script: 'لَيْسَ النَّحْوُ صَعْبًا. / لَيْسَتِ المُشْكِلَةُ كَبِيرَةً.',
                                reading: 'Laysa an-naḥwu ṣa‘ban. / Laysati al-musykilatu kabīratan.',
                                gloss: 'Ilmu Naḥwu itu tidaklah sulit. / Masalah itu tidaklah besar.',
                            },
                        },
                        fullTranslation: 'Ilmu Naḥwu itu tidaklah sulit. / Masalah itu tidaklah besar.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bahasa Arab Tidak Memerlukan Kata "Adalah" di Masa Kini?',
                    psychologyExplanation:
                        'Menyandingkan kata benda definit (المُهَنْدِسُ = Insinyur itu) langsung dengan predikat indefinit (ذَكِيٌّ = cerdas) sudah mengikat keduanya menjadi kalimat sempurna ("Insinyur itu cerdas"). Jika keduanya sama-sama memakai ال (المُهَنْدِسُ الذَّكِيُّ), statusnya turun menjadi sekadar frasa ("Insinyur yang cerdas itu...").',
                    literalTrap:
                        'Jangan menerjemahkan kata "adalah" menjadi هُوَ kecuali untuk memisahkan dua kata yang sama-sama ma’rifah (اللّٰهُ هُوَ الحَقُّ).',
                },
            },

            // -------------------- UNIT 1.2: JUMLAH FI'LIYYAH --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.2 Jumlah Fi’liyyah (الجملة الفعلية) — Hukum VSO & Aturan Emas Fi’il Tunggal di Awal Kalimat',
                grammaticalTradition: 'Ilmu Naḥwu Unit 2/3: الفعل والفاعل والمفعول به (Sintaksis Verbal Klasik)',
                direction: 'rtl',
                columns: [
                    { key: 'slot', roleLabel: 'Komponen Kalimat', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus VSO & Harakat Akhir', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-fil-vso',
                        cells: {
                            slot: { script: 'فِعْل + فَاعِل + مَفْعُول بِهِ', reading: 'Fi’il + Fā’il + Maf’ūl Bih', gloss: 'Kata Kerja + Pelaku (-u) + Objek (-a)' },
                            formula: {
                                script: 'الفِعْلُ (مُفْرَدٌ دَائِمًا) + الفَاعِلُ (مَرْفُوعٌ ـُ) + المَفْعُولُ بِهِ (مَنْصُوبٌ ـَ)',
                                gloss: 'Harakat akhir menentukan siapa pelaku (-u) dan siapa objek (-a), bukan urutan kata!',
                            },
                            example: {
                                script: 'كَتَبَ المُهَنْدِسُونَ البَرْنَامَجَ.',
                                reading: 'Kataba al-muhandisūna al-barnāmaja.',
                                gloss: 'Para insinyur menulis program tersebut (كَتَبَ tetap tunggal walau pelakunya jamak!).',
                            },
                        },
                        fullTranslation: 'Para insinyur telah menulis program tersebut.',
                    },
                    {
                        id: 'ar-fil-gender',
                        cells: {
                            slot: { script: 'مُطَابَقَةُ التَّأْنِيثِ', reading: 'Kesesuaian Gender Fi’il & Fā’il', gloss: 'Mudzakkar vs Mu’annats' },
                            formula: {
                                script: 'Pelaku Perempuan: Fi’il Māḍī + تْ (ـَتْ) | Fi’il Muḍāri’ diawali تَـ',
                                gloss: 'Fi’il di awal kalimat hanya menyesuaikan GENDER pelaku, TIDAK menyesuaikan jumlahnya',
                            },
                            example: {
                                script: 'قَرَأَتِ الطَّالِبَاتُ الكِتَابَ. / تَقْرَأُ الطَّالِبَاتُ الكِتَابَ.',
                                reading: 'Qara’ati aṭ-ṭālibātu al-kitāba. / Taqra’u aṭ-ṭālibātu al-kitāba.',
                                gloss: 'Para mahasiswi membaca buku itu.',
                            },
                        },
                        fullTranslation: 'Para mahasiswi membaca buku tersebut.',
                    },
                ],
                nativeMindset: {
                    headline: 'Aturan Emas VSO: Mengapa Fi’il di Awal Kalimat Haram Dijamakkan?',
                    psychologyExplanation:
                        'Akhiran jamak pada kata kerja (seperti وا pada كَتَبُوا) berstatus sebagai kata ganti subjek ("mereka"). Jika kamu menulis "كَتَبُوا المُهَنْدِسُونَ", kalimat itu memiliki dua subjek sekaligus! Karena itu, saat pelaku disebutkan eksplisit setelah kata kerja, kata kerjanya wajib tetap tunggal (كَتَبَ المُهَنْدِسُونَ).',
                    literalTrap:
                        'SALAH: ذَهَبُوا الطُّلَّابُ إِلَى الجَامِعَةِ. BENAR: ذَهَبَ الطُّلَّابُ إِلَى الجَامِعَةِ.',
                },
            },

            // -------------------- UNIT 1.3: IDHĀFAH VS NA'AT-MAN'ŪT --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.3 Kontras Idhāfah (الإضافة — Kepemilikan) vs Na’at–Man’ūt (النعت — Frasa Sifat)',
                grammaticalTradition: 'Ilmu Naḥwu Unit 3/3: المضاف والمضاف إليه vs النعت والمنعوت',
                direction: 'rtl',
                columns: [
                    { key: 'construct', roleLabel: 'Konstruksi Frasa', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Harakat & Alif-Lām (ال)', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-idhafah',
                        cells: {
                            construct: { script: 'الإِضَافَة (Mudhāf + Mudhāf Ilayh)', gloss: 'Frasa Kepemilikan / Majemuk' },
                            formula: {
                                script: 'المُضَافُ (بِلَا ال وَبِلَا تَنْوِين) + المُضَافُ إِلَيْهِ (مَجْرُورٌ بِالكَسْرَةِ ـِ)',
                                gloss: 'Kata pertama HARAM memakai ال dan HARAM bertanwin; kata kedua wajib Majrūr (-i)',
                            },
                            example: {
                                script: 'بَابُ المَدْرَسَةِ / مِفْتَاحُ السَّيَّارَةِ / كِتَابُ اللُّغَةِ العَرَبِيَّةِ',
                                reading: 'Bābu al-madrasati / Miftāḥu as-sayyārati / Kitābu al-lughati al-‘arabiyyati',
                                gloss: 'Pintu sekolah / Kunci mobil / Buku bahasa Arab',
                            },
                        },
                        fullTranslation: 'Pintu sekolah / Kunci mobil / Buku bahasa Arab',
                    },
                    {
                        id: 'ar-naat',
                        cells: {
                            construct: { script: 'النَّعْتُ وَالمَنْعُوتُ (Benda + Sifat)', gloss: 'Frasa Kata Benda + Kata Sifat' },
                            formula: {
                                script: 'المَنْعُوتُ + النَّعْتُ (Selaras 4/4: I’rāb, Gender, Jumlah, Ma’rifah/Nakirah)',
                                gloss: 'Jika kata benda memakai ال, kata sifatnya wajib memakai ال juga!',
                            },
                            example: {
                                script: 'البَيْتُ الكَبِيرُ (مَرْفُوع) • فِي البَيْتِ الكَبِيرِ (مَجْرُور) • بَيْتٌ كَبِيرٌ (نَكِرَة)',
                                reading: 'Al-baytu al-kabīru • Fī al-bayti al-kabīri • Baytun kabīrun',
                                gloss: 'Rumah besar itu • Di dalam rumah besar itu • Sebuah rumah yang besar',
                            },
                        },
                        fullTranslation: 'Rumah besar itu / Di dalam rumah besar itu / Sebuah rumah yang besar',
                    },
                ],
                nativeMindset: {
                    headline: 'Cara Cepat Membedakan Idhāfah vs Na’at dalam 1 Detik',
                    psychologyExplanation:
                        'Pada Idhāfah, kata pertama tidak punya ال sedangkan kata kedua punya ال (بَابُ البَيْتِ = pintu rumah). Pada Na’at, keduanya kembar identik dalam pemakaian ال dan harakat akhirnya (البَيْتُ الكَبِيرُ = rumah yang besar).',
                    literalTrap:
                        'Jangan pernah menulis "البَابُ المَدْرَسَةِ" — Mudhāf tidak boleh ber-ال meskipun maknanya spesifik.',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 2: ILMU ṢARF DASAR — TAṢRĪF LUGHAWĪ 14 DHAMIR (MĀḌĪ, MUḌĀRI', AMR) (A2–B1)
    // =========================================================================
    {
        id: 'ar-03-beg-sarf-tasrif-lughawi',
        lang: 'ar',
        pillar: 'morphology',
        tier: 'beginner',
        order: 3,
        title: 'CEFR A2–B1 | Ilmu Ṣarf Dasar: Taṣrīf Lughawī (Konjugasi 14 Dhamir: Māḍī, Muḍāri’ & Amr)',
        subtitle:
            'Bedah satu per satu perubahan akhiran dan awalan kata kerja Arab melintasi 14 kata ganti (Gha’ib, Mukhāṭab, Mutakallim)',
        estimatedMinutes: 85,
        blocks: [
            // -------------------- UNIT 2.1: FI'IL MĀḌĪ (14 DHAMIR) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.1 Taṣrīf Fi’il Māḍī (الفعل الماضي — Kata Kerja Lampau) untuk 14 Dhamir',
                grammaticalTradition: 'Ilmu Ṣarf Unit 1/3: تَصْرِيفُ الفِعْلِ المَاضِي (Akhiran Subjek Lampau)',
                direction: 'rtl',
                columns: [
                    { key: 'person', roleLabel: 'Kelompok Dhamir', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Akhiran pada Akar كَتَبَ', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Bentuk Terkonjugasi & Terjemahan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-madi-ghaib',
                        cells: {
                            person: { script: 'الغَائِبُ (Orang ke-3: Dia / Mereka)', gloss: 'هُوَ • هُمَا • هُمْ | هِيَ • هُمَا • هُنَّ' },
                            formula: {
                                script: 'هُوَ: ـَ | هُمَا(lk): ـَا | هُمْ: ـُوا | هِيَ: ـَتْ | هُمَا(pr): ـَتَا | هُنَّ: ـْنَ',
                                gloss: 'Perhatikan: Alif Fāriqah (ا) wajib ditulis setelah Wāw Jamā‘ah (كَتَبُوا) dan tidak dibaca',
                            },
                            example: {
                                script: 'كَتَبَ • كَتَبَا • كَتَبُوا | كَتَبَتْ • كَتَبَتَا • كَتَبْنَ',
                                reading: 'kataba • katabā • katabū | katabat • katabatā • katabna',
                                gloss: 'Dia(lk) menulis • Berdua(lk) • Mereka(lk) | Dia(pr) • Berdua(pr) • Mereka(pr)',
                            },
                        },
                        fullTranslation: 'Konjugasi orang ketiga lampau dari akar ك-ت-ب',
                    },
                    {
                        id: 'ar-madi-mukhatab',
                        cells: {
                            person: { script: 'المُخَاطَبُ (Orang ke-2: Kamu / Kalian)', gloss: 'أَنْتَ • أَنْتُمَا • أَنْتُمْ | أَنْتِ • أَنْتُمَا • أَنْتُنَّ' },
                            formula: {
                                script: 'أَنْتَ: ـْتَ | أَنْتُمَا: ـْتُمَا | أَنْتُمْ: ـْتُمْ | أَنْتِ: ـْتِ | أَنْتُنَّ: ـْتُنَّ',
                                gloss: 'Huruf ketiga akar kata (Bā’) disukunkan (كَتَبْـ) sebelum ditempeli dhamir',
                            },
                            example: {
                                script: 'كَتَبْتَ • كَتَبْتُمَا • كَتَبْتُمْ | كَتَبْتِ • كَتَبْتُمَا • كَتَبْتُنَّ',
                                reading: 'katabta • katabtumā • katabtum | katabti • katabtumā • katabtunna',
                                gloss: 'Kamu(lk) • Kalian berdua • Kalian(lk) | Kamu(pr) • Kalian berdua • Kalian(pr)',
                            },
                        },
                        fullTranslation: 'Konjugasi orang kedua lampau dari akar ك-ت-ب',
                    },
                    {
                        id: 'ar-madi-mutakallim',
                        cells: {
                            person: { script: 'المُتَكَلِّمُ (Orang ke-1: Saya / Kami)', gloss: 'أَنَا • نَحْنُ' },
                            formula: {
                                script: 'أَنَا: ـْتُ (-tu) | نَحْنُ: ـْنَا (-nā)',
                                gloss: 'Berlaku sama untuk pembicara laki-laki maupun perempuan',
                            },
                            example: {
                                script: 'كَتَبْتُ الرِّسَالَةَ. / كَتَبْنَا البَرْنَامَجَ.',
                                reading: 'Katabtu ar-risālata. / Katabnā al-barnāmaja.',
                                gloss: 'Saya telah menulis surat itu. / Kami telah menulis program itu.',
                            },
                        },
                        fullTranslation: 'Saya telah menulis surat itu. / Kami telah menulis program itu.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Kata Ganti Subjek (أَنَا / هُمْ) Sering Dihilangkan dalam Kalimat Arab?',
                    psychologyExplanation:
                        'Karena setiap akhiran pada Fi’il Māḍī (ـْتُ = saya, ـْنَا = kami, ـُوا = mereka) sudah menyimpan identitas pelaku secara mutlak. Menyebutkan "أَنَا كَتَبْتُ" hanya dilakukan jika kamu ingin memberi penekanan kontras ("SAYAlah yang menulisnya, bukan orang lain").',
                    literalTrap:
                        'Jangan menulis "أَنَا كَتَبَ" — kata kerja wajib ikut dikonjugasikan menjadi "كَتَبْتُ".',
                },
            },

            // -------------------- UNIT 2.2: FI'IL MUḌĀRI' (14 DHAMIR) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.2 Taṣrīf Fi’il Muḍāri’ (الفعل المضارع — Kini/Depan) & Huruf Mudhāra’ah (أَنَيْتُ)',
                grammaticalTradition: 'Ilmu Ṣarf Unit 2/3: تَصْرِيفُ الفِعْلِ المُضَارِعِ (Awalan أ-ن-ي-ت + Akhiran)',
                direction: 'rtl',
                columns: [
                    { key: 'person', roleLabel: 'Kelompok Dhamir', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus Awalan & Akhiran (Al-Af’āl al-Khamsah)', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Bentuk Terkonjugasi & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-mud-ghaib',
                        cells: {
                            person: { script: 'الغَائِبُ (Orang ke-3)', gloss: 'Awalan يَـ (kecuali هِيَ dan هُمَا pr memakai تَـ)' },
                            formula: {
                                script: 'هُوَ: يَكْتُبُ | هُمَا: يَكْتُبَانِ | هُمْ: يَكْتُبُونَ | هِيَ: تَكْتُبُ | هُمَا(pr): تَكْتُبَانِ | هُنَّ: يَكْتُبْنَ',
                                gloss: 'Perhatikan: هُنَّ (mereka pr) memakai awalan يَـ dan akhiran Nūn Niswah ـْنَ (يَكْتُبْنَ)',
                            },
                            example: {
                                script: 'يَكْتُبُ • يَكْتُبَانِ • يَكْتُبُونَ | تَكْتُبُ • تَكْتُبَانِ • يَكْتُبْنَ',
                                reading: 'yaktubu • yaktubāni • yaktubūna | taktubu • taktubāni • yaktubna',
                                gloss: 'Dia(lk) sedang/akan menulis • Berdua • Mereka(lk) | Dia(pr) • Berdua(pr) • Mereka(pr)',
                            },
                        },
                        fullTranslation: 'Konjugasi orang ketiga masa kini/depan',
                    },
                    {
                        id: 'ar-mud-mukhatab',
                        cells: {
                            person: { script: 'المُخَاطَبُ (Orang ke-2 — Semua Diawali تَـ)', gloss: 'أَنْتَ • أَنْتُمَا • أَنْتُمْ | أَنْتِ • أَنْتُنَّ' },
                            formula: {
                                script: 'أَنْتَ: تَكْتُبُ | أَنْتُمَا: تَكْتُبَانِ | أَنْتُمْ: تَكْتُبُونَ | أَنْتِ: تَكْتُبِينَ | أَنْتُنَّ: تَكْتُبْنَ',
                                gloss: 'Khusus أَنْتِ (kamu pr) memakai akhiran Yā’ Mukhāṭabah + Nūn (تَكْتُبِينَ)',
                            },
                            example: {
                                script: 'تَكْتُبُ • تَكْتُبَانِ • تَكْتُبُونَ | تَكْتُبِينَ • تَكْتُبَانِ • تَكْتُبْنَ',
                                reading: 'taktubu • taktubāni • taktubūna | taktubīna • taktubāni • taktubna',
                                gloss: 'Kamu(lk) • Kalian berdua • Kalian(lk) | Kamu(pr) • Kalian berdua • Kalian(pr)',
                            },
                        },
                        fullTranslation: 'Konjugasi orang kedua masa kini/depan',
                    },
                    {
                        id: 'ar-mud-mutakallim',
                        cells: {
                            person: { script: 'المُتَكَلِّمُ (Orang ke-1)', gloss: 'أَنَا diawali أَـ | نَحْنُ diawali نَـ' },
                            formula: {
                                script: 'أَنَا: أَكْتُبُ (aktubu) | نَحْنُ: نَكْتُبُ (naktubu)',
                                gloss: 'Tambahkan سَـ (sa-) untuk masa depan dekat: سَأَكْتُبُ (saya akan segera menulis)',
                            },
                            example: {
                                script: 'أَكْتُبُ الدَّرْسَ الآنَ. / سَنَكْتُبُ التَّقْرِيرَ غَدًا.',
                                reading: 'Aktubu ad-darsa al-āna. / Sanaktubu at-taqrīra ghadan.',
                                gloss: 'Saya sedang menulis pelajaran sekarang. / Kami akan menulis laporan besok.',
                            },
                        },
                        fullTranslation: 'Saya sedang menulis pelajaran sekarang. / Kami akan menulis laporan besok.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bentuk "تَكْتُبُ" Bisa Berarti "Dia (Pr) Menulis" Sekaligus "Kamu (Lk) Menulis"?',
                    psychologyExplanation:
                        'Dalam tabel konjugasi Arab, bentuk هِيَ (dia perempuan) dan أَنْتَ (kamu laki-laki) memang identik secara morfologis (تَكْتُبُ / كَتَبَتْ vs تَكْتُبُ). Penutur asli membedakannya secara instan melalui konteks dialog atau kehadiran kata ganti penegas.',
                    literalTrap:
                        'Jangan tertukar antara يَكْتُبْنَ (mereka perempuan — diawali يَـ) dan تَكْتُبْنَ (kalian perempuan — diawali تَـ).',
                },
            },

            // -------------------- UNIT 2.3: FI'IL AMR (KATA KERJA PERINTAH) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.3 Cara Membentuk Fi’il Amr (فِعْلُ الأَمْرِ — Kata Kerja Perintah) dari Fi’il Muḍāri’',
                grammaticalTradition: 'Ilmu Ṣarf Unit 3/3: صِيَاغَةُ فِعْلِ الأَمْرِ (Algoritma Pembentukan Perintah)',
                direction: 'rtl',
                columns: [
                    { key: 'step', roleLabel: 'Langkah Algoritma Ṣarf', semanticColor: 'rose' },
                    { key: 'formula', roleLabel: 'Aturan Harakat Hamzah Waṣl', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Lengkap (أَنْتَ / أَنْتِ / أَنْتُمْ)', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-amr-step1',
                        cells: {
                            step: { script: '1. Buang Huruf Mudhāra’ah (تَـ) + Sukunkan Akhir', gloss: 'Ambil dari bentuk أَنْتَ pada Muḍāri’' },
                            formula: {
                                script: 'تَكْتُبُ → كْتُبْ (jika huruf pertama mati/sukūn, tambahkan Hamzah Waṣl ا)',
                                gloss: 'Jika setelah membuang تَـ huruf pertamanya berharakat hidup (تُعَلِّمُ → عَلِّمْ), tidak perlu Alif!',
                            },
                            example: {
                                script: 'تُعَلِّمُ → عَلِّمْ (ajarkanlah!) | تَسْتَغْفِرُ → اِسْتَغْفِرْ (mohonlah ampun!)',
                                reading: '‘allim | istaghfir',
                                gloss: 'Perintah dibentuk secara mekanis dari Muḍāri’',
                            },
                        },
                        fullTranslation: 'Algoritma pembentukan Fi’il Amr dari Fi’il Muḍāri’',
                    },
                    {
                        id: 'ar-amr-step2',
                        cells: {
                            step: { script: '2. Hukum Harakat Hamzah Waṣl (اُ vs اِ)', gloss: 'Lihat harakat huruf ke-3 (‘Ain Fi’il)!' },
                            formula: {
                                script: 'Jika huruf ke-3 berharakat Ḍammah (ـُ) → اُ (u) | Jika Fatḥah (ـَ) atau Kasrah (ـِ) → اِ (i)',
                                gloss: 'Hamzah Waṣl tidak pernah berharakat Fatḥah (اَ) pada Fi’il Amr',
                            },
                            example: {
                                script: 'يَكْتُبُ → اُكْتُبْ (uktub!) | يَفْتَحُ → اِفْتَحْ (iftaḥ!) | يَجْلِسُ → اِجْلِسْ (ijlis!)',
                                reading: 'uktub (tulislah!) • iftaḥ (bukalah!) • ijlis (duduklah!)',
                                gloss: 'Perintah untuk أَنْتِ: اُكْتُبِي | أَنْتُمْ: اُكْتُبُوا | أَنْتُنَّ: اُكْتُبْنَ',
                            },
                        },
                        fullTranslation: 'Tulislah! • Bukalah! • Duduklah!',
                    },
                ],
                nativeMindset: {
                    headline: 'Rumus Harakat Hamzah Amr: "Ḍammah Ikut Ḍammah (اُ), Selain Itu Kasrah (اِ)"',
                    psychologyExplanation:
                        'Kamu tidak perlu menghafal harakat awal ratusan kata kerja perintah secara acak. Cukup intip huruf ketiga dari kata kerjanya: jika berbunyi "u" (تَكْتُبُ, تَدْخُلُ, تَخْرُجُ), awali dengan اُ (اُكْتُبْ, اُدْخُلْ, اُخْرُجْ). Jika berbunyi "a" atau "i" (تَفْتَحُ, تَجْلِسُ, تَسْمَعُ), awali dengan اِ (اِفْتَحْ, اِجْلِسْ, اِسْمَعْ).',
                    literalTrap:
                        'Jangan pernah menulis tanda Hamzah (أ / إ) di atas atau di bawah Alif Fi’il Amr Tsulātsī (tulis اُكْتُبْ, bukan أُكْتُبْ).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 3: ILMU NAḤWU MENENGAH — AL-I'RĀB, AN-NAWĀSIKH & MUḌĀRI' (B1–B2)
    // =========================================================================
    {
        id: 'ar-04-inter-nahwu-irab-nawasikh',
        lang: 'ar',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 4,
        title: 'CEFR B1–B2 | Ilmu Naḥwu Menengah: Al-I’rāb (Tanda Asli & Cabang), An-Nawāsikh & Muḍāri’',
        subtitle:
            'Bedah mendalam 4 kasus I’rāb, perubahan huruf pada Mutsannā/Jamak/Asmā’ Khamsah, serta hukum Kāna vs Inna',
        estimatedMinutes: 80,
        blocks: [
            // -------------------- UNIT 3.1: TANDA I'RĀB ASLI VS CABANG --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.1 Matriks Lengkap Tanda I’rāb Asli (Harakat) vs Tanda I’rāb Cabang (Huruf)',
                grammaticalTradition: 'Ilmu Naḥwu Unit 1/3: عَلامَاتُ الإِعْرَابِ الأَصْلِيَّةُ وَالفَرْعِيَّةُ',
                direction: 'rtl',
                columns: [
                    { key: 'wordType', roleLabel: 'Kategori Kata Benda', semanticColor: 'violet' },
                    { key: 'rafa', roleLabel: 'Rafa’ (Subjek / Khabar)', semanticColor: 'emerald' },
                    { key: 'nasabJarr', roleLabel: 'Naṣab (Objek) & Jarr (Preposisi)', semanticColor: 'amber' },
                ],
                rows: [
                    {
                        id: 'ar-irab-mufrad',
                        cells: {
                            wordType: { script: 'المُفْرَدُ وَجَمْعُ التَّكْسِيرِ', gloss: 'Tunggal & Jamak Tak Beraturan' },
                            rafa: { script: 'الضَّمَّةُ (ـُ / ـٌ) — الطَّالِبُ / الطُّلَّابُ', gloss: 'Tanda asli: Ḍammah' },
                            nasabJarr: { script: 'Naṣab: الفَتْحَةُ (ـَ / ـًا) | Jarr: الكَسْرَةُ (ـِ / ـٍ)', gloss: 'Tanda asli: Fatḥah & Kasrah' },
                        },
                        fullTranslation: 'Kata benda tunggal & jamak taksir memakai harakat asli Ḍammah, Fatḥah, Kasrah',
                    },
                    {
                        id: 'ar-irab-mutsanna',
                        cells: {
                            wordType: { script: 'المُثَنَّى (Bentuk Ganda / Dua)', gloss: 'Selalu diakhiri Alif/Ya + Nūn Kasrah (نِ)' },
                            rafa: { script: 'الأَلِفُ (ـَانِ) — الطَّالِبَانِ مُجْتَهِدَانِ', gloss: 'Dua mahasiswa itu rajin' },
                            nasabJarr: { script: 'اليَاءُ (ـَيْنِ) — رَأَيْتُ الطَّالِبَيْنِ / مَعَ الطَّالِبَيْنِ', gloss: 'Naṣab dan Jarr keduanya memakai ـَيْنِ (-ayni)' },
                        },
                        fullTranslation: 'Bentuk ganda memakai ـَانِ saat Rafa’ dan ـَيْنِ saat Naṣab/Jarr',
                    },
                    {
                        id: 'ar-irab-jms',
                        cells: {
                            wordType: { script: 'جَمْعُ المُذَكَّرِ السَّالِمُ (Jamak Maskulin Beraturan)', gloss: 'Untuk manusia laki-laki berakal' },
                            rafa: { script: 'الوَاوُ (ـُونَ) — المُهَنْدِسُونَ مَاهِرُونَ', gloss: 'Para insinyur itu mahir' },
                            nasabJarr: { script: 'اليَاءُ (ـِينَ) — شَكَرْتُ المُهَنْدِسِينَ / لِلْمُهَنْدِسِينَ', gloss: 'Naṣab dan Jarr keduanya memakai ـِينَ (-īna)' },
                        },
                        fullTranslation: 'Jamak maskulin beraturan memakai ـُونَ saat Rafa’ dan ـِينَ saat Naṣab/Jarr',
                    },
                    {
                        id: 'ar-irab-jfs',
                        cells: {
                            wordType: { script: 'جَمْعُ المُؤَنَّثِ السَّالِمُ (Jamak Feminin Beraturan)', gloss: 'Berakhiran ـَاتٌ (-ātun)' },
                            rafa: { script: 'الضَّمَّةُ (ـَاتٌ) — المُسْلِمَاتُ / الصَّفَحَاتُ', gloss: 'Tanda Rafa’ normal Ḍammah' },
                            nasabJarr: { script: 'الكَسْرَةُ نِيَابَةً عَنِ الفَتْحَةِ (ـَاتٍ) — رَأَيْتُ الطَّالِبَاتِ', gloss: 'HARAM memakai Fatḥah! Naṣab-nya pun memakai Kasrah (ـَاتٍ)' },
                        },
                        fullTranslation: 'Jamak feminin beraturan tidak pernah berharakat Fatḥah; Naṣab dan Jarr memakai Kasrah',
                    },
                    {
                        id: 'ar-irab-asma5',
                        cells: {
                            wordType: { script: 'الأَسْمَاءُ الخَمْسَةُ (أَبٌ، أَخٌ، حَمٌ، فُو، ذُو)', gloss: 'Jika di-idhāfah-kan ke selain Yā’ Mutakallim' },
                            rafa: { script: 'الوَاوُ — جَاءَ أَبُوكَ / هُوَ ذُو عِلْمٍ', gloss: 'Rafa’ dengan huruf Wāw' },
                            nasabJarr: { script: 'Naṣab: الأَلِفُ (رَأَيْتُ أَبَاكَ) | Jarr: اليَاءُ (سَلَّمْتُ عَلَى أَبِيكَ)', gloss: 'Berubah huruf penuh: Abūka → Abāka → Abīka' },
                        },
                        fullTranslation: 'Al-Asmā’ al-Khamsah berubah huruf menjadi Wāw (Rafa’), Alif (Naṣab), dan Yā’ (Jarr)',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Jamak Mu’annats Sālim (ـات) Tidak Pernah Berharakat Fatḥah?',
                    psychologyExplanation:
                        'Akhiran ـات dianggap pasangan feminin dari jamak maskulin ـونَ/ـينَ yang hanya memiliki 2 bentuk (Rafa’ vs Naṣab/Jarr). Karena itu, saat posisi objek (Naṣab), ـات meminjam harakat Kasrah (رَأَيْتُ السَّيَّارَاتِ = Saya melihat mobil-mobil itu) dan tidak pernah berbunyi السَّيَّارَاتَ.',
                    literalTrap:
                        'Jangan pernah membaca kata berakhiran ـات dengan harakat Fatḥah (-āta/-ātan)—selalu gunakan Kasrah (-āti/-ātin) saat objek maupun preposisi.',
                },
            },

            // -------------------- UNIT 3.2: AN-NAWĀSIKH (كَانَ VS إِنَّ) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.2 Hukum Pembatal Mubtada’–Khabar: Keluarga كَانَ (Kāna) vs Keluarga إِنَّ (Inna)',
                grammaticalTradition: 'Ilmu Naḥwu Unit 2/3: النَّوَاسِخُ (كَانَ وَأَخَوَاتُهَا vs إِنَّ وَأَخَوَاتُهَا)',
                direction: 'rtl',
                columns: [
                    { key: 'family', roleLabel: 'Keluarga Pembatal', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Efek Pengubah Harakat', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Kontras', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-kana-group',
                        cells: {
                            family: { script: 'كَانَ وَأَخَوَاتُهَا (Kāna, Aṣbaḥa, Ẓalla, Laysa)', gloss: 'Kata Kerja Defektif (Lampau / Menjadi / Bukan)' },
                            formula: {
                                script: 'تَرْفَعُ الاسْمَ (ـُ) وَتَنْصِبُ الخَبَرَ (ـًا)',
                                gloss: 'Subjek tetap Rafa’ (-u), Predikat berubah menjadi Naṣab (-an)',
                            },
                            example: {
                                script: 'كَانَ الجَوُّ جَمِيلًا. / أَصْبَحَ البَرْنَامَجُ سَرِيعًا.',
                                reading: 'Kāna al-jawwu jamīlan. / Aṣbaḥa al-barnāmaju sarī‘an.',
                                gloss: 'Cuaca tadinya indah. / Program itu telah menjadi cepat.',
                            },
                        },
                        fullTranslation: 'Cuaca tadinya indah. / Program itu telah menjadi cepat.',
                    },
                    {
                        id: 'ar-inna-group',
                        cells: {
                            family: { script: 'إِنَّ وَأَخَوَاتُهَا (Inna, Anna, Lākinna, La’alla)', gloss: 'Partikel Penegas (Sesungguhnya / Bahwa / Tetapi / Semoga)' },
                            formula: {
                                script: 'تَنْصِبُ الاسْمَ (ـَ) وَتَرْفَعُ الخَبَرَ (ـٌ)',
                                gloss: 'Kebalikan 100% dari Kāna: Subjek berubah Naṣab (-a), Predikat tetap Rafa’ (-un)',
                            },
                            example: {
                                script: 'إِنَّ اللُّغَةَ العَرَبِيَّةَ جَمِيلَةٌ. / إِنَّ اللّٰهَ غَفُورٌ رَحِيمٌ.',
                                reading: 'Inna al-lughata al-‘arabiyyata jamīlatun.',
                                gloss: 'Sesungguhnya bahasa Arab itu indah.',
                            },
                        },
                        fullTranslation: 'Sesungguhnya bahasa Arab itu indah.',
                    },
                ],
                nativeMindset: {
                    headline: 'Rumus Ingat Kilat: Kāna = "Rafa’–Naṣab" (U – A), Inna = "Naṣab–Rafa’" (A – U)',
                    psychologyExplanation:
                        'Kāna adalah kata kerja (Fi’il), sehingga memperlakukan kata pertama seperti subjeknya (Rafa’ -u) dan kata kedua seperti objeknya (Naṣab -a). Inna adalah partikel penegas yang langsung menarik kata benda pertama menjadi objek penegasannya (Naṣab -a) lalu membiarkan kabarnya tetap Rafa’ (-u).',
                    literalTrap:
                        'Jangan lupa menambahkan Alif penopang tanwin fatḥah (ـًا) pada Khabar Kāna yang tidak berakhiran Tā’ Marbūṭah (جَمِيلًا, bukan جَمِيلَ).',
                },
            },

            // -------------------- UNIT 3.3: NAṢAB & JAZM PADA FI'IL MUḌĀRI' --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.3 Perubahan Harakat Akhir Fi’il Muḍāri’: Rafa’ (ـُ) → Naṣab (ـَ) → Jazm (ـْ)',
                grammaticalTradition: 'Ilmu Naḥwu Unit 3/3: إِعْرَابُ الفِعْلِ المُضَارِعِ (أَنْ، لَنْ، لَمْ، لَا النَّاهِيَة)',
                direction: 'rtl',
                columns: [
                    { key: 'mood', roleLabel: 'Keadaan Fi’il Muḍāri’', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Partikel Pemicu & Tanda Akhir', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Makna Waktu', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-mudhari-rafa',
                        cells: {
                            mood: { script: 'المَرْفُوعُ (Normal — Ḍammah ـُ)', gloss: 'Tanpa partikel pembatal di depannya' },
                            formula: { script: 'يَكْتُبُ / يَذْهَبُونَ (tetap Nūn)', gloss: 'Menyatakan kebiasaan kini atau masa depan' },
                            example: { script: 'يَدْرُسُ نَوْفَلُ الذَّكَاءَ الاصْطِنَاعِيَّ كُلَّ يَوْمٍ.', gloss: 'Naufal mempelajari kecerdasan buatan setiap hari.' },
                        },
                        fullTranslation: 'Naufal mempelajari kecerdasan buatan setiap hari.',
                    },
                    {
                        id: 'ar-mudhari-nasab',
                        cells: {
                            mood: { script: 'المَنْصُوبُ (Subjunctive — Fatḥah ـَ)', gloss: 'Didahului أَنْ (untuk), لَنْ (tidak akan), كَيْ (agar)' },
                            formula: { script: 'أَنْ / لَنْ + يَكْتُبَ (atau buang Nūn: لَنْ يَذْهَبُوا)', gloss: 'لَنْ menyatakan penyangkalan mutlak masa depan ("tidak akan pernah")' },
                            example: { script: 'أُرِيدُ أَنْ أَتَعَلَّمَ العَرَبِيَّةَ. / لَنْ أَسْتَسْلِمَ.', gloss: 'Saya ingin belajar bahasa Arab. / Saya tidak akan menyerah.' },
                        },
                        fullTranslation: 'Saya ingin belajar bahasa Arab. / Saya tidak akan menyerah.',
                    },
                    {
                        id: 'ar-mudhari-jazm',
                        cells: {
                            mood: { script: 'المَجْزُومُ (Jussive — Sukūn ـْ)', gloss: 'Didahului لَمْ (tidak/belum di masa lampau) atau لَا النَّاهِيَة (jangan!)' },
                            formula: { script: 'لَمْ + يَكْتُبْ (mengubah arti Muḍāri’ menjadi LAMPAU!)', gloss: 'Pada jamak/mutsannā, huruf Nūn dibuang (لَمْ يَذْهَبُوا)' },
                            example: { script: 'لَمْ أَسْمَعْ هٰذَا الخَبَرَ مِنْ قَبْلُ. / لَا تَخَفْ!', gloss: 'Saya belum pernah mendengar berita ini sebelumnya. / Jangan takut!' },
                        },
                        fullTranslation: 'Saya belum pernah mendengar berita ini sebelumnya. / Jangan takut!',
                    },
                ],
                nativeMindset: {
                    headline: 'Keajaiban Partikel لَمْ (Lam): Kata Kerja Bentuk Kini yang Bermakna Lampau!',
                    psychologyExplanation:
                        'Meskipun يَكْتُبُ adalah bentuk kata kerja masa kini (Muḍāri’), begitu didahului partikel لَمْ yang menyukunkan akhirnya (لَمْ يَكْتُبْ), maknanya berbalik menjadi masa lampau ("dia tidak/belum menulis kemarin") dan jauh lebih fasih daripada مَا كَتَبَ.',
                    literalTrap:
                        'Jangan mencampur لَمْ dengan Fi’il Māḍī ("لَمْ كَتَبَ" — SALAH TOTAL; لَمْ hanya masuk ke Fi’il Muḍāri’).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 4: ILMU ṢARF MENENGAH — ISIM MUSYTAQ & AL-AWZĀN AL-'ASYARAH (B2–C1)
    // =========================================================================
    {
        id: 'ar-05-inter-sarf-musytaq-awzan',
        lang: 'ar',
        pillar: 'morphology',
        tier: 'intermediate',
        order: 5,
        title: 'CEFR B2–C1 | Ilmu Ṣarf Lanjutan: Taṣrīf Iṣṭilāḥī (Isim Musytaq) & Al-Awzān al-‘Asyarah (Wazan I–X)',
        subtitle:
            'Bagaimana satu akar 3 huruf (ف-ع-ل) melahirkan kata pelaku, objek, tempat, alat, serta 10 wazan perluasan makna',
        estimatedMinutes: 85,
        blocks: [
            // -------------------- UNIT 4.1: TAṢRĪF IṢṬILĀḤĪ (ISIM MUSYTAQ) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '4.1 Taṣrīf Iṣṭilāḥī — Derivasi Kata Benda dari Akar Kata Kerja (Isim Musytaq)',
                grammaticalTradition: 'Ilmu Ṣarf Unit 1/2: المُشْتَقَّاتُ (اِسْمُ الفَاعِلِ، اِسْمُ المَفْعُولِ، اِسْمُ المَكَانِ، اِسْمُ الآلَةِ)',
                direction: 'rtl',
                columns: [
                    { key: 'derivative', roleLabel: 'Jenis Kata Turunan', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Pola Mīzān (Tsulātsī vs Mazīd)', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Nyata & Makna', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-musytaq-fail',
                        cells: {
                            derivative: { script: 'اِسْمُ الفَاعِلِ (Pelaku Tindakan)', gloss: 'Subject Noun / Active Participle' },
                            formula: {
                                script: '3 Huruf: فَاعِلٌ | >3 Huruf: Ganti huruf Muḍāri’ dengan مُـ + Kasrah sebelum akhir (مُفْعِلٌ)',
                                gloss: 'Alif panjang setelah huruf pertama pada akar 3 huruf',
                            },
                            example: {
                                script: 'كَتَبَ → كَاتِبٌ (penulis) | عَلِمَ → عَالِمٌ (ilmuwan) | بَرْمَجَ → مُبَرْمِجٌ (programmer)',
                                reading: 'kātibun • ‘ālimun • mubarmijun',
                                gloss: 'Pola yang sama melahirkan ratusan profesi & pelaku aksi',
                            },
                        },
                        fullTranslation: 'Penulis (كَاتِبٌ) • Ilmuwan (عَالِمٌ) • Programmer (مُبَرْمِجٌ)',
                    },
                    {
                        id: 'ar-musytaq-maful',
                        cells: {
                            derivative: { script: 'اِسْمُ المَفْعُولِ (Objek yang Dikenai Tindakan)', gloss: 'Passive Participle' },
                            formula: {
                                script: '3 Huruf: مَفْعُولٌ | >3 Huruf: Ganti huruf Muḍāri’ dengan مُـ + Fatḥah sebelum akhir (مُفْعَلٌ)',
                                gloss: 'Membedakan pelaku vs objek pada kata >3 huruf hanya lewat harakat sebelum akhir (-i vs -a)!',
                            },
                            example: {
                                script: 'كَتَبَ → مَكْتُوبٌ (tertulis/surat) | فَتَحَ → مَفْتُوحٌ (terbuka) | أَرْسَلَ → مُرْسَلٌ (yang dikirim)',
                                reading: 'maktūbun • maftūḥun • mursalun (vs mursilun = pengirim)',
                                gloss: 'Kontras tajam: مُرْسِلٌ (pengirim) vs مُرْسَلٌ (pesan yang dikirim)',
                            },
                        },
                        fullTranslation: 'Tertulis (مَكْتُوبٌ) • Terbuka (مَفْتُوحٌ) • Yang dikirim (مُرْسَلٌ)',
                    },
                    {
                        id: 'ar-musytaq-makan-alah',
                        cells: {
                            derivative: { script: 'اِسْمُ المَكَانِ (Tempat) & اِسْمُ الآلَةِ (Alat)', gloss: 'Noun of Place & Instrument' },
                            formula: {
                                script: 'Tempat: مَفْعَلٌ / مَفْعِلٌ (مَفْعَلَةٌ) | Alat: مِفْعَالٌ / مِفْعَلٌ / مِفْعَلَةٌ (diawali Kasrah مِـ)',
                                gloss: 'Perhatikan awalan Mīm Fatḥah (مَـ) untuk tempat dan Mīm Kasrah (مِـ) untuk alat',
                            },
                            example: {
                                script: 'مَكْتَبٌ (kantor/meja) • مَدْرَسَةٌ (sekolah) | مِفْتَاحٌ (kunci) • مِقْيَاسٌ (alat ukur)',
                                reading: 'maktabun • madrasatun | miftāḥun • miqyāsun',
                                gloss: 'Satu akar ك-ت-ب menghasilkan: كَتَبَ, كَاتِب, مَكْتُوب, مَكْتَب, مَكْتَبَة (perpustakaan), كِتَاب!',
                            },
                        },
                        fullTranslation: 'Kantor (مَكْتَبٌ) • Sekolah (مَدْرَسَةٌ) | Kunci (مِفْتَاحٌ) • Alat ukur (مِقْيَاسٌ)',
                    },
                ],
                nativeMindset: {
                    headline: 'Rahasia Mīm Berharakat Ḍammah (مُـ): Satu Harakat Membedakan Pelaku vs Objek!',
                    psychologyExplanation:
                        'Untuk semua kata kerja lebih dari 3 huruf, Isim Fā’il dan Isim Maf’ūl memiliki kerangka huruf yang identik. Penutur asli membedakannya melalui vokal huruf kedua dari belakang: Kasrah (-i) adalah PELAKU (مُعَلِّمٌ = pengajar, مُسْتَخْدِمٌ = pengguna), sedangkan Fatḥah (-a) adalah OBJEK (مُعَلَّمٌ = yang diajar, مُسْتَخْدَمٌ = yang digunakan).',
                    literalTrap:
                        'Jangan tertukar membaca مُسْتَخْدِم (user/pengguna) dengan مُسْتَخْدَم (used/yang digunakan) dalam dokumentasi teknis Arab.',
                },
            },

            // -------------------- UNIT 4.2: AL-AWZĀN AL-'ASYARAH (WAZAN I–X) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '4.2 Al-Awzān al-‘Asyarah (الأوزان العشرة) — 10 Pola Perluasan Makna Kata Kerja',
                grammaticalTradition: 'Ilmu Ṣarf Unit 2/2: مَعَانِي صِيَغِ الزَّوَائِدِ (Wazan I – X)',
                direction: 'rtl',
                columns: [
                    { key: 'wazan', roleLabel: 'Wazan (Māḍī / Muḍāri’ / Maṣdar)', semanticColor: 'violet' },
                    { key: 'semantics', roleLabel: 'Pergeseran Makna Morfologis', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Nyata dari Akar ع-ل-م & ك-ت-ب', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-wazan-1-2-4',
                        cells: {
                            wazan: { script: 'I: فَعَلَ | II: فَعَّلَ (تَفْعِيل) | IV: أَفْعَلَ (إِفْعَال)', gloss: 'Dasar → Intensif/Kausatif → Transitif/Kausatif' },
                            semantics: { script: 'Wazan II & IV mengubah kata kerja intransitif menjadi transitif ("membuat orang lain melakukan")', gloss: 'Tasydīd pada ‘Ain Fi’il atau Hamzah Qaṭ‘ di awal' },
                            example: { script: 'عَلِمَ (tahu) → عَلَّمَ (mengajarkan) → أَعْلَمَ (memberitahukan / menginformasikan)', gloss: 'Satu akar ع-ل-م melahirkan seluruh keluarga kata ilmu' },
                        },
                        fullTranslation: 'Tahu (عَلِمَ) → Mengajarkan (عَلَّمَ) → Memberitahukan (أَعْلَمَ)',
                    },
                    {
                        id: 'ar-wazan-3-6',
                        cells: {
                            wazan: { script: 'III: فَاعَلَ (مُفَاعَلَة) | VI: تَفَاعَلَ (تَفَاعُل)', gloss: 'Interaksi Dua Pihak & Saling Melakukan (Resiprokal)' },
                            semantics: { script: 'Wazan III: aksi ke pihak lain | Wazan VI: kedua belah pihak saling berinteraksi', gloss: 'Alif panjang setelah Fā’ Fi’il' },
                            example: { script: 'كَاتَبَ (berkorespondensi dengan) → تَكَاتَبَ (saling berkirim surat) | تَعَاوَنَ (saling bekerja sama)', gloss: 'Sangat produktif dalam bahasa jurnalistik dan diplomasi' },
                        },
                        fullTranslation: 'Berkorespondensi (كَاتَبَ) → Saling berkirim surat (تَكَاتَبَ) / Bekerja sama (تَعَاوَنَ)',
                    },
                    {
                        id: 'ar-wazan-5-7-8',
                        cells: {
                            wazan: { script: 'V: تَفَعَّلَ | VII: اِنْفَعَلَ | VIII: اِفْتَعَلَ', gloss: 'Refleksif / Pasif Alami / Upaya Sungguh-sungguh' },
                            semantics: { script: 'Hasil dari Wazan II (عَلَّمَ → تَعَلَّمَ) atau akibat alami tanpa pelaku (كَسَرَ → اِنْكَسَرَ)', gloss: 'Hamzah Waṣl di awal Wazan VII–X' },
                            example: { script: 'تَعَلَّمَ (belajar / menerima pengajaran) | اِنْكَسَرَ (pecah sendiri) | اِجْتَمَعَ (berkumpul)', gloss: 'Perhatikan: Hamzah Wazan VII–X gugur saat disambung kata sebelumnya' },
                        },
                        fullTranslation: 'Belajar (تَعَلَّمَ) | Pecah (اِنْكَسَرَ) | Berkumpul (اِجْتَمَعَ)',
                    },
                    {
                        id: 'ar-wazan-10',
                        cells: {
                            wazan: { script: 'X: اِسْتَفْعَلَ — يَسْتَفْعِلُ — اِسْتِفْعَال', gloss: 'Meminta / Menganggap / Mencari' },
                            semantics: { script: 'Awalan اِسْتَـ (ista-) menandakan permintaan atau penilaian kualitas', gloss: 'Pola paling sering muncul pada istilah modern & hukum' },
                            example: { script: 'غَفَرَ (mengampuni) → اِسْتَغْفَرَ (memohon ampun) | خَدَمَ → اِسْتَخْدَمَ (menggunakan)', gloss: 'اِسْتِخْدَام (penggunaan), اِسْتِقْبَال (resepsi/penerimaan)' },
                        },
                        fullTranslation: 'Memohon ampun (اِسْتَغْفَرَ) / Menggunakan (اِسْتَخْدَمَ)',
                    },
                ],
                nativeMindset: {
                    headline: 'Kekuatan Algoritmik Akar 3 Huruf (الجِذْرُ الثُّلَاثِيُّ) dalam Membaca Kamus Arab',
                    psychologyExplanation:
                        'Kamus klasik Arab (Lisān al-‘Arab / Hans Wehr) disusun berdasarkan 3 huruf akarnya! Begitu kamu mengenali Wazan (misal: اِسْتِقْبَال memakai awalan اِسْتِـ dan sisipan ا), kamu langsung tahu akarnya adalah ق-ب-ل (menghadap/menerima).',
                    literalTrap:
                        'Perhatikan perbedaan Hamzah Qaṭ‘ (أَ) yang selalu ditulis dan dibaca pada Wazan IV (أَكْرَمَ), sedangkan Hamzah Waṣl (اِ) pada Wazan VII–X tidak berhamzah.',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 5: NAḤWU & ṢARF TINGKAT TINGGI — MAMNU' MIN AṢ-ṢARF, FI'IL MU'TAL & SYARṬ (C1–C2)
    // =========================================================================
    {
        id: 'ar-06-adv-nahwu-sarf-advanced',
        lang: 'ar',
        pillar: 'syntax',
        tier: 'advanced',
        order: 6,
        title: 'CEFR C1–C2 | Naḥwu & Ṣarf Mahir: Al-Mamnu’ min aṣ-Ṣarf, Fi’il Mu’tal & Uslūb Syarṭ',
        subtitle:
            'Bedah aturan kata benda yang menolak tanwin & kasrah, perubahan huruf penyakit (و/ا/ي), serta kalimat pengandaian',
        estimatedMinutes: 75,
        blocks: [
            // -------------------- UNIT 5.1: AL-MAMNU' MIN AṢ-ṢARF --------------------
            {
                type: 'cognitive-pattern-table',
                title: '5.1 Al-Mamnu’ min aṣ-Ṣarf (الممنوع من الصرف) — Kata Benda yang Haram Tanwin & Kasrah',
                grammaticalTradition: 'Ilmu Naḥwu Mahir Unit 1/3: جَرُّ المَمْنُوعِ مِنَ الصَّرْفِ بِالفَتْحَةِ',
                direction: 'rtl',
                columns: [
                    { key: 'category', roleLabel: 'Kategori Penyebab', semanticColor: 'rose' },
                    { key: 'formula', roleLabel: 'Hukum I’rāb Khusus', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Pengecualian', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-mamnu-rule',
                        cells: {
                            category: { script: 'Nama Non-Arab / Nama Perempuan / Jamak Muntahā al-Jumū’ / Pola أَفْعَلُ', gloss: 'إِبْرَاهِيمُ • فَاطِمَةُ • مَسَاجِدُ • أَحْمَدُ • مِصْرُ' },
                            formula: {
                                script: 'Rafa’: ـُ (tanpa tanwin) | Naṣab: ـَ | Jarr: الفَتْحَةُ (ـَ) نِيَابَةً عَنِ الكَسْرَةِ!',
                                gloss: 'Pengecualian: Jika diberi ال atau di-idhāfah-kan, kembali menerima Kasrah (فِي المَسَاجِدِ / فِي مَسَاجِدِ القَاهِرَةِ)',
                            },
                            example: {
                                script: 'سَافَرْتُ إِلَى مِصْرَ. / صَلَّيْتُ فِي مَسَاجِدَ كَثِيرَةٍ.',
                                reading: 'Sāfartu ilā Miṣra. / Ṣallaytu fī masājida katsīratin.',
                                gloss: 'Saya bepergian ke Mesir (مِصْرَ ber-fatḥah meski setelah إِلَى!). / Saya salat di banyak masjid.',
                            },
                        },
                        fullTranslation: 'Saya bepergian ke Mesir. / Saya salat di banyak masjid.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Kita Membaca "إِلَى مِصْرَ" dan "عَنْ عَائِشَةَ" dengan Fatḥah, Bukan Kasrah?',
                    psychologyExplanation:
                        'Kata benda yang memiliki dua beban morfologis/makna sekaligus (seperti nama tempat/non-Arab, pola jamak مَفَاعِلُ, atau pola perbandingan أَفْعَلُ) dianggap "berat" dalam fonologi Arab sehingga kehilangan hak bertanwin dan hak menerima harakat Kasrah.',
                    literalTrap:
                        'Jangan pernah membaca "فِي مَسَاجِدٍ" — kata berpola مَفَاعِلُ / مَفَاعِيلُ (مَسَاجِدُ، مَفَاتِيحُ، قَوَانِينُ) tidak boleh bertanwin dan di-jarr-kan dengan Fatḥah.',
                },
            },

            // -------------------- UNIT 5.2: FI'IL MU'TAL --------------------
            {
                type: 'cognitive-pattern-table',
                title: '5.2 Ilmu Ṣarf: Fi’il Mu’tal (الفعل المعتل) — Hukum Huruf Penyakit (و ، ا ، ي)',
                grammaticalTradition: 'Ilmu Ṣarf Mahir Unit 2/3: المِثَالُ وَالأَجْوَفُ وَالنَّاقِصُ (Ilmu I’lāl)',
                direction: 'rtl',
                columns: [
                    { key: 'mutalType', roleLabel: 'Jenis Fi’il Mu’tal', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Aturan Perubahan (I’lāl)', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Konjugasi Kritis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-mutal-mithal',
                        cells: {
                            mutalType: { script: '1. المِثَالُ (Huruf Penyakit di Awal: وَجَدَ / وَصَلَ)', gloss: 'Huruf pertama berupa Wāw' },
                            formula: {
                                script: 'Huruf Wāw GUGUR pada Fi’il Muḍāri’ & Amr jika ‘Ain Fi’il berharakat Kasrah',
                                gloss: 'وَصَلَ → يَصِلُ (bukan يَوْصِلُ) → صِلْ!',
                            },
                            example: {
                                script: 'وَجَدَ → يَجِدُ → جِدْ! | وَقَفَ → يَقِفُ → قِفْ!',
                                reading: 'wajada → yajidu → jid! | waqafa → yaqifu → qif!',
                                gloss: 'Menemukan → Temukanlah! | Berhenti → Berhentilah!',
                            },
                        },
                        fullTranslation: 'Menemukan → Temukanlah! | Berhenti → Berhentilah!',
                    },
                    {
                        id: 'ar-mutal-ajwaf',
                        cells: {
                            mutalType: { script: '2. الأَجْوَفُ (Huruf Penyakit di Tengah: قَالَ / بَاعَ)', gloss: 'Akar ق-و-ل & ب-ي-ع' },
                            formula: {
                                script: 'Huruf tengah GUGUR saat bertemu sukūn (dhamir هُنَّ / أَنْتَ / أَنَا / لَمْ / Amr)',
                                gloss: 'Mencegah bertemunya dua huruf mati (اِلْتِقَاءُ السَّاكِنَيْنِ)',
                            },
                            example: {
                                script: 'قَالَ → يَقُولُ → قُلْتُ (saya berkata) → قُلْ (katakanlah!) → لَمْ يَقُلْ',
                                reading: 'qāla → yaqūlu → qultu → qul → lam yaqul',
                                gloss: 'Perhatikan perubahan vokal: قُلْتُ (dari Wāw) vs بِعْتُ (dari Yā’ pada بَاعَ)',
                            },
                        },
                        fullTranslation: 'Berkata (قَالَ) → Saya berkata (قُلْتُ) → Katakanlah (قُلْ)',
                    },
                    {
                        id: 'ar-mutal-naqis',
                        cells: {
                            mutalType: { script: '3. النَّاقِصُ (Huruf Penyakit di Akhir: دَعَا / رَمَى)', gloss: 'Akar د-ع-و & ر-م-ي' },
                            formula: {
                                script: 'Huruf akhir GUGUR saat Jazm (لَمْ) dan saat Fi’il Amr (tanpa Alif/Wāw/Yā’)',
                                gloss: 'Digantikan oleh harakat pendek yang sesuai',
                            },
                            example: {
                                script: 'دَعَا → يَدْعُو → لَمْ يَدْعُ → اُدْعُ! | رَمَى → يَرْمِي → لَمْ يَرْمِ → اِرْمِ!',
                                reading: 'da‘ā → yad‘ū → lam yad‘u → ud‘u! | ramā → yarmī → lam yarmi → irmi!',
                                gloss: 'Berdoalah (اُدْعُ tanpa و) | Lemparkanlah (اِرْمِ tanpa ي)',
                            },
                        },
                        fullTranslation: 'Berdoa (دَعَا) → Berdoalah (اُدْعُ) | Melempar (رَمَى) → Lemparkanlah (اِرْمِ)',
                    },
                ],
                nativeMindset: {
                    headline: 'Hukum Anti-Tabrakan Sukūn (اِلْتِقَاءُ السَّاكِنَيْنِ): Kunci Seluruh Perubahan Fi’il Mu’tal',
                    psychologyExplanation:
                        'Lidah Arab tidak mengizinkan dua huruf mati bertemu dalam satu suku kata. Pada kata قَالَ (Alif sukun), ketika huruf Lām disukunkan untuk perintah (قَالْ), Alif di tengah otomatis gugur sehingga menjadi قُلْ (katakanlah!).',
                    literalTrap:
                        'Jangan menulis "قُولْ" atau "اُدْعُو" untuk perintah tunggal—huruf panjangnya wajib dipangkas menjadi "قُلْ" dan "اُدْعُ".',
                },
            },

            // -------------------- UNIT 5.3: USLŪB SYARṬ --------------------
            {
                type: 'cognitive-pattern-table',
                title: '5.3 Uslūb asy-Syarṭ (أُسْلُوبُ الشَّرْطِ) — Kalimat Pengandaian Jazm vs Non-Jazm',
                grammaticalTradition: 'Ilmu Naḥwu Mahir Unit 3/3: أَدَوَاتُ الشَّرْطِ الجَازِمَةُ وَغَيْرُ الجَازِمَةِ',
                direction: 'rtl',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel Syarat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Struktur', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Berharakat & Makna', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ar-syart-jazim',
                        cells: {
                            particle: { script: 'إِنْ (Jika) • مَنْ (Barang siapa) • مَا (Apa pun)', gloss: 'Menyebabkan Jazm (Sukūn) pada DUA kata kerja!' },
                            formula: {
                                script: 'أَدَاةُ الشَّرْطِ + فِعْلُ الشَّرْطِ (مَجْزُوم) + جَوَابُ الشَّرْطِ (مَجْزُوم)',
                                gloss: 'Kedua kata kerja (syarat dan hasil) sama-sama disukunkan',
                            },
                            example: {
                                script: 'إِنْ تَجْتَهِدْ تَنْجَحْ. / مَنْ يَزْرَعْ يَحْصُدْ.',
                                reading: 'In tajtahid tanjaḥ. / Man yazra‘ yaḥṣud.',
                                gloss: 'Jika engkau bersungguh-sungguh, engkau akan berhasil. / Siapa yang menanam, dia menuai.',
                            },
                        },
                        fullTranslation: 'Jika engkau bersungguh-sungguh, engkau akan berhasil.',
                    },
                    {
                        id: 'ar-syart-ghayr',
                        cells: {
                            particle: { script: 'إِذَا (Apabila pasti) vs لَوْ (Seandainya tidak nyata)', gloss: 'Tidak men-jazm-kan kata kerja' },
                            formula: {
                                script: 'إِذَا + فِعْلٌ مَاضٍ (bermakna masa depan pasti) | لَوْ + فِعْلٌ مَاضٍ + لَـ (jawāb)',
                                gloss: 'لَوْ dipakai untuk pengandaian yang mustahil/tidak terjadi di masa lampau',
                            },
                            example: {
                                script: 'إِذَا جَاءَ الصَّيْفُ سَافَرْنَا. / لَوْ دَرَسْتَ جَيِّدًا لَنَجَحْتَ.',
                                reading: 'Idzā jā’a aṣ-ṣayfu sāfarnā. / Law darasta jayyidan lanajaḥta.',
                                gloss: 'Apabila musim panas tiba, kami akan bepergian. / Seandainya dulu kamu belajar giat, tentu kamu lulus.',
                            },
                        },
                        fullTranslation: 'Apabila musim panas tiba, kami akan bepergian. / Seandainya dulu kamu belajar giat, tentu kamu lulus.',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Presisi Tiga Kata "Jika": إِنْ vs إِذَا vs لَوْ',
                    psychologyExplanation:
                        'Gunakan إِنْ untuk syarat yang belum pasti terjadi (kemungkinan 50:50), إِذَا untuk sesuatu yang pasti akan tiba waktunya (seperti musim, malam, atau kepulangan), dan لَوْ untuk pengandaian berlawanan fakta.',
                    literalTrap:
                        'Jangan melupakan huruf Lām penegas (لَـ) pada jawaban kalimat yang diawali لَوْ (لَوْ... لَـ...).',
                },
            },
        ],
    },
];
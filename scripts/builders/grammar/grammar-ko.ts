// scripts/builders/grammar-ko.ts
import type { LessonModule } from '../../../src/features/lesson-engine/schema/lesson.schema.ts';

export const KO_GRAMMAR_MODULES: LessonModule[] = [
    // =========================================================================
    // MODUL 1: PARTIKEL DASAR SOV KOREA (TOPIK I: 1–2) — BEGINNER
    // =========================================================================
    {
        id: 'ko-02-beg-grammar-core-particles',
        lang: 'ko',
        pillar: 'syntax',
        tier: 'beginner',
        order: 2,
        title: 'TOPIK I (1–2) | Josa (조사): Sistem Partikel Dasar SOV Korea Lengkap',
        subtitle:
            'Bedah terpisah hukum Batchim (konsonan akhir) pada partikel 은/는 vs 이/가, 을/를, serta kontras lokasi 에 vs 에서',
        estimatedMinutes: 70,
        blocks: [
            // -------------------- UNIT 1.1: 은/는 VS 이/가 --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.1 Partikel Topik 은/는 (eun/neun) vs Partikel Subjek Fokus 이/가 (i/ga)',
                grammaticalTradition: 'Unit 1/3: 보조사「은/는」과 주격 조사「이/가」 (Struktur Informasi & Batchim)',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel & Syarat Batchim', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus & Fungsi Wacana', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis Nuansa', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-eun-neun',
                        cells: {
                            particle: { script: '은 (setelah konsonan/Batchim) / 는 (setelah vokal)', gloss: 'Penanda Topik & Kontras' },
                            formula: {
                                script: '[Topik / Perbandingan] + 은/는 + [Komentar]',
                                gloss: 'Membuka topik pembicaraan atau membandingkan dua hal secara kontras',
                            },
                            example: {
                                script: '저는 개발자입니다. 한국어는 재미있지만 한자는 조금 어려워요.',
                                reading: 'Jeoneun gaebaljainnida. Hangugeoneun jaemiitjiman hanjaneun jogeum eoryeowoyo.',
                                gloss: 'Saya adalah pengembang. Bahasa Korea menarik, TAPI Hanja agak sulit (kontras 은/는).',
                            },
                        },
                        fullTranslation: 'Saya adalah seorang developer. Bahasa Korea menarik, tetapi Hanja agak sulit.',
                    },
                    {
                        id: 'ko-i-ga',
                        cells: {
                            particle: { script: '이 (setelah konsonan/Batchim) / 가 (setelah vokal)', gloss: 'Penanda Subjek Fokus / Informasi Baru' },
                            formula: {
                                script: '[Subjek Baru / Jawaban Kata Tanya] + 이/가 + Predikat',
                                gloss: 'Wajib dipakai setelah kata tanya (누가, 무엇이) dan predikat keberadaan/kepemilikan (있다/없다)',
                            },
                            example: {
                                script: '누가 왔어요? — 민수 씨가 왔어요. / 시간이 없어요.',
                                reading: 'Nuga wasseoyo? — Minsu ssiga wasseoyo. / Sigani eopseoyo.',
                                gloss: 'Siapa yang datang? — Minsu-lah yang datang. / Tidak ada waktu.',
                            },
                        },
                        fullTranslation: 'Siapa yang datang? — Minsu yang datang. / Tidak ada waktu.',
                    },
                ],
                nativeMindset: {
                    headline: 'Bentuk Kontraksi Wajib Kata Ganti + 가: "저 + 가" Berubah Jadi "제가"!',
                    psychologyExplanation:
                        'Dalam bahasa Korea, kata ganti orang pertama dan kedua melebur saat bertemu partikel 이/가: 저 + 가 → 제가 (saya sopan), 나 + 가 → 내가 (aku kasual), 너 + 가 → 네가 (kamu kasual, sering dilafalkan niga agar tidak tertukar dengan naega), dan 누구 + 가 → 누가 (siapa).',
                    literalTrap:
                        'Jangan pernah menulis "저가 했어요" atau "누구가 왔어요"—wajib gunakan bentuk leburan "제가 했어요" dan "누가 왔어요".',
                },
            },

            // -------------------- UNIT 1.2: 을/를 & 의 --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.2 Partikel Objek 을/를 (eul/reul) & Partikel Kepemilikan 의 (ui)',
                grammaticalTradition: 'Unit 2/3: 목적격 조사「을/를」과 관형격 조사「의」',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel & Syarat Batchim', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus Struktur', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Pelafalan Asli', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-eul-reul',
                        cells: {
                            particle: { script: '을 (dengan Batchim) / 를 (tanpa Batchim)', gloss: 'Penanda Objek Langsung (S-O-V)' },
                            formula: {
                                script: 'Subjek + [Objek + 을/를] + Kata Kerja Transitif',
                                gloss: 'Dalam percakapan lisan kasual, 를 sering disingkat menjadi ㄹ di bawah suku kata vokal (나를 → 날)',
                            },
                            example: {
                                script: '매일 아침에 커피를 마시고 책을 읽어요.',
                                reading: 'Maeil achime keopireul masigo chaegeul ilgeoyo.',
                                gloss: 'Setiap pagi minum kopi (커피+를) dan membaca buku (책+을).',
                            },
                        },
                        fullTranslation: 'Setiap pagi saya minum kopi dan membaca buku.',
                    },
                    {
                        id: 'ko-ui-poss',
                        cells: {
                            particle: { script: '의 (dibaca [에 / e] saat berfungsi sebagai partikel!)', gloss: 'Penanda Kepemilikan / Modifikator' },
                            formula: {
                                script: '[Pemilik] + 의 + [Benda] | Kontraksi: 저의 → 제 | 나의 → 내 | 너의 → 네',
                                gloss: 'Untuk keluarga/institusi milik bersama, penutur Korea memakai 우리 (kami) daripada 제 (saya)',
                            },
                            example: {
                                script: '제 친구의 노트북 / 우리 회사 / 우리나라',
                                reading: 'Je chingu-e noteubuk / Uri hoesa / Urinara',
                                gloss: 'Laptop teman saya / Perusahaan kita (perusahaan saya) / Negara kita (Korea).',
                            },
                        },
                        fullTranslation: 'Laptop teman saya / Perusahaan saya / Negara kita.',
                    },
                ],
                nativeMindset: {
                    headline: 'Psikologi Kolektivisme Korea: Mengapa "Rumah Saya" Disebut "우리 집" (Rumah Kita)?',
                    psychologyExplanation:
                        'Penutur asli Korea jarang menyebut "제 가족" (keluarga saya) atau "제 회사" (perusahaan saya). Karena budaya komunal yang kuat, hal-hal yang dinaungi bersama (keluarga, rumah, sekolah, kantor, negara) selalu memakai kata ganti "우리" (kita/kami): 우리 집, 우리 엄마, 우리 회사.',
                    literalTrap:
                        'Jangan melafalkan partikel 의 sebagai [ui] kaku di tengah kalimat percakapan—penutur asli mengucapkannya sebagai [에 / e] (친구의 = [친구에]).',
                },
            },

            // -------------------- UNIT 1.3: 에 VS 에서 --------------------
            {
                type: 'cognitive-pattern-table',
                title: '1.3 Kontras Vital 에 (e) vs 에서 (eseo) — Titik Statis/Tujuan vs Panggung Aksi Dinamis',
                grammaticalTradition: 'Unit 3/3: 부사격 조사「에」와「에서」의 의미 차이',
                direction: 'ltr',
                columns: [
                    { key: 'particle', roleLabel: 'Partikel Spasial-Temporal', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus & Jenis Predikat', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-e-static',
                        cells: {
                            particle: { script: '에 (e) — Keberadaan, Tujuan & Waktu Spesifik', gloss: 'Statis / Arah Tiba / Jam & Hari' },
                            formula: {
                                script: '[Lokasi] + 에 + 있다/없다/살다 | [Tujuan] + 에 + 가다/오다 | [Jam/Tanggal] + 에',
                                gloss: 'Tidak memakai 에 pada kata waktu relatif: 오늘 (hari ini), 내일 (besok), 어제 (kemarin)',
                            },
                            example: {
                                script: '저는 서울에 살아요. 내일 9시에 회사에 가요.',
                                reading: 'Jeoneun Seoure sarayo. Naeil ahopsie hoesae gayo.',
                                gloss: 'Saya tinggal di Seoul (statis). Besok jam 9 pergi ke kantor (tujuan).',
                            },
                        },
                        fullTranslation: 'Saya tinggal di Seoul. Besok jam 9 pergi ke kantor.',
                    },
                    {
                        id: 'ko-eseo-action',
                        cells: {
                            particle: { script: '에서 (eseo) — Panggung Aktivitas & Titik Asal ("Dari")', gloss: 'Tempat Berlangsungnya Aksi Aktif' },
                            formula: {
                                script: '[Lokasi Aksi] + 에서 + [Kata Kerja Dinamis] | [Titik Asal] + 에서 + 오다/출발하다',
                                gloss: 'Semua aktivitas (makan, belajar, bekerja, membeli, bertemu) wajib memakai 에서',
                            },
                            example: {
                                script: '도서관에서 한국어를 공부해요. 저는 인도네시아에서 왔어요.',
                                reading: 'Doseogwaneseo hangugeoreul gongbuhaeyo. Jeoneun Indonesiaseo wasseoyo.',
                                gloss: 'Belajar bahasa Korea di perpustakaan (aksi). Saya berasal dari Indonesia (asal).',
                            },
                        },
                        fullTranslation: 'Saya belajar bahasa Korea di perpustakaan. Saya berasal dari Indonesia.',
                    },
                ],
                nativeMindset: {
                    headline: 'Aturan Emas untuk Kata Kerja "살다" (Tinggal): 에 vs 에서',
                    psychologyExplanation:
                        'Kata kerja 살다 (tinggal/hidup) adalah satu-satunya kata kerja yang bisa memakai keduanya dengan sedikit nuansa: 서울에 살아요 (fokus pada alamat tempat tinggal tetap) vs 서울에서 살아요 (fokus pada pengalaman menjalani kehidupan sehari-hari di Seoul). Untuk semua kata kerja aksi lainnya, wajib 에서.',
                    literalTrap:
                        'SALAH: 카페에 커피를 마셔요. BENAR: 카페에서 커피를 마셔요 (Minum kopi adalah aksi dinamis di dalam kafe).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 2: KONJUGASI KESOPANAN, KALA & NEGASI (TOPIK I: 1–2) — BEGINNER
    // =========================================================================
    {
        id: 'ko-03-beg-grammar-conjugation-tenses',
        lang: 'ko',
        pillar: 'morphology',
        tier: 'beginner',
        order: 3,
        title: 'TOPIK I (1–2) | Sistem Konjugasi Korea: -아/어요 vs -ㅂ니다, Kala Lampau/Depan & Negasi 안 vs 못',
        subtitle:
            'Bedah hukum Harmoni Vokal (Yangseong vs Eumseong), perbedaan register sopan harian vs formal resmi, serta negasi',
        estimatedMinutes: 80,
        blocks: [
            // -------------------- UNIT 2.1: HARMONI VOKAL & -아/어요 VS -ㅂ니다 --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.1 Harmoni Vokal & Akhiran Sopan Harian (-아/어요) vs Formal Resmi (-ㅂ니다/습니다)',
                grammaticalTradition: 'Unit 1/3: 모음조화 (Harmoni Vokal) & 해요체 vs 하십시오체',
                direction: 'ltr',
                columns: [
                    { key: 'register', roleLabel: 'Tingkat Tutur & Kondisi Vokal', semanticColor: 'violet' },
                    { key: 'formula', roleLabel: 'Rumus Konjugasi dari Akar (Buang 다)', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kata Kerja & Kata Sifat', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-haeyo-yang',
                        cells: {
                            register: { script: '해요체 (-아요): Vokal Terang (ㅏ atau ㅗ)', gloss: 'Percakapan sopan hangat sehari-hari' },
                            formula: {
                                script: 'Akar bervokal akhir ㅏ/ㅗ + 아요 (Kontraksi: 가+아요→가요 | 오+아요→와요)',
                                gloss: 'Hukum Harmoni Vokal Cerah (Yangseong Moeum)',
                            },
                            example: {
                                script: '살다 → 살아요 | 가다 → 가요 | 보다 → 봐요 | 좋다 → 좋아요',
                                reading: 'sarayo • gayo • bwayo • joayo',
                                gloss: 'Tinggal • Pergi • Melihat • Bagus',
                            },
                        },
                        fullTranslation: 'Tinggal • Pergi • Melihat • Bagus (bentuk sopan harian)',
                    },
                    {
                        id: 'ko-haeyo-eum-hada',
                        cells: {
                            register: { script: '해요체 (-어요 / -해요): Vokal Gelap & Kata Kerja 하다', gloss: 'Semua vokal selain ㅏ/ㅗ' },
                            formula: {
                                script: 'Vokal lain (ㅓ, ㅜ, ㅡ, ㅣ) + 어요 (마시+어요→마셔요) | 하다 → 해요 (mutlak!)',
                                gloss: 'Hukum Harmoni Vokal Gelap (Eumseong Moeum) & kontraksi khusus 하다 → 해요',
                            },
                            example: {
                                script: '먹다 → 먹어요 | 마시다 → 마셔요 | 배우다 → 배워요 | 공부하다 → 공부해요',
                                reading: 'meogeoyo • masyeoyo • baewoyo • gongbuhaeyo',
                                gloss: 'Makan • Minum • Belajar • Belajar (studi)',
                            },
                        },
                        fullTranslation: 'Makan • Minum • Belajar • Belajar studi (bentuk sopan harian)',
                    },
                    {
                        id: 'ko-hasipsio-formal',
                        cells: {
                            register: { script: '하십시오체 (-ㅂ니다/습니다): Formal Tinggi', gloss: 'Presentasi, Berita, Wawancara Kerja, Militer' },
                            formula: {
                                script: 'Tanpa Batchim + ㅂ니다 (가다 → 갑니다) | Dengan Batchim + 습니다 (먹다 → 먹습니다)',
                                gloss: 'Bentuk tanya formal: -ㅂ니까? / -습니까? (dilafalkan [-ㅁ니다 / -씀니다])',
                            },
                            example: {
                                script: '감사합니다 (Terima kasih) • 반갑습니다 (Senang bertemu) • 알겠습니다 (Saya mengerti)',
                                reading: 'Gamsahamnida • Bangapseumnida • Algesseumnida',
                                gloss: 'Asimilasi wajib: ㅂ sebelum ㄴ otomatis dilafalkan sebagai [ㅁ]',
                            },
                        },
                        fullTranslation: 'Terima kasih • Senang bertemu Anda • Saya mengerti (formal tinggi)',
                    },
                ],
                nativeMindset: {
                    headline: 'Kapan Memakai -아/어요 vs -ㅂ니다/습니다 di Korea Selatan?',
                    psychologyExplanation:
                        'Penutur Korea mencampur keduanya secara dinamis dalam satu percakapan! Awal perkenalan, presentasi bisnis, atau jawaban tegas memakai -ㅂ니다/습니다 (kesan profesional dan berwibawa), lalu beralih ke -아/어요 saat mengobrol ramah dan membangun kedekatan interpersonal.',
                    literalTrap:
                        'Jangan pernah menulis "하다요" atau "하아요" — kata kerja berakhiran 하다 mutlak berubah menjadi 해요 (공부해요, 일해요, 좋아해요).',
                },
            },

            // -------------------- UNIT 2.2: KALA LAMPAU & KALA DEPAN --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.2 Konjugasi Kala Lampau (-았/었어요) & Kala Depan / Dugaan (-(으)ㄹ 거예요)',
                grammaticalTradition: 'Unit 2/3: 시제 표현 (Past Tense -았/었- & Future/Conjecture -(으)ㄹ 거-)',
                direction: 'ltr',
                columns: [
                    { key: 'tense', roleLabel: 'Kala & Nuansa', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus Konjugasi', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-tense-past',
                        cells: {
                            tense: { script: 'Kala Lampau (-았어요 / -었어요 / -했어요)', gloss: 'Mengikuti aturan Harmoni Vokal yang sama persis!' },
                            formula: {
                                script: 'Vokal ㅏ/ㅗ + 았어요 | Vokal lain + 었어요 | 하다 → 했어요',
                                gloss: 'Sama untuk semua subjek (saya, kamu, mereka tidak mengubah konjugasi)',
                            },
                            example: {
                                script: '어제 친구를 만났어요. / 점심을 먹었어요. / 코드를 배포했어요.',
                                reading: 'Eoje chingureul mannasseoyo. / Jeomsimeul meogeosseoyo. / Kodeureul baepohaesseoyo.',
                                gloss: 'Kemarin bertemu teman. / Sudah makan siang. / Sudah merilis kode.',
                            },
                        },
                        fullTranslation: 'Kemarin saya bertemu teman. / Saya sudah makan siang. / Saya sudah merilis kode.',
                    },
                    {
                        id: 'ko-tense-future',
                        cells: {
                            tense: { script: 'Kala Depan & Prediksi (-(으)ㄹ 거예요)', gloss: 'Rencana masa depan atau dugaan logis' },
                            formula: {
                                script: 'Tanpa Batchim + ㄹ 거예요 | Dengan Batchim + 을 거예요 (Batchim ㄹ tetap: 만들 거예요)',
                                gloss: 'Jika subjek orang ke-1 ("Saya akan..."), bermakna niat/rencana; jika orang ke-3 ("Dia/Cuaca akan..."), bermakna prediksi',
                            },
                            example: {
                                script: '내일 도쿄에 갈 거예요. / 내일은 비가 올 거예요.',
                                reading: 'Naeil Dokyoe gal geoyeyo. / Naeireun biga ol geoyeyo.',
                                gloss: 'Besok saya akan pergi ke Tokyo (rencana). / Besok hujan akan turun (prediksi).',
                            },
                        },
                        fullTranslation: 'Besok saya akan pergi ke Tokyo. / Besok hujan akan turun.',
                    },
                ],
                nativeMindset: {
                    headline: 'Perbedaan Niat Pasti -(으)ㄹ게요 vs Rencana Umum -(으)ㄹ 거예요',
                    psychologyExplanation:
                        'Gunakan -(으)ㄹ 거예요 untuk rencana yang sudah kamu jadwalkan sendiri ("내일 공부할 거예요" = Besok saya akan belajar). Gunakan -(으)ㄹ게요 ketika kamu membuat janji spontan sebagai respons terhadap lawan bicara ("지금 바로 확인해 볼게요" = Baik, akan langsung saya cek sekarang!).',
                    literalTrap:
                        'Jangan memakai -(으)ㄹ게요 untuk subjek orang ketiga ("비가 올게요" — SALAH TOTAL; wajib "비가 올 거예요").',
                },
            },

            // -------------------- UNIT 2.3: DUA NEGASI KOREA (안 VS 못) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '2.3 Dua Jenis Negasi Korea: 안 (an — Pilihan/Fakta) vs 못 (mot — Ketidakmampuan)',
                grammaticalTradition: 'Unit 3/3: 부정 표현「안 / -지 않다」vs「못 / -지 못하다」',
                direction: 'ltr',
                columns: [
                    { key: 'negType', roleLabel: 'Jenis Negasi', semanticColor: 'rose' },
                    { key: 'formula', roleLabel: 'Rumus Pendek vs Rumus Panjang', semanticColor: 'amber' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Posisi pada Kata Kerja 하다', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-neg-an',
                        cells: {
                            negType: { script: '안 / -지 않다 (Tidak — Pilihan / Fakta Netral)', gloss: 'Bisa untuk Kata Kerja maupun Kata Sifat' },
                            formula: {
                                script: '안 + Predikat | [Nomina] + 안 하다 | Akar + -지 않아요',
                                gloss: 'Pada kata kerja [Nomina + 하다] seperti 공부하다, 안 ditaruh DI TENGAH: 공부 안 해요!',
                            },
                            example: {
                                script: '오늘은 커피를 안 마셔요. / 어제 운동 안 했어요. / 맵지 않아요.',
                                reading: 'Oneureun keopireul an masyeoyo. / Eoje undong an haesseoyo. / Maepji anayo.',
                                gloss: 'Hari ini tidak minum kopi (pilihan). / Kemarin tidak berolahraga. / Tidak pedas.',
                            },
                        },
                        fullTranslation: 'Hari ini saya tidak minum kopi. / Kemarin tidak berolahraga. / Tidak pedas.',
                    },
                    {
                        id: 'ko-neg-mot',
                        cells: {
                            negType: { script: '못 / -지 못하다 (Tidak Bisa — Kendala Eksternal)', gloss: 'HANYA untuk Kata Kerja (bukan Kata Sifat!)' },
                            formula: {
                                script: '못 + Kata Kerja | [Nomina] + 못 하다 | Akar + -지 못해요',
                                gloss: 'Menyiratkan keinginan ada, tetapi terhalang waktu, kemampuan, atau situasi',
                            },
                            example: {
                                script: '바빠서 점심을 못 먹었어요. / 한국어를 아직 잘 못 해요.',
                                reading: 'Bappaseo jeomsimeul mot meogeosseoyo. / Hangugeoreul ajik jal mot haeyo.',
                                gloss: 'Karena sibuk, tidak sempat/bisa makan siang. / Belum bisa berbahasa Korea dengan lancar.',
                            },
                        },
                        fullTranslation: 'Karena sibuk, saya tidak sempat makan siang. / Saya belum bisa berbahasa Korea dengan baik.',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Penolakan Undangan di Korea Wajib Memakai "못" Bukan "안"?',
                    psychologyExplanation:
                        'Jika teman mengajak makan lalu kamu menjawab "안 가요" (Saya tidak pergi), terdengar dingin seolah kamu sengaja menolak karena tidak suka. Menjawab "일이 있어서 못 가요" (Karena ada pekerjaan, saya tidak bisa pergi) terdengar sopan karena menunjukkan kamu sebenarnya ingin hadir tetapi terhalang situasi.',
                    literalTrap:
                        'Jangan pernah menulis "안 공부해요" atau "못 공부해요" — pisahkan kata benda dari 하다 menjadi "공부 안 해요" dan "공부 못 해요".',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 3: BULGYUCHIK (IRREGULARS) & KONEKTOR KLAUSA (TOPIK II: 3–4) — INTERMEDIATE
    // =========================================================================
    {
        id: 'ko-04-inter-grammar-irregulars-connectors',
        lang: 'ko',
        pillar: 'syntax',
        tier: 'intermediate',
        order: 4,
        title: 'TOPIK II (3–4) | Bulgyuchik (불규칙 — Kata Kerja Tak Beraturan) & Konektor Klausa Kausal',
        subtitle:
            'Bedah aturan perubahan akar ㅂ, ㄷ, ㅡ, 르, kontras sebab -아서/어서 vs -(으)니까, serta modifikator nomina',
        estimatedMinutes: 80,
        blocks: [
            // -------------------- UNIT 3.1: BULGYUCHIK (IRREGULAR PREDICATES) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.1 Empat Pola Bulgyuchik Utama (ㅂ, ㄷ, ㅡ, 르) Saat Bertemu Akhiran Vokal',
                grammaticalTradition: 'Unit 1/3: 용언의 불규칙 활용 (Morfofonologi Predikat Tidak Beraturan)',
                direction: 'ltr',
                columns: [
                    { key: 'ruleType', roleLabel: 'Jenis Bulgyuchik', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Transformasi Saat Bertemu Vokal (-아/어, -(으)면)', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kata & Pengecualian Beraturan', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-irreg-bieup',
                        cells: {
                            ruleType: { script: '1. ㅂ 불규칙 (Batchim ㅂ → 우)', gloss: 'Sangat umum pada kata sifat Korea!' },
                            formula: {
                                script: 'Buang ㅂ → ganti 우 + 어요 (= 워요) | Khusus 돕다 (membantu) & 곱다 → 오 + 아요 (= 와요)',
                                gloss: 'Saat bertemu konsonan (-습니다), tetap memakai ㅂ (덥습니다)',
                            },
                            example: {
                                script: '덥다 (panas) → 더워요 | 어렵다 (sulit) → 어려워요 | 돕다 → 도와요 (Beraturan: 입다 → 입어요)',
                                reading: 'deowoyo • eoryeowoyo • dowayo',
                                gloss: 'Panas • Sulit • Membantu (Pengecualian beraturan: 입다 memakai baju → 입어요)',
                            },
                        },
                        fullTranslation: 'Panas (더워요) • Sulit (어려워요) • Membantu (도와요)',
                    },
                    {
                        id: 'ko-irreg-digeut',
                        cells: {
                            ruleType: { script: '2. ㄷ 불규칙 (Batchim ㄷ → ㄹ)', gloss: 'Khusus kata kerja gerak/persepsi tertentu' },
                            formula: {
                                script: 'Ubah Batchim ㄷ menjadi ㄹ sebelum vokal (-어요 / -(으)면)',
                                gloss: 'Beraturan (tetap ㄷ): 받다 (menerima → 받아요), 믿다 (percaya → 믿어요), 닫다 (menutup → 닫아요)',
                            },
                            example: {
                                script: '듣다 (mendengar) → 들어요 | 걷다 (berjalan kaki) → 걸어요 | 묻다 (bertanya) → 물어요',
                                reading: 'deureoyo • georeoyo • mureoyo',
                                gloss: 'Mendengar • Berjalan kaki • Bertanya',
                            },
                        },
                        fullTranslation: 'Mendengar (들어요) • Berjalan kaki (걸어요) • Bertanya (물어요)',
                    },
                    {
                        id: 'ko-irreg-eu-reu',
                        cells: {
                            ruleType: { script: '3. ㅡ 탈락 (Gugur ㅡ) & 4. 르 불규칙 (르 → ㄹ라/ㄹ러)', gloss: 'Vokal lemah ㅡ luluh' },
                            formula: {
                                script: 'ㅡ gugur dan melihat vokal suku kata sebelumnya | 르 berubah menjadi ㄹ라 (ㅏ/ㅗ) atau ㄹ러 (lainnya)',
                                gloss: 'Selalu menggandakan konsonan ㄹ di suku kata sebelumnya pada pola 르',
                            },
                            example: {
                                script: '쓰다 → 써요 | 바쁘다 → 바빠요 | 빠르다 → 빨라요 | 모르다 → 몰라요 | 부르다 → 불러요',
                                reading: 'sseoyo • bappayo • ppallayo • mollayo • bulleoyo',
                                gloss: 'Menulis • Sibuk • Cepat • Tidak tahu • Memanggil/menyanyi',
                            },
                        },
                        fullTranslation: 'Menulis • Sibuk • Cepat • Tidak tahu • Memanggil',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa Bentuk Sopan dari "어렵다" Menjadi "어려워요" Bukan "어렵어요"?',
                    psychologyExplanation:
                        'Dalam sejarah bahasa Korea Pertengahan, huruf ㅂ di antara dua vokal melemah menjadi bunyi bilabial ringan [w] (우). Perubahan ini tetap dipertahankan dalam ejaan Hangeul modern sehingga semua kata sifat ber-Batchim ㅂ (쉽다, 춥다, 아름답다, 고맙다) meluncur lembut menjadi 쉬워요, 추워요, 아름다워요, 고마워요.',
                    literalTrap:
                        'Jangan menerapkan ㅂ-irregular pada kata kerja 입다 (memakai pakaian), 잡다 (menangkap), dan 좁다 (sempit)—ketiganya beraturan (입어요, 잡아요, 좁아요).',
                },
            },

            // -------------------- UNIT 3.2: -아서/어서 VS -(으)니까 --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.2 Kontras Konektor Sebab-Akibat: -아서/어서 vs -(으)니까',
                grammaticalTradition: 'Unit 2/3: 이유·원인 연결어미「-아서/어서」vs「-(으)니까」',
                direction: 'ltr',
                columns: [
                    { key: 'connector', roleLabel: 'Konektor & Batasan Ketat', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus Struktur', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat & Analisis', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-aseo-eoseo',
                        cells: {
                            connector: { script: '-아서 / -어서 / -해서 (Sebab Alami & Ucapan Syukur/Maaf)', gloss: '2 LARANGAN MUTLAK!' },
                            formula: {
                                script: 'Klausa 1 (TANPA -았/었-) + -아서/어서 + Klausa 2 (DILARANG Perintah/Ajakan!)',
                                gloss: 'Wajib dipakai untuk sapaan terima kasih/maaf: 만나서 반갑습니다, 늦어서 죄송합니다',
                            },
                            example: {
                                script: '어제 비가 와서 집에 있었어요. (SALAH: 비가 왔어서)',
                                reading: 'Eoje biga waseo jibe isseosseoyo.',
                                gloss: 'Kemarin karena hujan turun, saya berada di rumah (lampau hanya di klausa akhir!).',
                            },
                        },
                        fullTranslation: 'Kemarin karena hujan turun, saya tinggal di rumah.',
                    },
                    {
                        id: 'ko-eunikka',
                        cells: {
                            connector: { script: '-(으)니까 (Alasan Subjektif / Penemuan Baru)', gloss: 'WAJIB untuk Kalimat Perintah & Ajakan!' },
                            formula: {
                                script: 'Klausa 1 (Boleh pakai -았/었-) + -(으)니까 + Klausa 2 (Perintah -세요 / Ajakan -(으)ㅂ시다)',
                                gloss: 'Memberikan alasan logis di balik saran, perintah, atau ajakan kepada lawan bicara',
                            },
                            example: {
                                script: '날씨가 추우니까 따뜻한 옷을 입으세요. / 시간이 없으니까 빨리 갑시다!',
                                reading: 'Nalssiga chuunikka ttatteuthan oseul ibeuseyo. / Sigani eopseunikka ppalli gapsida!',
                                gloss: 'Karena cuacanya dingin, pakailah baju hangat. / Karena tidak ada waktu, ayo cepat pergi!',
                            },
                        },
                        fullTranslation: 'Karena cuacanya dingin, pakailah pakaian hangat. / Karena tidak ada waktu, ayo cepat pergi!',
                    },
                ],
                nativeMindset: {
                    headline: 'Tes Cepat: Apakah Kalimat Belakangmu Berisi Perintah (-세요) atau Ajakan (-자 / -(으)ㅂ시다)?',
                    psychologyExplanation:
                        'Jika klausa kedua memerintah atau mengajak lawan bicara melakukan sesuatu, kamu DILARANG memakai -아서/어서 dan WAJIB memakai -(으)니까. Sebaliknya, jika kamu meminta maaf atau berterima kasih ("Maaf terlambat"), wajib memakai -아서/어서 (늦어서 미안해요).',
                    literalTrap:
                        'Jangan pernah menempelkan penanda lampau -았/었- sebelum -아서/어서 ("먹었어서" — SALAH TOTAL; cukup "먹어서").',
                },
            },

            // -------------------- UNIT 3.3: GWANHYEONGSA-HYEONG (MODIFIKATOR NOMINA) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '3.3 Modifikator Kata Benda (관형사형): Menjadikan Kata Kerja/Sifat sebagai Penjelas Nomina',
                grammaticalTradition: 'Unit 3/3: 관형사형 어미「-는 / -(으)ㄴ / -(으)ㄹ」 (Klausa Relatif Korea)',
                direction: 'ltr',
                columns: [
                    { key: 'tenseRole', roleLabel: 'Kala & Jenis Predikat', semanticColor: 'amber' },
                    { key: 'formula', roleLabel: 'Rumus Akhiran Sebelum Kata Benda', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Frasa Lengkap', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-mod-present',
                        cells: {
                            tenseRole: { script: 'Kata Kerja Kini (-는) & Kata Sifat (-(으)ㄴ)', gloss: 'Urutan terbalik dari bahasa Indonesia!' },
                            formula: {
                                script: 'Kata Kerja + -는 + Nomina | Kata Sifat + -(으)ㄴ + Nomina (있다/없다 memakai -는!)',
                                gloss: 'Penjelas selalu berada DI DEPAN kata benda yang dijelaskan',
                            },
                            example: {
                                script: '지금 읽는 책 (buku yang sedang dibaca) | 재미있는 영화 (film yang menarik) | 예쁜 꽃 (bunga cantik)',
                                reading: 'jigeum ingneun chaek • jaemiinneun yeonghwa • yeppeun kkot',
                                gloss: 'Perhatikan: 재미있다 dan 맛있다 diakhiri 있다 sehingga memakai -는 (재미있는, 맛있는)!',
                            },
                        },
                        fullTranslation: 'Buku yang sedang dibaca | Film yang menarik | Bunga yang cantik',
                    },
                    {
                        id: 'ko-mod-past-future',
                        cells: {
                            tenseRole: { script: 'Kata Kerja Lampau (-(으)ㄴ) & Masa Depan (-(으)ㄹ)', gloss: 'Sudah dilakukan vs Akan dilakukan' },
                            formula: {
                                script: 'Lampau: Kata Kerja + -(으)ㄴ + Nomina | Depan: Kata Kerja + -(으)ㄹ + Nomina',
                                gloss: 'Membedakan "makanan yang kemarin dimakan" vs "makanan yang akan dimakan"',
                            },
                            example: {
                                script: '어제 먹은 음식 (makanan yang dimakan kemarin) vs 내일 먹을 음식 (makanan yang akan dimakan besok)',
                                reading: 'eoje meogeun eumsik vs naeil meogeul eumsik',
                                gloss: 'Satu huruf akhir (-은 vs -을) menggeser waktu klausa relatif secara presisi',
                            },
                        },
                        fullTranslation: 'Makanan yang dimakan kemarin vs Makanan yang akan dimakan besok',
                    },
                ],
                nativeMindset: {
                    headline: 'Mengapa "맛있는 음식" Memakai -는 Padahal Ia Kata Sifat ("Enak")?',
                    psychologyExplanation:
                        'Secara historis dan morfologis, kata sifat berakhiran 있다/없다 (맛있다 = ada rasa, 재미있다 = ada keseruan, 멋있다 = keren) berkonjugasi mengikuti pola kata kerja eksistensi 있다, sehingga sebelum kata benda wajib memakai -는 (맛있는, 재미있는), BUKAN 맛있은.',
                    literalTrap:
                        'SALAH: 맛있은 커피. BENAR: 맛있는 커피 (Kopi yang enak).',
                },
            },
        ],
    },

    // =========================================================================
    // MODUL 4: HONORIFIK SUBJEK & KALIMAT TIDAK LANGSUNG (TOPIK II: 5–6) — ADVANCED
    // =========================================================================
    {
        id: 'ko-05-adv-grammar-honorifics-indirect',
        lang: 'ko',
        pillar: 'syntax',
        tier: 'advanced',
        order: 5,
        title: 'TOPIK II (5–6) | Sistem Honorifik Subjek -(으)시- (Nopimmal) & Kalimat Tidak Langsung (간접화법)',
        subtitle:
            'Navigasi tingkat kehormatan sosial Korea (Juche Nopimbeop) dan empat pola kutipan tidak langsung tingkat lanjut',
        estimatedMinutes: 70,
        blocks: [
            // -------------------- UNIT 4.1: SISTEM HONORIFIK SUBJEK --------------------
            {
                type: 'cognitive-pattern-table',
                title: '4.1 Sistem Honorifik Subjek -(으)시- & Leksikon Honorifik Khusus (높임말)',
                grammaticalTradition: 'Unit 1/2: 주체 높임법 (Meninggikan Subjek Pelaku Tindakan)',
                direction: 'ltr',
                columns: [
                    { key: 'plain', roleLabel: 'Bentuk Biasa (Netral)', semanticColor: 'amber' },
                    { key: 'honorific', roleLabel: 'Bentuk Honorifik (Untuk Orang Tua / Atasan / Klien)', semanticColor: 'violet' },
                    { key: 'example', roleLabel: 'Contoh Kalimat Lengkap & Partikel 께서', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-hon-si',
                        cells: {
                            plain: { script: 'Rumus Umum: Akar + -(으)시- + Akhiran Kala/Sopan', gloss: '가다 → 가시다 → 가세요 | 읽다 → 읽으시다 → 읽으세요' },
                            honorific: { script: 'Partikel Subjek: 이/가 → 께서 | 은/는 → 께서는 | Kepada: 에게 → 께', gloss: 'Menyisipkan -(으)시- tepat setelah akar kata kerja/sifat' },
                            example: { script: '교수님께서 지금 연구실에서 논문을 읽으세요.', gloss: 'Profesor sedang membaca makalah di ruang riset.' },
                        },
                        fullTranslation: 'Profesor sedang membaca makalah di ruang riset.',
                    },
                    {
                        id: 'ko-hon-lexical',
                        cells: {
                            plain: { script: '먹다/마시다 • 자다 • 있다 • 말하다 • 주다', gloss: '5 Kata Kerja dengan Pengganti Honorifik Khusus' },
                            honorific: { script: '드시다/잡수시다 • 주무시다 • 계시다 • 말씀하시다 • 드리다 (merendah)', gloss: 'Haram memakai 먹으시다 atau 자시다—wajib pakai bentuk leksikal khusus!' },
                            example: { script: '할머니께서 지금 방에서 주무시고 계세요. / 식사 맛있게 드세요!', gloss: 'Nenek sekarang sedang tidur di kamar. / Selamat menikmati hidangan!' },
                        },
                        fullTranslation: 'Nenek sekarang sedang tidur di kamar. / Selamat menikmati hidangan!',
                    },
                ],
                nativeMindset: {
                    headline: 'Hukum Apjjonbeop (압존법): Jangan Meninggikan Kolega/Atasan Menengah di Depan Bos Tertinggi!',
                    psychologyExplanation:
                        'Sama seperti hukum Uchi–Soto Jepang, dalam budaya korporat Korea, jika kamu melapor kepada Direktur Utama (사장님) mengenai Manajer Timmu (과장님), kamu tidak memakai -(으)시- untuk Manajer di depan Direktur ("과장님은 지금 회의에 들어갔습니다", bukan 들어가셨습니다).',
                    literalTrap:
                        'Jangan pernah memakai -(으)시- untuk tindakan dirimu sendiri ("제가 가실게요" — kesalahan fatal).',
                },
            },

            // -------------------- UNIT 4.2: KALIMAT TIDAK LANGSUNG (GANJEOP HWAPBEOP) --------------------
            {
                type: 'cognitive-pattern-table',
                title: '4.2 Empat Pola Kalimat Tidak Langsung Korea (간접화법 — Pernyataan, Tanya, Perintah, Ajakan)',
                grammaticalTradition: 'Unit 2/2: 간접화법의 4가지 유형 (Sintaksis Kutipan Akademik & Jurnalistik)',
                direction: 'ltr',
                columns: [
                    { key: 'clauseType', roleLabel: 'Jenis Kutipan', semanticColor: 'cyan' },
                    { key: 'formula', roleLabel: 'Rumus & Bentuk Kontraksi Lisan', semanticColor: 'rose' },
                    { key: 'example', roleLabel: 'Contoh Kalimat Lengkap', semanticColor: 'emerald' },
                ],
                rows: [
                    {
                        id: 'ko-ind-decl',
                        cells: {
                            clauseType: { script: '1. Pernyataan (Declarative)', gloss: 'Kata Kerja: -는다/ㄴ다고 | Kata Sifat: -다고 | Nomina: -(이)라고' },
                            formula: { script: '[Klausa Pernyataan] + -다고 하다 (Kontraksi lisan: -대요)', gloss: 'Lampau: -았/었다고 하다 (kontraksi: -았/었대요)' },
                            example: { script: '일기예보에서 내일 눈이 온다고 했어요 (온대요).', gloss: 'Prakiraan cuaca mengatakan besok salju akan turun.' },
                        },
                        fullTranslation: 'Prakiraan cuaca mengatakan besok salju akan turun.',
                    },
                    {
                        id: 'ko-ind-inter',
                        cells: {
                            clauseType: { script: '2. Pertanyaan (Interrogative)', gloss: 'Kata Kerja/Sifat: -냐고 | Nomina: -(이)냐고' },
                            formula: { script: '[Klausa Tanya] + -냐고 묻다/하다 (Kontraksi lisan: -냬요)', gloss: 'Mengubah semua pertanyaan langsung menjadi kutipan laporan' },
                            example: { script: '친구가 저에게 언제 한국에 가냐고 물어봤어요.', gloss: 'Teman bertanya kepada saya kapan saya pergi ke Korea.' },
                        },
                        fullTranslation: 'Teman bertanya kepada saya kapan saya pergi ke Korea.',
                    },
                    {
                        id: 'ko-ind-imp-prop',
                        cells: {
                            clauseType: { script: '3. Perintah (-(으)라고) & 4. Ajakan (-자고)', gloss: 'Memerintah vs Mengajak' },
                            formula: { script: 'Perintah: Akar + -(으)라고 하다 (kontraksi: -(으)래요) | Ajakan: Akar + -자고 하다 (kontraksi: -재요)', gloss: 'Khusus 주다 (memberi untuk pembicara) menjadi 달라고 하다!' },
                            example: { script: '의사 선생님이 매일 물을 많이 마시라고 하셨어요. / 친구가 같이 점심을 먹자고 했어요.', gloss: 'Dokter menyuruh minum banyak air setiap hari. / Teman mengajak makan siang bersama.' },
                        },
                        fullTranslation: 'Dokter berpesan agar minum banyak air setiap hari. / Teman mengajak makan siang bersama.',
                    },
                ],
                nativeMindset: {
                    headline: 'Keajaiban Kontraksi Lisan (-대요, -냬요, -래요, -재요)',
                    psychologyExplanation:
                        'Penutur asli Korea jarang mengucapkan "-다고 해요" atau "-자고 해요" secara penuh dalam percakapan sehari-hari; mereka memadatkannya menjadi akhiran 2 suku kata yang super ringkas: -대요 ("katanya..."), -냬요 ("dia nanya apakah..."), -래요 ("dia nyuruh..."), dan -재요 ("dia ngajak...").',
                    literalTrap:
                        'Ingat pengecualian kutipan perintah dengan kata kerja 주다 (memberi): jika seseorang meminta sesuatu untuk dirinya sendiri ("Tolong beri saya air"), kutipan tidak langsungnya adalah "물을 달라고 했어요", BUKAN "물을 주라고 했어요".',
                },
            },
        ],
    },
];
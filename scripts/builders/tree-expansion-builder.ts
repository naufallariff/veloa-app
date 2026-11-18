// scripts/builders/tree-expansion-builder.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    LessonModuleSchema,
    type LanguageCode,
    type LessonModule,
} from '../../src/features/lesson-engine/schema/lesson.schema.ts';
import {
    CURRICULUM_TREES,
    type CurriculumBranch,
    type CurriculumNodeBlueprint,
    type CurriculumStageGroup,
} from '../../src/content/curriculum-tree.ts';
import {
    countModuleEntries,
    type FailedModuleRecord,
    type WriteModuleResult,
} from '../build-curriculum.ts';

interface ExpansionOptions {
    force: boolean;
    retryOnlyIds?: ReadonlySet<string>;
    protectedIds?: ReadonlySet<string>;
    publicDataRoot: string;
    srcModulesRoot: string;
}

interface LanguagePedagogyProfile {
    traditionLabel: string;
    scriptLogic: string;
    specialConditionRule: string;
    exceptionPattern: string;
    registerContrast: string;
    speakerA: string;
    speakerB: string;
    memoryTrick: string;
    literalTrap: string;
}

const LANG_PROFILES: Record<LanguageCode, LanguagePedagogyProfile> = {
    en: {
        traditionLabel: 'English Structural Grammar, Pragmatics & Lexicology',
        scriptLogic:
            'Bahasa Inggris mengandalkan urutan kata ketat (S-V-O), kata kerja bantu (auxiliary), serta kesesuaian kala dan aspek (tense-aspect) untuk mengunci makna waktu dan sikap pembicara.',
        specialConditionRule:
            'Perubahan bentuk kata kerja bantu, kesesuaian subjek-predikat (subject-verb agreement), serta reduksi bunyi dalam ucapan cepat (weak forms & connected speech).',
        exceptionPattern:
            'Bentuk tak beraturan (irregular verbs/plurals), kata kerja statif yang menghindari bentuk continuous, serta pergeseran makna pada phrasal verbs idiomatik.',
        registerContrast:
            'Kontras antara gaya akademis/bisnis (kalimat pasif, nominalisasi, modalitas halus) dengan percakapan kasual harian (kontraksi dan elipsis subjek).',
        speakerA: 'Alex (Mentor)',
        speakerB: 'Maya (Learner)',
        memoryTrick:
            'Kelompokkan pola berdasarkan fungsi komunikatifnya (misal: kepastian vs kemungkinan), lalu latih dengan mengganti subjek dan keterangan waktu secara bergantian.',
        literalTrap:
            'Hindari menerjemahkan imbuhan atau urutan kata bahasa Indonesia secara harfiah (seperti menghilangkan to be atau mencampur kala lampau dengan penanda waktu sekarang).',
    },
    zh: {
        traditionLabel: 'Modern Standard Mandarin (Putonghua) & Sinology',
        scriptLogic:
            'Bahasa Mandarin bersifat analitis tanpa konjugasi kata kerja; urutan posisi (Topik–Komentar / S-V-O), partikel aspek (了, 过, 着), dan kata penggolong (量词) menentukan presisi makna.',
        specialConditionRule:
            'Hukum perubahan nada (Tone Sandhi): nada ke-3 berturut-turut (3+3 → 2+3), serta peluluhan nada pada negator 不 (bù → bú sebelum nada ke-4) dan 一 (yī).',
        exceptionPattern:
            'Perbedaan negasi 没(有) untuk fakta objektif/lampau vs 不 untuk kebiasaan/kehendak, serta larangan menggabungkan 了 dengan kata kerja statif atau kebiasaan.',
        registerContrast:
            'Perbedaan antara bahasa tulis formal/Chengyu (书面语 — ringkas dan padat) dengan bahasa lisan sehari-hari (口语 — kaya partikel modal 吧, 呢, 啊).',
        speakerA: 'Lín Lǎoshī (林老师)',
        speakerB: 'Chén Míng (陈明)',
        memoryTrick:
            'Hafalkan setiap kosakata baru beserta nada dan kata penggolong (measure word) pasangannya sebagai satu paket bunyi utuh, bukan karakter terpisah.',
        literalTrap:
            'Jangan menyamakan 了 (le) dengan "sudah" dalam bahasa Indonesia—了 menandai perubahan keadaan atau selesainya aksi relatif terhadap titik waktu cerita.',
    },
    ja: {
        traditionLabel: 'Japanese Morphological & Syntactic Analysis (Nihongo Bunpō)',
        scriptLogic:
            'Bahasa Jepang berstruktur S-O-V aglutinatif: partikel pascaposisi (は, が, を, に, で) mengikat peran setiap kata benda, sementara predikat di akhir kalimat menentukan kala dan tingkat kesopanan.',
        specialConditionRule:
            'Perubahan fonologis (Onbin/Gemination) pada konjugasi bentuk -て dan -た, serta gejala peluluhan konsonan Rendaku (連濁) pada kata majemuk Kanji.',
        exceptionPattern:
            'Perbedaan bacaan On’yomi (bunyi Tionghoa) vs Kun’yomi (bunyi asli Jepang) pada Kanji yang sama, serta pasangan kata kerja transitif-intransitif (他動詞 vs 自動詞).',
        registerContrast:
            'Pergeseran antara bentuk sopan standar (丁寧語 Desu/Masu), ragam kasual akrab (タメ口), hingga bahasa hormat tinggi (尊敬語 Sonkeigo & 謙譲語 Kenjōgo).',
        speakerA: 'Satō-san (佐藤さん)',
        speakerB: 'Tanaka-kun (田中くん)',
        memoryTrick:
            'Selalu baca kalimat Jepang dari belakang ke depan saat membedah struktur panjang: temukan predikat akhir terlebih dahulu, lalu hubungkan tiap partikel di depannya.',
        literalTrap:
            'Jangan menerjemahkan kata ganti "kamu" (あなた) secara berulang—penutur asli Jepang menghilangkan subjek jika sudah jelas dan menyebut nama + -さん.',
    },
    ar: {
        traditionLabel: 'Classical & Modern Standard Arabic (An-Naḥw wa aṣ-Ṣarf)',
        scriptLogic:
            'Bahasa Arab bertumpu pada sistem akar konsonan tiga huruf (الجذر الثلاثي) yang dicetak ke dalam pola morfologis (الأوزان), serta penanda kasus akhir (الإعراب: رَفْع، نَصْب، جَرّ).',
        specialConditionRule:
            'Asimilasi huruf Syamsiyah (اللام الشمسية) vs Qamariyah pada sandang الـ, perubahan harakat akhir akibat faktor sintaksis (العوامل), dan kesesuaian gender-jumlah (المطابقة).',
        exceptionPattern:
            'Kata benda tidak beraturan (جمع التكسير / Jamak Taksir), kata benda tidak bertanwin (الممنوع من الصرف), serta kata kerja berhuruf illat (المعتل).',
        registerContrast:
            'Keseimbangan antara Bahasa Arab Baku Modern/Klasik (الفصحى — Fusha) untuk literasi, media, dan forum resmi dengan variasi ungkapan lisan sehari-hari.',
        speakerA: 'Al-Ustādz Ṭāriq (الأستاذ طارق)',
        speakerB: 'Yūsuf (يوسف)',
        memoryTrick:
            'Identifikasi 3 huruf akar konsonan (ف - ع - ل) dari setiap kata baru terlebih dahulu; satu akar yang sama akan membuka puluhan makna turunan secara sistematis.',
        literalTrap:
            'Jangan menyisipkan kata kerja kopula "adalah" pada kalimat nominal (الجملة الاسمية) waktu kini—cukup sandingkan Mubtada’ (ma’rifah) dan Khabar (nakirah).',
    },
    ko: {
        traditionLabel: 'Korean Agglutinative Syntax & Honorific Pragmatics',
        scriptLogic:
            'Bahasa Korea menggunakan susunan S-O-V dengan partikel penanda fungsi (조사) dan akhiran verba bertingkat (어미) yang menyandikan kala, hubungan klausa, dan hierarki sosial.',
        specialConditionRule:
            'Hukum asimilasi bunyi Batchim (받침 — liaison/연음, nasalisasi, palatalisasi) serta hukum Harmoni Vokal terang (ㅏ/ㅗ) vs gelap (ㅓ/ㅜ/ㅡ/ㅣ) saat konjugasi.',
        exceptionPattern:
            'Kata kerja/sifat tak beraturan (불규칙 활용: ㅂ, ㄷ, ㅡ, 르, ㄹ), kontraksi wajib kata ganti (저+가 → 제가), serta pemisahan negasi 안/못 di tengah kata kerja 하다.',
        registerContrast:
            'Transisi dinamis antara gaya formal tinggi (하십시오체 -ㅂ니다), sopan hangat sehari-hari (해요체 -아/어요), dan ragam akrab tanpa honorifik (반말).',
        speakerA: 'Kim Seonsaengnim (김선생님)',
        speakerB: 'Jiwon (지원)',
        memoryTrick:
            'Periksa selalu apakah suku kata terakhir memiliki konsonan akhir (Batchim) atau tidak—hampir seluruh partikel dan akhiran Korea berpasangan berdasarkan syarat Batchim.',
        literalTrap:
            'Hindari menyalin pola bahasa Indonesia yang mengulang subjek saya/kamu; dalam bahasa Korea, subjek yang sudah dipahami konteksnya selalu dilesapkan.',
    },
};

function synthesizeRichModule(
    lang: LanguageCode,
    stage: CurriculumStageGroup,
    branch: CurriculumBranch,
    bp: CurriculumNodeBlueprint,
    order: number,
): LessonModule {
    const isRtl = lang === 'ar';
    const dir: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
    const profile = LANG_PROFILES[lang];

    const blocks: LessonModule['blocks'] = [
        // =========================================================================
        // KARTU 1: RUMUS INTI & ANATOMI STRUKTUR
        // =========================================================================
        {
            type: 'cognitive-pattern-table',
            title: `1. Rumus Inti & Anatomi Struktur: ${bp.title}`,
            grammaticalTradition: `${stage.stageBadge} · ${profile.traditionLabel}`,
            direction: dir,
            columns: [
                {
                    key: 'element',
                    roleLabel: 'Komponen & Peran',
                    semanticColor: 'violet',
                },
                {
                    key: 'formula',
                    roleLabel: 'Rumus Baku & Penanda',
                    semanticColor: 'amber',
                },
                {
                    key: 'anchor',
                    roleLabel: 'Realisasi Target',
                    semanticColor: 'emerald',
                },
            ],
            rows: [
                {
                    id: `${bp.id}-card1-row1`,
                    cells: {
                        element: {
                            script: branch.title,
                            gloss: `Pilar ${bp.pillar.toUpperCase()} · ${stage.title}`,
                        },
                        formula: {
                            script: bp.focusFormula,
                            gloss: 'Pola utama yang menjadi kerangka pembentukan kalimat',
                        },
                        anchor: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: bp.sampleMeaning,
                        },
                    },
                    fullTranslation: bp.sampleMeaning,
                },
                {
                    id: `${bp.id}-card1-row2`,
                    cells: {
                        element: {
                            script: 'Fungsi Komunikatif',
                            gloss: bp.subtitle,
                        },
                        formula: {
                            script: `Kapasitas Korpus: ${bp.entryCount.toLocaleString('id-ID')} unit leksikal/pola`,
                            gloss: `Estimasi penguasaan aktif: ±${bp.estimatedMinutes} menit`,
                        },
                        anchor: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: 'Perhatikan batas morfem dan posisi penanda fungsi utama',
                        },
                    },
                    fullTranslation: `${bp.title}: ${bp.sampleMeaning}`,
                },
            ],
            nativeMindset: {
                headline: `Cara Kerja Pola "${bp.focusFormula}" di Benak Penutur Asli`,
                psychologyExplanation: profile.scriptLogic,
                literalTrap: profile.literalTrap,
            },
        },

        // =========================================================================
        // KARTU 2: PENJELASAN MENDALAM & LOGIKA SISTEM
        // =========================================================================
        {
            type: 'linguistic-lore',
            title: `2. Penjelasan Mendalam & Logika Sistem: ${bp.title}`,
            eraOrDomain: `${stage.stageBadge} · Analisis Kognitif & Struktural`,
            direction: dir,
            narrativeSummary: `${bp.subtitle}. Dalam cabang "${branch.title}", konstruksi "${bp.focusFormula}" berfungsi mengikat hubungan makna antarunsur kalimat secara presisi sehingga pendengar langsung menangkap maksud, fokus informasi, dan sikap pembicara tanpa ambiguitas.`,
            milestones: [
                {
                    stage: 'Tahap 1 — Identifikasi Kerangka Dasar',
                    reading: bp.focusFormula,
                    scriptSample: bp.sampleTarget,
                    explanation: `Kenali terlebih dahulu inti konstruksi pada contoh "${bp.sampleTarget}" (${bp.sampleReading}). Pisahkan unsur pokok dari penanda gramatikal atau imbuhan yang melekat padanya.`,
                },
                {
                    stage: 'Tahap 2 — Pemetaan Peran & Urutan Unsur',
                    reading: bp.sampleReading,
                    scriptSample: bp.sampleTarget,
                    explanation: `${branch.description} Pastikan setiap komponen menempati posisi sintaksis yang tepat sesuai rumus "${bp.focusFormula}" sebelum menambahkan keterangan waktu, tempat, atau modalitas.`,
                },
                {
                    stage: 'Tahap 3 — Produksi Aktif & Otomatisasi',
                    reading: bp.sampleReading,
                    scriptSample: bp.sampleTarget,
                    explanation: `Uji pemahaman dengan mengganti kosakata pengisi slot pada rumus "${bp.focusFormula}" sambil mempertahankan ketepatan bunyi, nada/harakat, dan kesesuaian tingkat tutur.`,
                },
            ],
            structuralRules: [
                {
                    conceptName: `Mekanisme Inti: ${bp.title}`,
                    definition: `Pola "${bp.focusFormula}" mengatur bagaimana unsur utama dirangkai untuk mengekspresikan makna "${bp.sampleMeaning}".`,
                    whyItMatters:
                        'Kesalahan pada penanda struktural inti dapat mengubah arti kalimat secara menyeluruh atau membuat tuturan terdengar kaku bagi penutur asli.',
                    examples: [bp.sampleTarget],
                },
                {
                    conceptName: 'Kohesi Wacana & Ketepatan Bentuk',
                    definition: profile.scriptLogic,
                    whyItMatters:
                        'Menjembatani pemahaman pasif (membaca/menyimak) menjadi kemampuan produksi kalimat mandiri yang alami.',
                    examples: [bp.focusFormula],
                },
            ],
            funFactsAndTips: [profile.memoryTrick],
        },

        // =========================================================================
        // KARTU 3: CONTOH MULTI-KONDISI (AFIRMATIF, KONTRASTIF & TERAPAN)
        // =========================================================================
        {
            type: 'cognitive-pattern-table',
            title: `3. Contoh Multi-Kondisi & Variasi Penerapan: ${bp.title}`,
            grammaticalTradition: 'Simulasi Penggunaan Lintas Situasi (Dasar, Terkontekstualisasi & Analitis)',
            direction: dir,
            columns: [
                {
                    key: 'condition',
                    roleLabel: 'Kondisi Penggunaan',
                    semanticColor: 'cyan',
                },
                {
                    key: 'structure',
                    roleLabel: 'Penerapan Rumus',
                    semanticColor: 'violet',
                },
                {
                    key: 'utterance',
                    roleLabel: 'Bentuk Target & Glosarium',
                    semanticColor: 'emerald',
                },
            ],
            rows: [
                {
                    id: `${bp.id}-card3-cond1`,
                    cells: {
                        condition: {
                            script: 'Kondisi 1: Pernyataan Standar / Netral',
                            gloss: 'Penyampaian informasi langsung secara jelas dan lengkap',
                        },
                        structure: {
                            script: bp.focusFormula,
                            gloss: 'Struktur kanonik tanpa elipsis',
                        },
                        utterance: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: bp.sampleMeaning,
                        },
                    },
                    fullTranslation: bp.sampleMeaning,
                },
                {
                    id: `${bp.id}-card3-cond2`,
                    cells: {
                        condition: {
                            script: 'Kondisi 2: Penekanan Makna & Fokus Informasi',
                            gloss: 'Menonjolkan unsur penting dalam konteks percakapan nyata',
                        },
                        structure: {
                            script: `Konteks [${branch.title}] → ${bp.focusFormula}`,
                            gloss: 'Perhatikan intonasi dan jeda frasa pada bagian kunci',
                        },
                        utterance: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: `Makna kontekstual: "${bp.sampleMeaning}"`,
                        },
                    },
                    fullTranslation: bp.sampleMeaning,
                },
                {
                    id: `${bp.id}-card3-cond3`,
                    cells: {
                        condition: {
                            script: 'Kondisi 3: Evaluasi & Verifikasi Pemahaman',
                            gloss: 'Membandingkan struktur target dengan padanan bahasa Indonesia',
                        },
                        structure: {
                            script: `Target (${lang.toUpperCase()}) ≠ Terjemahan Kata-per-Kata`,
                            gloss: 'Fokus pada keutuhan blok makna (chunking)',
                        },
                        utterance: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: `Padanan alami: ${bp.sampleMeaning}`,
                        },
                    },
                    fullTranslation: bp.sampleMeaning,
                },
            ],
            nativeMindset: {
                headline: 'Prinsip Chunking dalam Berbagai Situasi Tutur',
                psychologyExplanation: `Penutur asli memperlakukan "${bp.focusFormula}" sebagai satu unit makna utuh (lexical chunk), lalu menyesuaikan penekanan intonasi serta tingkat kesopanan sesuai lawan bicara.`,
                literalTrap: profile.literalTrap,
            },
        },

        // =========================================================================
        // KARTU 4: KONDISI KHUSUS & PENGECUALIAN
        // =========================================================================
        {
            type: 'cognitive-pattern-table',
            title: `4. Kondisi Khusus, Perubahan Bentuk & Pengecualian`,
            grammaticalTradition: 'Aturan Batas Morfem, Fonologi & Pengecualian Wajib',
            direction: dir,
            columns: [
                {
                    key: 'category',
                    roleLabel: 'Kategori Kaidah',
                    semanticColor: 'rose',
                },
                {
                    key: 'mechanism',
                    roleLabel: 'Mekanisme & Syarat',
                    semanticColor: 'amber',
                },
                {
                    key: 'reference',
                    roleLabel: 'Acuan & Contoh',
                    semanticColor: 'violet',
                },
            ],
            rows: [
                {
                    id: `${bp.id}-card4-special`,
                    cells: {
                        category: {
                            script: 'Kondisi Khusus Fonologis & Morfologis',
                            gloss: 'Perubahan bentuk saat unsur bertemu dalam kalimat',
                        },
                        mechanism: {
                            script: profile.specialConditionRule,
                            gloss: 'Wajib diperhatikan baik saat menulis maupun melafalkan dengan kecepatan normal',
                        },
                        reference: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: `Pola acuan: ${bp.focusFormula}`,
                        },
                    },
                    fullTranslation: profile.specialConditionRule,
                },
                {
                    id: `${bp.id}-card4-exception`,
                    cells: {
                        category: {
                            script: 'Pengecualian & Batasan Larangan',
                            gloss: 'Kasus yang menyimpang dari kaidah umum',
                        },
                        mechanism: {
                            script: profile.exceptionPattern,
                            gloss: 'Hindari generalisasi berlebihan terhadap pola dasar',
                        },
                        reference: {
                            script: bp.focusFormula,
                            gloss: profile.literalTrap,
                        },
                    },
                    fullTranslation: profile.exceptionPattern,
                },
            ],
            nativeMindset: {
                headline: 'Checklist Anti-Salah Sebelum Menggunakan Pola Ini',
                psychologyExplanation: profile.exceptionPattern,
                literalTrap: profile.literalTrap,
            },
        },

        // =========================================================================
        // KARTU 5: TIPS & TRIK + BANK LEKSIKON KUNCI
        // =========================================================================
        {
            type: 'vocabulary-deck',
            title: `5. Tips, Trik & Leksikon Kunci: ${bp.title}`,
            direction: dir,
            totalCount: 1,
            entries: [
                {
                    id: `${bp.id}-voc-1`,
                    term: bp.sampleTarget,
                    reading: bp.sampleReading,
                    meaning: bp.sampleMeaning,
                    partOfSpeech: `${bp.pillar.toUpperCase()} · ${stage.stageBadge}`,
                    patternNote: `Trik Penguasaan: ${profile.memoryTrick} | Rumus: ${bp.focusFormula}`,
                    exampleSentence: bp.sampleTarget,
                    exampleTranslation: bp.sampleMeaning,
                },
            ],
        },

        // =========================================================================
        // KARTU 6: NUANSA KONTEKS, REGISTER & SIMULASI PERCAKAPAN
        // =========================================================================
        {
            type: 'dialogue-theater',
            title: `6. Nuansa Konteks & Simulasi Percakapan: ${bp.title}`,
            registerLevel: `${stage.stageBadge} · Konteks Autentik`,
            contextSituation: profile.registerContrast,
            direction: dir,
            turns: [
                {
                    speaker: profile.speakerA,
                    line: bp.sampleTarget,
                    reading: bp.sampleReading,
                    translation: `${bp.sampleMeaning} — (Penerapan langsung pola "${bp.focusFormula}")`,
                    grammarHighlight: bp.focusFormula,
                },
                {
                    speaker: profile.speakerB,
                    line: bp.sampleTarget,
                    reading: bp.sampleReading,
                    translation: `${bp.sampleMeaning} — (Pengulangan aktif dengan pelafalan alami)`,
                    grammarHighlight: branch.title,
                },
            ],
        },
    ];

    // Tambahkan kartu analisis stilistika tambahan khusus untuk zona Sastra & Retorika
    if (stage.zone === 'LITERATURE') {
        blocks.push({
            type: 'rhetoric-stylistics',
            title: `Kajian Sastra & Estetika Stilistika: ${bp.title}`,
            traditionName: profile.traditionLabel,
            direction: dir,
            overview: `${stage.subtitle}. ${profile.registerContrast}`,
            devices: [
                {
                    deviceName: branch.title,
                    nativeTerm: bp.focusFormula,
                    mechanism: bp.subtitle,
                    literaryExample: bp.sampleTarget,
                    reading: bp.sampleReading,
                    translation: bp.sampleMeaning,
                    aestheticEffect:
                        'Menghadirkan kedalaman makna, irama puitis, dan presisi stilistika tingkat lanjut.',
                },
            ],
            dialectAndSlangNotes: [],
        });
    }

    return LessonModuleSchema.parse({
        id: bp.id,
        lang,
        pillar: bp.pillar,
        tier: stage.legacyTier,
        order,
        title: bp.title,
        subtitle: bp.subtitle,
        estimatedMinutes: bp.estimatedMinutes,
        blocks,
    });
}

export async function buildExpandedTreeModules(
    lang: LanguageCode,
    options: ExpansionOptions,
): Promise<{ results: WriteModuleResult[]; failed: FailedModuleRecord[] }> {
    const tree = CURRICULUM_TREES[lang];
    const allStages: CurriculumStageGroup[] = [
        ...tree.foundationStages,
        ...tree.dictionaryStages,
        ...tree.progressionStages,
        ...tree.literatureStages,
    ];

    const publicOutDir = path.join(options.publicDataRoot, lang, 'modules');
    await fs.mkdir(publicOutDir, { recursive: true });
    await fs.mkdir(options.srcModulesRoot, { recursive: true });

    const results: WriteModuleResult[] = [];
    const failed: FailedModuleRecord[] = [];
    let orderCounter = 100;

    for (const stage of allStages) {
        for (const branch of stage.branches) {
            for (const bp of branch.modules) {
                orderCounter += 1;

                if (options.retryOnlyIds && !options.retryOnlyIds.has(bp.id)) {
                    continue;
                }

                const filename = `${bp.id}.json`;
                const publicFilePath = path.join(publicOutDir, filename);
                const srcFilePath = path.join(options.srcModulesRoot, filename);

                // Lindungi modul korpus & tata bahasa inti agar tidak tertimpa kerangka pohon
                if (options.protectedIds?.has(bp.id)) {
                    try {
                        const coreRaw = await fs.readFile(publicFilePath, 'utf-8');
                        await fs.writeFile(srcFilePath, coreRaw, 'utf-8');
                    } catch {
                        // Abaikan jika hanya ada di salah satu direktori
                    }
                    continue;
                }

                try {
                    if (!options.force && !options.retryOnlyIds) {
                        try {
                            const existingRaw = await fs.readFile(srcFilePath, 'utf-8');
                            const parsedExisting = LessonModuleSchema.parse(JSON.parse(existingRaw));
                            results.push({
                                skipped: true,
                                entriesCount: countModuleEntries(parsedExisting),
                            });
                            continue;
                        } catch {
                            // Belum ada atau perlu dibuat ulang
                        }
                    }

                    const mod = synthesizeRichModule(lang, stage, branch, bp, orderCounter);
                    const serialized = JSON.stringify(mod, null, 2);

                    await Promise.all([
                        fs.writeFile(publicFilePath, serialized, 'utf-8'),
                        fs.writeFile(srcFilePath, serialized, 'utf-8'),
                    ]);

                    results.push({
                        skipped: false,
                        entriesCount: countModuleEntries(mod),
                    });
                } catch (err: unknown) {
                    const reason = err instanceof Error ? err.message : String(err);
                    console.error(`  [WARN] Failed module ${bp.id}: ${reason}`);
                    failed.push({ id: bp.id, lang, reason });
                }
            }
        }
    }

    return { results, failed };
}
// src/features/lesson-engine/utils/enrich-lesson-module.ts
import type { LanguageCode, LessonBlock, LessonModule } from '../schema/lesson.schema';

const LANG_SPEAKERS: Record<
    LanguageCode,
    { name: string; framework: string; speakerA: string; speakerB: string }
> = {
    en: {
        name: 'English',
        framework: 'CEFR',
        speakerA: 'Alex (Mentor)',
        speakerB: 'Maya (Learner)',
    },
    zh: {
        name: 'Mandarin',
        framework: 'HSK',
        speakerA: 'Lín Lǎoshī (林老师)',
        speakerB: 'Chén Míng (陈明)',
    },
    ja: {
        name: 'Jepang',
        framework: 'JLPT',
        speakerA: 'Satō-san (佐藤さん)',
        speakerB: 'Tanaka-kun (田中くん)',
    },
    ar: {
        name: 'Arab',
        framework: 'Naḥwu & CEFR',
        speakerA: 'Al-Ustādz Ṭāriq (الأستاذ طارق)',
        speakerB: 'Yūsuf (يوسف)',
    },
    ko: {
        name: 'Korea',
        framework: 'TOPIK',
        speakerA: 'Kim Seonsaengnim (김선생님)',
        speakerB: 'Jiwon (지원)',
    },
};

const PILLAR_TITLES: Record<LessonModule['pillar'], { title: string; outcome: string }> = {
    script: {
        title: 'Aksara & Ortografi',
        outcome: 'Membaca dan membedakan bentuk karakter serta aturan penulisan baku.',
    },
    phonetics: {
        title: 'Fonetik & Artikulasi',
        outcome: 'Mengenali kontur nada, ritme suku kata, dan pelafalan penutur asli.',
    },
    morphology: {
        title: 'Morfologi & Bentuk Kata',
        outcome: 'Memahami perubahan akar kata, imbuhan, dan sistem konjugasi.',
    },
    syntax: {
        title: 'Sintaksis & Tata Bahasa',
        outcome: 'Menyusun urutan kata, partikel, dan hubungan antar-unsur kalimat secara akurat.',
    },
    'lexicon-dialogue': {
        title: 'Leksikon, Dialog & Gaya Bahasa',
        outcome: 'Menerapkan kosakata dan ungkapan idiomatik dalam percakapan nyata.',
    },
};

const TIER_BADGES: Record<LessonModule['tier'], string> = {
    foundation: 'Foundation · Opsional',
    beginner: 'Core Stage 1 · Beginner',
    intermediate: 'Core Stage 2 · Intermediate',
    advanced: 'Core Stage 3 · Advanced',
    native: 'Mastery & Scholarship · Paralel',
};

interface ExtractedSample {
    target: string;
    reading: string;
    meaning: string;
    note?: string;
}

export function extractCleanTopicName(rawTitle: string): string {
    const parts = rawTitle.split('|');
    const afterPipe = parts.length > 1 ? parts.slice(1).join('|').trim() : rawTitle.trim();
    return afterPipe.split(':')[0]?.trim() || afterPipe;
}

function collectAllSamplesFromBlocks(mod: LessonModule): ExtractedSample[] {
    const results: ExtractedSample[] = [];
    const seen = new Set<string>();

    const pushSample = (s: ExtractedSample) => {
        const cleanTarget = s.target.trim();
        if (!cleanTarget || cleanTarget === '—' || seen.has(cleanTarget)) return;
        seen.add(cleanTarget);
        results.push({
            target: cleanTarget,
            reading: s.reading.trim(),
            meaning: s.meaning.trim() || mod.subtitle,
            note: s.note,
        });
    };

    for (const b of mod.blocks) {
        if (b.type === 'cognitive-pattern-table') {
            for (const row of b.rows) {
                const cellValues = Object.values(row.cells);
                const lastCell = cellValues[cellValues.length - 1];
                if (lastCell?.script) {
                    pushSample({
                        target: lastCell.script,
                        reading: lastCell.reading ?? '',
                        meaning: row.fullTranslation || lastCell.gloss || mod.subtitle,
                        note: row.nuanceNote,
                    });
                }
            }
        } else if (b.type === 'vocabulary-deck') {
            for (const e of b.entries.slice(0, 12)) {
                pushSample({
                    target: e.term,
                    reading: e.reading ?? '',
                    meaning: e.meaning,
                    note: e.exampleSentence
                        ? `${e.exampleSentence} — ${e.exampleTranslation ?? ''}`
                        : e.patternNote,
                });
            }
        } else if (b.type === 'script-matrix') {
            for (const c of b.cells.slice(0, 12)) {
                pushSample({
                    target: c.glyph,
                    reading: c.reading,
                    meaning: c.transliteration,
                    note: c.mnemonic ?? c.componentRole,
                });
            }
        } else if (b.type === 'dialogue-theater') {
            for (const t of b.turns) {
                pushSample({
                    target: t.line,
                    reading: t.reading ?? '',
                    meaning: t.translation,
                    note: t.grammarHighlight,
                });
            }
        } else if (b.type === 'linguistic-lore') {
            for (const m of b.milestones) {
                if (m.scriptSample) {
                    pushSample({
                        target: m.scriptSample,
                        reading: m.reading ?? '',
                        meaning: `${m.stage}: ${m.explanation}`,
                    });
                }
            }
            for (const r of b.structuralRules) {
                for (const ex of r.examples) {
                    pushSample({
                        target: ex,
                        reading: '',
                        meaning: `${r.conceptName}: ${r.definition}`,
                    });
                }
            }
        } else if (b.type === 'rhetoric-stylistics') {
            for (const d of b.devices) {
                pushSample({
                    target: d.literaryExample || d.nativeTerm,
                    reading: d.reading ?? d.nativeTerm,
                    meaning: `${d.deviceName}: ${d.translation}`,
                });
            }
        }
    }

    if (results.length === 0) {
        const topicName = extractCleanTopicName(mod.title);
        pushSample({
            target: topicName,
            reading: LANG_SPEAKERS[mod.lang].framework,
            meaning: mod.subtitle,
        });
    }

    return results;
}

export function ensureSixStructuredBlocks(mod: LessonModule): LessonBlock[] {
    if (mod.blocks.length >= 6) {
        return mod.blocks;
    }

    const isRtl = mod.lang === 'ar';
    const dir: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
    const langMeta = LANG_SPEAKERS[mod.lang];
    const pillarInfo = PILLAR_TITLES[mod.pillar];
    const topicName = extractCleanTopicName(mod.title);
    const samples = collectAllSamplesFromBlocks(mod);
    const primarySample = samples[0]!;
    const secondarySample = samples[1] ?? primarySample;
    const enriched: LessonBlock[] = [...mod.blocks];

    if (!enriched.some((b) => b.type === 'linguistic-lore')) {
        enriched.push({
            type: 'linguistic-lore',
            title: `Penjelasan Mendalam & Logika Sistem: ${topicName}`,
            eraOrDomain: `${langMeta.name} (${langMeta.framework}) · Analisis Konsep`,
            direction: dir,
            narrativeSummary: `${topicName} adalah konsep fundamental dalam bahasa ${langMeta.name} yang berperan untuk: ${mod.subtitle.toLowerCase()}. Memahami logika di balik topik ini membuatmu mampu menyusun dan memahami kalimat secara alami tanpa menerjemahkan kata demi kata.`,
            milestones: [
                {
                    stage: '1. Definisi & Fungsi Utama',
                    reading: primarySample.reading,
                    scriptSample: primarySample.target,
                    explanation: `${topicName} digunakan saat penutur ${langMeta.name} ingin menyampaikan makna "${primarySample.meaning}" dengan struktur yang akurat sesuai kaidah ${pillarInfo.title}.`,
                },
                {
                    stage: '2. Pola Pembentukan & Urutan Unsur',
                    reading: secondarySample.reading,
                    scriptSample: secondarySample.target,
                    explanation: `Perhatikan susunan unsur pada "${secondarySample.target}". Setiap penanda atau karakter memiliki fungsi spesifik yang mengunci hubungan makna dalam kalimat.`,
                },
                {
                    stage: '3. Penerapan Aktif dalam Komunikasi',
                    reading: primarySample.reading,
                    scriptSample: primarySample.target,
                    explanation: `Gunakan tombol audio normal dan lambat (0.72x) untuk meniru ritme, jeda, dan intonasi penutur asli ${langMeta.name}.`,
                },
            ],
            structuralRules: [
                {
                    conceptName: `Inti Bahasan: ${topicName}`,
                    definition: mod.subtitle,
                    whyItMatters: pillarInfo.outcome,
                    examples: samples.slice(0, 3).map((s) => s.target),
                },
            ],
            funFactsAndTips: [
                `Fokuslah pada pola utuh "${primarySample.target}" sebelum mengganti kosakata pengisinya secara bertahap.`,
            ],
        });
    }

    if (enriched.filter((b) => b.type === 'cognitive-pattern-table').length < 2) {
        enriched.push({
            type: 'cognitive-pattern-table',
            title: `Contoh Multi-Kondisi & Pengecualian: ${topicName}`,
            grammaticalTradition: `${langMeta.name} · Analisis Konteks & Batasan Kaidah`,
            direction: dir,
            columns: [
                { key: 'aspect', roleLabel: 'Aspek Analisis', semanticColor: 'cyan' },
                { key: 'rule', roleLabel: 'Kaidah & Catatan Penting', semanticColor: 'amber' },
                { key: 'sample', roleLabel: 'Contoh Acuan', semanticColor: 'emerald' },
            ],
            rows: [
                {
                    id: `${mod.id}-supp-cond`,
                    cells: {
                        aspect: {
                            script: 'Penerapan Standar & Kontekstual',
                            gloss: 'Bentuk baku yang paling umum digunakan penutur asli',
                        },
                        rule: {
                            script: mod.subtitle,
                            gloss: `Pilar ${pillarInfo.title}`,
                        },
                        sample: {
                            script: primarySample.target,
                            reading: primarySample.reading,
                            gloss: primarySample.meaning,
                        },
                    },
                    fullTranslation: primarySample.meaning,
                },
                {
                    id: `${mod.id}-supp-exc`,
                    cells: {
                        aspect: {
                            script: 'Perhatian Khusus & Anti-Salah',
                            gloss: 'Hal yang wajib dihindari saat memakai pola ini',
                        },
                        rule: {
                            script: 'Jangan menyalin urutan kata atau imbuhan bahasa Indonesia secara harfiah',
                            gloss: 'Selalu cek kesesuaian register formal vs kasual',
                        },
                        sample: {
                            script: secondarySample.target,
                            reading: secondarySample.reading,
                            gloss: `Padanan alami: ${secondarySample.meaning}`,
                        },
                    },
                    fullTranslation: `Kaidah penting pada ${topicName}: ${secondarySample.meaning}`,
                },
            ],
            nativeMindset: {
                headline: `Cara Berpikir Penutur Asli ${langMeta.name} pada "${topicName}"`,
                psychologyExplanation: `${topicName} membantu pendengar langsung menangkap konteks dan fungsi tiap bagian kalimat secara efisien.`,
                literalTrap:
                    'Hindari menerjemahkan kata demi kata dari bahasa Indonesia; ikuti kerangka struktur asli bahasa target.',
            },
        });
    }

    if (!enriched.some((b) => b.type === 'vocabulary-deck')) {
        enriched.push({
            type: 'vocabulary-deck',
            title: `Tips, Trik & Leksikon Kunci: ${topicName}`,
            direction: dir,
            totalCount: samples.length,
            entries: samples.slice(0, 6).map((s, idx) => ({
                id: `${mod.id}-supp-voc-${idx + 1}`,
                term: s.target,
                reading: s.reading,
                meaning: s.meaning,
                partOfSpeech: pillarInfo.title,
                patternNote:
                    s.note ?? `Trik: Dengarkan pelafalan lambat (0.72x) lalu ulangi dengan suara lantang.`,
                exampleSentence: s.target,
                exampleTranslation: s.meaning,
            })),
        });
    }

    if (!enriched.some((b) => b.type === 'dialogue-theater')) {
        enriched.push({
            type: 'dialogue-theater',
            title: `Nuansa Konteks & Simulasi Percakapan: ${topicName}`,
            registerLevel: `${TIER_BADGES[mod.tier]} · Simulasi Audio`,
            contextSituation: `Latihan menyimak dan mengucapkan ekspresi kunci dari topik "${topicName}" dalam situasi percakapan nyata.`,
            direction: dir,
            turns: [
                {
                    speaker: langMeta.speakerA,
                    line: primarySample.target,
                    reading: primarySample.reading,
                    translation: primarySample.meaning,
                    grammarHighlight: topicName,
                },
                {
                    speaker: langMeta.speakerB,
                    line: secondarySample.target,
                    reading: secondarySample.reading,
                    translation: secondarySample.meaning,
                    grammarHighlight: pillarInfo.title,
                },
            ],
        });
    }

    while (enriched.length < 6) {
        const stepNum = enriched.length + 1;
        enriched.push({
            type: 'cognitive-pattern-table',
            title: `Ringkasan Terapan #${stepNum}: ${topicName}`,
            grammaticalTradition: `${langMeta.name} · Penguatan Konsep`,
            direction: dir,
            columns: [
                { key: 'focus', roleLabel: 'Fokus Latihan', semanticColor: 'violet' },
                { key: 'note', roleLabel: 'Penjelasan Singkat', semanticColor: 'amber' },
                { key: 'example', roleLabel: 'Contoh Autentik', semanticColor: 'emerald' },
            ],
            rows: [
                {
                    id: `${mod.id}-pad-${stepNum}`,
                    cells: {
                        focus: { script: topicName, gloss: TIER_BADGES[mod.tier] },
                        note: { script: mod.subtitle, gloss: pillarInfo.outcome },
                        example: {
                            script: primarySample.target,
                            reading: primarySample.reading,
                            gloss: primarySample.meaning,
                        },
                    },
                    fullTranslation: primarySample.meaning,
                },
            ],
            nativeMindset: {
                headline: `Intisari ${topicName}`,
                psychologyExplanation: mod.subtitle,
                literalTrap:
                    'Hindari menerjemahkan kata demi kata dari bahasa Indonesia; gunakan struktur dan tingkat tutur asli bahasa target.',
            },
        });
    }

    return enriched;
}

export function enrichLessonModule(mod: LessonModule): LessonModule {
    const blocks = ensureSixStructuredBlocks(mod);
    if (blocks === mod.blocks) return mod;
    return { ...mod, blocks };
}
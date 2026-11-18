// src/features/lesson-engine/components/LessonPlayerPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    BrainCircuit,
    CheckCircle2,
    Circle,
    Clock,
    Eye,
    EyeOff,
    GraduationCap,
    Info,
    Layers,
    ListTree,
    Loader2,
    RotateCcw,
    Search,
    Sparkles,
} from 'lucide-react';
import type { LanguageCode, LessonBlock, LessonModule } from '../schema/lesson.schema';
import {
    getAdjacentModules,
    getManifestItemById,
    loadLessonModule,
    ModuleLoadError,
    prefetchLessonModule,
} from '../services/module-loader';
import { useLessonProgress } from '../hooks/useLessonProgress';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { ActiveRecallArena } from '@/features/practice-engine/components/ActiveRecallArena';

interface LessonPlayerPageProps {
    moduleId: string;
    onBackToHub: () => void;
    onSelectModule: (nextModuleId: string) => void;
    onOpenQuickSearch: () => void;
}

const LANG_META: Record<
    LanguageCode,
    { name: string; native: string; bcp47: string; framework: string; speakerA: string; speakerB: string }
> = {
    en: {
        name: 'English',
        native: 'English',
        bcp47: 'en',
        framework: 'CEFR',
        speakerA: 'Alex (Mentor)',
        speakerB: 'Maya (Learner)',
    },
    zh: {
        name: 'Mandarin',
        native: '普通话',
        bcp47: 'zh-Hans',
        framework: 'HSK',
        speakerA: 'Lín Lǎoshī (林老师)',
        speakerB: 'Chén Míng (陈明)',
    },
    ja: {
        name: 'Jepang',
        native: '日本語',
        bcp47: 'ja',
        framework: 'JLPT',
        speakerA: 'Satō-san (佐藤さん)',
        speakerB: 'Tanaka-kun (田中くん)',
    },
    ar: {
        name: 'Arab',
        native: 'العربية',
        bcp47: 'ar',
        framework: 'Naḥwu & CEFR',
        speakerA: 'Al-Ustādz Ṭāriq (الأستاذ طارق)',
        speakerB: 'Yūsuf (يوسف)',
    },
    ko: {
        name: 'Korea',
        native: '한국어',
        bcp47: 'ko',
        framework: 'TOPIK',
        speakerA: 'Kim Seonsaengnim (김선생님)',
        speakerB: 'Jiwon (지원)',
    },
};

const TIER_LABELS: Record<LessonModule['tier'], { badge: string; focus: string }> = {
    foundation: {
        badge: 'Foundation · Opsional',
        focus: 'Penguasaan fondasi sistem aksara, ortografi, dan ketepatan artikulasi bunyi.',
    },
    beginner: {
        badge: 'Core Stage 1 · Beginner',
        focus: 'Pembentukan struktur kalimat inti, pola dasar, dan kosakata frekuensi tinggi.',
    },
    intermediate: {
        badge: 'Core Stage 2 · Intermediate',
        focus: 'Pengembangan klausa kompleks, aspek gramatikal, dan nuansa konteks komunikasi.',
    },
    advanced: {
        badge: 'Core Stage 3 · Advanced',
        focus: 'Penguasaan wacana tingkat lanjut, ragam formal, dan presisi sintaksis.',
    },
    native: {
        badge: 'Mastery & Scholarship · Paralel',
        focus: 'Eksplorasi retorika, stilistika, ragam sastra, dan dialek penutur asli.',
    },
};

const PILLAR_LABELS: Record<LessonModule['pillar'], { title: string; outcome: string }> = {
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

const SIX_CARD_PEDAGOGY: ReadonlyArray<{
    stepLabel: string;
    roleTitle: string;
    getGuidance: (topicName: string, langName: string) => string;
}> = [
        {
            stepLabel: 'Kartu 01/06',
            roleTitle: 'Rumus Inti & Anatomi Struktur',
            getGuidance: (topic, lang) =>
                `Membedah kerangka dasar, komponen pembentuk, dan rumus utama "${topic}" dalam bahasa ${lang}.`,
        },
        {
            stepLabel: 'Kartu 02/06',
            roleTitle: 'Penjelasan Mendalam & Logika Sistem',
            getGuidance: (topic, lang) =>
                `Memahami cara kerja kognitif dan alasan mengapa penutur asli ${lang} menyusun pola "${topic}" seperti ini.`,
        },
        {
            stepLabel: 'Kartu 03/06',
            roleTitle: 'Contoh Multi-Kondisi & Variasi Penerapan',
            getGuidance: (topic) =>
                `Melihat bagaimana "${topic}" diterapkan dalam berbagai situasi kalimat lengkap dengan pelafalan dan artinya.`,
        },
        {
            stepLabel: 'Kartu 04/06',
            roleTitle: 'Kondisi Khusus, Perubahan Bentuk & Pengecualian',
            getGuidance: (topic) =>
                `Mengantisipasi perubahan bunyi/imbuhan, batas aturan, serta jebakan kesalahan umum pada "${topic}".`,
        },
        {
            stepLabel: 'Kartu 05/06',
            roleTitle: 'Tips, Trik & Leksikon Kunci',
            getGuidance: (topic) =>
                `Strategi menghafal cepat beserta daftar kosakata atau karakter inti yang paling sering muncul pada "${topic}".`,
        },
        {
            stepLabel: 'Kartu 06/06',
            roleTitle: 'Nuansa Konteks & Simulasi Percakapan',
            getGuidance: (topic, lang) =>
                `Melatih pendengaran dan pelafalan alami "${topic}" dalam percakapan kontekstual penutur ${lang}.`,
        },
    ];

interface ExtractedSample {
    target: string;
    reading: string;
    meaning: string;
    note?: string;
}

function extractCleanTopicName(rawTitle: string): string {
    const parts = rawTitle.split('|');
    const afterPipe = parts.length > 1 ? parts.slice(1).join('|').trim() : rawTitle.trim();
    const beforeColon = afterPipe.split(':')[0]?.trim() || afterPipe;
    return beforeColon;
}

/**
 * Mengumpulkan contoh bahasa target autentik dari seluruh blok yang tersedia di dalam modul
 * sehingga kartu pelengkap & kuis latihan selalu berisi materi nyata (tidak pernah kosong / '—').
 */
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
                    note: e.exampleSentence ? `${e.exampleSentence} — ${e.exampleTranslation ?? ''}` : e.patternNote,
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

    // Fallback jika modul hanya memiliki judul bahasa target di kurung (mis. "是, 很, 有")
    if (results.length === 0) {
        const topicName = extractCleanTopicName(mod.title);
        pushSample({
            target: topicName,
            reading: LANG_META[mod.lang].framework,
            meaning: mod.subtitle,
        });
    }

    return results;
}

/**
 * Menjamin seluruh 250 modul di 5 bahasa menyajikan minimal 6 struktur materi lengkap
 * tanpa menghapus data korpus asli.
 */
function ensureSixStructuredBlocks(mod: LessonModule): LessonBlock[] {
    if (mod.blocks.length >= 6) {
        return mod.blocks;
    }

    const isRtl = mod.lang === 'ar';
    const dir: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
    const langMeta = LANG_META[mod.lang];
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
                    explanation: `${topicName} digunakan saat penutur ${langMeta.name} ingin menyampaikan makna "${primarySample.meaning}" dengan struktur yang akurat sesuai kaidah ${PILLAR_LABELS[mod.pillar].title}.`,
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
                    whyItMatters: PILLAR_LABELS[mod.pillar].outcome,
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
                            gloss: `Pilar ${PILLAR_LABELS[mod.pillar].title}`,
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
                partOfSpeech: PILLAR_LABELS[mod.pillar].title,
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
            registerLevel: `${TIER_LABELS[mod.tier].badge} · Simulasi Audio`,
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
                    grammarHighlight: PILLAR_LABELS[mod.pillar].title,
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
                        focus: { script: topicName, gloss: TIER_LABELS[mod.tier].badge },
                        note: { script: mod.subtitle, gloss: PILLAR_LABELS[mod.pillar].outcome },
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

export const LessonPlayerPage: React.FC<LessonPlayerPageProps> = ({
    moduleId,
    onBackToHub,
    onSelectModule,
    onOpenQuickSearch,
}) => {
    const [moduleData, setModuleData] = useState<LessonModule | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reloadNonce, setReloadNonce] = useState<number>(0);
    const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
    const [hidePhoneticAid, setHidePhoneticAid] = useState<boolean>(false);

    const {
        isModuleCompleted,
        toggleModuleCompleted,
        isBlockCompleted,
        toggleBlockCompleted,
        markModuleVisited,
    } = useLessonProgress();

    const manifestMeta = getManifestItemById(moduleId);
    const { previous, next } = getAdjacentModules(moduleId);
    const completed = isModuleCompleted(moduleId);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setErrorMessage(null);
        setIsPracticeMode(false);

        loadLessonModule(moduleId, controller.signal)
            .then((loaded) => {
                if (controller.signal.aborted) return;
                setModuleData(loaded);
                setIsLoading(false);
                markModuleVisited(moduleId);

                if (next) {
                    prefetchLessonModule(next.id);
                }
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                if (err instanceof ModuleLoadError && err.code === 'ABORTED') return;
                setErrorMessage(
                    err instanceof Error ? err.message : 'Gagal memuat konten modul pembelajaran.',
                );
                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [moduleId, reloadNonce, markModuleVisited, next]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [moduleId, isPracticeMode]);

    const langInfo = moduleData
        ? LANG_META[moduleData.lang]
        : manifestMeta
            ? LANG_META[manifestMeta.lang]
            : LANG_META.en;
    const tierInfo = moduleData ? TIER_LABELS[moduleData.tier] : null;
    const pillarInfo = moduleData ? PILLAR_LABELS[moduleData.pillar] : null;

    const structuredBlocks = useMemo(() => {
        if (!moduleData) return [];
        return ensureSixStructuredBlocks(moduleData);
    }, [moduleData]);

    const enrichedModuleData = useMemo<LessonModule | null>(() => {
        if (!moduleData) return null;
        return {
            ...moduleData,
            blocks: structuredBlocks,
        };
    }, [moduleData, structuredBlocks]);

    const cleanTopicName = useMemo(() => {
        if (!moduleData) return '';
        return extractCleanTopicName(moduleData.title);
    }, [moduleData]);

    const completedCardCount = useMemo(() => {
        return structuredBlocks.reduce(
            (acc, _, idx) => acc + (isBlockCompleted(moduleId, idx) ? 1 : 0),
            0,
        );
    }, [structuredBlocks, isBlockCompleted, moduleId]);

    const sectionAnchors = useMemo(() => {
        return structuredBlocks.map((block, index) => {
            const meta = SIX_CARD_PEDAGOGY[index];
            const fallbackTitle =
                'title' in block && typeof block.title === 'string' ? block.title : `Bagian ${index + 1}`;
            return {
                id: `lesson-block-${index}`,
                index,
                stepNumber: index + 1,
                shortLabel: meta ? meta.roleTitle : fallbackTitle,
                fullTitle: fallbackTitle,
                isDone: isBlockCompleted(moduleId, index),
            };
        });
    }, [structuredBlocks, isBlockCompleted, moduleId]);

    const handleJumpToSection = (elementId: string) => {
        const el = document.getElementById(elementId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="veloa-ambient-backdrop min-h-screen pb-24 text-(--text-primary) lg:pb-12">
            {/* ====================================================================
          STICKY TRANSLUCENT TOP BAR (Mobile & Desktop)
         ==================================================================== */}
            <header className="veloa-glass-chrome sticky top-0 z-30 border-b border-(--border-subtle)">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-2.5 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onBackToHub}
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-semibold text-(--text-secondary) hover:border-(--border-strong) sm:px-3.5"
                        >
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            <span>Kembali</span>
                        </button>

                        <button
                            type="button"
                            onClick={onOpenQuickSearch}
                            aria-label="Buka pencarian cepat kurikulum"
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-medium text-(--text-muted) hover:border-(--border-strong)"
                        >
                            <Search className="h-3.5 w-3.5 text-(--accent-primary)" />
                            <span className="hidden sm:inline">Cari Materi</span>
                            <kbd className="hidden rounded bg-(--surface-elevated) px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--text-secondary) md:inline">
                                Ctrl K
                            </kbd>
                        </button>
                    </div>

                    {manifestMeta && (
                        <div className="hidden items-center gap-2 text-xs text-(--text-muted) lg:flex">
                            <span className="rounded-md bg-(--accent-primary-soft) px-2 py-0.5 font-mono font-bold uppercase text-(--accent-primary)">
                                {langInfo.name} · {langInfo.native}
                            </span>
                            <span>·</span>
                            <span>{TIER_LABELS[manifestMeta.tier].badge}</span>
                            <span>·</span>
                            <span>
                                Progres Kartu: {completedCardCount}/{structuredBlocks.length}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {moduleData && !isLoading && !isPracticeMode && moduleData.lang !== 'en' && (
                            <button
                                type="button"
                                aria-pressed={hidePhoneticAid}
                                onClick={() => setHidePhoneticAid((prev) => !prev)}
                                title="Sembunyikan atau tampilkan romanisasi/pinyin/furigana untuk melatih membaca aksara asli"
                                className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold ${hidePhoneticAid
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                        : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)'
                                    }`}
                            >
                                {hidePhoneticAid ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                <span className="hidden md:inline">
                                    {hidePhoneticAid ? 'Fonetik: Tersembunyi' : 'Fonetik: Tampil'}
                                </span>
                            </button>
                        )}

                        {enrichedModuleData && !isLoading && (
                            <button
                                type="button"
                                onClick={() => setIsPracticeMode((prev) => !prev)}
                                className={`veloa-tactile-btn hidden items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold sm:inline-flex ${isPracticeMode
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                        : 'border-(--accent-primary) bg-(--accent-primary) text-white hover:bg-(--accent-primary-hover)'
                                    }`}
                            >
                                <BrainCircuit className="h-4 w-4" />
                                <span>{isPracticeMode ? 'Kembali ke Materi' : 'Latih Modul Ini'}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => toggleModuleCompleted(moduleId)}
                            aria-pressed={completed}
                            className={`veloa-tactile-btn hidden items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold sm:inline-flex ${completed
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--border-strong)'
                                }`}
                        >
                            {completed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Selesai</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4 text-(--text-muted)" />
                                    <span>Tandai Selesai</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ====================================================================
          MAIN LESSON STAGE
         ==================================================================== */}
            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                {isLoading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="veloa-surface-card flex flex-col items-center justify-center gap-3 py-24 text-center"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-(--accent-primary)" />
                        <p className="text-sm font-semibold text-(--text-primary)">
                            Memuat modul pembelajaran...
                        </p>
                        <p className="text-xs text-(--text-muted)">
                            Menyiapkan struktur aksara, fonetik, dan 6 kartu pembelajaran terstruktur
                        </p>
                    </div>
                ) : errorMessage ? (
                    <div
                        role="alert"
                        className="veloa-surface-card flex flex-col items-center justify-center gap-4 border-rose-500/30 py-16 text-center"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 px-4">
                            <h2 className="text-base font-bold text-(--text-primary)">Gagal Membuka Modul</h2>
                            <p className="max-w-md text-sm text-(--text-secondary)">{errorMessage}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReloadNonce((n) => n + 1)}
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 text-xs font-semibold text-white"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Coba Muat Ulang</span>
                        </button>
                    </div>
                ) : enrichedModuleData ? (
                    isPracticeMode ? (
                        <ActiveRecallArena
                            moduleData={enrichedModuleData}
                            onClose={() => setIsPracticeMode(false)}
                        />
                    ) : (
                        <>
                            {/* ============================================================
                  1. HERO CARD & PENJELASAN KONSEP BAHASAN MODUL
                 ============================================================ */}
                            <section
                                aria-label="Informasi dan tujuan modul"
                                className="veloa-surface-card mb-8 overflow-hidden"
                            >
                                <div className="p-5 sm:p-8">
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                                            <GraduationCap className="h-3.5 w-3.5" />
                                            <span>
                                                {langInfo.name} · {tierInfo?.badge}
                                            </span>
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1 text-xs font-semibold text-(--text-secondary)">
                                            <Layers className="h-3.5 w-3.5 text-(--accent-primary)" />
                                            <span>{pillarInfo?.title}</span>
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1 text-xs font-medium text-(--text-muted)">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>±{enrichedModuleData.estimatedMinutes} menit</span>
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>
                                                {completedCardCount}/{structuredBlocks.length} Kartu Dipahami
                                            </span>
                                        </span>
                                    </div>

                                    <h1
                                        lang={langInfo.bcp47}
                                        className="text-xl font-extrabold leading-snug tracking-tight text-(--text-primary) sm:text-3xl"
                                    >
                                        {enrichedModuleData.title}
                                    </h1>

                                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-(--text-secondary) sm:text-base">
                                        {enrichedModuleData.subtitle}
                                    </p>

                                    {/* Kotak Penjelasan Singkat Konsep Topik Modul */}
                                    <div className="mt-5 rounded-2xl border border-(--accent-primary)/25 bg-(--accent-primary-soft) p-4 sm:p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-(--accent-primary) text-white">
                                                <Info className="h-4 w-4" aria-hidden="true" />
                                            </div>
                                            <div className="space-y-1">
                                                <h2 className="text-xs font-extrabold uppercase tracking-wider text-(--accent-primary) sm:text-sm">
                                                    Apa Itu “{cleanTopicName}”?
                                                </h2>
                                                <p className="text-xs leading-relaxed text-(--text-primary) sm:text-sm">
                                                    Dalam bahasa <strong>{langInfo.name}</strong> ({langInfo.framework}),{' '}
                                                    <strong>{cleanTopicName}</strong> adalah materi pada pilar{' '}
                                                    <em>{pillarInfo?.title}</em> yang membahas cara{' '}
                                                    {enrichedModuleData.subtitle.charAt(0).toLowerCase() +
                                                        enrichedModuleData.subtitle.slice(1)}
                                                    {enrichedModuleData.subtitle.endsWith('.') ? '' : '.'} Melalui 6 kartu
                                                    terstruktur di bawah ini, kamu akan mempelajari rumus intinya, logika
                                                    penutur asli, variasi contoh, pengecualian khusus, tips hafalan, hingga
                                                    praktik percakapannya.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Strip Capaian Belajar & Konteks Kurikulum */}
                                    <div className="mt-5 grid gap-3 border-t border-(--border-subtle) pt-5 sm:grid-cols-2">
                                        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/65 p-3.5">
                                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-(--accent-primary)">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>Capaian Pilar ({pillarInfo?.title})</span>
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                                                {pillarInfo?.outcome}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/65 p-3.5">
                                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                                                <BookOpen className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                <span>Fokus Tahap Pembelajaran</span>
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                                                {tierInfo?.focus}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar Lompat Cepat Antar 6 Kartu Terstruktur */}
                                {sectionAnchors.length > 0 && (
                                    <div className="border-t border-(--border-subtle) bg-(--surface-elevated)/45 px-5 py-3.5 sm:px-8">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                                                <ListTree className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                <span>Struktur Materi ({sectionAnchors.length} Kartu):</span>
                                            </span>
                                            {sectionAnchors.map((sec) => (
                                                <button
                                                    key={sec.id}
                                                    type="button"
                                                    onClick={() => handleJumpToSection(sec.id)}
                                                    title={sec.fullTitle}
                                                    className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${sec.isDone
                                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--accent-primary)'
                                                        }`}
                                                >
                                                    <span className="font-mono text-[10px] font-bold text-(--accent-primary)">
                                                        0{sec.stepNumber}
                                                    </span>
                                                    <span className="max-w-44 truncate">{sec.shortLabel}</span>
                                                    {sec.isDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* ============================================================
                  2. SELURUH 6 KARTU KONTEN TERSTRUKTUR
                 ============================================================ */}
                            <div
                                data-hide-phonetic={hidePhoneticAid ? 'true' : 'false'}
                                className="veloa-lesson-stage space-y-8"
                            >
                                {structuredBlocks.map((block, index) => {
                                    const cardMeta = SIX_CARD_PEDAGOGY[index];
                                    const cardDone = isBlockCompleted(moduleId, index);
                                    const stepLabel = cardMeta
                                        ? cardMeta.stepLabel
                                        : `Kartu ${String(index + 1).padStart(2, '0')}/${String(structuredBlocks.length).padStart(2, '0')}`;
                                    const roleTitle = cardMeta ? cardMeta.roleTitle : 'Pendalaman Materi Lanjutan';
                                    const guidanceText = cardMeta
                                        ? cardMeta.getGuidance(cleanTopicName, langInfo.name)
                                        : `Eksplorasi lanjutan untuk menguasai topik "${cleanTopicName}".`;

                                    return (
                                        <div
                                            key={`block-anchor-${index}`}
                                            id={`lesson-block-${index}`}
                                            className="scroll-mt-24 space-y-2.5"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card)/90 px-4 py-3 shadow-2xs sm:px-5">
                                                <div className="space-y-0.5">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-md bg-(--accent-primary) px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                                                            {stepLabel}
                                                        </span>
                                                        <span className="text-xs font-extrabold tracking-tight text-(--text-primary) sm:text-sm">
                                                            {roleTitle}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-(--text-secondary)">
                                                        {guidanceText}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleBlockCompleted(moduleId, index)}
                                                    aria-pressed={cardDone}
                                                    className={`veloa-tactile-btn inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold ${cardDone
                                                            ? 'border-emerald-600 bg-emerald-600 text-white'
                                                            : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--accent-primary)'
                                                        }`}
                                                >
                                                    {cardDone ? (
                                                        <>
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>Dipahami</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Circle className="h-3.5 w-3.5 text-(--text-muted)" />
                                                            <span>Tandai Paham</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <LessonBlockRenderer blocks={[block]} lang={enrichedModuleData.lang} />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ============================================================
                  3. CALLOUT UJI PEMAHAMAN DI AKHIR MATERI
                 ============================================================ */}
                            <section className="veloa-surface-card mt-10 flex flex-wrap items-center justify-between gap-4 border-(--border-strong) bg-(--accent-primary-soft) p-5 sm:p-6">
                                <div className="space-y-1">
                                    <h2 className="text-base font-extrabold text-(--text-primary)">
                                        Uji Pemahaman & Kunci Memori Jangka Panjang
                                    </h2>
                                    <p className="max-w-2xl text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                                        Jalankan 10 soal latihan acak (Recognition, Audio Listening & Reading) yang
                                        dibuat otomatis dari materi modul ini.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsPracticeMode(true)}
                                    className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 text-xs font-bold text-white shadow-xs hover:bg-(--accent-primary-hover)"
                                >
                                    <BrainCircuit className="h-4 w-4" />
                                    <span>Mulai Sesi Latihan</span>
                                </button>
                            </section>

                            {/* ============================================================
                  4. NAVIGASI ANTAR MODUL (RTL & Mobile Safe)
                 ============================================================ */}
                            <nav
                                aria-label="Navigasi antar modul"
                                className="mt-8 grid gap-4 border-t border-(--border-subtle) pt-8 sm:grid-cols-2"
                            >
                                {previous ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectModule(previous.id)}
                                        onMouseEnter={() => prefetchLessonModule(previous.id)}
                                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start gap-1.5 p-5 text-start hover:border-(--border-strong)"
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--text-muted)">
                                            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                                            <span>Modul Sebelumnya</span>
                                        </span>
                                        <span className="line-clamp-2 text-sm font-bold text-(--text-primary)">
                                            {previous.title}
                                        </span>
                                    </button>
                                ) : (
                                    <div className="hidden sm:block" />
                                )}

                                {next ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectModule(next.id)}
                                        onMouseEnter={() => prefetchLessonModule(next.id)}
                                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-end gap-1.5 p-5 text-end hover:border-(--accent-primary)"
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--accent-primary)">
                                            <span>Lanjut ke Modul Berikutnya</span>
                                            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                                        </span>
                                        <span className="line-clamp-2 text-sm font-bold text-(--text-primary)">
                                            {next.title}
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!completed) toggleModuleCompleted(moduleId);
                                            onBackToHub();
                                        }}
                                        className="veloa-tactile-btn flex flex-col items-end justify-center gap-1 rounded-2xl bg-emerald-600 p-5 text-end text-white hover:bg-emerald-700"
                                    >
                                        <span className="text-xs font-semibold opacity-95">
                                            Rangkaian Modul Selesai
                                        </span>
                                        <span className="text-sm font-bold">Kembali ke Learning Hub →</span>
                                    </button>
                                )}
                            </nav>
                        </>
                    )
                ) : null}
            </main>

            {/* ====================================================================
          MOBILE STICKY BOTTOM ACTION DOCK (< sm) — Ergonomic Thumb Zone
         ==================================================================== */}
            {enrichedModuleData && !isLoading && !errorMessage && (
                <div className="veloa-glass-chrome fixed inset-x-0 bottom-0 z-30 border-t border-(--border-subtle) px-4 py-2.5 sm:hidden">
                    <div className="mx-auto flex max-w-md items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setIsPracticeMode((prev) => !prev)}
                            className="veloa-tactile-btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-(--accent-primary) px-4 text-xs font-bold text-white shadow-xs"
                        >
                            <BrainCircuit className="h-4 w-4" />
                            <span>{isPracticeMode ? 'Lihat Materi' : 'Latih Modul'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => toggleModuleCompleted(moduleId)}
                            aria-pressed={completed}
                            className={`veloa-tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold ${completed
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary)'
                                }`}
                        >
                            {completed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Selesai</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4 text-(--text-muted)" />
                                    <span>Selesai</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
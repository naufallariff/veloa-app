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
    Layers,
    ListTree,
    Loader2,
    RotateCcw,
    Search,
    Sparkles,
} from 'lucide-react';
import type { LanguageCode, LessonModule } from '../schema/lesson.schema';
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
    { name: string; native: string; bcp47: string; framework: string }
> = {
    en: { name: 'English', native: 'English', bcp47: 'en', framework: 'CEFR' },
    zh: { name: 'Mandarin', native: '普通话', bcp47: 'zh-Hans', framework: 'HSK' },
    ja: { name: 'Jepang', native: '日本語', bcp47: 'ja', framework: 'JLPT' },
    ar: { name: 'Arab', native: 'العربية', bcp47: 'ar', framework: 'Naḥwu & CEFR' },
    ko: { name: 'Korea', native: '한국어', bcp47: 'ko', framework: 'TOPIK' },
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

    const { isModuleCompleted, toggleModuleCompleted, markModuleVisited } = useLessonProgress();
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

    const langInfo = moduleData ? LANG_META[moduleData.lang] : manifestMeta ? LANG_META[manifestMeta.lang] : LANG_META.en;
    const tierInfo = moduleData ? TIER_LABELS[moduleData.tier] : null;
    const pillarInfo = moduleData ? PILLAR_LABELS[moduleData.pillar] : null;

    const sectionAnchors = useMemo(() => {
        if (!moduleData) return [];
        return moduleData.blocks.map((block, index) => ({
            id: `lesson-block-${index}`,
            index: index + 1,
            title:
                'title' in block && typeof block.title === 'string'
                    ? block.title
                    : `Bagian ${index + 1}`,
        }));
    }, [moduleData]);

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
                    {/* Kiri: Tombol Kembali & Quick Search */}
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

                    {/* Tengah: Konteks Bahasa & Modul (Desktop) */}
                    {manifestMeta && (
                        <div className="hidden items-center gap-2 text-xs text-(--text-muted) lg:flex">
                            <span className="rounded-md bg-(--accent-primary-soft) px-2 py-0.5 font-mono font-bold uppercase text-(--accent-primary)">
                                {langInfo.name} · {langInfo.native}
                            </span>
                            <span>·</span>
                            <span>{TIER_LABELS[manifestMeta.tier].badge}</span>
                            <span>·</span>
                            <span>{manifestMeta.entryCount.toLocaleString('id-ID')} entri</span>
                        </div>
                    )}

                    {/* Kanan: Toggle Bantuan Baca & Aksi Desktop */}
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

                        {moduleData && !isLoading && (
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
                            Menyiapkan struktur aksara, fonetik, dan latihan interaktif
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
                ) : moduleData ? (
                    isPracticeMode ? (
                        <ActiveRecallArena
                            moduleData={moduleData}
                            onClose={() => setIsPracticeMode(false)}
                        />
                    ) : (
                        <>
                            {/* ============================================================
                  1. HERO HEADER & RINGKASAN PEDAGOGIS MODUL
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
                                            <span>±{moduleData.estimatedMinutes} menit</span>
                                        </span>
                                    </div>

                                    <h1
                                        lang={langInfo.bcp47}
                                        className="text-xl font-extrabold leading-snug tracking-tight text-(--text-primary) sm:text-3xl"
                                    >
                                        {moduleData.title}
                                    </h1>

                                    <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-(--text-secondary) sm:text-base">
                                        {moduleData.subtitle}
                                    </p>

                                    {/* Strip Capaian Belajar & Konteks Kurikulum */}
                                    <div className="mt-6 grid gap-3 border-t border-(--border-subtle) pt-5 sm:grid-cols-2">
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

                                {/* Bar Lompat Cepat Antar Bagian (Jika modul memiliki > 1 blok) */}
                                {sectionAnchors.length > 1 && (
                                    <div className="border-t border-(--border-subtle) bg-(--surface-elevated)/45 px-5 py-3 sm:px-8">
                                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                                                <ListTree className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                <span>Daftar Bagian:</span>
                                            </span>
                                            {sectionAnchors.map((sec) => (
                                                <button
                                                    key={sec.id}
                                                    type="button"
                                                    onClick={() => handleJumpToSection(sec.id)}
                                                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 py-1 text-xs font-semibold text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)"
                                                >
                                                    <span className="font-mono text-[10px] font-bold text-(--accent-primary)">
                                                        0{sec.index}
                                                    </span>
                                                    <span className="max-w-44 truncate">{sec.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* ============================================================
                  2. SELURUH BLOK KONTEN MODUL (Dengan Contrast Guard Light Mode)
                 ============================================================ */}
                            <div
                                data-hide-phonetic={hidePhoneticAid ? 'true' : 'false'}
                                className="veloa-lesson-stage space-y-6"
                            >
                                {moduleData.blocks.map((block, index) => (
                                    <div
                                        key={`block-anchor-${index}`}
                                        id={`lesson-block-${index}`}
                                        className="scroll-mt-24"
                                    >
                                        <LessonBlockRenderer blocks={[block]} lang={moduleData.lang} />
                                    </div>
                                ))}
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
            {moduleData && !isLoading && !errorMessage && (
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
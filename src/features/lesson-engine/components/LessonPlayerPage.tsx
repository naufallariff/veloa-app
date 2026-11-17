// src/features/lesson-engine/components/LessonPlayerPage.tsx
import React, { useEffect, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Circle,
    Clock,
    Layers,
    Loader2,
    RotateCcw,
    Search,
} from 'lucide-react';
import type { LessonModule } from '../schema/lesson.schema';
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

const TIER_LABELS: Record<LessonModule['tier'], string> = {
    foundation: 'Tier 0 · Foundation',
    beginner: 'Tier 1 · Beginner',
    intermediate: 'Tier 2 · Intermediate',
    advanced: 'Tier 3 · Advanced',
    native: 'Tier 4 · Native & Stylistics',
};

const PILLAR_LABELS: Record<LessonModule['pillar'], string> = {
    script: 'Aksara & Ortografi',
    phonetics: 'Fonetik & Artikulasi',
    morphology: 'Morfologi & Pembentukan Kata',
    syntax: 'Sintaksis & Tata Bahasa',
    'lexicon-dialogue': 'Leksikon, Dialog & Gaya Bahasa',
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

    return (
        <div className="min-h-screen bg-(--surface-canvas) text-(--text-primary)">
            {/* Sticky Translucent Navigation Bar */}
            <header className="veloa-glass-chrome sticky top-0 z-30 border-b border-(--border-subtle)">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onBackToHub}
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-semibold text-(--text-secondary) hover:border-(--border-strong)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Peta Kurikulum</span>
                        </button>

                        <button
                            type="button"
                            onClick={onOpenQuickSearch}
                            aria-label="Buka pencarian cepat kurikulum"
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-medium text-(--text-muted) hover:border-(--border-strong)"
                        >
                            <Search className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Cari Cepat</span>
                            <kbd className="hidden rounded bg-(--surface-elevated) px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--text-secondary) md:inline">
                                Ctrl K
                            </kbd>
                        </button>
                    </div>

                    {manifestMeta && (
                        <div className="hidden items-center gap-2 text-xs text-(--text-muted) lg:flex">
                            <span className="font-semibold uppercase text-(--accent-primary)">
                                {manifestMeta.lang}
                            </span>
                            <span>·</span>
                            <span>{TIER_LABELS[manifestMeta.tier]}</span>
                            <span>·</span>
                            <span>{manifestMeta.entryCount.toLocaleString('id-ID')} entri</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {moduleData && !isLoading && (
                            <button
                                type="button"
                                onClick={() => setIsPracticeMode((prev) => !prev)}
                                className={`veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold ${isPracticeMode
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                        : 'border-(--accent-primary) bg-(--accent-primary) text-white hover:opacity-95'
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
                            className={`veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold ${completed
                                    ? 'border-emerald-500 bg-emerald-600 text-white'
                                    : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--border-strong)'
                                }`}
                        >
                            {completed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Selesai</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4 text-(--text-muted)" />
                                    <span className="hidden sm:inline">Tandai Selesai</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
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
                            Memvalidasi struktur aksara, tata bahasa, dan leksikon
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
                        <div className="space-y-1">
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
                            {/* Hero Header Modul */}
                            <div className="mb-8 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                                        {TIER_LABELS[moduleData.tier]}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--surface-card) px-3 py-1 text-xs font-semibold text-(--text-secondary)">
                                        <Layers className="h-3.5 w-3.5 text-(--text-muted)" />
                                        <span>{PILLAR_LABELS[moduleData.pillar]}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--surface-card) px-3 py-1 text-xs font-medium text-(--text-muted)">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>±{moduleData.estimatedMinutes} menit</span>
                                    </span>
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl lg:text-4xl">
                                    {moduleData.title}
                                </h1>

                                <p className="max-w-4xl text-base leading-relaxed text-(--text-secondary)">
                                    {moduleData.subtitle}
                                </p>
                            </div>

                            {/* Seluruh Blok Konten Modul */}
                            <LessonBlockRenderer blocks={moduleData.blocks} lang={moduleData.lang} />

                            {/* Callout Latihan Active Recall di Akhir Materi */}
                            <section className="veloa-surface-card mt-10 flex flex-wrap items-center justify-between gap-4 border-(--accent-primary)/35 bg-(--accent-primary-soft) p-6">
                                <div className="space-y-1">
                                    <h2 className="text-base font-extrabold text-(--text-primary)">
                                        Uji Pemahaman & Kunci Memori Jangka Panjang
                                    </h2>
                                    <p className="text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                                        Jalankan 10 soal latihan acak (Recognition, Audio Listening & Reading) yang
                                        dibuat otomatis dari materi modul ini.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsPracticeMode(true)}
                                    className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 text-xs font-semibold text-white shadow-xs"
                                >
                                    <BrainCircuit className="h-4 w-4" />
                                    <span>Mulai Sesi Latihan</span>
                                </button>
                            </section>

                            {/* Footer Navigasi Antar Modul */}
                            <nav
                                aria-label="Navigasi antar modul"
                                className="mt-10 grid gap-4 border-t border-(--border-subtle) pt-8 sm:grid-cols-2"
                            >
                                {previous ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectModule(previous.id)}
                                        onMouseEnter={() => prefetchLessonModule(previous.id)}
                                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start gap-1.5 p-5 text-left hover:border-(--border-strong)"
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--text-muted)">
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            <span>Modul Sebelumnya</span>
                                        </span>
                                        <span className="line-clamp-2 text-sm font-bold text-(--text-primary)">
                                            {previous.title}
                                        </span>
                                    </button>
                                ) : (
                                    <div />
                                )}

                                {next ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectModule(next.id)}
                                        onMouseEnter={() => prefetchLessonModule(next.id)}
                                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-end gap-1.5 p-5 text-right hover:border-(--accent-primary)"
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--accent-primary)">
                                            <span>Lanjut ke Modul Berikutnya</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
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
                                        className="veloa-tactile-btn flex flex-col items-end justify-center gap-1 rounded-2xl bg-emerald-600 p-5 text-right text-white"
                                    >
                                        <span className="text-xs font-semibold opacity-90">
                                            Kurikulum Bahasa Selesai
                                        </span>
                                        <span className="text-sm font-bold">Kembali ke Peta Utama →</span>
                                    </button>
                                )}
                            </nav>
                        </>
                    )
                ) : null}
            </main>
        </div>
    );
};
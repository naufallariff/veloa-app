// src/features/roadmap-graph/components/HomeDashboardView.tsx
import React, { useMemo } from 'react';
import {
    ArrowRight,
    BookMarked,
    BrainCircuit,
    CheckCircle2,
    Clock,
    GraduationCap,
    Layers,
    Play,
    Sparkles,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import {
    getManifestByLanguage,
    getManifestItemById,
    prefetchLessonModule,
} from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useMasteryEngine } from '@/features/practice-engine/hooks/useMasteryEngine';
import { LANGUAGE_OPTIONS, type AppSectionId } from '@/shared/ui/AppShellLayout';

interface HomeDashboardViewProps {
    selectedLang: LanguageCode;
    onOpenModule: (moduleId: string) => void;
    onNavigateSection: (section: AppSectionId) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
    selectedLang,
    onOpenModule,
    onNavigateSection,
}) => {
    const { completedModuleIds, bookmarkedEntryIds, lastVisitedModuleId, isModuleCompleted } =
        useLessonProgress();
    const { totalAnswered, accuracyPercent, getDueCountForLanguage } = useMasteryEngine();

    const langMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === selectedLang) ?? LANGUAGE_OPTIONS[0]!;
    const langModules = useMemo(() => getManifestByLanguage(selectedLang), [selectedLang]);
    const dueSrsCount = getDueCountForLanguage(selectedLang);

    const completedInLang = useMemo(
        () => langModules.filter((m) => completedModuleIds.includes(m.id)).length,
        [langModules, completedModuleIds],
    );

    const completionPercent =
        langModules.length > 0 ? Math.round((completedInLang / langModules.length) * 100) : 0;

    // Tentukan modul fokus utama: modul terakhir yang dibuka pada bahasa ini, atau modul pertama yang belum selesai
    const primaryFocusModule = useMemo(() => {
        if (lastVisitedModuleId) {
            const visited = getManifestItemById(lastVisitedModuleId);
            if (visited && visited.lang === selectedLang) {
                return visited;
            }
        }
        return langModules.find((m) => !completedModuleIds.includes(m.id)) ?? langModules[0];
    }, [lastVisitedModuleId, selectedLang, langModules, completedModuleIds]);

    // 3 Rekomendasi modul berikutnya yang belum selesai
    const recommendedModules = useMemo(() => {
        return langModules
            .filter((m) => !completedModuleIds.includes(m.id) && m.id !== primaryFocusModule?.id)
            .slice(0, 3);
    }, [langModules, completedModuleIds, primaryFocusModule]);

    return (
        <div className="space-y-8">
            {/* ====================================================================
          1. HERO CARD AURORA LIQUID — FOKUS UTAMA BELAJAR
         ==================================================================== */}
            <section aria-label="Sesi belajar utama" className="grid gap-5 lg:grid-cols-12">
                <div className="veloa-aurora-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3.5 py-1 text-xs font-bold backdrop-blur-xs">
                            <span>{langMeta.shortCode}</span>
                            <span>·</span>
                            <span>{langMeta.name}</span>
                            <span className="opacity-85">({langMeta.framework})</span>
                        </div>

                        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                            {primaryFocusModule
                                ? primaryFocusModule.title
                                : `Mulai Perjalanan Linguistik ${langMeta.name}`}
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-white/90">
                            {primaryFocusModule
                                ? primaryFocusModule.subtitle
                                : 'Pelajari sistem aksara, hukum fonetik, tata bahasa, dan kosakata terstruktur.'}
                        </p>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
                        {primaryFocusModule && (
                            <button
                                type="button"
                                onMouseEnter={() => prefetchLessonModule(primaryFocusModule.id)}
                                onClick={() => onOpenModule(primaryFocusModule.id)}
                                className="veloa-tactile-btn inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 text-xs font-extrabold text-violet-900 shadow-md hover:bg-violet-50"
                            >
                                <Play className="h-4 w-4 fill-current" />
                                <span>
                                    {lastVisitedModuleId === primaryFocusModule.id
                                        ? 'Lanjutkan Modul Ini'
                                        : 'Mulai Belajar Sekarang'}
                                </span>
                            </button>
                        )}

                        <div className="text-xs font-semibold text-white/90">
                            Progres {langMeta.name}: <strong>{completionPercent}%</strong> ({completedInLang}/
                            {langModules.length} modul)
                        </div>
                    </div>
                </div>

                {/* Kartu Pendamping: Jadwal Ulang Kaji & Ritme Belajar */}
                <div className="veloa-surface-card flex flex-col justify-between p-6 lg:col-span-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                                Ritme Belajar Hari Ini
                            </span>
                            <Sparkles className="h-4 w-4 text-(--accent-primary)" />
                        </div>

                        <div>
                            <p className="text-2xl font-extrabold text-(--text-primary)">
                                {dueSrsCount > 0 ? `${dueSrsCount} item` : 'Semua Terjaga'}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                                {dueSrsCount > 0
                                    ? `Ada ${dueSrsCount} kosakata/pola ${langMeta.name} yang siap diulang dengan Spaced Repetition.`
                                    : 'Tidak ada antrean ulang kaji yang menumpuk. Anda bebas mengeksplorasi materi baru.'}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-(--text-muted)">Penyelesaian {langMeta.name}</span>
                                <span className="text-(--accent-primary)">{completionPercent}%</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-(--surface-elevated)">
                                <div
                                    className="h-full rounded-full bg-(--accent-primary) transition-all duration-500"
                                    style={{ width: `${completionPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onNavigateSection('PRACTICE')}
                        className="veloa-tactile-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--border-strong) bg-(--accent-primary-soft) px-4 text-xs font-bold text-(--accent-primary) hover:bg-(--accent-primary) hover:text-white"
                    >
                        <BrainCircuit className="h-4 w-4" />
                        <span>
                            {dueSrsCount > 0 ? `Mulai Ulang Kaji (${dueSrsCount})` : 'Buka Practice Center'}
                        </span>
                    </button>
                </div>
            </section>

            {/* ====================================================================
          2. AKSES CEPAT RUANG KERJA (4 STUDIO CARDS)
         ==================================================================== */}
            <section aria-label="Akses cepat ruang kerja" className="space-y-3.5">
                <h2 className="text-base font-extrabold text-(--text-primary)">Ruang Kerja Belajar</h2>

                <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                    <button
                        type="button"
                        onClick={() => onNavigateSection('LEARNING')}
                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start justify-between p-4 text-start hover:border-(--accent-primary)"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/12 text-violet-600 dark:text-violet-300">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-(--text-primary)">Learning Hub</p>
                            <p className="mt-0.5 text-xs text-(--text-secondary)">
                                {langModules.length} modul & jalur paralel
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onNavigateSection('PRACTICE')}
                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start justify-between p-4 text-start hover:border-(--accent-primary)"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-300">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-(--text-primary)">Practice Center</p>
                            <p className="mt-0.5 text-xs text-(--text-secondary)">
                                Active Recall & SRS ({dueSrsCount} due)
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onNavigateSection('LIBRARY')}
                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start justify-between p-4 text-start hover:border-(--accent-primary)"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            <BookMarked className="h-5 w-5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-(--text-primary)">Knowledge Library</p>
                            <p className="mt-0.5 text-xs text-(--text-secondary)">
                                {bookmarkedEntryIds.length} entri tersimpan
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => onNavigateSection('PROGRESS')}
                        className="veloa-surface-card veloa-tactile-btn flex flex-col items-start justify-between p-4 text-start hover:border-(--accent-primary)"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-(--text-primary)">My Progress</p>
                            <p className="mt-0.5 text-xs text-(--text-secondary)">
                                {totalAnswered > 0 ? `Akurasi ${accuracyPercent}%` : '6 dimensi kompetensi'}
                            </p>
                        </div>
                    </button>
                </div>
            </section>

            {/* ====================================================================
          3. REKOMENDASI MODUL BERIKUTNYA ({langMeta.name})
         ==================================================================== */}
            {recommendedModules.length > 0 && (
                <section aria-label="Rekomendasi langkah berikutnya" className="space-y-3.5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-extrabold text-(--text-primary)">
                            Langkah Berikutnya di {langMeta.name}
                        </h2>
                        <button
                            type="button"
                            onClick={() => onNavigateSection('LEARNING')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-(--accent-primary) hover:underline"
                        >
                            <span>Lihat Semua Kurikulum</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {recommendedModules.map((mod) => {
                            const done = isModuleCompleted(mod.id);
                            return (
                                <article
                                    key={mod.id}
                                    onMouseEnter={() => prefetchLessonModule(mod.id)}
                                    onClick={() => onOpenModule(mod.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onOpenModule(mod.id);
                                        }
                                    }}
                                    className="veloa-surface-card veloa-tactile-btn group flex cursor-pointer flex-col justify-between p-5 text-start hover:border-(--accent-primary)"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-(--accent-primary)">
                                                <Layers className="h-3.5 w-3.5" />
                                                <span>{mod.tier}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-(--text-muted)">
                                                <Clock className="h-3 w-3" />
                                                <span>{mod.estimatedMinutes} mnt</span>
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-(--text-primary) group-hover:text-(--accent-primary)">
                                            {mod.title}
                                        </h3>

                                        <p className="line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">
                                            {mod.subtitle}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-(--border-subtle) pt-3 text-xs font-semibold">
                                        <span className="text-(--text-muted)">
                                            {mod.entryCount.toLocaleString('id-ID')} entri
                                        </span>
                                        <span className="text-(--accent-primary)">
                                            {done ? 'Tinjau Ulang →' : 'Buka Modul →'}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};
// src/features/practice-engine/components/PracticeCenterView.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
    BrainCircuit,
    CheckCircle2,
    Headphones,
    Loader2,
    Play,
    Sparkles,
} from 'lucide-react';
import type { LanguageCode, LessonModule } from '@/features/lesson-engine/schema/lesson.schema';
import {
    getManifestByLanguage,
    loadLessonModule,
    prefetchLessonModule,
} from '@/features/lesson-engine/services/module-loader';
import { PaginatedDataView } from '@/components/ui/PaginatedDataView';
import { useMasteryEngine } from '../hooks/useMasteryEngine';
import { useStudyVault } from '../hooks/useStudyVault';
import { ActiveRecallArena } from './ActiveRecallArena';
import { SrsReviewSessionModal } from './SrsReviewSessionModal';
import { LANGUAGE_OPTIONS } from '@/shared/ui/AppShellLayout';

interface PracticeCenterViewProps {
    selectedLang: LanguageCode;
}

export const PracticeCenterView: React.FC<PracticeCenterViewProps> = ({ selectedLang }) => {
    const { totalAnswered, accuracyPercent, srsRecords } = useMasteryEngine();
    const { resolvedDueSrs, isResolving } = useStudyVault(true);

    const [isSrsModalOpen, setIsSrsModalOpen] = useState(false);
    const [srsScope, setSrsScope] = useState<'LANG' | 'ALL'>('LANG');
    const [activeDrillModule, setActiveDrillModule] = useState<LessonModule | null>(null);
    const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);

    const langMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === selectedLang) ?? LANGUAGE_OPTIONS[0]!;
    const langModules = useMemo(() => getManifestByLanguage(selectedLang), [selectedLang]);

    type LangManifestItem = (typeof langModules)[number];

    const dueForActiveLang = useMemo(
        () => resolvedDueSrs.filter((item) => item.lang === selectedLang),
        [resolvedDueSrs, selectedLang],
    );

    const handleLaunchModuleDrill = async (moduleId: string) => {
        setLoadingModuleId(moduleId);
        try {
            const mod = await loadLessonModule(moduleId);
            setActiveDrillModule(mod);
        } finally {
            setLoadingModuleId(null);
        }
    };

    const filterModuleFn = useCallback((mod: LangManifestItem, q: string) => {
        return (
            mod.title.toLowerCase().includes(q) ||
            mod.subtitle.toLowerCase().includes(q) ||
            mod.tier.toLowerCase().includes(q) ||
            mod.pillar.toLowerCase().includes(q)
        );
    }, []);

    if (activeDrillModule) {
        return (
            <ActiveRecallArena
                moduleData={activeDrillModule}
                onClose={() => setActiveDrillModule(null)}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="space-y-1.5 border-b border-(--border-subtle) pb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>Practice Center · {langMeta.name}</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl">
                    Latihan Active Recall & Spaced Repetition
                </h1>
                <p className="max-w-2xl text-sm text-(--text-secondary)">
                    Perkuat ingatan jangka panjang melalui kombinasi pengenalan makna, latihan menyimak
                    audio (dictation), dan evaluasi interval memori SM-2.
                </p>
            </section>

            {/* Kartu Utama Spaced Repetition (SM-2) */}
            <section className="grid gap-5 lg:grid-cols-12">
                <div className="veloa-aurora-card flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1 text-xs font-bold">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Antrean Memori SM-2 ({langMeta.name})</span>
                        </span>

                        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                            {isResolving
                                ? 'Memeriksa jadwal ulang kaji...'
                                : dueForActiveLang.length > 0
                                    ? `${dueForActiveLang.length} Item Siap Diulang Hari Ini`
                                    : 'Antrean Ulang Kaji Bersih'}
                        </h2>

                        <p className="text-sm leading-relaxed text-white/90">
                            {dueForActiveLang.length > 0
                                ? 'Ulangi kartu kosakata dan pola aksara yang mendekati kurva lupa untuk menguncinya ke memori jangka panjang.'
                                : 'Belum ada item jatuh tempo untuk bahasa ini. Pilih modul di bawah untuk memulai sesi Active Recall baru.'}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/20 pt-5">
                        <button
                            type="button"
                            disabled={dueForActiveLang.length === 0 || isResolving}
                            onClick={() => {
                                setSrsScope('LANG');
                                setIsSrsModalOpen(true);
                            }}
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-2xl bg-white px-5 text-xs font-extrabold text-violet-900 shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            <span>
                                Ulang Kaji {langMeta.name} ({dueForActiveLang.length})
                            </span>
                        </button>

                        {resolvedDueSrs.length > dueForActiveLang.length && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSrsScope('ALL');
                                    setIsSrsModalOpen(true);
                                }}
                                className="veloa-tactile-btn inline-flex items-center gap-2 rounded-2xl bg-white/18 px-4 text-xs font-bold text-white hover:bg-white/28"
                            >
                                <span>Semua Bahasa ({resolvedDueSrs.length})</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Ringkasan Performa Latihan */}
                <div className="veloa-surface-card flex flex-col justify-between p-6 lg:col-span-5">
                    <div className="space-y-4">
                        <h3 className="text-sm font-extrabold text-(--text-primary)">
                            Statistik Retensi Memori
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4">
                                <p className="text-xs text-(--text-muted)">Akurasi Jawaban</p>
                                <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                    {accuracyPercent}%
                                </p>
                            </div>

                            <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4">
                                <p className="text-xs text-(--text-muted)">Item Terlacak</p>
                                <p className="mt-1 text-2xl font-extrabold text-(--text-primary)">
                                    {Object.keys(srsRecords).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs text-(--text-secondary)">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span>Total {totalAnswered.toLocaleString('id-ID')} soal latihan diselesaikan</span>
                    </p>
                </div>
            </section>

            {/* Peluncur Cepat Latihan per Modul Bahasa Aktif (Paginated + Searchable) */}
            <section aria-label="Pilih modul untuk latihan cepat" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-extrabold text-(--text-primary)">
                        Latihan Kilat per Modul ({langMeta.name})
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-(--text-muted)">
                        <Headphones className="h-3.5 w-3.5 text-(--accent-primary)" />
                        <span>10 soal acak · Recognition, Listening & Reading</span>
                    </span>
                </div>

                <PaginatedDataView
                    key={selectedLang}
                    data={langModules}
                    pageSize={8}
                    itemLabel="modul latihan"
                    searchPlaceholder={`Cari modul latihan ${langMeta.name} (judul, tier, pilar)...`}
                    filterFn={filterModuleFn}
                    renderItems={(visibleModules) => (
                        <div className="grid gap-3.5 md:grid-cols-2">
                            {visibleModules.map((mod) => {
                                const isLoadingThis = loadingModuleId === mod.id;

                                return (
                                    <div
                                        key={mod.id}
                                        onMouseEnter={() => prefetchLessonModule(mod.id)}
                                        className="veloa-surface-card flex items-center justify-between gap-4 p-4"
                                    >
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <span className="font-mono text-[11px] font-bold uppercase text-(--accent-primary)">
                                                {mod.tier} · {mod.pillar}
                                            </span>
                                            <h3 className="truncate text-sm font-bold text-(--text-primary)">
                                                {mod.title}
                                            </h3>
                                            <p className="text-xs text-(--text-muted)">
                                                {mod.entryCount.toLocaleString('id-ID')} entri sumber soal
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isLoadingThis}
                                            onClick={() => handleLaunchModuleDrill(mod.id)}
                                            className="veloa-tactile-btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-(--accent-primary) px-4 text-xs font-bold text-white hover:bg-(--accent-primary-hover) disabled:opacity-60"
                                        >
                                            {isLoadingThis ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Play className="h-3.5 w-3.5 fill-current" />
                                            )}
                                            <span>Latih</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                />
            </section>

            {isSrsModalOpen && (
                <SrsReviewSessionModal
                    items={srsScope === 'LANG' ? dueForActiveLang : resolvedDueSrs}
                    onClose={() => setIsSrsModalOpen(false)}
                />
            )}
        </div>
    );
};
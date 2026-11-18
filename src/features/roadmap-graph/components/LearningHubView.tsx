// src/features/roadmap-graph/components/LearningHubView.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Compass,
    Feather,
    GraduationCap,
    Grid,
    Library,
    Search,
    Sparkles,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import {
    CURRICULUM_TREES,
    type CurriculumBranch,
    type CurriculumStageGroup,
} from '@/content/curriculum-tree';
import {
    getManifestByLanguage,
    prefetchLessonModule,
} from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { LANGUAGE_OPTIONS } from '@/shared/ui/AppShellLayout';
import { InteractiveScriptCharts } from '@/shared/ui/InteractiveScriptCharts';
import { useDebouncedValue } from '@/shared/hooks/use-performance';

interface LearningHubViewProps {
    selectedLang: LanguageCode;
    onOpenModule: (moduleId: string) => void;
}

type HubMode = 'ROADMAP' | 'SCRIPT_LAB';
const PAGE_SIZE = 3;

interface BranchPanelProps {
    branch: CurriculumBranch;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onOpenModule: (moduleId: string) => void;
    isModuleCompleted: (moduleId: string) => boolean;
}

const BranchAccordionPanel: React.FC<BranchPanelProps> = ({
    branch,
    isExpanded,
    onToggleExpand,
    onOpenModule,
    isModuleCompleted,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [jumpInput, setJumpInput] = useState<string>('1');
    const debouncedSearch = useDebouncedValue(searchQuery.trim().toLowerCase(), 200);

    const filteredModules = useMemo(() => {
        if (!debouncedSearch) return branch.modules;
        return branch.modules.filter(
            (m) =>
                m.title.toLowerCase().includes(debouncedSearch) ||
                m.subtitle.toLowerCase().includes(debouncedSearch) ||
                m.focusFormula.toLowerCase().includes(debouncedSearch),
        );
    }, [branch.modules, debouncedSearch]);

    const totalPages = Math.max(1, Math.ceil(filteredModules.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    useEffect(() => {
        setCurrentPage(1);
        setJumpInput('1');
    }, [debouncedSearch, branch.id]);

    const paginatedModules = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredModules.slice(start, start + PAGE_SIZE);
    }, [filteredModules, safePage]);

    const completedInBranch = useMemo(
        () => branch.modules.filter((m) => isModuleCompleted(m.id)).length,
        [branch.modules, isModuleCompleted],
    );

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = Number.parseInt(jumpInput, 10);
        if (!Number.isNaN(parsed)) {
            const target = Math.min(Math.max(1, parsed), totalPages);
            setCurrentPage(target);
            setJumpInput(String(target));
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-(--border-subtle) bg-(--surface-card) text-(--text-primary) shadow-xs">
            <button
                type="button"
                aria-expanded={isExpanded}
                onClick={onToggleExpand}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-start transition-colors hover:bg-(--surface-elevated)/60"
            >
                <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-(--text-primary) sm:text-sm">
                            {branch.title}
                        </span>
                        <span className="rounded-full bg-(--accent-primary-soft) px-2 py-0.5 font-mono text-[10px] font-bold text-(--accent-primary)">
                            {completedInBranch}/{branch.modules.length} modul
                        </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-(--text-muted)">{branch.description}</p>
                </div>

                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-(--text-muted) transition-transform duration-200 ${isExpanded ? 'rotate-180 text-(--accent-primary)' : ''
                        }`}
                />
            </button>

            {isExpanded && (
                <div className="space-y-3 border-t border-(--border-subtle) bg-(--surface-elevated)/40 p-3.5">
                    {/* Search Bar Debounced & Jump Input di dalam Cabang */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="relative min-w-44 flex-1">
                            <Search className="pointer-events-none absolute inset-s-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari modul atau rumus di cabang ini..."
                                className="h-9 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) pe-3 ps-8 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-hidden"
                            />
                        </div>

                        {totalPages > 1 && (
                            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 text-xs">
                                <label htmlFor={`jump-${branch.id}`} className="text-[11px] text-(--text-muted)">
                                    Hal
                                </label>
                                <input
                                    id={`jump-${branch.id}`}
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    value={jumpInput}
                                    onChange={(e) => setJumpInput(e.target.value)}
                                    className="h-8 w-12 rounded-lg border border-(--border-subtle) bg-(--surface-card) text-center font-mono text-xs font-bold text-(--text-primary)"
                                />
                                <span className="font-mono text-[11px] text-(--text-muted)">/ {totalPages}</span>
                                <button
                                    type="submit"
                                    className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2 text-[11px] font-bold text-(--accent-primary) hover:border-(--accent-primary)"
                                >
                                    Go
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Daftar Modul sesuai Halaman Aktif */}
                    {paginatedModules.length === 0 ? (
                        <p className="py-4 text-center text-xs text-(--text-muted)">
                            Tidak ada modul yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
                        </p>
                    ) : (
                        <div className="space-y-2.5">
                            {paginatedModules.map((mod) => {
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
                                        className={`veloa-pressable group flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3 text-start transition-all ${done
                                                ? 'border-emerald-500/40 bg-emerald-500/5'
                                                : 'border-(--border-subtle) bg-(--surface-card) hover:border-(--accent-primary)'
                                            }`}
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-bold text-(--accent-primary)">
                                                    {mod.pillar}
                                                </span>
                                                <span className="text-[11px] text-(--text-muted)">
                                                    {mod.entryCount} entri · ±{mod.estimatedMinutes} mnt
                                                </span>
                                                {done && (
                                                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>Selesai</span>
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="text-xs font-bold leading-snug text-(--text-primary) group-hover:text-(--accent-primary) sm:text-sm">
                                                {mod.title}
                                            </h4>
                                            <p className="line-clamp-2 text-xs text-(--text-secondary)">{mod.subtitle}</p>
                                        </div>

                                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-primary)" />
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* Kontrol Paginasi */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-(--border-subtle) pt-2.5 text-xs">
                            <span className="text-[11px] text-(--text-muted)">
                                Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(safePage * PAGE_SIZE, filteredModules.length)} dari{' '}
                                {filteredModules.length} modul
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={safePage <= 1}
                                    onClick={() => {
                                        const prev = Math.max(1, safePage - 1);
                                        setCurrentPage(prev);
                                        setJumpInput(String(prev));
                                    }}
                                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs font-semibold text-(--text-secondary) disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span>Prev</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={safePage >= totalPages}
                                    onClick={() => {
                                        const nxt = Math.min(totalPages, safePage + 1);
                                        setCurrentPage(nxt);
                                        setJumpInput(String(nxt));
                                    }}
                                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs font-semibold text-(--text-secondary) disabled:opacity-40"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const LearningHubView: React.FC<LearningHubViewProps> = ({
    selectedLang,
    onOpenModule,
}) => {
    const [hubMode, setHubMode] = useState<HubMode>('ROADMAP');
    const [openStageIds, setOpenStageIds] = useState<Record<string, boolean>>({});
    const [openBranchIds, setOpenBranchIds] = useState<Record<string, boolean>>({});

    const { completedModuleIds, isModuleCompleted } = useLessonProgress();
    const tree = CURRICULUM_TREES[selectedLang];
    const langMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === selectedLang) ?? LANGUAGE_OPTIONS[0]!;
    const langModules = useMemo(() => getManifestByLanguage(selectedLang), [selectedLang]);

    useEffect(() => {
        setOpenStageIds({});
        setOpenBranchIds({});
    }, [selectedLang]);

    const toggleStage = (stageId: string) => {
        setOpenStageIds((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    const toggleBranch = (branchId: string) => {
        setOpenBranchIds((prev) => ({ ...prev, [branchId]: !prev[branchId] }));
    };

    const stats = useMemo(() => {
        const total = langModules.length;
        const completed = langModules.filter((m) => completedModuleIds.includes(m.id)).length;
        const entries = langModules.reduce((acc, m) => acc + m.entryCount, 0);
        return { total, completed, entries };
    }, [langModules, completedModuleIds]);

    const renderStageNode = (
        stage: CurriculumStageGroup,
        variant: 'FOUNDATION' | 'DICTIONARY' | 'PROGRESSION' | 'LITERATURE',
    ) => {
        const isStageOpen = Boolean(openStageIds[stage.id]);
        const totalStageModules = stage.branches.reduce((acc, b) => acc + b.modules.length, 0);
        const isLit = variant === 'LITERATURE';

        const cardTheme = isLit
            ? 'overflow-hidden rounded-3xl border-2 border-violet-500/40 bg-(--surface-card) shadow-lg'
            : variant === 'FOUNDATION'
                ? 'veloa-surface-card border-sky-500/30 bg-sky-500/5'
                : variant === 'DICTIONARY'
                    ? 'veloa-surface-card border-amber-500/30 bg-amber-500/5'
                    : 'veloa-surface-card border-(--border-subtle)';

        return (
            <section key={stage.id} className={`overflow-hidden transition-all ${cardTheme}`}>
                {/* Header Kartu Tahapan (Khusus Sastra memakai gradien ungu pada header saja, bukan membungkus drawer) */}
                <button
                    type="button"
                    aria-expanded={isStageOpen}
                    onClick={() => toggleStage(stage.id)}
                    style={isLit ? { backgroundImage: 'var(--veloa-aurora-hero)' } : undefined}
                    className="flex w-full items-center justify-between gap-3 p-4 text-start sm:p-5"
                >
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${isLit
                                        ? 'bg-white/20 text-white'
                                        : variant === 'FOUNDATION'
                                            ? 'bg-sky-500/15 text-sky-800 dark:text-sky-300'
                                            : variant === 'DICTIONARY'
                                                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                                : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                    }`}
                            >
                                {isLit && <Feather className="h-3 w-3" />}
                                {variant === 'DICTIONARY' && <Library className="h-3 w-3" />}
                                <span>{stage.stageBadge}</span>
                            </span>

                            <span
                                className={`font-mono text-[11px] font-bold ${isLit ? 'text-white/90' : 'text-(--text-muted)'
                                    }`}
                            >
                                {stage.branches.length} cabang · {totalStageModules} modul
                            </span>
                        </div>

                        <h2
                            className={`text-base font-extrabold sm:text-lg ${isLit ? 'text-white' : 'text-(--text-primary)'
                                }`}
                        >
                            {stage.title}
                        </h2>
                        <p
                            className={`text-xs leading-relaxed ${isLit ? 'text-white/90' : 'text-(--text-secondary)'
                                }`}
                        >
                            {stage.subtitle}
                        </p>
                    </div>

                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isLit
                                ? 'border-white/30 bg-white/15 text-white'
                                : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                            }`}
                    >
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${isStageOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </div>
                </button>

                {/* Drawer Cabang dengan Kontras Terjaga (Light & Dark Mode) */}
                {isStageOpen && (
                    <div className="space-y-3 border-t border-(--border-subtle) bg-(--surface-canvas)/70 p-4 text-(--text-primary) sm:p-5">
                        {stage.branches.map((branch) => (
                            <BranchAccordionPanel
                                key={branch.id}
                                branch={branch}
                                isExpanded={Boolean(openBranchIds[branch.id])}
                                onToggleExpand={() => toggleBranch(branch.id)}
                                onOpenModule={onOpenModule}
                                isModuleCompleted={isModuleCompleted}
                            />
                        ))}
                    </div>
                )}
            </section>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header Utama & Switcher Mode */}
            <section className="flex flex-col justify-between gap-4 border-b border-(--border-subtle) pb-6 lg:flex-row lg:items-end">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{tree.nativeTitle}</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl">
                        Peta Kurikulum &amp; Pohon Ilmu Bahasa
                    </h1>
                    <p className="max-w-3xl text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                        {tree.methodologyNote}
                    </p>
                </div>

                <div
                    role="tablist"
                    aria-label="Pilih tampilan Learning Hub"
                    className="grid w-full grid-cols-2 gap-1.5 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-1.5 sm:w-auto"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={hubMode === 'ROADMAP'}
                        onClick={() => setHubMode('ROADMAP')}
                        className={`veloa-tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold sm:px-4 ${hubMode === 'ROADMAP'
                                ? 'bg-(--accent-primary) text-white shadow-xs'
                                : 'text-(--text-secondary)'
                            }`}
                    >
                        <Compass className="h-4 w-4 shrink-0" />
                        <span>Peta Cabang</span>
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={hubMode === 'SCRIPT_LAB'}
                        onClick={() => setHubMode('SCRIPT_LAB')}
                        className={`veloa-tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold sm:px-4 ${hubMode === 'SCRIPT_LAB'
                                ? 'bg-(--accent-primary) text-white shadow-xs'
                                : 'text-(--text-secondary)'
                            }`}
                    >
                        <Grid className="h-4 w-4 shrink-0" />
                        <span>Tabel Aksara</span>
                    </button>
                </div>
            </section>

            {hubMode === 'SCRIPT_LAB' ? (
                <InteractiveScriptCharts selectedLang={selectedLang} />
            ) : (
                <>
                    {/* Legenda Garis Penghubung & Statistik */}
                    <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4 text-xs">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-(--text-secondary)">
                                Progres:{' '}
                                <strong className="text-(--text-primary)">
                                    {stats.completed}/{stats.total} modul
                                </strong>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-(--text-secondary)">
                                <BookOpen className="h-4 w-4 text-(--accent-primary)" />
                                <span>
                                    Korpus:{' '}
                                    <strong className="text-(--text-primary)">
                                        {stats.entries.toLocaleString('id-ID')}
                                    </strong>{' '}
                                    entri
                                </span>
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-(--text-muted)">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="inline-block w-6 border-t-2 border-solid border-(--accent-primary)" />
                                <span>Jalur Utama: Pondasi → Dasar–Mahir → Sastra</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="inline-block w-6 border-t-2 border-dashed border-amber-500" />
                                <span>Referensi Kamus (Opsional)</span>
                            </span>
                        </div>
                    </section>

                    {/* ================================================================
              GRAFIS 2-SISI TERSTRUKTUR:
              KIRI (5 Kolom): Pondasi -> (Putus-putus) -> Kamus & Korpus Praktis
              KANAN (7 Kolom): Alur Utama Jenjang Dasar–Mahir -> (Solid) -> Sastra & Filologi
             ================================================================ */}
                    <div className="grid items-start gap-6 lg:grid-cols-12">
                        {/* SISI KIRI (5 Kolom): Pondasi -> Kamus (Terhenti di Kamus, tidak ke Sastra) */}
                        <div className="space-y-0 lg:col-span-5">
                            {/* 1. PONDASI FUNDAMENTAL */}
                            <div className="space-y-3">
                                {tree.foundationStages.map((st) => renderStageNode(st, 'FOUNDATION'))}
                                <button
                                    type="button"
                                    onClick={() => setHubMode('SCRIPT_LAB')}
                                    className="veloa-tactile-btn flex w-full items-center justify-between rounded-2xl border border-(--border-strong) bg-(--surface-card) px-4 text-xs font-bold text-(--accent-primary) hover:bg-(--accent-primary) hover:text-white"
                                >
                                    <span>Buka Matriks Interaktif Aksara {langMeta.name}</span>
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            </div>

                            {/* PENGHUBUNG PUTUS-PUTUS: Pondasi -> Kamus */}
                            <div className="flex flex-col items-center py-2.5 text-amber-600 dark:text-amber-400">
                                <div className="h-7 border-s-2 border-dashed border-amber-500/70" />
                                <span className="rounded-full border border-dashed border-amber-500/50 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold">
                                    Cabang Referensi Kamus (Opsional)
                                </span>
                                <ArrowDown className="h-4 w-4" />
                            </div>

                            {/* 2. KAMUS & KORPUS PRAKTIS (Mandiri, tanpa garis ke Sastra) */}
                            <div className="space-y-3">
                                {tree.dictionaryStages.map((st) => renderStageNode(st, 'DICTIONARY'))}
                            </div>
                        </div>

                        {/* SISI KANAN (7 Kolom): Alur Utama Berjenjang -> Advanced -> Sastra & Filologi */}
                        <div className="space-y-0 lg:col-span-7">
                            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-(--border-strong) bg-(--accent-primary-soft) px-4 py-2.5 text-xs font-bold text-(--accent-primary)">
                                <ArrowRight className="h-4 w-4 shrink-0" />
                                <span>
                                    Jalur Utama (Garis Solid): Pondasi → Jenjang Dasar–Mahir {langMeta.name} → Sastra
                                </span>
                            </div>

                            {tree.progressionStages.map((stage, idx) => (
                                <React.Fragment key={stage.id}>
                                    {renderStageNode(stage, 'PROGRESSION')}

                                    {/* Garis Penghubung Solid Antar-Jenjang & menuju Sastra */}
                                    <div className="flex flex-col items-center py-2 text-(--accent-primary)">
                                        <div className="h-6 border-s-2 border-solid border-(--accent-primary)" />
                                        {idx === tree.progressionStages.length - 1 && (
                                            <span className="mb-0.5 rounded-full bg-(--accent-primary-soft) px-2.5 py-0.5 text-[10px] font-bold text-(--accent-primary)">
                                                Kelanjutan Tahap Mahir (Advanced → Sastra)
                                            </span>
                                        )}
                                        <ArrowDown className="h-4 w-4" />
                                    </div>
                                </React.Fragment>
                            ))}

                            {/* 3. SASTRA, FILOLOGI & KEINDAHAN BAHASA (Berada langsung di bawah Advanced) */}
                            <div className="space-y-3">
                                {tree.literatureStages.map((st) => renderStageNode(st, 'LITERATURE'))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
// src/features/roadmap-graph/components/CurriculumHubPage.tsx
import React, { useMemo, useState } from 'react';
import {
    ArrowUpRight,
    BarChart3,
    BookOpen,
    CheckCircle2,
    Clock,
    Compass,
    Filter,
    Flame,
    Languages,
    Layers,
    Map as MapIcon,
    Moon,
    Play,
    Search,
    Sparkles,
    Sun,
} from 'lucide-react';
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import type {
    CurriculumManifestItem,
    LanguageCode,
} from '@/features/lesson-engine/schema/lesson.schema';
import {
    getManifestByLanguage,
    getManifestItemById,
    prefetchLessonModule,
} from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useMasteryEngine } from '@/features/practice-engine/hooks/useMasteryEngine';
import { MasteryDashboardView } from '@/features/practice-engine/components/MasteryDashboardView';

interface CurriculumHubPageProps {
    selectedLang: LanguageCode;
    onChangeLang: (lang: LanguageCode) => void;
    onOpenModule: (moduleId: string) => void;
    onOpenQuickSearch: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

interface LanguageMeta {
    code: LanguageCode;
    name: string;
    nativeName: string;
    framework: string;
    scriptBadge: string;
}

const LANGUAGES: LanguageMeta[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        framework: 'CEFR A1–C2 + IPA',
        scriptBadge: 'Latin + IPA',
    },
    {
        code: 'zh',
        name: 'Mandarin',
        nativeName: '普通话',
        framework: 'HSK 1–6 + CC-CEDICT',
        scriptBadge: '汉字 + Pīnyīn',
    },
    {
        code: 'ja',
        name: 'Jepang',
        nativeName: '日本語',
        framework: 'JLPT N5–N1 + 2.136 Kanji',
        scriptBadge: 'かな + 漢字',
    },
    {
        code: 'ar',
        name: 'Arab',
        nativeName: 'العربية الفصحى',
        framework: 'CEFR A1–C2 · Naḥwu & Ṣarf',
        scriptBadge: 'عربي مشكول',
    },
    {
        code: 'ko',
        name: 'Korea',
        nativeName: '한국어',
        framework: 'TOPIK I–II (1–6)',
        scriptBadge: '한글 + 漢字',
    },
];

const TIER_ORDER: CurriculumManifestItem['tier'][] = [
    'foundation',
    'beginner',
    'intermediate',
    'advanced',
    'native',
];

const TIER_METADATA: Record<
    CurriculumManifestItem['tier'],
    { title: string; subtitle: string; badgeClass: string }
> = {
    foundation: {
        title: 'Tier 0 · Foundation (Asal-Usul Aksara & Fonetik)',
        subtitle: 'Sejarah ortografi, cara kerja sistem tulisan, dan hukum artikulasi bunyi asli',
        badgeClass: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300',
    },
    beginner: {
        title: 'Tier 1 · Beginner (Struktur Inti & Leksikon Dasar)',
        subtitle: 'Pola kalimat fundamental, sistem kata kerja dasar, dan ribuan kosakata inti',
        badgeClass: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    },
    intermediate: {
        title: 'Tier 2 · Intermediate (Sintaksis Menengah & Nuansa)',
        subtitle: 'Konstruksi klausa kompleks, aspek waktu, dan perluasan kosakata akademik',
        badgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    },
    advanced: {
        title: 'Tier 3 · Advanced (Tata Bahasa Mahir & Formal)',
        subtitle: 'Ragam sastra, register formal tinggi, dan leksikon profesional tingkat lanjut',
        badgeClass: 'bg-violet-500/15 text-violet-800 dark:text-violet-300',
    },
    native: {
        title: 'Tier 4 · Native (Retorika, Stilistika & Dialek Regional)',
        subtitle: 'Ilmu gaya bahasa klasik, variasi dialek daerah, dan ekspresi idiomatik penutur asli',
        badgeClass: 'bg-rose-500/15 text-rose-800 dark:text-rose-300',
    },
};

type PillarFilter = 'ALL' | 'FOUNDATION' | 'GRAMMAR' | 'LEXICON';
type HubViewTab = 'CURRICULUM' | 'VAULT';

export const CurriculumHubPage: React.FC<CurriculumHubPageProps> = ({
    selectedLang,
    onChangeLang,
    onOpenModule,
    onOpenQuickSearch,
    isDarkMode,
    onToggleDarkMode,
}) => {
    const [activeTab, setActiveTab] = useState<HubViewTab>('CURRICULUM');
    const [pillarFilter, setPillarFilter] = useState<PillarFilter>('ALL');

    const { completedModuleIds, bookmarkedEntryIds, lastVisitedModuleId, isModuleCompleted } =
        useLessonProgress();
    const { xp, streakDays, accuracyPercent, srsRecords, getDueCountForLanguage } =
        useMasteryEngine();

    const langModules = useMemo(() => getManifestByLanguage(selectedLang), [selectedLang]);
    const dueSrsForLang = getDueCountForLanguage(selectedLang);

    const totalGlobalDueSrs = useMemo(() => {
        const now = Date.now();
        return Object.values(srsRecords).filter((rec) => rec.nextReviewAt <= now).length;
    }, [srsRecords]);

    const langStats = useMemo(() => {
        const totalModules = langModules.length;
        const completedCount = langModules.filter((m) => completedModuleIds.includes(m.id)).length;
        const totalEntries = langModules.reduce((acc, m) => acc + m.entryCount, 0);
        const totalMinutes = langModules.reduce((acc, m) => acc + m.estimatedMinutes, 0);
        return { totalModules, completedCount, totalEntries, totalMinutes };
    }, [langModules, completedModuleIds]);

    const filteredModules = useMemo(() => {
        return langModules.filter((mod) => {
            if (pillarFilter === 'FOUNDATION') {
                return mod.pillar === 'script' || mod.pillar === 'phonetics';
            }
            if (pillarFilter === 'GRAMMAR') {
                return mod.pillar === 'syntax' || mod.pillar === 'morphology';
            }
            if (pillarFilter === 'LEXICON') {
                return mod.pillar === 'lexicon-dialogue';
            }
            return true;
        });
    }, [langModules, pillarFilter]);

    const lastVisitedItem = lastVisitedModuleId
        ? getManifestItemById(lastVisitedModuleId)
        : undefined;

    return (
        <div className="min-h-screen bg-(--surface-canvas) text-(--text-primary)">
            {/* Top Glass Bar */}
            <header className="veloa-glass-chrome sticky top-0 z-30 border-b border-(--border-subtle)">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('CURRICULUM')}
                            className="flex items-center gap-3 text-left focus:outline-none"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--accent-primary) text-white shadow-xs">
                                <Compass className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-base font-extrabold tracking-tight text-(--text-primary)">
                                    Velòa
                                </span>
                                <span className="ms-2 hidden rounded-md bg-(--accent-primary-soft) px-2 py-0.5 text-[11px] font-semibold text-(--accent-primary) lg:inline-block">
                                    5-Pillar Language Architecture
                                </span>
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tombol Command Palette Ctrl+K */}
                        <button
                            type="button"
                            onClick={onOpenQuickSearch}
                            aria-label="Cari modul di seluruh 5 bahasa"
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-medium text-(--text-secondary) hover:border-(--border-strong)"
                        >
                            <Search className="h-3.5 w-3.5 text-(--accent-primary)" />
                            <span className="hidden md:inline">Cari Topik / Modul...</span>
                            <kbd className="rounded bg-(--surface-elevated) px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--text-muted)">
                                Ctrl K
                            </kbd>
                        </button>

                        {/* XP & Streak Pill (klik untuk masuk ke Brankas & Analitik) */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('VAULT')}
                            aria-label="Buka statistik XP dan brankas belajar"
                            className="veloa-tactile-btn hidden items-center gap-3 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-semibold hover:border-(--accent-primary) sm:inline-flex"
                        >
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                <Flame className="h-3.5 w-3.5 fill-current" />
                                <span>{streakDays}h</span>
                            </span>
                            <span className="text-(--border-strong)">|</span>
                            <span className="inline-flex items-center gap-1 text-(--accent-primary)">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>{xp.toLocaleString('id-ID')} XP</span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onToggleDarkMode}
                            aria-label={isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                            className="veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)"
                        >
                            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                {/* Hero & Switcher Utama (Peta Kurikulum vs Brankas & Analitik) */}
                <section className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--border-subtle) pb-6">
                    <div className="max-w-2xl space-y-2">
                        <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-4xl">
                            {activeTab === 'CURRICULUM'
                                ? 'Kurikulum Linguistik Terstruktur 5 Bahasa'
                                : 'Pusat Penguasaan & Brankas Belajar'}
                        </h1>
                        <p className="text-sm leading-relaxed text-(--text-secondary) sm:text-base">
                            {activeTab === 'CURRICULUM'
                                ? 'Pelajari fondasi aksara, hukum fonetik, tata bahasa mendalam, hingga korpus leksikon dan retorika tingkat penutur asli secara bertahap.'
                                : 'Pantau perkembangan 5 bahasa, jalankan sesi Spaced Repetition (SM-2), kelola kosakata tersimpan, dan cadangkan data belajar Anda.'}
                        </p>
                    </div>

                    {/* Primary Navigation Tabs */}
                    <nav
                        aria-label="Navigasi tampilan utama"
                        className="flex items-center gap-2 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-1.5"
                    >
                        <button
                            type="button"
                            aria-pressed={activeTab === 'CURRICULUM'}
                            onClick={() => setActiveTab('CURRICULUM')}
                            className={`veloa-tactile-btn inline-flex items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all ${activeTab === 'CURRICULUM'
                                    ? 'bg-(--accent-primary) text-white shadow-xs'
                                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                                }`}
                        >
                            <MapIcon className="h-4 w-4" />
                            <span>Peta Kurikulum</span>
                        </button>

                        <button
                            type="button"
                            aria-pressed={activeTab === 'VAULT'}
                            onClick={() => setActiveTab('VAULT')}
                            className={`veloa-tactile-btn inline-flex items-center gap-2 rounded-xl px-4 text-xs font-bold transition-all ${activeTab === 'VAULT'
                                    ? 'bg-(--accent-primary) text-white shadow-xs'
                                    : 'text-(--text-secondary) hover:text-(--text-primary)'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span>Brankas & Analitik</span>
                            {(totalGlobalDueSrs > 0 || bookmarkedEntryIds.length > 0) && (
                                <span
                                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold ${activeTab === 'VAULT'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                        }`}
                                >
                                    {totalGlobalDueSrs > 0
                                        ? `${totalGlobalDueSrs} SRS`
                                        : bookmarkedEntryIds.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </section>

                {activeTab === 'VAULT' ? (
                    <MasteryDashboardView onOpenModule={onOpenModule} />
                ) : (
                    <>
                        {/* 5 Language Tabs */}
                        <section className="mb-8">
                            <div
                                role="tablist"
                                aria-label="Pilih bahasa kurikulum"
                                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                            >
                                {LANGUAGES.map((item) => {
                                    const active = selectedLang === item.code;
                                    const count = CURRICULUM_MANIFEST.filter((m) => m.lang === item.code).length;

                                    return (
                                        <button
                                            key={item.code}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() => onChangeLang(item.code)}
                                            className={`veloa-tactile-btn flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${active
                                                    ? 'border-(--accent-primary) bg-(--accent-primary-soft) shadow-xs'
                                                    : 'border-(--border-subtle) bg-(--surface-card) hover:border-(--border-strong)'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-(--accent-primary)">
                                                    {item.code}
                                                </span>
                                                <span className="rounded-md bg-(--surface-elevated) px-2 py-0.5 font-mono text-[11px] font-semibold text-(--text-muted)">
                                                    {count} modul
                                                </span>
                                            </div>

                                            <div className="my-2">
                                                <p className="text-base font-extrabold text-(--text-primary)">{item.name}</p>
                                                <p className="text-xs font-medium text-(--text-secondary)">
                                                    {item.nativeName}
                                                </p>
                                            </div>

                                            <p className="truncate text-[11px] text-(--text-muted)">{item.framework}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Banner Lanjutkan Belajar Terakhir */}
                        {lastVisitedItem && (
                            <section className="veloa-surface-card mb-8 flex flex-wrap items-center justify-between gap-4 border-(--accent-primary)/35 bg-(--accent-primary-soft) p-5">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-(--accent-primary)">
                                        Lanjutkan Sesi Terakhir ({lastVisitedItem.lang.toUpperCase()})
                                    </span>
                                    <h2 className="text-base font-bold text-(--text-primary)">
                                        {lastVisitedItem.title}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onOpenModule(lastVisitedItem.id)}
                                    className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 text-xs font-semibold text-white"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Buka Modul</span>
                                </button>
                            </section>
                        )}

                        {/* Ringkasan Statistik Bahasa Terpilih & Filter Pilar */}
                        <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4 sm:p-5">
                            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                    <Languages className="h-4 w-4 text-(--accent-primary)" />
                                    <span className="text-(--text-secondary)">
                                        Progres:{' '}
                                        <strong className="text-(--text-primary)">
                                            {langStats.completedCount}/{langStats.totalModules}
                                        </strong>{' '}
                                        modul
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-emerald-500" />
                                    <span className="text-(--text-secondary)">
                                        Korpus:{' '}
                                        <strong className="text-(--text-primary)">
                                            {langStats.totalEntries.toLocaleString('id-ID')}
                                        </strong>{' '}
                                        entri
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <span className="text-(--text-secondary)">
                                        Akurasi Latihan:{' '}
                                        <strong className="text-(--text-primary)">{accuracyPercent}%</strong>
                                    </span>
                                </div>

                                {dueSrsForLang > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('VAULT')}
                                        className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-800 hover:bg-violet-500/25 dark:text-violet-300"
                                    >
                                        {dueSrsForLang} item siap diulang →
                                    </button>
                                )}

                                {bookmarkedEntryIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('VAULT')}
                                        className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-500/25 dark:text-amber-300"
                                    >
                                        {bookmarkedEntryIds.length} kata tersimpan →
                                    </button>
                                )}
                            </div>

                            {/* Filter Pilar */}
                            <div className="flex flex-wrap items-center gap-1.5">
                                <Filter className="me-1 h-3.5 w-3.5 text-(--text-muted)" aria-hidden="true" />
                                {(
                                    [
                                        { id: 'ALL', label: 'Semua' },
                                        { id: 'FOUNDATION', label: 'Aksara & Fonetik' },
                                        { id: 'GRAMMAR', label: 'Tata Bahasa' },
                                        { id: 'LEXICON', label: 'Kosakata & Dialog' },
                                    ] as const
                                ).map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setPillarFilter(tab.id)}
                                        className={`veloa-tactile-btn rounded-xl border px-3 text-xs font-semibold ${pillarFilter === tab.id
                                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Peta Modul Per Tier (Tier 0 -> Tier 4) */}
                        <div className="space-y-10">
                            {TIER_ORDER.map((tierKey) => {
                                const tierItems = filteredModules.filter((m) => m.tier === tierKey);
                                if (tierItems.length === 0) return null;

                                const meta = TIER_METADATA[tierKey];

                                return (
                                    <section key={tierKey} aria-label={meta.title} className="space-y-4">
                                        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-(--border-subtle) pb-3">
                                            <div>
                                                <span
                                                    className={`mb-1.5 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${meta.badgeClass}`}
                                                >
                                                    {tierKey.toUpperCase()}
                                                </span>
                                                <h2 className="text-lg font-extrabold text-(--text-primary) sm:text-xl">
                                                    {meta.title}
                                                </h2>
                                                <p className="text-xs text-(--text-secondary) sm:text-sm">
                                                    {meta.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {tierItems.map((mod, idx) => {
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
                                                        className={`veloa-surface-card veloa-tactile-btn group flex cursor-pointer flex-col justify-between p-5 text-left transition-all ${done
                                                                ? 'border-emerald-500/40 bg-emerald-500/5'
                                                                : 'hover:border-(--accent-primary)'
                                                            }`}
                                                    >
                                                        <div className="space-y-2.5">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-(--text-muted)">
                                                                    <Layers className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                                    <span>
                                                                        Modul {idx + 1} · {mod.pillar}
                                                                    </span>
                                                                </span>

                                                                {done ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                        <span>Selesai</span>
                                                                    </span>
                                                                ) : (
                                                                    <ArrowUpRight className="h-4 w-4 text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--accent-primary)" />
                                                                )}
                                                            </div>

                                                            <h3 className="text-base font-bold leading-snug text-(--text-primary) group-hover:text-(--accent-primary)">
                                                                {mod.title}
                                                            </h3>

                                                            <p className="line-clamp-2 text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                                                                {mod.subtitle}
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between border-t border-(--border-subtle) pt-3 text-xs text-(--text-muted)">
                                                            <span>{mod.entryCount.toLocaleString('id-ID')} entri tervalidasi</span>
                                                            <span>±{mod.estimatedMinutes} mnt</span>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
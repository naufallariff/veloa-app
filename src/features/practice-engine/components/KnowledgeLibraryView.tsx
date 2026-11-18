// src/features/practice-engine/components/KnowledgeLibraryView.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
    ArrowUpRight,
    Bookmark,
    Loader2,
    Trash2,
    Turtle,
    Volume2,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';
import { PaginatedDataView } from '@/components/ui/PaginatedDataView';
import { useStudyVault } from '../hooks/useStudyVault';

interface KnowledgeLibraryViewProps {
    selectedLang: LanguageCode;
    onOpenModule: (moduleId: string) => void;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const KnowledgeLibraryView: React.FC<KnowledgeLibraryViewProps> = ({
    selectedLang,
    onOpenModule,
}) => {
    const { bookmarkedEntryIds, toggleEntryBookmark } = useLessonProgress();
    const { resolvedBookmarked, isResolving } = useStudyVault(true);
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();

    const [langFilter, setLangFilter] = useState<'ACTIVE' | 'ALL'>('ACTIVE');

    type VaultItem = (typeof resolvedBookmarked)[number];

    const scopedItems = useMemo(() => {
        if (langFilter === 'ALL') return resolvedBookmarked;
        return resolvedBookmarked.filter((item) => item.lang === selectedLang);
    }, [resolvedBookmarked, langFilter, selectedLang]);

    const filterVaultItemFn = useCallback((item: VaultItem, q: string) => {
        return (
            item.script.toLowerCase().includes(q) ||
            item.meaning.toLowerCase().includes(q) ||
            Boolean(item.reading && item.reading.toLowerCase().includes(q)) ||
            item.moduleTitle.toLowerCase().includes(q)
        );
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="flex flex-wrap items-end justify-between gap-4 border-b border-(--border-subtle) pb-6">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                        <span>Knowledge Library · {bookmarkedEntryIds.length} Tersimpan</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl">
                        Brankas Kosakata & Aksara Pribadi
                    </h1>
                    <p className="max-w-2xl text-sm text-(--text-secondary)">
                        Kumpulan istilah, karakter, dan pola tata bahasa penting yang Anda tandai selama
                        mempelajari modul.
                    </p>
                </div>

                {/* Filter Scope Bahasa */}
                <div className="flex items-center gap-1.5 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-1.5">
                    <button
                        type="button"
                        onClick={() => setLangFilter('ACTIVE')}
                        className={`veloa-tactile-btn rounded-xl px-3.5 text-xs font-bold uppercase ${langFilter === 'ACTIVE'
                                ? 'bg-(--accent-primary) text-white'
                                : 'text-(--text-secondary) hover:text-(--text-primary)'
                            }`}
                    >
                        Bahasa Aktif ({selectedLang})
                    </button>
                    <button
                        type="button"
                        onClick={() => setLangFilter('ALL')}
                        className={`veloa-tactile-btn rounded-xl px-3.5 text-xs font-bold ${langFilter === 'ALL'
                                ? 'bg-(--accent-primary) text-white'
                                : 'text-(--text-secondary) hover:text-(--text-primary)'
                            }`}
                    >
                        Semua Bahasa ({bookmarkedEntryIds.length})
                    </button>
                </div>
            </section>

            {/* Grid Kartu Tersimpan dengan Paginasi & Pencarian */}
            {isResolving ? (
                <div className="veloa-surface-card flex items-center justify-center gap-2 py-16 text-sm text-(--text-muted)">
                    <Loader2 className="h-5 w-5 animate-spin text-(--accent-primary)" />
                    <span>Memuat koleksi tersimpan...</span>
                </div>
            ) : (
                <PaginatedDataView
                    key={`${langFilter}-${selectedLang}`}
                    data={scopedItems}
                    pageSize={9}
                    itemLabel="item tersimpan"
                    searchPlaceholder="Cari kosakata, pelafalan, atau terjemahan..."
                    filterFn={filterVaultItemFn}
                    emptyState={
                        <div className="veloa-surface-card border-dashed px-6 py-16 text-center text-sm text-(--text-muted)">
                            {bookmarkedEntryIds.length === 0
                                ? 'Belum ada item yang disimpan. Klik ikon Bookmark pada kartu kosakata di dalam modul untuk menyimpannya di sini.'
                                : 'Tidak ada item tersimpan pada filter bahasa atau kata kunci pencarian ini.'}
                        </div>
                    }
                    renderItems={(visibleItems) => (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleItems.map((item) => {
                                const isRtl = item.lang === 'ar';
                                const audioNormalKey = `lib-${item.id}-normal`;
                                const audioSlowKey = `lib-${item.id}-slow`;

                                return (
                                    <article
                                        key={item.id}
                                        className="veloa-surface-card flex flex-col justify-between p-5"
                                    >
                                        <div>
                                            <div className="mb-2 flex items-center justify-between gap-2">
                                                <span className="rounded-md bg-(--accent-primary-soft) px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-(--accent-primary)">
                                                    {item.lang} · {item.categoryLabel}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleEntryBookmark(item.id)}
                                                    aria-label={`Hapus ${item.script} dari brankas`}
                                                    className="veloa-tactile-btn inline-flex h-10 w-10 items-center justify-center rounded-xl text-(--text-muted) hover:bg-rose-500/15 hover:text-rose-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div dir={isRtl ? 'rtl' : 'ltr'} lang={item.lang} className="my-2">
                                                <h2
                                                    className={`${SCRIPT_CLASS_MAP[item.lang]} text-xl font-bold text-(--text-primary)`}
                                                >
                                                    {item.script}
                                                </h2>
                                            </div>

                                            {item.reading && (
                                                <p className="font-mono text-xs font-medium text-(--accent-primary)">
                                                    {item.reading}
                                                </p>
                                            )}

                                            <p className="mt-3 border-t border-(--border-subtle) pt-3 text-sm text-(--text-secondary)">
                                                {item.meaning}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => onOpenModule(item.moduleId)}
                                                className="veloa-tactile-btn inline-flex items-center gap-1 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-xs font-semibold text-(--text-secondary) hover:border-(--border-strong)"
                                            >
                                                <span>Buka Modul</span>
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </button>

                                            {isSupported && (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => speak(item.script, item.lang, audioNormalKey, false)}
                                                        aria-label={`Lafalkan ${item.script}`}
                                                        className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === audioNormalKey
                                                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)'
                                                            }`}
                                                    >
                                                        <Volume2 className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => speak(item.script, item.lang, audioSlowKey, true)}
                                                        aria-label={`Lafalkan lambat ${item.script}`}
                                                        className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === audioSlowKey
                                                                ? 'border-cyan-500 bg-cyan-600 text-white'
                                                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)'
                                                            }`}
                                                    >
                                                        <Turtle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                />
            )}
        </div>
    );
};
// src/features/roadmap-graph/components/GlobalQuickSearchModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Layers, Search, X } from 'lucide-react';

import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
type ManifestItem = (typeof CURRICULUM_MANIFEST)[number];

import { prefetchLessonModule } from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useDebouncedValue } from '@/shared/hooks/use-performance';

interface GlobalQuickSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectModule: (moduleId: string) => void;
}

const MAX_PREVIEW_RESULTS = 5;

const LANG_BADGE_MAP: Record<string, string> = {
    en: 'EN · English',
    zh: 'ZH · Mandarin',
    ja: 'JA · Jepang',
    ar: 'AR · Arab',
    ko: 'KO · Korea',
};

function scoreMatch(item: ManifestItem, q: string): number {
    const title = item.title.toLowerCase();
    const subtitle = item.subtitle.toLowerCase();
    const pillar = item.pillar.toLowerCase();
    const tier = item.tier.toLowerCase();
    const lang = item.lang.toLowerCase();

    if (title === q) return 100;
    if (title.startsWith(q)) return 85;
    if (title.includes(q)) return 70;
    if (pillar.includes(q) || tier.includes(q) || lang === q) return 50;
    if (subtitle.includes(q)) return 35;
    return 0;
}

export const GlobalQuickSearchModal: React.FC<GlobalQuickSearchModalProps> = ({
    isOpen,
    onClose,
    onSelectModule,
}) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    const debouncedQuery = useDebouncedValue(query.trim().toLowerCase(), 200);
    const { isModuleCompleted } = useLessonProgress();

    const { results, totalMatches } = useMemo(() => {
        if (!debouncedQuery) {
            return {
                results: CURRICULUM_MANIFEST.slice(0, MAX_PREVIEW_RESULTS),
                totalMatches: CURRICULUM_MANIFEST.length,
            };
        }

        const scored: Array<{ item: ManifestItem; score: number }> = [];
        for (const item of CURRICULUM_MANIFEST) {
            const score = scoreMatch(item, debouncedQuery);
            if (score > 0) {
                scored.push({ item, score });
            }
        }

        scored.sort((a, b) => b.score - a.score);

        return {
            results: scored.slice(0, MAX_PREVIEW_RESULTS).map((entry) => entry.item),
            totalMatches: scored.length,
        };
    }, [debouncedQuery]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            const timer = window.setTimeout(() => {
                inputRef.current?.focus();
            }, 40);
            return () => window.clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [debouncedQuery]);

    // Pastikan item yang dipilih keyboard selalu terlihat dalam scroll container
    useEffect(() => {
        const activeEl = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
        activeEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [selectedIndex]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    results.length > 0 ? (prev - 1 + results.length) % results.length : 0,
                );
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault();
                const chosen = results[selectedIndex];
                onSelectModule(chosen.id);
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onSelectModule, results, selectedIndex]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian cepat kurikulum Veloa"
            className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 pt-16 backdrop-blur-xs sm:pt-24"
            onClick={onClose}
        >
            <div
                className="veloa-surface-card w-full max-w-xl overflow-hidden border border-(--border-strong) shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Input Pencarian */}
                <div className="flex items-center gap-3 border-b border-(--border-subtle) px-4 py-3.5">
                    <Search className="h-5 w-5 shrink-0 text-(--accent-primary)" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari topik tata bahasa, aksara, atau modul..."
                        className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label="Bersihkan kata kunci"
                            className="rounded-md px-2 py-1 text-xs font-semibold text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)"
                        >
                            Reset
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup pencarian"
                        className="veloa-tactile-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Daftar Hasil (Dibatasi Top 5 Teratas + Smooth Scroll) */}
                <div className="max-h-72 overflow-y-auto scroll-smooth p-2.5">
                    {results.length === 0 ? (
                        <div className="py-10 text-center text-sm text-(--text-muted)">
                            Tidak ditemukan modul yang cocok dengan “{query}”.
                        </div>
                    ) : (
                        <ul ref={listRef} role="listbox" className="space-y-1.5">
                            {results.map((item, idx) => {
                                const active = idx === selectedIndex;
                                const done = isModuleCompleted(item.id);

                                return (
                                    <li key={item.id} role="option" aria-selected={active}>
                                        <button
                                            type="button"
                                            onMouseEnter={() => {
                                                setSelectedIndex(idx);
                                                prefetchLessonModule(item.id);
                                            }}
                                            onClick={() => {
                                                onSelectModule(item.id);
                                                onClose();
                                            }}
                                            className={`veloa-pressable flex w-full items-start justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${active
                                                    ? 'bg-(--accent-primary-soft) text-(--text-primary)'
                                                    : 'text-(--text-primary) hover:bg-(--surface-elevated)/60'
                                                }`}
                                        >
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-md bg-(--surface-card) px-2 py-0.5 font-mono text-[11px] font-bold text-(--accent-primary)">
                                                        {LANG_BADGE_MAP[item.lang] ?? item.lang.toUpperCase()}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-(--text-muted)">
                                                        <Layers className="h-3 w-3" />
                                                        <span>{item.tier}</span>
                                                    </span>
                                                    {done && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            <span>Selesai</span>
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="truncate text-sm font-bold text-(--text-primary)">
                                                    {item.title}
                                                </p>
                                                <p className="truncate text-xs text-(--text-secondary)">{item.subtitle}</p>
                                            </div>

                                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-(--text-muted)" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer Bantuan Pintasan */}
                <div className="flex items-center justify-between border-t border-(--border-subtle) bg-(--surface-elevated)/50 px-4 py-2.5 text-[11px] text-(--text-muted)">
                    <span>Top {results.length} dari {totalMatches} hasil · ↑ ↓ Enter</span>
                    <span>{CURRICULUM_MANIFEST.length} Modul Terindeks</span>
                </div>
            </div>
        </div>
    );
};
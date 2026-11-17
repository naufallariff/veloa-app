// src/features/roadmap-graph/components/GlobalQuickSearchModal.tsx
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Layers, Search, X } from 'lucide-react';
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import { prefetchLessonModule } from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';

interface GlobalQuickSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectModule: (moduleId: string) => void;
}

const LANG_BADGE_MAP: Record<string, string> = {
    en: 'EN · English',
    zh: 'ZH · Mandarin',
    ja: 'JA · Jepang',
    ar: 'AR · Arab',
    ko: 'KO · Korea',
};

export const GlobalQuickSearchModal: React.FC<GlobalQuickSearchModalProps> = ({
    isOpen,
    onClose,
    onSelectModule,
}) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const deferredQuery = useDeferredValue(query);
    const { isModuleCompleted } = useLessonProgress();

    const results = useMemo(() => {
        const q = deferredQuery.trim().toLowerCase();
        if (!q) {
            return CURRICULUM_MANIFEST.slice(0, 12);
        }
        return CURRICULUM_MANIFEST.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.subtitle.toLowerCase().includes(q) ||
                item.lang.toLowerCase().includes(q) ||
                item.tier.toLowerCase().includes(q) ||
                item.pillar.toLowerCase().includes(q),
        ).slice(0, 20);
    }, [deferredQuery]);

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
    }, [deferredQuery]);

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
            aria-label="Pencarian cepat kurikulum Velòa"
            className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 pt-16 backdrop-blur-xs sm:pt-24"
            onClick={onClose}
        >
            <div
                className="veloa-surface-card w-full max-w-2xl overflow-hidden border border-(--border-strong) shadow-2xl"
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
                        placeholder="Cari topik tata bahasa, aksara, atau modul (mis. Naḥwu, Kanji, Subjunctive, Batchim)..."
                        className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup pencarian"
                        className="veloa-tactile-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Daftar Hasil */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.length === 0 ? (
                        <div className="py-12 text-center text-sm text-(--text-muted)">
                            Tidak ditemukan modul yang cocok dengan “{query}”.
                        </div>
                    ) : (
                        <ul role="listbox" className="space-y-1">
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
                                            className={`flex w-full items-start justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition-colors ${active
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
                    <span>Navigasi: ↑ ↓ Pilih · Enter Buka · Esc Tutup</span>
                    <span>{CURRICULUM_MANIFEST.length} Modul Terindeks</span>
                </div>
            </div>
        </div>
    );
};
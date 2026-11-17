// src/features/lesson-engine/blocks/ScriptMatrixBlock.tsx
import React, { useDeferredValue, useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Grid,
    Info,
    Search,
    Sparkles,
    Turtle,
    Volume2,
    X,
} from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';

type ScriptMatrixData = Extract<LessonBlock, { type: 'script-matrix' }>;
type ScriptCellItem = ScriptMatrixData['cells'][number];

interface ScriptMatrixBlockProps {
    block: ScriptMatrixData;
    lang: LanguageCode;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

const PAGE_SIZE = 48;

export const ScriptMatrixBlock: React.FC<ScriptMatrixBlockProps> = ({ block, lang }) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const [searchInput, setSearchInput] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [inspectedCell, setInspectedCell] = useState<ScriptCellItem | null>(null);

    const deferredSearch = useDeferredValue(searchInput);
    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    // Ekstrak kategori unik (misal: Grade 1, Konsonan Dasar, Harakat)
    const roleCategories = useMemo(() => {
        const roles = new Set<string>();
        for (const cell of block.cells) {
            if (cell.componentRole) {
                roles.add(cell.componentRole);
            }
        }
        return Array.from(roles);
    }, [block.cells]);

    // Filter sel aksara
    const filteredCells = useMemo(() => {
        const q = deferredSearch.trim().toLowerCase();
        return block.cells.filter((cell) => {
            if (selectedRole !== 'ALL' && cell.componentRole !== selectedRole) {
                return false;
            }
            if (!q) return true;
            return (
                cell.glyph.toLowerCase().includes(q) ||
                cell.reading.toLowerCase().includes(q) ||
                cell.transliteration.toLowerCase().includes(q) ||
                (cell.componentRole && cell.componentRole.toLowerCase().includes(q)) ||
                (cell.mnemonic && cell.mnemonic.toLowerCase().includes(q))
            );
        });
    }, [block.cells, deferredSearch, selectedRole]);

    const totalPages = Math.max(1, Math.ceil(filteredCells.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedCells = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredCells.slice(start, start + PAGE_SIZE);
    }, [filteredCells, safePage]);

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setCurrentPage(1);
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setCurrentPage(1);
    };

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Matriks Aksara */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-semibold text-(--accent-primary)">
                        <Grid className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{block.scriptSystem}</span>
                        <span className="rounded-full bg-(--surface-card) px-2 py-0.5 font-mono text-[11px] text-(--text-primary)">
                            {block.cells.length.toLocaleString('id-ID')} unit
                        </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                        {block.title}
                    </h3>
                    {block.description && (
                        <p className="max-w-3xl text-sm leading-relaxed text-(--text-secondary)">
                            {block.description}
                        </p>
                    )}
                </div>

                {/* Pencarian Cepat */}
                {block.cells.length > 12 && (
                    <div className="relative w-full sm:w-72">
                        <Search
                            className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Cari karakter, bacaan, atau arti..."
                            aria-label="Cari dalam matriks aksara"
                            className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) ps-10 pe-4 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Filter Chip Kategori (Jika lebih dari 1 kategori peran) */}
            {roleCategories.length > 1 && roleCategories.length <= 16 && (
                <div
                    role="tablist"
                    aria-label="Filter kategori aksara"
                    className="mb-6 flex flex-wrap items-center gap-2"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedRole === 'ALL'}
                        onClick={() => handleRoleChange('ALL')}
                        className={`veloa-tactile-btn rounded-xl border px-3.5 text-xs font-semibold ${selectedRole === 'ALL'
                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                            }`}
                    >
                        Semua ({block.cells.length.toLocaleString('id-ID')})
                    </button>

                    {roleCategories.map((role) => (
                        <button
                            key={role}
                            type="button"
                            role="tab"
                            aria-selected={selectedRole === role}
                            onClick={() => handleRoleChange(role)}
                            className={`veloa-tactile-btn rounded-xl border px-3.5 text-xs font-semibold ${selectedRole === role
                                    ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                    : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            )}

            {/* Panel Inspeksi Detail Saat Sel Diklik */}
            {inspectedCell && (
                <div className="mb-6 rounded-2xl border border-(--accent-primary)/40 bg-(--accent-primary-soft) p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div
                                dir={isRtl ? 'rtl' : 'ltr'}
                                className={`${scriptClass} flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--surface-card) text-3xl font-bold text-(--text-primary) shadow-xs sm:text-4xl`}
                            >
                                {inspectedCell.glyph}
                            </div>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-base font-bold text-(--accent-primary)">
                                        {inspectedCell.reading}
                                    </span>
                                    {inspectedCell.componentRole && (
                                        <span className="rounded-md bg-(--surface-card) px-2 py-0.5 text-xs font-semibold text-(--text-secondary)">
                                            {inspectedCell.componentRole}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-(--text-primary)">
                                    {inspectedCell.transliteration}
                                </p>
                                {inspectedCell.mnemonic && (
                                    <p className="flex items-center gap-1.5 text-xs leading-relaxed text-(--text-secondary)">
                                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                        <span>{inspectedCell.mnemonic}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isSupported && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            speak(inspectedCell.glyph, lang, `inspect-${inspectedCell.glyph}`, false)
                                        }
                                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl bg-(--accent-primary) px-4 text-xs font-semibold text-white"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                        <span>Lafalkan</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            speak(
                                                inspectedCell.glyph,
                                                lang,
                                                `inspect-slow-${inspectedCell.glyph}`,
                                                true,
                                            )
                                        }
                                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-semibold text-(--text-secondary)"
                                    >
                                        <Turtle className="h-4 w-4" />
                                        <span>Lambat</span>
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => setInspectedCell(null)}
                                aria-label="Tutup panel inspeksi karakter"
                                className="veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Kartu Aksara */}
            {paginatedCells.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-(--border-strong) py-12 text-center text-sm text-(--text-muted)">
                    Tidak ditemukan karakter untuk pencarian “{searchInput}”.
                </div>
            ) : (
                <div
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                >
                    {paginatedCells.map((cell, idx) => {
                        const cellAudioKey = `matrix-${safePage}-${idx}-${cell.glyph}`;
                        const isPlaying = speakingKey === cellAudioKey;
                        const isSelected = inspectedCell?.glyph === cell.glyph;

                        return (
                            <div
                                key={`${cell.glyph}-${idx}`}
                                onClick={() => {
                                    setInspectedCell(cell);
                                    if (isSupported) {
                                        speak(cell.glyph, lang, cellAudioKey, false);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setInspectedCell(cell);
                                        if (isSupported) {
                                            speak(cell.glyph, lang, cellAudioKey, false);
                                        }
                                    }
                                }}
                                aria-label={`${cell.glyph}, bacaan ${cell.reading}, arti ${cell.transliteration}`}
                                className={`veloa-tactile-btn group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-3.5 text-center transition-all ${isSelected || isPlaying
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft)'
                                        : 'border-(--border-subtle) bg-(--surface-elevated)/50 hover:border-(--border-strong) hover:bg-(--surface-card)'
                                    }`}
                            >
                                <div dir="ltr" className="flex items-center justify-between text-[10px]">
                                    <span className="truncate font-medium text-(--text-muted)">
                                        {cell.componentRole ?? ''}
                                    </span>
                                    {cell.mnemonic && (
                                        <Info
                                            className="h-3.5 w-3.5 shrink-0 text-(--text-muted) group-hover:text-(--accent-primary)"
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>

                                <div className="my-2">
                                    <p
                                        className={`${scriptClass} text-2xl font-bold text-(--text-primary) sm:text-3xl`}
                                    >
                                        {cell.glyph}
                                    </p>
                                </div>

                                <div dir="ltr" className="space-y-0.5">
                                    <p className="truncate font-mono text-xs font-semibold text-(--accent-primary)">
                                        {cell.reading}
                                    </p>
                                    <p className="line-clamp-2 text-[11px] leading-snug text-(--text-secondary)">
                                        {cell.transliteration}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Kontrol Paginasi (Untuk 2.136 Kanji / Daftar Panjang) */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-(--border-subtle) pt-5">
                    <p className="text-xs text-(--text-muted)">
                        Menampilkan{' '}
                        <span className="font-semibold text-(--text-primary)">
                            {((safePage - 1) * PAGE_SIZE + 1).toLocaleString('id-ID')}–
                            {Math.min(safePage * PAGE_SIZE, filteredCells.length).toLocaleString('id-ID')}
                        </span>{' '}
                        dari{' '}
                        <span className="font-semibold text-(--text-primary)">
                            {filteredCells.length.toLocaleString('id-ID')}
                        </span>{' '}
                        karakter
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="veloa-tactile-btn inline-flex items-center gap-1 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Sebelumnya</span>
                        </button>

                        <span className="px-2 font-mono text-xs font-semibold text-(--text-primary)">
                            {safePage} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="veloa-tactile-btn inline-flex items-center gap-1 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <span>Berikutnya</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
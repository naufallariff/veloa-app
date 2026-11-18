import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebouncedValue, usePagination } from '../../shared/hooks/use-performance';

interface PaginatedDataViewProps<T> {
    data: readonly T[];
    pageSize?: number;
    searchPlaceholder?: string;
    filterFn?: (item: T, normalizedQuery: string) => boolean;
    renderItems: (visibleItems: T[], pageInfo: { startIndex: number }) => React.ReactNode;
    emptyState?: React.ReactNode;
    headerSlot?: React.ReactNode;
    itemLabel?: string;
    debounceMs?: number;
}

export function PaginatedDataView<T>({
    data,
    pageSize = 10,
    searchPlaceholder = 'Cari item...',
    filterFn,
    renderItems,
    emptyState,
    headerSlot,
    itemLabel = 'item',
    debounceMs = 220,
}: PaginatedDataViewProps<T>) {
    const [searchInput, setSearchInput] = useState('');
    const [jumpInput, setJumpInput] = useState('');
    const debouncedQuery = useDebouncedValue(searchInput.trim().toLowerCase(), debounceMs);

    const filteredData = useMemo(() => {
        if (!debouncedQuery || !filterFn) return data;
        return data.filter((item) => filterFn(item, debouncedQuery));
    }, [data, debouncedQuery, filterFn]);

    const { page, totalPages, totalItems, items, setPage, nextPage, prevPage } =
        usePagination(filteredData, pageSize);

    useEffect(() => {
        setPage(1);
    }, [debouncedQuery, setPage]);

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const target = Number.parseInt(jumpInput, 10);
        if (!Number.isNaN(target)) {
            setPage(target);
            setJumpInput('');
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Bar Pencarian + Filter Tambahan */}
            {(filterFn || headerSlot) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {filterFn && (
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder={searchPlaceholder}
                                aria-label={searchPlaceholder}
                                className="h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) pr-9 pl-10 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput('')}
                                    aria-label="Hapus pencarian"
                                    className="veloa-pressable absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                    {headerSlot && <div className="shrink-0">{headerSlot}</div>}
                </div>
            )}

            {/* Ringkasan Jumlah Data */}
            <div className="flex items-center justify-between text-xs font-medium text-(--text-muted)">
                <span>
                    Menampilkan <strong className="text-(--text-primary)">{items.length}</strong> dari{' '}
                    <strong className="text-(--text-primary)">{totalItems}</strong> {itemLabel}
                </span>
                {totalPages > 1 && (
                    <span>
                        Halaman {page} / {totalPages}
                    </span>
                )}
            </div>

            {/* Konten Utama */}
            {items.length === 0 ? (
                emptyState ?? (
                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-10 text-center text-sm text-(--text-secondary)">
                        Tidak ada {itemLabel} yang cocok dengan pencarian Anda.
                    </div>
                )
            ) : (
                renderItems(items, { startIndex: (page - 1) * pageSize })
            )}

            {/* Kontrol Pagination + Jump-to-Page Input */}
            {totalPages > 1 && (
                <nav
                    aria-label="Navigasi halaman"
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-2.5"
                >
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={prevPage}
                            disabled={page <= 1}
                            aria-label="Halaman sebelumnya"
                            className="veloa-pressable inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs font-semibold text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Prev</span>
                        </button>

                        <span className="px-2 text-xs font-semibold tabular-nums text-(--text-primary)">
                            {page} <span className="text-(--text-muted)">/ {totalPages}</span>
                        </span>

                        <button
                            type="button"
                            onClick={nextPage}
                            disabled={page >= totalPages}
                            aria-label="Halaman berikutnya"
                            className="veloa-pressable inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs font-semibold text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Jump Input */}
                    <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
                        <label htmlFor="veloa-jump-page" className="text-xs text-(--text-muted)">
                            Lompat:
                        </label>
                        <input
                            id="veloa-jump-page"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={totalPages}
                            value={jumpInput}
                            onChange={(e) => setJumpInput(e.target.value)}
                            placeholder={`1-${totalPages}`}
                            className="h-9 w-16 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2 text-center text-xs font-semibold tabular-nums text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="veloa-pressable h-9 rounded-lg bg-(--accent-primary) px-3 text-xs font-semibold text-white hover:bg-(--accent-primary-hover)"
                        >
                            Go
                        </button>
                    </form>
                </nav>
            )}
        </div>
    );
}
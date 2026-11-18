import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Menunda pembaruan nilai pencarian agar filtering ribuan entri (Kanji/Hanzi/Brankas)
 * tidak membebani main thread pada setiap ketukan keyboard.
 */
export function useDebouncedValue<T>(value: T, delayMs = 220): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}

/**
 * Membatasi frekuensi eksekusi aksi (rate-limiting untuk tombol TTS Audio,
 * navigasi cepat, dan scroll listener).
 */
export function useThrottledCallback<T extends (...args: never[]) => void>(
    callback: T,
    intervalMs = 350
): T {
    const lastRunRef = useRef<number>(0);
    const callbackRef = useRef<T>(callback);
    callbackRef.current = callback;

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastRunRef.current >= intervalMs) {
                lastRunRef.current = now;
                callbackRef.current(...args);
            }
        }) as T,
        [intervalMs]
    );
}

export interface PaginationResult<T> {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    items: T[];
    setPage: (nextPage: number) => void;
    nextPage: () => void;
    prevPage: () => void;
}

/**
 * Hook paginasi aman dengan validasi batas halaman (1 .. totalPages)
 * dan auto-reset ke halaman 1 ketika dataset hasil filter berubah.
 */
export function usePagination<T>(
    data: readonly T[],
    pageSize = 12
): PaginationResult<T> {
    const [rawPage, setRawPage] = useState(1);

    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const page = Math.min(Math.max(1, rawPage), totalPages);

    const items = useMemo(() => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, page, pageSize]);

    const setPage = useCallback(
        (next: number) => {
            if (!Number.isFinite(next)) return;
            const clamped = Math.min(Math.max(1, Math.floor(next)), totalPages);
            setRawPage(clamped);
        },
        [totalPages]
    );

    const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
    const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);

    return {
        page,
        totalPages,
        totalItems,
        pageSize,
        items,
        setPage,
        nextPage,
        prevPage,
    };
}
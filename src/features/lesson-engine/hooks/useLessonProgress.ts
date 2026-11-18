// src/features/lesson-engine/hooks/useLessonProgress.ts
import { useCallback, useEffect, useState } from 'react';

interface VeloaProgressState {
    completedModuleIds: string[];
    completedBlockKeys: string[];
    bookmarkedEntryIds: string[];
    lastVisitedModuleId: string | null;
}

const STORAGE_KEY = 'veloa.curriculum.progress.v1';

const DEFAULT_STATE: VeloaProgressState = {
    completedModuleIds: [],
    completedBlockKeys: [],
    bookmarkedEntryIds: [],
    lastVisitedModuleId: null,
};

function readProgressFromStorage(): VeloaProgressState {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw) as Partial<VeloaProgressState>;
        return {
            completedModuleIds: Array.isArray(parsed.completedModuleIds) ? parsed.completedModuleIds : [],
            completedBlockKeys: Array.isArray(parsed.completedBlockKeys) ? parsed.completedBlockKeys : [],
            bookmarkedEntryIds: Array.isArray(parsed.bookmarkedEntryIds) ? parsed.bookmarkedEntryIds : [],
            lastVisitedModuleId:
                typeof parsed.lastVisitedModuleId === 'string' ? parsed.lastVisitedModuleId : null,
        };
    } catch {
        return DEFAULT_STATE;
    }
}

function writeProgressToStorage(state: VeloaProgressState): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Abaikan jika kuota penyimpanan penuh
    }
}

export function useLessonProgress() {
    const [state, setState] = useState<VeloaProgressState>(() => readProgressFromStorage());

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setState(readProgressFromStorage());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const markModuleVisited = useCallback((moduleId: string) => {
        setState((prev) => {
            if (prev.lastVisitedModuleId === moduleId) return prev;
            const next = { ...prev, lastVisitedModuleId: moduleId };
            writeProgressToStorage(next);
            return next;
        });
    }, []);

    const toggleModuleCompleted = useCallback((moduleId: string) => {
        setState((prev) => {
            const exists = prev.completedModuleIds.includes(moduleId);
            const completedModuleIds = exists
                ? prev.completedModuleIds.filter((id) => id !== moduleId)
                : [...prev.completedModuleIds, moduleId];
            const next = { ...prev, completedModuleIds };
            writeProgressToStorage(next);
            return next;
        });
    }, []);

    const toggleBlockCompleted = useCallback((moduleId: string, blockIndex: number) => {
        const blockKey = `${moduleId}::${blockIndex}`;
        setState((prev) => {
            const exists = prev.completedBlockKeys.includes(blockKey);
            const completedBlockKeys = exists
                ? prev.completedBlockKeys.filter((k) => k !== blockKey)
                : [...prev.completedBlockKeys, blockKey];
            const next = { ...prev, completedBlockKeys };
            writeProgressToStorage(next);
            return next;
        });
    }, []);

    const toggleEntryBookmark = useCallback((entryId: string) => {
        setState((prev) => {
            const exists = prev.bookmarkedEntryIds.includes(entryId);
            const bookmarkedEntryIds = exists
                ? prev.bookmarkedEntryIds.filter((id) => id !== entryId)
                : [...prev.bookmarkedEntryIds, entryId];
            const next = { ...prev, bookmarkedEntryIds };
            writeProgressToStorage(next);
            return next;
        });
    }, []);

    const isModuleCompleted = useCallback(
        (moduleId: string) => state.completedModuleIds.includes(moduleId),
        [state.completedModuleIds],
    );

    const isBlockCompleted = useCallback(
        (moduleId: string, blockIndex: number) =>
            state.completedBlockKeys.includes(`${moduleId}::${blockIndex}`),
        [state.completedBlockKeys],
    );

    const isEntryBookmarked = useCallback(
        (entryId: string) => state.bookmarkedEntryIds.includes(entryId),
        [state.bookmarkedEntryIds],
    );

    return {
        completedModuleIds: state.completedModuleIds,
        completedBlockKeys: state.completedBlockKeys,
        bookmarkedEntryIds: state.bookmarkedEntryIds,
        lastVisitedModuleId: state.lastVisitedModuleId,
        markModuleVisited,
        toggleModuleCompleted,
        toggleBlockCompleted,
        toggleEntryBookmark,
        isModuleCompleted,
        isBlockCompleted,
        isEntryBookmarked,
    };
}
// src/features/lesson-engine/hooks/useLessonProgress.ts
import { useCallback, useEffect, useState } from 'react';

interface VelòaProgressState {
    completedModuleIds: string[];
    bookmarkedEntryIds: string[];
    lastVisitedModuleId: string | null;
}

const STORAGE_KEY = 'veloa.curriculum.progress.v1';

const DEFAULT_STATE: VelòaProgressState = {
    completedModuleIds: [],
    bookmarkedEntryIds: [],
    lastVisitedModuleId: null,
};

function readProgressFromStorage(): VelòaProgressState {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_STATE;
        const parsed = JSON.parse(raw) as Partial<VelòaProgressState>;
        return {
            completedModuleIds: Array.isArray(parsed.completedModuleIds) ? parsed.completedModuleIds : [],
            bookmarkedEntryIds: Array.isArray(parsed.bookmarkedEntryIds) ? parsed.bookmarkedEntryIds : [],
            lastVisitedModuleId:
                typeof parsed.lastVisitedModuleId === 'string' ? parsed.lastVisitedModuleId : null,
        };
    } catch {
        return DEFAULT_STATE;
    }
}

function writeProgressToStorage(state: VelòaProgressState): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Abaikan kuota penyimpanan penuh
    }
}

export function useLessonProgress() {
    const [state, setState] = useState<VelòaProgressState>(() => readProgressFromStorage());

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

    const isEntryBookmarked = useCallback(
        (entryId: string) => state.bookmarkedEntryIds.includes(entryId),
        [state.bookmarkedEntryIds],
    );

    return {
        completedModuleIds: state.completedModuleIds,
        bookmarkedEntryIds: state.bookmarkedEntryIds,
        lastVisitedModuleId: state.lastVisitedModuleId,
        markModuleVisited,
        toggleModuleCompleted,
        toggleEntryBookmark,
        isModuleCompleted,
        isEntryBookmarked,
    };
}
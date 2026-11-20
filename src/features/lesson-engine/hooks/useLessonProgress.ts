// src/features/lesson-engine/hooks/useLessonProgress.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';

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

function extractBlockIndicesForModule(blockKeys: string[], moduleId: string): number[] {
    const prefix = `${moduleId}::`;
    return blockKeys
        .filter((k) => k.startsWith(prefix))
        .map((k) => Number(k.slice(prefix.length)))
        .filter((n) => Number.isInteger(n) && n >= 0)
        .sort((a, b) => a - b);
}

export function useLessonProgress() {
    const { user, isGuest } = useAuth();
    const [state, setState] = useState<VeloaProgressState>(() => readProgressFromStorage());
    const syncedUidRef = useRef<string | null>(null);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setState(readProgressFromStorage());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Sinkronisasi awal saat pengguna login (Merge Lokal <-> Supabase PostgreSQL)
    useEffect(() => {
        if (isGuest || !user || !supabase) {
            syncedUidRef.current = null;
            return;
        }
        if (syncedUidRef.current === user.id) return;
        syncedUidRef.current = user.id;

        const uid = user.id;
        const client = supabase;

        (async () => {
            const [modRes, bmRes] = await Promise.all([
                client
                    .from('user_module_progress')
                    .select('module_id, is_completed, completed_card_indices')
                    .eq('user_id', uid),
                client.from('user_bookmarks').select('entry_id').eq('user_id', uid),
            ]);

            if (modRes.error || bmRes.error) return;

            const local = readProgressFromStorage();
            const mergedCompletedModules = new Set<string>(local.completedModuleIds);
            const mergedBlockKeys = new Set<string>(local.completedBlockKeys);
            const mergedBookmarks = new Set<string>(local.bookmarkedEntryIds);

            for (const row of modRes.data ?? []) {
                if (row.is_completed) {
                    mergedCompletedModules.add(row.module_id);
                }
                if (Array.isArray(row.completed_card_indices)) {
                    for (const idx of row.completed_card_indices) {
                        mergedBlockKeys.add(`${row.module_id}::${idx}`);
                    }
                }
            }

            for (const row of bmRes.data ?? []) {
                mergedBookmarks.add(row.entry_id);
            }

            const nextState: VeloaProgressState = {
                completedModuleIds: Array.from(mergedCompletedModules),
                completedBlockKeys: Array.from(mergedBlockKeys),
                bookmarkedEntryIds: Array.from(mergedBookmarks),
                lastVisitedModuleId: local.lastVisitedModuleId,
            };

            writeProgressToStorage(nextState);
            setState(nextState);

            // Dorong progres lokal yang belum ada di cloud ke Supabase
            const allModuleIds = new Set<string>([
                ...nextState.completedModuleIds,
                ...nextState.completedBlockKeys.map((k) => k.split('::')[0]!),
            ]);

            if (allModuleIds.size > 0) {
                const modRows = Array.from(allModuleIds).map((moduleId) => ({
                    user_id: uid,
                    module_id: moduleId,
                    is_completed: nextState.completedModuleIds.includes(moduleId),
                    completed_card_indices: extractBlockIndicesForModule(
                        nextState.completedBlockKeys,
                        moduleId,
                    ),
                    last_visited_at: new Date().toISOString(),
                }));
                await client
                    .from('user_module_progress')
                    .upsert(modRows, { onConflict: 'user_id,module_id' });
            }

            if (nextState.bookmarkedEntryIds.length > 0) {
                const bmRows = nextState.bookmarkedEntryIds.map((entryId) => ({
                    user_id: uid,
                    entry_id: entryId,
                    lang: entryId.split('-')[0] || 'en',
                }));
                await client
                    .from('user_bookmarks')
                    .upsert(bmRows, { onConflict: 'user_id,entry_id' });
            }
        })();
    }, [user, isGuest]);

    const syncModuleRowToCloud = useCallback(
        async (moduleId: string, nextState: VeloaProgressState) => {
            if (isGuest || !user || !supabase) return;
            await supabase.from('user_module_progress').upsert(
                {
                    user_id: user.id,
                    module_id: moduleId,
                    is_completed: nextState.completedModuleIds.includes(moduleId),
                    completed_card_indices: extractBlockIndicesForModule(
                        nextState.completedBlockKeys,
                        moduleId,
                    ),
                    last_visited_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,module_id' },
            );
        },
        [user, isGuest],
    );

    const markModuleVisited = useCallback((moduleId: string) => {
        setState((prev) => {
            if (prev.lastVisitedModuleId === moduleId) return prev;
            const next = { ...prev, lastVisitedModuleId: moduleId };
            writeProgressToStorage(next);
            return next;
        });
    }, []);

    const toggleModuleCompleted = useCallback(
        (moduleId: string) => {
            setState((prev) => {
                const exists = prev.completedModuleIds.includes(moduleId);
                const completedModuleIds = exists
                    ? prev.completedModuleIds.filter((id) => id !== moduleId)
                    : [...prev.completedModuleIds, moduleId];
                const next = { ...prev, completedModuleIds };
                writeProgressToStorage(next);
                void syncModuleRowToCloud(moduleId, next);
                return next;
            });
        },
        [syncModuleRowToCloud],
    );

    const toggleBlockCompleted = useCallback(
        (moduleId: string, blockIndex: number) => {
            const blockKey = `${moduleId}::${blockIndex}`;
            setState((prev) => {
                const exists = prev.completedBlockKeys.includes(blockKey);
                const completedBlockKeys = exists
                    ? prev.completedBlockKeys.filter((k) => k !== blockKey)
                    : [...prev.completedBlockKeys, blockKey];
                const next = { ...prev, completedBlockKeys };
                writeProgressToStorage(next);
                void syncModuleRowToCloud(moduleId, next);
                return next;
            });
        },
        [syncModuleRowToCloud],
    );

    const toggleEntryBookmark = useCallback(
        (entryId: string, lang?: LanguageCode) => {
            setState((prev) => {
                const exists = prev.bookmarkedEntryIds.includes(entryId);
                const bookmarkedEntryIds = exists
                    ? prev.bookmarkedEntryIds.filter((id) => id !== entryId)
                    : [...prev.bookmarkedEntryIds, entryId];
                const next = { ...prev, bookmarkedEntryIds };
                writeProgressToStorage(next);

                if (!isGuest && user && supabase) {
                    if (exists) {
                        void supabase
                            .from('user_bookmarks')
                            .delete()
                            .eq('user_id', user.id)
                            .eq('entry_id', entryId);
                    } else {
                        void supabase.from('user_bookmarks').upsert(
                            {
                                user_id: user.id,
                                entry_id: entryId,
                                lang: lang ?? (entryId.split('-')[0] || 'en'),
                            },
                            { onConflict: 'user_id,entry_id' },
                        );
                    }
                }

                return next;
            });
        },
        [user, isGuest],
    );

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
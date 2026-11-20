// src/features/practice-engine/hooks/useMasteryEngine.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';

export type RecallRating = 'again' | 'hard' | 'good' | 'easy';

export interface ItemSrsRecord {
    itemId: string;
    lang: LanguageCode;
    repetitions: number;
    intervalDays: number;
    easeFactor: number;
    nextReviewAt: number; // Unix timestamp ms
    lastReviewedAt: number;
}

export interface MasteryStatsState {
    xp: number;
    streakDays: number;
    lastActiveDate: string | null; // Format YYYY-MM-DD
    totalAnswered: number;
    totalCorrect: number;
    srsRecords: Record<string, ItemSrsRecord>;
}

const MASTERY_STORAGE_KEY = 'veloa.mastery.srs.v1';

const DEFAULT_MASTERY_STATE: MasteryStatsState = {
    xp: 0,
    streakDays: 0,
    lastActiveDate: null,
    totalAnswered: 0,
    totalCorrect: 0,
    srsRecords: {},
};

function getTodayIsoDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getYesterdayIsoDate(): string {
    const yesterday = new Date(Date.now() - 86_400_000);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function readMasteryState(): MasteryStatsState {
    if (typeof window === 'undefined') return DEFAULT_MASTERY_STATE;
    try {
        const raw = window.localStorage.getItem(MASTERY_STORAGE_KEY);
        if (!raw) return DEFAULT_MASTERY_STATE;
        const parsed = JSON.parse(raw) as Partial<MasteryStatsState>;
        return {
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
            lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : null,
            totalAnswered: typeof parsed.totalAnswered === 'number' ? parsed.totalAnswered : 0,
            totalCorrect: typeof parsed.totalCorrect === 'number' ? parsed.totalCorrect : 0,
            srsRecords:
                parsed.srsRecords && typeof parsed.srsRecords === 'object' ? parsed.srsRecords : {},
        };
    } catch {
        return DEFAULT_MASTERY_STATE;
    }
}

function writeMasteryState(state: MasteryStatsState): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Abaikan jika storage penuh
    }
}

function computeNextSrs(
    prev: ItemSrsRecord | undefined,
    itemId: string,
    lang: LanguageCode,
    rating: RecallRating,
): ItemSrsRecord {
    const now = Date.now();
    const baseEase = prev?.easeFactor ?? 2.5;
    const baseReps = prev?.repetitions ?? 0;
    const baseInterval = prev?.intervalDays ?? 0;

    let nextEase = baseEase;
    let nextReps = baseReps;
    let nextInterval = baseInterval;

    if (rating === 'again') {
        nextReps = 0;
        nextInterval = 0;
        nextEase = Math.max(1.3, baseEase - 0.2);
    } else if (rating === 'hard') {
        nextReps = baseReps + 1;
        nextInterval = baseReps === 0 ? 1 : Math.max(1, Math.round(baseInterval * 1.2));
        nextEase = Math.max(1.3, baseEase - 0.15);
    } else if (rating === 'good') {
        nextReps = baseReps + 1;
        if (baseReps === 0) nextInterval = 1;
        else if (baseReps === 1) nextInterval = 4;
        else nextInterval = Math.round(baseInterval * baseEase);
    } else {
        // easy
        nextReps = baseReps + 1;
        if (baseReps === 0) nextInterval = 3;
        else if (baseReps === 1) nextInterval = 7;
        else nextInterval = Math.round(baseInterval * baseEase * 1.3);
        nextEase = baseEase + 0.15;
    }

    return {
        itemId,
        lang,
        repetitions: nextReps,
        intervalDays: nextInterval,
        easeFactor: Number(nextEase.toFixed(2)),
        lastReviewedAt: now,
        nextReviewAt: now + nextInterval * 86_400_000,
    };
}

export function useMasteryEngine() {
    const { user, isGuest, refreshProfile } = useAuth();
    const [state, setState] = useState<MasteryStatsState>(() => readMasteryState());
    const syncedUidRef = useRef<string | null>(null);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === MASTERY_STORAGE_KEY) {
                setState(readMasteryState());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Sinkronisasi awal XP, Streak, dan kartu SRS saat login
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
            const [profileRes, srsRes] = await Promise.all([
                client
                    .from('user_profiles')
                    .select('xp, streak_days, last_active_date, total_answered, total_correct')
                    .eq('user_id', uid)
                    .single(),
                client.from('user_srs_cards').select('*').eq('user_id', uid),
            ]);

            if (profileRes.error || srsRes.error) return;

            const local = readMasteryState();
            const mergedSrs: Record<string, ItemSrsRecord> = { ...local.srsRecords };

            for (const row of srsRes.data ?? []) {
                const cloudRec: ItemSrsRecord = {
                    itemId: row.item_id,
                    lang: row.lang as LanguageCode,
                    repetitions: row.repetitions ?? 0,
                    intervalDays: row.interval_days ?? 0,
                    easeFactor: Number(row.ease_factor ?? 2.5),
                    nextReviewAt: new Date(row.next_review_at).getTime(),
                    lastReviewedAt: new Date(row.last_reviewed_at).getTime(),
                };
                const existingLocal = mergedSrs[cloudRec.itemId];
                if (!existingLocal || cloudRec.lastReviewedAt >= existingLocal.lastReviewedAt) {
                    mergedSrs[cloudRec.itemId] = cloudRec;
                }
            }

            const p = profileRes.data;
            const nextState: MasteryStatsState = {
                xp: Math.max(local.xp, p.xp ?? 0),
                streakDays: Math.max(local.streakDays, p.streak_days ?? 0),
                lastActiveDate: local.lastActiveDate || p.last_active_date || null,
                totalAnswered: Math.max(local.totalAnswered, p.total_answered ?? 0),
                totalCorrect: Math.max(local.totalCorrect, p.total_correct ?? 0),
                srsRecords: mergedSrs,
            };

            writeMasteryState(nextState);
            setState(nextState);

            // Simpan hasil merge ke Supabase
            await client
                .from('user_profiles')
                .update({
                    xp: nextState.xp,
                    level: Math.max(1, Math.floor(nextState.xp / 250) + 1),
                    streak_days: nextState.streakDays,
                    last_active_date: nextState.lastActiveDate,
                    total_answered: nextState.totalAnswered,
                    total_correct: nextState.totalCorrect,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', uid);

            const srsValues = Object.values(mergedSrs);
            if (srsValues.length > 0) {
                const srsRows = srsValues.map((rec) => ({
                    user_id: uid,
                    item_id: rec.itemId,
                    lang: rec.lang,
                    repetitions: rec.repetitions,
                    interval_days: rec.intervalDays,
                    ease_factor: rec.easeFactor,
                    next_review_at: new Date(rec.nextReviewAt).toISOString(),
                    last_reviewed_at: new Date(rec.lastReviewedAt).toISOString(),
                }));
                await client
                    .from('user_srs_cards')
                    .upsert(srsRows, { onConflict: 'user_id,item_id' });
            }

            await refreshProfile();
        })();
    }, [user, isGuest, refreshProfile]);

    const recordPracticeOutcome = useCallback(
        (params: {
            itemId: string;
            lang: LanguageCode;
            isCorrect: boolean;
            rating?: RecallRating;
            xpGain?: number;
        }) => {
            const { itemId, lang, isCorrect, rating, xpGain = isCorrect ? 15 : 5 } = params;
            const effectiveRating: RecallRating = rating ?? (isCorrect ? 'good' : 'again');

            setState((prev) => {
                const today = getTodayIsoDate();
                const yesterday = getYesterdayIsoDate();

                let nextStreak = prev.streakDays;
                if (prev.lastActiveDate !== today) {
                    nextStreak = prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1;
                }

                const updatedSrs = computeNextSrs(
                    prev.srsRecords[itemId],
                    itemId,
                    lang,
                    effectiveRating,
                );

                const nextState: MasteryStatsState = {
                    xp: prev.xp + xpGain,
                    streakDays: nextStreak,
                    lastActiveDate: today,
                    totalAnswered: prev.totalAnswered + 1,
                    totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
                    srsRecords: {
                        ...prev.srsRecords,
                        [itemId]: updatedSrs,
                    },
                };

                writeMasteryState(nextState);

                // Sinkronisasi langsung ke cloud jika sudah login
                if (!isGuest && user && supabase) {
                    const client = supabase;
                    const uid = user.id;
                    void (async () => {
                        await Promise.all([
                            client.from('user_srs_cards').upsert(
                                {
                                    user_id: uid,
                                    item_id: updatedSrs.itemId,
                                    lang: updatedSrs.lang,
                                    repetitions: updatedSrs.repetitions,
                                    interval_days: updatedSrs.intervalDays,
                                    ease_factor: updatedSrs.easeFactor,
                                    next_review_at: new Date(updatedSrs.nextReviewAt).toISOString(),
                                    last_reviewed_at: new Date(
                                        updatedSrs.lastReviewedAt,
                                    ).toISOString(),
                                },
                                { onConflict: 'user_id,item_id' },
                            ),
                            client
                                .from('user_profiles')
                                .update({
                                    xp: nextState.xp,
                                    level: Math.max(1, Math.floor(nextState.xp / 250) + 1),
                                    streak_days: nextState.streakDays,
                                    last_active_date: nextState.lastActiveDate,
                                    total_answered: nextState.totalAnswered,
                                    total_correct: nextState.totalCorrect,
                                    updated_at: new Date().toISOString(),
                                })
                                .eq('user_id', uid),
                        ]);
                        await refreshProfile();
                    })();
                }

                return nextState;
            });
        },
        [user, isGuest, refreshProfile],
    );

    const getDueCountForLanguage = useCallback(
        (lang: LanguageCode): number => {
            const now = Date.now();
            return Object.values(state.srsRecords).filter(
                (rec) => rec.lang === lang && rec.nextReviewAt <= now,
            ).length;
        },
        [state.srsRecords],
    );

    const accuracyPercent =
        state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 100;

    return {
        xp: state.xp,
        streakDays: state.streakDays,
        totalAnswered: state.totalAnswered,
        totalCorrect: state.totalCorrect,
        accuracyPercent,
        srsRecords: state.srsRecords,
        recordPracticeOutcome,
        getDueCountForLanguage,
    };
}
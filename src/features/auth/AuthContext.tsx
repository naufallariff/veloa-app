// src/features/auth/AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase, usernameToInternalEmail } from '@/lib/supabase';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';

export type UserRole = 'guest' | 'member' | 'curator' | 'superadmin';

export interface VeloaUserProfile {
    userId: string;
    username: string;
    displayName: string;
    role: UserRole;
    avatarTheme: string;
    activeLang: LanguageCode;
    xp: number;
    level: number;
    streakDays: number;
    lastActiveDate: string | null;
    totalAnswered: number;
    totalCorrect: number;
}

interface AuthContextValue {
    user: User | null;
    profile: VeloaUserProfile | null;
    role: UserRole;
    isLoading: boolean;
    isConfigured: boolean;
    isGuest: boolean;
    isSuperadmin: boolean;
    isStaff: boolean;
    loginWithUsername: (username: string, password: string) => Promise<{ error: string | null }>;
    registerWithUsername: (params: {
        username: string;
        displayName: string;
        password: string;
        migrateGuestProgress?: boolean;
    }) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    updateProfileSettings: (updates: {
        displayName?: string;
        avatarTheme?: string;
        activeLang?: LanguageCode;
    }) => Promise<{ error: string | null }>;
    changePassword: (
        currentPassword: string,
        newPassword: string,
    ) => Promise<{ error: string | null }>;
    refreshProfile: () => Promise<void>;
}

const USERNAME_ALPHANUMERIC_REGEX = /^[a-z0-9]{3,24}$/;
const GENERIC_LOGIN_ERROR = 'Username atau kata sandi tidak sesuai.';

export function sanitizeAlphanumericUsername(raw: string): string {
    return raw.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function buildFallbackProfile(authUser: User): VeloaUserProfile {
    const fallbackUsername = sanitizeAlphanumericUsername(
        (authUser.user_metadata?.username as string | undefined) ||
        authUser.email?.split('@')[0] ||
        `user${authUser.id.slice(0, 6)}`,
    );
    return {
        userId: authUser.id,
        username: fallbackUsername,
        displayName:
            (authUser.user_metadata?.display_name as string | undefined) || fallbackUsername,
        role: 'member',
        avatarTheme: 'indigo',
        activeLang: 'en',
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActiveDate: null,
        totalAnswered: 0,
        totalCorrect: 0,
    };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<VeloaUserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchOrHealUserProfile = useCallback(async (authUser: User) => {
        if (!supabase) return;

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .maybeSingle();

        if (!error && data) {
            setProfile({
                userId: data.user_id,
                username: data.username,
                displayName: data.display_name,
                role: (data.role as UserRole) || 'member',
                avatarTheme: data.avatar_theme || 'indigo',
                activeLang: (data.active_lang as LanguageCode) || 'en',
                xp: data.xp ?? 0,
                level: data.level ?? 1,
                streakDays: data.streak_days ?? 0,
                lastActiveDate: data.last_active_date ?? null,
                totalAnswered: data.total_answered ?? 0,
                totalCorrect: data.total_correct ?? 0,
            });
            return;
        }

        const fallback = buildFallbackProfile(authUser);

        const { data: healed, error: healError } = await supabase
            .from('user_profiles')
            .upsert(
                {
                    user_id: authUser.id,
                    username: fallback.username,
                    display_name: fallback.displayName,
                    role: 'member',
                },
                { onConflict: 'user_id' },
            )
            .select('*')
            .maybeSingle();

        if (!healError && healed) {
            setProfile({
                userId: healed.user_id,
                username: healed.username,
                displayName: healed.display_name,
                role: (healed.role as UserRole) || 'member',
                avatarTheme: healed.avatar_theme || 'indigo',
                activeLang: (healed.active_lang as LanguageCode) || 'en',
                xp: healed.xp ?? 0,
                level: healed.level ?? 1,
                streakDays: healed.streak_days ?? 0,
                lastActiveDate: healed.last_active_date ?? null,
                totalAnswered: healed.total_answered ?? 0,
                totalCorrect: healed.total_correct ?? 0,
            });
        } else {
            setProfile(fallback);
        }
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setIsLoading(false);
            return;
        }

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchOrHealUserProfile(currentUser);
            }
            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUser = session?.user ?? null;
            setUser(nextUser);
            if (nextUser) {
                void fetchOrHealUserProfile(nextUser);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchOrHealUserProfile]);

    const loginWithUsername = useCallback(
        async (username: string, password: string): Promise<{ error: string | null }> => {
            if (!supabase) return { error: 'Konfigurasi Supabase belum terpasang di .env' };

            const cleanUsername = username.trim().toLowerCase();
            if (!USERNAME_ALPHANUMERIC_REGEX.test(cleanUsername) || password.length < 6) {
                return { error: GENERIC_LOGIN_ERROR };
            }

            const email = usernameToInternalEmail(cleanUsername);
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error || !data.user) {
                return { error: GENERIC_LOGIN_ERROR };
            }

            setUser(data.user);
            await fetchOrHealUserProfile(data.user);
            return { error: null };
        },
        [fetchOrHealUserProfile],
    );

    const registerWithUsername = useCallback(
        async (params: {
            username: string;
            displayName: string;
            password: string;
            migrateGuestProgress?: boolean;
        }): Promise<{ error: string | null }> => {
            if (!supabase) return { error: 'Konfigurasi Supabase belum terpasang di .env' };

            const cleanUsername = params.username.trim().toLowerCase();
            if (!USERNAME_ALPHANUMERIC_REGEX.test(cleanUsername)) {
                return {
                    error: 'Username harus 3–24 karakter dan hanya boleh berisi huruf kecil serta angka.',
                };
            }
            if (params.password.length < 6) {
                return { error: 'Kata sandi minimal 6 karakter.' };
            }

            const cleanDisplayName = params.displayName.trim() || cleanUsername;
            const shouldMigrate = params.migrateGuestProgress ?? true;

            const { data: existing } = await supabase
                .from('user_profiles')
                .select('username')
                .eq('username', cleanUsername)
                .maybeSingle();

            if (existing) {
                return { error: 'Username sudah digunakan. Silakan pilih kombinasi huruf/angka lain.' };
            }

            const email = usernameToInternalEmail(cleanUsername);
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password: params.password,
                options: {
                    data: {
                        username: cleanUsername,
                        display_name: cleanDisplayName,
                    },
                },
            });

            if (signUpError || !signUpData.user) {
                const rawMsg = signUpError?.message ?? '';
                if (rawMsg.toLowerCase().includes('already registered')) {
                    return { error: 'Username sudah terdaftar. Silakan pindah ke tab Masuk.' };
                }
                return { error: rawMsg || 'Gagal membuat akun baru.' };
            }

            let activeUser = signUpData.user;
            if (!signUpData.session) {
                const { data: signInData } = await supabase.auth.signInWithPassword({
                    email,
                    password: params.password,
                });
                if (signInData.user) {
                    activeUser = signInData.user;
                }
            }

            let localXp = 0;
            let localStreak = 0;
            let localAnswered = 0;
            let localCorrect = 0;

            if (shouldMigrate) {
                try {
                    const rawMastery = window.localStorage.getItem('veloa.mastery.srs.v1');
                    if (rawMastery) {
                        const parsed = JSON.parse(rawMastery) as {
                            xp?: number;
                            streakDays?: number;
                            totalAnswered?: number;
                            totalCorrect?: number;
                        };
                        localXp = parsed.xp ?? 0;
                        localStreak = parsed.streakDays ?? 0;
                        localAnswered = parsed.totalAnswered ?? 0;
                        localCorrect = parsed.totalCorrect ?? 0;
                    }
                } catch {
                    // Abaikan jika localStorage kosong
                }
            } else {
                try {
                    window.localStorage.removeItem('veloa.mastery.srs.v1');
                    window.localStorage.removeItem('veloa.lesson.progress.v1');
                } catch {
                    // Abaikan
                }
            }

            await supabase.from('user_profiles').upsert(
                {
                    user_id: activeUser.id,
                    username: cleanUsername,
                    display_name: cleanDisplayName,
                    role: 'member',
                    xp: localXp,
                    level: Math.max(1, Math.floor(localXp / 250) + 1),
                    streak_days: localStreak,
                    total_answered: localAnswered,
                    total_correct: localCorrect,
                },
                { onConflict: 'user_id' },
            );

            setUser(activeUser);
            await fetchOrHealUserProfile(activeUser);
            return { error: null };
        },
        [fetchOrHealUserProfile],
    );

    const logout = useCallback(async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }, []);

    const updateProfileSettings = useCallback(
        async (updates: {
            displayName?: string;
            avatarTheme?: string;
            activeLang?: LanguageCode;
        }): Promise<{ error: string | null }> => {
            if (!supabase || !user) return { error: 'Anda belum masuk ke akun.' };

            const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
            if (updates.displayName !== undefined) payload.display_name = updates.displayName.trim();
            if (updates.avatarTheme !== undefined) payload.avatar_theme = updates.avatarTheme;
            if (updates.activeLang !== undefined) payload.active_lang = updates.activeLang;

            const { error } = await supabase
                .from('user_profiles')
                .update(payload)
                .eq('user_id', user.id);

            if (error) return { error: error.message };
            await fetchOrHealUserProfile(user);
            return { error: null };
        },
        [user, fetchOrHealUserProfile],
    );

    const changePassword = useCallback(
        async (currentPassword: string, newPassword: string): Promise<{ error: string | null }> => {
            if (!supabase || !user || !user.email) {
                return { error: 'Anda belum masuk ke akun.' };
            }
            if (!currentPassword) {
                return { error: 'Masukkan kata sandi lama Anda untuk konfirmasi.' };
            }
            if (newPassword.length < 6) {
                return { error: 'Kata sandi baru minimal 6 karakter.' };
            }
            if (currentPassword === newPassword) {
                return { error: 'Kata sandi baru harus berbeda dari kata sandi lama.' };
            }

            // Verifikasi kata sandi lama terlebih dahulu
            const { error: verifyError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });
            if (verifyError) {
                return { error: 'Kata sandi lama tidak sesuai.' };
            }

            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) return { error: error.message };
            return { error: null };
        },
        [user],
    );

    const activeProfile = user ? profile ?? buildFallbackProfile(user) : null;
    const role: UserRole = activeProfile ? activeProfile.role : 'guest';

    return (
        <AuthContext.Provider
            value={{
                user,
                profile: activeProfile,
                role,
                isLoading,
                isConfigured: isSupabaseConfigured,
                isGuest: !user,
                isSuperadmin: role === 'superadmin',
                isStaff: role === 'superadmin' || role === 'curator',
                loginWithUsername,
                registerWithUsername,
                logout,
                updateProfileSettings,
                changePassword,
                refreshProfile: async () => {
                    if (user) await fetchOrHealUserProfile(user);
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
    return ctx;
}
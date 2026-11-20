// src/features/auth/AuthModal.tsx
import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    RotateCcw,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import { sanitizeAlphanumericUsername, useAuth } from './AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    initialMode?: 'LOGIN' | 'REGISTER';
    onClose: () => void;
}

const USERNAME_PATTERN = /^[a-z0-9]{3,24}$/;

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    initialMode = 'LOGIN',
    onClose,
}) => {
    const { loginWithUsername, registerWithUsername, isConfigured } = useAuth();

    const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
    const [username, setUsername] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [migrateGuestProgress, setMigrateGuestProgress] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const guestSummary = useMemo(() => {
        if (typeof window === 'undefined') return { xp: 0, streakDays: 0 };
        try {
            const raw = window.localStorage.getItem('veloa.mastery.srs.v1');
            if (!raw) return { xp: 0, streakDays: 0 };
            const parsed = JSON.parse(raw) as { xp?: number; streakDays?: number };
            return { xp: parsed.xp ?? 0, streakDays: parsed.streakDays ?? 0 };
        } catch {
            return { xp: 0, streakDays: 0 };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleUsernameInput = (rawValue: string) => {
        setUsername(sanitizeAlphanumericUsername(rawValue));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (mode === 'LOGIN') {
            if (!username.trim() || !password) {
                setErrorMessage('Masukkan username dan kata sandi Anda.');
                return;
            }
        } else {
            if (!USERNAME_PATTERN.test(username)) {
                setErrorMessage('Username harus 3–24 karakter dan hanya boleh huruf serta angka.');
                return;
            }
            if (password.length < 6) {
                setErrorMessage('Kata sandi minimal 6 karakter.');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const result =
                mode === 'LOGIN'
                    ? await loginWithUsername(username, password)
                    : await registerWithUsername({
                        username,
                        displayName: displayName.trim() || username,
                        password,
                        migrateGuestProgress,
                    });

            if (result.error) {
                setErrorMessage(result.error);
            } else {
                setPassword('');
                onClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="veloa-auth-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
            <div className="veloa-surface-card relative max-h-[92dvh] w-full max-w-md overflow-y-auto p-6 sm:p-7">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup dialog akun"
                    className="absolute top-4 right-4 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-2 text-(--text-secondary) hover:border-(--border-strong)"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-extrabold uppercase tracking-wider text-(--accent-primary)">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Veloa Cloud Sync</span>
                    </span>
                    <h2 id="veloa-auth-title" className="text-xl font-extrabold text-(--text-primary)">
                        {mode === 'LOGIN' ? 'Masuk ke Akun Veloa' : 'Buat Akun Belajar Baru'}
                    </h2>
                    <p className="text-xs leading-relaxed text-(--text-secondary)">
                        {mode === 'LOGIN'
                            ? 'Lanjutkan progres belajar, XP, dan kartu hafalan dari perangkat mana saja.'
                            : 'Gratis selamanya. Sinkronkan progres lintas perangkat dan buka semua fitur akun.'}
                    </p>
                </div>

                {/* Switch Tab Masuk / Daftar */}
                <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('LOGIN');
                            setErrorMessage(null);
                        }}
                        className={`rounded-lg py-2 text-xs font-extrabold transition-colors ${mode === 'LOGIN'
                                ? 'bg-(--accent-primary) text-white'
                                : 'text-(--text-secondary) hover:text-(--text-primary)'
                            }`}
                    >
                        Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('REGISTER');
                            setErrorMessage(null);
                        }}
                        className={`rounded-lg py-2 text-xs font-extrabold transition-colors ${mode === 'REGISTER'
                                ? 'bg-(--accent-primary) text-white'
                                : 'text-(--text-secondary) hover:text-(--text-primary)'
                            }`}
                    >
                        Daftar Baru
                    </button>
                </div>

                {!isConfigured && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <span>
                            Konfigurasi Supabase belum terpasang di file <code>.env</code>.
                        </span>
                    </div>
                )}

                {errorMessage && (
                    <div
                        role="alert"
                        className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300"
                    >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
                    <div>
                        <label
                            htmlFor="veloa-auth-username"
                            className="mb-1 block text-xs font-extrabold text-(--text-primary)"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
                            <input
                                id="veloa-auth-username"
                                type="text"
                                required
                                maxLength={24}
                                autoComplete="username"
                                placeholder="contoh: naufal29"
                                value={username}
                                onChange={(e) => handleUsernameInput(e.target.value)}
                                className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) py-2.5 pr-3.5 pl-10 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                            />
                        </div>
                        {mode === 'REGISTER' && (
                            <p className="mt-1 text-[11px] text-(--text-muted)">
                                3–24 karakter, <strong>hanya huruf dan angka</strong> (contoh:{' '}
                                <code>naufal</code> atau <code>naufal2026</code>).
                            </p>
                        )}
                    </div>

                    {mode === 'REGISTER' && (
                        <div>
                            <label
                                htmlFor="veloa-auth-displayname"
                                className="mb-1 block text-xs font-extrabold text-(--text-primary)"
                            >
                                Nama Tampilan
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
                                <input
                                    id="veloa-auth-displayname"
                                    type="text"
                                    maxLength={40}
                                    placeholder="Nama panggilan Anda"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) py-2.5 pr-3.5 pl-10 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="veloa-auth-password"
                            className="mb-1 block text-xs font-extrabold text-(--text-primary)"
                        >
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
                            <input
                                id="veloa-auth-password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoComplete={mode === 'LOGIN' ? 'current-password' : 'new-password'}
                                placeholder={
                                    mode === 'LOGIN' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'
                                }
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) py-2.5 pr-10 pl-10 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Kebebasan Pilihan Migrasi Progres Mode Tamu */}
                    {mode === 'REGISTER' && (
                        <div className="space-y-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/70 p-3">
                            <p className="text-[11px] font-extrabold text-(--text-primary)">
                                Pengaturan Progres Mode Tamu
                                {guestSummary.xp > 0
                                    ? ` (${guestSummary.xp.toLocaleString('id-ID')} XP ditemukan)`
                                    : ''}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMigrateGuestProgress(true)}
                                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-colors ${migrateGuestProgress
                                            ? 'border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                        }`}
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                    <span>Simpan Progres</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMigrateGuestProgress(false)}
                                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-colors ${!migrateGuestProgress
                                            ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                        }`}
                                >
                                    <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                                    <span>Mulai dari 0</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !isConfigured}
                        className="veloa-tactile-btn flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent-primary) py-3 text-xs font-extrabold text-white shadow-xs hover:bg-(--accent-primary-hover) disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>
                            {mode === 'LOGIN'
                                ? 'Masuk Sekarang'
                                : migrateGuestProgress
                                    ? 'Daftar & Simpan Progres'
                                    : 'Daftar & Mulai Baru'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};
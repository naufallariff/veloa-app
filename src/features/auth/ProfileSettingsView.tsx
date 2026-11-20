// src/features/auth/ProfileSettingsView.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    AlertTriangle,
    Award,
    Check,
    CheckCircle2,
    ChevronDown,
    CloudCheck,
    Eye,
    EyeOff,
    Flame,
    KeyRound,
    Loader2,
    LogOut,
    Save,
    ShieldCheck,
    Sparkles,
    UserCheck,
    X,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';

interface ProfileSettingsViewProps {
    onSelectLang?: (lang: LanguageCode) => void;
    onLoggedOut: () => void;
}

const AVATAR_THEMES = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-500/40' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-500/40' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600', ring: 'ring-amber-500/40' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-600', ring: 'ring-rose-500/40' },
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600', ring: 'ring-cyan-500/40' },
    { id: 'violet', label: 'Violet', bg: 'bg-violet-600', ring: 'ring-violet-500/40' },
];

const LANGUAGE_OPTIONS: Array<{
    code: LanguageCode;
    shortCode: string;
    label: string;
    native: string;
    framework: string;
}> = [
        { code: 'en', shortCode: 'EN', label: 'Inggris', native: 'English', framework: 'CEFR A1–C2' },
        { code: 'zh', shortCode: 'ZH', label: 'Mandarin', native: '普通话', framework: 'HSK 1–6' },
        { code: 'ja', shortCode: 'JA', label: 'Jepang', native: '日本語', framework: 'JLPT N5–N1' },
        { code: 'ar', shortCode: 'AR', label: 'Arab', native: 'العربية', framework: 'Naḥwu & CEFR' },
        { code: 'ko', shortCode: 'KO', label: 'Korea', native: '한국어', framework: 'TOPIK I–II' },
    ];

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
    onSelectLang,
    onLoggedOut,
}) => {
    const { profile, updateProfileSettings, changePassword, logout } = useAuth();

    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
    const [avatarTheme, setAvatarTheme] = useState(profile?.avatarTheme ?? 'indigo');
    const [activeLang, setActiveLang] = useState<LanguageCode>(profile?.activeLang ?? 'en');
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profileStatus, setProfileStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [passwordStatus, setPasswordStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const langDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName);
            setAvatarTheme(profile.avatarTheme);
            setActiveLang(profile.activeLang);
        }
    }, [profile]);

    useEffect(() => {
        if (!isLangDropdownOpen) return;
        const handleOutside = (e: MouseEvent) => {
            if (
                langDropdownRef.current &&
                !langDropdownRef.current.contains(e.target as Node)
            ) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isLangDropdownOpen]);

    if (!profile) return null;

    const activeThemeObj =
        AVATAR_THEMES.find((t) => t.id === avatarTheme) ?? AVATAR_THEMES[0]!;
    const selectedLangObj =
        LANGUAGE_OPTIONS.find((l) => l.code === activeLang) ?? LANGUAGE_OPTIONS[0]!;

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setProfileStatus(null);
        const res = await updateProfileSettings({
            displayName: displayName.trim() || profile.username,
            avatarTheme,
            activeLang,
        });
        setIsSaving(false);
        if (res.error) {
            setProfileStatus({ type: 'error', message: `Gagal menyimpan: ${res.error}` });
        } else {
            setProfileStatus({ type: 'success', message: 'Profil dan avatar berhasil diperbarui.' });
            onSelectLang?.(activeLang);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordStatus(null);
        setIsUpdatingPassword(true);
        const res = await changePassword(currentPassword, newPassword);
        setIsUpdatingPassword(false);

        if (res.error) {
            setPasswordStatus({ type: 'error', message: res.error });
        } else {
            setCurrentPassword('');
            setNewPassword('');
            setPasswordStatus({
                type: 'success',
                message: 'Kata sandi berhasil diperbarui.',
            });
        }
    };

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        setIsLoggingOut(false);
        setIsLogoutConfirmOpen(false);
        onLoggedOut();
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <section className="flex flex-wrap items-end justify-between gap-4 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Profil & Preferensi Akun</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl">
                        Pengaturan Identitas Belajar
                    </h1>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CloudCheck className="h-4 w-4" />
                    <span>Sinkronisasi Cloud Aktif</span>
                </div>
            </section>

            {/* BENTO GRID 12-KOLOM (4 Kolom Kartu Identitas + 8 Kolom Form Pengaturan) */}
            <div className="grid items-start gap-6 lg:grid-cols-12">
                {/* KOLOM KIRI (4 Kolom): Kartu Identitas & Statistik Akun */}
                <aside className="veloa-surface-card flex flex-col justify-between gap-6 p-6 lg:sticky lg:top-24 lg:col-span-4">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow-md ring-4 transition-all ${activeThemeObj.bg} ${activeThemeObj.ring}`}
                            >
                                {(displayName.trim() || profile.displayName).charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="truncate text-lg font-extrabold text-(--text-primary)">
                                        {displayName.trim() || profile.displayName}
                                    </h2>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-(--accent-primary-soft) px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-(--accent-primary)">
                                        <ShieldCheck className="h-3 w-3" />
                                        {profile.role}
                                    </span>
                                </div>
                                <p className="mt-0.5 font-mono text-xs text-(--text-muted)">
                                    @{profile.username}
                                </p>
                            </div>
                        </div>

                        {/* Bento Mini-Metrics (3 Kolom) */}
                        <div className="grid grid-cols-3 gap-2.5">
                            <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/65 p-3 text-center">
                                <Flame className="mx-auto h-4 w-4 text-amber-500" />
                                <p className="mt-1 font-mono text-sm font-extrabold text-(--text-primary)">
                                    {profile.streakDays}h
                                </p>
                                <p className="text-[10px] font-semibold text-(--text-muted)">Streak</p>
                            </div>

                            <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/65 p-3 text-center">
                                <Sparkles className="mx-auto h-4 w-4 text-(--accent-primary)" />
                                <p className="mt-1 font-mono text-sm font-extrabold text-(--text-primary)">
                                    {profile.xp.toLocaleString('id-ID')}
                                </p>
                                <p className="text-[10px] font-semibold text-(--text-muted)">Total XP</p>
                            </div>

                            <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/65 p-3 text-center">
                                <Award className="mx-auto h-4 w-4 text-emerald-500" />
                                <p className="mt-1 font-mono text-sm font-extrabold text-(--text-primary)">
                                    Lv.{profile.level}
                                </p>
                                <p className="text-[10px] font-semibold text-(--text-muted)">Level</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/45 p-3.5 text-xs leading-relaxed text-(--text-secondary)">
                            Bahasa fokus utama saat ini adalah{' '}
                            <strong className="text-(--text-primary)">
                                {selectedLangObj.label} ({selectedLangObj.native})
                            </strong>{' '}
                            pada standar <span className="font-mono">{selectedLangObj.framework}</span>.
                        </div>
                    </div>

                    <div className="border-t border-(--border-subtle) pt-4">
                        <button
                            type="button"
                            onClick={() => setIsLogoutConfirmOpen(true)}
                            className="veloa-tactile-btn flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-500/20"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar Akun</span>
                        </button>
                    </div>
                </aside>

                {/* KOLOM KANAN (8 Kolom): Pengaturan Profil & Keamanan Sandi */}
                <div className="space-y-6 lg:col-span-8">
                    {/* Kartu 1: Form Edit Profil */}
                    <form
                        onSubmit={(e) => void handleSaveProfile(e)}
                        className="veloa-surface-card space-y-5 p-6 sm:p-7"
                    >
                        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3.5">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-(--accent-primary)" />
                                <h2 className="text-base font-extrabold text-(--text-primary)">
                                    Pengaturan Profil & Preferensi Belajar
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="profile-display-name"
                                    className="mb-1.5 block text-xs font-bold text-(--text-primary)"
                                >
                                    Nama Tampilan
                                </label>
                                <input
                                    id="profile-display-name"
                                    type="text"
                                    required
                                    maxLength={40}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                                />
                            </div>

                            {/* Custom Styled Dropdown Bahasa Fokus Utama */}
                            <div ref={langDropdownRef} className="relative">
                                <label className="mb-1.5 block text-xs font-bold text-(--text-primary)">
                                    Bahasa Fokus Utama
                                </label>
                                <button
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={isLangDropdownOpen}
                                    onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                                    className="flex h-11 w-full items-center justify-between rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold text-(--text-primary) transition-colors hover:border-(--accent-primary) focus:border-(--accent-primary) focus:outline-none"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-(--accent-primary)">
                                            {selectedLangObj.shortCode}
                                        </span>
                                        <span>{selectedLangObj.label}</span>
                                        <span className="text-(--text-muted)">
                                            ({selectedLangObj.native})
                                        </span>
                                    </span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-(--text-muted) transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {isLangDropdownOpen && (
                                    <div
                                        role="listbox"
                                        className="veloa-surface-card absolute inset-x-0 z-30 mt-1.5 overflow-hidden border border-(--border-strong) p-1.5 shadow-xl"
                                    >
                                        {LANGUAGE_OPTIONS.map((opt) => {
                                            const isSelected = opt.code === activeLang;
                                            return (
                                                <button
                                                    key={opt.code}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => {
                                                        setActiveLang(opt.code);
                                                        setIsLangDropdownOpen(false);
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-xs transition-colors ${isSelected
                                                            ? 'bg-(--accent-primary-soft) font-extrabold text-(--accent-primary)'
                                                            : 'font-semibold text-(--text-primary) hover:bg-(--surface-elevated)'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className="font-mono text-[11px] font-bold">
                                                            {opt.shortCode}
                                                        </span>
                                                        <span>{opt.label}</span>
                                                        <span className="text-(--text-muted)">
                                                            · {opt.native}
                                                        </span>
                                                    </span>
                                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold text-(--text-primary)">
                                Warna Tema Avatar
                            </label>
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
                                {AVATAR_THEMES.map((theme) => {
                                    const selected = theme.id === avatarTheme;
                                    return (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setAvatarTheme(theme.id)}
                                            className={`veloa-tactile-btn inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${selected
                                                    ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary) shadow-2xs'
                                                    : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                                }`}
                                        >
                                            <span className={`h-3.5 w-3.5 rounded-full ${theme.bg}`} />
                                            <span>{theme.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border-subtle) pt-4">
                            <div>
                                {profileStatus && (
                                    <p
                                        className={`flex items-center gap-1.5 text-xs font-semibold ${profileStatus.type === 'success'
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                            }`}
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <span>{profileStatus.message}</span>
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="veloa-tactile-btn ms-auto inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 py-2.5 text-xs font-extrabold text-white disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>
                    </form>

                    {/* Kartu 2: Form Ganti Password */}
                    <form
                        onSubmit={(e) => void handleUpdatePassword(e)}
                        className="veloa-surface-card space-y-4 p-6 sm:p-7"
                    >
                        <div className="flex items-center gap-2 border-b border-(--border-subtle) pb-3.5">
                            <KeyRound className="h-4 w-4 text-(--accent-primary)" />
                            <h2 className="text-base font-extrabold text-(--text-primary)">
                                Keamanan Kata Sandi
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="profile-current-password"
                                    className="mb-1.5 block text-xs font-bold text-(--text-primary)"
                                >
                                    Kata Sandi Lama
                                </label>
                                <div className="relative">
                                    <input
                                        id="profile-current-password"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi saat ini"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) pr-10 pl-3.5 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                                        aria-label={
                                            showCurrentPassword
                                                ? 'Sembunyikan sandi lama'
                                                : 'Tampilkan sandi lama'
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-new-password"
                                    className="mb-1.5 block text-xs font-bold text-(--text-primary)"
                                >
                                    Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <input
                                        id="profile-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        placeholder="Minimal 6 karakter"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) pr-10 pl-3.5 text-xs font-semibold text-(--text-primary) outline-none focus:border-(--accent-primary)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        aria-label={
                                            showNewPassword
                                                ? 'Sembunyikan sandi baru'
                                                : 'Tampilkan sandi baru'
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border-subtle) pt-4">
                            <div>
                                {passwordStatus && (
                                    <p
                                        className={`text-xs font-semibold ${passwordStatus.type === 'success'
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                            }`}
                                    >
                                        {passwordStatus.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="veloa-tactile-btn ms-auto inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-4 py-2.5 text-xs font-extrabold text-(--text-primary) hover:border-(--accent-primary) disabled:opacity-60"
                            >
                                {isUpdatingPassword && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                )}
                                <span>Perbarui Kata Sandi</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal Konfirmasi Keluar Akun */}
            {isLogoutConfirmOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-confirm-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                >
                    <div className="veloa-surface-card relative w-full max-w-sm p-6">
                        <button
                            type="button"
                            onClick={() => setIsLogoutConfirmOpen(false)}
                            aria-label="Tutup konfirmasi"
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-(--text-muted) hover:text-(--text-primary)"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>

                        <h3
                            id="logout-confirm-title"
                            className="mt-4 text-base font-extrabold text-(--text-primary)"
                        >
                            Keluar dari Akun Veloa?
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">
                            Progres belajar akun <strong>@{profile.username}</strong> sudah tersimpan
                            di cloud. Jika keluar sekarang, perangkat ini akan kembali ke Mode Tamu
                            sampai Anda masuk kembali.
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => setIsLogoutConfirmOpen(false)}
                                className="veloa-tactile-btn rounded-xl border border-(--border-subtle) bg-(--surface-elevated) py-2.5 text-xs font-bold text-(--text-primary)"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => void handleConfirmLogout()}
                                className="veloa-tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-extrabold text-white hover:bg-rose-700 disabled:opacity-60"
                            >
                                {isLoggingOut && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                <span>Ya, Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
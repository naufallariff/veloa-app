// src/features/admin/SuperadminConsoleView.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    Flame,
    Loader2,
    Lock,
    PenTool,
    RefreshCw,
    RotateCcw,
    Search,
    Shield,
    ShieldAlert,
    Sparkles,
    User,
    Users,
    X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth, type UserRole } from '@/features/auth/AuthContext';

interface ManagedUserRow {
    user_id: string;
    username: string;
    display_name: string;
    role: UserRole;
    avatar_theme?: string;
    active_lang: string;
    xp: number;
    level: number;
    streak_days: number;
    total_answered: number;
    total_correct: number;
    created_at: string;
}

const AVATAR_BG_MAP: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    cyan: 'bg-cyan-600',
    violet: 'bg-violet-600',
};

const ROLE_META: Record<
    Exclude<UserRole, 'guest'>,
    {
        label: string;
        badgeClass: string;
        description: string;
        impactSummary: string;
        icon: React.ComponentType<{ className?: string }>;
    }
> = {
    member: {
        label: 'Member',
        badgeClass:
            'border-slate-500/25 bg-slate-500/10 text-slate-700 dark:text-slate-300',
        description: 'Akses belajar standar, cloud sync & latihan SRS',
        impactSummary:
            'Akun hanya memiliki akses belajar reguler dan tidak dapat membuka Content Studio maupun Admin Console.',
        icon: User,
    },
    curator: {
        label: 'Curator',
        badgeClass:
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        description: 'Dapat merancang & menyunting modul di Content Studio',
        impactSummary:
            'Akun akan mendapatkan akses ke Content Studio untuk merancang draf modul, narasi Veloa, serta blok kosakata dan dialog.',
        icon: PenTool,
    },
    superadmin: {
        label: 'Superadmin',
        badgeClass:
            'border-(--accent-primary)/30 bg-(--accent-primary-soft) text-(--accent-primary)',
        description: 'Otoritas penuh kurikulum, publikasi & manajemen role',
        impactSummary:
            'Akun akan memegang kendali penuh atas publikasi kurikulum ke seluruh pembelajar serta otoritas mengubah role pengguna lain.',
        icon: Shield,
    },
};

/* ============================================================================
   CUSTOM ROLE DROPDOWN (PENGGANTI <select> NATIVE BROWSER)
   ============================================================================ */
const RoleSelectorDropdown: React.FC<{
    value: UserRole;
    disabled?: boolean;
    isUpdating?: boolean;
    onSelectRole: (nextRole: Exclude<UserRole, 'guest'>) => void;
}> = ({ value, disabled, isUpdating, onSelectRole }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const safeRole: Exclude<UserRole, 'guest'> =
        value === 'guest' ? 'member' : value;
    const currentMeta = ROLE_META[safeRole];
    const CurrentIcon = currentMeta.icon;

    useEffect(() => {
        if (!open) return;
        const handleOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        window.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            window.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    if (disabled) {
        return (
            <span
                title="Role akun Anda sendiri tidak dapat diubah dari panel ini"
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-extrabold uppercase opacity-80 ${currentMeta.badgeClass}`}
            >
                <Lock className="h-3 w-3" />
                <span>{currentMeta.label}</span>
            </span>
        );
    }

    return (
        <div ref={dropdownRef} className="relative inline-block text-start">
            <button
                type="button"
                disabled={isUpdating}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex min-w-34 items-center justify-between gap-2 rounded-xl border px-3 py-1.5 font-mono text-[11px] font-extrabold uppercase transition-all hover:brightness-95 disabled:opacity-60 ${currentMeta.badgeClass}`}
            >
                <span className="inline-flex items-center gap-1.5">
                    {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <CurrentIcon className="h-3.5 w-3.5" />
                    )}
                    <span>{currentMeta.label}</span>
                </span>
                <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    className="veloa-surface-card absolute right-0 z-40 mt-1.5 w-64 overflow-hidden border border-(--border-strong) p-1.5 shadow-xl"
                >
                    <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-(--text-muted)">
                        Ubah Otoritas Pengguna
                    </div>
                    {(['member', 'curator', 'superadmin'] as const).map((roleOption) => {
                        const meta = ROLE_META[roleOption];
                        const OptionIcon = meta.icon;
                        const isSelected = safeRole === roleOption;

                        return (
                            <button
                                key={roleOption}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setOpen(false);
                                    if (!isSelected) {
                                        onSelectRole(roleOption);
                                    }
                                }}
                                className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-start transition-colors ${isSelected
                                        ? 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                        : 'text-(--text-primary) hover:bg-(--surface-elevated)'
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <OptionIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    <div>
                                        <p className="font-mono text-xs font-extrabold uppercase">
                                            {meta.label}
                                        </p>
                                        <p className="mt-0.5 font-sans text-[10px] leading-snug font-medium text-(--text-muted)">
                                            {meta.description}
                                        </p>
                                    </div>
                                </div>
                                {isSelected && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export const SuperadminConsoleView: React.FC<{ onOpenStudio: () => void }> = ({
    onOpenStudio,
}) => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<ManagedUserRow[]>([]);
    const [customModuleCount, setCustomModuleCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | Exclude<UserRole, 'guest'>>('ALL');
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
    const [feedbackBanner, setFeedbackBanner] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [pendingRoleChange, setPendingRoleChange] = useState<{
        targetUser: ManagedUserRow;
        fromRole: Exclude<UserRole, 'guest'>;
        nextRole: Exclude<UserRole, 'guest'>;
    } | null>(null);

    const loadAdminData = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        const [usersRes, modulesRes] = await Promise.all([
            supabase.from('user_profiles').select('*').order('xp', { ascending: false }),
            supabase.from('custom_curriculum_modules').select('id', { count: 'exact', head: true }),
        ]);

        if (!usersRes.error && usersRes.data) {
            setUsers(usersRes.data as ManagedUserRow[]);
        }
        if (!modulesRes.error && typeof modulesRes.count === 'number') {
            setCustomModuleCount(modulesRes.count);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        void loadAdminData();
    }, [loadAdminData]);

    useEffect(() => {
        if (!pendingRoleChange) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPendingRoleChange(null);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [pendingRoleChange]);

    const executeRoleUpdate = async (
        targetUser: ManagedUserRow,
        nextRole: Exclude<UserRole, 'guest'>,
    ) => {
        if (!supabase) return;
        setUpdatingUserId(targetUser.user_id);
        setFeedbackBanner(null);

        const { error } = await supabase
            .from('user_profiles')
            .update({ role: nextRole, updated_at: new Date().toISOString() })
            .eq('user_id', targetUser.user_id);

        setUpdatingUserId(null);

        if (error) {
            setFeedbackBanner({
                type: 'error',
                message: `Gagal memperbarui role @${targetUser.username}: ${error.message}`,
            });
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.user_id === targetUser.user_id ? { ...u, role: nextRole } : u,
                ),
            );
            setFeedbackBanner({
                type: 'success',
                message: `Otoritas @${targetUser.username} berhasil diperbarui menjadi ${nextRole.toUpperCase()}.`,
            });
        }
    };

    // Selalu tampilkan modal konfirmasi untuk setiap perubahan role
    const handleRoleSelectRequest = (
        targetUser: ManagedUserRow,
        nextRole: Exclude<UserRole, 'guest'>,
    ) => {
        const currentRole: Exclude<UserRole, 'guest'> =
            targetUser.role === 'guest' ? 'member' : targetUser.role;
        if (currentRole === nextRole) return;

        setPendingRoleChange({
            targetUser,
            fromRole: currentRole,
            nextRole,
        });
    };

    const filteredUsers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return users.filter((u) => {
            const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
            const matchText =
                !q ||
                u.username.toLowerCase().includes(q) ||
                u.display_name.toLowerCase().includes(q) ||
                u.active_lang.toLowerCase().includes(q);
            return matchRole && matchText;
        });
    }, [users, searchQuery, roleFilter]);

    const totalPlatformXp = useMemo(
        () => users.reduce((sum, u) => sum + (u.xp ?? 0), 0),
        [users],
    );
    const staffCount = useMemo(
        () => users.filter((u) => u.role === 'curator' || u.role === 'superadmin').length,
        [users],
    );

    const formatJoinedDate = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return '-';
        }
    };

    const isHighRiskChange =
        pendingRoleChange?.nextRole === 'superadmin' ||
        (pendingRoleChange?.fromRole !== 'member' && pendingRoleChange?.nextRole === 'member');

    return (
        <div className="space-y-6">
            {/* Header Console */}
            <div className="veloa-surface-card flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 font-mono text-[11px] font-extrabold uppercase text-(--accent-primary)">
                        <Shield className="h-3.5 w-3.5" />
                        <span>Superadmin Control Plane</span>
                    </span>
                    <h1 className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        Monitoring Pengguna & Otoritas Sistem
                    </h1>
                    <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                        Pantau progres belajar seluruh pengguna terdaftar, kelola hak akses Curator
                        kurikulum, dan masuk ke Content Studio.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => void loadAdminData()}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 py-2.5 text-xs font-bold text-(--text-primary) hover:border-(--accent-primary)"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Segarkan Data</span>
                    </button>
                    <button
                        type="button"
                        onClick={onOpenStudio}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl bg-(--accent-primary) px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-(--accent-primary-hover)"
                    >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Buka Content Studio →</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-(--text-muted)">
                        <span>Total Akun Terdaftar</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--accent-primary-soft) text-(--accent-primary)">
                            <Users className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        {users.length.toLocaleString('id-ID')}
                    </p>
                    <p className="mt-0.5 text-[11px] text-(--text-muted)">
                        Pengguna aktif di database cloud
                    </p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-(--text-muted)">
                        <span>Akumulasi XP Global</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                            <Sparkles className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        {totalPlatformXp.toLocaleString('id-ID')} XP
                    </p>
                    <p className="mt-0.5 text-[11px] text-(--text-muted)">
                        Total poin belajar terakumulasi
                    </p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-(--text-muted)">
                        <span>Tim Staff & Curator</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                            <Award className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        {staffCount} Akun
                    </p>
                    <p className="mt-0.5 text-[11px] text-(--text-muted)">
                        Curator & Superadmin aktif
                    </p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-(--text-muted)">
                        <span>Modul Kustom Studio</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600">
                            <BookOpen className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        {customModuleCount} Modul
                    </p>
                    <p className="mt-0.5 text-[11px] text-(--text-muted)">
                        Draf & kurikulum terpublikasi
                    </p>
                </div>
            </div>

            {/* Banner Status Sukses / Error */}
            {feedbackBanner && (
                <div
                    role="status"
                    className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold ${feedbackBanner.type === 'success'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200'
                        }`}
                >
                    {feedbackBanner.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <span>{feedbackBanner.message}</span>
                </div>
            )}

            {/* Filter & Daftar Pengguna */}
            <div className="veloa-surface-card space-y-4 p-5 sm:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Cari username, nama tampilan, atau kode bahasa (en, ja, zh)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) pr-3.5 pl-10 text-xs font-medium text-(--text-primary) outline-none focus:border-(--accent-primary)"
                        />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                        {(['ALL', 'member', 'curator', 'superadmin'] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRoleFilter(r)}
                                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold uppercase whitespace-nowrap transition-all ${roleFilter === r
                                        ? 'bg-(--accent-primary) text-white shadow-2xs'
                                        : 'text-(--text-secondary) hover:text-(--text-primary)'
                                    }`}
                            >
                                {r === 'ALL' ? `Semua (${users.length})` : r}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex min-h-48 items-center justify-center gap-2 text-xs text-(--text-secondary)">
                        <Loader2 className="h-5 w-5 animate-spin text-(--accent-primary)" />
                        <span>Memuat daftar pengguna dari database...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--border-subtle) p-6 text-center">
                        <p className="text-xs font-bold text-(--text-secondary)">
                            Tidak ada akun yang cocok dengan filter pencarian.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setRoleFilter('ALL');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1.5 text-xs font-bold text-(--accent-primary)"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reset Filter</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {/* TAMPILAN KARTU RESPONSIF KHUSUS MOBILE (< md) */}
                        <div className="space-y-3 md:hidden">
                            {filteredUsers.map((u) => {
                                const isSelf = u.user_id === currentUser?.id;
                                const avatarBg =
                                    AVATAR_BG_MAP[u.avatar_theme ?? 'indigo'] ?? 'bg-indigo-600';
                                const acc =
                                    u.total_answered > 0
                                        ? Math.round((u.total_correct / u.total_answered) * 100)
                                        : 100;

                                return (
                                    <div
                                        key={u.user_id}
                                        className="space-y-3 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white ${avatarBg}`}
                                                >
                                                    {u.display_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-extrabold text-(--text-primary)">
                                                        {u.display_name}{' '}
                                                        {isSelf && (
                                                            <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] text-(--accent-primary)">
                                                                Anda
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="truncate font-mono text-[11px] text-(--text-muted)">
                                                        @{u.username} ·{' '}
                                                        <span className="uppercase text-(--accent-primary)">
                                                            {u.active_lang}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <RoleSelectorDropdown
                                                value={u.role}
                                                disabled={isSelf}
                                                isUpdating={updatingUserId === u.user_id}
                                                onSelectRole={(nextRole) =>
                                                    handleRoleSelectRequest(u, nextRole)
                                                }
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--border-subtle) pt-2.5 text-[11px] font-semibold text-(--text-secondary)">
                                            <span>
                                                Lv.{u.level} ({u.xp.toLocaleString('id-ID')} XP)
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-amber-600">
                                                <Flame className="h-3 w-3" />
                                                {u.streak_days}h
                                            </span>
                                            <span className="font-mono">Akurasi {acc}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TAMPILAN TABEL DESKTOP (>= md) */}
                        <div className="hidden overflow-visible md:block">
                            <table className="w-full border-collapse text-start text-xs">
                                <thead>
                                    <tr className="border-b border-(--border-subtle) bg-(--surface-elevated)/80 text-[11px] font-extrabold uppercase tracking-wider text-(--text-muted)">
                                        <th className="rounded-tl-xl p-3.5">Pengguna</th>
                                        <th className="p-3.5">Fokus</th>
                                        <th className="p-3.5">Level & XP</th>
                                        <th className="p-3.5">Streak</th>
                                        <th className="p-3.5">Akurasi</th>
                                        <th className="p-3.5">Bergabung</th>
                                        <th className="rounded-tr-xl p-3.5 text-end">
                                            Otoritas Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-(--border-subtle)">
                                    {filteredUsers.map((u) => {
                                        const isSelf = u.user_id === currentUser?.id;
                                        const avatarBg =
                                            AVATAR_BG_MAP[u.avatar_theme ?? 'indigo'] ??
                                            'bg-indigo-600';
                                        const acc =
                                            u.total_answered > 0
                                                ? Math.round(
                                                    (u.total_correct / u.total_answered) * 100,
                                                )
                                                : 100;

                                        return (
                                            <tr
                                                key={u.user_id}
                                                className="transition-colors hover:bg-(--surface-elevated)/40"
                                            >
                                                <td className="p-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white shadow-2xs ${avatarBg}`}
                                                        >
                                                            {u.display_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-(--text-primary)">
                                                                {u.display_name}{' '}
                                                                {isSelf && (
                                                                    <span className="ms-1 rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] text-(--accent-primary)">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="font-mono text-[11px] text-(--text-muted)">
                                                                @{u.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3.5">
                                                    <span className="rounded-md bg-(--accent-primary-soft) px-2 py-0.5 font-mono text-[11px] font-extrabold uppercase text-(--accent-primary)">
                                                        {u.active_lang}
                                                    </span>
                                                </td>
                                                <td className="p-3.5">
                                                    <span className="font-extrabold text-(--text-primary)">
                                                        Lv.{u.level}
                                                    </span>{' '}
                                                    <span className="text-(--text-muted)">
                                                        ({u.xp.toLocaleString('id-ID')} XP)
                                                    </span>
                                                </td>
                                                <td className="p-3.5 font-bold text-amber-600">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Flame className="h-3.5 w-3.5 fill-current" />
                                                        {u.streak_days} hari
                                                    </span>
                                                </td>
                                                <td className="p-3.5 font-mono font-semibold text-(--text-secondary)">
                                                    {acc}%{' '}
                                                    <span className="text-[11px] text-(--text-muted)">
                                                        ({u.total_correct}/{u.total_answered})
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-[11px] text-(--text-muted)">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatJoinedDate(u.created_at)}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-end">
                                                    <RoleSelectorDropdown
                                                        value={u.role}
                                                        disabled={isSelf}
                                                        isUpdating={updatingUserId === u.user_id}
                                                        onSelectRole={(nextRole) =>
                                                            handleRoleSelectRequest(u, nextRole)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* ====================================================================
                MODAL KONFIRMASI PERUBAHAN ROLE (UNTUK SEMUA PERUBAHAN OTORITAS)
               ==================================================================== */}
            {pendingRoleChange && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="role-confirm-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                    onClick={() => setPendingRoleChange(null)}
                >
                    <div
                        className="veloa-surface-card relative w-full max-w-md border border-(--border-strong) p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPendingRoleChange(null)}
                            aria-label="Tutup dialog konfirmasi"
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-(--text-muted) hover:bg-(--surface-elevated) hover:text-(--text-primary)"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isHighRiskChange
                                    ? 'bg-amber-500/15 text-amber-600'
                                    : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                }`}
                        >
                            {isHighRiskChange ? (
                                <AlertTriangle className="h-5 w-5" />
                            ) : (
                                <ShieldAlert className="h-5 w-5" />
                            )}
                        </div>

                        <h3
                            id="role-confirm-title"
                            className="mt-4 text-base font-extrabold text-(--text-primary)"
                        >
                            Konfirmasi Perubahan Otoritas Akun
                        </h3>

                        <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">
                            Anda akan memperbarui hak akses untuk{' '}
                            <strong className="text-(--text-primary)">
                                {pendingRoleChange.targetUser.display_name} (@
                                {pendingRoleChange.targetUser.username})
                            </strong>
                            :
                        </p>

                        {/* Visual Perbandingan Role Lama -> Role Baru */}
                        <div className="mt-3.5 flex items-center justify-center gap-2.5 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/75 p-3">
                            <span
                                className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-extrabold uppercase ${ROLE_META[pendingRoleChange.fromRole].badgeClass
                                    }`}
                            >
                                {ROLE_META[pendingRoleChange.fromRole].label}
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-(--text-muted)" />
                            <span
                                className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-extrabold uppercase ${ROLE_META[pendingRoleChange.nextRole].badgeClass
                                    }`}
                            >
                                {ROLE_META[pendingRoleChange.nextRole].label}
                            </span>
                        </div>

                        {/* Dampak Hak Akses */}
                        <div className="mt-3 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-3 text-[11px] leading-relaxed text-(--text-secondary)">
                            <p className="font-extrabold text-(--text-primary)">
                                Dampak Perubahan:
                            </p>
                            <p className="mt-0.5">
                                {ROLE_META[pendingRoleChange.nextRole].impactSummary}
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => setPendingRoleChange(null)}
                                className="veloa-tactile-btn rounded-xl border border-(--border-subtle) bg-(--surface-elevated) py-2.5 text-xs font-bold text-(--text-primary) hover:border-(--border-strong)"
                            >
                                Batalkan
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const { targetUser, nextRole } = pendingRoleChange;
                                    setPendingRoleChange(null);
                                    void executeRoleUpdate(targetUser, nextRole);
                                }}
                                className="veloa-tactile-btn rounded-xl bg-(--accent-primary) py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-(--accent-primary-hover)"
                            >
                                Ya, Ubah Role
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
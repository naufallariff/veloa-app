// src/shared/ui/AppShellLayout.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowLeft,
    BarChart3,
    BookMarked,
    BrainCircuit,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Circle,
    Eye,
    EyeOff,
    Flame,
    GraduationCap,
    Home,
    LayoutGrid,
    Lock,
    LogIn,
    Moon,
    PanelLeftClose,
    PanelLeftOpen,
    PenTool,
    Search,
    Settings,
    Shield,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useMasteryEngine } from '@/features/practice-engine/hooks/useMasteryEngine';
import { useAuth } from '@/features/auth/AuthContext';
import { VeloaBrandMark } from './VeloaBrandMark';

export type AppSectionId =
    | 'HOME'
    | 'LEARNING'
    | 'PRACTICE'
    | 'LIBRARY'
    | 'PROGRESS'
    | 'SETTINGS'
    | 'STUDIO'
    | 'ADMIN';

export interface LessonHeaderContext {
    moduleId: string;
    lang: LanguageCode;
    tierBadge: string;
    completedCards: number;
    totalCards: number;
    isPracticeMode: boolean;
    isModuleCompleted: boolean;
    showPhoneticToggle: boolean;
    hidePhoneticAid: boolean;
    onBackToHub: () => void;
    onTogglePhoneticAid: () => void;
    onTogglePracticeMode: () => void;
    onToggleModuleCompleted: () => void;
}

interface AppShellLayoutProps {
    activeSection: AppSectionId;
    onChangeSection: (section: AppSectionId) => void;
    selectedLang: LanguageCode;
    onChangeLang: (lang: LanguageCode) => void;
    onOpenQuickSearch: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    dueSrsCount: number;
    bookmarkCount: number;
    onOpenAuthModal: (mode?: 'LOGIN' | 'REGISTER') => void;
    lessonContext?: LessonHeaderContext | null;
    children: React.ReactNode;
}

interface LanguageOption {
    code: LanguageCode;
    shortCode: string;
    name: string;
    nativeName: string;
    framework: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    {
        code: 'en',
        shortCode: 'EN',
        name: 'English',
        nativeName: 'English',
        framework: 'CEFR A1–C2',
    },
    {
        code: 'zh',
        shortCode: 'ZH',
        name: 'Mandarin',
        nativeName: '普通话',
        framework: 'HSK 1–6',
    },
    {
        code: 'ja',
        shortCode: 'JA',
        name: 'Jepang',
        nativeName: '日本語',
        framework: 'JLPT N5–N1',
    },
    {
        code: 'ar',
        shortCode: 'AR',
        name: 'Arab',
        nativeName: 'العربية',
        framework: 'Naḥwu & CEFR',
    },
    {
        code: 'ko',
        shortCode: 'KO',
        name: 'Korea',
        nativeName: '한국어',
        framework: 'TOPIK I–II',
    },
];

interface NavItemConfig {
    id: AppSectionId;
    label: string;
    mobileLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    group: 'LEARNING' | 'WORKSPACE';
}

const AVATAR_BG_MAP: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    cyan: 'bg-cyan-600',
    violet: 'bg-violet-600',
};

export const AppShellLayout: React.FC<AppShellLayoutProps> = ({
    activeSection,
    onChangeSection,
    selectedLang,
    onChangeLang,
    onOpenQuickSearch,
    isDarkMode,
    onToggleDarkMode,
    dueSrsCount,
    bookmarkCount,
    onOpenAuthModal,
    lessonContext = null,
    children,
}) => {
    const { xp, streakDays } = useMasteryEngine();
    const { profile, isLoading, isGuest, isStaff, isSuperadmin } = useAuth();

    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isMobileHubOpen, setIsMobileHubOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const lastScrollYRef = useRef<number>(0);
    const wasInLessonRef = useRef<boolean>(false);

    const effectiveLang = lessonContext?.lang ?? selectedLang;
    const currentLangMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === effectiveLang) ?? LANGUAGE_OPTIONS[0]!;

    const displayXp = !isGuest && profile ? Math.max(xp, profile.xp) : xp;
    const displayStreak =
        !isGuest && profile ? Math.max(streakDays, profile.streakDays) : streakDays;

    // Otomatis lipat sidebar desktop saat masuk mode belajar/latihan agar fokus,
    // lalu kembalikan saat keluar ke halaman eksplorasi
    useEffect(() => {
        const isInLesson = Boolean(lessonContext);
        if (isInLesson && !wasInLessonRef.current) {
            setIsSidebarCollapsed(true);
            setIsLangMenuOpen(false);
        } else if (!isInLesson && wasInLessonRef.current) {
            setIsSidebarCollapsed(false);
        }
        wasInLessonRef.current = isInLesson;
    }, [lessonContext]);

    const navItems: NavItemConfig[] = [
        {
            id: 'HOME',
            label: 'Beranda',
            mobileLabel: 'Beranda',
            icon: Home,
            group: 'LEARNING',
        },
        {
            id: 'LEARNING',
            label: 'Learning Hub',
            mobileLabel: 'Kurikulum',
            icon: GraduationCap,
            group: 'LEARNING',
        },
        {
            id: 'PRACTICE',
            label: 'Practice Center',
            mobileLabel: 'Latihan',
            icon: BrainCircuit,
            badge: dueSrsCount > 0 ? dueSrsCount : undefined,
            group: 'LEARNING',
        },
        {
            id: 'LIBRARY',
            label: 'Knowledge Library',
            mobileLabel: 'Brankas',
            icon: BookMarked,
            badge: bookmarkCount > 0 ? bookmarkCount : undefined,
            group: 'LEARNING',
        },
        {
            id: 'PROGRESS',
            label: 'My Progress',
            mobileLabel: 'Progres',
            icon: BarChart3,
            group: 'LEARNING',
        },
    ];

    if (!isGuest) {
        navItems.push({
            id: 'SETTINGS',
            label: 'Pengaturan Akun',
            mobileLabel: 'Akun',
            icon: Settings,
            group: 'WORKSPACE',
        });
    }
    if (isStaff) {
        navItems.push({
            id: 'STUDIO',
            label: 'Content Studio',
            mobileLabel: 'Studio',
            icon: PenTool,
            group: 'WORKSPACE',
        });
    }
    if (isSuperadmin) {
        navItems.push({
            id: 'ADMIN',
            label: 'Admin Console',
            mobileLabel: 'Admin',
            icon: Shield,
            group: 'WORKSPACE',
        });
    }

    const effectiveActiveSection: AppSectionId = lessonContext ? 'LEARNING' : activeSection;
    const activeNavMeta =
        navItems.find((item) => item.id === effectiveActiveSection) ?? navItems[0]!;
    const learningNavItems = navItems.filter((item) => item.group === 'LEARNING');
    const workspaceNavItems = navItems.filter((item) => item.group === 'WORKSPACE');

    const mobilePrimaryTabs = isStaff
        ? learningNavItems.filter((item) => item.id !== 'PROGRESS')
        : learningNavItems;

    const isWorkspaceTabActive =
        isMobileHubOpen ||
        effectiveActiveSection === 'STUDIO' ||
        effectiveActiveSection === 'ADMIN' ||
        effectiveActiveSection === 'SETTINGS' ||
        (isStaff && effectiveActiveSection === 'PROGRESS');

    // ========================================================================
    // APPLE-STYLE FLOATING TOPBAR (MOBILE & DESKTOP):
    // FADE-OUT + SLIDE-UP ON SCROLL DOWN, FADE-IN + SLIDE-DOWN ON SCROLL UP
    // ========================================================================
    useEffect(() => {
        let ticking = false;
        lastScrollYRef.current = window.scrollY;

        const updateHeaderVisibility = () => {
            const currentY = Math.max(0, window.scrollY);
            const delta = currentY - lastScrollYRef.current;

            if (currentY <= 24 || isLangMenuOpen || isMobileHubOpen) {
                setIsHeaderVisible(true);
            } else if (delta > 6 && currentY > 56) {
                setIsHeaderVisible(false);
            } else if (delta < -2) {
                setIsHeaderVisible(true);
            }

            lastScrollYRef.current = currentY;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateHeaderVisibility);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLangMenuOpen, isMobileHubOpen]);

    useEffect(() => {
        if (!isLangMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsLangMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isLangMenuOpen]);

    useEffect(() => {
        if (!isMobileHubOpen) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileHubOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isMobileHubOpen]);

    const handleNavigateFromMobileSheet = (section: AppSectionId) => {
        setIsMobileHubOpen(false);
        onChangeSection(section);
    };

    const avatarBgClass = profile
        ? AVATAR_BG_MAP[profile.avatarTheme] ?? 'bg-indigo-600'
        : 'bg-indigo-600';

    const renderSidebarNavButton = (item: NavItemConfig) => {
        const Icon = item.icon;
        const isActive = effectiveActiveSection === item.id;

        if (isSidebarCollapsed) {
            return (
                <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onChangeSection(item.id)}
                    className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-xl transition-all ${isActive
                            ? 'bg-(--accent-primary) text-white shadow-xs'
                            : 'text-(--text-secondary) hover:bg-(--surface-elevated)/90 hover:text-(--text-primary)'
                        }`}
                >
                    <Icon
                        className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-(--text-muted)'
                            }`}
                    />
                    {item.badge !== undefined && (
                        <span
                            className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${isActive ? 'bg-white' : 'bg-(--accent-primary)'
                                }`}
                        />
                    )}
                </button>
            );
        }

        return (
            <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onChangeSection(item.id)}
                className={`flex min-h-10 w-full items-center justify-between rounded-xl px-3 text-[13px] font-semibold transition-all ${isActive
                        ? 'bg-(--accent-primary) text-white shadow-xs'
                        : 'text-(--text-secondary) hover:bg-(--surface-elevated)/90 hover:text-(--text-primary)'
                    }`}
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-(--text-muted)'
                            }`}
                    />
                    <span className="truncate">{item.label}</span>
                </span>

                {item.badge !== undefined && (
                    <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                            }`}
                    >
                        {item.badge}
                    </span>
                )}
            </button>
        );
    };

    const ActiveSectionIcon = activeNavMeta.icon;

    return (
        <div className="veloa-ambient-backdrop min-h-dvh text-(--text-primary)">
            {/* ====================================================================
                DESKTOP LEFT SIDEBAR — TETAP ADA DI SEMUA HALAMAN (TERMASUK MODUL)
               ==================================================================== */}
            <aside
                aria-label="Navigasi utama desktop"
                className={`veloa-glass-chrome fixed inset-y-0 inset-s-0 z-30 hidden flex-col justify-between overflow-hidden border-e border-(--border-subtle) py-4 transition-[width,padding] duration-250 ease-out lg:flex ${isSidebarCollapsed ? 'w-18.5 px-2.5' : 'w-64 px-3.5'
                    }`}
            >
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    {isSidebarCollapsed ? (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setIsSidebarCollapsed(false)}
                                title="Buka sidebar navigasi"
                                aria-label="Buka sidebar navigasi"
                                className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform active:scale-95"
                            >
                                <span className="pointer-events-none block h-8 w-8 overflow-hidden transition-opacity duration-150 group-hover:opacity-0">
                                    <VeloaBrandMark size="sm" />
                                </span>

                                <span className="absolute inset-0 flex items-center justify-center rounded-xl border border-(--accent-primary)/30 bg-(--accent-primary-soft) text-(--accent-primary) opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                    <PanelLeftOpen className="h-4.5 w-4.5" />
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-2 ps-1.5 pe-0.5">
                            <button
                                type="button"
                                onClick={() => onChangeSection('HOME')}
                                className="min-w-0 text-start focus:outline-none"
                            >
                                <VeloaBrandMark size="md" subtitle="Linguistic Studio" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsSidebarCollapsed(true)}
                                title="Tutup sidebar"
                                aria-label="Tutup sidebar"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--text-muted) transition-colors hover:bg-(--surface-elevated) hover:text-(--text-primary)"
                            >
                                <PanelLeftClose className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pe-0.5">
                        <nav aria-label="Menu pembelajaran" className="space-y-1">
                            {learningNavItems.map(renderSidebarNavButton)}
                        </nav>

                        {workspaceNavItems.length > 0 && (
                            <div className="space-y-1 border-t border-(--border-subtle) pt-3">
                                {!isSidebarCollapsed && (
                                    <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
                                        Akun & Studio
                                    </p>
                                )}
                                <nav aria-label="Menu akun dan studio" className="space-y-1">
                                    {workspaceNavItems.map(renderSidebarNavButton)}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bagian Bawah Sidebar */}
                <div className="mt-3 shrink-0 space-y-2 border-t border-(--border-subtle) pt-3">
                    {isSidebarCollapsed ? (
                        <>
                            <div
                                title={`Fokus Bahasa: ${currentLangMeta.name} (${currentLangMeta.framework})`}
                                className="mx-auto flex h-9 w-10 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) font-mono text-[11px] font-extrabold text-(--accent-primary)"
                            >
                                {currentLangMeta.shortCode}
                            </div>

                            {isLoading ? (
                                <div className="mx-auto h-10 w-10 animate-pulse rounded-xl bg-(--surface-elevated)" />
                            ) : isGuest ? (
                                <button
                                    type="button"
                                    title="Masuk ke Akun Veloa"
                                    aria-label="Masuk ke Akun Veloa"
                                    onClick={() => onOpenAuthModal('LOGIN')}
                                    className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--accent-primary) hover:border-(--accent-primary)"
                                >
                                    <LogIn className="h-4 w-4" />
                                </button>
                            ) : (
                                profile && (
                                    <button
                                        type="button"
                                        title={`${profile.displayName} (@${profile.username}) · ${profile.role.toUpperCase()}`}
                                        aria-label="Pengaturan akun dan profil"
                                        onClick={() => onChangeSection('SETTINGS')}
                                        className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) hover:border-(--accent-primary)"
                                    >
                                        <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white ${avatarBgClass}`}
                                        >
                                            {profile.displayName.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full border border-(--surface-card) bg-emerald-500" />
                                    </button>
                                )
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between rounded-xl border border-(--border-subtle) bg-(--surface-card)/90 px-3 py-2 shadow-2xs">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted)">
                                        Fokus Bahasa
                                    </p>
                                    <p className="truncate text-xs font-extrabold text-(--text-primary)">
                                        {currentLangMeta.name}{' '}
                                        <span className="font-semibold text-(--accent-primary)">
                                            · {currentLangMeta.nativeName}
                                        </span>
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-md bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-bold text-(--accent-primary)">
                                    {currentLangMeta.shortCode}
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="h-11 animate-pulse rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/60" />
                            ) : isGuest ? (
                                <button
                                    type="button"
                                    onClick={() => onOpenAuthModal('LOGIN')}
                                    className="flex w-full items-center justify-between rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/70 px-3 py-2 text-start text-[11px] text-(--text-secondary) transition-colors hover:border-(--accent-primary)"
                                >
                                    <span className="inline-flex items-center gap-1.5 font-semibold">
                                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Mode Tamu · Lokal</span>
                                    </span>
                                    <span className="font-mono font-extrabold text-(--accent-primary)">
                                        Masuk
                                    </span>
                                </button>
                            ) : (
                                profile && (
                                    <button
                                        type="button"
                                        onClick={() => onChangeSection('SETTINGS')}
                                        className="flex w-full items-center justify-between gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/70 px-3 py-2 text-start text-[11px] transition-colors hover:border-(--accent-primary)"
                                    >
                                        <span className="inline-flex min-w-0 items-center gap-2">
                                            <span className="relative shrink-0">
                                                <span
                                                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white shadow-2xs ${avatarBgClass}`}
                                                >
                                                    {profile.displayName.charAt(0).toUpperCase()}
                                                </span>
                                                <span
                                                    title="Terhubung ke Cloud Sync"
                                                    className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-(--surface-card) bg-emerald-500"
                                                />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate font-bold text-(--text-primary)">
                                                    {profile.displayName}
                                                </span>
                                                <span className="block truncate font-mono text-[10px] text-(--text-muted)">
                                                    @{profile.username}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="shrink-0 rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-(--accent-primary)">
                                            {profile.role}
                                        </span>
                                    </button>
                                )
                            )}
                        </>
                    )}
                </div>
            </aside>

            {/* ====================================================================
                MAIN CONTENT COLUMN + FLOATING AUTO-HIDE TOPBAR (MOBILE & DESKTOP)
               ==================================================================== */}
            <div
                className={`flex min-h-dvh min-w-0 flex-1 flex-col pt-18 pb-22 transition-[padding] duration-250 ease-out lg:pt-22 lg:pb-0 ${isSidebarCollapsed ? 'lg:ps-18.5' : 'lg:ps-64'
                    }`}
            >
                {/* Floating Apple-Style Top Navbar (Konsisten di Eksplorasi & Lesson Mode) */}
                <div
                    className={`fixed inset-x-0 top-0 z-30 pt-[calc(0.5rem+env(safe-area-inset-top))] transition-[padding,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:pt-3.5 ${isSidebarCollapsed ? 'lg:ps-18.5' : 'lg:ps-64'
                        } ${isHeaderVisible
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none -translate-y-full opacity-0'
                        }`}
                >
                    <div className="mx-auto w-full max-w-370 px-2.5 sm:px-6 lg:px-8 xl:px-10">
                        <header className="veloa-glass-chrome rounded-2xl border border-(--border-subtle) shadow-lg/5">
                            <div className="flex h-13.5 items-center justify-between gap-2 px-3 sm:h-15 sm:gap-3 sm:px-5">
                                {/* SISI KIRI:
                                    - Logo tetap ada di mobile (< lg)
                                    - Saat eksplorasi: Dropdown Bahasa + Indikator Workspace
                                    - Saat di dalam Modul/Latihan: Tombol Kembali + Konteks Modul */}
                                <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => onChangeSection('HOME')}
                                        className="shrink-0 focus:outline-none lg:hidden"
                                    >
                                        <VeloaBrandMark size="sm" />
                                    </button>

                                    {lessonContext ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={lessonContext.onBackToHub}
                                                className="veloa-tactile-btn inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs font-bold text-(--text-primary) shadow-2xs hover:border-(--accent-primary) sm:h-10 sm:px-3.5"
                                            >
                                                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                                                <span>Kembali</span>
                                            </button>

                                            <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/65 px-3 py-1.5 text-xs font-semibold text-(--text-secondary) md:inline-flex">
                                                <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-(--accent-primary)">
                                                    {currentLangMeta.shortCode} · {currentLangMeta.name}
                                                </span>
                                                <span className="truncate">{lessonContext.tierBadge}</span>
                                                <span className="text-(--border-strong)">·</span>
                                                <span className="shrink-0 font-mono text-[11px] font-bold text-(--accent-primary)">
                                                    {lessonContext.completedCards}/{lessonContext.totalCards}{' '}
                                                    Kartu
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div ref={dropdownRef} className="relative">
                                                <button
                                                    type="button"
                                                    aria-haspopup="listbox"
                                                    aria-expanded={isLangMenuOpen}
                                                    aria-label="Pilih bahasa pembelajaran"
                                                    onClick={() => setIsLangMenuOpen((open) => !open)}
                                                    className="veloa-tactile-btn inline-flex h-9 items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs font-bold text-(--text-primary) shadow-2xs hover:border-(--accent-primary) sm:h-10 sm:gap-2.5 sm:px-3.5"
                                                >
                                                    <span className="rounded-md bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-(--accent-primary) sm:px-2">
                                                        {currentLangMeta.shortCode}
                                                    </span>
                                                    <span className="hidden sm:inline">
                                                        {currentLangMeta.name}
                                                    </span>
                                                    <span className="hidden text-(--text-muted) md:inline">
                                                        · {currentLangMeta.nativeName}
                                                    </span>
                                                    <ChevronDown
                                                        className={`h-3.5 w-3.5 text-(--text-muted) transition-transform ${isLangMenuOpen ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>

                                                {isLangMenuOpen && (
                                                    <div
                                                        role="listbox"
                                                        aria-label="Daftar bahasa tersedia"
                                                        className="veloa-surface-card absolute inset-s-0 z-40 mt-2 w-64 overflow-hidden border border-(--border-strong) p-1.5 shadow-xl"
                                                    >
                                                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                                                            Ganti Fokus Bahasa
                                                        </div>
                                                        {LANGUAGE_OPTIONS.map((opt) => {
                                                            const isSelected =
                                                                opt.code === selectedLang;
                                                            return (
                                                                <button
                                                                    key={opt.code}
                                                                    type="button"
                                                                    role="option"
                                                                    aria-selected={isSelected}
                                                                    onClick={() => {
                                                                        onChangeLang(opt.code);
                                                                        setIsLangMenuOpen(false);
                                                                    }}
                                                                    className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-start transition-colors ${isSelected
                                                                            ? 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                                                            : 'text-(--text-primary) hover:bg-(--surface-elevated)'
                                                                        }`}
                                                                >
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-mono text-xs font-bold">
                                                                                {opt.shortCode}
                                                                            </span>
                                                                            <span className="text-sm font-bold">
                                                                                {opt.name}
                                                                            </span>
                                                                            <span className="text-xs text-(--text-muted)">
                                                                                {opt.nativeName}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[11px] text-(--text-muted)">
                                                                            {opt.framework}
                                                                        </p>
                                                                    </div>

                                                                    {isSelected && (
                                                                        <Check className="h-4 w-4 text-(--accent-primary)" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="hidden items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/60 px-3 py-1.5 text-xs font-bold text-(--text-secondary) xl:inline-flex">
                                                <ActiveSectionIcon className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                <span>{activeNavMeta.label}</span>
                                                <span className="text-(--border-strong)">·</span>
                                                <span className="font-mono text-[11px] text-(--text-muted)">
                                                    {currentLangMeta.framework}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* SISI KANAN:
                                    - Search + Aksi Kontekstual Lesson (jika aktif) + XP/Streak + Profile Pill + Theme Toggle */}
                                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                                    <button
                                        type="button"
                                        onClick={onOpenQuickSearch}
                                        aria-label="Cari cepat modul atau topik"
                                        className="veloa-tactile-btn inline-flex h-9 w-9 items-center justify-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) text-xs font-medium text-(--text-secondary) hover:border-(--border-strong) sm:h-10 sm:w-auto sm:px-3"
                                    >
                                        <Search className="h-4 w-4 shrink-0 text-(--accent-primary)" />
                                        {!lessonContext && (
                                            <span className="hidden lg:inline">Cari Materi...</span>
                                        )}
                                        <kbd className="hidden rounded bg-(--surface-elevated) px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--text-muted) xl:inline">
                                            Ctrl K
                                        </kbd>
                                    </button>

                                    {/* Kontrol Khusus Saat Di Dalam Lesson / Practice Mode */}
                                    {lessonContext && (
                                        <>
                                            {lessonContext.showPhoneticToggle &&
                                                !lessonContext.isPracticeMode && (
                                                    <button
                                                        type="button"
                                                        aria-pressed={lessonContext.hidePhoneticAid}
                                                        onClick={lessonContext.onTogglePhoneticAid}
                                                        title="Sembunyikan atau tampilkan romanisasi/pinyin/furigana"
                                                        className={`veloa-tactile-btn hidden h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold md:inline-flex ${lessonContext.hidePhoneticAid
                                                                ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                                                : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)'
                                                            }`}
                                                    >
                                                        {lessonContext.hidePhoneticAid ? (
                                                            <EyeOff className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Eye className="h-3.5 w-3.5" />
                                                        )}
                                                        <span className="hidden 2xl:inline">
                                                            {lessonContext.hidePhoneticAid
                                                                ? 'Fonetik: Off'
                                                                : 'Fonetik: On'}
                                                        </span>
                                                    </button>
                                                )}

                                            <button
                                                type="button"
                                                onClick={lessonContext.onTogglePracticeMode}
                                                className={`veloa-tactile-btn hidden h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold sm:inline-flex ${lessonContext.isPracticeMode
                                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                                        : 'border-(--accent-primary) bg-(--accent-primary) text-white hover:bg-(--accent-primary-hover)'
                                                    }`}
                                            >
                                                <BrainCircuit className="h-3.5 w-3.5" />
                                                <span>
                                                    {lessonContext.isPracticeMode
                                                        ? 'Materi'
                                                        : 'Latih Modul'}
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={lessonContext.onToggleModuleCompleted}
                                                aria-pressed={lessonContext.isModuleCompleted}
                                                className={`veloa-tactile-btn hidden h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold md:inline-flex ${lessonContext.isModuleCompleted
                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                        : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--border-strong)'
                                                    }`}
                                            >
                                                {lessonContext.isModuleCompleted ? (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        <span>Selesai</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Circle className="h-3.5 w-3.5 text-(--text-muted)" />
                                                        <span className="hidden xl:inline">
                                                            Tandai Selesai
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    )}

                                    {/* Live Streak & XP Pill (Tetap tampil di semua halaman) */}
                                    <button
                                        type="button"
                                        onClick={() => onChangeSection('PROGRESS')}
                                        aria-label="Lihat ringkasan progres dan XP"
                                        className="veloa-tactile-btn hidden h-10 items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-semibold hover:border-(--accent-primary) sm:inline-flex"
                                    >
                                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                            <Flame className="h-3.5 w-3.5 fill-current" />
                                            <span>{displayStreak}h</span>
                                        </span>
                                        <span className="text-(--border-strong)">|</span>
                                        <span className="inline-flex items-center gap-1 text-(--accent-primary)">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            <span>{displayXp.toLocaleString('id-ID')} XP</span>
                                        </span>
                                    </button>

                                    {/* Profile / Auth Pill (Tetap tampil di semua halaman) */}
                                    {isLoading ? (
                                        <div className="h-9 w-20 animate-pulse rounded-xl border border-(--border-subtle) bg-(--surface-elevated)" />
                                    ) : isGuest ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onOpenAuthModal('LOGIN')}
                                                className="veloa-tactile-btn inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-(--accent-primary) px-3 text-xs font-extrabold whitespace-nowrap text-white shadow-2xs hover:bg-(--accent-primary-hover) sm:h-10 sm:px-3.5"
                                            >
                                                <LogIn className="h-3.5 w-3.5 shrink-0" />
                                                <span>Masuk</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onToggleDarkMode}
                                                aria-label={
                                                    isDarkMode
                                                        ? 'Beralih ke mode terang'
                                                        : 'Beralih ke mode gelap'
                                                }
                                                className="veloa-tactile-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) lg:hidden"
                                            >
                                                {isDarkMode ? (
                                                    <Sun className="h-4 w-4" />
                                                ) : (
                                                    <Moon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        profile && (
                                            <>
                                                {/* Mobile Profile Command Pill (< lg) */}
                                                <button
                                                    type="button"
                                                    onClick={() => setIsMobileHubOpen(true)}
                                                    aria-label="Buka menu akun, tema, dan studio"
                                                    aria-expanded={isMobileHubOpen}
                                                    className="veloa-tactile-btn inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) ps-1.5 pe-2.5 text-xs font-bold text-(--text-primary) shadow-2xs hover:border-(--accent-primary) lg:hidden"
                                                >
                                                    <span className="relative shrink-0">
                                                        <span
                                                            className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg text-[11px] font-extrabold text-white ${avatarBgClass}`}
                                                        >
                                                            {profile.displayName
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border-[1.5px] border-(--surface-card) bg-emerald-500"
                                                        />
                                                    </span>
                                                    {isStaff ? (
                                                        <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-(--accent-primary)">
                                                            {isSuperadmin ? 'Admin' : 'Staff'}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-[11px] font-bold text-(--accent-primary)">
                                                            {displayXp} XP
                                                        </span>
                                                    )}
                                                    <ChevronDown className="h-3 w-3 text-(--text-muted)" />
                                                </button>

                                                {/* Desktop Profile Pill (>= lg) */}
                                                <button
                                                    type="button"
                                                    onClick={() => onChangeSection('SETTINGS')}
                                                    aria-label="Buka pengaturan akun dan profil"
                                                    className={`veloa-tactile-btn hidden h-10 shrink-0 items-center gap-2 rounded-xl border px-2.5 text-xs font-bold transition-colors lg:inline-flex ${effectiveActiveSection === 'SETTINGS'
                                                            ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--accent-primary)'
                                                        }`}
                                                >
                                                    <span className="relative shrink-0">
                                                        <span
                                                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white ${avatarBgClass}`}
                                                        >
                                                            {profile.displayName
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-(--surface-card) bg-emerald-500"
                                                        />
                                                    </span>
                                                    {!lessonContext && (
                                                        <span className="max-w-28 truncate">
                                                            {profile.displayName}
                                                        </span>
                                                    )}
                                                    <span className="rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-(--accent-primary)">
                                                        {profile.role}
                                                    </span>
                                                </button>
                                            </>
                                        )
                                    )}

                                    {/* Theme Toggle Desktop (>= lg) */}
                                    <button
                                        type="button"
                                        onClick={onToggleDarkMode}
                                        aria-label={
                                            isDarkMode
                                                ? 'Beralih ke mode terang'
                                                : 'Beralih ke mode gelap'
                                        }
                                        className="veloa-tactile-btn hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong) lg:inline-flex"
                                    >
                                        {isDarkMode ? (
                                            <Sun className="h-4 w-4" />
                                        ) : (
                                            <Moon className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>

                {/* Banner Pengingat Halus Khusus Guest */}
                {!isLoading && isGuest && !lessonContext && (
                    <div className="mx-auto mt-1 w-full max-w-370 px-2.5 sm:px-6 lg:px-8 xl:px-10">
                        <div className="rounded-xl border border-(--border-subtle) bg-(--accent-primary-soft)/60 px-4 py-2 text-center text-xs text-(--text-secondary)">
                            <span>
                                Mode Tamu aktif (progres tersimpan sementara di perangkat ini).{' '}
                            </span>
                            <button
                                type="button"
                                onClick={() => onOpenAuthModal('REGISTER')}
                                className="font-extrabold text-(--accent-primary) underline underline-offset-2"
                            >
                                Daftar gratis untuk mengunci streak & cloud sync →
                            </button>
                        </div>
                    </div>
                )}

                {/* Area Konten Utama — Lebar 1480px dengan Ruang Napas Ideal */}
                <main className="mx-auto w-full max-w-370 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
                    {children}
                </main>
            </div>

            {/* ====================================================================
                MOBILE COMMAND SHEET / DRAWER
               ==================================================================== */}
            {isMobileHubOpen && profile && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu Workspace & Akun"
                    className="fixed inset-0 z-50 flex flex-col justify-end bg-black/55 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsMobileHubOpen(false)}
                >
                    <div
                        className="veloa-surface-card max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl border-t border-(--border-strong) p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-(--border-strong)" />

                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/75 p-3.5">
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white shadow-xs ${avatarBgClass}`}
                                >
                                    {profile.displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="truncate text-sm font-extrabold text-(--text-primary)">
                                            {profile.displayName}
                                        </p>
                                        <span className="shrink-0 rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold uppercase text-(--accent-primary)">
                                            {profile.role}
                                        </span>
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-2.5 text-[11px] font-semibold text-(--text-secondary)">
                                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                            <Flame className="h-3 w-3 fill-current" />
                                            {displayStreak} hari
                                        </span>
                                        <span>·</span>
                                        <span className="inline-flex items-center gap-1 text-(--accent-primary)">
                                            <Sparkles className="h-3 w-3" />
                                            {displayXp.toLocaleString('id-ID')} XP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsMobileHubOpen(false)}
                                aria-label="Tutup menu"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-muted)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {isStaff && (
                            <div className="mt-4 space-y-2">
                                <p className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-(--text-muted)">
                                    Otoritas & Studio Kurikulum
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleNavigateFromMobileSheet('STUDIO')}
                                    className={`flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-start transition-all ${effectiveActiveSection === 'STUDIO'
                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white shadow-sm'
                                            : 'border-(--border-subtle) bg-(--surface-elevated)/60 text-(--text-primary) hover:border-(--accent-primary)'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${effectiveActiveSection === 'STUDIO'
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                                }`}
                                        >
                                            <PenTool className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-extrabold">Content Studio</p>
                                            <p
                                                className={`text-[11px] ${effectiveActiveSection === 'STUDIO'
                                                        ? 'text-white/80'
                                                        : 'text-(--text-muted)'
                                                    }`}
                                            >
                                                Rancang modul, narasi Veloa & blok kurikulum
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                                </button>

                                {isSuperadmin && (
                                    <button
                                        type="button"
                                        onClick={() => handleNavigateFromMobileSheet('ADMIN')}
                                        className={`flex min-h-13 w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-start transition-all ${effectiveActiveSection === 'ADMIN'
                                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white shadow-sm'
                                                : 'border-(--border-subtle) bg-(--surface-elevated)/60 text-(--text-primary) hover:border-(--accent-primary)'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${effectiveActiveSection === 'ADMIN'
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-amber-500/15 text-amber-600'
                                                    }`}
                                            >
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-extrabold">
                                                    Admin Console
                                                </p>
                                                <p
                                                    className={`text-[11px] ${effectiveActiveSection === 'ADMIN'
                                                            ? 'text-white/80'
                                                            : 'text-(--text-muted)'
                                                        }`}
                                                >
                                                    Kelola pengguna terdaftar, XP global & role
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-4 space-y-2">
                            <p className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-(--text-muted)">
                                Akun & Tampilan
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleNavigateFromMobileSheet('PROGRESS')}
                                    className={`flex min-h-12 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-start text-xs font-extrabold ${effectiveActiveSection === 'PROGRESS'
                                            ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                            : 'border-(--border-subtle) bg-(--surface-elevated)/60 text-(--text-primary)'
                                        }`}
                                >
                                    <BarChart3 className="h-4 w-4 shrink-0 text-(--accent-primary)" />
                                    <span>My Progress</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleNavigateFromMobileSheet('SETTINGS')}
                                    className={`flex min-h-12 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-start text-xs font-extrabold ${effectiveActiveSection === 'SETTINGS'
                                            ? 'border-(--accent-primary) bg-(--accent-primary-soft) text-(--accent-primary)'
                                            : 'border-(--border-subtle) bg-(--surface-elevated)/60 text-(--text-primary)'
                                        }`}
                                >
                                    <Settings className="h-4 w-4 shrink-0 text-(--accent-primary)" />
                                    <span>Pengaturan</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={onToggleDarkMode}
                                className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 px-3.5 py-2.5 text-xs font-extrabold text-(--text-primary)"
                            >
                                <span className="inline-flex items-center gap-2.5">
                                    {isDarkMode ? (
                                        <Sun className="h-4 w-4 text-amber-500" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-indigo-500" />
                                    )}
                                    <span>
                                        Tema Tampilan:{' '}
                                        {isDarkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}
                                    </span>
                                </span>
                                <span className="rounded-lg bg-(--surface-card) px-2 py-1 font-mono text-[10px] font-bold text-(--accent-primary)">
                                    Ubah
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ====================================================================
                MOBILE BOTTOM NAVIGATION BAR (< lg)
                Disembunyikan saat LessonPlayerPage menampilkan dock aksi modulnya
               ==================================================================== */}
            {!lessonContext && (
                <nav
                    aria-label="Navigasi bawah mobile"
                    className="veloa-glass-chrome fixed inset-x-0 bottom-0 z-30 border-t border-(--border-subtle) px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] lg:hidden"
                >
                    <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
                        {mobilePrimaryTabs.map((item) => {
                            const Icon = item.icon;
                            const isActive = !isMobileHubOpen && effectiveActiveSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => {
                                        setIsMobileHubOpen(false);
                                        onChangeSection(item.id);
                                    }}
                                    className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold transition-all active:scale-95 ${isActive
                                            ? 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                            : 'text-(--text-muted) hover:text-(--text-primary)'
                                        }`}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                    <span className="truncate">{item.mobileLabel}</span>
                                    {item.badge !== undefined && (
                                        <span className="absolute top-1.5 right-3 h-2 w-2 rounded-full bg-(--accent-primary)" />
                                    )}
                                </button>
                            );
                        })}

                        {isStaff && (
                            <button
                                type="button"
                                onClick={() => setIsMobileHubOpen((prev) => !prev)}
                                aria-expanded={isMobileHubOpen}
                                className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-bold transition-all active:scale-95 ${isWorkspaceTabActive
                                        ? 'bg-(--accent-primary) text-white shadow-2xs'
                                        : 'text-(--text-muted) hover:text-(--text-primary)'
                                    }`}
                            >
                                {effectiveActiveSection === 'STUDIO' ? (
                                    <PenTool className="h-4.5 w-4.5" />
                                ) : effectiveActiveSection === 'ADMIN' ? (
                                    <Shield className="h-4.5 w-4.5" />
                                ) : (
                                    <LayoutGrid className="h-4.5 w-4.5" />
                                )}
                                <span className="truncate">
                                    {effectiveActiveSection === 'STUDIO'
                                        ? 'Studio'
                                        : effectiveActiveSection === 'ADMIN'
                                            ? 'Admin'
                                            : 'Workspace'}
                                </span>
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </div>
    );
};
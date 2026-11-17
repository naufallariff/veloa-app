// src/shared/ui/AppShellLayout.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    BarChart3,
    BookMarked,
    BrainCircuit,
    Check,
    ChevronDown,
    Flame,
    GraduationCap,
    Home,
    Moon,
    Search,
    Sparkles,
    Sun,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useMasteryEngine } from '@/features/practice-engine/hooks/useMasteryEngine';
import { VeloaBrandMark } from './VeloaBrandMark';

export type AppSectionId = 'HOME' | 'LEARNING' | 'PRACTICE' | 'LIBRARY' | 'PROGRESS';

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
}

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
    children,
}) => {
    const { xp, streakDays } = useMasteryEngine();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const currentLangMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === selectedLang) ?? LANGUAGE_OPTIONS[0]!;

    const navItems: NavItemConfig[] = [
        {
            id: 'HOME',
            label: 'Beranda',
            mobileLabel: 'Beranda',
            icon: Home,
        },
        {
            id: 'LEARNING',
            label: 'Learning Hub',
            mobileLabel: 'Kurikulum',
            icon: GraduationCap,
        },
        {
            id: 'PRACTICE',
            label: 'Practice Center',
            mobileLabel: 'Latihan',
            icon: BrainCircuit,
            badge: dueSrsCount > 0 ? dueSrsCount : undefined,
        },
        {
            id: 'LIBRARY',
            label: 'Knowledge Library',
            mobileLabel: 'Brankas',
            icon: BookMarked,
            badge: bookmarkCount > 0 ? bookmarkCount : undefined,
        },
        {
            id: 'PROGRESS',
            label: 'My Progress',
            mobileLabel: 'Progres',
            icon: BarChart3,
        },
    ];

    // Tutup dropdown bahasa jika pengguna klik di luar area menu atau menekan Escape
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

    return (
        <div className="veloa-ambient-backdrop flex min-h-screen text-(--text-primary)">
            {/* ====================================================================
          DESKTOP LEFT SIDEBAR (248px)
         ==================================================================== */}
            <aside
                aria-label="Navigasi utama desktop"
                className="veloa-glass-chrome sticky top-0 hidden h-screen w-62 shrink-0 flex-col justify-between border-e border-(--border-subtle) px-4 py-6 lg:flex"
            >
                <div className="space-y-8">
                    {/* Logo Brand Velòa */}
                    <button
                        type="button"
                        onClick={() => onChangeSection('HOME')}
                        className="px-2 text-left focus:outline-none"
                    >
                        <VeloaBrandMark size="md" subtitle="Linguistic Studio" />
                    </button>

                    {/* Menu Utama */}
                    <nav aria-label="Menu ruang kerja" className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => onChangeSection(item.id)}
                                    className={`veloa-tactile-btn flex w-full items-center justify-between rounded-2xl px-3.5 text-sm font-semibold transition-all ${isActive
                                            ? 'bg-(--accent-primary) text-white shadow-xs'
                                            : 'text-(--text-secondary) hover:bg-(--surface-elevated)/80 hover:text-(--text-primary)'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon
                                            className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-(--text-muted)'
                                                }`}
                                        />
                                        <span>{item.label}</span>
                                    </span>

                                    {item.badge !== undefined && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                                }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Kartu Ringkasan Bahasa Aktif di Bagian Bawah Sidebar */}
                <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card)/85 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                        Fokus Bahasa Aktif
                    </p>
                    <div className="mt-1.5 flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-(--text-primary)">
                            {currentLangMeta.name}
                        </span>
                        <span className="text-xs font-semibold text-(--accent-primary)">
                            {currentLangMeta.nativeName}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-(--text-secondary)">{currentLangMeta.framework}</p>
                </div>
            </aside>

            {/* ====================================================================
          MAIN CONTENT COLUMN + STICKY TOPBAR
         ==================================================================== */}
            <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
                <header className="veloa-glass-chrome sticky top-0 z-30 border-b border-(--border-subtle)">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                        {/* Logo Compact Khusus Mobile/Tablet */}
                        <div className="flex items-center gap-3 lg:hidden">
                            <button
                                type="button"
                                onClick={() => onChangeSection('HOME')}
                                className="focus:outline-none"
                            >
                                <VeloaBrandMark size="sm" />
                            </button>
                        </div>

                        {/* Compact Language Context Switcher (Menggantikan 5 Kartu Besar) */}
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={isLangMenuOpen}
                                aria-label="Pilih bahasa pembelajaran"
                                onClick={() => setIsLangMenuOpen((open) => !open)}
                                className="veloa-tactile-btn inline-flex items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-bold text-(--text-primary) shadow-2xs hover:border-(--accent-primary)"
                            >
                                <span className="rounded-md bg-(--accent-primary-soft) px-2 py-0.5 font-mono text-[11px] font-extrabold text-(--accent-primary)">
                                    {currentLangMeta.shortCode}
                                </span>
                                <span>{currentLangMeta.name}</span>
                                <span className="hidden text-(--text-muted) sm:inline">
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
                                        const isSelected = opt.code === selectedLang;
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
                                                className={`flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${isSelected
                                                        ? 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                                        : 'text-(--text-primary) hover:bg-(--surface-elevated)'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold">{opt.shortCode}</span>
                                                        <span className="text-sm font-bold">{opt.name}</span>
                                                        <span className="text-xs text-(--text-muted)">{opt.nativeName}</span>
                                                    </div>
                                                    <p className="text-[11px] text-(--text-muted)">{opt.framework}</p>
                                                </div>

                                                {isSelected && <Check className="h-4 w-4 text-(--accent-primary)" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Kontrol Kanan: Quick Search Ctrl+K, Gentle XP/Streak, Theme Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onOpenQuickSearch}
                                aria-label="Cari cepat modul atau topik"
                                className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-medium text-(--text-secondary) hover:border-(--border-strong)"
                            >
                                <Search className="h-3.5 w-3.5 text-(--accent-primary)" />
                                <span className="hidden md:inline">Cari Materi...</span>
                                <kbd className="hidden rounded bg-(--surface-elevated) px-1.5 py-0.5 font-mono text-[10px] font-semibold text-(--text-muted) sm:inline">
                                    Ctrl K
                                </kbd>
                            </button>

                            <button
                                type="button"
                                onClick={() => onChangeSection('PROGRESS')}
                                aria-label="Lihat ringkasan progres dan XP"
                                className="veloa-tactile-btn hidden items-center gap-2.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3.5 text-xs font-semibold hover:border-(--accent-primary) sm:inline-flex"
                            >
                                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                    <Flame className="h-3.5 w-3.5 fill-current" />
                                    <span>{streakDays}h</span>
                                </span>
                                <span className="text-(--border-strong)">|</span>
                                <span className="inline-flex items-center gap-1 text-(--accent-primary)">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>{xp.toLocaleString('id-ID')} XP</span>
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={onToggleDarkMode}
                                aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
                                className="veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)"
                            >
                                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Area Konten Utama */}
                <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
                    {children}
                </main>
            </div>

            {/* ====================================================================
          MOBILE BOTTOM NAVIGATION BAR (< lg)
         ==================================================================== */}
            <nav
                aria-label="Navigasi bawah mobile"
                className="veloa-glass-chrome fixed inset-x-0 bottom-0 z-30 border-t border-(--border-subtle) px-2 py-1.5 lg:hidden"
            >
                <div className="mx-auto flex max-w-md items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                aria-current={isActive ? 'page' : undefined}
                                onClick={() => onChangeSection(item.id)}
                                className={`relative flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-semibold transition-colors ${isActive
                                        ? 'text-(--accent-primary)'
                                        : 'text-(--text-muted) hover:text-(--text-primary)'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.mobileLabel}</span>
                                {item.badge !== undefined && (
                                    <span className="absolute top-1 inset-e-2 h-2 w-2 rounded-full bg-(--accent-primary)" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};
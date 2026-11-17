// src/features/practice-engine/components/MasteryDashboardView.tsx
import React, { useDeferredValue, useMemo, useRef, useState } from 'react';
import {
    ArrowUpRight,
    Award,
    Bookmark,
    CheckCircle2,
    Download,
    Flame,
    Loader2,
    Play,
    Search,
    Sparkles,
    Trash2,
    Turtle,
    Upload,
    Volume2,
} from 'lucide-react';
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';
import { useMasteryEngine } from '../hooks/useMasteryEngine';
import { useStudyVault } from '../hooks/useStudyVault';
import { SrsReviewSessionModal } from './SrsReviewSessionModal';

interface MasteryDashboardViewProps {
    onOpenModule: (moduleId: string) => void;
}

const LANG_META: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'zh', label: 'Mandarin', native: '普通话' },
    { code: 'ja', label: 'Jepang', native: '日本語' },
    { code: 'ar', label: 'Arab', native: 'العربية' },
    { code: 'ko', label: 'Korea', native: '한국어' },
];

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const MasteryDashboardView: React.FC<MasteryDashboardViewProps> = ({ onOpenModule }) => {
    const { completedModuleIds, bookmarkedEntryIds, toggleEntryBookmark } = useLessonProgress();
    const { xp, streakDays, totalAnswered, accuracyPercent, srsRecords } = useMasteryEngine();
    const { resolvedBookmarked, resolvedDueSrs, isResolving, exportBackupJson, importBackupJson } =
        useStudyVault(true);
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();

    const [vaultLangFilter, setVaultLangFilter] = useState<'ALL' | LanguageCode>('ALL');
    const [vaultSearch, setVaultSearch] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewLangFilter, setReviewLangFilter] = useState<'ALL' | LanguageCode>('ALL');
    const [backupNotice, setBackupNotice] = useState<{ ok: boolean; text: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const deferredSearch = useDeferredValue(vaultSearch);

    const totalSrsTracked = Object.keys(srsRecords).length;

    const filteredBookmarks = useMemo(() => {
        const q = deferredSearch.trim().toLowerCase();
        return resolvedBookmarked.filter((item) => {
            if (vaultLangFilter !== 'ALL' && item.lang !== vaultLangFilter) {
                return false;
            }
            if (!q) return true;
            return (
                item.script.toLowerCase().includes(q) ||
                item.meaning.toLowerCase().includes(q) ||
                (item.reading && item.reading.toLowerCase().includes(q)) ||
                item.moduleTitle.toLowerCase().includes(q)
            );
        });
    }, [resolvedBookmarked, vaultLangFilter, deferredSearch]);

    const activeReviewItems = useMemo(() => {
        if (reviewLangFilter === 'ALL') return resolvedDueSrs;
        return resolvedDueSrs.filter((item) => item.lang === reviewLangFilter);
    }, [resolvedDueSrs, reviewLangFilter]);

    const handleDownloadBackup = () => {
        const jsonString = exportBackupJson();
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        const dateStamp = new Date().toISOString().slice(0, 10);
        anchor.href = url;
        anchor.download = `veloa-progress-${dateStamp}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);

        setBackupNotice({
            ok: true,
            text: `Cadangan berhasil diunduh (veloa-progress-${dateStamp}.json).`,
        });
    };

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const content = typeof reader.result === 'string' ? reader.result : '';
            const result = importBackupJson(content);
            setBackupNotice({ ok: result.ok, text: result.message });
            if (result.ok) {
                window.setTimeout(() => {
                    window.location.reload();
                }, 900);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const openSrsSession = (lang: 'ALL' | LanguageCode) => {
        setReviewLangFilter(lang);
        setIsReviewModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* 1. Ringkasan 4 Metrik Penguasaan */}
            <section
                aria-label="Statistik penguasaan belajar"
                className="grid grid-cols-2 gap-3.5 lg:grid-cols-4"
            >
                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Total Poin XP</span>
                        <Sparkles className="h-4 w-4 text-(--accent-primary)" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary) sm:text-3xl">
                        {xp.toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">
                        {totalAnswered.toLocaleString('id-ID')} soal diselesaikan
                    </p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Streak Harian</span>
                        <Flame className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary) sm:text-3xl">
                        {streakDays} <span className="text-base font-bold text-(--text-muted)">hari</span>
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">Konsistensi latihan aktif</p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Akurasi Recall</span>
                        <Award className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                        {accuracyPercent}%
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">Rata-rata ketepatan jawaban</p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Jadwal Ulang Kaji</span>
                        <CheckCircle2 className="h-4 w-4 text-violet-500" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary) sm:text-3xl">
                        {resolvedDueSrs.length}
                    </p>
                    <p className="mt-1 text-xs text-(--text-secondary)">
                        dari {totalSrsTracked} item dalam antrean SM-2
                    </p>
                </div>
            </section>

            {/* Banner Ulang Kaji Terjadwal Jika Ada Item Jatuh Tempo */}
            {resolvedDueSrs.length > 0 && (
                <section className="veloa-surface-card flex flex-wrap items-center justify-between gap-4 border-violet-500/40 bg-violet-500/10 p-5">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                            Spaced Repetition (SM-2) Siap Dijalankan
                        </span>
                        <h2 className="text-base font-extrabold text-(--text-primary)">
                            Ada {resolvedDueSrs.length} item memori yang waktunya diulang hari ini
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => openSrsSession('ALL')}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 text-xs font-semibold text-white hover:bg-violet-700"
                    >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Mulai Sesi Ulang Kaji ({resolvedDueSrs.length})</span>
                    </button>
                </section>
            )}

            {/* 2. Rincian Progres 5 Bahasa */}
            <section aria-label="Progres per bahasa" className="space-y-4">
                <h2 className="text-lg font-extrabold text-(--text-primary)">
                    Rincian Penguasaan 5 Bahasa
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {LANG_META.map((langItem) => {
                        const mods = CURRICULUM_MANIFEST.filter((m) => m.lang === langItem.code);
                        const doneCount = mods.filter((m) => completedModuleIds.includes(m.id)).length;
                        const pct = mods.length > 0 ? Math.round((doneCount / mods.length) * 100) : 0;
                        const dueForLang = resolvedDueSrs.filter((item) => item.lang === langItem.code);

                        return (
                            <div
                                key={langItem.code}
                                className="veloa-surface-card flex flex-col justify-between p-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase text-(--accent-primary)">
                                            {langItem.code}
                                        </span>
                                        <span className="font-mono text-xs font-bold text-(--text-primary)">
                                            {pct}%
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-extrabold text-(--text-primary)">
                                            {langItem.label}
                                        </h3>
                                        <p className="text-xs text-(--text-muted)">{langItem.native}</p>
                                    </div>

                                    <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-elevated)">
                                        <div
                                            className="h-full rounded-full bg-(--accent-primary) transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    <p className="text-xs text-(--text-secondary)">
                                        {doneCount} / {mods.length} modul selesai
                                    </p>
                                </div>

                                {dueForLang.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => openSrsSession(langItem.code)}
                                        className="veloa-tactile-btn mt-4 w-full rounded-xl border border-violet-500/35 bg-violet-500/10 py-2 text-xs font-semibold text-violet-800 dark:text-violet-200"
                                    >
                                        Ulang Kaji ({dueForLang.length})
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. Brankas Kosakata & Aksara Tersimpan (Bookmarked Vault) */}
            <section
                aria-label="Brankas entri tersimpan"
                className="veloa-surface-card space-y-5 p-6 sm:p-8"
            >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-5">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                            <span>Brankas Kosakata & Aksara Tersimpan</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-(--text-primary)">
                            Koleksi Pribadi ({bookmarkedEntryIds.length} item)
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search
                                className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={vaultSearch}
                                onChange={(e) => setVaultSearch(e.target.value)}
                                placeholder="Cari di brankas tersimpan..."
                                aria-label="Cari item tersimpan"
                                className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) ps-10 pe-4 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-1">
                            {(['ALL', 'en', 'zh', 'ja', 'ar', 'ko'] as const).map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => setVaultLangFilter(code)}
                                    className={`veloa-tactile-btn rounded-xl border px-3 text-xs font-semibold uppercase ${vaultLangFilter === code
                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                            : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)'
                                        }`}
                                >
                                    {code === 'ALL' ? 'Semua' : code}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isResolving ? (
                    <div className="flex items-center justify-center gap-2 py-12 text-sm text-(--text-muted)">
                        <Loader2 className="h-5 w-5 animate-spin text-(--accent-primary)" />
                        <span>Memuat item dari korpus modul...</span>
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-(--border-strong) py-12 text-center text-sm text-(--text-muted)">
                        {bookmarkedEntryIds.length === 0
                            ? 'Belum ada kosakata yang ditandai. Tekan ikon Bookmark pada kartu kosakata di dalam modul untuk menyimpannya di sini.'
                            : 'Tidak ada item tersimpan yang cocok dengan filter saat ini.'}
                    </div>
                ) : (
                    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBookmarks.map((item) => {
                            const isRtl = item.lang === 'ar';
                            const audioNormalKey = `vault-${item.id}-normal`;
                            const audioSlowKey = `vault-${item.id}-slow`;

                            return (
                                <article
                                    key={item.id}
                                    className="flex flex-col justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/45 p-4"
                                >
                                    <div>
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="rounded-md bg-(--surface-card) px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-(--accent-primary)">
                                                {item.lang} · {item.categoryLabel}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => toggleEntryBookmark(item.id)}
                                                aria-label={`Hapus ${item.script} dari brankas`}
                                                className="veloa-tactile-btn inline-flex h-9 w-9 items-center justify-center rounded-lg text-(--text-muted) hover:bg-rose-500/15 hover:text-rose-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div dir={isRtl ? 'rtl' : 'ltr'} className="my-1.5">
                                            <h3
                                                className={`${SCRIPT_CLASS_MAP[item.lang]} text-xl font-bold text-(--text-primary)`}
                                            >
                                                {item.script}
                                            </h3>
                                        </div>

                                        {item.reading && (
                                            <p className="font-mono text-xs text-(--accent-primary)">{item.reading}</p>
                                        )}

                                        <p className="mt-2.5 border-t border-(--border-subtle) pt-2.5 text-sm text-(--text-secondary)">
                                            {item.meaning}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => onOpenModule(item.moduleId)}
                                            className="veloa-tactile-btn inline-flex items-center gap-1 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-semibold text-(--text-secondary) hover:border-(--border-strong)"
                                        >
                                            <span>Modul</span>
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </button>

                                        {isSupported && (
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => speak(item.script, item.lang, audioNormalKey, false)}
                                                    aria-label={`Dengarkan ${item.script}`}
                                                    className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === audioNormalKey
                                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                                        }`}
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => speak(item.script, item.lang, audioSlowKey, true)}
                                                    aria-label={`Dengarkan lambat ${item.script}`}
                                                    className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === audioSlowKey
                                                            ? 'border-cyan-500 bg-cyan-600 text-white'
                                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                                        }`}
                                                >
                                                    <Turtle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* 4. Panel Cadangan & Pemulihan Data (JSON Export/Import) */}
            <section
                aria-label="Cadangan dan pemulihan progres belajar"
                className="veloa-surface-card flex flex-wrap items-center justify-between gap-4 p-6"
            >
                <div className="space-y-1">
                    <h2 className="text-base font-extrabold text-(--text-primary)">
                        Cadangan & Pemulihan Progres Belajar (JSON)
                    </h2>
                    <p className="max-w-2xl text-xs leading-relaxed text-(--text-secondary)">
                        Seluruh progres modul, kosakata tersimpan, XP, dan jadwal Spaced Repetition disimpan di
                        peramban Anda. Unduh berkas cadangan untuk memindahkan data ke perangkat lain.
                    </p>
                    {backupNotice && (
                        <p
                            className={`pt-1 text-xs font-semibold ${backupNotice.ok
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                }`}
                        >
                            {backupNotice.text}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleDownloadBackup}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-4 text-xs font-semibold text-(--text-primary) hover:border-(--border-strong)"
                    >
                        <Download className="h-4 w-4 text-(--accent-primary)" />
                        <span>Ekspor Cadangan (.json)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-4 text-xs font-semibold text-white"
                    >
                        <Upload className="h-4 w-4" />
                        <span>Pulihkan dari Berkas</span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json,.json"
                        onChange={handleImportFileChange}
                        className="hidden"
                    />
                </div>
            </section>

            {/* Modal Ulang Kaji SRS */}
            {isReviewModalOpen && (
                <SrsReviewSessionModal
                    items={activeReviewItems}
                    onClose={() => setIsReviewModalOpen(false)}
                />
            )}
        </div>
    );
};
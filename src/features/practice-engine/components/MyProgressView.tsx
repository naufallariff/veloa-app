// src/features/practice-engine/components/MyProgressView.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
    Award,
    BarChart3,
    BookOpen,
    Download,
    Flame,
    Globe2,
    Headphones,
    MessageSquare,
    PenTool,
    Sparkles,
    Upload,
} from 'lucide-react';
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useMasteryEngine } from '../hooks/useMasteryEngine';
import { useStudyVault } from '../hooks/useStudyVault';
import { LANGUAGE_OPTIONS } from '@/shared/ui/AppShellLayout';

interface MyProgressViewProps {
    selectedLang: LanguageCode;
    onSelectLanguage: (lang: LanguageCode) => void;
}

type CompetencyStage = 'Not Assessed' | 'Developing' | 'Demonstrated' | 'Proficient';

function resolveCompetencyStage(scorePercent: number): {
    stage: CompetencyStage;
    badgeClass: string;
} {
    if (scorePercent === 0) {
        return {
            stage: 'Not Assessed',
            badgeClass: 'bg-slate-500/12 text-slate-600 dark:text-slate-300',
        };
    }
    if (scorePercent < 40) {
        return {
            stage: 'Developing',
            badgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
        };
    }
    if (scorePercent < 80) {
        return {
            stage: 'Demonstrated',
            badgeClass: 'bg-sky-500/15 text-sky-800 dark:text-sky-300',
        };
    }
    return {
        stage: 'Proficient',
        badgeClass: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300',
    };
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
    selectedLang,
    onSelectLanguage,
}) => {
    const { completedModuleIds } = useLessonProgress();
    const { xp, streakDays, totalAnswered, accuracyPercent } = useMasteryEngine();
    const { exportBackupJson, importBackupJson } = useStudyVault(false);

    const [backupNotice, setBackupNotice] = useState<{ ok: boolean; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const langMeta =
        LANGUAGE_OPTIONS.find((item) => item.code === selectedLang) ?? LANGUAGE_OPTIONS[0]!;

    // Hitung 6 Dimensi Kompetensi untuk bahasa yang sedang aktif
    const competencyDimensions = useMemo(() => {
        const mods = CURRICULUM_MANIFEST.filter((m) => m.lang === selectedLang);
        const doneMods = mods.filter((m) => completedModuleIds.includes(m.id));

        const calcRatio = (predicate: (m: (typeof mods)[number]) => boolean) => {
            const total = mods.filter(predicate).length;
            if (total === 0) return 0;
            const done = doneMods.filter(predicate).length;
            return Math.round((done / total) * 100);
        };

        const phoneticsScore = calcRatio((m) => m.pillar === 'phonetics');
        const scriptScore = calcRatio((m) => m.pillar === 'script');
        const grammarScore = calcRatio((m) => m.pillar === 'syntax' || m.pillar === 'morphology');
        const lexiconScore = calcRatio((m) => m.pillar === 'lexicon-dialogue');
        const masteryScore = calcRatio((m) => m.tier === 'native');

        return [
            {
                id: 'listening',
                title: 'Listening Comprehension',
                description: 'Pemahaman fonetik, nada, dan pelafalan audio penutur asli',
                percent: Math.min(100, Math.round(phoneticsScore * 0.6 + (totalAnswered > 0 ? accuracyPercent * 0.4 : 0))),
                icon: Headphones,
            },
            {
                id: 'speaking',
                title: 'Speaking & Articulation',
                description: 'Ketepatan artikulasi bunyi, intonasi, dan respons lisan',
                percent: phoneticsScore,
                icon: MessageSquare,
            },
            {
                id: 'reading',
                title: 'Reading & Orthography',
                description: 'Kemampuan membaca aksara asli, tanda baca, dan teks terstruktur',
                percent: Math.round((scriptScore + lexiconScore) / 2),
                icon: BookOpen,
            },
            {
                id: 'writing',
                title: 'Writing & Script Production',
                description: 'Penguasaan kaidah ejaan, pembentukan kata, dan struktur kalimat tertulis',
                percent: Math.round((scriptScore + grammarScore) / 2),
                icon: PenTool,
            },
            {
                id: 'linguistic',
                title: 'Linguistic Knowledge',
                description: 'Pemahaman eksplisit morfologi, sintaksis, dan kaidah tata bahasa',
                percent: grammarScore,
                icon: BarChart3,
            },
            {
                id: 'cultural',
                title: 'Cultural & Pragmatic Competence',
                description: 'Kesadaran register formal-informal, retorika, dan konteks budaya',
                percent: Math.max(masteryScore, Math.round(lexiconScore * 0.5)),
                icon: Globe2,
            },
        ];
    }, [selectedLang, completedModuleIds, totalAnswered, accuracyPercent]);

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="space-y-1.5 border-b border-(--border-subtle) pb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-bold text-(--accent-primary)">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>My Progress · {langMeta.name}</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-(--text-primary) sm:text-3xl">
                    Profil Kompetensi & Analitik Belajar
                </h1>
                <p className="max-w-2xl text-sm text-(--text-secondary)">
                    Evaluasi enam dimensi kemampuan bahasa Anda secara menyeluruh dan kelola cadangan data
                    belajar lintas perangkat.
                </p>
            </section>

            {/* 3 Metrik Global Ringkas */}
            <section className="grid grid-cols-3 gap-3.5">
                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Total XP</span>
                        <Sparkles className="h-4 w-4 text-(--accent-primary)" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        {xp.toLocaleString('id-ID')}
                    </p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Streak Aktif</span>
                        <Flame className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-(--text-primary)">{streakDays} hari</p>
                </div>

                <div className="veloa-surface-card p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-(--text-muted)">
                        <span>Akurasi Recall</span>
                        <Award className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {accuracyPercent}%
                    </p>
                </div>
            </section>

            {/* 6 Dimensi Kompetensi Bahasa Aktif */}
            <section aria-label="Enam dimensi kompetensi" className="space-y-4">
                <h2 className="text-lg font-extrabold text-(--text-primary)">
                    Enam Dimensi Kompetensi ({langMeta.name})
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {competencyDimensions.map((dim) => {
                        const Icon = dim.icon;
                        const { stage, badgeClass } = resolveCompetencyStage(dim.percent);

                        return (
                            <div
                                key={dim.id}
                                className="veloa-surface-card flex flex-col justify-between p-5"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent-primary-soft) text-(--accent-primary)">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}>
                                            {stage}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-extrabold text-(--text-primary)">{dim.title}</h3>
                                        <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                                            {dim.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 border-t border-(--border-subtle) pt-3">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-(--text-muted)">Indeks Bukti Belajar</span>
                                        <span className="text-(--text-primary)">{dim.percent}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-elevated)">
                                        <div
                                            className="h-full rounded-full bg-(--accent-primary) transition-all duration-500"
                                            style={{ width: `${dim.percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Ringkasan Lintas 5 Bahasa */}
            <section aria-label="Ringkasan lima bahasa" className="space-y-4">
                <h2 className="text-lg font-extrabold text-(--text-primary)">
                    Cakupan Lintas 5 Bahasa
                </h2>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                    {LANGUAGE_OPTIONS.map((opt) => {
                        const mods = CURRICULUM_MANIFEST.filter((m) => m.lang === opt.code);
                        const done = mods.filter((m) => completedModuleIds.includes(m.id)).length;
                        const pct = mods.length > 0 ? Math.round((done / mods.length) * 100) : 0;
                        const isCurrent = opt.code === selectedLang;

                        return (
                            <button
                                key={opt.code}
                                type="button"
                                onClick={() => onSelectLanguage(opt.code)}
                                className={`veloa-surface-card veloa-tactile-btn flex flex-col justify-between p-4 text-start ${isCurrent
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft)'
                                        : 'hover:border-(--border-strong)'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-(--accent-primary)">
                                        {opt.shortCode}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-(--text-primary)">{pct}%</span>
                                </div>
                                <div className="my-2">
                                    <p className="text-sm font-extrabold text-(--text-primary)">{opt.name}</p>
                                    <p className="text-xs text-(--text-muted)">
                                        {done}/{mods.length} modul
                                    </p>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--surface-elevated)">
                                    <div
                                        className="h-full rounded-full bg-(--accent-primary)"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Panel Cadangan & Pemulihan Data (JSON) */}
            <section
                aria-label="Cadangan dan pemulihan progres"
                className="veloa-surface-card flex flex-wrap items-center justify-between gap-4 p-6"
            >
                <div className="space-y-1">
                    <h2 className="text-base font-extrabold text-(--text-primary)">
                        Cadangan & Pemulihan Data Belajar (JSON)
                    </h2>
                    <p className="max-w-2xl text-xs leading-relaxed text-(--text-secondary)">
                        Amankan seluruh progres modul, kosakata tersimpan, dan jadwal Spaced Repetition Anda
                        dalam satu berkas JSON portabel.
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
        </div>
    );
};
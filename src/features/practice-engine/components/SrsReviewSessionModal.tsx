// src/features/practice-engine/components/SrsReviewSessionModal.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
    CheckCircle2,
    Eye,
    RotateCcw,
    Sparkles,
    Turtle,
    Volume2,
    X,
} from 'lucide-react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';
import { useMasteryEngine, type RecallRating } from '../hooks/useMasteryEngine';
import type { ResolvedStudyItem } from '../hooks/useStudyVault';

interface SrsReviewSessionModalProps {
    items: ResolvedStudyItem[];
    onClose: () => void;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const SrsReviewSessionModal: React.FC<SrsReviewSessionModalProps> = ({
    items,
    onClose,
}) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const { recordPracticeOutcome } = useMasteryEngine();

    const [queue] = useState<ResolvedStudyItem[]>(() => items);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [reviewedCount, setReviewedCount] = useState(0);

    const currentItem = queue[currentIndex];
    const isCompleted = !currentItem;

    const handleRateItem = useCallback(
        (rating: RecallRating) => {
            if (!currentItem) return;
            const isCorrect = rating !== 'again';
            recordPracticeOutcome({
                itemId: currentItem.id,
                lang: currentItem.lang,
                isCorrect,
                rating,
                xpGain: isCorrect ? 12 : 4,
            });

            setReviewedCount((c) => c + 1);
            setIsRevealed(false);
            setCurrentIndex((i) => i + 1);
        },
        [currentItem, recordPracticeOutcome],
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (isCompleted) return;

            if (!isRevealed && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                setIsRevealed(true);
            } else if (isRevealed) {
                if (e.key === '1') handleRateItem('again');
                else if (e.key === '2') handleRateItem('hard');
                else if (e.key === '3') handleRateItem('good');
                else if (e.key === '4') handleRateItem('easy');
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleRateItem, isCompleted, isRevealed, onClose]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Sesi Ulang Kaji Spaced Repetition"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            <div
                className="veloa-surface-card w-full max-w-2xl overflow-hidden border border-(--border-strong) p-6 shadow-2xl sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {isCompleted ? (
                    <div className="py-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-(--text-primary)">
                            Semua Jadwal Ulang Kaji Selesai!
                        </h2>
                        <p className="mt-2 text-sm text-(--text-secondary)">
                            Anda telah meninjau ulang <strong>{reviewedCount}</strong> item memori jangka panjang
                            hari ini.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="veloa-tactile-btn mt-6 rounded-xl bg-(--accent-primary) px-6 text-xs font-semibold text-white"
                        >
                            Selesai & Tutup
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header Modal */}
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="rounded-md bg-(--accent-primary-soft) px-2.5 py-1 uppercase text-(--accent-primary)">
                                    {currentItem.lang}
                                </span>
                                <span className="text-(--text-muted)">
                                    Ulang Kaji {currentIndex + 1} dari {queue.length}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Tutup modal ulang kaji"
                                className="veloa-tactile-btn inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary)"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Kartu Flashcard */}
                        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-6 text-center sm:p-8">
                            <span className="inline-block rounded-full bg-(--surface-card) px-3 py-1 text-[11px] font-semibold text-(--text-muted)">
                                {currentItem.categoryLabel}
                            </span>

                            <div dir={currentItem.lang === 'ar' ? 'rtl' : 'ltr'} className="my-5">
                                <p
                                    className={`${SCRIPT_CLASS_MAP[currentItem.lang]} text-3xl font-extrabold text-(--text-primary) sm:text-4xl`}
                                >
                                    {currentItem.script}
                                </p>
                            </div>

                            {isSupported && (
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            speak(currentItem.script, currentItem.lang, `srs-${currentItem.id}`, false)
                                        }
                                        className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${speakingKey === `srs-${currentItem.id}`
                                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                            }`}
                                    >
                                        <Volume2 className="h-3.5 w-3.5" />
                                        <span>Lafalkan</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            speak(
                                                currentItem.script,
                                                currentItem.lang,
                                                `srs-slow-${currentItem.id}`,
                                                true,
                                            )
                                        }
                                        className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold ${speakingKey === `srs-slow-${currentItem.id}`
                                                ? 'border-cyan-500 bg-cyan-600 text-white'
                                                : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                            }`}
                                    >
                                        <Turtle className="h-3.5 w-3.5" />
                                        <span>Lambat</span>
                                    </button>
                                </div>
                            )}

                            {/* Bagian Jawaban */}
                            {isRevealed ? (
                                <div className="mt-6 space-y-2 border-t border-(--border-subtle) pt-5">
                                    {currentItem.reading && (
                                        <p className="font-mono text-sm font-semibold text-(--accent-primary)">
                                            {currentItem.reading}
                                        </p>
                                    )}
                                    <p className="text-base font-bold text-(--text-primary) sm:text-lg">
                                        {currentItem.meaning}
                                    </p>
                                    <p className="text-xs text-(--text-muted)">Dari: {currentItem.moduleTitle}</p>
                                </div>
                            ) : (
                                <div className="mt-6 border-t border-(--border-subtle) pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setIsRevealed(true)}
                                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-6 text-xs font-semibold text-white"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Tampilkan Jawaban (Spasi)</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tombol Penilaian SM-2 */}
                        {isRevealed && (
                            <div className="mt-6 space-y-2.5">
                                <p className="text-center text-xs font-semibold text-(--text-muted)">
                                    Seberapa mudah Anda mengingat item ini?
                                </p>
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                    <button
                                        type="button"
                                        onClick={() => handleRateItem('again')}
                                        className="veloa-tactile-btn flex flex-col items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/10 p-3 text-rose-800 dark:text-rose-200"
                                    >
                                        <span className="flex items-center gap-1 text-xs font-bold">
                                            <RotateCcw className="h-3.5 w-3.5" />
                                            <span>1 · Ulangi</span>
                                        </span>
                                        <span className="text-[10px] opacity-80">Hari ini</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRateItem('hard')}
                                        className="veloa-tactile-btn flex flex-col items-center justify-center rounded-xl border border-amber-500/35 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200"
                                    >
                                        <span className="text-xs font-bold">2 · Sulit</span>
                                        <span className="text-[10px] opacity-80">+1 hari</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRateItem('good')}
                                        className="veloa-tactile-btn flex flex-col items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3 text-emerald-800 dark:text-emerald-200"
                                    >
                                        <span className="text-xs font-bold">3 · Bagus</span>
                                        <span className="text-[10px] opacity-80">Sesuai jadwal</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRateItem('easy')}
                                        className="veloa-tactile-btn flex flex-col items-center justify-center rounded-xl border border-violet-500/35 bg-violet-500/10 p-3 text-violet-800 dark:text-violet-200"
                                    >
                                        <span className="flex items-center gap-1 text-xs font-bold">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            <span>4 · Mudah</span>
                                        </span>
                                        <span className="text-[10px] opacity-80">Interval panjang</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
// src/features/practice-engine/components/ActiveRecallArena.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
    ArrowRight,
    Award,
    CheckCircle2,
    Headphones,
    RotateCcw,
    Sparkles,
    Turtle,
    Volume2,
    X,
    XCircle,
} from 'lucide-react';
import type { LessonModule } from '@/features/lesson-engine/schema/lesson.schema';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';
import { useMasteryEngine, type RecallRating } from '../hooks/useMasteryEngine';
import { generatePracticeSession, type PracticeQuestion } from '../utils/quiz-generator';

interface ActiveRecallArenaProps {
    moduleData: LessonModule;
    onClose: () => void;
}

const SCRIPT_CLASS_MAP: Record<LessonModule['lang'], string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const ActiveRecallArena: React.FC<ActiveRecallArenaProps> = ({
    moduleData,
    onClose,
}) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const { recordPracticeOutcome, xp, streakDays } = useMasteryEngine();

    const [questions, setQuestions] = useState<PracticeQuestion[]>(() =>
        generatePracticeSession(moduleData, 10),
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [revealListeningText, setRevealListeningText] = useState(false);
    const [sessionScore, setSessionScore] = useState(0);
    const [sessionXpEarned, setSessionXpEarned] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [hasRecordedCurrent, setHasRecordedCurrent] = useState(false);

    const isRtl = moduleData.lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[moduleData.lang];
    const currentQuestion = questions[currentIndex];

    // Putar audio otomatis ketika soal bertipe 'listening' muncul
    useEffect(() => {
        if (!currentQuestion || isFinished || !isSupported) return;
        if (currentQuestion.kind === 'listening') {
            const timer = window.setTimeout(() => {
                speak(currentQuestion.audioText, moduleData.lang, `arena-${currentQuestion.id}`, false);
            }, 220);
            return () => window.clearTimeout(timer);
        }
    }, [currentQuestion, isFinished, isSupported, moduleData.lang, speak]);

    const handleSelectOption = useCallback(
        (option: string) => {
            if (!currentQuestion || selectedOption !== null) return;

            setSelectedOption(option);
            setRevealListeningText(true);

            const isCorrect = option === currentQuestion.correctOption;
            const gained = isCorrect ? 15 : 5;

            if (isCorrect) {
                setSessionScore((s) => s + 1);
            }
            setSessionXpEarned((x) => x + gained);

            if (!hasRecordedCurrent) {
                recordPracticeOutcome({
                    itemId: currentQuestion.itemId,
                    lang: moduleData.lang,
                    isCorrect,
                    xpGain: gained,
                });
                setHasRecordedCurrent(true);
            }
        },
        [currentQuestion, selectedOption, hasRecordedCurrent, recordPracticeOutcome, moduleData.lang],
    );

    const handleSrsRefinement = (rating: RecallRating) => {
        if (!currentQuestion) return;
        const isCorrect = selectedOption === currentQuestion.correctOption;
        recordPracticeOutcome({
            itemId: currentQuestion.itemId,
            lang: moduleData.lang,
            isCorrect,
            rating,
            xpGain: 0,
        });
        handleNextQuestion();
    };

    const handleNextQuestion = useCallback(() => {
        if (currentIndex + 1 >= questions.length) {
            setIsFinished(true);
            return;
        }
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setRevealListeningText(false);
        setHasRecordedCurrent(false);
    }, [currentIndex, questions.length]);

    const handleRestartSession = () => {
        setQuestions(generatePracticeSession(moduleData, 10));
        setCurrentIndex(0);
        setSelectedOption(null);
        setRevealListeningText(false);
        setSessionScore(0);
        setSessionXpEarned(0);
        setIsFinished(false);
        setHasRecordedCurrent(false);
    };

    // Pintasan keyboard (1-4 untuk opsi, Enter untuk lanjut, Escape untuk tutup)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (isFinished || !currentQuestion) return;

            if (selectedOption === null && ['1', '2', '3', '4'].includes(e.key)) {
                const optionIdx = Number(e.key) - 1;
                const targetOption = currentQuestion.options[optionIdx];
                if (targetOption) {
                    e.preventDefault();
                    handleSelectOption(targetOption);
                }
            } else if (selectedOption !== null && e.key === 'Enter') {
                e.preventDefault();
                handleNextQuestion();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [currentQuestion, handleNextQuestion, handleSelectOption, isFinished, onClose, selectedOption]);

    if (questions.length === 0) {
        return (
            <section className="veloa-surface-card p-8 text-center">
                <p className="text-sm font-semibold text-(--text-primary)">
                    Modul ini belum memiliki cukup item untuk sesi latihan otomatis.
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="veloa-tactile-btn mt-4 rounded-xl bg-(--accent-primary) px-5 text-xs font-semibold text-white"
                >
                    Kembali ke Materi
                </button>
            </section>
        );
    }

    if (isFinished) {
        const accuracy = Math.round((sessionScore / questions.length) * 100);

        return (
            <section
                aria-label="Ringkasan Hasil Latihan"
                className="veloa-surface-card veloa-animated-enter mx-auto max-w-2xl p-6 text-center sm:p-10"
            >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Award className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-(--text-primary)">
                    Sesi Active Recall Selesai!
                </h2>
                <p className="mt-1 text-sm text-(--text-secondary)">{moduleData.title}</p>

                <div className="my-8 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4">
                        <p className="text-xs text-(--text-muted)">Skor Tepat</p>
                        <p className="mt-1 text-xl font-extrabold text-(--text-primary)">
                            {sessionScore}/{questions.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4">
                        <p className="text-xs text-(--text-muted)">Akurasi</p>
                        <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {accuracy}%
                        </p>
                    </div>

                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4">
                        <p className="text-xs text-(--text-muted)">XP Didapat</p>
                        <p className="mt-1 text-xl font-extrabold text-(--accent-primary)">
                            +{sessionXpEarned} XP
                        </p>
                    </div>
                </div>

                <p className="mb-6 text-xs text-(--text-muted)">
                    Total XP Akumulasi: <strong className="text-(--text-primary)">{xp} XP</strong> · Streak
                    Harian: <strong className="text-(--text-primary)">{streakDays} hari</strong>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={handleRestartSession}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-5 text-xs font-semibold text-(--text-primary) hover:border-(--border-strong)"
                    >
                        <RotateCcw className="h-4 w-4" />
                        <span>Latih Set Soal Baru</span>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-6 text-xs font-semibold text-white"
                    >
                        <span>Kembali ke Materi Modul</span>
                    </button>
                </div>
            </section>
        );
    }

    if (!currentQuestion) return null;

    const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
    const isListeningMode = currentQuestion.kind === 'listening' && !revealListeningText;
    const audioKeyNormal = `arena-${currentQuestion.id}`;
    const audioKeySlow = `arena-slow-${currentQuestion.id}`;

    return (
        <section
            aria-label="Arena Latihan Active Recall"
            className="veloa-surface-card veloa-animated-enter mx-auto max-w-3xl overflow-hidden p-6 sm:p-8"
        >
            {/* Bar Progres Atas */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-(--accent-primary)">
                            Soal {currentIndex + 1} dari {questions.length}
                        </span>
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>+{sessionXpEarned} XP</span>
                        </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-(--surface-elevated)">
                        <div
                            className="h-full rounded-full bg-(--accent-primary) transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Keluar dari sesi latihan"
                    className="veloa-tactile-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Kartu Pertanyaan */}
            <div className="mb-6 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-6 text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                    {currentQuestion.promptLabel}
                </p>

                {isListeningMode ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                        <button
                            type="button"
                            onClick={() =>
                                speak(currentQuestion.audioText, moduleData.lang, audioKeyNormal, false)
                            }
                            className="veloa-tactile-btn inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-(--accent-primary) text-white shadow-md"
                            aria-label="Putar audio soal"
                        >
                            <Headphones className="h-7 w-7" />
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    speak(currentQuestion.audioText, moduleData.lang, audioKeyNormal, false)
                                }
                                className="veloa-tactile-btn rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1 text-xs font-semibold text-(--text-secondary)"
                            >
                                Putar Ulang (1.0x)
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    speak(currentQuestion.audioText, moduleData.lang, audioKeySlow, true)
                                }
                                className="veloa-tactile-btn rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1 text-xs font-semibold text-(--text-secondary)"
                            >
                                Lambat (0.72x)
                            </button>
                            <button
                                type="button"
                                onClick={() => setRevealListeningText(true)}
                                className="veloa-tactile-btn rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1 text-xs font-semibold text-(--accent-primary)"
                            >
                                Intip Teks
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div dir={isRtl ? 'rtl' : 'ltr'}>
                            <p
                                className={`${scriptClass} text-2xl font-extrabold text-(--text-primary) sm:text-4xl`}
                            >
                                {currentQuestion.promptScript}
                            </p>
                        </div>

                        {currentQuestion.promptReading && selectedOption !== null && (
                            <p className="font-mono text-xs text-(--accent-primary)">
                                {currentQuestion.promptReading}
                            </p>
                        )}

                        {isSupported && (
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        speak(currentQuestion.audioText, moduleData.lang, audioKeyNormal, false)
                                    }
                                    className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${speakingKey === audioKeyNormal
                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                        }`}
                                >
                                    <Volume2 className="h-3.5 w-3.5" />
                                    <span>Dengar</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        speak(currentQuestion.audioText, moduleData.lang, audioKeySlow, true)
                                    }
                                    className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold ${speakingKey === audioKeySlow
                                            ? 'border-cyan-500 bg-cyan-600 text-white'
                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                        }`}
                                >
                                    <Turtle className="h-3.5 w-3.5" />
                                    <span>Lambat</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pilihan Jawaban (1–4) */}
            <div className="grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, idx) => {
                    const isAnswered = selectedOption !== null;
                    const isChosen = selectedOption === option;
                    const isCorrectOption = option === currentQuestion.correctOption;

                    let cardStyle =
                        'border-(--border-subtle) bg-(--surface-card) text-(--text-primary) hover:border-(--accent-primary)';

                    if (isAnswered) {
                        if (isCorrectOption) {
                            cardStyle =
                                'border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-100';
                        } else if (isChosen) {
                            cardStyle = 'border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-100';
                        } else {
                            cardStyle = 'border-(--border-subtle) bg-(--surface-card) opacity-50';
                        }
                    }

                    return (
                        <button
                            key={`${option}-${idx}`}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(option)}
                            className={`veloa-tactile-btn flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${cardStyle}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-(--border-subtle) bg-(--surface-elevated) font-mono text-xs font-bold text-(--text-muted)">
                                    {idx + 1}
                                </span>
                                <span className="text-sm font-semibold leading-snug">{option}</span>
                            </div>

                            {isAnswered && isCorrectOption && (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            )}
                            {isAnswered && isChosen && !isCorrectOption && (
                                <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Umpan Balik Instan & Kontrol Spaced Repetition */}
            {selectedOption !== null && (
                <div className="mt-6 space-y-4 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/70 p-5">
                    {currentQuestion.explanationNote && (
                        <p className="text-xs leading-relaxed text-(--text-secondary) sm:text-sm">
                            <strong className="text-(--text-primary)">Catatan: </strong>
                            {currentQuestion.explanationNote}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="me-1 text-[11px] font-semibold text-(--text-muted)">
                                Jadwal Ulang SRS:
                            </span>
                            {(
                                [
                                    { id: 'again', label: 'Ulangi' },
                                    { id: 'hard', label: 'Sulit' },
                                    { id: 'good', label: 'Bagus' },
                                    { id: 'easy', label: 'Mudah' },
                                ] as const
                            ).map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => handleSrsRefinement(r.id)}
                                    className="veloa-tactile-btn rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 py-1 text-xs font-semibold text-(--text-secondary) hover:border-(--accent-primary)"
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleNextQuestion}
                            className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 text-xs font-semibold text-white"
                        >
                            <span>
                                {currentIndex + 1 >= questions.length ? 'Lihat Hasil' : 'Lanjut (Enter)'}
                            </span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
// src/features/lesson-engine/blocks/DialogueTheaterBlock.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Eye,
    EyeOff,
    MessageCircle,
    Play,
    Square,
    Tag,
    Turtle,
    Volume2,
} from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';

type DialogueTheaterData = Extract<LessonBlock, { type: 'dialogue-theater' }>;

interface DialogueTheaterBlockProps {
    block: DialogueTheaterData;
    lang: LanguageCode;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const DialogueTheaterBlock: React.FC<DialogueTheaterBlockProps> = ({ block, lang }) => {
    const { speak, stop, speakingKey, isSupported } = useSpeechPronunciation();
    const [showTranslations, setShowTranslations] = useState(true);
    const [showReadings, setShowReadings] = useState(true);
    const [isSequencePlaying, setIsSequencePlaying] = useState(false);
    const [activeTurnIdx, setActiveTurnIdx] = useState<number | null>(null);

    const abortSequenceRef = useRef(false);
    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    // Identifikasi pembicara unik untuk penataan gelembung kiri/kanan
    const uniqueSpeakers = React.useMemo(() => {
        const list: string[] = [];
        for (const turn of block.turns) {
            if (!list.includes(turn.speaker)) {
                list.push(turn.speaker);
            }
        }
        return list;
    }, [block.turns]);

    const stopSequence = useCallback(() => {
        abortSequenceRef.current = true;
        setIsSequencePlaying(false);
        setActiveTurnIdx(null);
        stop();
    }, [stop]);

    useEffect(() => {
        return () => {
            abortSequenceRef.current = true;
        };
    }, []);

    const playFullDialogue = useCallback(async () => {
        if (!isSupported || typeof window === 'undefined') return;
        if (isSequencePlaying) {
            stopSequence();
            return;
        }

        abortSequenceRef.current = false;
        setIsSequencePlaying(true);

        const localeMap: Record<LanguageCode, string> = {
            en: 'en-US',
            zh: 'zh-CN',
            ja: 'ja-JP',
            ar: 'ar-SA',
            ko: 'ko-KR',
        };

        for (let i = 0; i < block.turns.length; i++) {
            if (abortSequenceRef.current) break;
            const turn = block.turns[i];
            if (!turn) continue;

            setActiveTurnIdx(i);

            await new Promise<void>((resolve) => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(turn.line);
                utterance.lang = localeMap[lang];
                utterance.rate = 0.94;
                utterance.onend = () => resolve();
                utterance.onerror = () => resolve();
                window.speechSynthesis.speak(utterance);
            });

            if (!abortSequenceRef.current && i < block.turns.length - 1) {
                await new Promise((r) => setTimeout(r, 320));
            }
        }

        setIsSequencePlaying(false);
        setActiveTurnIdx(null);
    }, [block.turns, isSequencePlaying, isSupported, lang, stopSequence]);

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Konteks & Register Situasi */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-semibold text-(--accent-primary)">
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{block.registerLevel}</span>
                        </span>
                        <span className="text-xs font-medium text-(--text-muted)">
                            {block.contextSituation}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                        {block.title}
                    </h3>
                </div>

                {/* Kontrol Latihan Menyimak & Membaca */}
                <div className="flex flex-wrap items-center gap-2">
                    {isSupported && (
                        <button
                            type="button"
                            onClick={() => void playFullDialogue()}
                            className={`veloa-tactile-btn inline-flex items-center gap-2 rounded-xl px-4 text-xs font-semibold ${isSequencePlaying
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-(--accent-primary) text-white hover:opacity-95'
                                }`}
                        >
                            {isSequencePlaying ? (
                                <>
                                    <Square className="h-3.5 w-3.5 fill-current" />
                                    <span>Hentikan Dialog</span>
                                </>
                            ) : (
                                <>
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Putar Seluruh Dialog</span>
                                </>
                            )}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowReadings((v) => !v)}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-xs font-semibold text-(--text-secondary)"
                    >
                        {showReadings ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>Bacaan</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowTranslations((v) => !v)}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-xs font-semibold text-(--text-secondary)"
                    >
                        {showTranslations ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        <span>Arti</span>
                    </button>
                </div>
            </div>

            {/* Gelembung Percakapan */}
            <div className="space-y-4">
                {block.turns.map((turn, idx) => {
                    const speakerIdx = uniqueSpeakers.indexOf(turn.speaker);
                    const isSecondSpeaker = speakerIdx % 2 === 1;
                    const turnNormalKey = `dlg-${idx}-normal`;
                    const turnSlowKey = `dlg-${idx}-slow`;
                    const isHighlighted =
                        activeTurnIdx === idx ||
                        speakingKey === turnNormalKey ||
                        speakingKey === turnSlowKey;

                    return (
                        <div
                            key={`${turn.speaker}-${idx}`}
                            className={`flex flex-col ${isSecondSpeaker ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`w-full max-w-2xl rounded-2xl border p-4 transition-all sm:p-5 ${isHighlighted
                                        ? 'border-(--accent-primary) bg-(--accent-primary-soft)'
                                        : isSecondSpeaker
                                            ? 'border-(--border-subtle) bg-(--surface-elevated)/80'
                                            : 'border-(--border-subtle) bg-(--surface-card)'
                                    }`}
                            >
                                {/* Nama Pembicara & Sorotan Tata Bahasa */}
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-(--accent-primary)">
                                        {turn.speaker}
                                    </span>

                                    {turn.grammarHighlight && (
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                                            <Tag className="h-3 w-3" />
                                            <span>{turn.grammarHighlight}</span>
                                        </span>
                                    )}
                                </div>

                                {/* Baris Dialog Asli + Tombol Audio */}
                                <div
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                    className="flex items-start justify-between gap-3"
                                >
                                    <p
                                        className={`${scriptClass} text-lg font-bold text-(--text-primary) sm:text-xl`}
                                    >
                                        {turn.line}
                                    </p>

                                    {isSupported && (
                                        <div dir="ltr" className="flex shrink-0 items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isSequencePlaying) stopSequence();
                                                    speak(turn.line, lang, turnNormalKey, false);
                                                }}
                                                aria-label={`Putar kalimat ${turn.speaker}`}
                                                className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === turnNormalKey
                                                        ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                        : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                                    }`}
                                            >
                                                <Volume2 className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isSequencePlaying) stopSequence();
                                                    speak(turn.line, lang, turnSlowKey, true);
                                                }}
                                                aria-label={`Putar lambat kalimat ${turn.speaker}`}
                                                className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === turnSlowKey
                                                        ? 'border-cyan-500 bg-cyan-600 text-white'
                                                        : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary)'
                                                    }`}
                                            >
                                                <Turtle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Transliterasi / Pinyin / Furigana */}
                                {showReadings && turn.reading && (
                                    <p className="mt-2 font-mono text-xs text-(--accent-primary)">{turn.reading}</p>
                                )}

                                {/* Terjemahan */}
                                {showTranslations && (
                                    <p className="mt-2 border-t border-(--border-subtle) pt-2 text-sm text-(--text-secondary)">
                                        {turn.translation}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
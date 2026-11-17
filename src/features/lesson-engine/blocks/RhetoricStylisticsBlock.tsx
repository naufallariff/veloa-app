// src/features/lesson-engine/blocks/RhetoricStylisticsBlock.tsx
import React from 'react';
import { Feather, Globe2, MessageSquareQuote, Volume2 } from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';

type RhetoricData = Extract<LessonBlock, { type: 'rhetoric-stylistics' }>;

interface RhetoricStylisticsBlockProps {
    block: RhetoricData;
    lang: LanguageCode;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const RhetoricStylisticsBlock: React.FC<RhetoricStylisticsBlockProps> = ({
    block,
    lang,
}) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Tradisi Retorika */}
            <div className="mb-6 border-b border-(--border-subtle) pb-5">
                <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <Feather className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{block.traditionName}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                    {block.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-(--text-secondary)">
                    {block.overview}
                </p>
            </div>

            {/* Perangkat Retorika & Gaya Sastra */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                    <MessageSquareQuote className="h-4 w-4 text-(--accent-primary)" />
                    <span>Perangkat Retorika & Keindahan Stilistika</span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {block.devices.map((dev, idx) => {
                        const audioId = `rhet-dev-${idx}`;
                        const isPlaying = speakingKey === audioId;

                        return (
                            <article
                                key={`${dev.deviceName}-${idx}`}
                                className="flex flex-col justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/50 p-5"
                            >
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h4 className="text-base font-bold text-(--text-primary)">
                                            {dev.deviceName}
                                        </h4>
                                        <span className="rounded-lg bg-(--surface-card) px-2.5 py-1 text-xs font-semibold text-(--accent-primary)">
                                            {dev.nativeTerm}
                                        </span>
                                    </div>

                                    <p className="text-sm leading-relaxed text-(--text-secondary)">
                                        {dev.mechanism}
                                    </p>

                                    {/* Contoh Kutipan Sastra */}
                                    <div
                                        dir={isRtl ? 'rtl' : 'ltr'}
                                        className="rounded-xl border border-(--border-subtle) bg-(--surface-card) p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p
                                                className={`${scriptClass} text-base font-bold text-(--text-primary) sm:text-lg`}
                                            >
                                                {dev.literaryExample}
                                            </p>
                                            {isSupported && (
                                                <button
                                                    type="button"
                                                    onClick={() => speak(dev.literaryExample, lang, audioId)}
                                                    aria-label={`Dengarkan contoh ${dev.deviceName}`}
                                                    className={`veloa-tactile-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${isPlaying
                                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                            : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                                        }`}
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        {dev.reading && (
                                            <p dir="ltr" className="mt-1.5 font-mono text-xs text-(--accent-primary)">
                                                {dev.reading}
                                            </p>
                                        )}

                                        <p dir="ltr" className="mt-2 text-xs italic text-(--text-secondary)">
                                            “{dev.translation}”
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-xl bg-violet-500/10 px-3.5 py-2 text-xs text-violet-900 dark:text-violet-200">
                                    <span className="font-bold">Efek Estetis: </span>
                                    {dev.aestheticEffect}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Peta Dialek Regional & Slang Modern */}
            {block.dialectAndSlangNotes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                        <Globe2 className="h-4 w-4 text-cyan-500" />
                        <span>Variasi Dialek Regional & Ekspresi Slang Kontemporer</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {block.dialectAndSlangNotes.map((note, nIdx) => {
                            const dialAudioId = `rhet-dial-${nIdx}`;
                            const isPlaying = speakingKey === dialAudioId;

                            return (
                                <div
                                    key={`${note.varietyName}-${nIdx}`}
                                    className="flex flex-col justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-5"
                                >
                                    <div className="space-y-2.5">
                                        <div>
                                            <h4 className="text-sm font-bold text-(--text-primary)">
                                                {note.varietyName}
                                            </h4>
                                            <p className="text-xs text-(--text-muted)">{note.regionOrContext}</p>
                                        </div>

                                        <div
                                            dir={isRtl ? 'rtl' : 'ltr'}
                                            className="flex items-center justify-between gap-2 rounded-xl bg-(--surface-elevated) px-3.5 py-2.5"
                                        >
                                            <p
                                                className={`${scriptClass} text-sm font-bold text-(--text-primary)`}
                                            >
                                                {note.sampleExpression}
                                            </p>
                                            {isSupported && (
                                                <button
                                                    type="button"
                                                    onClick={() => speak(note.sampleExpression, lang, dialAudioId)}
                                                    aria-label={`Dengarkan ${note.varietyName}`}
                                                    className={`veloa-tactile-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${isPlaying
                                                            ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                            : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)'
                                                        }`}
                                                >
                                                    <Volume2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-xs text-(--text-muted)">
                                            <span className="font-semibold text-(--text-secondary)">Standar: </span>
                                            {note.standardEquivalent}
                                        </p>
                                    </div>

                                    <p className="mt-3 border-t border-(--border-subtle) pt-2.5 text-xs leading-relaxed text-(--text-secondary)">
                                        {note.meaning}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};
// src/features/lesson-engine/blocks/LinguisticLoreBlock.tsx
import React from 'react';
import { BookOpen, Compass, Lightbulb, Sparkles, Volume2 } from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';

type LinguisticLoreData = Extract<LessonBlock, { type: 'linguistic-lore' }>;

interface LinguisticLoreBlockProps {
    block: LinguisticLoreData;
    lang: LanguageCode;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

export const LinguisticLoreBlock: React.FC<LinguisticLoreBlockProps> = ({ block, lang }) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Domain & Era */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-semibold tracking-wide text-(--accent-primary)">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{block.eraOrDomain}</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                        {block.title}
                    </h3>
                </div>
            </div>

            {/* Ringkasan Naratif */}
            <p className="mb-8 text-base leading-relaxed text-(--text-secondary)">
                {block.narrativeSummary}
            </p>

            {/* Timeline Tonggak Evolusi Aksara & Bahasa */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                    <Compass className="h-4 w-4 text-(--accent-primary)" aria-hidden="true" />
                    <span>Tahapan Evolusi & Pembentukan Sistem</span>
                </div>

                <div className="relative space-y-4 border-s-2 border-(--border-strong) ps-5 sm:ps-6">
                    {block.milestones.map((item, idx) => {
                        const speechId = `lore-ms-${idx}`;
                        const isPlaying = speakingKey === speechId;

                        return (
                            <article
                                key={`${item.stage}-${idx}`}
                                className="relative rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4 sm:p-5"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-s-[-1.65rem] top-6 h-3 w-3 rounded-full border-2 border-(--surface-card) bg-(--accent-primary) sm:inset-s-[-1.9rem]"
                                />

                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <h4 className="text-sm font-bold text-(--text-primary) sm:text-base">
                                        {item.stage}
                                    </h4>
                                    {item.reading && (
                                        <span className="rounded-md bg-(--surface-card) px-2.5 py-0.5 font-mono text-xs text-(--text-muted)">
                                            {item.reading}
                                        </span>
                                    )}
                                </div>

                                {item.scriptSample && (
                                    <div
                                        dir={isRtl ? 'rtl' : 'ltr'}
                                        className="my-3 flex items-center justify-between gap-3 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-4 py-3"
                                    >
                                        <p
                                            className={`${scriptClass} text-lg font-semibold text-(--text-primary) sm:text-xl`}
                                        >
                                            {item.scriptSample}
                                        </p>
                                        {isSupported && (
                                            <button
                                                type="button"
                                                onClick={() => speak(item.scriptSample ?? '', lang, speechId)}
                                                aria-label={`Dengarkan pelafalan ${item.stage}`}
                                                className={`veloa-tactile-btn inline-flex shrink-0 items-center justify-center rounded-xl border px-3 text-xs font-medium ${isPlaying
                                                        ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                        : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                                    }`}
                                            >
                                                <Volume2 className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <p className="text-sm leading-relaxed text-(--text-secondary)">
                                    {item.explanation}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Aturan Struktural Fondasi */}
            {block.structuralRules.length > 0 && (
                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                        <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                        <span>Hukum Struktural & Mekanisme Inti</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {block.structuralRules.map((rule, rIdx) => (
                            <div
                                key={`${rule.conceptName}-${rIdx}`}
                                className="flex flex-col justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-5"
                            >
                                <div className="space-y-2.5">
                                    <h4 className="text-base font-bold text-(--text-primary)">
                                        {rule.conceptName}
                                    </h4>
                                    <p className="text-sm leading-relaxed text-(--text-secondary)">
                                        {rule.definition}
                                    </p>
                                    <div className="rounded-xl bg-amber-500/10 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                                        <span className="font-bold">Mengapa Penting: </span>
                                        {rule.whyItMatters}
                                    </div>
                                </div>

                                {rule.examples.length > 0 && (
                                    <ul
                                        dir={isRtl ? 'rtl' : 'ltr'}
                                        className="mt-4 space-y-1.5 border-t border-(--border-subtle) pt-3"
                                    >
                                        {rule.examples.map((ex, eIdx) => (
                                            <li
                                                key={eIdx}
                                                className={`${scriptClass} rounded-lg bg-(--surface-elevated) px-3 py-1.5 text-sm font-medium text-(--text-primary)`}
                                            >
                                                {ex}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips & Fakta Penutur Asli */}
            {block.funFactsAndTips && block.funFactsAndTips.length > 0 && (
                <aside className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
                    <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Catatan Lapangan & Tips Penutur Asli</span>
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-emerald-950/90 dark:text-emerald-100/90">
                        {block.funFactsAndTips.map((tip, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </section>
    );
};
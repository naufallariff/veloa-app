// src/features/lesson-engine/components/VeloaGuideBanner.tsx
import React from 'react';
import { Compass, Lightbulb, Sparkles } from 'lucide-react';
import type { VeloaGuideNarrative } from '../schema/lesson.schema';

interface VeloaGuideBannerProps {
    guide: VeloaGuideNarrative;
    variant?: 'intro' | 'outro';
}

export const VeloaGuideBanner: React.FC<VeloaGuideBannerProps> = ({
    guide,
    variant = 'intro',
}) => {
    const hasIntroContent = Boolean(guide.intro.trim() || guide.fieldNote.trim());
    const hasOutroContent = Boolean(guide.outro.trim());

    if (variant === 'intro' && !hasIntroContent) return null;
    if (variant === 'outro' && !hasOutroContent) return null;

    return (
        <aside
            aria-label="Catatan Pemandu Veloa"
            className="veloa-surface-card relative overflow-hidden border border-(--accent-primary)/25 bg-(--accent-primary-soft)/35 p-5"
        >
            <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--accent-primary) text-white shadow-xs">
                    <Compass className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-extrabold uppercase tracking-wider text-(--accent-primary)">
                            <Sparkles className="h-3 w-3" />
                            <span>Veloa · Linguistic Navigator</span>
                        </span>
                        {guide.culturalContext && (
                            <span className="rounded-full border border-(--border-subtle) bg-(--surface-card) px-2.5 py-0.5 text-[11px] font-semibold text-(--text-secondary)">
                                {guide.culturalContext}
                            </span>
                        )}
                    </div>

                    {variant === 'intro' ? (
                        <>
                            {guide.intro && (
                                <p className="text-sm leading-relaxed text-(--text-primary)">
                                    {guide.intro}
                                </p>
                            )}
                            {guide.fieldNote && (
                                <div className="flex items-start gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card)/90 p-3 text-xs leading-relaxed text-(--text-secondary)">
                                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                    <div>
                                        <strong className="font-extrabold text-(--text-primary)">
                                            Catatan Lapangan:{' '}
                                        </strong>
                                        <span>{guide.fieldNote}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm leading-relaxed text-(--text-primary)">
                            {guide.outro}
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
};
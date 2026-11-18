// src/features/lesson-engine/components/LessonBlockRenderer.tsx
import React, { Suspense, lazy, memo } from 'react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';

const LinguisticLoreBlock = lazy(() =>
    import('../blocks/LinguisticLoreBlock').then((m) => ({ default: m.LinguisticLoreBlock })),
);
const CognitivePatternTableBlock = lazy(() =>
    import('../blocks/CognitivePatternTableBlock').then((m) => ({
        default: m.CognitivePatternTableBlock,
    })),
);
const RhetoricStylisticsBlock = lazy(() =>
    import('../blocks/RhetoricStylisticsBlock').then((m) => ({
        default: m.RhetoricStylisticsBlock,
    })),
);
const ScriptMatrixBlock = lazy(() =>
    import('../blocks/ScriptMatrixBlock').then((m) => ({ default: m.ScriptMatrixBlock })),
);
const DialogueTheaterBlock = lazy(() =>
    import('../blocks/DialogueTheaterBlock').then((m) => ({ default: m.DialogueTheaterBlock })),
);
const VocabularyDeckBlock = lazy(() =>
    import('../blocks/VocabularyDeckBlock').then((m) => ({ default: m.VocabularyDeckBlock })),
);

interface LessonBlockRendererProps {
    blocks: LessonBlock[];
    lang: LanguageCode;
}

const BlockLoadingSkeleton: React.FC = () => (
    <div
        role="status"
        aria-live="polite"
        className="veloa-surface-card min-h-56 animate-pulse p-6 sm:p-8"
    >
        <div className="mb-4 h-5 w-40 rounded-full bg-(--surface-elevated)" />
        <div className="mb-6 h-7 w-2/3 rounded-xl bg-(--surface-elevated)" />
        <div className="space-y-3">
            <div className="h-16 w-full rounded-2xl bg-(--surface-elevated)/70" />
            <div className="h-16 w-full rounded-2xl bg-(--surface-elevated)/70" />
        </div>
        <span className="sr-only">Memuat kartu materi pembelajaran...</span>
    </div>
);

const LessonBlockRendererBase: React.FC<LessonBlockRendererProps> = ({ blocks, lang }) => {
    const containerClass = blocks.length > 1 ? 'space-y-8' : undefined;

    return (
        <div className={containerClass}>
            {blocks.map((block, index) => {
                const key = `${block.type}-${block.title}-${index}`;

                let renderedBlock: React.ReactNode;
                switch (block.type) {
                    case 'linguistic-lore':
                        renderedBlock = <LinguisticLoreBlock block={block} lang={lang} />;
                        break;

                    case 'cognitive-pattern-table':
                        renderedBlock = <CognitivePatternTableBlock block={block} lang={lang} />;
                        break;

                    case 'rhetoric-stylistics':
                        renderedBlock = <RhetoricStylisticsBlock block={block} lang={lang} />;
                        break;

                    case 'script-matrix':
                        renderedBlock = <ScriptMatrixBlock block={block} lang={lang} />;
                        break;

                    case 'dialogue-theater':
                        renderedBlock = <DialogueTheaterBlock block={block} lang={lang} />;
                        break;

                    case 'vocabulary-deck':
                        renderedBlock = <VocabularyDeckBlock block={block} lang={lang} />;
                        break;

                    default: {
                        const _exhaustiveCheck: never = block;
                        return _exhaustiveCheck;
                    }
                }

                return (
                    <Suspense key={key} fallback={<BlockLoadingSkeleton />}>
                        {renderedBlock}
                    </Suspense>
                );
            })}
        </div>
    );
};

export const LessonBlockRenderer = memo(LessonBlockRendererBase);
// src/features/lesson-engine/components/LessonBlockRenderer.tsx
import React from 'react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { LinguisticLoreBlock } from '../blocks/LinguisticLoreBlock';
import { CognitivePatternTableBlock } from '../blocks/CognitivePatternTableBlock';
import { RhetoricStylisticsBlock } from '../blocks/RhetoricStylisticsBlock';
import { ScriptMatrixBlock } from '../blocks/ScriptMatrixBlock';
import { DialogueTheaterBlock } from '../blocks/DialogueTheaterBlock';
import { VocabularyDeckBlock } from '../blocks/VocabularyDeckBlock';

interface LessonBlockRendererProps {
    blocks: LessonBlock[];
    lang: LanguageCode;
}

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({ blocks, lang }) => {
    return (
        <div className="space-y-8">
            {blocks.map((block, index) => {
                const key = `${block.type}-${block.title}-${index}`;

                switch (block.type) {
                    case 'linguistic-lore':
                        return <LinguisticLoreBlock key={key} block={block} lang={lang} />;

                    case 'cognitive-pattern-table':
                        return <CognitivePatternTableBlock key={key} block={block} lang={lang} />;

                    case 'rhetoric-stylistics':
                        return <RhetoricStylisticsBlock key={key} block={block} lang={lang} />;

                    case 'script-matrix':
                        return <ScriptMatrixBlock key={key} block={block} lang={lang} />;

                    case 'dialogue-theater':
                        return <DialogueTheaterBlock key={key} block={block} lang={lang} />;

                    case 'vocabulary-deck':
                        return <VocabularyDeckBlock key={key} block={block} lang={lang} />;

                    default: {
                        const _exhaustiveCheck: never = block;
                        return _exhaustiveCheck;
                    }
                }
            })}
        </div>
    );
};
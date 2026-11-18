// src/features/practice-engine/utils/quiz-generator.ts
import type { LanguageCode, LessonModule } from '@/features/lesson-engine/schema/lesson.schema';

export type PracticeQuestionKind = 'recognition' | 'listening' | 'reading';

export interface PracticeQuestion {
    id: string;
    itemId: string;
    lang: LanguageCode;
    kind: PracticeQuestionKind;
    promptLabel: string;
    promptScript: string;
    promptReading?: string;
    audioText: string;
    correctOption: string;
    options: string[];
    explanationNote?: string;
}

interface RawPracticeCandidate {
    itemId: string;
    script: string;
    reading?: string;
    meaning: string;
    note?: string;
    disableListening?: boolean;
}

function shuffleArray<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j] as T;
        copy[j] = temp as T;
    }
    return copy;
}

function truncateText(text: string, maxLength = 140): string {
    const clean = text.trim();
    if (clean.length <= maxLength) return clean;
    return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

function extractCandidatesFromModule(moduleData: LessonModule): RawPracticeCandidate[] {
    const candidates: RawPracticeCandidate[] = [];
    const seenScripts = new Set<string>();
    const isCjkCompact = moduleData.lang === 'zh' || moduleData.lang === 'ja';

    const pushCandidate = (candidate: RawPracticeCandidate) => {
        const normalizedScript = candidate.script.trim();
        const normalizedMeaning = candidate.meaning.trim();
        if (!normalizedScript || !normalizedMeaning || seenScripts.has(normalizedScript)) {
            return;
        }
        seenScripts.add(normalizedScript);
        candidates.push({
            ...candidate,
            script: normalizedScript,
            meaning: truncateText(normalizedMeaning),
        });
    };

    for (const block of moduleData.blocks) {
        if (block.type === 'vocabulary-deck') {
            const pool =
                block.entries.length > 80
                    ? shuffleArray(block.entries).slice(0, 80)
                    : block.entries;

            for (const entry of pool) {
                pushCandidate({
                    itemId: entry.id,
                    script: entry.term,
                    reading: entry.reading,
                    meaning: entry.meaning,
                    note: entry.patternNote ?? entry.partOfSpeech,
                });
            }
        } else if (block.type === 'script-matrix') {
            const pool =
                block.cells.length > 80 ? shuffleArray(block.cells).slice(0, 80) : block.cells;

            for (let i = 0; i < pool.length; i++) {
                const cell = pool[i];
                if (!cell) continue;
                pushCandidate({
                    itemId: `${moduleData.id}-cell-${cell.glyph}-${i}`,
                    script: cell.glyph,
                    reading: cell.reading,
                    meaning: cell.transliteration,
                    note: cell.mnemonic ?? cell.componentRole,
                });
            }
        } else if (block.type === 'cognitive-pattern-table') {
            for (const row of block.rows) {
                const orderedScripts = block.columns
                    .map((col) => row.cells[col.key]?.script?.trim())
                    .filter((val): val is string => Boolean(val));

                const orderedReadings = block.columns
                    .map((col) => row.cells[col.key]?.reading?.trim())
                    .filter((val): val is string => Boolean(val));

                const combinedScript =
                    orderedScripts.length > 0
                        ? orderedScripts.join(isCjkCompact ? '' : ' ')
                        : Object.values(row.cells)[0]?.script ?? '';

                const combinedReading =
                    orderedReadings.length > 0 ? orderedReadings.join(' ') : undefined;

                pushCandidate({
                    itemId: row.id,
                    script: combinedScript,
                    reading: combinedReading,
                    meaning: row.fullTranslation,
                    note: row.nuanceNote,
                });
            }
        } else if (block.type === 'dialogue-theater') {
            block.turns.forEach((turn, idx) => {
                pushCandidate({
                    itemId: `${moduleData.id}-turn-${idx}`,
                    script: turn.line,
                    reading: turn.reading,
                    meaning: turn.translation,
                    note: turn.grammarHighlight,
                });
            });
        } else if (block.type === 'linguistic-lore') {
            block.milestones.forEach((m, idx) => {
                pushCandidate({
                    itemId: `${moduleData.id}-milestone-${idx}`,
                    script: m.scriptSample || m.stage,
                    reading: m.reading,
                    meaning: `${m.stage}: ${m.explanation}`,
                    note: block.eraOrDomain,
                    disableListening: !m.scriptSample,
                });
            });

            block.structuralRules.forEach((rule, idx) => {
                const sample = rule.examples[0];
                pushCandidate({
                    itemId: `${moduleData.id}-rule-${idx}`,
                    script: rule.conceptName,
                    reading: sample,
                    meaning: rule.definition,
                    note: rule.whyItMatters,
                    disableListening: true,
                });
            });
        } else if (block.type === 'rhetoric-stylistics') {
            block.devices.forEach((dev, idx) => {
                pushCandidate({
                    itemId: `${moduleData.id}-device-${idx}`,
                    script: dev.literaryExample || dev.nativeTerm,
                    reading: dev.reading ?? dev.nativeTerm,
                    meaning: `${dev.deviceName} — ${dev.translation}`,
                    note: dev.aestheticEffect,
                });
            });

            block.dialectAndSlangNotes.forEach((noteItem, idx) => {
                pushCandidate({
                    itemId: `${moduleData.id}-dialect-${idx}`,
                    script: noteItem.sampleExpression,
                    reading: `Standar: ${noteItem.standardEquivalent}`,
                    meaning: `${noteItem.meaning} (${noteItem.varietyName})`,
                    note: noteItem.regionOrContext,
                });
            });
        }
    }

    return candidates;
}

export function generatePracticeSession(
    moduleData: LessonModule,
    questionCount = 10,
): PracticeQuestion[] {
    const candidates = extractCandidatesFromModule(moduleData);
    if (candidates.length < 2) {
        return [];
    }

    const selected = shuffleArray(candidates).slice(0, Math.min(questionCount, candidates.length));
    const questions: PracticeQuestion[] = [];

    selected.forEach((target, idx) => {
        const hasDistinctReading =
            Boolean(target.reading) &&
            target.reading!.trim().toLowerCase() !== target.script.trim().toLowerCase() &&
            !target.reading!.includes('TOPIK') &&
            !target.reading!.includes('HSK') &&
            !target.reading!.startsWith('Standar:');

        // Rotasi jenis soal agar variatif (Recognition, Listening, Reading)
        let kind: PracticeQuestionKind = 'recognition';
        if (idx % 3 === 1 && !target.disableListening) {
            kind = 'listening';
        } else if (idx % 3 === 2 && hasDistinctReading) {
            kind = 'reading';
        }

        if (kind === 'reading' && hasDistinctReading) {
            const distractorPool = candidates
                .filter(
                    (c) =>
                        c.itemId !== target.itemId &&
                        c.reading &&
                        c.reading !== target.reading &&
                        !c.reading.includes('TOPIK') &&
                        !c.reading.startsWith('Standar:'),
                )
                .map((c) => c.reading as string);

            const uniqueDistractors = Array.from(new Set(distractorPool));
            if (uniqueDistractors.length >= 2) {
                const distractors = shuffleArray(uniqueDistractors).slice(0, 3);
                questions.push({
                    id: `q-${moduleData.id}-${idx}`,
                    itemId: target.itemId,
                    lang: moduleData.lang,
                    kind: 'reading',
                    promptLabel: 'Pilih cara baca / pelafalan yang tepat untuk aksara berikut:',
                    promptScript: target.script,
                    audioText: target.script,
                    correctOption: target.reading!,
                    options: shuffleArray([target.reading!, ...distractors]),
                    explanationNote: `${target.script} (${target.reading}) — ${target.meaning}`,
                });
                return;
            }
        }

        // Default untuk 'recognition' & 'listening': tebak makna / konsep yang tepat
        const distractorMeanings = Array.from(
            new Set(
                candidates
                    .filter((c) => c.itemId !== target.itemId && c.meaning !== target.meaning)
                    .map((c) => c.meaning),
            ),
        );

        const distractors = shuffleArray(distractorMeanings).slice(0, 3);
        const isListening = kind === 'listening';

        questions.push({
            id: `q-${moduleData.id}-${idx}`,
            itemId: target.itemId,
            lang: moduleData.lang,
            kind: isListening ? 'listening' : 'recognition',
            promptLabel: isListening
                ? 'Dengarkan pelafalan audio berikut, lalu pilih arti yang tepat:'
                : 'Apa arti atau konsep yang paling tepat untuk istilah / struktur berikut?',
            promptScript: target.script,
            promptReading: target.reading,
            audioText: target.script,
            correctOption: target.meaning,
            options: shuffleArray([target.meaning, ...distractors]),
            explanationNote: target.note
                ? `${target.script}${target.reading ? ` (${target.reading})` : ''} — ${target.note}`
                : `${target.script}${target.reading ? ` (${target.reading})` : ''}`,
        });
    });

    return questions;
}
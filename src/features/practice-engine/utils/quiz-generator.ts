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

function extractCandidatesFromModule(moduleData: LessonModule): RawPracticeCandidate[] {
    const candidates: RawPracticeCandidate[] = [];
    const seenScripts = new Set<string>();

    for (const block of moduleData.blocks) {
        if (block.type === 'vocabulary-deck') {
            // Ambil sampel acak maksimal 80 entri agar cepat untuk deck 15.000+ kata
            const pool =
                block.entries.length > 80
                    ? shuffleArray(block.entries).slice(0, 80)
                    : block.entries;

            for (const entry of pool) {
                if (!entry.term || !entry.meaning || seenScripts.has(entry.term)) continue;
                seenScripts.add(entry.term);
                candidates.push({
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
                if (!cell || !cell.glyph || !cell.transliteration || seenScripts.has(cell.glyph)) continue;
                seenScripts.add(cell.glyph);
                candidates.push({
                    itemId: `${moduleData.id}-cell-${cell.glyph}-${i}`,
                    script: cell.glyph,
                    reading: cell.reading,
                    meaning: cell.transliteration,
                    note: cell.mnemonic ?? cell.componentRole,
                });
            }
        } else if (block.type === 'cognitive-pattern-table') {
            const lastColKey = block.columns[block.columns.length - 1]?.key;
            for (const row of block.rows) {
                const targetCell = lastColKey ? row.cells[lastColKey] : Object.values(row.cells)[0];
                if (!targetCell || !targetCell.script || seenScripts.has(targetCell.script)) continue;
                seenScripts.add(targetCell.script);
                candidates.push({
                    itemId: row.id,
                    script: targetCell.script,
                    reading: targetCell.reading,
                    meaning: row.fullTranslation,
                    note: targetCell.gloss,
                });
            }
        } else if (block.type === 'dialogue-theater') {
            block.turns.forEach((turn, idx) => {
                if (!turn.line || !turn.translation || seenScripts.has(turn.line)) return;
                seenScripts.add(turn.line);
                candidates.push({
                    itemId: `${moduleData.id}-turn-${idx}`,
                    script: turn.line,
                    reading: turn.reading,
                    meaning: turn.translation,
                    note: turn.grammarHighlight,
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
            !target.reading!.includes('HSK');

        // Rotasi jenis soal agar variatif (Recognition, Listening, Reading)
        let kind: PracticeQuestionKind = 'recognition';
        if (idx % 3 === 1) {
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
                        !c.reading.includes('TOPIK'),
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

        // Default untuk 'recognition' & 'listening': tebak arti yang tepat
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
                : 'Apa arti yang paling tepat untuk istilah / struktur berikut?',
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
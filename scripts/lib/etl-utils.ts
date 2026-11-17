// scripts/lib/etl-utils.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    LessonModuleSchema,
    type LessonModule,
} from '../../src/features/lesson-engine/schema/lesson.schema.ts';

export const PUBLIC_DATA_ROOT = path.resolve(
    process.cwd(),
    'public/data/languages',
);

export interface BuildOptions {
    readonly force: boolean;
}

export async function isValidExistingModule(filePath: string): Promise<boolean> {
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(raw);
        LessonModuleSchema.parse(json);
        return true;
    } catch {
        return false;
    }
}

export async function writeValidatedModule(
    moduleData: LessonModule,
    options: BuildOptions,
): Promise<{ id: string; path: string; skipped: boolean; entryCount: number }> {
    const validated = LessonModuleSchema.parse(moduleData);
    const outDir = path.join(PUBLIC_DATA_ROOT, validated.lang, 'modules');
    await fs.mkdir(outDir, { recursive: true });

    const fileName = `${validated.id}.json`;
    const filePath = path.join(outDir, fileName);
    const entryCount = countModuleEntries(validated);

    if (!options.force && (await isValidExistingModule(filePath))) {
        return { id: validated.id, path: filePath, skipped: true, entryCount };
    }

    await fs.writeFile(filePath, JSON.stringify(validated, null, 2), 'utf-8');
    return { id: validated.id, path: filePath, skipped: false, entryCount };
}

export function countModuleEntries(mod: LessonModule): number {
    let total = 0;
    for (const block of mod.blocks) {
        if (block.type === 'vocabulary-deck') total += block.entries.length;
        else if (block.type === 'script-matrix') total += block.cells.length;
        else if (block.type === 'cognitive-pattern-table') total += block.rows.length;
        else if (block.type === 'dialogue-theater') total += block.turns.length;
        else if (block.type === 'linguistic-lore') {
            total += block.milestones.length + block.structuralRules.length;
        } else if (block.type === 'rhetoric-stylistics') {
            total += block.devices.length + block.dialectAndSlangNotes.length;
        }
    }
    return total;
}

export async function fetchJsonWithFallback<T>(
    urls: readonly string[],
    timeoutMs = 30_000,
): Promise<T | null> {
    for (const url of urls) {
        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
            if (!res.ok) continue;
            return (await res.json()) as T;
        } catch {
            // Lanjut ke mirror berikutnya
        }
    }
    return null;
}

export async function fetchTextWithFallback(
    urls: readonly string[],
    timeoutMs = 30_000,
): Promise<string | null> {
    for (const url of urls) {
        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
            if (!res.ok) continue;
            return await res.text();
        } catch {
            // Lanjut ke mirror berikutnya
        }
    }
    return null;
}

export function logStep(lang: string, message: string) {
    process.stdout.write(`\r   [${lang.toUpperCase()}] ${message.padEnd(68, ' ')}`);
}
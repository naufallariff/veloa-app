// scripts/build-curriculum.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    CurriculumManifestItemSchema,
    LessonModuleSchema,
    type CurriculumManifestItem,
    type LanguageCode,
    type LessonModule,
} from '../src/features/lesson-engine/schema/lesson.schema.ts';
import type { BuildOptions } from './lib/etl-utils.ts';
import { buildEnglishModules } from './builders/corpus/corpus-en.ts';
import { buildMandarinModules } from './builders/corpus/corpus-zh.ts';
import { buildJapaneseModules } from './builders/corpus/corpus-ja.ts';
import { buildArabicModules } from './builders/corpus/corpus-ar.ts';
import { buildKoreanModules } from './builders/corpus/corpus-ko.ts';
import { buildExpandedTreeModules } from './builders/tree-expansion-builder.ts';

interface CliOptions extends BuildOptions {
    targetLangs: LanguageCode[];
    retryFailed: boolean;
}

export interface WriteModuleResult {
    id?: string;
    skipped?: boolean;
    entriesCount?: number;
}

export interface FailedModuleRecord {
    id: string;
    lang: LanguageCode;
    reason: string;
}

const ALL_LANGS: LanguageCode[] = ['en', 'zh', 'ja', 'ar', 'ko'];
const PUBLIC_DATA_ROOT = path.resolve(process.cwd(), 'public/data/languages');
const SRC_MODULES_ROOT = path.resolve(process.cwd(), 'src/content/modules');
const MANIFEST_OUTPUT_PATH = path.resolve(process.cwd(), 'src/content/curriculum-manifest.ts');
const FAILED_LOG_PATH = path.resolve(process.cwd(), '.veloa-etl-failed.json');

function parseArgs(): CliOptions {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const retryFailed = args.includes('--retry-failed');
    const langArg = args.find((a) => a.startsWith('--lang='));

    if (!langArg) {
        return { force, retryFailed, targetLangs: ALL_LANGS };
    }

    const rawLangs = langArg
        .replace('--lang=', '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s): s is LanguageCode => ALL_LANGS.includes(s as LanguageCode));

    return {
        force,
        retryFailed,
        targetLangs: rawLangs.length > 0 ? rawLangs : ALL_LANGS,
    };
}

export function countModuleEntries(mod: LessonModule): number {
    return mod.blocks.reduce((acc, block) => {
        if (block.type === 'vocabulary-deck') return acc + block.entries.length;
        if (block.type === 'script-matrix') return acc + block.cells.length;
        if (block.type === 'cognitive-pattern-table') return acc + block.rows.length;
        if (block.type === 'dialogue-theater') return acc + block.turns.length;
        if (block.type === 'linguistic-lore') {
            return acc + block.milestones.length + block.structuralRules.length;
        }
        if (block.type === 'rhetoric-stylistics') {
            return acc + block.devices.length + block.dialectAndSlangNotes.length;
        }
        return acc;
    }, 0);
}

async function detectProtectedCoreIds(
    lang: LanguageCode,
    coreResults: WriteModuleResult[],
    coreStartTimeMs: number,
): Promise<Set<string>> {
    const protectedIds = new Set<string>();

    for (const res of coreResults) {
        if (res.id) {
            protectedIds.add(res.id);
        }
    }

    const langModulesDir = path.join(PUBLIC_DATA_ROOT, lang, 'modules');
    try {
        const files = await fs.readdir(langModulesDir);
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const fullPath = path.join(langModulesDir, file);
            const stat = await fs.stat(fullPath);
            if (stat.mtimeMs >= coreStartTimeMs) {
                protectedIds.add(file.replace(/\.json$/i, ''));
            }
        }
    } catch {
        // Direktori belum ada
    }

    return protectedIds;
}

async function loadRetryFailedIds(): Promise<Set<string>> {
    try {
        const raw = await fs.readFile(FAILED_LOG_PATH, 'utf-8');
        const parsed = JSON.parse(raw) as FailedModuleRecord[];
        return new Set(parsed.map((item) => item.id));
    } catch {
        return new Set();
    }
}

async function generateCurriculumManifest() {
    const manifestItems: CurriculumManifestItem[] = [];

    for (const lang of ALL_LANGS) {
        const dir = path.join(PUBLIC_DATA_ROOT, lang, 'modules');
        let files: string[] = [];
        try {
            files = (await fs.readdir(dir)).filter((f: string) => f.endsWith('.json')).sort();
        } catch {
            continue;
        }

        const langModules: Array<{ file: string; parsed: LessonModule }> = [];

        for (const file of files) {
            try {
                const rawText = await fs.readFile(path.join(dir, file), 'utf-8');
                const parsed = LessonModuleSchema.parse(JSON.parse(rawText));
                langModules.push({ file, parsed });
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(`[WARN] Skipping invalid JSON in manifest scan (${file}): ${msg}`);
            }
        }

        langModules.sort((a, b) => a.parsed.order - b.parsed.order);

        langModules.forEach(({ file, parsed }, idx) => {
            const prevModule = idx > 0 ? langModules[idx - 1]?.parsed : undefined;
            manifestItems.push(
                CurriculumManifestItemSchema.parse({
                    id: parsed.id,
                    lang: parsed.lang,
                    pillar: parsed.pillar,
                    tier: parsed.tier,
                    order: parsed.order,
                    title: parsed.title,
                    subtitle: parsed.subtitle,
                    estimatedMinutes: parsed.estimatedMinutes,
                    dataPath: `/data/languages/${lang}/modules/${file}`,
                    entryCount: countModuleEntries(parsed),
                    prerequisites: prevModule ? [prevModule.id] : [],
                }),
            );
        });
    }

    const tsContent = `// AUTO-GENERATED BY scripts/build-curriculum.ts — DO NOT EDIT MANUALLY
import type { CurriculumManifestItem } from '@/features/lesson-engine/schema/lesson.schema';

export const CURRICULUM_MANIFEST: readonly CurriculumManifestItem[] = ${JSON.stringify(
        manifestItems,
        null,
        2,
    )};
`;

    await fs.mkdir(path.dirname(MANIFEST_OUTPUT_PATH), { recursive: true });
    await fs.writeFile(MANIFEST_OUTPUT_PATH, tsContent, 'utf-8');
    console.log(
        `[MANIFEST] Generated src/content/curriculum-manifest.ts (${manifestItems.length} modules registered)`,
    );
}

async function main() {
    const cliOptions = parseArgs();
    const buildOptions: BuildOptions = { force: cliOptions.force };
    const retryIds = cliOptions.retryFailed ? await loadRetryFailedIds() : undefined;

    if (cliOptions.retryFailed && (!retryIds || retryIds.size === 0)) {
        console.log('[INFO] No failed modules recorded in .veloa-etl-failed.json. Nothing to retry.');
        return;
    }

    console.log('====================================================================');
    console.log('VELOA 5-PILLAR CURRICULUM ETL PIPELINE (FAULT-TOLERANT BATCH MODE)');
    console.log(
        `  Target Languages : ${cliOptions.targetLangs.map((l: LanguageCode) => l.toUpperCase()).join(', ')}`,
    );
    console.log(
        `  Build Mode       : ${cliOptions.retryFailed
            ? `RETRY FAILED ONLY (${retryIds?.size ?? 0} modules)`
            : cliOptions.force
                ? 'FORCE REBUILD (Core Corpus Protected)'
                : 'IDEMPOTENT (Skip valid cache)'
        }`,
    );
    console.log('====================================================================\n');

    const coreBuilders: Record<LanguageCode, (opts: BuildOptions) => Promise<WriteModuleResult[]>> = {
        en: buildEnglishModules,
        zh: buildMandarinModules,
        ja: buildJapaneseModules,
        ar: buildArabicModules,
        ko: buildKoreanModules,
    };

    const allFailed: FailedModuleRecord[] = [];
    let grandTotalModules = 0;
    let grandTotalEntries = 0;

    for (const lang of cliOptions.targetLangs) {
        let coreResults: WriteModuleResult[] = [];
        const coreStartTimeMs = Date.now() - 50;

        if (!cliOptions.retryFailed) {
            try {
                coreResults = await coreBuilders[lang](buildOptions);
            } catch (err: unknown) {
                const reason = err instanceof Error ? err.message : String(err);
                console.error(`[WARN] [${lang.toUpperCase()}] Core corpus builder error: ${reason}`);
                allFailed.push({ id: `${lang}-core-corpus-batch`, lang, reason });
            }
        }

        const protectedIds = await detectProtectedCoreIds(lang, coreResults, coreStartTimeMs);

        const { results: treeResults, failed: treeFailed } = await buildExpandedTreeModules(lang, {
            force: cliOptions.force,
            ...(retryIds ? { retryOnlyIds: retryIds } : {}),
            protectedIds,
            publicDataRoot: PUBLIC_DATA_ROOT,
            srcModulesRoot: SRC_MODULES_ROOT,
        });

        allFailed.push(...treeFailed);

        const combined = [...coreResults, ...treeResults];
        const skippedCount = combined.filter((r: WriteModuleResult) => r?.skipped === true).length;
        const totalEntries = combined.reduce<number>(
            (sum: number, r: WriteModuleResult) => sum + (r?.entriesCount ?? 0),
            0,
        );

        grandTotalModules += combined.length;
        grandTotalEntries += totalEntries;

        console.log(
            `[OK] [${lang.toUpperCase()}] Completed: ${combined.length} modules (${totalEntries.toLocaleString('id-ID')} entries) | Protected core: ${protectedIds.size} | Skipped cache: ${skippedCount} | Failed: ${treeFailed.length}`,
        );
    }

    await generateCurriculumManifest();

    console.log('\n====================================================================');
    console.log(
        `[SUMMARY] Total Processed: ${grandTotalModules} modules | Total Entries: ${grandTotalEntries.toLocaleString('id-ID')}`,
    );

    if (allFailed.length > 0) {
        await fs.writeFile(FAILED_LOG_PATH, JSON.stringify(allFailed, null, 2), 'utf-8');
        console.warn(`[WARN] ${allFailed.length} module(s) failed and kept in .veloa-etl-failed.json:`);
        for (const item of allFailed) {
            console.warn(`  - [${item.lang.toUpperCase()}] ${item.id}: ${item.reason}`);
        }
        console.warn('\nRun this command to retry only failed modules:');
        console.warn('  npx tsx scripts/build-curriculum.ts --retry-failed\n');
    } else {
        await fs.rm(FAILED_LOG_PATH, { force: true });
        console.log('[DONE] All 5 language datasets succeeded with 0 failures.\n');
    }
}

main().catch((err) => {
    console.error('[FATAL] Unexpected pipeline error:', err);
    process.exit(1);
});
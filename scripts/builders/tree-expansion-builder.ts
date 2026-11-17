// scripts/builders/tree-expansion-builder.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import {
    LessonModuleSchema,
    type LanguageCode,
    type LessonModule,
} from '../../src/features/lesson-engine/schema/lesson.schema.ts';
import {
    CURRICULUM_TREES,
    type CurriculumBranch,
    type CurriculumNodeBlueprint,
    type CurriculumStageGroup,
} from '../../src/content/curriculum-tree.ts';
import { countModuleEntries, type FailedModuleRecord, type WriteModuleResult } from '../build-curriculum.ts';

interface ExpansionOptions {
    force: boolean;
    retryOnlyIds?: ReadonlySet<string>;
    publicDataRoot: string;
    srcModulesRoot: string;
}

const LANG_TRADITION_LABELS: Record<LanguageCode, string> = {
    en: 'English Structural Grammar & Lexicology',
    zh: 'Modern Standard Mandarin (Putonghua) & Sinology',
    ja: 'Japanese Morphological & Syntactic Analysis (Nihongo Bunpō)',
    ar: 'Classical & Modern Standard Arabic (An-Naḥw wa aṣ-Ṣarf)',
    ko: 'Korean Agglutinative Syntax & Honorific Pragmatics',
};

function synthesizeRichModule(
    lang: LanguageCode,
    stage: CurriculumStageGroup,
    branch: CurriculumBranch,
    bp: CurriculumNodeBlueprint,
    order: number,
): LessonModule {
    const isRtl = lang === 'ar';

    const blocks: LessonModule['blocks'] = [
        {
            type: 'cognitive-pattern-table',
            title: `${stage.stageBadge} | ${bp.title}`,
            grammaticalTradition: LANG_TRADITION_LABELS[lang],
            direction: isRtl ? 'rtl' : 'ltr',
            columns: [
                {
                    key: 'construct',
                    roleLabel: 'Konsep & Fungsi',
                    semanticColor: 'violet',
                },
                {
                    key: 'formula',
                    roleLabel: 'Rumus & Kaidah Inti',
                    semanticColor: 'amber',
                },
                {
                    key: 'example',
                    roleLabel: 'Contoh Autentik',
                    semanticColor: 'emerald',
                },
            ],
            rows: [
                {
                    id: `${bp.id}-row-1`,
                    cells: {
                        construct: {
                            script: branch.title,
                            gloss: branch.description,
                        },
                        formula: {
                            script: bp.focusFormula,
                            gloss: 'Struktur baku yang wajib dikuasai pada tahap ini',
                        },
                        example: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: bp.sampleMeaning,
                        },
                    },
                    fullTranslation: bp.sampleMeaning,
                },
                {
                    id: `${bp.id}-row-2`,
                    cells: {
                        construct: {
                            script: 'Penerapan Kontekstual',
                            gloss: `${stage.title} (${stage.stageBadge})`,
                        },
                        formula: {
                            script: `${bp.pillar.toUpperCase()} · Target ${bp.entryCount} Entri`,
                            gloss: bp.subtitle,
                        },
                        example: {
                            script: bp.sampleTarget,
                            reading: bp.sampleReading,
                            gloss: 'Perhatikan penanda fungsi dan kesesuaian register bahasa',
                        },
                    },
                    fullTranslation: `${bp.subtitle} — ${bp.sampleMeaning}`,
                },
            ],
            nativeMindset: {
                headline: `Logika Penutur Asli pada Topik "${bp.title}"`,
                psychologyExplanation: `${bp.subtitle}. Dalam kerangka ${branch.title}, penutur asli memetakan hubungan makna menggunakan rumus "${bp.focusFormula}" secara otomatis tanpa menerjemahkan kata demi kata.`,
                literalTrap:
                    'Hindari menyalin urutan kata atau imbuhan dari bahasa Indonesia secara langsung; gunakan penanda gramatikal dan register yang sesuai konteks kalimat.',
            },
        },
        {
            type: 'vocabulary-deck',
            title: `Korpus & Leksikon Kunci: ${bp.title}`,
            direction: isRtl ? 'rtl' : 'ltr',
            totalCount: 1,
            entries: [
                {
                    id: `${bp.id}-voc-1`,
                    term: bp.sampleTarget,
                    reading: bp.sampleReading,
                    meaning: bp.sampleMeaning,
                    partOfSpeech: bp.pillar,
                    patternNote: `Rumus terkait: ${bp.focusFormula}`,
                    exampleSentence: bp.sampleTarget,
                    exampleTranslation: bp.sampleMeaning,
                },
            ],
        },
    ];

    if (stage.zone === 'LITERATURE') {
        blocks.push({
            type: 'rhetoric-stylistics',
            title: `Kajian Sastra & Estetika Bahasa: ${bp.title}`,
            traditionName: LANG_TRADITION_LABELS[lang],
            direction: isRtl ? 'rtl' : 'ltr',
            overview: stage.subtitle,
            devices: [
                {
                    deviceName: branch.title,
                    nativeTerm: bp.focusFormula,
                    mechanism: bp.subtitle,
                    literaryExample: bp.sampleTarget,
                    reading: bp.sampleReading,
                    translation: bp.sampleMeaning,
                    aestheticEffect:
                        'Menghadirkan kedalaman makna, irama puitis, dan presisi stilistika tingkat lanjut.',
                },
            ],
            dialectAndSlangNotes: [],
        });
    }

    return LessonModuleSchema.parse({
        id: bp.id,
        lang,
        pillar: bp.pillar,
        tier: stage.legacyTier,
        order,
        title: bp.title,
        subtitle: bp.subtitle,
        estimatedMinutes: bp.estimatedMinutes,
        blocks,
    });
}

export async function buildExpandedTreeModules(
    lang: LanguageCode,
    options: ExpansionOptions,
): Promise<{ results: WriteModuleResult[]; failed: FailedModuleRecord[] }> {
    const tree = CURRICULUM_TREES[lang];
    const allStages: CurriculumStageGroup[] = [
        ...tree.foundationStages,
        ...tree.dictionaryStages,
        ...tree.progressionStages,
        ...tree.literatureStages,
    ];

    const publicOutDir = path.join(options.publicDataRoot, lang, 'modules');
    await fs.mkdir(publicOutDir, { recursive: true });
    await fs.mkdir(options.srcModulesRoot, { recursive: true });

    const results: WriteModuleResult[] = [];
    const failed: FailedModuleRecord[] = [];
    let orderCounter = 100;

    for (const stage of allStages) {
        for (const branch of stage.branches) {
            for (const bp of branch.modules) {
                orderCounter += 1;

                if (options.retryOnlyIds && !options.retryOnlyIds.has(bp.id)) {
                    continue;
                }

                const filename = `${bp.id}.json`;
                const publicFilePath = path.join(publicOutDir, filename);
                const srcFilePath = path.join(options.srcModulesRoot, filename);

                try {
                    if (!options.force && !options.retryOnlyIds) {
                        try {
                            const existingRaw = await fs.readFile(srcFilePath, 'utf-8');
                            const parsedExisting = LessonModuleSchema.parse(JSON.parse(existingRaw));
                            results.push({
                                skipped: true,
                                entriesCount: countModuleEntries(parsedExisting),
                            });
                            continue;
                        } catch {
                            // Belum ada atau perlu dibuat ulang
                        }
                    }

                    const mod = synthesizeRichModule(lang, stage, branch, bp, orderCounter);
                    const serialized = JSON.stringify(mod, null, 2);

                    await Promise.all([
                        fs.writeFile(publicFilePath, serialized, 'utf-8'),
                        fs.writeFile(srcFilePath, serialized, 'utf-8'),
                    ]);

                    results.push({
                        skipped: false,
                        entriesCount: countModuleEntries(mod),
                    });
                } catch (err: unknown) {
                    const reason = err instanceof Error ? err.message : String(err);
                    console.error(`  [WARN] Failed module ${bp.id}: ${reason}`);
                    failed.push({ id: bp.id, lang, reason });
                }
            }
        }
    }

    return { results, failed };
}
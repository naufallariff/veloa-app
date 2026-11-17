// src/features/lesson-engine/services/module-loader.ts
import {
    LessonModuleSchema,
    type CurriculumManifestItem,
    type LanguageCode,
    type LessonModule,
} from '../schema/lesson.schema';
import {
    getAllTreeBlueprints,
    getExpandedCurriculumManifest,
} from '@/content/curriculum-tree';

/**
 * Memuat seluruh file JSON modul secara lazy (code-splitting otomatis oleh Vite)
 * tanpa hardcode nama file satu per satu.
 */
const MODULE_JSON_LOADERS = import.meta.glob<Record<string, unknown>>(
    '/src/content/modules/*.json',
);

/**
 * Peta penghubung antara ID node di pohon kurikulum baru dengan file JSON kaya
 * yang sudah tersedia di src/content/modules/.
 */
const BLUEPRINT_TO_EXISTING_JSON_FILE: Readonly<Record<string, string>> = {
    // English
    'en-00-found-origin-history-phonetics': 'en-00-found-origin-history-phonetics.json',
    'en-01-beg-grammar-core': 'en-02-beg-grammar-present-system.json',
    'en-02-beg-present-routine': 'en-02-beg-grammar-present-system.json',
    'en-03-beg-grammar-past-system': 'en-03-beg-grammar-past-system.json',
    'en-a2-future-forms': 'en-04-inter-grammar-future-system.json',
    'en-04-int-present-perfect-bridge': 'en-04-inter-grammar-future-system.json',
    'en-b1-conditionals-1-2': 'en-05-inter-grammar-conditionals.json',
    'en-b2-conditionals-3-mixed': 'en-05-inter-grammar-conditionals.json',
    'en-05-adv-inversion-cleft': 'en-06-adv-grammar-passive-inversion-subjunctive.json',
    'en-b1-passive-voice': 'en-06-adv-grammar-passive-inversion-subjunctive.json',
    'en-c1-subjunctive-mandative': 'en-06-adv-grammar-passive-inversion-subjunctive.json',
    'en-dict-vocab-daily': 'en-07-beg-lexicon-cefr-a1-a2.json',
    'en-dict-vocab-work': 'en-08-inter-lexicon-cefr-b1-b2.json',
    'en-dict-vocab-phrasal': 'en-09-adv-lexicon-cefr-c1-c2.json',
    'en-lit-01-old-middle': 'en-10-native-rhetoric-stylistics-varieties.json',
    'en-lit-02-shakespeare': 'en-10-native-rhetoric-stylistics-varieties.json',
    'en-lit-03-stylistics-tropes': 'en-10-native-rhetoric-stylistics-varieties.json',

    // Japanese
    'ja-00-found-origin-three-scripts': 'ja-00-found-origin-three-scripts.json',
    'ja-00-found-katakana': 'ja-00-found-origin-three-scripts.json',
    'ja-00-found-hiragana': 'ja-00-found-origin-three-scripts.json',
    'ja-00-found-kanji-radicals': 'ja-04-beg-script-joyo-kanji-full.json',
    'ja-00-found-pitch-accent': 'ja-01-found-phonetics-mora-pitch.json',
    'ja-01-beg-syntax-particles': 'ja-02-beg-grammar-core-particles.json',
    'ja-n5-part-space-object': 'ja-02-beg-grammar-core-particles.json',
    'ja-n5-verb-groups-masu': 'ja-03-beg-grammar-katsuyo-conjugation.json',
    'ja-n5-te-form-adjectives': 'ja-03-beg-grammar-katsuyo-conjugation.json',
    'ja-n4-plain-forms': 'ja-03-beg-grammar-katsuyo-conjugation.json',
    'ja-n4-potential-volitional': 'ja-05-inter-grammar-voice-conditionals.json',
    'ja-n3-passive-causative': 'ja-05-inter-grammar-voice-conditionals.json',
    'ja-02-int-keigo-register': 'ja-06-adv-grammar-keigo-n1.json',
    'ja-n2-formal-connectors': 'ja-06-adv-grammar-keigo-n1.json',
    'ja-n1-mastery-nuance': 'ja-06-adv-grammar-keigo-n1.json',
    'ja-dict-vocab-n5-core': 'ja-07-beg-lexicon-jlpt-n5-n4.json',
    'ja-dict-vocab-onomatopoeia': 'ja-08-inter-lexicon-jlpt-n3-n2.json',
    'ja-dict-sent-daily': 'ja-07-beg-lexicon-jlpt-n5-n4.json',
    'ja-dict-sent-restaurant': 'ja-08-inter-lexicon-jlpt-n3-n2.json',
    'ja-dict-conv-casual-polite': 'ja-09-adv-lexicon-jlpt-n1.json',
    'ja-lit-01-bungo-grammar': 'ja-11-native-rhetoric-shujigaku-dialects.json',
    'ja-lit-02-waka-haiku': 'ja-11-native-rhetoric-shujigaku-dialects.json',

    // Mandarin
    'zh-00-found-origin-characters': 'zh-00-found-origin-hanzi-anatomy.json',
    'zh-00-found-liushu-composition': 'zh-00-found-origin-hanzi-anatomy.json',
    'zh-00-found-kangxi-radicals': 'zh-00-found-origin-hanzi-anatomy.json',
    'zh-01-found-phonetics-pinyin-tones': 'zh-01-found-phonetics-pinyin-tones.json',
    'zh-02-beg-sentence-order': 'zh-02-beg-grammar-core-sentences.json',
    'zh-hsk12-particles-de': 'zh-02-beg-grammar-core-sentences.json',
    'zh-03-int-aspect-particles': 'zh-03-beg-grammar-aspect-particles.json',
    'zh-hsk34-ba-bei-constructions': 'zh-04-inter-grammar-ba-bei-complements.json',
    'zh-hsk56-formal-register': 'zh-05-adv-grammar-shumianyu-formal.json',
    'zh-hsk56-chengyu-core': 'zh-08-adv-lexicon-hsk5-6-cedict.json',
    'zh-dict-vocab-hsk12': 'zh-06-beg-lexicon-hsk1-2.json',
    'zh-dict-vocab-hsk34': 'zh-07-inter-lexicon-hsk3-4.json',
    'zh-dict-sent-daily': 'zh-06-beg-lexicon-hsk1-2.json',
    'zh-dict-conv-daily': 'zh-07-inter-lexicon-hsk3-4.json',
    'zh-lit-01-wenyanwen': 'zh-09-native-rhetoric-xiucixue-dialects.json',
    'zh-lit-02-tang-poetry': 'zh-09-native-rhetoric-xiucixue-dialects.json',

    // Arabic
    'ar-00-found-origin-abjad': 'ar-00-found-origin-hijaiyyah-harakat.json',
    'ar-00-found-hijaiyah-makharij': 'ar-01-found-phonetics-makharij.json',
    'ar-00-found-harakat-tajwid': 'ar-00-found-origin-hijaiyyah-harakat.json',
    'ar-01-beg-nahw-nominals': 'ar-02-beg-nahwu-core-sentences.json',
    'ar-asasi-nahw-jumla': 'ar-02-beg-nahwu-core-sentences.json',
    'ar-02-beg-sarf-patterns': 'ar-03-beg-sarf-tasrif-lughawi.json',
    'ar-asasi-sarf-mushtaqqat': 'ar-05-inter-sarf-musytaq-awzan.json',
    'ar-mutawassit-sarf-10forms': 'ar-05-inter-sarf-musytaq-awzan.json',
    'ar-mutawassit-nahw-nawasikh': 'ar-04-inter-nahwu-irab-nawasikh.json',
    'ar-mutaqaddim-mansubat': 'ar-06-adv-nahwu-sarf-advanced.json',
    'ar-mutaqaddim-gundul': 'ar-06-adv-nahwu-sarf-advanced.json',
    'ar-dict-vocab-roots': 'ar-05-beg-lexicon-a1-a2.json',
    'ar-dict-sent-daily': 'ar-06-inter-lexicon-b1-b2.json',
    'ar-dict-conv-hiwar': 'ar-07-adv-lexicon-c1-c2.json',
    'ar-lit-01-balaghah': 'ar-08-native-rhetoric-balaghah-dialects.json',
    'ar-lit-02-arud-muallaqat': 'ar-08-native-rhetoric-balaghah-dialects.json',

    // Korean
    'ko-00-found-origin-hangeul': 'ko-00-found-origin-hangeul-engineering.json',
    'ko-00-found-syllable-blocks': 'ko-00-found-origin-hangeul-engineering.json',
    'ko-01-found-phonetics-batchim-rules': 'ko-01-found-phonetics-batchim-rules.json',
    'ko-02-beg-particles-speech-levels': 'ko-02-beg-grammar-core-particles.json',
    'ko-topik1-tenses-connectors': 'ko-03-beg-grammar-conjugation-tenses.json',
    'ko-topik2-honorific-system': 'ko-05-adv-grammar-honorifics-indirect.json',
    'ko-topik2-indirect-quotation': 'ko-04-inter-grammar-irregulars-connectors.json',
    'ko-topik2-adv-grammar': 'ko-05-adv-grammar-honorifics-indirect.json',
    'ko-dict-vocab-topik1': 'ko-06-beg-lexicon-topik1.json',
    'ko-dict-sent-daily': 'ko-07-inter-lexicon-topik2-mid.json',
    'ko-dict-conv-daily': 'ko-08-adv-lexicon-topik2-high.json',
    'ko-lit-01-sijo-gasa': 'ko-09-native-rhetoric-susabeop-dialects.json',
    'ko-lit-02-middle-korean': 'ko-09-native-rhetoric-susabeop-dialects.json',
};

export class ModuleLoadError extends Error {
    public readonly code: 'NOT_FOUND' | 'VALIDATION_FAILED' | 'ABORTED';
    public readonly moduleId: string;

    constructor(
        code: 'NOT_FOUND' | 'VALIDATION_FAILED' | 'ABORTED',
        moduleId: string,
        message: string,
    ) {
        super(message);
        this.name = 'ModuleLoadError';
        this.code = code;
        this.moduleId = moduleId;
    }
}

const validatedModuleCache = new Map<string, LessonModule>();
const EXPANDED_MANIFEST = getExpandedCurriculumManifest();
const BLUEPRINT_INDEX = new Map(
    getAllTreeBlueprints().map((item) => [item.blueprint.id, item]),
);

function buildFallbackLoreModule(moduleId: string): LessonModule | null {
    const entry = BLUEPRINT_INDEX.get(moduleId);
    if (!entry) return null;

    const { lang, stage, branch, blueprint } = entry;
    const manifestItem = getManifestItemById(moduleId);
    const isRtl = lang === 'ar';

    const fallback: LessonModule = {
        id: blueprint.id,
        lang,
        tier: stage.legacyTier,
        pillar: blueprint.pillar,
        order: manifestItem?.order ?? 1, // <-- Tambahkan baris ini
        title: blueprint.title,
        subtitle: blueprint.subtitle,
        estimatedMinutes: blueprint.estimatedMinutes,
        blocks: [
            {
                type: 'linguistic-lore',
                title: `${stage.stageBadge} — ${branch.title}`,
                eraOrDomain: `${blueprint.focusFormula} · ${stage.title}`,
                direction: isRtl ? 'rtl' : 'ltr',
                narrativeSummary: `${blueprint.subtitle}. Cabang ${branch.title} berfokus pada ${branch.description.toLowerCase()}.`,
                milestones: [
                    {
                        stage: 'Rumus & Struktur Inti',
                        scriptSample: blueprint.sampleTarget,
                        reading: blueprint.sampleReading,
                        explanation: `${blueprint.sampleMeaning} — Pola: ${blueprint.focusFormula}`,
                    },
                ],
                structuralRules: [],
                funFactsAndTips: [
                    `Rumus Utama: ${blueprint.focusFormula}`,
                    `Contoh Kunci: ${blueprint.sampleTarget} (${blueprint.sampleReading}) — ${blueprint.sampleMeaning}`,
                    `Target Penguasaan Modul: ${blueprint.entryCount} entri terkurasi`,
                ],
            },
        ],
    };

    return LessonModuleSchema.parse(fallback);
}

export function getCurriculumManifest(): readonly CurriculumManifestItem[] {
    return EXPANDED_MANIFEST;
}

export function getManifestByLanguage(lang: LanguageCode): readonly CurriculumManifestItem[] {
    return EXPANDED_MANIFEST.filter((item) => item.lang === lang);
}

export function getManifestItemById(moduleId: string): CurriculumManifestItem | undefined {
    return EXPANDED_MANIFEST.find((item) => item.id === moduleId);
}

export function getAdjacentModules(moduleId: string): {
    previous: CurriculumManifestItem | null;
    next: CurriculumManifestItem | null;
} {
    const current = getManifestItemById(moduleId);
    if (!current) return { previous: null, next: null };

    const sameLangModules = getManifestByLanguage(current.lang);
    const idx = sameLangModules.findIndex((item) => item.id === moduleId);

    return {
        previous: idx > 0 ? (sameLangModules[idx - 1] ?? null) : null,
        next:
            idx >= 0 && idx < sameLangModules.length - 1
                ? (sameLangModules[idx + 1] ?? null)
                : null,
    };
}

export async function loadLessonModule(
    moduleId: string,
    signal?: AbortSignal,
): Promise<LessonModule> {
    if (signal?.aborted) {
        throw new ModuleLoadError('ABORTED', moduleId, `Pemuatan modul "${moduleId}" dibatalkan.`);
    }

    const cached = validatedModuleCache.get(moduleId);
    if (cached) {
        return cached;
    }

    const mappedFilename =
        BLUEPRINT_TO_EXISTING_JSON_FILE[moduleId] ?? `${moduleId}.json`;
    const loader = MODULE_JSON_LOADERS[`/src/content/modules/${mappedFilename}`];

    if (loader) {
        const rawMod = await loader();
        const rawJson = 'default' in rawMod ? rawMod.default : rawMod;
        const parsed = LessonModuleSchema.safeParse(rawJson);

        if (!parsed.success) {
            throw new ModuleLoadError(
                'VALIDATION_FAILED',
                moduleId,
                `Skema modul "${moduleId}" gagal validasi: ${parsed.error.issues[0]?.message ?? 'Invalid schema'}`,
            );
        }

        const adapted: LessonModule = {
            ...parsed.data,
            id: moduleId,
        };

        validatedModuleCache.set(moduleId, adapted);
        return adapted;
    }

    const synthesized = buildFallbackLoreModule(moduleId);
    if (!synthesized) {
        throw new ModuleLoadError(
            'NOT_FOUND',
            moduleId,
            `Modul "${moduleId}" tidak ditemukan di dalam pohon kurikulum.`,
        );
    }

    validatedModuleCache.set(moduleId, synthesized);
    return synthesized;
}

export function prefetchLessonModule(moduleId: string): void {
    if (validatedModuleCache.has(moduleId)) return;
    void loadLessonModule(moduleId).catch(() => { });
}
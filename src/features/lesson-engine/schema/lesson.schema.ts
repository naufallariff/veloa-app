// src/features/lesson-engine/schema/lesson.schema.ts
import { z } from 'zod';

export const LanguageCodeSchema = z.enum(['en', 'zh', 'ja', 'ar', 'ko']);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const DirectionSchema = z.enum(['ltr', 'rtl']);
export type TextDirection = z.infer<typeof DirectionSchema>;

export const LearningPillarSchema = z.enum([
    'phonetics',
    'script',
    'morphology',
    'syntax',
    'lexicon-dialogue',
]);
export type LearningPillar = z.infer<typeof LearningPillarSchema>;

export const RoadmapTierSchema = z.enum([
    'foundation',    // Tier 0: Sejarah, Asal Aksara, Anatomi Huruf, Guratan & Fonetik Dasar
    'beginner',      // Tier 1: Perakitan Kalimat Dasar & Kosakata Inti
    'intermediate',  // Tier 2: Klausa Kompleks, Morfologi Lanjut & Nuansa Konteks
    'advanced',      // Tier 3: Bahasa Tulis Formal, Akademik & Jurnalistik
    'native',        // Tier 4: Dialek, Tradisi, Slang & Ilmu Retorika (Balaghah/Xiucixue/Shujigaku/Susabeop)
]);
export type RoadmapTier = z.infer<typeof RoadmapTierSchema>;

export const ScriptCellSchema = z.object({
    glyph: z.string(),
    reading: z.string(),
    transliteration: z.string(),
    componentRole: z.string().optional(),     // Misal: "Bùshǒu (Radikal)", "Piānpáng (Komponen Sisi)", "Jamo Vokal"
    strokeOrderRule: z.string().optional(),   // Misal: "1. Horizontal (横) → 2. Vertikal (竖)"
    arabicForms: z
        .object({
            isolated: z.string(),
            initial: z.string(),
            medial: z.string(),
            final: z.string(),
        })
        .optional(),
    tone: z.number().int().min(1).max(5).optional(),
    strokeCount: z.number().int().positive().optional(),
    mnemonic: z.string().optional(),
});

export const ScriptMatrixBlockSchema = z.object({
    type: z.literal('script-matrix'),
    title: z.string(),
    scriptSystem: z.string(),
    direction: DirectionSchema.default('ltr'),
    description: z.string(),
    cells: z.array(ScriptCellSchema).min(1),
});

export const LinguisticLoreBlockSchema = z.object({
    type: z.literal('linguistic-lore'),
    title: z.string(),
    eraOrDomain: z.string(), // Misal: "Dinasti Shang (1200 SM) — Evolusi Jiǎgǔwén" atau "Diglosia Arab: Fuṣḥā vs 'Āmmiyyah"
    direction: DirectionSchema.default('ltr'),
    narrativeSummary: z.string(),
    milestones: z.array(
        z.object({
            stage: z.string(),
            scriptSample: z.string(),
            reading: z.string().optional(),
            explanation: z.string(),
        }),
    ),
    structuralRules: z.array(
        z.object({
            conceptName: z.string(),     // Misal: "Bǐhuà (笔画)", "Piānpáng (偏旁)", "Cheon-Ji-In (천지인)"
            definition: z.string(),
            whyItMatters: z.string(),
            examples: z.array(z.string()),
        }),
    ),
    funFactsAndTips: z.array(z.string()),
});

export const RhetoricStylisticsBlockSchema = z.object({
    type: z.literal('rhetoric-stylistics'),
    title: z.string(),
    traditionName: z.string(), // Misal: "Ilmu Balāghah (علم البلاغة)", "Xiūcíxué (修辞学)", "Shūjigaku (修辞学)", "Susabeop (수사법)"
    direction: DirectionSchema.default('ltr'),
    overview: z.string(),
    devices: z.array(
        z.object({
            deviceName: z.string(),
            nativeTerm: z.string(),
            mechanism: z.string(),
            literaryExample: z.string(),
            reading: z.string().optional(),
            translation: z.string(),
            aestheticEffect: z.string(),
        }),
    ),
    dialectAndSlangNotes: z.array(
        z.object({
            varietyName: z.string(),     // Misal: "'Āmmiyyah Mesir", "Kansai-ben", "Fántǐzì Taiwan", "Slang MZ Korea"
            regionOrContext: z.string(),
            sampleExpression: z.string(),
            standardEquivalent: z.string(),
            meaning: z.string(),
        }),
    ),
});

export const CognitivePatternTableBlockSchema = z.object({
    type: z.literal('cognitive-pattern-table'),
    title: z.string(),
    grammaticalTradition: z.string(),
    direction: DirectionSchema.default('ltr'),
    columns: z.array(
        z.object({
            key: z.string(),
            roleLabel: z.string(),
            semanticColor: z.enum(['cyan', 'violet', 'amber', 'emerald', 'rose']),
        }),
    ),
    rows: z.array(
        z.object({
            id: z.string(),
            cells: z.record(
                z.string(),
                z.object({
                    script: z.string(),
                    reading: z.string().optional(),
                    gloss: z.string(),
                }),
            ),
            fullTranslation: z.string(),
            nuanceNote: z.string().optional(),
        }),
    ),
    nativeMindset: z.object({
        headline: z.string(),
        psychologyExplanation: z.string(),
        literalTrap: z.string(),
    }),
});

export const DialogueTheaterBlockSchema = z.object({
    type: z.literal('dialogue-theater'),
    title: z.string(),
    contextSituation: z.string(),
    registerLevel: z.string(),
    direction: DirectionSchema.default('ltr'),
    turns: z.array(
        z.object({
            speaker: z.string(),
            line: z.string(),
            reading: z.string(),
            translation: z.string(),
            grammarHighlight: z.string().optional(),
        }),
    ),
});

export const VocabularyEntrySchema = z.object({
    id: z.string(),
    term: z.string(),
    reading: z.string(),
    meaning: z.string(),
    partOfSpeech: z.string(),
    patternNote: z.string().optional(),
    exampleSentence: z.string().optional(),
    exampleTranslation: z.string().optional(),
});

export const VocabularyDeckBlockSchema = z.object({
    type: z.literal('vocabulary-deck'),
    title: z.string(),
    direction: DirectionSchema.default('ltr'),
    totalCount: z.number().int().positive(),
    entries: z.array(VocabularyEntrySchema).min(1),
});

export const LessonBlockSchema = z.discriminatedUnion('type', [
    ScriptMatrixBlockSchema,
    LinguisticLoreBlockSchema,
    RhetoricStylisticsBlockSchema,
    CognitivePatternTableBlockSchema,
    DialogueTheaterBlockSchema,
    VocabularyDeckBlockSchema,
]);
export type LessonBlock = z.infer<typeof LessonBlockSchema>;

export const LessonModuleSchema = z.object({
    id: z.string(),
    lang: LanguageCodeSchema,
    pillar: LearningPillarSchema,
    tier: RoadmapTierSchema,
    order: z.number().int().positive(),
    title: z.string(),
    subtitle: z.string(),
    estimatedMinutes: z.number().int().positive(),
    blocks: z.array(LessonBlockSchema).min(1),
});
export type LessonModule = z.infer<typeof LessonModuleSchema>;

export const CurriculumManifestItemSchema = z.object({
    id: z.string(),
    lang: LanguageCodeSchema,
    pillar: LearningPillarSchema,
    tier: RoadmapTierSchema,
    order: z.number().int().positive(),
    title: z.string(),
    subtitle: z.string(),
    estimatedMinutes: z.number().int().positive(),
    dataPath: z.string(),
    entryCount: z.number().int().nonnegative(),
    prerequisites: z.array(z.string()),
});
export type CurriculumManifestItem = z.infer<typeof CurriculumManifestItemSchema>;
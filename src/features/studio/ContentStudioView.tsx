// src/features/studio/ContentStudioView.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    Code2,
    Compass,
    Copy,
    Download,
    Eye,
    FilePlus2,
    Layers,
    Loader2,
    MessageSquareQuote,
    Plus,
    RotateCcw,
    Save,
    Search,
    Send,
    Sparkles,
    Trash2,
    Upload,
    Wand2,
} from 'lucide-react';
import {
    LessonModuleSchema,
    type LanguageCode,
    type LearningPillar,
    type LessonBlock,
    type LessonModule,
    type RoadmapTier,
} from '@/features/lesson-engine/schema/lesson.schema';
import {
    getAllCloudModuleRecords,
    getCurriculumManifest,
    invalidateModuleCache,
    loadBaseStaticModule,
    loadLessonModule,
    syncCloudCurriculumOverrides,
} from '@/features/lesson-engine/services/module-loader';
import { VeloaGuideBanner } from '@/features/lesson-engine/components/VeloaGuideBanner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';

interface ContentStudioViewProps {
    onPreviewModule: (moduleId: string) => void;
}

type StudioEditorTab = 'PERSONA' | 'BLOCKS' | 'JSON';
type ModuleStatusFilter = 'ALL' | 'PUBLISHED' | 'DRAFT' | 'DEFAULT';

const LANG_OPTIONS: Array<{
    code: LanguageCode;
    shortCode: string;
    label: string;
    native: string;
    framework: string;
}> = [
        { code: 'en', shortCode: 'EN', label: 'English', native: 'English', framework: 'CEFR A1–C2' },
        { code: 'zh', shortCode: 'ZH', label: 'Mandarin', native: '普通话', framework: 'HSK 1–6' },
        { code: 'ja', shortCode: 'JA', label: 'Jepang', native: '日本語', framework: 'JLPT N5–N1' },
        { code: 'ar', shortCode: 'AR', label: 'Arab', native: 'العربية', framework: 'Naḥwu & CEFR' },
        { code: 'ko', shortCode: 'KO', label: 'Korea', native: '한국어', framework: 'TOPIK I–II' },
    ];

const PILLAR_OPTIONS: Array<{ value: LearningPillar; label: string; hint: string }> = [
    { value: 'phonetics', label: 'Phonetics', hint: 'Pelafalan, bunyi, intonasi & IPA' },
    { value: 'script', label: 'Script & Orthography', hint: 'Aksara, goresan, radikal & ejaan' },
    { value: 'morphology', label: 'Morphology', hint: 'Pembentukan kata, imbuhan & konjugasi' },
    { value: 'syntax', label: 'Syntax & Grammar', hint: 'Struktur kalimat, partikel & tenses' },
    {
        value: 'lexicon-dialogue',
        label: 'Lexicon & Dialogue',
        hint: 'Kosakata tematik, idiom & percakapan',
    },
];

const TIER_OPTIONS: Array<{ value: RoadmapTier; label: string; hint: string }> = [
    { value: 'foundation', label: 'Foundation', hint: 'Akar sejarah, aksara & fonetik dasar' },
    { value: 'beginner', label: 'Beginner (A1–A2)', hint: 'Struktur dasar & komunikasi esensial' },
    { value: 'intermediate', label: 'Intermediate (B1–B2)', hint: 'Nuansa, klausa & percakapan aktif' },
    { value: 'advanced', label: 'Advanced (C1–C2)', hint: 'Wacana formal, sastra & presisi tinggi' },
    { value: 'native', label: 'Native Mastery', hint: 'Idiom, kolokasi & ekspresi penutur asli' },
];

/* ============================================================================
   REUSABLE STYLED SELECT DROPDOWN (PENGGANTI <select> NATIVE BROWSER)
   ============================================================================ */
interface StudioSelectOption<T extends string> {
    value: T;
    label: string;
    badge?: string;
    description?: string;
}

function StudioStyledSelect<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label?: string;
    value: T;
    options: Array<StudioSelectOption<T>>;
    onChange: (nextValue: T) => void;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const selected = options.find((opt) => opt.value === value) ?? options[0]!;

    useEffect(() => {
        if (!open) return;
        const handleOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        window.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            window.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="mb-1.5 block text-xs font-extrabold text-(--text-primary)">
                    {label}
                </label>
            )}
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-start text-xs font-bold text-(--text-primary) transition-colors hover:border-(--accent-primary) focus:border-(--accent-primary) focus:outline-none"
            >
                <span className="flex min-w-0 items-center gap-2">
                    {selected.badge && (
                        <span className="shrink-0 rounded bg-(--accent-primary-soft) px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-(--accent-primary)">
                            {selected.badge}
                        </span>
                    )}
                    <span className="truncate">{selected.label}</span>
                </span>
                <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-(--text-muted) transition-transform ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {open && (
                <div
                    role="listbox"
                    className="veloa-surface-card absolute inset-x-0 z-40 mt-1.5 max-h-64 overflow-y-auto border border-(--border-strong) p-1.5 shadow-xl"
                >
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-start transition-colors ${isSelected
                                        ? 'bg-(--accent-primary-soft) text-(--accent-primary)'
                                        : 'text-(--text-primary) hover:bg-(--surface-elevated)'
                                    }`}
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-xs font-bold">
                                        {opt.badge && (
                                            <span className="font-mono text-[10px] font-extrabold">
                                                {opt.badge}
                                            </span>
                                        )}
                                        <span className="truncate">{opt.label}</span>
                                    </div>
                                    {opt.description && (
                                        <p className="mt-0.5 text-[10px] leading-snug text-(--text-muted)">
                                            {opt.description}
                                        </p>
                                    )}
                                </div>
                                {isSelected && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function createStarterModule(lang: LanguageCode, order: number): LessonModule {
    const slug = `${lang}-custom-${Date.now().toString(36)}`;
    const isRtl = lang === 'ar';
    return {
        id: slug,
        lang,
        pillar: 'lexicon-dialogue',
        tier: 'beginner',
        order,
        title: 'Modul Baru Kurasi Veloa',
        subtitle: 'Penguasaan pola kalimat kontekstual dan dialog kehidupan nyata',
        estimatedMinutes: 12,
        veloaGuide: {
            intro:
                'Dalam komunikasi nyata, penutur asli jarang menerjemahkan kalimat kata demi kata. Bab ini membedah logika di balik struktur kalimat agar Anda dapat menyusun ungkapan secara alami.',
            culturalContext: 'Situasi Sehari-hari · Register Sopan & Natural',
            fieldNote:
                'Perhatikan penanda konteks dan tingkat kesopanan sebelum memilih kosakata akhir.',
            outro:
                'Anda telah menuntaskan seluruh pola pada bab ini. Lanjutkan ke bab berikutnya untuk memperluas variasi kalimat.',
        },
        blocks: [
            {
                type: 'linguistic-lore',
                title: 'Peta Konsep & Logika Struktur',
                eraOrDomain: 'Fondasi Konteks & Pemakaian',
                direction: isRtl ? 'rtl' : 'ltr',
                narrativeSummary:
                    'Uraian konseptual mengenai cara kerja pola kalimat ini dalam situasi formal maupun kasual.',
                milestones: [
                    {
                        stage: 'Pola Inti',
                        scriptSample: 'Contoh Frasa Target',
                        reading: 'Transliterasi / Cara Baca',
                        explanation: 'Makna alami dan kapan frasa ini tepat digunakan.',
                    },
                ],
                structuralRules: [],
                funFactsAndTips: [
                    'Gunakan konteks lawan bicara sebelum menentukan tingkat kesopanan.',
                ],
            },
            {
                type: 'vocabulary-deck',
                title: 'Dek Kosakata Kunci',
                direction: isRtl ? 'rtl' : 'ltr',
                totalCount: 1,
                entries: [
                    {
                        id: `${slug}-v1`,
                        term: 'Kata Kunci 1',
                        reading: 'cara-baca',
                        meaning: 'Arti dalam Bahasa Indonesia',
                        partOfSpeech: 'noun',
                        patternNote: 'Catatan pemakaian singkat',
                        exampleSentence: 'Contoh kalimat lengkap.',
                        exampleTranslation: 'Terjemahan kalimat lengkap.',
                    },
                ],
            },
        ],
    };
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ onPreviewModule }) => {
    const { user } = useAuth();
    const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<ModuleStatusFilter>('ALL');
    const [activeEditorTab, setActiveEditorTab] = useState<StudioEditorTab>('PERSONA');

    const [draftModule, setDraftModule] = useState<LessonModule | null>(null);
    const [rawJsonText, setRawJsonText] = useState<string>('');
    const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
    const [copiedJson, setCopiedJson] = useState<boolean>(false);

    const [isLoadingModule, setIsLoadingModule] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [statusBanner, setStatusBanner] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [cloudVersionTick, setCloudVersionTick] = useState<number>(0);

    useEffect(() => {
        void (async () => {
            await syncCloudCurriculumOverrides();
            setCloudVersionTick((t) => t + 1);
        })();
    }, []);

    const cloudRecordsMap = useMemo(() => {
        void cloudVersionTick;
        return new Map(getAllCloudModuleRecords().map((r) => [r.id, r]));
    }, [cloudVersionTick]);

    const moduleList = useMemo(() => {
        void cloudVersionTick;
        const baseList = getCurriculumManifest().filter((m) => m.lang === selectedLang);
        const ids = new Set(baseList.map((m) => m.id));

        const draftExtras = getAllCloudModuleRecords()
            .filter((r) => r.module.lang === selectedLang && !ids.has(r.id))
            .map((r) => ({
                id: r.module.id,
                lang: r.module.lang,
                pillar: r.module.pillar,
                tier: r.module.tier,
                order: r.module.order,
                title: r.module.title,
                subtitle: r.module.subtitle,
                estimatedMinutes: r.module.estimatedMinutes,
                dataPath: `cloud://${r.module.id}`,
                entryCount: r.module.blocks.length * 6,
                prerequisites: [],
            }));

        const combined = [...baseList, ...draftExtras].sort((a, b) => a.order - b.order);
        const q = searchQuery.trim().toLowerCase();

        return combined.filter((m) => {
            const cloudInfo = cloudRecordsMap.get(m.id);
            if (statusFilter === 'PUBLISHED' && !cloudInfo?.isPublished) return false;
            if (statusFilter === 'DRAFT' && (!cloudInfo || cloudInfo.isPublished)) return false;
            if (statusFilter === 'DEFAULT' && cloudInfo) return false;

            if (!q) return true;
            return (
                m.id.toLowerCase().includes(q) ||
                m.title.toLowerCase().includes(q) ||
                m.subtitle.toLowerCase().includes(q)
            );
        });
    }, [selectedLang, searchQuery, statusFilter, cloudVersionTick, cloudRecordsMap]);

    const selectModuleForEditing = useCallback(async (moduleId: string) => {
        setIsLoadingModule(true);
        setStatusBanner(null);
        setJsonValidationError(null);
        try {
            const loaded = await loadLessonModule(moduleId);
            const normalized: LessonModule = {
                ...loaded,
                veloaGuide: loaded.veloaGuide ?? {
                    intro: '',
                    culturalContext: '',
                    fieldNote: '',
                    outro: '',
                },
            };
            setDraftModule(normalized);
            setRawJsonText(JSON.stringify(normalized, null, 2));
        } catch (err) {
            setStatusBanner({
                type: 'error',
                message: err instanceof Error ? err.message : 'Gagal memuat modul.',
            });
        } finally {
            setIsLoadingModule(false);
        }
    }, []);

    useEffect(() => {
        const first = moduleList[0];
        if (first && (!draftModule || draftModule.lang !== selectedLang)) {
            void selectModuleForEditing(first.id);
        }
    }, [selectedLang, moduleList, draftModule, selectModuleForEditing]);

    const applyModuleMutation = useCallback((updater: (prev: LessonModule) => LessonModule) => {
        setDraftModule((prev) => {
            if (!prev) return prev;
            const next = updater(prev);
            setRawJsonText(JSON.stringify(next, null, 2));
            setJsonValidationError(null);
            return next;
        });
    }, []);

    const handleCreateNewModule = () => {
        const nextOrder = moduleList.length + 1;
        const fresh = createStarterModule(selectedLang, nextOrder);
        setDraftModule(fresh);
        setRawJsonText(JSON.stringify(fresh, null, 2));
        setJsonValidationError(null);
        setActiveEditorTab('PERSONA');
        setStatusBanner({
            type: 'success',
            message: `Draf modul baru "${fresh.id}" siap dirancang. Lengkapi narasi & blok lalu klik Simpan Draf atau Publikasikan.`,
        });
    };

    const handleRawJsonChange = (value: string) => {
        setRawJsonText(value);
        try {
            const parsedObj: unknown = JSON.parse(value);
            const result = LessonModuleSchema.safeParse(parsedObj);
            if (!result.success) {
                const firstIssue = result.error.issues[0];
                setJsonValidationError(
                    `Validasi Skema (${firstIssue?.path.join('.') || 'root'}): ${firstIssue?.message ?? 'Struktur tidak sesuai'}`,
                );
            } else {
                setJsonValidationError(null);
                setDraftModule(result.data);
            }
        } catch (err) {
            setJsonValidationError(
                `Syntax JSON Error: ${err instanceof Error ? err.message : 'Format JSON tidak valid'}`,
            );
        }
    };

    const handlePrettifyJson = () => {
        try {
            const parsed: unknown = JSON.parse(rawJsonText);
            setRawJsonText(JSON.stringify(parsed, null, 2));
        } catch {
            // Biarkan pesan error JSON tampil jika belum valid
        }
    };

    const handleCopyJson = async () => {
        try {
            await navigator.clipboard.writeText(rawJsonText);
            setCopiedJson(true);
            setTimeout(() => setCopiedJson(false), 1800);
        } catch {
            // Abaikan
        }
    };

    const handleSaveToSupabase = async (publish: boolean) => {
        if (!supabase || !draftModule) return;
        if (jsonValidationError) {
            setStatusBanner({
                type: 'error',
                message: 'Perbaiki error validasi skema sebelum menyimpan ke database.',
            });
            return;
        }

        const validation = LessonModuleSchema.safeParse(draftModule);
        if (!validation.success) {
            setStatusBanner({
                type: 'error',
                message: `Validasi gagal: ${validation.error.issues[0]?.message ?? 'Invalid'}`,
            });
            return;
        }

        setIsSaving(true);
        setStatusBanner(null);

        const cleanModule = validation.data;
        const { error } = await supabase.from('custom_curriculum_modules').upsert(
            {
                id: cleanModule.id,
                lang: cleanModule.lang,
                tier: cleanModule.tier,
                order_index: cleanModule.order,
                title: cleanModule.title,
                subtitle: cleanModule.subtitle,
                veloa_intro: cleanModule.veloaGuide?.intro ?? '',
                veloa_outro: cleanModule.veloaGuide?.outro ?? '',
                content_json: cleanModule,
                is_published: publish,
                updated_by: user?.id ?? null,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' },
        );

        if (error) {
            setIsSaving(false);
            setStatusBanner({
                type: 'error',
                message: `Gagal menyimpan ke Supabase: ${error.message}`,
            });
            return;
        }

        invalidateModuleCache(cleanModule.id);
        await syncCloudCurriculumOverrides();
        setCloudVersionTick((t) => t + 1);
        setIsSaving(false);

        setStatusBanner({
            type: 'success',
            message: publish
                ? `Modul "${cleanModule.title}" berhasil DIPUBLIKASIKAN dan langsung aktif untuk seluruh pembelajar!`
                : `Draf "${cleanModule.title}" berhasil disimpan ke Supabase.`,
        });
    };

    const handleRevertToDefaultJson = async () => {
        if (!supabase || !draftModule) return;
        setIsSaving(true);
        setStatusBanner(null);

        const { error } = await supabase
            .from('custom_curriculum_modules')
            .delete()
            .eq('id', draftModule.id);

        if (error) {
            setIsSaving(false);
            setStatusBanner({
                type: 'error',
                message: `Gagal mereset modul: ${error.message}`,
            });
            return;
        }

        invalidateModuleCache(draftModule.id);
        await syncCloudCurriculumOverrides();
        setCloudVersionTick((t) => t + 1);

        try {
            const original = await loadBaseStaticModule(draftModule.id);
            setDraftModule(original);
            setRawJsonText(JSON.stringify(original, null, 2));
            setStatusBanner({
                type: 'success',
                message: `Override cloud dihapus. Modul "${draftModule.id}" dikembalikan ke JSON bawaan.`,
            });
        } catch {
            setDraftModule(null);
            setStatusBanner({
                type: 'success',
                message: `Modul kustom "${draftModule.id}" berhasil dihapus dari database.`,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportJsonFile = () => {
        if (!draftModule) return;
        const blob = new Blob([JSON.stringify(draftModule, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${draftModule.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                handleRawJsonChange(reader.result);
                setActiveEditorTab('JSON');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        applyModuleMutation((prev) => {
            const targetIdx = index + direction;
            if (targetIdx < 0 || targetIdx >= prev.blocks.length) return prev;
            const copy = [...prev.blocks];
            const temp = copy[index]!;
            copy[index] = copy[targetIdx]!;
            copy[targetIdx] = temp;
            return { ...prev, blocks: copy };
        });
    };

    const removeBlock = (index: number) => {
        applyModuleMutation((prev) => {
            if (prev.blocks.length <= 1) return prev;
            return {
                ...prev,
                blocks: prev.blocks.filter((_, idx) => idx !== index),
            };
        });
    };

    const appendStarterBlock = (
        blockType: 'linguistic-lore' | 'vocabulary-deck' | 'dialogue-theater',
    ) => {
        applyModuleMutation((prev) => {
            const isRtl = prev.lang === 'ar';
            let newBlock: LessonBlock;

            if (blockType === 'vocabulary-deck') {
                newBlock = {
                    type: 'vocabulary-deck',
                    title: 'Dek Kosakata Kunci',
                    direction: isRtl ? 'rtl' : 'ltr',
                    totalCount: 1,
                    entries: [
                        {
                            id: `${prev.id}-vocab-${Date.now().toString(36)}`,
                            term: '',
                            reading: '',
                            meaning: '',
                            partOfSpeech: 'noun',
                            patternNote: '',
                            exampleSentence: '',
                            exampleTranslation: '',
                        },
                    ],
                };
            } else if (blockType === 'dialogue-theater') {
                newBlock = {
                    type: 'dialogue-theater',
                    title: 'Simulasi Percakapan Kontekstual',
                    contextSituation: '',
                    registerLevel: 'Polite / Natural',
                    direction: isRtl ? 'rtl' : 'ltr',
                    turns: [
                        {
                            speaker: 'Pembicara A',
                            line: '',
                            reading: '',
                            translation: '',
                        },
                    ],
                };
            } else {
                newBlock = {
                    type: 'linguistic-lore',
                    title: 'Catatan Struktur & Nuansa',
                    eraOrDomain: '',
                    direction: isRtl ? 'rtl' : 'ltr',
                    narrativeSummary: '',
                    milestones: [
                        {
                            stage: '',
                            scriptSample: '',
                            reading: '',
                            explanation: '',
                        },
                    ],
                    structuralRules: [],
                    funFactsAndTips: [''],
                };
            }

            return { ...prev, blocks: [...prev.blocks, newBlock] };
        });
    };

    const activeCloudMeta = draftModule ? cloudRecordsMap.get(draftModule.id) : undefined;

    const langSelectOptions: Array<StudioSelectOption<LanguageCode>> = LANG_OPTIONS.map((l) => ({
        value: l.code,
        badge: l.shortCode,
        label: `${l.label} · ${l.native}`,
        description: l.framework,
    }));

    const pillarSelectOptions: Array<StudioSelectOption<LearningPillar>> = PILLAR_OPTIONS.map(
        (p) => ({
            value: p.value,
            label: p.label,
            description: p.hint,
        }),
    );

    const tierSelectOptions: Array<StudioSelectOption<RoadmapTier>> = TIER_OPTIONS.map((t) => ({
        value: t.value,
        label: t.label,
        description: t.hint,
    }));

    return (
        <div className="space-y-6">
            {/* Header Studio */}
            <div className="veloa-surface-card flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary-soft) px-3 py-1 font-mono text-[11px] font-extrabold uppercase text-(--accent-primary)">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Veloa Content Studio · Curriculum Engineering</span>
                    </span>
                    <h1 className="mt-2 text-2xl font-extrabold text-(--text-primary)">
                        Studio Perancang Kurikulum & Narasi Pemandu
                    </h1>
                    <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                        Susun bab kurikulum secara visual, tulis narasi pemandu Veloa yang hidup,
                        kelola kosakata & dialog kontekstual, lalu publikasikan langsung ke cloud.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="veloa-tactile-btn inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 py-2.5 text-xs font-bold text-(--text-primary) hover:border-(--accent-primary)">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Impor JSON</span>
                        <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportJsonFile}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={handleExportJsonFile}
                        disabled={!draftModule}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 py-2.5 text-xs font-bold text-(--text-primary) hover:border-(--accent-primary) disabled:opacity-50"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span>Ekspor JSON</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateNewModule}
                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl bg-(--accent-primary) px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-(--accent-primary-hover)"
                    >
                        <FilePlus2 className="h-3.5 w-3.5" />
                        <span>+ Modul Baru</span>
                    </button>
                </div>
            </div>

            {statusBanner && (
                <div
                    role="status"
                    className={`flex items-start gap-2.5 rounded-2xl border p-4 text-xs font-semibold ${statusBanner.type === 'success'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200'
                        }`}
                >
                    {statusBanner.type === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <span>{statusBanner.message}</span>
                </div>
            )}

            {/* Layout 2 Kolom: Explorer Kiri + Editor Kanan */}
            <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
                {/* KIRI: Curriculum Explorer */}
                <aside className="veloa-surface-card flex max-h-[80vh] flex-col overflow-hidden p-4">
                    <div className="space-y-2.5 border-b border-(--border-subtle) pb-3">
                        <StudioStyledSelect
                            label="Bahasa Kurikulum"
                            value={selectedLang}
                            options={langSelectOptions}
                            onChange={(nextLang) => {
                                setSelectedLang(nextLang);
                                setDraftModule(null);
                            }}
                        />

                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Cari judul, subjudul, atau ID modul..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) pr-3 pl-8.5 text-xs text-(--text-primary) outline-none focus:border-(--accent-primary)"
                            />
                        </div>

                        {/* Filter Status Cepat */}
                        <div className="grid grid-cols-4 gap-1 rounded-lg bg-(--surface-elevated) p-1">
                            {(
                                [
                                    { id: 'ALL', label: 'Semua' },
                                    { id: 'PUBLISHED', label: 'Live' },
                                    { id: 'DRAFT', label: 'Draf' },
                                    { id: 'DEFAULT', label: 'Bawaan' },
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`rounded-md py-1 text-[10px] font-extrabold transition-colors ${statusFilter === tab.id
                                            ? 'bg-(--accent-primary) text-white'
                                            : 'text-(--text-secondary) hover:text-(--text-primary)'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pe-1">
                        {moduleList.length === 0 ? (
                            <p className="py-8 text-center text-xs text-(--text-muted)">
                                Tidak ada modul yang cocok dengan filter ini.
                            </p>
                        ) : (
                            moduleList.map((item) => {
                                const isSelected = draftModule?.id === item.id;
                                const cloudInfo = cloudRecordsMap.get(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => void selectModuleForEditing(item.id)}
                                        className={`w-full rounded-xl border p-3 text-start transition-all ${isSelected
                                                ? 'border-(--accent-primary) bg-(--accent-primary-soft)/70 shadow-2xs'
                                                : 'border-(--border-subtle) bg-(--surface-elevated)/50 hover:border-(--border-strong)'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-[10px] font-bold uppercase text-(--text-muted)">
                                                Bab #{item.order} · {item.tier}
                                            </span>
                                            {cloudInfo ? (
                                                <span
                                                    className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-extrabold uppercase ${cloudInfo.isPublished
                                                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                                        }`}
                                                >
                                                    {cloudInfo.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            ) : (
                                                <span className="rounded bg-(--surface-card) px-1.5 py-0.5 font-mono text-[9px] font-semibold text-(--text-muted)">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 line-clamp-1 text-xs font-extrabold text-(--text-primary)">
                                            {item.title}
                                        </p>
                                        <p className="mt-0.5 truncate font-mono text-[10px] text-(--text-muted)">
                                            {item.id}
                                        </p>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* KANAN: Workspace Editor */}
                <section className="veloa-surface-card space-y-5 p-5 sm:p-6">
                    {isLoadingModule || !draftModule ? (
                        <div className="flex min-h-80 items-center justify-center gap-2 text-xs text-(--text-secondary)">
                            <Loader2 className="h-5 w-5 animate-spin text-(--accent-primary)" />
                            <span>Memuat struktur modul...</span>
                        </div>
                    ) : (
                        <>
                            {/* Toolbar Aksi Modul */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border-subtle) pb-4">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md bg-(--surface-elevated) px-2 py-0.5 font-mono text-[11px] font-extrabold text-(--accent-primary)">
                                            {draftModule.id}
                                        </span>
                                        {activeCloudMeta ? (
                                            <span
                                                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${activeCloudMeta.isPublished
                                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                                    }`}
                                            >
                                                {activeCloudMeta.isPublished
                                                    ? 'Aktif di Cloud'
                                                    : 'Draf Cloud'}
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-(--surface-elevated) px-2 py-0.5 font-mono text-[10px] font-semibold text-(--text-muted)">
                                                JSON Bawaan Lokal
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="mt-1 truncate text-lg font-extrabold text-(--text-primary)">
                                        {draftModule.title || 'Judul Modul Belum Diisi'}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {activeCloudMeta && (
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => void handleRevertToDefaultJson()}
                                            className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/20"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                            <span>Reset Default</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onPreviewModule(draftModule.id)}
                                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 py-2 text-xs font-bold text-(--text-primary) hover:border-(--accent-primary)"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Pratinjau Player</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isSaving || Boolean(jsonValidationError)}
                                        onClick={() => void handleSaveToSupabase(false)}
                                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 py-2 text-xs font-extrabold text-(--text-primary) hover:border-(--accent-primary) disabled:opacity-50"
                                    >
                                        <Save className="h-3.5 w-3.5" />
                                        <span>Simpan Draf</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isSaving || Boolean(jsonValidationError)}
                                        onClick={() => void handleSaveToSupabase(true)}
                                        className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl bg-(--accent-primary) px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-(--accent-primary-hover) disabled:opacity-50"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Publikasikan</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sub-Navigasi Tab Studio */}
                            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveEditorTab('PERSONA')}
                                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-extrabold transition-all ${activeEditorTab === 'PERSONA'
                                            ? 'bg-(--accent-primary) text-white shadow-2xs'
                                            : 'text-(--text-secondary) hover:text-(--text-primary)'
                                        }`}
                                >
                                    <Compass className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">1. Identitas & Narasi Veloa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveEditorTab('BLOCKS')}
                                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-extrabold transition-all ${activeEditorTab === 'BLOCKS'
                                            ? 'bg-(--accent-primary) text-white shadow-2xs'
                                            : 'text-(--text-secondary) hover:text-(--text-primary)'
                                        }`}
                                >
                                    <Layers className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">
                                        2. Isi Materi & Blok ({draftModule.blocks.length})
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveEditorTab('JSON')}
                                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-extrabold transition-all ${activeEditorTab === 'JSON'
                                            ? 'bg-(--accent-primary) text-white shadow-2xs'
                                            : 'text-(--text-secondary) hover:text-(--text-primary)'
                                        }`}
                                >
                                    <Code2 className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">3. Raw JSON & Schema</span>
                                </button>
                            </div>

                            {/* ====================================================================
                                TAB 1: IDENTITAS & NARASI PERSONA VELOA
                               ==================================================================== */}
                            {activeEditorTab === 'PERSONA' && (
                                <div className="space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-extrabold">
                                                Judul Modul
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Logika 4 Kondisi Present Tense dalam Percakapan"
                                                value={draftModule.title}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-extrabold">
                                                Subjudul / Tujuan Kompetensi
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: Membedakan fakta rutin, aksi berjalan, dan hasil yang masih relevan"
                                                value={draftModule.subtitle}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        subtitle: e.target.value,
                                                    }))
                                                }
                                                className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-4">
                                        <StudioStyledSelect
                                            label="Pilar Keilmuan"
                                            value={draftModule.pillar}
                                            options={pillarSelectOptions}
                                            onChange={(nextPillar) =>
                                                applyModuleMutation((prev) => ({
                                                    ...prev,
                                                    pillar: nextPillar,
                                                }))
                                            }
                                        />

                                        <StudioStyledSelect
                                            label="Tier Roadmap"
                                            value={draftModule.tier}
                                            options={tierSelectOptions}
                                            onChange={(nextTier) =>
                                                applyModuleMutation((prev) => ({
                                                    ...prev,
                                                    tier: nextTier,
                                                }))
                                            }
                                        />

                                        <div>
                                            <label className="mb-1.5 block text-xs font-extrabold">
                                                Urutan Bab
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="1"
                                                value={draftModule.order}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        order: Math.max(1, Number(e.target.value) || 1),
                                                    }))
                                                }
                                                className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-bold outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-extrabold">
                                                Estimasi (Menit)
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="15"
                                                value={draftModule.estimatedMinutes}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        estimatedMinutes: Math.max(
                                                            1,
                                                            Number(e.target.value) || 5,
                                                        ),
                                                    }))
                                                }
                                                className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-bold outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>
                                    </div>

                                    {/* Editor Storytelling Pemandu Veloa */}
                                    <div className="space-y-4 rounded-2xl border border-(--accent-primary)/25 bg-(--accent-primary-soft)/25 p-5">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-extrabold text-(--accent-primary)">
                                                <BookOpen className="h-4 w-4" />
                                                <span>
                                                    Naskah Pemandu “Veloa” (Konteks Dewasa &
                                                    Storytelling Terarah)
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-[11px] text-(--text-secondary)">
                                                Gunakan bahasa yang cerdas, observatif, dan langsung
                                                menjawab alasan mengapa pola bahasa ini bekerja
                                                demikian.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold">
                                                Prolog Pembuka Bab (Veloa Intro)
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Contoh: Tahukah Anda mengapa penutur bahasa Inggris membedakan 'I work' dan 'I am working'? Bukan sekadar soal waktu, melainkan apakah tindakan itu dianggap permanen atau sementara..."
                                                value={draftModule.veloaGuide?.intro ?? ''}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        veloaGuide: {
                                                            intro: e.target.value,
                                                            culturalContext:
                                                                prev.veloaGuide?.culturalContext ??
                                                                '',
                                                            fieldNote:
                                                                prev.veloaGuide?.fieldNote ?? '',
                                                            outro: prev.veloaGuide?.outro ?? '',
                                                        },
                                                    }))
                                                }
                                                className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) p-3 text-xs leading-relaxed outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-xs font-bold">
                                                    Badge Situasi / Konteks Budaya
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Komunikasi Profesional · Aspek Waktu"
                                                    value={
                                                        draftModule.veloaGuide?.culturalContext ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        applyModuleMutation((prev) => ({
                                                            ...prev,
                                                            veloaGuide: {
                                                                intro: prev.veloaGuide?.intro ?? '',
                                                                culturalContext: e.target.value,
                                                                fieldNote:
                                                                    prev.veloaGuide?.fieldNote ??
                                                                    '',
                                                                outro: prev.veloaGuide?.outro ?? '',
                                                            },
                                                        }))
                                                    }
                                                    className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs outline-none focus:border-(--accent-primary)"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-xs font-bold">
                                                    Catatan Lapangan / Jebakan Umum
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Kata kerja keadaan (know, believe, own) jarang memakai bentuk -ing."
                                                    value={draftModule.veloaGuide?.fieldNote ?? ''}
                                                    onChange={(e) =>
                                                        applyModuleMutation((prev) => ({
                                                            ...prev,
                                                            veloaGuide: {
                                                                intro: prev.veloaGuide?.intro ?? '',
                                                                culturalContext:
                                                                    prev.veloaGuide
                                                                        ?.culturalContext ?? '',
                                                                fieldNote: e.target.value,
                                                                outro: prev.veloaGuide?.outro ?? '',
                                                            },
                                                        }))
                                                    }
                                                    className="h-10 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs outline-none focus:border-(--accent-primary)"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold">
                                                Epilog Penutup & Transisi Bab (Veloa Outro)
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="Contoh: Kini Anda telah menguasai sudut pandang waktu saat ini. Pada bab berikutnya, kita akan menggeser garis waktu ke masa lampau..."
                                                value={draftModule.veloaGuide?.outro ?? ''}
                                                onChange={(e) =>
                                                    applyModuleMutation((prev) => ({
                                                        ...prev,
                                                        veloaGuide: {
                                                            intro: prev.veloaGuide?.intro ?? '',
                                                            culturalContext:
                                                                prev.veloaGuide?.culturalContext ??
                                                                '',
                                                            fieldNote:
                                                                prev.veloaGuide?.fieldNote ?? '',
                                                            outro: e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) p-3 text-xs leading-relaxed outline-none focus:border-(--accent-primary)"
                                            />
                                        </div>

                                        {draftModule.veloaGuide && (
                                            <div className="pt-1">
                                                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                                                    Pratinjau Langsung di Lesson Player:
                                                </p>
                                                <VeloaGuideBanner
                                                    guide={draftModule.veloaGuide}
                                                    variant="intro"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ====================================================================
                                TAB 2: SUSUNAN & EDITOR VISUAL TIAP BLOK PEMBELAJARAN
                               ==================================================================== */}
                            {activeEditorTab === 'BLOCKS' && (
                                <div className="space-y-4">
                                    {/* Toolbar Tambah Blok */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) p-3">
                                        <span className="text-xs font-extrabold text-(--text-primary)">
                                            Toolbar Tambah Kartu Materi:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => appendStarterBlock('linguistic-lore')}
                                                className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1.5 text-xs font-bold hover:border-(--accent-primary)"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-(--accent-primary)" />
                                                <span>Lore & Aturan</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => appendStarterBlock('vocabulary-deck')}
                                                className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1.5 text-xs font-bold hover:border-(--accent-primary)"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>Dek Kosakata</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => appendStarterBlock('dialogue-theater')}
                                                className="veloa-tactile-btn inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-1.5 text-xs font-bold hover:border-(--accent-primary)"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-amber-600" />
                                                <span>Teater Dialog</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {draftModule.blocks.map((block, idx) => (
                                            <div
                                                key={`${block.type}-${idx}`}
                                                className="space-y-3 rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/60 p-4"
                                            >
                                                {/* Header Blok + Kontrol Urutan */}
                                                <div className="flex items-center justify-between gap-2 border-b border-(--border-subtle) pb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-lg bg-(--accent-primary-soft) px-2.5 py-0.5 font-mono text-[11px] font-extrabold text-(--accent-primary)">
                                                            Kartu #{idx + 1} · {block.type}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            disabled={idx === 0}
                                                            onClick={() => moveBlock(idx, -1)}
                                                            aria-label="Geser kartu ke atas"
                                                            className="rounded-lg border border-(--border-subtle) bg-(--surface-card) p-1.5 text-(--text-secondary) hover:border-(--accent-primary) disabled:opacity-40"
                                                        >
                                                            <ArrowUp className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                idx === draftModule.blocks.length - 1
                                                            }
                                                            onClick={() => moveBlock(idx, 1)}
                                                            aria-label="Geser kartu ke bawah"
                                                            className="rounded-lg border border-(--border-subtle) bg-(--surface-card) p-1.5 text-(--text-secondary) hover:border-(--accent-primary) disabled:opacity-40"
                                                        >
                                                            <ArrowDown className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={draftModule.blocks.length <= 1}
                                                            onClick={() => removeBlock(idx)}
                                                            aria-label="Hapus kartu"
                                                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-600 hover:bg-rose-500/20 disabled:opacity-40"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Judul Blok */}
                                                <div>
                                                    <label className="mb-1 block text-[11px] font-bold text-(--text-muted)">
                                                        Judul Kartu Materi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Masukkan judul sub-topik kartu ini..."
                                                        value={block.title}
                                                        onChange={(e) =>
                                                            applyModuleMutation((prev) => ({
                                                                ...prev,
                                                                blocks: prev.blocks.map((b, i) =>
                                                                    i === idx
                                                                        ? {
                                                                            ...b,
                                                                            title: e.target.value,
                                                                        }
                                                                        : b,
                                                                ),
                                                            }))
                                                        }
                                                        className="h-9 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs font-semibold outline-none focus:border-(--accent-primary)"
                                                    />
                                                </div>

                                                {/* EDITOR KHUSUS: LINGUISTIC-LORE */}
                                                {block.type === 'linguistic-lore' && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="mb-1 block text-[11px] font-bold text-(--text-muted)">
                                                                Domain / Konteks Keilmuan
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Contoh: Sintaksis & Aspek Waktu"
                                                                value={block.eraOrDomain}
                                                                onChange={(e) =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'linguistic-lore'
                                                                                    ? {
                                                                                        ...b,
                                                                                        eraOrDomain:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="h-9 w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) px-3 text-xs outline-none focus:border-(--accent-primary)"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-[11px] font-bold text-(--text-muted)">
                                                                Ringkasan Narasi Konsep
                                                            </label>
                                                            <textarea
                                                                rows={2}
                                                                placeholder="Jelaskan mekanisme pola bahasa secara runtut dan mudah dicerna..."
                                                                value={block.narrativeSummary}
                                                                onChange={(e) =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'linguistic-lore'
                                                                                    ? {
                                                                                        ...b,
                                                                                        narrativeSummary:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="w-full rounded-xl border border-(--border-subtle) bg-(--surface-card) p-2.5 text-xs outline-none focus:border-(--accent-primary)"
                                                            />
                                                        </div>

                                                        {/* Daftar Milestones */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] font-extrabold text-(--text-secondary)">
                                                                    Poin Pola / Tahapan ({block.milestones.length})
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        applyModuleMutation(
                                                                            (prev) => ({
                                                                                ...prev,
                                                                                blocks: prev.blocks.map(
                                                                                    (b, i) =>
                                                                                        i === idx &&
                                                                                            b.type ===
                                                                                            'linguistic-lore'
                                                                                            ? {
                                                                                                ...b,
                                                                                                milestones:
                                                                                                    [
                                                                                                        ...b.milestones,
                                                                                                        {
                                                                                                            stage: '',
                                                                                                            scriptSample:
                                                                                                                '',
                                                                                                            reading:
                                                                                                                '',
                                                                                                            explanation:
                                                                                                                '',
                                                                                                        },
                                                                                                    ],
                                                                                            }
                                                                                            : b,
                                                                                ),
                                                                            }),
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 rounded-lg bg-(--accent-primary-soft) px-2 py-1 text-[11px] font-bold text-(--accent-primary)"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                    <span>Tambah Poin</span>
                                                                </button>
                                                            </div>

                                                            {block.milestones.map((ms, mIdx) => (
                                                                <div
                                                                    key={mIdx}
                                                                    className="grid gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-2.5 sm:grid-cols-2"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Label Tahap / Kondisi"
                                                                        value={ms.stage}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'linguistic-lore'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    milestones:
                                                                                                        b.milestones.map(
                                                                                                            (
                                                                                                                m,
                                                                                                                mi,
                                                                                                            ) =>
                                                                                                                mi ===
                                                                                                                    mIdx
                                                                                                                    ? {
                                                                                                                        ...m,
                                                                                                                        stage: e
                                                                                                                            .target
                                                                                                                            .value,
                                                                                                                    }
                                                                                                                    : m,
                                                                                                        ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs font-semibold outline-none"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Contoh Frasa / Rumus"
                                                                        value={ms.scriptSample}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'linguistic-lore'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    milestones:
                                                                                                        b.milestones.map(
                                                                                                            (
                                                                                                                m,
                                                                                                                mi,
                                                                                                            ) =>
                                                                                                                mi ===
                                                                                                                    mIdx
                                                                                                                    ? {
                                                                                                                        ...m,
                                                                                                                        scriptSample:
                                                                                                                            e
                                                                                                                                .target
                                                                                                                                .value,
                                                                                                                    }
                                                                                                                    : m,
                                                                                                        ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Transliterasi / Fonetik"
                                                                        value={ms.reading}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'linguistic-lore'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    milestones:
                                                                                                        b.milestones.map(
                                                                                                            (
                                                                                                                m,
                                                                                                                mi,
                                                                                                            ) =>
                                                                                                                mi ===
                                                                                                                    mIdx
                                                                                                                    ? {
                                                                                                                        ...m,
                                                                                                                        reading:
                                                                                                                            e
                                                                                                                                .target
                                                                                                                                .value,
                                                                                                                    }
                                                                                                                    : m,
                                                                                                        ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                    />
                                                                    <div className="flex gap-1.5">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Penjelasan fungsi & nuansa"
                                                                            value={ms.explanation}
                                                                            onChange={(e) =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'linguistic-lore'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        milestones:
                                                                                                            b.milestones.map(
                                                                                                                (
                                                                                                                    m,
                                                                                                                    mi,
                                                                                                                ) =>
                                                                                                                    mi ===
                                                                                                                        mIdx
                                                                                                                        ? {
                                                                                                                            ...m,
                                                                                                                            explanation:
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .value,
                                                                                                                        }
                                                                                                                        : m,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="h-8 flex-1 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'linguistic-lore'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        milestones:
                                                                                                            b.milestones.filter(
                                                                                                                (
                                                                                                                    _,
                                                                                                                    mi,
                                                                                                                ) =>
                                                                                                                    mi !==
                                                                                                                    mIdx,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="rounded-lg px-2 text-rose-500 hover:bg-rose-500/10"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* EDITOR KHUSUS: VOCABULARY-DECK */}
                                                {block.type === 'vocabulary-deck' && (
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-extrabold text-(--text-secondary)">
                                                                Daftar Kosakata ({block.entries.length} entri)
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'vocabulary-deck'
                                                                                    ? {
                                                                                        ...b,
                                                                                        totalCount:
                                                                                            b
                                                                                                .entries
                                                                                                .length +
                                                                                            1,
                                                                                        entries: [
                                                                                            ...b.entries,
                                                                                            {
                                                                                                id: `${prev.id}-v-${Date.now().toString(36)}`,
                                                                                                term: '',
                                                                                                reading:
                                                                                                    '',
                                                                                                meaning:
                                                                                                    '',
                                                                                                partOfSpeech:
                                                                                                    'noun',
                                                                                                patternNote:
                                                                                                    '',
                                                                                                exampleSentence:
                                                                                                    '',
                                                                                                exampleTranslation:
                                                                                                    '',
                                                                                            },
                                                                                        ],
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                <span>+ Entri Kosakata</span>
                                                            </button>
                                                        </div>

                                                        <div className="max-h-72 space-y-2 overflow-y-auto pe-1">
                                                            {block.entries.map((entry, eIdx) => (
                                                                <div
                                                                    key={entry.id}
                                                                    className="space-y-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-3"
                                                                >
                                                                    <div className="grid gap-2 sm:grid-cols-3">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Kata / Frasa Target"
                                                                            value={entry.term}
                                                                            onChange={(e) =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'vocabulary-deck'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        entries:
                                                                                                            b.entries.map(
                                                                                                                (
                                                                                                                    en,
                                                                                                                    ei,
                                                                                                                ) =>
                                                                                                                    ei ===
                                                                                                                        eIdx
                                                                                                                        ? {
                                                                                                                            ...en,
                                                                                                                            term: e
                                                                                                                                .target
                                                                                                                                .value,
                                                                                                                        }
                                                                                                                        : en,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs font-bold outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Transliterasi / IPA"
                                                                            value={entry.reading}
                                                                            onChange={(e) =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'vocabulary-deck'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        entries:
                                                                                                            b.entries.map(
                                                                                                                (
                                                                                                                    en,
                                                                                                                    ei,
                                                                                                                ) =>
                                                                                                                    ei ===
                                                                                                                        eIdx
                                                                                                                        ? {
                                                                                                                            ...en,
                                                                                                                            reading:
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .value,
                                                                                                                        }
                                                                                                                        : en,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                        />
                                                                        <div className="flex gap-1.5">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Arti Indonesia"
                                                                                value={
                                                                                    entry.meaning
                                                                                }
                                                                                onChange={(e) =>
                                                                                    applyModuleMutation(
                                                                                        (prev) => ({
                                                                                            ...prev,
                                                                                            blocks: prev.blocks.map(
                                                                                                (
                                                                                                    b,
                                                                                                    i,
                                                                                                ) =>
                                                                                                    i ===
                                                                                                        idx &&
                                                                                                        b.type ===
                                                                                                        'vocabulary-deck'
                                                                                                        ? {
                                                                                                            ...b,
                                                                                                            entries:
                                                                                                                b.entries.map(
                                                                                                                    (
                                                                                                                        en,
                                                                                                                        ei,
                                                                                                                    ) =>
                                                                                                                        ei ===
                                                                                                                            eIdx
                                                                                                                            ? {
                                                                                                                                ...en,
                                                                                                                                meaning:
                                                                                                                                    e
                                                                                                                                        .target
                                                                                                                                        .value,
                                                                                                                            }
                                                                                                                            : en,
                                                                                                                ),
                                                                                                        }
                                                                                                        : b,
                                                                                            ),
                                                                                        }),
                                                                                    )
                                                                                }
                                                                                className="h-8 flex-1 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                disabled={
                                                                                    block.entries
                                                                                        .length <= 1
                                                                                }
                                                                                onClick={() =>
                                                                                    applyModuleMutation(
                                                                                        (prev) => ({
                                                                                            ...prev,
                                                                                            blocks: prev.blocks.map(
                                                                                                (
                                                                                                    b,
                                                                                                    i,
                                                                                                ) =>
                                                                                                    i ===
                                                                                                        idx &&
                                                                                                        b.type ===
                                                                                                        'vocabulary-deck'
                                                                                                        ? {
                                                                                                            ...b,
                                                                                                            totalCount:
                                                                                                                Math.max(
                                                                                                                    1,
                                                                                                                    b
                                                                                                                        .entries
                                                                                                                        .length -
                                                                                                                    1,
                                                                                                                ),
                                                                                                            entries:
                                                                                                                b.entries.filter(
                                                                                                                    (
                                                                                                                        _,
                                                                                                                        ei,
                                                                                                                    ) =>
                                                                                                                        ei !==
                                                                                                                        eIdx,
                                                                                                                ),
                                                                                                        }
                                                                                                        : b,
                                                                                            ),
                                                                                        }),
                                                                                    )
                                                                                }
                                                                                className="rounded-lg px-2 text-rose-500 hover:bg-rose-500/10 disabled:opacity-30"
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid gap-2 sm:grid-cols-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Contoh kalimat kontekstual..."
                                                                            value={
                                                                                entry.exampleSentence
                                                                            }
                                                                            onChange={(e) =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'vocabulary-deck'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        entries:
                                                                                                            b.entries.map(
                                                                                                                (
                                                                                                                    en,
                                                                                                                    ei,
                                                                                                                ) =>
                                                                                                                    ei ===
                                                                                                                        eIdx
                                                                                                                        ? {
                                                                                                                            ...en,
                                                                                                                            exampleSentence:
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .value,
                                                                                                                        }
                                                                                                                        : en,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Terjemahan alami contoh kalimat..."
                                                                            value={
                                                                                entry.exampleTranslation
                                                                            }
                                                                            onChange={(e) =>
                                                                                applyModuleMutation(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        blocks: prev.blocks.map(
                                                                                            (
                                                                                                b,
                                                                                                i,
                                                                                            ) =>
                                                                                                i ===
                                                                                                    idx &&
                                                                                                    b.type ===
                                                                                                    'vocabulary-deck'
                                                                                                    ? {
                                                                                                        ...b,
                                                                                                        entries:
                                                                                                            b.entries.map(
                                                                                                                (
                                                                                                                    en,
                                                                                                                    ei,
                                                                                                                ) =>
                                                                                                                    ei ===
                                                                                                                        eIdx
                                                                                                                        ? {
                                                                                                                            ...en,
                                                                                                                            exampleTranslation:
                                                                                                                                e
                                                                                                                                    .target
                                                                                                                                    .value,
                                                                                                                        }
                                                                                                                        : en,
                                                                                                            ),
                                                                                                    }
                                                                                                    : b,
                                                                                        ),
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* EDITOR KHUSUS: DIALOGUE-THEATER */}
                                                {block.type === 'dialogue-theater' && (
                                                    <div className="space-y-2.5">
                                                        <div className="grid gap-2 sm:grid-cols-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Situasi Skenario (Misal: Diskusi Proyek di Kantor)"
                                                                value={block.contextSituation}
                                                                onChange={(e) =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'dialogue-theater'
                                                                                    ? {
                                                                                        ...b,
                                                                                        contextSituation:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs outline-none"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Register Bahasa (Misal: Formal / Kasual)"
                                                                value={block.registerLevel}
                                                                onChange={(e) =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'dialogue-theater'
                                                                                    ? {
                                                                                        ...b,
                                                                                        registerLevel:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 text-xs outline-none"
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-(--text-secondary)">
                                                                <MessageSquareQuote className="h-3.5 w-3.5 text-amber-600" />
                                                                <span>
                                                                    Giliran Dialog ({block.turns.length} baris)
                                                                </span>
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    applyModuleMutation((prev) => ({
                                                                        ...prev,
                                                                        blocks: prev.blocks.map(
                                                                            (b, i) =>
                                                                                i === idx &&
                                                                                    b.type ===
                                                                                    'dialogue-theater'
                                                                                    ? {
                                                                                        ...b,
                                                                                        turns: [
                                                                                            ...b.turns,
                                                                                            {
                                                                                                speaker:
                                                                                                    'Pembicara B',
                                                                                                line: '',
                                                                                                reading:
                                                                                                    '',
                                                                                                translation:
                                                                                                    '',
                                                                                            },
                                                                                        ],
                                                                                    }
                                                                                    : b,
                                                                        ),
                                                                    }))
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                <span>+ Baris Dialog</span>
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {block.turns.map((turn, tIdx) => (
                                                                <div
                                                                    key={tIdx}
                                                                    className="grid gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) p-2.5 sm:grid-cols-[120px_1fr_1fr_auto]"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Tokoh"
                                                                        value={turn.speaker}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'dialogue-theater'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    turns: b.turns.map(
                                                                                                        (
                                                                                                            tn,
                                                                                                            ti,
                                                                                                        ) =>
                                                                                                            ti ===
                                                                                                                tIdx
                                                                                                                ? {
                                                                                                                    ...tn,
                                                                                                                    speaker:
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value,
                                                                                                                }
                                                                                                                : tn,
                                                                                                    ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs font-bold outline-none"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Kalimat bahasa target"
                                                                        value={turn.line}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'dialogue-theater'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    turns: b.turns.map(
                                                                                                        (
                                                                                                            tn,
                                                                                                            ti,
                                                                                                        ) =>
                                                                                                            ti ===
                                                                                                                tIdx
                                                                                                                ? {
                                                                                                                    ...tn,
                                                                                                                    line: e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                }
                                                                                                                : tn,
                                                                                                    ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Terjemahan Indonesia"
                                                                        value={turn.translation}
                                                                        onChange={(e) =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'dialogue-theater'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    turns: b.turns.map(
                                                                                                        (
                                                                                                            tn,
                                                                                                            ti,
                                                                                                        ) =>
                                                                                                            ti ===
                                                                                                                tIdx
                                                                                                                ? {
                                                                                                                    ...tn,
                                                                                                                    translation:
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value,
                                                                                                                }
                                                                                                                : tn,
                                                                                                    ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="h-8 rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-2.5 text-xs outline-none"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            block.turns.length <= 1
                                                                        }
                                                                        onClick={() =>
                                                                            applyModuleMutation(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    blocks: prev.blocks.map(
                                                                                        (b, i) =>
                                                                                            i ===
                                                                                                idx &&
                                                                                                b.type ===
                                                                                                'dialogue-theater'
                                                                                                ? {
                                                                                                    ...b,
                                                                                                    turns: b.turns.filter(
                                                                                                        (
                                                                                                            _,
                                                                                                            ti,
                                                                                                        ) =>
                                                                                                            ti !==
                                                                                                            tIdx,
                                                                                                    ),
                                                                                                }
                                                                                                : b,
                                                                                    ),
                                                                                }),
                                                                            )
                                                                        }
                                                                        className="rounded-lg px-2 text-rose-500 hover:bg-rose-500/10 disabled:opacity-30"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ====================================================================
                                TAB 3: RAW JSON & ZOD SCHEMA VALIDATOR + TOOLBAR
                               ==================================================================== */}
                            {activeEditorTab === 'JSON' && (
                                <div className="space-y-3">
                                    {/* Toolbar JSON */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 py-2">
                                        <span className="font-mono text-[11px] font-bold text-(--text-secondary)">
                                            {draftModule.id}.json · {rawJsonText.length.toLocaleString('id-ID')} karakter
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={handlePrettifyJson}
                                                className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 py-1 text-[11px] font-bold text-(--text-primary) hover:border-(--accent-primary)"
                                            >
                                                <Wand2 className="h-3 w-3 text-(--accent-primary)" />
                                                <span>Rapikan JSON</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void handleCopyJson()}
                                                className="inline-flex items-center gap-1 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-2.5 py-1 text-[11px] font-bold text-(--text-primary) hover:border-(--accent-primary)"
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span>{copiedJson ? 'Tersalin!' : 'Salin JSON'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {jsonValidationError ? (
                                        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span className="font-mono">{jsonValidationError}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                            <span>
                                                Skema LessonModuleSchema valid 100% dan siap
                                                disimpan ke Supabase.
                                            </span>
                                        </div>
                                    )}

                                    <textarea
                                        rows={20}
                                        spellCheck={false}
                                        placeholder="Tempel atau sunting struktur JSON modul di sini..."
                                        value={rawJsonText}
                                        onChange={(e) => handleRawJsonChange(e.target.value)}
                                        className="w-full rounded-2xl border border-(--border-subtle) bg-(--surface-elevated) p-4 font-mono text-xs leading-relaxed text-(--text-primary) outline-none focus:border-(--accent-primary)"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};
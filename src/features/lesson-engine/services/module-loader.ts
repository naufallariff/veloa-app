// src/features/lesson-engine/services/module-loader.ts
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import {
    LessonModuleSchema,
    type CurriculumManifestItem,
    type LanguageCode,
    type LessonModule,
} from '../schema/lesson.schema';

const moduleMemoryCache = new Map<string, LessonModule>();
const inflightRequests = new Map<string, Promise<LessonModule>>();

export class ModuleLoadError extends Error {
    readonly code: 'NOT_FOUND' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'ABORTED';

    constructor(
        message: string,
        code: 'NOT_FOUND' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'ABORTED',
        cause?: unknown,
    ) {
        super(message, { cause });
        this.name = 'ModuleLoadError';
        this.code = code;
    }
}

export function getManifestByLanguage(lang: LanguageCode): CurriculumManifestItem[] {
    return CURRICULUM_MANIFEST.filter((item) => item.lang === lang).sort(
        (a, b) => a.order - b.order,
    );
}

export function getManifestItemById(moduleId: string): CurriculumManifestItem | undefined {
    return CURRICULUM_MANIFEST.find((item) => item.id === moduleId);
}

export function getAdjacentModules(moduleId: string): {
    previous: CurriculumManifestItem | null;
    next: CurriculumManifestItem | null;
} {
    const current = getManifestItemById(moduleId);
    if (!current) return { previous: null, next: null };

    const langList = getManifestByLanguage(current.lang);
    const index = langList.findIndex((item) => item.id === moduleId);

    return {
        previous: index > 0 ? (langList[index - 1] ?? null) : null,
        next: index >= 0 && index < langList.length - 1 ? (langList[index + 1] ?? null) : null,
    };
}

export async function loadLessonModule(
    moduleId: string,
    signal?: AbortSignal,
): Promise<LessonModule> {
    const cached = moduleMemoryCache.get(moduleId);
    if (cached) {
        return cached;
    }

    const manifestItem = getManifestItemById(moduleId);
    if (!manifestItem) {
        throw new ModuleLoadError(`Modul tidak ditemukan di manifest: ${moduleId}`, 'NOT_FOUND');
    }

    const existingRequest = inflightRequests.get(moduleId);
    if (existingRequest && !signal) {
        return existingRequest;
    }

    const fetchPromise = (async (): Promise<LessonModule> => {
        try {
            const response = await fetch(manifestItem.dataPath, {
                signal,
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                throw new ModuleLoadError(
                    `Gagal memuat modul (${response.status} ${response.statusText})`,
                    'NETWORK_ERROR',
                );
            }

            const rawJson: unknown = await response.json();
            const parsed = LessonModuleSchema.safeParse(rawJson);

            if (!parsed.success) {
                throw new ModuleLoadError(
                    `Struktur JSON modul tidak valid: ${parsed.error.issues[0]?.message ?? 'Unknown schema error'}`,
                    'VALIDATION_ERROR',
                    parsed.error,
                );
            }

            moduleMemoryCache.set(moduleId, parsed.data);
            return parsed.data;
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new ModuleLoadError('Pemuatan modul dibatalkan.', 'ABORTED', error);
            }
            if (error instanceof ModuleLoadError) {
                throw error;
            }
            throw new ModuleLoadError('Terjadi kesalahan jaringan saat mengunduh modul.', 'NETWORK_ERROR', error);
        } finally {
            inflightRequests.delete(moduleId);
        }
    })();

    if (!signal) {
        inflightRequests.set(moduleId, fetchPromise);
    }

    return fetchPromise;
}

export function prefetchLessonModule(moduleId: string): void {
    if (moduleMemoryCache.has(moduleId) || inflightRequests.has(moduleId)) return;
    void loadLessonModule(moduleId).catch(() => {
        // Abaikan kegagalan prefetch di latar belakang
    });
}
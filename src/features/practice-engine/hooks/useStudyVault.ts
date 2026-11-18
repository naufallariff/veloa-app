// src/features/practice-engine/hooks/useStudyVault.ts
import { useCallback, useEffect, useState } from 'react';
import { CURRICULUM_MANIFEST } from '@/content/curriculum-manifest';
import type { LanguageCode, LessonModule } from '@/features/lesson-engine/schema/lesson.schema';
import { loadLessonModule } from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { enrichLessonModule } from '@/features/lesson-engine/utils/enrich-lesson-module';
import { useMasteryEngine, type ItemSrsRecord } from './useMasteryEngine';

export interface ResolvedStudyItem {
    id: string;
    lang: LanguageCode;
    moduleId: string;
    moduleTitle: string;
    script: string;
    reading?: string;
    meaning: string;
    categoryLabel: string;
    srsRecord?: ItemSrsRecord;
    isDueForReview: boolean;
}

export interface VeloaBackupPayload {
    schemaVersion: 'veloa-backup-v1';
    exportedAt: string;
    progress: {
        completedModuleIds: string[];
        completedBlockKeys?: string[];
        bookmarkedEntryIds: string[];
        lastVisitedModuleId: string | null;
    };
    mastery: {
        xp: number;
        streakDays: number;
        totalAnswered: number;
        totalCorrect: number;
        srsRecords: Record<string, ItemSrsRecord>;
    };
}

function indexModuleItems(
    rawMod: LessonModule,
): Map<string, Omit<ResolvedStudyItem, 'srsRecord' | 'isDueForReview'>> {
    const mod = enrichLessonModule(rawMod);
    const map = new Map<string, Omit<ResolvedStudyItem, 'srsRecord' | 'isDueForReview'>>();

    for (const block of mod.blocks) {
        if (block.type === 'vocabulary-deck') {
            for (const entry of block.entries) {
                map.set(entry.id, {
                    id: entry.id,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: entry.term,
                    reading: entry.reading,
                    meaning: entry.meaning,
                    categoryLabel: entry.partOfSpeech,
                });
            }
        } else if (block.type === 'script-matrix') {
            block.cells.forEach((cell, idx) => {
                const cellId = `${mod.id}-cell-${cell.glyph}-${idx}`;
                map.set(cellId, {
                    id: cellId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: cell.glyph,
                    reading: cell.reading,
                    meaning: cell.transliteration,
                    categoryLabel: cell.componentRole ?? block.scriptSystem,
                });
            });
        } else if (block.type === 'cognitive-pattern-table') {
            const lastColKey = block.columns[block.columns.length - 1]?.key;
            for (const row of block.rows) {
                const targetCell = lastColKey ? row.cells[lastColKey] : Object.values(row.cells)[0];
                if (!targetCell) continue;
                map.set(row.id, {
                    id: row.id,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: targetCell.script,
                    reading: targetCell.reading,
                    meaning: row.fullTranslation,
                    categoryLabel: block.grammaticalTradition,
                });
            }
        } else if (block.type === 'dialogue-theater') {
            block.turns.forEach((turn, idx) => {
                const turnId = `${mod.id}-turn-${idx}`;
                map.set(turnId, {
                    id: turnId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: turn.line,
                    reading: turn.reading,
                    meaning: turn.translation,
                    categoryLabel: block.registerLevel,
                });
            });
        } else if (block.type === 'linguistic-lore') {
            block.milestones.forEach((m, idx) => {
                const msId = `${mod.id}-milestone-${idx}`;
                map.set(msId, {
                    id: msId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: m.scriptSample || m.stage,
                    reading: m.reading,
                    meaning: `${m.stage}: ${m.explanation}`,
                    categoryLabel: block.eraOrDomain,
                });
            });

            block.structuralRules.forEach((rule, idx) => {
                const ruleId = `${mod.id}-rule-${idx}`;
                map.set(ruleId, {
                    id: ruleId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: rule.conceptName,
                    reading: rule.examples[0],
                    meaning: rule.definition,
                    categoryLabel: block.eraOrDomain,
                });
            });
        } else if (block.type === 'rhetoric-stylistics') {
            block.devices.forEach((dev, idx) => {
                const devId = `${mod.id}-device-${idx}`;
                map.set(devId, {
                    id: devId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: dev.literaryExample || dev.nativeTerm,
                    reading: dev.reading ?? dev.nativeTerm,
                    meaning: `${dev.deviceName} — ${dev.translation}`,
                    categoryLabel: block.traditionName,
                });
            });
            block.dialectAndSlangNotes.forEach((noteItem, idx) => {
                const dialectId = `${mod.id}-dialect-${idx}`;
                map.set(dialectId, {
                    id: dialectId,
                    lang: mod.lang,
                    moduleId: mod.id,
                    moduleTitle: mod.title,
                    script: noteItem.sampleExpression,
                    reading: noteItem.standardEquivalent,
                    meaning: `${noteItem.meaning} (${noteItem.varietyName})`,
                    categoryLabel: noteItem.regionOrContext,
                });
            });
        }
    }

    return map;
}

function inferModuleIdsFromItemIds(itemIds: string[]): string[] {
    const modIds = new Set<string>();

    for (const id of itemIds) {
        // 1. Cocokkan prefix modul langsung (termasuk -supp-, -pad-, -milestone-, -rule-, dll.)
        const directMatch = CURRICULUM_MANIFEST.find((m) => id.startsWith(m.id));
        if (directMatch) {
            modIds.add(directMatch.id);
            continue;
        }

        // 2. Cocokkan pola ID deck kosakata dari pipeline ETL
        if (id.startsWith('en-a1-')) modIds.add('en-07-beg-lexicon-cefr-a1-a2');
        else if (id.startsWith('en-b1-')) modIds.add('en-08-inter-lexicon-cefr-b1-b2');
        else if (id.startsWith('en-c1-')) modIds.add('en-09-adv-lexicon-cefr-c1-c2');
        else if (id.startsWith('zh-hsk1-')) modIds.add('zh-06-beg-lexicon-hsk1-2');
        else if (id.startsWith('zh-hsk3-')) modIds.add('zh-07-inter-lexicon-hsk3-4');
        else if (id.startsWith('zh-hsk5-')) modIds.add('zh-08-adv-lexicon-hsk5-6-cedict');
        else if (id.startsWith('ja-n5-')) modIds.add('ja-07-beg-lexicon-jlpt-n5-n4');
        else if (id.startsWith('ja-n3-')) modIds.add('ja-08-inter-lexicon-jlpt-n3-n2');
        else if (id.startsWith('ja-n1-')) modIds.add('ja-09-adv-lexicon-jlpt-n1');
        else if (id.startsWith('ar-a1-')) modIds.add('ar-05-beg-lexicon-a1-a2');
        else if (id.startsWith('ar-b1-')) modIds.add('ar-06-inter-lexicon-b1-b2');
        else if (id.startsWith('ar-c1-')) modIds.add('ar-07-adv-lexicon-c1-c2');
        else if (id.startsWith('ko-t1-')) modIds.add('ko-06-beg-lexicon-topik1');
        else if (id.startsWith('ko-t2-')) modIds.add('ko-07-inter-lexicon-topik2-mid');
        else if (id.startsWith('ko-t3-')) modIds.add('ko-08-adv-lexicon-topik2-high');
    }

    return Array.from(modIds);
}

export function useStudyVault(enabled: boolean) {
    const { completedModuleIds, completedBlockKeys, bookmarkedEntryIds, lastVisitedModuleId } =
        useLessonProgress();
    const { xp, streakDays, totalAnswered, totalCorrect, srsRecords } = useMasteryEngine();

    const [resolvedBookmarked, setResolvedBookmarked] = useState<ResolvedStudyItem[]>([]);
    const [resolvedDueSrs, setResolvedDueSrs] = useState<ResolvedStudyItem[]>([]);
    const [isResolving, setIsResolving] = useState<boolean>(false);

    useEffect(() => {
        if (!enabled) return;

        const now = Date.now();
        const explicitDueIds = Object.values(srsRecords)
            .filter((rec) => rec.nextReviewAt <= now)
            .map((rec) => rec.itemId);

        // Item yang di-bookmark tetapi belum pernah diuji otomatis dianggap siap ulang kaji
        const bookmarkedUnreviewedIds = bookmarkedEntryIds.filter((bId) => !srsRecords[bId]);
        const dueIds = Array.from(new Set([...explicitDueIds, ...bookmarkedUnreviewedIds]));

        const allTargetIds = Array.from(new Set([...bookmarkedEntryIds, ...dueIds]));
        if (allTargetIds.length === 0) {
            setResolvedBookmarked([]);
            setResolvedDueSrs([]);
            setIsResolving(false);
            return;
        }

        let cancelled = false;
        setIsResolving(true);

        const neededModuleIds = inferModuleIdsFromItemIds(allTargetIds);

        Promise.all(
            neededModuleIds.map((modId) => loadLessonModule(modId).catch(() => null)),
        ).then((loadedModules) => {
            if (cancelled) return;

            const globalItemLookup = new Map<
                string,
                Omit<ResolvedStudyItem, 'srsRecord' | 'isDueForReview'>
            >();

            for (const mod of loadedModules) {
                if (!mod) continue;
                const indexed = indexModuleItems(mod);
                indexed.forEach((val, key) => {
                    globalItemLookup.set(key, val);
                });
            }

            const nextBookmarks: ResolvedStudyItem[] = [];
            for (const bId of bookmarkedEntryIds) {
                const base = globalItemLookup.get(bId);
                if (!base) continue;
                const srs = srsRecords[bId];
                nextBookmarks.push({
                    ...base,
                    srsRecord: srs,
                    isDueForReview: !srs || srs.nextReviewAt <= now,
                });
            }

            const nextDue: ResolvedStudyItem[] = [];
            for (const dId of dueIds) {
                const base = globalItemLookup.get(dId);
                if (!base) continue;
                const srs = srsRecords[dId];
                nextDue.push({
                    ...base,
                    srsRecord: srs,
                    isDueForReview: true,
                });
            }

            setResolvedBookmarked(nextBookmarks);
            setResolvedDueSrs(nextDue);
            setIsResolving(false);
        });

        return () => {
            cancelled = true;
        };
    }, [enabled, bookmarkedEntryIds, srsRecords]);

    const exportBackupJson = useCallback((): string => {
        const payload: VeloaBackupPayload = {
            schemaVersion: 'veloa-backup-v1',
            exportedAt: new Date().toISOString(),
            progress: {
                completedModuleIds,
                completedBlockKeys,
                bookmarkedEntryIds,
                lastVisitedModuleId,
            },
            mastery: {
                xp,
                streakDays,
                totalAnswered,
                totalCorrect,
                srsRecords,
            },
        };
        return JSON.stringify(payload, null, 2);
    }, [
        completedModuleIds,
        completedBlockKeys,
        bookmarkedEntryIds,
        lastVisitedModuleId,
        xp,
        streakDays,
        totalAnswered,
        totalCorrect,
        srsRecords,
    ]);

    const importBackupJson = useCallback((rawJson: string): { ok: boolean; message: string } => {
        try {
            const parsed = JSON.parse(rawJson) as Partial<VeloaBackupPayload>;
            if (parsed.schemaVersion !== 'veloa-backup-v1' || !parsed.progress || !parsed.mastery) {
                return {
                    ok: false,
                    message: 'Format berkas cadangan tidak dikenali (bukan veloa-backup-v1).',
                };
            }

            window.localStorage.setItem(
                'veloa.curriculum.progress.v1',
                JSON.stringify({
                    completedModuleIds: Array.isArray(parsed.progress.completedModuleIds)
                        ? parsed.progress.completedModuleIds
                        : [],
                    completedBlockKeys: Array.isArray(parsed.progress.completedBlockKeys)
                        ? parsed.progress.completedBlockKeys
                        : [],
                    bookmarkedEntryIds: Array.isArray(parsed.progress.bookmarkedEntryIds)
                        ? parsed.progress.bookmarkedEntryIds
                        : [],
                    lastVisitedModuleId:
                        typeof parsed.progress.lastVisitedModuleId === 'string'
                            ? parsed.progress.lastVisitedModuleId
                            : null,
                }),
            );

            window.localStorage.setItem(
                'veloa.mastery.srs.v1',
                JSON.stringify({
                    xp: typeof parsed.mastery.xp === 'number' ? parsed.mastery.xp : 0,
                    streakDays:
                        typeof parsed.mastery.streakDays === 'number' ? parsed.mastery.streakDays : 0,
                    lastActiveDate: null,
                    totalAnswered:
                        typeof parsed.mastery.totalAnswered === 'number' ? parsed.mastery.totalAnswered : 0,
                    totalCorrect:
                        typeof parsed.mastery.totalCorrect === 'number' ? parsed.mastery.totalCorrect : 0,
                    srsRecords:
                        parsed.mastery.srsRecords && typeof parsed.mastery.srsRecords === 'object'
                            ? parsed.mastery.srsRecords
                            : {},
                }),
            );

            return {
                ok: true,
                message: 'Data progres dan jadwal SRS berhasil dipulihkan!',
            };
        } catch {
            return {
                ok: false,
                message: 'Berkas JSON rusak atau tidak dapat dibaca.',
            };
        }
    }, []);

    return {
        resolvedBookmarked,
        resolvedDueSrs,
        isResolving,
        exportBackupJson,
        importBackupJson,
    };
}
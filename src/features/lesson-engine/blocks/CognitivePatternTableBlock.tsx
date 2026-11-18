// src/features/lesson-engine/blocks/CognitivePatternTableBlock.tsx
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Brain, Layers, Search, Turtle, Volume2 } from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { sanitizeTextForSpeech, useSpeechPronunciation } from '../hooks/useSpeechPronunciation';

type PatternTableData = Extract<LessonBlock, { type: 'cognitive-pattern-table' }>;
type ColumnSemanticColor = PatternTableData['columns'][number]['semanticColor'];

interface CognitivePatternTableBlockProps {
    block: PatternTableData;
    lang: LanguageCode;
}

const SEMANTIC_BADGE_STYLES: Record<ColumnSemanticColor, string> = {
    violet: 'border-violet-500/35 bg-violet-500/12 text-violet-900 dark:text-violet-200',
    cyan: 'border-cyan-500/35 bg-cyan-500/12 text-cyan-900 dark:text-cyan-200',
    amber: 'border-amber-500/35 bg-amber-500/12 text-amber-900 dark:text-amber-200',
    emerald: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-900 dark:text-emerald-200',
    rose: 'border-rose-500/35 bg-rose-500/12 text-rose-900 dark:text-rose-200',
};

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

/** Memastikan teks yang akan dibacakan benar-benar ekspresi bahasa target yang valid */
function hasValidTargetSpeech(raw: string | undefined, lang: LanguageCode): string {
    if (!raw) return '';
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '—' || trimmed === '-') return '';
    const cleaned = sanitizeTextForSpeech(trimmed, lang);
    if (!cleaned || cleaned === '—' || cleaned === '-') return '';

    if (lang === 'zh' || lang === 'ja') {
        return /[\u3040-\u30ff\u3400-\u9fff]/.test(cleaned) ? cleaned : '';
    }
    if (lang === 'ko') {
        return /[\uac00-\ud7af\u1100-\u11ff]/.test(cleaned) ? cleaned : '';
    }
    if (lang === 'ar') {
        return /[\u0600-\u06ff]/.test(cleaned) ? cleaned : '';
    }
    return /[a-zA-Z]/.test(cleaned) ? cleaned : '';
}

function resolveRowSpeechText(
    columns: PatternTableData['columns'],
    row: PatternTableData['rows'][number],
    lang: LanguageCode,
): string {
    // 1. Prioritaskan kolom yang judulnya merujuk pada contoh/kalimat/realisasi target
    const targetCol = columns.find((c) =>
        /realisasi|kalimat|contoh|sentence|example|full|bentuk|ekspresi|pola/i.test(c.roleLabel),
    );
    if (targetCol) {
        const valid = hasValidTargetSpeech(row.cells[targetCol.key]?.script, lang);
        if (valid) return valid;
    }

    // 2. Fallback: cek kolom paling kanan (umumnya kolom hasil/realisasi) ke kiri
    for (let i = columns.length - 1; i >= 0; i--) {
        const colKey = columns[i]?.key;
        if (!colKey) continue;
        const valid = hasValidTargetSpeech(row.cells[colKey]?.script, lang);
        if (valid) return valid;
    }

    return '';
}

export const CognitivePatternTableBlock: React.FC<CognitivePatternTableBlockProps> = ({
    block,
    lang,
}) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const [showReadings, setShowReadings] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');

    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    const rowSpeechList = useMemo(
        () => block.rows.map((row) => resolveRowSpeechText(block.columns, row, lang)),
        [block.columns, block.rows, lang],
    );

    const hasAnySpeakableRow = useMemo(
        () => isSupported && rowSpeechList.some((text) => text.length > 0),
        [isSupported, rowSpeechList],
    );

    const filteredRowsWithSpeech = useMemo(() => {
        const q = filterQuery.trim().toLowerCase();
        return block.rows
            .map((row, idx) => ({ row, speechText: rowSpeechList[idx] ?? '' }))
            .filter(({ row }) => {
                if (!q) return true;
                if (row.fullTranslation.toLowerCase().includes(q)) return true;
                return Object.values(row.cells).some(
                    (cell) =>
                        cell.script.toLowerCase().includes(q) ||
                        (cell.reading && cell.reading.toLowerCase().includes(q)) ||
                        (cell.gloss && cell.gloss.toLowerCase().includes(q)),
                );
            });
    }, [block.rows, rowSpeechList, filterQuery]);

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Tradisi Tata Bahasa & Kontrol Tampilan */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-semibold text-(--accent-primary)">
                        <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{block.grammaticalTradition}</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                        {block.title}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {block.rows.length > 3 && (
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute inset-s-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Saring pola..."
                                aria-label="Saring baris tabel tata bahasa"
                                className="min-h-11 rounded-xl border border-(--border-subtle) bg-(--surface-elevated) ps-8 pe-3 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
                            />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowReadings((prev) => !prev)}
                        className="veloa-tactile-btn rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3.5 text-xs font-semibold text-(--text-secondary) hover:border-(--border-strong)"
                    >
                        {showReadings ? 'Sembunyikan Transliterasi' : 'Tampilkan Transliterasi'}
                    </button>
                </div>
            </div>

            {/* Tabel Matriks Pola Kognitif */}
            <div className="overflow-x-auto rounded-2xl border border-(--border-subtle)">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-(--border-subtle) bg-(--surface-elevated)/80">
                            {block.columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-(--text-secondary)"
                                >
                                    <span
                                        className={`inline-block rounded-lg border px-2.5 py-1 ${SEMANTIC_BADGE_STYLES[col.semanticColor]}`}
                                    >
                                        {col.roleLabel}
                                    </span>
                                </th>
                            ))}
                            {hasAnySpeakableRow && (
                                <th
                                    scope="col"
                                    className="w-28 px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-(--text-muted)"
                                >
                                    Audio
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-(--border-subtle) bg-(--surface-card)">
                        {filteredRowsWithSpeech.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={block.columns.length + (hasAnySpeakableRow ? 1 : 0)}
                                    className="px-4 py-8 text-center text-sm text-(--text-muted)"
                                >
                                    Tidak ada pola yang cocok dengan pencarian “{filterQuery}”.
                                </td>
                            </tr>
                        ) : (
                            filteredRowsWithSpeech.map(({ row, speechText }) => {
                                const normalKey = `${row.id}-normal`;
                                const slowKey = `${row.id}-slow`;

                                return (
                                    <tr
                                        key={row.id}
                                        className="transition-colors hover:bg-(--surface-elevated)/40"
                                    >
                                        {block.columns.map((col, cIdx) => {
                                            const cell = row.cells[col.key];
                                            if (!cell) {
                                                return <td key={col.key} className="px-4 py-4" />;
                                            }

                                            const isLastColumn = cIdx === block.columns.length - 1;
                                            const isTargetCell =
                                                isLastColumn && hasValidTargetSpeech(cell.script, lang).length > 0;

                                            return (
                                                <td
                                                    key={col.key}
                                                    dir={isRtl && isTargetCell ? 'rtl' : 'ltr'}
                                                    className="align-top px-4 py-4"
                                                >
                                                    <div className="space-y-1.5">
                                                        <p
                                                            className={
                                                                isTargetCell
                                                                    ? `${scriptClass} text-base font-bold text-(--text-primary) sm:text-lg`
                                                                    : 'text-sm font-semibold leading-relaxed text-(--text-primary)'
                                                            }
                                                        >
                                                            {cell.script}
                                                        </p>

                                                        {showReadings && cell.reading && (
                                                            <p
                                                                dir="ltr"
                                                                className="font-mono text-xs text-(--accent-primary)"
                                                            >
                                                                {cell.reading}
                                                            </p>
                                                        )}

                                                        {cell.gloss && (
                                                            <p
                                                                dir="ltr"
                                                                className="text-xs leading-relaxed text-(--text-secondary)"
                                                            >
                                                                {cell.gloss}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}

                                        {/* Kontrol Pelafalan Eksklusif untuk Contoh / Kalimat Target */}
                                        {hasAnySpeakableRow && (
                                            <td className="align-top px-4 py-4 text-right">
                                                {speechText && (
                                                    <div className="inline-flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => speak(speechText, lang, normalKey, false)}
                                                            title="Putar kecepatan normal"
                                                            aria-label={`Putar pelafalan normal untuk ${row.fullTranslation}`}
                                                            className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === normalKey
                                                                    ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                                    : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                                                }`}
                                                        >
                                                            <Volume2 className="h-4 w-4" aria-hidden="true" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => speak(speechText, lang, slowKey, true)}
                                                            title="Putar kecepatan lambat (0.72x)"
                                                            aria-label={`Putar pelafalan lambat untuk ${row.fullTranslation}`}
                                                            className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === slowKey
                                                                    ? 'border-cyan-500 bg-cyan-600 text-white'
                                                                    : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                                                                }`}
                                                        >
                                                            <Turtle className="h-4 w-4" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Native Mindset & Literal Trap Box */}
            {block.nativeMindset && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-900 dark:text-violet-200">
                            <Brain className="h-4 w-4 shrink-0 text-violet-700 dark:text-violet-300" />
                            <span>{block.nativeMindset.headline}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-violet-950 dark:text-violet-100">
                            {block.nativeMindset.psychologyExplanation}
                        </p>
                    </div>

                    {block.nativeMindset.literalTrap && (
                        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-900 dark:text-rose-200">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300" />
                                <span>Jebakan Terjemahan Harfiah (Waspada!)</span>
                            </div>
                            <p className="text-sm leading-relaxed text-rose-950 dark:text-rose-100">
                                {block.nativeMindset.literalTrap}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
// src/features/lesson-engine/blocks/VocabularyDeckBlock.tsx
import React, { useDeferredValue, useMemo, useState } from 'react';
import {
    Bookmark,
    BookMarked,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Search,
    Turtle,
    Volume2,
} from 'lucide-react';
import type { LanguageCode, LessonBlock } from '../schema/lesson.schema';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import { useLessonProgress } from '../hooks/useLessonProgress';

type VocabularyDeckData = Extract<LessonBlock, { type: 'vocabulary-deck' }>;

interface VocabularyDeckBlockProps {
    block: VocabularyDeckData;
    lang: LanguageCode;
}

const SCRIPT_CLASS_MAP: Record<LanguageCode, string> = {
    ar: 'veloa-script-ar',
    zh: 'veloa-script-zh',
    ja: 'veloa-script-ja',
    ko: 'veloa-script-ko',
    en: 'veloa-script-en',
};

const DECK_PAGE_SIZE = 36;

export const VocabularyDeckBlock: React.FC<VocabularyDeckBlockProps> = ({ block, lang }) => {
    const { speak, speakingKey, isSupported } = useSpeechPronunciation();
    const { isEntryBookmarked, toggleEntryBookmark } = useLessonProgress();

    const [searchInput, setSearchInput] = useState('');
    const [onlyBookmarked, setOnlyBookmarked] = useState(false);
    const [flashcardHideMeaning, setFlashcardHideMeaning] = useState(false);
    const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);

    const deferredQuery = useDeferredValue(searchInput);
    const isRtl = block.direction === 'rtl' || lang === 'ar';
    const scriptClass = SCRIPT_CLASS_MAP[lang];

    const filteredEntries = useMemo(() => {
        const q = deferredQuery.trim().toLowerCase();
        return block.entries.filter((entry) => {
            if (onlyBookmarked && !isEntryBookmarked(entry.id)) {
                return false;
            }
            if (!q) return true;
            return (
                entry.term.toLowerCase().includes(q) ||
                entry.meaning.toLowerCase().includes(q) ||
                (entry.reading && entry.reading.toLowerCase().includes(q)) ||
                (entry.patternNote && entry.patternNote.toLowerCase().includes(q))
            );
        });
    }, [block.entries, deferredQuery, onlyBookmarked, isEntryBookmarked]);

    const totalPages = Math.max(1, Math.ceil(filteredEntries.length / DECK_PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedEntries = useMemo(() => {
        const start = (safePage - 1) * DECK_PAGE_SIZE;
        return filteredEntries.slice(start, start + DECK_PAGE_SIZE);
    }, [filteredEntries, safePage]);

    const toggleRevealCard = (entryId: string) => {
        setRevealedIds((prev) => ({ ...prev, [entryId]: !prev[entryId] }));
    };

    return (
        <section
            aria-label={block.title}
            className="veloa-surface-card veloa-animated-enter overflow-hidden p-6 sm:p-8"
        >
            {/* Header Bank Kosakata & Kontrol Active Recall */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-(--border-subtle) pb-5">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary-soft) px-3 py-1 text-xs font-semibold text-(--accent-primary)">
                        <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Bank Leksikon Tervalidasi</span>
                        <span className="rounded-full bg-(--surface-card) px-2 py-0.5 font-mono text-[11px] text-(--text-primary)">
                            {block.entries.length.toLocaleString('id-ID')} kata
                        </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-(--text-primary) sm:text-2xl">
                        {block.title}
                    </h3>
                </div>

                {/* Bar Kontrol Pencarian, Bookmark & Mode Flashcard */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-64">
                        <Search
                            className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Cari kata, bacaan, atau arti..."
                            aria-label="Cari kosakata"
                            className="min-h-11 w-full rounded-xl border border-(--border-subtle) bg-(--surface-elevated) ps-10 pe-4 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setOnlyBookmarked((v) => !v);
                            setCurrentPage(1);
                        }}
                        aria-pressed={onlyBookmarked}
                        className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${onlyBookmarked
                                ? 'border-amber-500 bg-amber-500 text-white'
                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                            }`}
                    >
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>Tersimpan</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setFlashcardHideMeaning((v) => !v);
                            setRevealedIds({});
                        }}
                        aria-pressed={flashcardHideMeaning}
                        className={`veloa-tactile-btn inline-flex items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold ${flashcardHideMeaning
                                ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                : 'border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) hover:border-(--border-strong)'
                            }`}
                    >
                        {flashcardHideMeaning ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                        <span>Mode Uji Hafalan</span>
                    </button>
                </div>
            </div>

            {/* Grid Kartu Kosakata */}
            {paginatedEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-(--border-strong) py-12 text-center text-sm text-(--text-muted)">
                    {onlyBookmarked
                        ? 'Belum ada kosakata yang ditandai pada modul ini.'
                        : `Tidak ada kosakata yang cocok dengan pencarian “${searchInput}”.`}
                </div>
            ) : (
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedEntries.map((entry) => {
                        const bookmarked = isEntryBookmarked(entry.id);
                        const normalAudioKey = `vocab-${entry.id}-normal`;
                        const slowAudioKey = `vocab-${entry.id}-slow`;
                        const isMeaningVisible = !flashcardHideMeaning || Boolean(revealedIds[entry.id]);

                        return (
                            <article
                                key={entry.id}
                                className="flex flex-col justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-elevated)/40 p-4 transition-colors hover:border-(--border-strong) hover:bg-(--surface-card)"
                            >
                                <div>
                                    {/* Baris Atas: Kelas Kata & Tombol Bookmark */}
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className="rounded-md bg-(--surface-card) px-2 py-0.5 text-[11px] font-semibold text-(--text-muted)">
                                            {entry.partOfSpeech}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => toggleEntryBookmark(entry.id)}
                                            aria-label={
                                                bookmarked
                                                    ? `Hapus ${entry.term} dari daftar tersimpan`
                                                    : `Simpan ${entry.term}`
                                            }
                                            aria-pressed={bookmarked}
                                            className={`veloa-tactile-btn inline-flex h-9 w-9 items-center justify-center rounded-lg border ${bookmarked
                                                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                                    : 'border-transparent text-(--text-muted) hover:bg-(--surface-card)'
                                                }`}
                                        >
                                            <Bookmark
                                                className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    {/* Istilah Utama & Pelafalan */}
                                    <div dir={isRtl ? 'rtl' : 'ltr'} className="my-1.5">
                                        <h4
                                            className={`${scriptClass} text-xl font-bold text-(--text-primary) sm:text-2xl`}
                                        >
                                            {entry.term}
                                        </h4>
                                    </div>

                                    {entry.reading && (
                                        <p className="font-mono text-xs font-medium text-(--accent-primary)">
                                            {entry.reading}
                                        </p>
                                    )}

                                    {/* Arti (Dapat disembunyikan pada Mode Uji Hafalan) */}
                                    <div className="mt-3 border-t border-(--border-subtle) pt-2.5">
                                        {isMeaningVisible ? (
                                            <div className="space-y-1">
                                                <p className="text-sm leading-relaxed text-(--text-secondary)">
                                                    {entry.meaning}
                                                </p>
                                                {entry.patternNote && (
                                                    <p className="font-mono text-[11px] text-(--text-muted)">
                                                        {entry.patternNote}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => toggleRevealCard(entry.id)}
                                                className="veloa-tactile-btn w-full rounded-xl border border-dashed border-(--border-strong) bg-(--surface-card) py-2 text-xs font-semibold text-(--accent-primary)"
                                            >
                                                Ketuk untuk membuka arti
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Audio Normal & Lambat */}
                                {isSupported && (
                                    <div className="mt-4 flex items-center justify-end gap-1.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => speak(entry.term, lang, normalAudioKey, false)}
                                            aria-label={`Dengarkan ${entry.term}`}
                                            className={`veloa-tactile-btn inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold ${speakingKey === normalAudioKey
                                                    ? 'border-(--accent-primary) bg-(--accent-primary) text-white'
                                                    : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)'
                                                }`}
                                        >
                                            <Volume2 className="h-3.5 w-3.5" />
                                            <span>Dengar</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => speak(entry.term, lang, slowAudioKey, true)}
                                            title="Putar kecepatan lambat (0.72x)"
                                            aria-label={`Dengarkan lambat ${entry.term}`}
                                            className={`veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border ${speakingKey === slowAudioKey
                                                    ? 'border-cyan-500 bg-cyan-600 text-white'
                                                    : 'border-(--border-subtle) bg-(--surface-card) text-(--text-secondary) hover:border-(--border-strong)'
                                                }`}
                                        >
                                            <Turtle className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Navigasi Paginasi Bawah */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-(--border-subtle) pt-5">
                    <p className="text-xs text-(--text-muted)">
                        Halaman <span className="font-semibold text-(--text-primary)">{safePage}</span> dari{' '}
                        <span className="font-semibold text-(--text-primary)">
                            {totalPages.toLocaleString('id-ID')}
                        </span>{' '}
                        ({filteredEntries.length.toLocaleString('id-ID')} entri)
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage(1)}
                            className="veloa-tactile-btn rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-xs font-semibold text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Awal
                        </button>

                        <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            aria-label="Halaman sebelumnya"
                            className="veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            aria-label="Halaman berikutnya"
                            className="veloa-tactile-btn inline-flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-elevated) text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="veloa-tactile-btn rounded-xl border border-(--border-subtle) bg-(--surface-elevated) px-3 text-xs font-semibold text-(--text-secondary) disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Akhir
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
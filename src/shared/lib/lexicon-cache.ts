export interface CachedLexiconEntry {
    readonly id: string;
    readonly term: string;
    readonly reading: string;
    readonly meaning: string;
    readonly partOfSpeech: string;
    readonly patternNote?: string;
    readonly exampleSentence?: string;
    readonly exampleTranslation?: string;
    /** Pre-computed lowercase search haystack untuk pencarian O(n) super cepat */
    readonly _searchIndex: string;
}

const DB_NAME = 'veloa_lexicon_store';
const STORE_NAME = 'decks';
const DB_VERSION = 1;

// L0 Memory Cache (0ms access saat pindah modul)
const memoryCache = new Map<string, readonly CachedLexiconEntry[]>();

function openLexiconDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getCachedDeck(
    cacheKey: string,
): Promise<readonly CachedLexiconEntry[] | null> {
    // 1. Cek L0 Memory Cache
    const inMem = memoryCache.get(cacheKey);
    if (inMem) return inMem;

    // 2. Cek L1 IndexedDB Persistent Storage
    try {
        const db = await openLexiconDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(cacheKey);
            req.onsuccess = () => {
                const data = req.result as CachedLexiconEntry[] | undefined;
                if (data && Array.isArray(data)) {
                    memoryCache.set(cacheKey, data);
                    resolve(data);
                } else {
                    resolve(null);
                }
            };
            req.onerror = () => reject(req.error);
        });
    } catch {
        return null;
    }
}

export async function setCachedDeck(
    cacheKey: string,
    rawEntries: readonly Omit<CachedLexiconEntry, '_searchIndex'>[],
): Promise<readonly CachedLexiconEntry[]> {
    const indexed: CachedLexiconEntry[] = rawEntries.map((item) => ({
        ...item,
        _searchIndex: `${item.term} ${item.reading} ${item.meaning} ${item.patternNote ?? ''}`.toLowerCase(),
    }));

    memoryCache.set(cacheKey, indexed);

    try {
        const db = await openLexiconDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(indexed, cacheKey);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch {
        // Tetap aman berjalan via memoryCache jika storage quota penuh / private mode
    }

    return indexed;
}
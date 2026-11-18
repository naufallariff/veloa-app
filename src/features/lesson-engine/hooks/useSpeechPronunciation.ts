// src/features/lesson-engine/hooks/useSpeechPronunciation.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LanguageCode } from '../schema/lesson.schema';

export const BCP47_MAP: Record<LanguageCode, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ar: 'ar-SA',
    ko: 'ko-KR',
};

const LANG_PREFIX_MAP: Record<LanguageCode, string[]> = {
    en: ['en-us', 'en-gb', 'en-au', 'en'],
    zh: ['zh-cn', 'cmn-hans', 'cmn', 'zh-tw', 'zh-hk', 'zh'],
    ja: ['ja-jp', 'ja'],
    ar: ['ar-sa', 'ar-eg', 'ar-ae', 'ar-001', 'ar'],
    ko: ['ko-kr', 'ko'],
};

const NATIVE_SCRIPT_REGEX: Record<Exclude<LanguageCode, 'en'>, RegExp> = {
    zh: /[\u4e00-\u9fff\u3400-\u4dbf，。！？、；：（）《》“”]+/g,
    ja: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fffー、。！？「」]+/g,
    ar: /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff،؟؛]+/g,
    ko: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f,.!?]+/g,
};

/**
 * Membersihkan & mengekstrak bagian teks yang benar-benar harus diucapkan
 * sesuai bahasa target (membuang label pembicara, catatan kurung, & simbol IPA).
 */
export function sanitizeTextForSpeech(rawText: string, lang: LanguageCode): string {
    let cleaned = rawText.trim();
    if (!cleaned) return '';

    // 1. Buang prefix nama pembicara di awal baris dialog (misal "A: ", "Tanaka: ")
    cleaned = cleaned.replace(/^[A-Za-z0-9_\u00C0-\u024F\s]{1,20}:\s+/u, '');

    // 2. Buang anotasi tambahan di dalam kurung biasa/siku yang biasanya berisi transliterasi/arti
    cleaned = cleaned.replace(/\s*[([（【][^)\]）】]*[)\]）】]/g, '');

    // 3. Buang garis miring pembungkus notasi IPA (/ə/ -> ə) & tanda stres fonetik
    cleaned = cleaned.replace(/\/([^/\s]+)\//g, '$1');
    cleaned = cleaned.replace(/[ˈˌːˑ‿͡]/g, '');

    if (lang === 'en') {
        cleaned = cleaned.replace(/\bvs\.?\b/gi, ', versus, ');
        return cleaned.replace(/\s+/g, ' ').trim();
    }

    // 4. Untuk bahasa non-Latin (zh, ja, ar, ko):
    // Jika masih ada campuran penjelasan bahasa Indonesia/Inggris setelah tanda "—" atau " - ",
    // ambil bagian aksara targetnya saja.
    cleaned = cleaned.split(/\s+[—–-]\s+/)[0] ?? cleaned;
    cleaned = cleaned.replace(/\s*(?:vs\.?|\/|\|)\s*/gi, '、');

    const scriptMatches = cleaned.match(NATIVE_SCRIPT_REGEX[lang]);
    if (scriptMatches && scriptMatches.length > 0) {
        const joined = scriptMatches.join(lang === 'ar' || lang === 'ko' ? ' ' : '');
        if (joined.trim().length > 0) {
            return joined.trim();
        }
    }

    return cleaned.replace(/\s+/g, ' ').trim();
}

function scoreVoiceQuality(voice: SpeechSynthesisVoice, prefixes: string[]): number {
    const vLang = voice.lang.toLowerCase().replace('_', '-');
    const prefixIdx = prefixes.findIndex((p) => vLang === p || vLang.startsWith(`${p}-`) || vLang.startsWith(p));
    if (prefixIdx === -1) return -1;

    let score = (prefixes.length - prefixIdx) * 100;
    const name = voice.name.toLowerCase();

    if (name.includes('natural') || name.includes('online') || name.includes('neural')) score += 45;
    if (name.includes('google')) score += 35;
    if (name.includes('microsoft') || name.includes('apple') || name.includes('siri')) score += 25;
    if (!voice.localService) score += 10;

    return score;
}

function pickBestNativeVoice(
    voices: SpeechSynthesisVoice[],
    lang: LanguageCode,
): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;
    const prefixes = LANG_PREFIX_MAP[lang];

    let bestVoice: SpeechSynthesisVoice | null = null;
    let bestScore = -1;

    for (const voice of voices) {
        const score = scoreVoiceQuality(voice, prefixes);
        if (score > bestScore) {
            bestScore = score;
            bestVoice = voice;
        }
    }

    return bestVoice;
}

export function useSpeechPronunciation() {
    const [speakingKey, setSpeakingKey] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const scheduleTimerRef = useRef<number | null>(null);
    const lastTriggerTimeRef = useRef<number>(0);

    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    useEffect(() => {
        if (!isSupported) return;

        const syncVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) {
                setVoices(available);
            }
        };

        syncVoices();
        window.speechSynthesis.addEventListener('voiceschanged', syncVoices);
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', syncVoices);
        };
    }, [isSupported]);

    const stop = useCallback(() => {
        if (scheduleTimerRef.current !== null) {
            window.clearTimeout(scheduleTimerRef.current);
            scheduleTimerRef.current = null;
        }
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setSpeakingKey(null);
    }, [isSupported]);

    const isNativeVoiceAvailable = useCallback(
        (lang: LanguageCode): boolean => {
            if (!isSupported) return false;
            const pool = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
            if (pool.length === 0) return true; // Masih memuat daftar suara OS
            return pickBestNativeVoice(pool, lang) !== null;
        },
        [isSupported, voices],
    );

    const speak = useCallback(
        (text: string, lang: LanguageCode, key: string, slow = false) => {
            if (!isSupported) return;

            // Rate-limit klik terlalu cepat (< 180ms)
            const now = Date.now();
            if (now - lastTriggerTimeRef.current < 180) return;
            lastTriggerTimeRef.current = now;

            const wasSameKey = speakingKey === key;
            stop();

            if (wasSameKey) {
                return;
            }

            const cleanSpeech = sanitizeTextForSpeech(text, lang);
            if (!cleanSpeech) return;

            // Jeda mikro 45ms mencegah bug deadlock Chromium saat cancel() diikuti speak()
            scheduleTimerRef.current = window.setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(cleanSpeech);
                utterance.lang = BCP47_MAP[lang];
                utterance.rate = slow ? 0.68 : 0.94;
                utterance.pitch = 1.0;

                const latestVoices =
                    voices.length > 0 ? voices : window.speechSynthesis.getVoices();
                const matchedVoice = pickBestNativeVoice(latestVoices, lang);

                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                    utterance.lang = matchedVoice.lang;
                }

                utterance.onstart = () => setSpeakingKey(key);
                utterance.onend = () => setSpeakingKey((prev) => (prev === key ? null : prev));
                utterance.onerror = () => setSpeakingKey((prev) => (prev === key ? null : prev));

                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }, 45);
        },
        [isSupported, speakingKey, stop, voices],
    );

    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return useMemo(
        () => ({
            speak,
            stop,
            speakingKey,
            isSupported,
            isNativeVoiceAvailable,
        }),
        [speak, stop, speakingKey, isSupported, isNativeVoiceAvailable],
    );
}
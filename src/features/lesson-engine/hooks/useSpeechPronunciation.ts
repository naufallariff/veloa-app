// src/features/lesson-engine/hooks/useSpeechPronunciation.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LanguageCode } from '../schema/lesson.schema';

const BCP47_MAP: Record<LanguageCode, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ar: 'ar-SA',
    ko: 'ko-KR',
};

const LANG_PREFIX_MAP: Record<LanguageCode, string[]> = {
    en: ['en-us', 'en-gb', 'en'],
    zh: ['zh-cn', 'cmn', 'zh-tw', 'zh-hk', 'zh'],
    ja: ['ja-jp', 'ja'],
    ar: ['ar-sa', 'ar-eg', 'ar-001', 'ar'],
    ko: ['ko-kr', 'ko'],
};

/**
 * Membersihkan teks sebelum dibacakan oleh Web Speech API agar simbol IPA
 * seperti "/ə/" atau "/æ/ vs /e/" tidak dibaca "slash slash".
 */
export function sanitizeTextForSpeech(rawText: string, lang: LanguageCode): string {
    let cleaned = rawText.trim();

    // Jika teks berformat notasi IPA murni seperti "/ə/" atau "/æ/ vs /e/",
    // hapus garis miring pembungkus agar tidak dibaca "slash"
    cleaned = cleaned.replace(/\/([^/\s]+)\//g, '$1');

    // Hapus karakter IPA yang tidak dikenali synthesizer standar
    cleaned = cleaned.replace(/[ˈˌːˑ‿͡]/g, '');

    if (lang === 'en') {
        cleaned = cleaned.replace(/\bvs\.?\b/gi, ', versus, ');
    } else {
        // Untuk CJK / Arab, pisahkan variasi dengan jeda koma agar tidak terbaca kaku
        cleaned = cleaned.replace(/\s*(?:vs\.?|\/|\|)\s*/gi, '、');
    }

    return cleaned.replace(/\s+/g, ' ').trim();
}

function pickBestNativeVoice(
    voices: SpeechSynthesisVoice[],
    lang: LanguageCode,
): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;
    const prefixes = LANG_PREFIX_MAP[lang];

    for (const prefix of prefixes) {
        // Prioritaskan suara Natural / Google / Microsoft Online terlebih dahulu
        const preferred = voices.find(
            (v) =>
                v.lang.toLowerCase().startsWith(prefix) &&
                (v.name.includes('Google') ||
                    v.name.includes('Natural') ||
                    v.name.includes('Microsoft') ||
                    v.name.includes('Apple')),
        );
        if (preferred) return preferred;

        const fallback = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
        if (fallback) return fallback;
    }

    return null;
}

export function useSpeechPronunciation() {
    const [speakingKey, setSpeakingKey] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setSpeakingKey(null);
    }, [isSupported]);

    const speak = useCallback(
        (text: string, lang: LanguageCode, key: string, slow = false) => {
            if (!isSupported) return;

            window.speechSynthesis.cancel();

            if (speakingKey === key) {
                setSpeakingKey(null);
                return;
            }

            const cleanSpeech = sanitizeTextForSpeech(text, lang);
            if (!cleanSpeech) return;

            const utterance = new SpeechSynthesisUtterance(cleanSpeech);
            utterance.lang = BCP47_MAP[lang];
            utterance.rate = slow ? 0.68 : 0.96;
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
        },
        [isSupported, speakingKey, voices],
    );

    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    return { speak, stop, speakingKey, isSupported };
}
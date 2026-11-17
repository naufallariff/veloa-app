// src/features/lesson-engine/hooks/useSpeechPronunciation.ts
import { useCallback, useEffect, useState } from 'react';
import type { LanguageCode } from '../schema/lesson.schema';

const BCP47_LOCALE_MAP: Record<LanguageCode, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ar: 'ar-SA',
    ko: 'ko-KR',
};

export interface UseSpeechPronunciationReturn {
    isSupported: boolean;
    speakingKey: string | null;
    speak: (text: string, lang: LanguageCode, key?: string, slow?: boolean) => void;
    stop: () => void;
}

export function useSpeechPronunciation(): UseSpeechPronunciationReturn {
    const [speakingKey, setSpeakingKey] = useState<string | null>(null);
    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const stop = useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setSpeakingKey(null);
    }, [isSupported]);

    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    const speak = useCallback(
        (text: string, lang: LanguageCode, key?: string, slow = false) => {
            if (!isSupported || !text.trim()) return;

            const activeId = key ?? `${lang}:${text}`;
            if (speakingKey === activeId) {
                stop();
                return;
            }

            window.speechSynthesis.cancel();

            const targetLocale = BCP47_LOCALE_MAP[lang];
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLocale;
            utterance.rate = slow ? 0.72 : 0.96;
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const matchedVoice =
                voices.find((v) => v.lang.toLowerCase() === targetLocale.toLowerCase()) ??
                voices.find((v) => v.lang.toLowerCase().startsWith(lang));

            if (matchedVoice) {
                utterance.voice = matchedVoice;
            }

            utterance.onstart = () => setSpeakingKey(activeId);
            utterance.onend = () => setSpeakingKey(null);
            utterance.onerror = () => setSpeakingKey(null);

            window.speechSynthesis.speak(utterance);
        },
        [isSupported, speakingKey, stop],
    );

    return { isSupported, speakingKey, speak, stop };
}
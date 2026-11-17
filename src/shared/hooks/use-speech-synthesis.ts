// src/shared/hooks/use-speech-synthesis.ts
import * as React from 'react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';

const BCP47_MAP: Record<LanguageCode, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ar: 'ar-SA',
    ko: 'ko-KR',
};

export function useSpeechSynthesis() {
    const [speakingText, setSpeakingText] = React.useState<string | null>(null);
    const isSupported =
        typeof window !== 'undefined' && 'speechSynthesis' in window;

    const stop = React.useCallback(() => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setSpeakingText(null);
    }, [isSupported]);

    const speak = React.useCallback(
        (text: string, lang: LanguageCode, rate = 0.92) => {
            if (!isSupported || !text.trim()) return;

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = BCP47_MAP[lang];
            utterance.rate = rate;

            utterance.onstart = () => setSpeakingText(text);
            utterance.onend = () => setSpeakingText(null);
            utterance.onerror = () => setSpeakingText(null);

            window.speechSynthesis.speak(utterance);
        },
        [isSupported],
    );

    React.useEffect(() => stop, [stop]);

    return { speak, stop, speakingText, isSupported };
}
// src/shared/hooks/use-speech-synthesis.ts
import { useCallback } from 'react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { useSpeechPronunciation } from '@/features/lesson-engine/hooks/useSpeechPronunciation';

export function useSpeechSynthesis() {
    const { speak: pronounce, stop, speakingKey, isSupported, isNativeVoiceAvailable } =
        useSpeechPronunciation();

    const speak = useCallback(
        (text: string, lang: LanguageCode, rate = 0.92) => {
            const slow = rate < 0.8;
            pronounce(text, lang, `shared-${lang}-${text}`, slow);
        },
        [pronounce],
    );

    const speakingText = speakingKey ? speakingKey.replace(/^shared-[a-z]{2}-/, '') : null;

    return { speak, stop, speakingText, isSupported, isNativeVoiceAvailable };
}
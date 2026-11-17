// src/shared/hooks/use-performance.ts
import * as React from 'react';

export function useDebouncedValue<T>(value: T, delayMs = 250): T {
    const [debounced, setDebounced] = React.useState<T>(value);

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebounced(value);
        }, delayMs);

        return () => window.clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}

export function useThrottledCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    limitMs = 150,
): (...args: Args) => void {
    const lastRunRef = React.useRef<number>(0);
    const timeoutRef = React.useRef<number | null>(null);

    return React.useCallback(
        (...args: Args) => {
            const now = Date.now();
            const remaining = limitMs - (now - lastRunRef.current);

            if (remaining <= 0) {
                if (timeoutRef.current !== null) {
                    window.clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                lastRunRef.current = now;
                callback(...args);
            } else if (timeoutRef.current === null) {
                timeoutRef.current = window.setTimeout(() => {
                    lastRunRef.current = Date.now();
                    timeoutRef.current = null;
                    callback(...args);
                }, remaining);
            }
        },
        [callback, limitMs],
    );
}
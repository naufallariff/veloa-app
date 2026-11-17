// src/shared/pwa/usePwaOffline.ts
import { useCallback, useEffect, useState } from 'react';

export interface PwaOfflineState {
    isOnline: boolean;
    hasUpdate: boolean;
    isCachingOfflinePack: boolean;
    offlinePackSavedCount: number | null;
    applyUpdate: () => void;
    cacheUrlsForOffline: (urls: readonly string[]) => void;
}

export function registerVeloaServiceWorker(onUpdateFound?: () => void): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller &&
                            onUpdateFound
                        ) {
                            onUpdateFound();
                        }
                    });
                });
            })
            .catch((err: unknown) => {
                console.warn('[Velòa PWA] Service worker registration skipped:', err);
            });
    });
}

export function usePwaOffline(): PwaOfflineState {
    const [isOnline, setIsOnline] = useState<boolean>(() =>
        typeof navigator !== 'undefined' ? navigator.onLine : true,
    );
    const [hasUpdate, setHasUpdate] = useState<boolean>(false);
    const [isCachingOfflinePack, setIsCachingOfflinePack] = useState<boolean>(false);
    const [offlinePackSavedCount, setOfflinePackSavedCount] = useState<number | null>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const handleSwMessage = (event: MessageEvent) => {
            const data = event.data as { type?: string; count?: number } | undefined;
            if (data?.type === 'PRECACHE_COMPLETE') {
                setIsCachingOfflinePack(false);
                setOfflinePackSavedCount(typeof data.count === 'number' ? data.count : 0);
            }
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleSwMessage);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleSwMessage);
            }
        };
    }, []);

    const applyUpdate = useCallback(() => {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg?.waiting) {
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            } else {
                setHasUpdate(false);
            }
        });
    }, []);

    const cacheUrlsForOffline = useCallback((urls: readonly string[]) => {
        if (!('serviceWorker' in navigator) || urls.length === 0) return;

        setIsCachingOfflinePack(true);
        setOfflinePackSavedCount(null);

        navigator.serviceWorker.ready
            .then((reg) => {
                reg.active?.postMessage({
                    type: 'PRECACHE_URLS',
                    urls: [...urls],
                });
            })
            .catch(() => {
                setIsCachingOfflinePack(false);
            });
    }, []);

    return {
        isOnline,
        hasUpdate,
        isCachingOfflinePack,
        offlinePackSavedCount,
        applyUpdate,
        cacheUrlsForOffline,
    };
}
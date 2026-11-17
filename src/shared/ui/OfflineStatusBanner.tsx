// src/shared/ui/OfflineStatusBanner.tsx
import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import { usePwaOffline } from '@/shared/pwa/usePwaOffline';

export const OfflineStatusBanner: React.FC = () => {
    const { isOnline, hasUpdate, applyUpdate } = usePwaOffline();

    if (isOnline && !hasUpdate) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="border-b border-(--border-subtle) bg-(--surface-elevated) px-4 py-2 text-xs text-(--text-primary)"
        >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
                {!isOnline ? (
                    <div className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
                        <WifiOff className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Mode Offline Aktif — Modul yang telah dibuka dan kartu latihan SRS tetap dapat
                            digunakan secara penuh.
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 font-medium text-(--accent-primary)">
                        <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                        <span>Pembaruan kurikulum dan fitur Velòa tersedia.</span>
                    </div>
                )}

                {hasUpdate && (
                    <button
                        type="button"
                        onClick={applyUpdate}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-(--accent-primary) px-3 text-[11px] font-bold text-white"
                    >
                        <RefreshCw className="h-3 w-3" />
                        <span>Muat Ulang Versi Baru</span>
                    </button>
                )}
            </div>
        </div>
    );
};
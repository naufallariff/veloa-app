// src/shared/ui/ErrorPages.tsx
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, ArrowLeft, Compass, Lock, RefreshCw, ShieldAlert } from 'lucide-react';

interface ErrorViewProps {
    code: '401' | '403' | '404';
    title: string;
    description: string;
    onGoHome: () => void;
    onOpenAuth?: () => void;
}

export const StatusErrorPage: React.FC<ErrorViewProps> = ({
    code,
    title,
    description,
    onGoHome,
    onOpenAuth,
}) => {
    const Icon = code === '403' ? ShieldAlert : code === '401' ? Lock : Compass;

    return (
        <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--accent-primary-soft) text-(--accent-primary)">
                <Icon className="h-8 w-8" />
            </div>

            <span className="mt-4 rounded-full border border-(--border-subtle) bg-(--surface-elevated) px-3 py-1 font-mono text-xs font-extrabold text-(--accent-primary)">
                HTTP {code}
            </span>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-(--text-primary)">
                {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{description}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={onGoHome}
                    className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-card) px-4 py-2.5 text-xs font-bold text-(--text-primary) hover:border-(--accent-primary)"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke Beranda</span>
                </button>

                {code === '401' && onOpenAuth && (
                    <button
                        type="button"
                        onClick={onOpenAuth}
                        className="veloa-tactile-btn inline-flex items-center gap-2 rounded-xl bg-(--accent-primary) px-5 py-2.5 text-xs font-bold text-white"
                    >
                        <Lock className="h-4 w-4" />
                        <span>Masuk / Daftar Akun</span>
                    </button>
                )}
            </div>
        </div>
    );
};

interface BoundaryProps {
    children: ReactNode;
}

interface BoundaryState {
    hasError: boolean;
    errorMessage: string;
}

export class AppErrorBoundary extends Component<BoundaryProps, BoundaryState> {
    public state: BoundaryState = {
        hasError: false,
        errorMessage: '',
    };

    public static getDerivedStateFromError(error: Error): BoundaryState {
        return { hasError: true, errorMessage: error.message || 'Terjadi kesalahan tak terduga.' };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[Veloa ErrorBoundary]:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-(--surface-canvas) p-6 text-center">
                    <div className="veloa-surface-card max-w-md space-y-4 p-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-extrabold text-(--text-primary)">
                            Terjadi Gangguan Tampilan
                        </h2>
                        <p className="text-xs leading-relaxed text-(--text-secondary)">
                            Komponen mengalami kendala saat dirender. Data belajar lokal Anda tetap aman.
                        </p>
                        <pre className="overflow-x-auto rounded-lg bg-(--surface-elevated) p-2.5 text-start font-mono text-[11px] text-rose-600">
                            {this.state.errorMessage}
                        </pre>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="veloa-tactile-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent-primary) px-4 py-2.5 text-xs font-bold text-white"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Muat Ulang Aplikasi</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
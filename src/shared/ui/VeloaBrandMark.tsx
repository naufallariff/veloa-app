// src/shared/ui/VeloaBrandMark.tsx
import React, { useId } from 'react';

interface VeloaBrandMarkProps {
    showWordmark?: boolean;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
    sm: { box: 'h-8 w-8 rounded-xl', svg: 'h-4.5 w-4.5', title: 'text-base' },
    md: { box: 'h-10 w-10 rounded-2xl', svg: 'h-5.5 w-5.5', title: 'text-lg' },
    lg: { box: 'h-12 w-12 rounded-2xl', svg: 'h-6.5 w-6.5', title: 'text-xl' },
};

export const VeloaBrandMark: React.FC<VeloaBrandMarkProps> = ({
    showWordmark = true,
    subtitle,
    size = 'md',
}) => {
    const gradId = useId();
    const shimmerId = useId();
    const dims = SIZE_MAP[size];

    return (
        <div className="inline-flex items-center gap-3 select-none">
            {/* Liquid Glass Prism Emblem */}
            <div
                className={`relative flex shrink-0 items-center justify-center overflow-hidden shadow-sm ${dims.box}`}
                style={{
                    background:
                        'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #A78BFA 100%)',
                    boxShadow:
                        '0 6px 16px -4px rgba(124, 58, 237, 0.42), inset 0 1px 0 0 rgba(255, 255, 255, 0.45)',
                }}
            >
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={dims.svg}
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id={gradId} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="65%" stopColor="#EDE9FE" />
                            <stop offset="100%" stopColor="#7DD3FC" />
                        </linearGradient>
                        <linearGradient id={shimmerId} x1="16" y1="6" x2="27" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>

                    {/* Left Primary Ribbon Stroke of "V" */}
                    <path
                        d="M7.5 8.5C9.2 8.5 10.6 9.5 11.3 11.1L16 21.8L13.6 25.5C12.9 26.5 11.4 26.4 10.9 25.3L5.6 12.7C4.8 10.8 6.0 8.5 7.5 8.5Z"
                        fill={`url(#${gradId})`}
                    />

                    {/* Right Translucent Linguistic Wave Stroke of "V" */}
                    <path
                        d="M24.5 8.5C22.8 8.5 21.4 9.5 20.7 11.1L14.3 25.2C13.8 26.3 15.2 27.1 16.1 26.2L26.2 13.4C27.5 11.7 26.5 8.5 24.5 8.5Z"
                        fill={`url(#${shimmerId})`}
                    />

                    {/* Orbital Resonance Dot (Accented "ò" mark) */}
                    <circle cx="16" cy="7.5" r="2.1" fill="#FFFFFF" />
                </svg>
            </div>

            {showWordmark && (
                <div className="flex flex-col leading-none">
                    <span
                        className={`font-extrabold tracking-tight text-(--text-primary) ${dims.title}`}
                    >
                        Vel<span className="text-(--accent-primary)">ò</span>a
                    </span>
                    {subtitle && (
                        <span className="mt-1 text-[11px] font-medium tracking-wide text-(--text-muted)">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
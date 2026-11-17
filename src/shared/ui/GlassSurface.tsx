import * as React from 'react';

export type GlassWeight = 'thin' | 'regular' | 'thick';

export interface GlassSurfaceProps extends React.ComponentPropsWithRef<'div'> {
    readonly weight?: GlassWeight;
    readonly interactive?: boolean;
    readonly radius?: 'md' | 'lg' | 'xl' | 'full';
    readonly as?: 'div' | 'section' | 'article' | 'header' | 'aside';
}

const RADIUS_MAP: Record<NonNullable<GlassSurfaceProps['radius']>, string> = {
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
    xl: 'rounded-[28px]',
    full: 'rounded-full',
};

export function GlassSurface({
    weight = 'regular',
    interactive = false,
    radius = 'lg',
    as: Component = 'div',
    className = '',
    ref,
    children,
    ...props
}: GlassSurfaceProps) {
    const classes = [
        'liquid-glass',
        `liquid-glass--${weight}`,
        interactive ? 'liquid-glass--interactive' : '',
        RADIUS_MAP[radius],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Component ref={ref as never} className={classes} {...props}>
            {children}
        </Component>
    );
}



import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';


const spinnerVariants = cva('items-center justify-center', {
    variants: {
        show: {
            true: 'flex flex-col',
            false: 'hidden',
        },
    },
    defaultVariants: {
        show: true,
    },
});

const loaderVariants = cva('animate-spin text-primary', {
    variants: {
        size: {
            small: 'size-6',
            medium: 'size-8',
            large: 'size-12',
        },
    },
    defaultVariants: {
        size: 'medium',
    },
});

interface SpinnerContentProps
    extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
    className?: string;
    children?: React.ReactNode;
    /** Optional label override for screen readers */
    srText?: string;
}

export function Spinner({
    size,
    show,
    children,
    className,
    srText = 'Loading...',
}: SpinnerContentProps) {
    return (
        <span
            className={spinnerVariants({ show })}
            role="status"
            aria-live="polite"
            aria-hidden={!show}
        >
            <Loader2
                className={cn(loaderVariants({ size }), className)}
                aria-hidden="true" // Icon is decorative
            />
            {children}
            <span className="sr-only">{srText}</span>
        </span>
    );
}
'use client';

interface ButtonSpinnerProps {
    className?: string;
}

export const ButtonSpinner = ({ className = 'border-white' }: ButtonSpinnerProps) => (
    <div
        className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${className}`}
        aria-hidden="true"
    />
);
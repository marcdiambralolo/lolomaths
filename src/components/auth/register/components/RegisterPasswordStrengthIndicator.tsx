'use client';
import { memo } from 'react';

const PASSWORD_STRENGTH_CONFIG = {
    0: { color: 'bg-gray-200', text: '', textColor: '' },
    1: { color: 'bg-red-500', text: 'Faible', textColor: 'text-red-800' },
    2: { color: 'bg-orange-500', text: 'Moyen', textColor: 'text-orange-600' },
    3: { color: 'bg-yellow-500', text: 'Bon', textColor: 'text-yellow-600' },
    4: { color: 'bg-green-500', text: 'Excellent', textColor: 'text-green-600' },
} as const;

interface PasswordStrengthIndicatorProps {
    strength: number;
}

export const RegisterPasswordStrengthIndicator = memo<PasswordStrengthIndicatorProps>(({ strength }) => {
    const config = PASSWORD_STRENGTH_CONFIG[strength as keyof typeof PASSWORD_STRENGTH_CONFIG];

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">Force</span>
                <span className={`text-[10px] font-bold ${config.textColor}`}>
                    {config.text}
                </span>
            </div>

            <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${level <= strength ? config.color : 'bg-gray-200 dark:bg-gray-700'}`}
                    />
                ))}
            </div>
        </div>
    );
});
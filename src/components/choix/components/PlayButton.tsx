'use client';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { ButtonSpinner } from './ButtonSpinner';

interface PlayButtonProps {
    isSufficient: boolean;
    isPending: boolean;
    onClick: () => void;
}

export const PlayButton = memo(({ isSufficient, isPending, onClick }: PlayButtonProps) => {
    const isEnabled = isSufficient && !isPending;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!isEnabled}
            aria-busy={isPending}
            aria-label={isPending ? 'Chargement en cours...' : 'Jouer maintenant'}
            className={`
        w-full h-14 rounded-xl text-xl font-bold flex items-center justify-center gap-3
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${isEnabled
                    ? 'bg-gradient-to-r from-green-500 via-green-700 to-green-600 text-white shadow-md active:scale-[0.99] cursor-pointer'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-60'
                }
      `}
        >
            {isPending ? (
                <>
                    <ButtonSpinner className="border-white" />
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    <span>Jouer Maintenant</span>
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </>
            )}
        </button>
    );
});
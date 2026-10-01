'use client';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { memo } from 'react';
import { ButtonSpinner } from './ButtonSpinner';

interface MarketButtonProps {
    isPending: boolean;
    onClick: () => void;
}

export const MarketButton = memo(({ onClick, isPending }: MarketButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={isPending ? 'Chargement en cours...' : 'Acquérir des jetons'}
        className={`
      w-full h-13 my-3 flex items-center justify-center gap-3 rounded-xl border-2 
      border-[#DDE7FA] bg-blue-600 text-base font-semibold text-white
      dark:border-[#2E5AA6]/45 dark:bg-[#0F1C3F]/35 dark:text-[#9BC2FF]
      transition-all duration-200 p-4
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
    >
        {isPending ? (
            <>
                <ButtonSpinner className="border-[#2E5AA6] dark:border-[#9BC2FF]" />
                <span>Chargement en cours...</span>
            </>
        ) : (
            <>
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                <span className='text-xl font-bold'>Acquérir des jetons</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
        )}
    </button>
));
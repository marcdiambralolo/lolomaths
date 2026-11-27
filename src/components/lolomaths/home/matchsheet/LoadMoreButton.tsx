'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import { memo } from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  remainingCount: number;
  isLoading: boolean;
}

const LoadMoreButton = memo(
  ({ onClick, remainingCount, isLoading }: LoadMoreButtonProps) => {
    const safeRemaining =
      typeof remainingCount === 'number' && Number.isFinite(remainingCount)
        ? Math.max(0, Math.floor(remainingCount))
        : 0;

    if (!isLoading && safeRemaining <= 0) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        aria-busy={isLoading}
        className="w-full py-3 mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        )}

        {isLoading
          ? 'Chargement...'
          : `Voir plus (${safeRemaining} restantes)`}
      </button>
    );
  }
);

LoadMoreButton.displayName = 'LoadMoreButton';

export default LoadMoreButton;
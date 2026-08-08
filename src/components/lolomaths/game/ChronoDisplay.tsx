// components/game/ChronoDisplay.tsx
'use client';

import React from 'react';

interface ChronoDisplayProps {
  formattedTime: string;
  isWarning?: boolean;
  className?: string;
}

export const ChronoDisplay: React.FC<ChronoDisplayProps> = ({
  formattedTime,
  isWarning = false,
  className = '',
}) => {
  return (
    <div
      role="timer"
      aria-live="polite"
      className={`font-mono text-xl md:text-2xl font-bold px-4 py-2 rounded-lg tracking-wider transition-colors border ${
        isWarning
          ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse'
          : 'bg-slate-900 text-emerald-400 border-slate-700'
      } ${className}`}
    >
      ⏱️ {formattedTime}
    </div>
  );
};
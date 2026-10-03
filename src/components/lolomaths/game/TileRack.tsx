'use client';

import React, { memo, useCallback } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { StateCase, UneCase } from '@/lib/interfaces';
import { isOperateur } from './competitionEngine';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';

export const TileRack: React.FC = memo(() => {
  const pions = useCompetitionStore((state) => state.pions);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  const numbers = pions.filter((p) => p.tca === 2);
  const operators = pions.filter((p) => p.tca === 3);

  const renderPion = useCallback(
    (pion: UneCase) => {
      const isSelected = pion.etat === StateCase.Choi;
      const isUsed = pion.etat === StateCase.Cre;

      const background = isSelected
        ? theme.hoverPawnBgColor
        : theme.normalPawnBgColor;

      return (
        <button
          key={`pion-${pion.placep}-${pion.txt}`}
          type="button"
          onClick={() => handleCaseClick(pion)}
          disabled={isUsed}
          className="flex items-center justify-center rounded-md border font-mono font-black transition-opacity"
          style={{
            width: 'clamp(32px, 8vw, 44px)',
            height: 'clamp(32px, 8vw, 44px)',
            fontSize: 'clamp(12px, 2.4vw, 16px)',
            backgroundColor: isUsed ? 'transparent' : background,
            borderColor: isUsed ? 'transparent' : theme.normalPawnBgColor,
            color: isUsed ? 'transparent' : '#ffffff',
            opacity: isUsed ? 0 : 1,
            cursor: isUsed ? 'not-allowed' : 'pointer',
          }}
          title={`Jeton ${pion.txt} (position ${pion.placep})`}
          aria-label={`Jeton ${pion.txt}`}
        >
          {!isUsed && pion.txt}
        </button>
      );
    },
    [handleCaseClick, theme]
  );

  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-auto select-none">
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
        {numbers.length > 0 ? (
          numbers.map(renderPion)
        ) : (
          <div className="col-span-6 text-center text-xs font-semibold text-slate-500 italic py-2">
            Plus de nombres disponibles
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
        {operators.length > 0 ? (
          operators.map(renderPion)
        ) : (
          <div className="col-span-4 text-center text-xs font-semibold text-slate-500 italic py-2">
            Plus d&apos;opérateurs disponibles
          </div>
        )}
      </div>
    </div>
  );
});

TileRack.displayName = 'TileRack';
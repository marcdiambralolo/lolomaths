'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { BoardTheme, StateCase, UneCase } from '@/lib/interfaces';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';

interface RackPionProps {
  pion: UneCase;
  theme: BoardTheme;
  onClick: (pion: UneCase) => void;
}

const RackPionBase: React.FC<RackPionProps> = ({ pion, theme, onClick }) => {
  const isSelected = pion.etat === StateCase.Choi;
  const isUsed = pion.etat === StateCase.Cre;

  const background = isSelected
    ? theme.hoverPawnBgColor
    : theme.normalPawnBgColor;

  const handleClick = useCallback(() => {
    onClick(pion);
  }, [onClick, pion]);

  return (
    <button
      type="button"
      onClick={handleClick}
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
      aria-label={`Jeton ${pion.txt}${isSelected ? ' sélectionné' : ''}`}
    >
      {!isUsed && pion.txt}
    </button>
  );
};

/**
 * Comparateur personnalisé : ne re-render que si une propriété utilisée change.
 * Évite de re-render les pions inchangés quand un autre pion change d'état.
 */
const RackPion = memo(RackPionBase, (prev, next) => {
  return (
    prev.pion.placep === next.pion.placep &&
    prev.pion.txt === next.pion.txt &&
    prev.pion.etat === next.pion.etat &&
    prev.theme === next.theme &&
    prev.onClick === next.onClick
  );
});

RackPion.displayName = 'RackPion';

export const TileRack: React.FC = memo(() => {
  const pions = useCompetitionStore((state) => state.pions);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  const numbers = useMemo(() => pions.filter((p) => p.tca === 2), [pions]);
  const operators = useMemo(() => pions.filter((p) => p.tca === 3), [pions]);

  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-auto select-none">
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
        {numbers.length > 0 ? (
          numbers.map((pion) => (
            <RackPion
              key={`num-${pion.placep}`}
              pion={pion}
              theme={theme}
              onClick={handleCaseClick}
            />
          ))
        ) : (
          <div className="col-span-6 text-center text-xs font-semibold text-slate-500 italic py-2">
            Plus de nombres disponibles
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
        {operators.length > 0 ? (
          operators.map((pion) => (
            <RackPion
              key={`op-${pion.placep}`}
              pion={pion}
              theme={theme}
              onClick={handleCaseClick}
            />
          ))
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
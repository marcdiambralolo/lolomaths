'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { TypeCase, UneCase } from '@/lib/interfaces';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { RackPion } from './RackPion';
import { useGameStore } from '@/lib/store/useGameStore';

// ============================================================
// COMPOSANT : TileRack (Rack de 6 Nombres x 4 Opérateurs)
// ============================================================

export const TileRack: React.FC = memo(() => {
  const pions = useGameStore((state) => state.pions);
  const handleCaseClick = useGameStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  const numbers = useMemo(
    () => pions.filter((p) => p.tca === TypeCase.PionChiffre),
    [pions]
  );
  const operators = useMemo(
    () => pions.filter((p) => p.tca === TypeCase.PionOperateur),
    [pions]
  );

  const onPionClick = useCallback(
    (pion: UneCase) => handleCaseClick(pion),
    [handleCaseClick]
  );

  const isRackEmpty = pions.length === 0;

  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-auto select-none">
      {isRackEmpty ? (
        <div className="text-center text-xs font-semibold text-slate-500 italic py-4">
          Aucun pion disponible
        </div>
      ) : (
        <>
          {/* ---------- RANGÉE DES NOMBRES (6 COLONNES) ---------- */}
          <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50 justify-items-center">
            {numbers.length > 0 ? (
              numbers.map((pion) => (
                <RackPion
                  key={`num-${pion.placep}`}
                  pion={pion}
                  theme={theme}
                  onClick={onPionClick}
                />
              ))
            ) : (
              <div className="col-span-6 text-center text-xs font-semibold text-slate-500 italic py-2">
                Plus de nombres disponibles
              </div>
            )}
          </div>

          {/* ---------- RANGÉE DES OPÉRATEURS (4 COLONNES) ---------- */}
          <div className="grid grid-cols-4 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50 justify-items-center">
            {operators.length > 0 ? (
              operators.map((pion) => (
                <RackPion
                  key={`op-${pion.placep}`}
                  pion={pion}
                  theme={theme}
                  onClick={onPionClick}
                />
              ))
            ) : (
              <div className="col-span-4 text-center text-xs font-semibold text-slate-500 italic py-2">
                Plus d&apos;opérateurs disponibles
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});

TileRack.displayName = 'TileRack';
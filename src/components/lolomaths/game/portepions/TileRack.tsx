'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { TypeCase, UneCase } from '@/lib/interfaces';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { RackPion } from './RackPion';

// ============================================================
// COMPOSANT
// ============================================================

export const TileRack: React.FC = memo(() => {
  const pions = useCompetitionStore((state) => state.pions);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  // ✅ On sépare chiffres et opérateurs via TypeCase (plus de 2/3 magiques)
  const numbers = useMemo(
    () => pions.filter((p) => p.tca === TypeCase.PionChiffre),
    [pions]
  );
  const operators = useMemo(
    () => pions.filter((p) => p.tca === TypeCase.PionOperateur),
    [pions]
  );

  // ✅ On stabilise le callback pour éviter de re-render tous les pions
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
          {/* ---------- RANGÉE DES NOMBRES ---------- */}
          <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
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

          {/* ---------- RANGÉE DES OPÉRATEURS ---------- */}
          <div className="grid grid-cols-4 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
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
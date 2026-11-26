'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { StateCase, TypeCase, UneCase } from '@/lib/interfaces';
import { useGameStore } from '@/lib/store/useGameStore';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { RackPion } from './RackPion';

const NUMBER_SLOTS = 6;
const OPERATOR_SLOTS = 6;

type RackSlot =
  | { type: 'pion'; pion: UneCase }
  | { type: 'empty'; placep: number };

function buildSlots(
  pions: UneCase[],
  count: number,
  offset: number
): RackSlot[] {
  return Array.from({ length: count }, (_, index) => {
    const placep = offset + index;
    const pion = pions.find((p) => p.placep === placep);

    if (pion && (pion.etat === StateCase.Pla || pion.etat === StateCase.Choi)) {
      return { type: 'pion', pion };
    }

    return { type: 'empty', placep };
  });
}

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

  const numberSlots = useMemo(
    () => buildSlots(numbers, NUMBER_SLOTS, 0),
    [numbers]
  );

  const operatorSlots = useMemo(
    () => buildSlots(operators, OPERATOR_SLOTS, NUMBER_SLOTS),
    [operators]
  );

  const onPionClick = useCallback(
    (pion: UneCase) => {
      handleCaseClick(pion);
    },
    [handleCaseClick]
  );

  const handleEmptySlotClick = useCallback(
    (placep: number, tca: TypeCase) => {
      handleCaseClick({
        ncase: -1,
        indi: 0,
        indj: 0,
        txt: '',
        itxt: '',
        etat: StateCase.Cre,
        tca,
        placep,
      });
    },
    [handleCaseClick]
  );

  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-900/90 border border-slate-800 shadow-xl w-full max-w-md mx-auto select-none">
      {/* Rangée des nombres */}
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50 justify-items-center">
        {numberSlots.map((slot, index) =>
          slot.type === 'pion' ? (
            <RackPion
              key={`num-${slot.pion.placep ?? index}`}
              pion={slot.pion}
              theme={theme}
              onClick={onPionClick}
            />
          ) : (
            <button
              key={`num-empty-${slot.placep}`}
              type="button"
              onClick={() =>
                handleEmptySlotClick(slot.placep, TypeCase.PionChiffre)
              }
              className="w-full h-full min-h-[44px] rounded-xl border border-dashed border-slate-700/50 hover:border-slate-600/70 transition-colors"
              aria-label={`Emplacement nombre vide ${index + 1}`}
            />
          )
        )}
      </div>

      {/* Rangée des opérateurs */}
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50 justify-items-center">
        {operatorSlots.map((slot, index) =>
          slot.type === 'pion' ? (
            <RackPion
              key={`op-${slot.pion.placep ?? index}`}
              pion={slot.pion}
              theme={theme}
              onClick={onPionClick}
            />
          ) : (
            <button
              key={`op-empty-${slot.placep}`}
              type="button"
              onClick={() =>
                handleEmptySlotClick(slot.placep, TypeCase.PionOperateur)
              }
              className="w-full h-full min-h-[44px] rounded-xl border border-dashed border-slate-700/50 hover:border-slate-600/70 transition-colors"
              aria-label={`Emplacement opérateur vide ${index + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
});

TileRack.displayName = 'TileRack';
'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { TypeCase, UneCase, StateCase } from '@/lib/interfaces';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { RackPion } from './RackPion';
import { useGameStore } from '@/lib/store/useGameStore';

const NUMBER_SLOTS = 6;
const OPERATOR_SLOTS = 6;

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

  // 🔥 On affiche un bouton vide si le pion n'existe pas OU s'il est posé (Cre)
  const numberSlots = useMemo(() => {
    return Array.from({ length: NUMBER_SLOTS }, (_, index) => {
      const pion = numbers.find((p) => p.placep === index);
      // Si le pion existe ET qu'il est disponible (Pla ou Choi), on l'affiche
      if (pion && (pion.etat === StateCase.Pla || pion.etat === StateCase.Choi)) {
        return { type: 'pion' as const, pion };
      }
      // Sinon (pion absent ou posé sur le plateau), on affiche un emplacement vide
      return { type: 'empty' as const, placep: index };
    });
  }, [numbers]);

  const operatorSlots = useMemo(() => {
    return Array.from({ length: OPERATOR_SLOTS }, (_, index) => {
      const placep = NUMBER_SLOTS + index;
      const pion = operators.find((p) => p.placep === placep);
      if (pion && (pion.etat === StateCase.Pla || pion.etat === StateCase.Choi)) {
        return { type: 'pion' as const, pion };
      }
      return { type: 'empty' as const, placep };
    });
  }, [operators]);

  // 🔥 Clic sur un emplacement vide : simule un clic sur une case virtuelle
  const handleEmptySlotClick = useCallback(
    (placep: number, tca: TypeCase) => {
      const virtualCase: UneCase = {
        ncase: -1,
        indi: 0,
        indj: 0,
        txt: '',
        itxt: '',
        etat: StateCase.Cre, // Cre = "posé/utilisé" pour simuler un emplacement vide
        tca,
        placep,
      };
      handleCaseClick(virtualCase);
    },
    [handleCaseClick]
  );

  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-900/90 border border-slate-800 shadow-xl w-full max-w-md mx-auto select-none">
      {/* ---------- RANGÉE DES NOMBRES ---------- */}
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50 justify-items-center">
        {numberSlots.map((slot, index) =>
          slot.type === 'pion' ? (
            <RackPion
              key={`num-${index}`}
              pion={slot.pion}
              theme={theme}
              onClick={onPionClick}
            />
          ) : (
            <button
              key={`num-empty-${index}`}
              type="button"
              onClick={() => handleEmptySlotClick(slot.placep, TypeCase.PionChiffre)}
              className="w-full h-full min-h-[44px] rounded-xl border border-dashed border-slate-700/50 hover:border-slate-600/70 transition-colors"
              aria-label={`Emplacement vide ${index + 1}`}
            />
          )
        )}
      </div>

      {/* ---------- RANGÉE DES OPÉRATEURS ---------- */}
      <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50 justify-items-center">
        {operatorSlots.map((slot, index) =>
          slot.type === 'pion' ? (
            <RackPion
              key={`op-${index}`}
              pion={slot.pion}
              theme={theme}
              onClick={onPionClick}
            />
          ) : (
            <button
              key={`op-empty-${index}`}
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
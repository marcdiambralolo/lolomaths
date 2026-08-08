import React from 'react';

import { START_CASE_INDEX, isOperateur } from './competitionEngine';
import { UneCase, StateCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

export const OplaGrid: React.FC = () => {
  const { grid, handleCaseClick } = useCompetitionStore();

  /**
   * Calcule les classes CSS en fonction de l'état et du contenu de la case
   */
  const getCaseStyles = (cell: UneCase): string => {
    const isStart = cell.ncase === START_CASE_INDEX;

    // Case verrouillée des tours précédents (Lo)
    if (cell.etat === StateCase.Lo) {
      return 'bg-slate-700 border-slate-600 text-slate-200 font-bold shadow-inner cursor-not-allowed';
    }

    // Case avec pion déposé pendant le tour courant (Pla)
    if (cell.etat === StateCase.Pla) {
      return isOperateur(cell.txt)
        ? 'bg-amber-500 border-amber-600 text-slate-950 font-black shadow-md hover:bg-amber-400'
        : 'bg-sky-500 border-sky-600 text-white font-extrabold shadow-md hover:bg-sky-400';
    }

    // Case sélectionnée (Choi)
    if (cell.etat === StateCase.Choi) {
      return 'bg-yellow-400 border-yellow-500 text-slate-950 font-black scale-105 z-10 shadow-lg ring-2 ring-yellow-300';
    }

    // Case de départ centrale (Index 110) en attente d'un pion
    if (isStart && cell.txt === '') {
      return 'bg-amber-500/20 border-amber-500/60 text-amber-400 font-bold hover:bg-amber-500/30';
    }

    // Case plateau standard avec son nombre cible (Cre)
    return 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold';
  };

  return (
    <div id="opla"
      className="w-full h-full  p-0 bg-slate-900/90 flex justify-center items-start"
    >
      <div className="w-full inline-grid grid-cols-[repeat(13,minmax(0,1fr))] gap-0 select-none">
        {grid.map((row, j) =>
          row.map((cell, i) => {
            const isStart = cell.ncase === START_CASE_INDEX;

            return (
              <button
                key={`case-${j}-${i}`}
                onClick={() => handleCaseClick(cell)}
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9
                  flex items-center justify-center
                  border rounded-md text-[10px] sm:text-xs md:text-sm font-mono
                  transition-all duration-150 active:scale-95
                  ${getCaseStyles(cell)}
                `}
                title={`Case (${i}, ${j}) - ID: ${cell.ncase} - Valeur: ${cell.txt || 'Départ'}`}
              >
                {cell.txt !== '' ? cell.txt : isStart ? '★' : ''}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
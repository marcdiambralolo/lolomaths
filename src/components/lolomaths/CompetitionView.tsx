import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import React, { useState } from 'react';
import { Fdialog } from './Fdialog';
import { Board } from './game/Board';
import { TileRack } from './game/TileRack';
 

export const CompetitionView: React.FC = () => {
  const {
    grid,
    pions,
    handleCaseClick,
    resetPions,
    scoreTotal,
    directionsValid,
    gameResults,
    confirmCalculation,
  } = useCompetitionStore();

  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(null);

  const numbers = pions.filter((p) => p.tca === 2);
  const operators = pions.filter((p) => p.tca === 3);

  const handleOpenDialog = (index: number) => {
    setSelectedDirectionIndex(index);
  };

  const handleAcceptDialog = () => {
    if (selectedDirectionIndex !== null) {
      confirmCalculation(selectedDirectionIndex);
      setSelectedDirectionIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 gap-6">
      {/* En-tête Score */}
      <div className="flex justify-between items-center w-full max-w-2xl bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Score Total</span>
          <span className="text-2xl font-bold text-emerald-400">{scoreTotal} pts</span>
        </div>

        <button
          onClick={resetPions}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 font-semibold text-sm rounded-lg transition"
        >
          Réinitialiser le tour
        </button>
      </div>

      {/* Plateau */}
      <Board grid={grid} onCaseClick={handleCaseClick} />

      {/* Boutons directionnels de validation (déclenchent Fdialog) */}
      {(directionsValid.left || directionsValid.right || directionsValid.up || directionsValid.down) && (
        <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          {directionsValid.left && (
            <button
              onClick={() => handleOpenDialog(2)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
            >
              ← Voir calcul Gauche
            </button>
          )}
          {directionsValid.right && (
            <button
              onClick={() => handleOpenDialog(3)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
            >
              Voir calcul Droite →
            </button>
          )}
        </div>
      )}

      {/* Porte-Pions */}
      {/* <TileRack numbers={numbers} operators={operators} onPionClick={handleCaseClick} /> */}

      {/* Fenêtre Modale de validation */}
      <Fdialog
        isOpen={selectedDirectionIndex !== null}
        gameResult={selectedDirectionIndex !== null ? gameResults[selectedDirectionIndex] : null}
        onAccept={handleAcceptDialog}
        onCancel={() => setSelectedDirectionIndex(null)}
      />
    </div>
  );
};
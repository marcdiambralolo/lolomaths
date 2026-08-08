"use client"
import { useChrono } from '@/hooks/lolomaths/useChrono';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { isStartCaseCovered } from '@/components/lolomaths/game/competitionEngine';
import React, { useEffect, useState } from 'react';
import { Fdialog } from '../Fdialog';
import { OplaGrid } from '../game/OplaGrid';
import { TileRack } from '../TileRack';

export const CompetitionScreen: React.FC = () => {
  const {
    initGame, confirmCalculation, resetPions,
    scoreTotal, cnbjeu, directionsValid, gameResults, flatGrid
  } = useCompetitionStore();

  const [showResultZone, setShowResultZone] = useState<boolean>(false);
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(null);
  const [infoSwitch, setInfoSwitch] = useState<boolean>(true);

  const chrono = useChrono({
    initialSeconds: 300,
    autoStart: false,
    onTimeUp: () => {
      setShowResultZone(true);
    },
  });

  useEffect(() => {
    initGame(
      ['12', '5', '3', '20', '8', '2'],
      ['+', '-', '*', '/']
    );
    chrono.start();
  }, [initGame]);

  const handleResetRound = () => {
    resetPions();
  };

  const handleOpenDialog = (index: number) => {
    setSelectedDirectionIndex(index);
  };

  const handleAcceptCalculation = () => {
    if (selectedDirectionIndex !== null) {
      confirmCalculation(selectedDirectionIndex);
      setSelectedDirectionIndex(null);
    }
  };

  const isStartCovered = isStartCaseCovered(flatGrid);

  return (
    <div className="w-full mx-auto max-w-md mt-2 flex flex-col select-none">
      <div className="flex flex-col gap-2">
        {!showResultZone ? (
          <div id="zcom" className="flex flex-col gap-2">
            <OplaGrid />
            <TileRack />
            {!isStartCovered && (
              <div className="p-2 text-center text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                ⚠️ Placez un pion sur la case de départ centrale (★) pour pouvoir effectuer un calcul.
              </div>
            )}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                Coups joués : <span className="text-amber-400">{cnbjeu}</span>
              </div>
              <div className="font-mono font-black text-2xl text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-1 rounded-xl">
                {chrono.formattedTime}
              </div>
              <button
                onClick={handleResetRound}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition active:scale-95"
              >
                REFAIRE
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="text-xs text-slate-500 block uppercase font-medium">Score Total (scoma)</span>
                <span className="text-xl font-black text-emerald-400">{scoreTotal} pts</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="text-xs text-slate-500 block uppercase font-medium">Match en cours (mcour)</span>
                <span className="text-xl font-black text-sky-400">N° {cnbjeu + 1}</span>
              </div>
            </div>
            {isStartCovered && (directionsValid.left || directionsValid.right || directionsValid.up || directionsValid.down) && (
              <div className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-pulse">
                {directionsValid.left && (
                  <button
                    onClick={() => handleOpenDialog(2)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md"
                  >
                    ← Valider Gauche ({gameResults[2]?.notedjeu} pts)
                  </button>
                )}
                {directionsValid.right && (
                  <button
                    onClick={() => handleOpenDialog(3)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md"
                  >
                    Valider Droite ({gameResults[3]?.notedjeu} pts) →
                  </button>
                )}
                {directionsValid.up && (
                  <button
                    onClick={() => handleOpenDialog(0)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md"
                  >
                    ↑ Valider Haut ({gameResults[0]?.notedjeu} pts)
                  </button>
                )}
                {directionsValid.down && (
                  <button
                    onClick={() => handleOpenDialog(1)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md"
                  >
                    ↓ Valider Bas ({gameResults[1]?.notedjeu} pts)
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-end p-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
                <span>Aide visuelle </span>
                <input
                  type="checkbox"
                  checked={infoSwitch}
                  onChange={(e) => setInfoSwitch(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6 text-center shadow-2xl max-w-lg mx-auto my-auto">
            <h3 className="text-2xl font-black text-amber-400">Match Terminé !</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
              Fin du temps réglementaire. Bravo pour votre participation !
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-500 block uppercase font-medium">Score Final</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">{scoreTotal} pts</span>
            </div>
            <button
              onClick={() => {
                setShowResultZone(false);
                initGame(['12', '5', '3', '20', '8', '2'], ['+', '-', '*', '/']);
                chrono.reset(300);
                chrono.start();
              }}
              className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg"
            >
              RECOMMENCER UN MATCH
            </button>
          </div>
        )}
      </div>
      <Fdialog
        isOpen={selectedDirectionIndex !== null}
        gameResult={selectedDirectionIndex !== null ? gameResults[selectedDirectionIndex] : null}
        onAccept={handleAcceptCalculation}
        onCancel={() => setSelectedDirectionIndex(null)}
      />
    </div>
  );
};
import { GameResult } from '@/lib/interfaces';
import React from 'react';

interface FdialogProps {
  isOpen: boolean;
  gameResult: GameResult | null;
  onAccept: () => void;
  onCancel: () => void;
}

export const Fdialog: React.FC<FdialogProps> = ({
  isOpen,
  gameResult,
  onAccept,
  onCancel,
}) => {
  if (!isOpen || !gameResult) return null;

  const ecartAbsolu = Math.abs(gameResult.nbreatind - gameResult.result);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* En-tête */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-amber-400">
            Détail du calcul
          </h3>
          <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-mono">
            Combinaison : {gameResult.combine}
          </span>
        </div>

        {/* Contenu principal */}
        <div className="p-6 flex flex-col gap-3 font-mono text-sm text-slate-200">
          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Nombre à atteindre :</span>
            <span className="font-bold text-sky-400">{gameResult.nbreatind}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Résultat du calcul :</span>
            <span className="font-bold text-indigo-400">{gameResult.result}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Écart :</span>
            <span className={`font-bold ${ecartAbsolu === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {ecartAbsolu}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Note de base :</span>
            <span className={`font-bold ${gameResult.notedbase === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {gameResult.notedbase} pt{Math.abs(gameResult.notedbase) > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-800">
            <span className="text-slate-400">Total Bonus :</span>
            <span className="font-bold text-amber-400">+{gameResult.bonus}</span>
          </div>

          <div className="flex justify-between items-center pt-3 text-base">
            <span className="font-bold text-slate-100 uppercase tracking-wide">
              Note obtenue :
            </span>
            <span className="text-2xl font-black text-emerald-400 font-sans">
              {gameResult.notedjeu} pts
            </span>
          </div>
        </div>

        {/* Boutons d'action (Accept / Cancel) */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-sm transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            Valider le coup
          </button>
        </div>
      </div>
    </div>
  );
};
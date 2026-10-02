"use client";

import React, { useEffect, useCallback } from "react";
import { GameResult } from "@/lib/interfaces";

interface FdialogProps {
  isOpen: boolean;
  gameResult: GameResult | null;
  onAccept: () => void;
  onCancel: () => void;
}

interface ScoreRowProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

const ScoreRow: React.FC<ScoreRowProps> = ({ label, value, valueClassName = "text-slate-200" }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
    <span className="text-slate-400">{label}</span>
    <span className={`font-bold ${valueClassName}`}>{value}</span>
  </div>
);

export const Fdialog: React.FC<FdialogProps> = ({
  isOpen,
  gameResult,
  onAccept,
  onCancel,
}) => {
  // Fermeture lors de l'appui sur la touche Échap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Empêche le défilement en arrière-plan
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !gameResult) return null;

  const ecartAbsolu = Math.abs(gameResult.nbreatind - gameResult.result);
  const isPerfect = ecartAbsolu === 0;

  // Formatage propre des nombres
  const formattedScore = Number.isInteger(gameResult.notedjeu)
    ? gameResult.notedjeu
    : gameResult.notedjeu.toFixed(1);

  const formattedBaseNote = Number.isInteger(gameResult.notedbase)
    ? gameResult.notedbase
    : gameResult.notedbase.toFixed(1);

  const formattedBonus = Number.isInteger(gameResult.bonus)
    ? gameResult.bonus
    : gameResult.bonus.toFixed(1);

  return (
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Évite la fermeture lors d'un clic à l'intérieur de la boîte
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* En-tête */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 id="dialog-title" className="text-lg font-bold text-amber-400">
            Détail du calcul
          </h3>
          <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-mono font-semibold">
            Combinaison : {gameResult.combine}
          </span>
        </div>

        {/* Contenu principal */}
        <div className="p-6 flex flex-col gap-1 font-mono text-sm">
          <ScoreRow
            label="Nombre à atteindre :"
            value={gameResult.nbreatind}
            valueClassName="text-sky-400 font-bold"
          />

          <ScoreRow
            label="Résultat du calcul :"
            value={gameResult.result}
            valueClassName="text-indigo-400 font-bold"
          />

          <ScoreRow
            label="Écart :"
            value={ecartAbsolu}
            valueClassName={isPerfect ? "text-emerald-400" : "text-rose-400"}
          />

          <ScoreRow
            label="Note de base :"
            value={`${formattedBaseNote} pt${Math.abs(gameResult.notedbase) > 1 ? "s" : ""}`}
            valueClassName={gameResult.notedbase >= 0 ? "text-emerald-400" : "text-rose-400"}
          />

          <ScoreRow
            label="Total Bonus :"
            value={`+${formattedBonus}`}
            valueClassName="text-amber-400"
          />

          {/* Résultat Final */}
          <div className="flex justify-between items-center pt-4 mt-2 text-base border-t border-slate-700/50">
            <span className="font-bold text-slate-100 uppercase tracking-wide">
              Note obtenue :
            </span>
            <span className="text-2xl font-black text-emerald-400 font-sans tracking-tight">
              {formattedScore} pts
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Valider le coup
          </button>
        </div>
      </div>
    </div>
  );
};
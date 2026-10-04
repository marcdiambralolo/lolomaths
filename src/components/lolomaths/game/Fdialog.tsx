'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { GameResult } from '@/lib/interfaces';

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

const ScoreRow: React.FC<ScoreRowProps> = ({
  label,
  value,
  valueClassName = 'text-slate-200',
}) => (
  <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
    <span className="text-slate-400">{label}</span>
    <span className={`font-bold ${valueClassName}`}>{value}</span>
  </div>
);

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Fdialog: React.FC<FdialogProps> = ({
  isOpen,
  gameResult,
  onAccept,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const acceptButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ============================================================
  // Gestion du focus : sauvegarde, restauration, focus initial
  // ============================================================
  useEffect(() => {
    if (!isOpen) return;

    // Sauvegarde de l'élément actif avant ouverture
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus sur le bouton "Valider" à l'ouverture
    const timeoutId = setTimeout(() => {
      acceptButtonRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(timeoutId);

      // Restaure le focus à la fermeture
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  // ============================================================
  // Gestion clavier : Escape + focus trap (Tab / Shift+Tab)
  // ============================================================
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusables = dialog.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        // Focus trap : boucle entre premier et dernier élément
        if (e.shiftKey) {
          if (active === first || !dialog.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !dialog.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onCancel]
  );

  // ============================================================
  // Effet : attache le listener + bloque le scroll du body
  // ============================================================
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !gameResult) return null;

  const ecartAbsolu = Math.abs(gameResult.nbreatind - gameResult.result);
  const isPerfect = ecartAbsolu === 0;

  // Formatage propre avec 2 chiffres après la virgule (toFixed(2))
  const formattedScore = typeof gameResult.notedjeu === 'number'
    ? gameResult.notedjeu.toFixed(2)
    : '0.00';

  const formattedResult = typeof gameResult.result === 'number'
    ? gameResult.result.toFixed(2)
    : '0.00';

  const formattedEcart = ecartAbsolu.toFixed(2);

  const formattedBaseNote = typeof gameResult.notedbase === 'number'
    ? gameResult.notedbase.toFixed(2)
    : '0.00';

  const formattedBonus = typeof gameResult.bonus === 'number'
    ? gameResult.bonus.toFixed(2)
    : '0.00';

  return (
    <div
      role="presentation"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* En-tête */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h3 id="dialog-title" className="text-lg font-bold text-amber-400">
            Détail du calcul
          </h3>
          <span
            className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-mono font-semibold"
            aria-label={`Combinaison ${gameResult.combine}`}
          >
            Combinaison : {gameResult.combine}
          </span>
        </div>

        {/* Banner d'état du coup */}
        <div
          id="dialog-description"
          className={`px-6 py-2 text-xs font-semibold uppercase tracking-wider flex justify-between items-center ${
            isPerfect
              ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-b border-amber-500/20'
          }`}
        >
          <span>{isPerfect ? 'Coup Parfait' : "Coup Inexact (Pénalité d'écart)"}</span>
          <span>{isPerfect ? 'Bonus Activés' : 'Bonus = 0'}</span>
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
            value={formattedResult}
            valueClassName="text-indigo-400 font-bold"
          />

          <ScoreRow
            label="Écart :"
            value={formattedEcart}
            valueClassName={
              isPerfect
                ? 'text-emerald-400 font-bold'
                : 'text-rose-400 font-bold'
            }
          />

          <ScoreRow
            label="Note de base :"
            value={`${gameResult.notedbase > 0 ? '+' : ''}${formattedBaseNote} pt${
              Math.abs(gameResult.notedbase) > 1 ? 's' : ''
            }`}
            valueClassName={
              gameResult.notedbase >= 0
                ? 'text-emerald-400 font-bold'
                : 'text-rose-400 font-bold'
            }
          />

          <ScoreRow
            label="Total Bonus :"
            value={`+${formattedBonus}`}
            valueClassName={
              gameResult.bonus > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'
            }
          />

          {/* Résultat Final */}
          <div className="flex justify-between items-center pt-4 mt-2 text-base border-t border-slate-700/50">
            <span className="font-bold text-slate-100 uppercase tracking-wide">
              Note obtenue :
            </span>
            <span
              className={`text-2xl font-black font-sans tracking-tight ${
                gameResult.notedjeu >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {gameResult.notedjeu > 0 ? `+${formattedScore}` : formattedScore} pts
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
            ref={acceptButtonRef}
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
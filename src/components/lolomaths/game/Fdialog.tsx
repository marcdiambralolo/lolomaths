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

interface BonusBreakdown {
  levelBonus: number;
  levelThreshold: number;
  placedCountBonus: number;
  mulDivBonus: number;
  totalBonus: number;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MUL_DIV_CHARS = new Set(['*', '/', '×', '÷']);

function formatNumber(value: unknown, decimals = 2): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(decimals)
    : (0).toFixed(decimals);
}

function formatSignedNumber(value: number, decimals = 2): string {
  const formatted = formatNumber(value, decimals);
  return value > 0 ? `+${formatted}` : formatted;
}

function getLevelThreshold(niveau: GameResult['niveau']): number {
  switch (niveau) {
    case 'Min':
      return 30;
    case 'Cad':
      return 100;
    case 'Jun':
      return 200;
    case 'Sen':
    default:
      return 300;
  }
}

function computeBonusBreakdown(
  gameResult: GameResult,
  isPerfect: boolean
): BonusBreakdown {
  const levelThreshold = getLevelThreshold(gameResult.niveau);

  if (!isPerfect) {
    return {
      levelBonus: 0,
      levelThreshold,
      placedCountBonus: 0,
      mulDivBonus: 0,
      totalBonus: 0,
    };
  }

  const targetValue = Number(gameResult.nbreatind) || 0;
  const levelBonus = targetValue >= levelThreshold ? 1 : 0;

  const sequenceCount = Array.isArray(gameResult.sequenceNcases)
    ? gameResult.sequenceNcases.length
    : 0;
  const placedCountBonus = sequenceCount > 6 ? sequenceCount - 6 : 0;

  const combineStr = String(gameResult.combine ?? '');
  let mulDivBonus = 0;
  for (const ch of combineStr) {
    if (MUL_DIV_CHARS.has(ch)) {
      mulDivBonus += 1;
    }
  }

  const explicitBonus =
    typeof gameResult.bonus === 'number' && Number.isFinite(gameResult.bonus)
      ? Math.max(0, gameResult.bonus)
      : null;

  const computedSum = levelBonus + placedCountBonus + mulDivBonus;
  const totalBonus = explicitBonus ?? computedSum;

  return {
    levelBonus,
    levelThreshold,
    placedCountBonus,
    mulDivBonus,
    totalBonus,
  };
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

export const Fdialog: React.FC<FdialogProps> = ({
  isOpen,
  gameResult,
  onAccept,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const acceptButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    acceptButtonRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

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

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !gameResult) return null;

  const targetValue = Number(gameResult.nbreatind) || 0;
  const computedResult = Number(gameResult.result) || 0;
  const ecartAbsolu = Math.abs(targetValue - computedResult);
  const isPerfect = ecartAbsolu === 0;

  const baseNote = isPerfect ? 5 : -ecartAbsolu;
  const breakdown = computeBonusBreakdown(gameResult, isPerfect);
  const totalGameNote = baseNote + breakdown.totalBonus;

  const formattedScore = formatSignedNumber(totalGameNote);
  const formattedResult = formatNumber(computedResult);
  const formattedEcart = formatNumber(ecartAbsolu);
  const formattedBaseNote = formatSignedNumber(baseNote);

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

        <div
          id="dialog-description"
          className={`px-6 py-2 text-xs font-semibold uppercase tracking-wider flex justify-between items-center ${
            isPerfect
              ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-b border-amber-500/20'
          }`}
        >
          <span>
            {isPerfect ? 'Coup Parfait' : "Coup Inexact (Pénalité d'écart)"}
          </span>
          <span>{isPerfect ? 'Bonus Activés' : 'Bonus = 0'}</span>
        </div>

        <div className="p-6 flex flex-col gap-1 font-mono text-sm">
          <ScoreRow
            label="Nombre à atteindre :"
            value={targetValue}
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
            value={`${formattedBaseNote} pt${Math.abs(baseNote) > 1 ? 's' : ''}`}
            valueClassName={
              baseNote >= 0
                ? 'text-emerald-400 font-bold'
                : 'text-rose-400 font-bold'
            }
          />

          <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-sans font-semibold">
              Détail des bonus
            </span>

            <ScoreRow
              label={`Seuil niveau (${gameResult.niveau ?? 'Sen'} ≥ ${breakdown.levelThreshold}) :`}
              value={`+${formatNumber(breakdown.levelBonus)}`}
              valueClassName={
                breakdown.levelBonus > 0 ? 'text-amber-400' : 'text-slate-500'
              }
            />

            <ScoreRow
              label="Plus de 6 pions :"
              value={`+${formatNumber(breakdown.placedCountBonus)}`}
              valueClassName={
                breakdown.placedCountBonus > 0
                  ? 'text-amber-400'
                  : 'text-slate-500'
              }
            />

            <ScoreRow
              label="Multiplication / Division :"
              value={`+${formatNumber(breakdown.mulDivBonus)}`}
              valueClassName={
                breakdown.mulDivBonus > 0 ? 'text-amber-400' : 'text-slate-500'
              }
            />
          </div>

          <ScoreRow
            label="Total Bonus :"
            value={`+${formatNumber(breakdown.totalBonus)}`}
            valueClassName={
              breakdown.totalBonus > 0
                ? 'text-amber-400 font-bold'
                : 'text-slate-500'
            }
          />

          <div className="flex justify-between items-center pt-4 mt-2 text-base border-t border-slate-700/50">
            <span className="font-bold text-slate-100 uppercase tracking-wide">
              Note obtenue :
            </span>
            <span
              className={`text-2xl font-black font-sans tracking-tight ${
                totalGameNote >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formattedScore} pts
            </span>
          </div>
        </div>

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
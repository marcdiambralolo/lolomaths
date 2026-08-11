'use client';
import React from 'react';
import { START_CASE_INDEX, isOperateur } from './competitionEngine';
import { UneCase, StateCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

export const OplaGrid: React.FC = () => {
  const { grid, handleCaseClick, cnbjeu } = useCompetitionStore();

  const getCaseStyles = (cell: UneCase): string => {
    const isStart = cell.ncase === START_CASE_INDEX;
    const isNumeric = !isOperateur(cell.txt) && cell.txt !== '';

    if (cell.etat === StateCase.Lo) {
      return [
        'bg-slate-700 border-slate-600 text-slate-300',
        'font-bold shadow-inner cursor-not-allowed',
        'opacity-70'
      ].join(' ');
    }

    if (cell.etat === StateCase.Choi) {
      return [
        'bg-yellow-400 border-yellow-500 text-slate-950',
        'font-black scale-105 z-10 shadow-lg ring-2 ring-yellow-300',
        'animate-pulse'
      ].join(' ');
    }

    if (cell.etat === StateCase.Pla) {
      const isNumberPion = isNumeric;

      if (isNumberPion) {
        return [
          'bg-gradient-to-br from-sky-500 to-sky-600',
          'border-sky-400 text-white font-extrabold',
          'shadow-md hover:from-sky-400 hover:to-sky-500',
          'hover:scale-105 transition-all duration-150'
        ].join(' ');
      } else {
        return [
          'bg-gradient-to-br from-amber-500 to-amber-600',
          'border-amber-400 text-slate-950 font-black',
          'shadow-md hover:from-amber-400 hover:to-amber-500',
          'hover:scale-105 transition-all duration-150'
        ].join(' ');
      }
    }

    if (isStart) {
      if (cell.txt === '') {
        return [
          'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
          'border-amber-500/60 text-amber-400 font-bold',
          'hover:bg-amber-500/30 hover:border-amber-400',
          'transition-all duration-150'
        ].join(' ');
      } else {
        return [
          'bg-gradient-to-br from-amber-500/30 to-amber-600/20',
          'border-amber-500/80 text-amber-300 font-bold',
          'shadow-inner'
        ].join(' ');
      }
    }

    return [
      'bg-slate-900/80 border-slate-800',
      'text-slate-400 font-semibold',
      'hover:bg-slate-800 hover:border-slate-700 hover:text-white',
      'hover:scale-105 transition-all duration-150',
      'cursor-pointer'
    ].join(' ');
  };

  const isCaseInteractive = (cell: UneCase): boolean => {
    if (cell.etat === StateCase.Lo) return false;
    if (cell.etat === StateCase.Cre) return true;
    return true;
  };

  const renderCellContent = (cell: UneCase): string => {
    const isStart = cell.ncase === START_CASE_INDEX;

    if (cell.txt !== '') {
      return cell.txt;
    }

    if (isStart) {
      return '★';
    }

    return '';
  };

  return (
    <div id="opla" className="w-full bg-blue">
      <div
        className="w-full inline-grid grid-cols-[repeat(13,minmax(0,1fr))] gap-0 select-none"
        style={{ aspectRatio: '13/17' }}
      >
        {grid.map((row, j) =>
          row.map((cell, i) => {
            const isStart = cell.ncase === START_CASE_INDEX;
            const isInteractive = isCaseInteractive(cell);
            const content = renderCellContent(cell);

            return (
              <button
                key={`case-${j}-${i}`}
                onClick={() => isInteractive && handleCaseClick(cell)}
                disabled={!isInteractive}
                className={`
                  w-full h-full
                  flex items-center justify-center
                  border text-[10px] sm:text-xs md:text-sm font-mono
                  transition-all duration-150
                  ${isInteractive ? 'active:scale-95' : ''}
                  ${getCaseStyles(cell)}
                `}
                title={`Case (${i}, ${j}) - ID: ${cell.ncase} - État: ${cell.etat} - Valeur: ${content || 'vide'}`}
                data-row={j}
                data-col={i}
                data-state={cell.etat}
                data-locked={cell.etat === StateCase.Lo}
              >
                {content}

                {cell.etat === StateCase.Lo && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 bg-slate-500 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                )}

                {isStart && cell.txt !== '' && (
                  <span
                    className="absolute -bottom-1 -left-1 text-[6px] text-amber-500/50"
                    aria-hidden="true"
                  >
                    ⚡
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
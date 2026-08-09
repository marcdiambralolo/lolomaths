import React from 'react';

import { START_CASE_INDEX, isOperateur } from './competitionEngine';
import { UneCase, StateCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

export const OplaGrid: React.FC = () => {
  const { grid, handleCaseClick, cnbjeu } = useCompetitionStore();

  /**
   * Calcule les classes CSS en fonction de l'état et du contenu de la case
   */
  const getCaseStyles = (cell: UneCase): string => {
    const isStart = cell.ncase === START_CASE_INDEX;
    const isNumeric = !isOperateur(cell.txt) && cell.txt !== '';

    // --- État Lo (Verrouillé) ---
    if (cell.etat === StateCase.Lo) {
      return [
        'bg-slate-700 border-slate-600 text-slate-300',
        'font-bold shadow-inner cursor-not-allowed',
        'opacity-70'
      ].join(' ');
    }

    // --- État Choi (Sélectionné) ---
    if (cell.etat === StateCase.Choi) {
      return [
        'bg-yellow-400 border-yellow-500 text-slate-950',
        'font-black scale-105 z-10 shadow-lg ring-2 ring-yellow-300',
        'animate-pulse'
      ].join(' ');
    }

    // --- État Pla (Pion placé pendant le tour courant) ---
    if (cell.etat === StateCase.Pla) {
      // Vérifier si c'est un nombre (tca=2) ou opérateur (tca=3) depuis le placep
      const isNumberPion = isNumeric;
      
      if (isNumberPion) {
        return [
          'bg-gradient-to-br from-sky-500 to-sky-600',
          'border-sky-400 text-white font-extrabold',
          'shadow-md hover:from-sky-400 hover:to-sky-500',
          'hover:scale-105 transition-all duration-150'
        ].join(' ');
      } else {
        // Opérateur
        return [
          'bg-gradient-to-br from-amber-500 to-amber-600',
          'border-amber-400 text-slate-950 font-black',
          'shadow-md hover:from-amber-400 hover:to-amber-500',
          'hover:scale-105 transition-all duration-150'
        ].join(' ');
      }
    }

    // --- État Cre (Vide / Disponible) ---

    // Case de départ centrale (Index 110)
    if (isStart) {
      if (cell.txt === '') {
        // Case de départ vide
        return [
          'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
          'border-amber-500/60 text-amber-400 font-bold',
          'hover:bg-amber-500/30 hover:border-amber-400',
          'transition-all duration-150'
        ].join(' ');
      } else {
        // Case de départ occupée
        return [
          'bg-gradient-to-br from-amber-500/30 to-amber-600/20',
          'border-amber-500/80 text-amber-300 font-bold',
          'shadow-inner'
        ].join(' ');
      }
    }

    // Case plateau standard avec son nombre cible
    return [
      'bg-slate-900/80 border-slate-800',
      'text-slate-400 font-semibold',
      'hover:bg-slate-800 hover:border-slate-700 hover:text-white',
      'hover:scale-105 transition-all duration-150',
      'cursor-pointer'
    ].join(' ');
  };

  /**
   * Détermine si une case est interactive
   */
  const isCaseInteractive = (cell: UneCase): boolean => {
    // Les cases Lo ne sont pas interactives
    if (cell.etat === StateCase.Lo) return false;
    
    // Les cases vides avec un nombre cible sont interactives
    if (cell.etat === StateCase.Cre) return true;
    
    // Les cases avec un pion sont interactives (sauf Lo)
    return true;
  };

  /**
   * Rendu du contenu de la case
   */
  const renderCellContent = (cell: UneCase): string => {
    const isStart = cell.ncase === START_CASE_INDEX;
    
    // Afficher le texte si présent
    if (cell.txt !== '') {
      return cell.txt;
    }
    
    // Case de départ vide : afficher ★
    if (isStart) {
      return '★';
    }
    
    // Case vide standard
    return '';
  };

  return (
    <div 
      id="opla"
      className="w-full p-2 bg-slate-950/50 rounded-xl border border-slate-800 shadow-2xl"
    >
      <div 
        className="w-full inline-grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 select-none"
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
                  border rounded-md text-[10px] sm:text-xs md:text-sm font-mono
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
                
                {/* Indicateur visuel pour les cases avec pion Lo */}
                {cell.etat === StateCase.Lo && (
                  <span 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-slate-500 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                )}
                
                {/* Indicateur pour la case de départ quand elle est couverte */}
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
      
      {/* Légende du plateau */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600" />
          <span>Verrouillé (Lo)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-yellow-400 border border-yellow-500" />
          <span>Sélectionné (Choi)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-sky-500 border border-sky-400" />
          <span>Nombre</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
          <span>Opérateur</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-900/80 border border-slate-800" />
          <span>Vide (Cre)</span>
        </span>
        <span className="flex items-center gap-1 text-amber-500">
          <span>★</span>
          <span>Départ</span>
        </span>
      </div>
      
      {/* Informations sur le nombre de jeux */}
      <div className="mt-1 text-center text-[10px] text-slate-600">
        Jeu #{cnbjeu + 1} • Pions placés: {
          grid.flat().filter(c => c.etat === StateCase.Pla || c.etat === StateCase.Choi).length
        }
      </div>
    </div>
  );
};
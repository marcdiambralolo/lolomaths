// components/history/TournamentCard.tsx
'use client';

import React from 'react';
 
import { calculateDuration } from '@/lib/utils/date';
import { TournamentSummary } from '@/lib/interfaces';

interface TournamentCardProps {
  tournament: TournamentSummary;
  onDelete: (id: string) => Promise<void>;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onDelete }) => {
  const matchTimeText = tournament.matchTime === '-1' 
    ? 'Indéterminé' 
    : `${tournament.matchTime} mn/match`;

  const durationText = tournament.endedAt && tournament.startedAt
    ? calculateDuration(tournament.startedAt, tournament.endedAt)
    : 'En cours';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Tournoi n° {tournament.tournamentNumber} - {tournament.playerName}
        </h3>
        <button
          onClick={() => onDelete(tournament.id)}
          className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium p-1"
          aria-label="Supprimer le tournoi"
        >
          Supprimer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
        <p><strong>Niveau :</strong> {tournament.level + 1}</p>
        <p><strong>Temps de jeu :</strong> {matchTimeText}</p>
        <p><strong>Mode temps :</strong> {tournament.isGlobalTime ? 'Global' : 'Par match'}</p>
        <p><strong>Nombre de jeux :</strong> {tournament.gamesPerMatch}</p>
        <p><strong>Nombre de matchs :</strong> {tournament.totalMatches}</p>
        <p><strong>Score :</strong> {tournament.totalScore ?? 'xxx'}</p>
      </div>

      {tournament.isGameOver && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 space-y-1">
          <p>Début : {new Date(tournament.startedAt).toLocaleString()}</p>
          <p>Fin : {tournament.endedAt ? new Date(tournament.endedAt).toLocaleString() : '-'}</p>
          <p>Durée écoulée : {durationText}</p>
        </div>
      )}
    </div>
  );
};
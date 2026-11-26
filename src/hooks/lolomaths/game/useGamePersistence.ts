import { useEffect, useRef } from 'react';
import {
  GameRecord,
  MatchRecord,
  TournamentRecord,
} from '@/lib/interfaces';
import { useGameStore } from '@/lib/store/useGameStore';
import { useHistoryStore } from '@/lib/store/useHistoryStore';

// ============================================================
// HELPERS
// ============================================================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface LolomathsConfig {
  nomjoueur?: string;
  numtournoi?: string;
  numeromatch?: string;
  couleurs?: number;
  nbmatch?: number;
  tempsmatch?: string;
  tpsglobal?: number;
  niveau?: number;
  nombredejeu?: number;
}

function readLolomathsConfig(): LolomathsConfig {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('lolomaths_config');
    if (!raw) return {};
    return JSON.parse(raw) as LolomathsConfig;
  } catch {
    return {};
  }
}

function gameResultToRecord(
  result: NonNullable<
    ReturnType<typeof useGameStore.getState>['lastConfirmedResult']
  >,
  matchId: string,
  tournamentId: string,
  numjeu: number,
  niveau: number
): GameRecord {
  return {
    id: generateId('game'),
    matchId,
    tournamentId,
    numjeu,
    combinaison: result.combine,
    sequencePions: result.sequenceNcases.join(','),
    cible: result.nbreatind,
    resultat: result.result,
    notedebase: result.notedbase,
    bonus: result.bonus,
    notejeu: result.notedjeu,
    niveau,
    dateCreation: new Date().toISOString(),
  };
}

// ============================================================
// HOOK
// ============================================================

/**
 * Enregistre automatiquement les tournois, matchs et jeux dans l'historique
 * aux étapes clés du cycle de vie.
 */
export function useGamePersistence() {
  const currentTournamentId = useGameStore((s) => s.currentTournamentId);
  const currentMatchId = useGameStore((s) => s.currentMatchId);
  const matchIndex = useGameStore((s) => s.matchIndex);
  const numeromatch = useGameStore((s) => s.numeromatch);
  const cnbjeu = useGameStore((s) => s.cnbjeu);
  const nombredejeu = useGameStore((s) => s.nombredejeu);
  const niveau = useGameStore((s) => s.niveau);
  const scoreTotal = useGameStore((s) => s.scoreTotal);
  const isMatchOver = useGameStore((s) => s.isMatchOver);
  const lastConfirmedResult = useGameStore((s) => s.lastConfirmedResult);

  const startTournament = useGameStore((s) => s.startTournament);
  const startMatch = useGameStore((s) => s.startMatch);
  const endMatch = useGameStore((s) => s.endMatch);
  const endTournament = useGameStore((s) => s.endTournament);

  const saveTournament = useHistoryStore((s) => s.saveTournament);
  const saveMatch = useHistoryStore((s) => s.saveMatch);
  const saveGame = useHistoryStore((s) => s.saveGame);

  const initializedRef = useRef(false);
  const lastSavedGameKeyRef = useRef<string | null>(null);
  const matchStartDateRef = useRef<string | null>(null);
  const processedMatchEndsRef = useRef<Set<string>>(new Set());
  const scoredMatchIdsRef = useRef<Set<string>>(new Set());

  // ============================================================
  // 1. DÉMARRAGE DU TOURNOI (UNE FOIS)
  // ============================================================
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (currentTournamentId) {
      if (!matchStartDateRef.current) {
        matchStartDateRef.current = new Date().toISOString();
      }
      return;
    }

    const config = readLolomathsConfig();
    const now = new Date().toISOString();
    matchStartDateRef.current = now;

    startTournament({
      nomjoueur: config.nomjoueur ?? 'Joueur',
      numtournoi: config.numtournoi ?? config.numeromatch ?? '123456789',
      niveau,
      couleurs: config.couleurs ?? 0,
      nombredejeu: config.nombredejeu ?? nombredejeu,
      nbmatch: config.nbmatch ?? 1,
      tempsmatch: config.tempsmatch ?? '5',
      tpsglobal: config.tpsglobal ?? 0,
    });

    const tournamentId = useGameStore.getState().currentTournamentId;
    if (tournamentId) {
      const emptyTournament: TournamentRecord = {
        id: tournamentId,
        nomjoueur: config.nomjoueur ?? 'Joueur',
        numtournoi: config.numtournoi ?? config.numeromatch ?? '123456789',
        niveau,
        couleurs: config.couleurs ?? 0,
        nombredejeu: config.nombredejeu ?? nombredejeu,
        nbmatch: config.nbmatch ?? 1,
        tempsmatch: config.tempsmatch ?? '5',
        tpsglobal: config.tpsglobal ?? 0,
        isgameover: false,
        score: 0,
        datedebut: now,
        datefin: null,
        matchs: [],
      };
      saveTournament(emptyTournament);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Met à jour la date de début quand un nouveau match démarre
  useEffect(() => {
    if (!currentMatchId) return;
    if (!matchStartDateRef.current) {
      matchStartDateRef.current = new Date().toISOString();
    }
  }, [currentMatchId]);

  // ============================================================
  // 2. ENREGISTREMENT D'UN JEU CONFIRMÉ
  // ============================================================
  useEffect(() => {
    if (!lastConfirmedResult || !currentTournamentId || !currentMatchId) {
      return;
    }

    const gameKey = [
      currentMatchId,
      cnbjeu,
      lastConfirmedResult.combine,
      lastConfirmedResult.result,
      lastConfirmedResult.notedjeu,
    ].join('::');

    if (lastSavedGameKeyRef.current === gameKey) return;
    lastSavedGameKeyRef.current = gameKey;

    const record = gameResultToRecord(
      lastConfirmedResult,
      currentMatchId,
      currentTournamentId,
      cnbjeu,
      niveau
    );

    saveGame(currentTournamentId, currentMatchId, record);
  }, [
    lastConfirmedResult,
    currentTournamentId,
    currentMatchId,
    cnbjeu,
    niveau,
    saveGame,
  ]);

  // ============================================================
  // 3. FIN DE MATCH → SAUVEGARDE ET ENCHAÎNEMENT
  // ============================================================
  useEffect(() => {
    if (!isMatchOver || !currentTournamentId || !currentMatchId) {
      return;
    }

    const matchEndKey = `${currentTournamentId}:${currentMatchId}:${matchIndex}`;
    if (processedMatchEndsRef.current.has(matchEndKey)) {
      return;
    }
    processedMatchEndsRef.current.add(matchEndKey);

    const config = readLolomathsConfig();
    const nbmatch = config.nbmatch ?? 1;
    const now = new Date().toISOString();
    const startedAt = matchStartDateRef.current ?? now;

    const matchRecord: MatchRecord = {
      id: currentMatchId,
      tournamentId: currentTournamentId,
      numordrep: matchIndex,
      numeromatch,
      score: scoreTotal,
      isGameOver: true,
      datedebut: startedAt,
      datefin: now,
      jeux: [],
    };

    saveMatch(currentTournamentId, matchRecord);
    endMatch();

    const isLastMatch = matchIndex + 1 >= nbmatch;
    const tournament = useHistoryStore
      .getState()
      .getTournament(currentTournamentId);

    if (tournament) {
      const shouldAddScore = !scoredMatchIdsRef.current.has(currentMatchId);
      if (shouldAddScore) {
        scoredMatchIdsRef.current.add(currentMatchId);
      }

      saveTournament({
        ...tournament,
        isgameover: isLastMatch ? true : tournament.isgameover,
        score: shouldAddScore ? tournament.score + scoreTotal : tournament.score,
        datefin: isLastMatch ? now : tournament.datefin,
      });
    }

    if (isLastMatch) {
      endTournament();
    } else {
      matchStartDateRef.current = now;
      startMatch(String(matchIndex + 2));
    }
  }, [
    isMatchOver,
    currentTournamentId,
    currentMatchId,
    matchIndex,
    numeromatch,
    scoreTotal,
    saveMatch,
    saveTournament,
    endMatch,
    endTournament,
    startMatch,
  ]);
}
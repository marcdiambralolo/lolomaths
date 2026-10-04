import {
  GameRecord,
  MatchRecord,
  TournamentRecord,
} from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useGameStore } from '@/lib/store/useGameStore';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
 import { useEffect, useRef } from 'react';

// ============================================================
// HELPERS
// ============================================================

/** Génère un identifiant unique côté client. */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Lit la configuration `lolomaths_config` depuis le localStorage. */
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

/** Convertit un `GameResult` en `GameRecord`. */
function gameResultToRecord(
  result: NonNullable<
    ReturnType<typeof useGameStore.getState>['lastConfirmedResult']
  >,
  matchId: string,
  tournamentId: string,
  numjeu: number,
  niveau: number
): GameRecord {
  const sequencePions = result.sequenceNcases.join(',');

  return {
    id: generateId('game'),
    matchId,
    tournamentId,
    numjeu,
    combinaison: result.combine,
    sequencePions,
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
 * Hook qui enregistre automatiquement les jeux, matchs et tournois
 * dans ` ` à chaque étape clé.
 *
 * ⚠️ Ne prend AUCUN paramètre : lit la configuration depuis `localStorage`.
 */
export function useGamePersistence() {
  // ----- Store de jeu -----
  const currentTournamentId = useGameStore(
    (s) => s.currentTournamentId
  );
  const currentMatchId = useGameStore((s) => s.currentMatchId);
  const matchIndex = useGameStore((s) => s.matchIndex);
  const numeromatch = useGameStore((s) => s.numeromatch);
  const cnbjeu = useGameStore((s) => s.cnbjeu);
  const nombredejeu = useGameStore((s) => s.nombredejeu);
  const niveau = useGameStore((s) => s.niveau);
  const scoreTotal = useGameStore((s) => s.scoreTotal);
  const isMatchOver = useGameStore((s) => s.isMatchOver);
  const lastConfirmedResult = useGameStore(
    (s) => s.lastConfirmedResult
  );

  // ----- Actions du store -----
  const startTournament = useGameStore((s) => s.startTournament);
  const startMatch = useGameStore((s) => s.startMatch);
  const endMatch = useGameStore((s) => s.endMatch);
  const endTournament = useGameStore((s) => s.endTournament);

  // ----- Store d'historique -----
  const saveTournament = useHistoryStore((s) => s.saveTournament);
  const saveMatch = useHistoryStore((s) => s.saveMatch);
  const saveGame = useHistoryStore((s) => s.saveGame);

  // ----- Refs anti-doublons -----
  const lastSavedGameRef = useRef<string | null>(null);
  const matchStartDateRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  // ============================================================
  // 1. DÉMARRAGE DU TOURNOI
  // ============================================================
  useEffect(() => {
    if (initializedRef.current) return;
    if (currentTournamentId) return; // déjà démarré

    initializedRef.current = true;

    const config = readLolomathsConfig();
    const now = new Date().toISOString();
    matchStartDateRef.current = now;

    // Démarre le tournoi + le premier match
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

    // Enregistre immédiatement un Tournoi vide dans l'historique
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

  // ============================================================
  // 2. ENREGISTREMENT D'UN JEU
  // ============================================================
  useEffect(() => {
    if (!lastConfirmedResult) return;
    if (!currentTournamentId || !currentMatchId) return;
    if (lastSavedGameRef.current === lastConfirmedResult.combine) return;

    lastSavedGameRef.current = lastConfirmedResult.combine;

    const game = gameResultToRecord(
      lastConfirmedResult,
      currentMatchId,
      currentTournamentId,
      cnbjeu,
      niveau
    );

    saveGame(currentTournamentId, currentMatchId, game);
  }, [
    lastConfirmedResult,
    currentTournamentId,
    currentMatchId,
    cnbjeu,
    niveau,
    saveGame,
  ]);

  // ============================================================
  // 3. FIN DE MATCH → enregistre le match + prépare le suivant
  // ============================================================
  useEffect(() => {
    if (!isMatchOver) return;
    if (!currentTournamentId || !currentMatchId) return;

    const config = readLolomathsConfig();
    const nbmatch = config.nbmatch ?? 1;

    const now = new Date().toISOString();
    const startedAt = matchStartDateRef.current ?? now;

    const match: MatchRecord = {
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

    saveMatch(currentTournamentId, match);
    endMatch();

    const isLastMatch = matchIndex + 1 >= nbmatch;

    if (isLastMatch) {
      const tournament = useHistoryStore
        .getState()
        .getTournament(currentTournamentId);

      if (tournament) {
        saveTournament({
          ...tournament,
          isgameover: true,
          score: tournament.score + scoreTotal,
          datefin: now,
        });
      }

      endTournament();
    } else {
      const nextNumeroMatch = String(matchIndex + 2);
      matchStartDateRef.current = now;
      startMatch(nextNumeroMatch);
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
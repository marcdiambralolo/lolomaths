import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import lcontentData from '@/data/lcontent.json';
import { useChrono } from '@/hooks/lolomaths/useChrono';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import {
  isStartCaseCovered,
  getPlacedPions,
  hasLockedPionInSequence,
} from '@/components/lolomaths/game/competitionEngine';
import { StateCase } from '@/lib/interfaces';
import { useGameHelpRules } from './useGameHelpRules';
import { useGamePersistence } from './useGamePersistence';
import { useGameStore } from '@/lib/store/useGameStore';

// ============================================================
// Configuration
// ============================================================

export interface GameConfig {
  niveau: number;
  matrixIndex: number;
  numeromatch: string;
  matchDuration?: number;
  nombredejeu?: number;
}

const DEFAULT_CONFIG: GameConfig = {
  niveau: 1,
  matrixIndex: 1,
  numeromatch: '123456789',
  matchDuration: 300,
  nombredejeu: 20,
};

const NO_TIME_LIMIT_SECONDS = 86_400;
const DEFAULT_DURATION_SECONDS = 300;
const NAVIGATION_DELAY_MS = 300;
const CONFIG_STORAGE_KEY = 'lolomaths_config';
const RESULT_ROUTE = '/star/resultat';

function convertTempsmatchToSeconds(
  tempsmatch: string | undefined | null,
  fallback = DEFAULT_DURATION_SECONDS
): number {
  if (tempsmatch === undefined || tempsmatch === null || tempsmatch === '') {
    return fallback;
  }
  if (tempsmatch === '-1') return NO_TIME_LIMIT_SECONDS;

  const minutes = parseInt(tempsmatch, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) return fallback;
  return minutes * 60;
}

export const loadGameConfig = (): GameConfig => {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    const savedConfig = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!savedConfig) return DEFAULT_CONFIG;

    const config = JSON.parse(savedConfig);

    let duration: number;
    if (typeof config.matchDuration === 'number' && Number.isFinite(config.matchDuration)) {
      duration = config.matchDuration;
    } else if (typeof config.tempsmatch === 'string') {
      duration = convertTempsmatchToSeconds(config.tempsmatch);
    } else {
      duration = DEFAULT_CONFIG.matchDuration ?? DEFAULT_DURATION_SECONDS;
    }

    return {
      niveau:
        typeof config.niveau === 'number' ? config.niveau : DEFAULT_CONFIG.niveau,
      matrixIndex:
        typeof config.matrixIndex === 'number'
          ? config.matrixIndex
          : DEFAULT_CONFIG.matrixIndex,
      numeromatch:
        typeof config.numeromatch === 'string' && config.numeromatch
          ? config.numeromatch
          : DEFAULT_CONFIG.numeromatch,
      matchDuration: duration,
      nombredejeu:
        typeof config.nombredejeu === 'number'
          ? config.nombredejeu
          : DEFAULT_CONFIG.nombredejeu,
    };
  } catch (e) {
    console.error('Erreur lors du chargement de la configuration:', e);
    return DEFAULT_CONFIG;
  }
};

export interface GameHistoryItem {
  score: number;
  combination: string;
}

// ============================================================
// Hook principal
// ============================================================

export const useCompetitionGame = () => {
  const router = useRouter();
  const gameConfig = useCompetitionStore((s) => s.gameConfig);

  // Persistance automatique
  useGamePersistence();

  // -------- Lecture du store (selectors granulaires) --------
  const grid = useGameStore((s) => s.grid);
  const cnbjeu = useGameStore((s) => s.cnbjeu);
  const nombredejeu = useGameStore((s) => s.nombredejeu);
  const directionsValid = useGameStore((s) => s.directionsValid);
  const gameResults = useGameStore((s) => s.gameResults);
  const isMatchOver = useGameStore((s) => s.isMatchOver);
  const pions = useGameStore((s) => s.pions);
  const rackIndex = useGameStore((s) => s.rackIndex);
  const preGeneratedNumbers = useGameStore((s) => s.preGeneratedNumbers);

  const initGame = useGameStore((s) => s.initGame);
  const resetPions = useGameStore((s) => s.resetPions);
  const confirmCalculation = useGameStore((s) => s.confirmCalculation);
  const endMatch = useGameStore((s) => s.endMatch);

  // -------- Dérivés --------
  const flatGrid = useMemo(() => grid.flat(), [grid]);

  // Pions encore disponibles dans le rack (Pla ou Choi)
  const hasPionsInRack = useMemo(
    () =>
      pions.some((p) => p.etat === StateCase.Pla || p.etat === StateCase.Choi),
    [pions]
  );

  // -------- État local UI --------
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<
    number | null
  >(null);
  const [showHelp, setShowHelp] = useState(true);

  // -------- Chrono --------
  const handleTimeUp = useCallback(() => {
    endMatch();
  }, [endMatch]);

  const { resetAndStart: resetAndStartChrono, pause: pauseChrono } = useChrono({
    autoStart: true,
    onTimeUp: handleTimeUp,
  });

  // -------- Refs d'orchestration --------
  const hasInitializedMatch = useRef(false);
  const hasScheduledNavigationRef = useRef(false);

  const initializeGameSession = useCallback((): number => {
    const config = loadGameConfig();
    const activeMatrix = lcontentData[config.matrixIndex] ?? lcontentData[1];
    const duration = config.matchDuration ?? DEFAULT_DURATION_SECONDS;

    if (!activeMatrix) return duration;

    try {
      initGame(
        activeMatrix.nombres,
        activeMatrix.operateurs,
        activeMatrix.niveau ?? config.niveau,
        gameConfig?.numeromatch ?? config.numeromatch,
        activeMatrix.cases,
        config.nombredejeu ?? DEFAULT_CONFIG.nombredejeu ?? 20
      );
    } catch (e) {
      console.error("Erreur lors de l'initialisation de la partie:", e);
    }

    return duration;
  }, [initGame, gameConfig?.numeromatch]);

  // -------- Initialisation (une seule fois au montage) --------
  useEffect(() => {
    if (hasInitializedMatch.current) return;
    hasInitializedMatch.current = true;

    const duration = initializeGameSession();
    resetAndStartChrono(duration);
  }, [initializeGameSession, resetAndStartChrono]);

  // -------- Fin de match si plus de pions jouables ni posés en fin de stock --------
  useEffect(() => {
    if (isMatchOver || cnbjeu === 0) return;
    if (hasPionsInRack) return;

    const placedNow = getPlacedPions(flatGrid);
    if (placedNow.length > 0) return;

    const hasMoreRacks = rackIndex < preGeneratedNumbers.length;
    if (hasMoreRacks && cnbjeu < nombredejeu) return;

    pauseChrono();
    endMatch();
  }, [
    hasPionsInRack,
    flatGrid,
    cnbjeu,
    nombredejeu,
    rackIndex,
    preGeneratedNumbers.length,
    isMatchOver,
    pauseChrono,
    endMatch,
  ]);

  // -------- Redirection vers la page résultat --------
  useEffect(() => {
    if (!isMatchOver) {
      hasScheduledNavigationRef.current = false;
      return;
    }

    setSelectedDirectionIndex(null);
    pauseChrono();

    if (hasScheduledNavigationRef.current) return;
    hasScheduledNavigationRef.current = true;

    const timeout = setTimeout(() => {
      if (hasScheduledNavigationRef.current) {
        router.push(RESULT_ROUTE);
      }
    }, NAVIGATION_DELAY_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [isMatchOver, pauseChrono, router]);

  // -------- Dérivés du plateau --------
  const gameState = useMemo(() => {
    const isStartCovered = isStartCaseCovered(flatGrid);
    const placedPions = getPlacedPions(flatGrid);

    return {
      isStartCovered,
      placedPions,
      hasLockedPion: hasLockedPionInSequence(placedPions),
      isFirstGame: cnbjeu === 0,
    };
  }, [flatGrid, cnbjeu]);

  // -------- Handlers --------
  const handleResetRound = useCallback(() => {
    resetPions();
    setSelectedDirectionIndex(null);
  }, [resetPions]);

  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex === null || isMatchOver) return;
    confirmCalculation(selectedDirectionIndex);
    setSelectedDirectionIndex(null);
  }, [selectedDirectionIndex, isMatchOver, confirmCalculation]);

  const handleCloseDialog = useCallback(() => {
    setSelectedDirectionIndex(null);
  }, []);

  // -------- Help messages --------
  const helpMessages = useGameHelpRules({
    isStartCovered: gameState.isStartCovered,
    placedPions: gameState.placedPions,
    hasLockedPion: gameState.hasLockedPion,
    isFirstGame: gameState.isFirstGame,
    hasAvailablePions: hasPionsInRack,
    isMatchOver,
    directionsValid,
  });

  // -------- Valeurs dérivées UI --------
  const hasPlacedPions = gameState.placedPions.length > 0;

  const { selectedGameResult, isDialogOpen } = useMemo(() => {
    if (isMatchOver || selectedDirectionIndex === null) {
      return { selectedGameResult: null, isDialogOpen: false };
    }
    const result = gameResults[selectedDirectionIndex] ?? null;
    return { selectedGameResult: result, isDialogOpen: result !== null };
  }, [isMatchOver, selectedDirectionIndex, gameResults]);

  const hasAnyValidDirection =
    directionsValid.left ||
    directionsValid.right ||
    directionsValid.up ||
    directionsValid.down;

  return {
    gameState,
    helpMessages,
    hasPlacedPions,
    selectedGameResult,
    isMatchOver,
    nombredejeu,
    hasAnyValidDirection,
    isDialogOpen,
    directionsValid,
    selectedDirectionIndex,
    showHelp,
    handleCloseDialog,
    setSelectedDirectionIndex,
    setShowHelp,
    handleResetRound,
    handleAcceptCalculation,
  };
};
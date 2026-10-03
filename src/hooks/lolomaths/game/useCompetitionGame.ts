import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { useDiambraStore } from '@/lib/store/diambra.store';

export interface GameConfig {
  niveau: number;
  matrixIndex: number;
  numeromatch: string;
  matchDuration?: number; // durée effective en secondes
}

const DEFAULT_CONFIG: GameConfig = {
  niveau: 1,
  matrixIndex: 1,
  numeromatch: '123456789',
  matchDuration: 300, // 5 minutes par défaut
};

/**
 * Convertit `tempsmatch` (format Kotlin) en durée effective en secondes.
 * - "-1"      → 86400s (24h, illimité en pratique)
 * - "5"       → 300s
 * - "10"      → 600s
 * - undefined → fallback (5 min)
 */
function convertTempsmatchToSeconds(
  tempsmatch: string | undefined,
  fallback = 300
): number {
  if (tempsmatch === undefined || tempsmatch === null || tempsmatch === '') {
    return fallback;
  }
  if (tempsmatch === '-1') {
    return 86400;
  }
  const minutes = parseInt(tempsmatch, 10);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return fallback;
  }
  return minutes * 60;
}

export const loadGameConfig = (): GameConfig => {
  try {
    const savedConfig = localStorage.getItem('lolomaths_config');
    if (!savedConfig) return DEFAULT_CONFIG;

    const config = JSON.parse(savedConfig);

    // Priorité : matchDuration (secondes) > tempsmatch (minutes Kotlin) > défaut
    let duration: number;
    if (typeof config.matchDuration === 'number') {
      duration = config.matchDuration;
    } else if (typeof config.tempsmatch === 'string') {
      duration = convertTempsmatchToSeconds(config.tempsmatch);
    } else {
      duration = DEFAULT_CONFIG.matchDuration ?? 300;
    }

    return {
      niveau: config.niveau ?? DEFAULT_CONFIG.niveau,
      matrixIndex: config.matrixIndex ?? DEFAULT_CONFIG.matrixIndex,
      numeromatch: config.numeromatch ?? DEFAULT_CONFIG.numeromatch,
      matchDuration: duration,
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

export const useCompetitionGame = () => {
  const { gameConfig } = useDiambraStore();

  // ============================================================
  // Sélecteurs Zustand
  // ============================================================
  const grid = useCompetitionStore((state) => state.grid);
  const flatGrid = useMemo(() => grid.flat(), [grid]);
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);
  const scoreTotal = useCompetitionStore((state) => state.scoreTotal);
  const directionsValid = useCompetitionStore((state) => state.directionsValid);
  const gameResults = useCompetitionStore((state) => state.gameResults);

  const initGame = useCompetitionStore((state) => state.initGame);
  const resetPions = useCompetitionStore((state) => state.resetPions);
  const confirmCalculation = useCompetitionStore(
    (state) => state.confirmCalculation
  );

  // ============================================================
  // États locaux
  // ============================================================
  const [showResultZone, setShowResultZone] = useState(false);
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<
    number | null
  >(null);
  const [showHelp, setShowHelp] = useState(true);

  // ============================================================
  // Chrono — démarre automatiquement au montage
  // ============================================================
  const chrono = useChrono({
    initialSeconds: 300,
    autoStart: true,
    onTimeUp: () => {
      setShowResultZone(true);
    },
  });

  const { resetAndStart: resetAndStartChrono, pause: pauseChrono } = chrono;

  const hasInitializedMatch = useRef(false);

  // ============================================================
  // Initialisation d'une session de jeu
  // Retourne la durée effective du match (en secondes)
  // ============================================================
  const initializeGameSession = useCallback((): number => {
    const config = loadGameConfig();
    const activeMatrix = lcontentData[config.matrixIndex] ?? lcontentData[1];
    const duration = config.matchDuration ?? 300;

    if (!activeMatrix) return duration;

    initGame(
      activeMatrix.nombres,
      activeMatrix.operateurs,
      activeMatrix.niveau ?? config.niveau,
      gameConfig?.numeromatch ?? config.numeromatch,
      activeMatrix.cases
    );

    return duration;
  }, [initGame, gameConfig?.numeromatch]);

  // ============================================================
  // Init unique de la session (grille + rack)
  // Le chrono démarre via `autoStart: true` mais avec une durée
  // par défaut (300s). On le resynchronise avec la durée réelle
  // une fois la config chargée.
  // ============================================================
  useEffect(() => {
    if (hasInitializedMatch.current) return;
    hasInitializedMatch.current = true;

    const duration = initializeGameSession();
    // Resynchronise le chrono avec la durée effective du match
    resetAndStartChrono(duration);

    return () => {
      pauseChrono();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // État dérivé du jeu
  // ============================================================
  const gameState = useMemo(() => {
    const isStartCovered = isStartCaseCovered(flatGrid);
    const placedPions = getPlacedPions(flatGrid);
    const hasAvailablePions = flatGrid.some(
      (cell) => cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
    );

    return {
      isStartCovered,
      placedPions,
      hasLockedPion: hasLockedPionInSequence(placedPions),
      isFirstGame: cnbjeu === 0,
      hasAvailablePions,
    };
  }, [flatGrid, cnbjeu]);

  // ============================================================
  // Actions
  // ============================================================
  const handleResetRound = useCallback(() => {
    resetPions();
    setSelectedDirectionIndex(null);
  }, [resetPions]);

  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex === null) return;
    confirmCalculation(selectedDirectionIndex);
    setSelectedDirectionIndex(null);
  }, [selectedDirectionIndex, confirmCalculation]);

  const handleRestartMatch = useCallback(() => {
    setShowResultZone(false);
    setSelectedDirectionIndex(null);

    const duration = initializeGameSession();
    resetAndStartChrono(duration);
  }, [initializeGameSession, resetAndStartChrono]);

  const handleShowDetails = useCallback(() => {
    const average = cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : '0';
    alert(
      `Détails du match:\n` +
        `Score: ${scoreTotal} pts\n` +
        `Jeux: ${cnbjeu}\n` +
        `Moyenne: ${average} pts`
    );
  }, [scoreTotal, cnbjeu]);

  // ============================================================
  // Messages d'aide
  // ============================================================
  const helpMessages = useGameHelpRules({
    isStartCovered: gameState.isStartCovered,
    placedPions: gameState.placedPions,
    hasLockedPion: gameState.hasLockedPion,
    isFirstGame: gameState.isFirstGame,
    hasAvailablePions: gameState.hasAvailablePions,
    directionsValid,
  });

  const hasPlacedPions = useMemo(
    () => gameState.placedPions.length > 0,
    [gameState.placedPions.length]
  );

  const selectedGameResult = useMemo(
    () =>
      selectedDirectionIndex !== null
        ? gameResults[selectedDirectionIndex] ?? null
        : null,
    [selectedDirectionIndex, gameResults]
  );

  return {
    chrono,
    showResultZone,
    selectedDirectionIndex,
    directionsValid,
    gameState,
    showHelp,
    helpMessages,
    hasPlacedPions,
    selectedGameResult,
    setSelectedDirectionIndex,
    setShowHelp,
    handleResetRound,
    handleAcceptCalculation,
    handleRestartMatch,
    handleShowDetails,
  };
};
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
      nombredejeu: config.nombredejeu ?? DEFAULT_CONFIG.nombredejeu,
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
  const router = useRouter();
  const { gameConfig } = useCompetitionStore();

  // ============================================================
  // 🔥 PERSISTANCE AUTOMATIQUE — sans paramètres
  // ============================================================
  useGamePersistence();

  const grid = useGameStore((state) => state.grid);
  const flatGrid = useMemo(() => grid.flat(), [grid]);
  const cnbjeu = useGameStore((state) => state.cnbjeu);
  const nombredejeu = useGameStore((state) => state.nombredejeu);
  const directionsValid = useGameStore((state) => state.directionsValid);
  const gameResults = useGameStore((state) => state.gameResults);
  const isMatchOver = useGameStore((state) => state.isMatchOver);
  const pions = useGameStore((state) => state.pions);

  const initGame = useGameStore((state) => state.initGame);
  const resetPions = useGameStore((state) => state.resetPions);
  const confirmCalculation = useGameStore(
    (state) => state.confirmCalculation
  );

  // ============================================================
  // ✅ DÉTECTION "PLUS DE PIONS DISPONIBLES DANS LE RACK"
  // ============================================================
  const hasPionsInRack = useMemo(
    () => pions.some((p) => p.etat === StateCase.Pla),
    [pions]
  );

  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<
    number | null
  >(null);
  const [showHelp, setShowHelp] = useState(true);

  const chrono = useChrono({
    initialSeconds: 300,
    autoStart: true,
    onTimeUp: () => {
      useGameStore.setState({ isMatchOver: true });
    },
  });

  const { resetAndStart: resetAndStartChrono, pause: pauseChrono } = chrono;

  const hasInitializedMatch = useRef(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNavigatedRef = useRef(false);

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
      activeMatrix.cases,
      config.nombredejeu ?? 20
    );

    return duration;
  }, [initGame, gameConfig?.numeromatch]);

  useEffect(() => {
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (!hasInitializedMatch.current) {
      hasInitializedMatch.current = true;

      const duration = initializeGameSession();
      resetAndStartChrono(duration);
    }

    return () => {
      pauseTimeoutRef.current = setTimeout(() => {
        pauseChrono();
        hasInitializedMatch.current = false;
        pauseTimeoutRef.current = null;
      }, 100);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // ✅ FIN DE MATCH SI PLUS DE PIONS DANS LE RACK
  // ============================================================
  useEffect(() => {
    if (isMatchOver) return;
    if (cnbjeu === 0) return;
    if (hasPionsInRack) return;

    pauseChrono();
    useGameStore.setState({ isMatchOver: true });
  }, [hasPionsInRack, cnbjeu, isMatchOver, pauseChrono]);

  // ============================================================
  // ✅ REDIRECTION VERS /star/resultat
  //    (avec reset du ref pour React Strict Mode)
  // ============================================================
  useEffect(() => {
    if (!isMatchOver) return;
    if (hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    pauseChrono();

    const timeout = setTimeout(() => {
      router.push('/star/resultat');
    }, 300);

    return () => {
      clearTimeout(timeout);
      // ✅ Reset du flag : permet la ré-exécution en Strict Mode
      hasNavigatedRef.current = false;
    };
  }, [isMatchOver, pauseChrono, router]);

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

  const handleResetRound = useCallback(() => {
    resetPions();
    setSelectedDirectionIndex(null);
  }, [resetPions]);

  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex === null) return;
    confirmCalculation(selectedDirectionIndex);
    setSelectedDirectionIndex(null);
  }, [selectedDirectionIndex, confirmCalculation]);

  const helpMessages = useGameHelpRules({
    isStartCovered: gameState.isStartCovered,
    placedPions: gameState.placedPions,
    hasLockedPion: gameState.hasLockedPion,
    isFirstGame: gameState.isFirstGame,
    hasAvailablePions: gameState.hasAvailablePions,
    isMatchOver,
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

  const handleCloseDialog = useCallback(() => {
    setSelectedDirectionIndex(null);
  }, [setSelectedDirectionIndex]);

  const isDialogOpen = useMemo(
    () => selectedDirectionIndex !== null && selectedGameResult !== null,
    [selectedDirectionIndex, selectedGameResult]
  );

  const hasAnyValidDirection = useMemo(
    () =>
      directionsValid.left ||
      directionsValid.right ||
      directionsValid.up ||
      directionsValid.down,
    [directionsValid]
  );

  return {
    selectedDirectionIndex,
    directionsValid,
    gameState,
    showHelp,
    helpMessages,
    hasPlacedPions,
    selectedGameResult,
    isMatchOver,
    nombredejeu,
    hasAnyValidDirection,
    isDialogOpen,
    handleCloseDialog,
    setSelectedDirectionIndex,
    setShowHelp,
    handleResetRound,
    handleAcceptCalculation,
  };
};
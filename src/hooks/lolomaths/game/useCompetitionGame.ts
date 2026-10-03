import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import lcontentData from "@/data/lcontent.json";
import { useChrono } from "@/hooks/lolomaths/useChrono";
import { useCompetitionStore } from "@/lib/store/useCompetitionStore";
import {
  isStartCaseCovered,
  getPlacedPions,
  hasLockedPionInSequence,
} from "@/components/lolomaths/game/competitionEngine";
import { StateCase } from "@/lib/interfaces";
import { useGameHelpRules } from "./useGameHelpRules";
import { useDiambraStore } from "@/lib/store/diambra.store";

export interface GameConfig {
  niveau: number;
  matrixIndex: number;
  numeromatch: string;
}

const DEFAULT_CONFIG: GameConfig = {
  niveau: 1,
  matrixIndex: 1,
  numeromatch: "123456789",
};

export const loadGameConfig = (): GameConfig => {
  try {
    const savedConfig = localStorage.getItem("lolomaths_config");
    if (!savedConfig) return DEFAULT_CONFIG;

    const config = JSON.parse(savedConfig);
    return {
      niveau: config.niveau ?? DEFAULT_CONFIG.niveau,
      matrixIndex: config.matrixIndex ?? DEFAULT_CONFIG.matrixIndex,
      numeromatch: config.numeromatch ?? DEFAULT_CONFIG.numeromatch,
    };
  } catch (e) {
    console.error("Erreur lors du chargement de la configuration:", e);
    return DEFAULT_CONFIG;
  }
};

export interface GameHistoryItem {
  score: number;
  combination: string;
}

const MATCH_DURATION = 300;

export const useCompetitionGame = () => {
   const { gameConfig, } = useDiambraStore();
  
  // 1. Sélecteurs Zustand
  const grid = useCompetitionStore((state) => state.grid);
  const flatGrid = useMemo(() => grid.flat(), [grid]);
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);
  const scoreTotal = useCompetitionStore((state) => state.scoreTotal);
  const directionsValid = useCompetitionStore((state) => state.directionsValid);
  const hasUsedMultiplicationOrDivision = useCompetitionStore(
    (state) => state.hasUsedMultiplicationOrDivision
  );
  const gameResults = useCompetitionStore((state) => state.gameResults);

  const initGame = useCompetitionStore((state) => state.initGame);
  const resetPions = useCompetitionStore((state) => state.resetPions);
  const confirmCalculation = useCompetitionStore((state) => state.confirmCalculation);

  // 2. États locaux
  const [showResultZone, setShowResultZone] = useState(false);
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  const chrono = useChrono({
    initialSeconds: MATCH_DURATION,
    autoStart: false,
    onTimeUp: () => {
      setShowResultZone(true);
    },
  });

  const { reset: resetChrono, start: startChrono, pause: pauseChrono } = chrono;
  const hasInitializedMatch = useRef(false);
  const processedGamesRef = useRef(0);

  /**
   * Initialise le jeu avec la matrice extraite du fichier JSON
   */
  const initializeGameSession = useCallback(() => {
    const config = loadGameConfig();
    const activeMatrix = lcontentData[config.matrixIndex] ?? lcontentData[1];

    if (activeMatrix) {
      initGame(
        activeMatrix.nombres,
        activeMatrix.operateurs,
        activeMatrix.niveau ?? config.niveau,
        gameConfig?.numeromatch ?? config.numeromatch,
        activeMatrix.cases
      );
    }
  }, [initGame]);

  // Initialisation unique au montage
  useEffect(() => {
    if (hasInitializedMatch.current) return;

    hasInitializedMatch.current = true;
    initializeGameSession();

    resetChrono(MATCH_DURATION);
    startChrono();

    return () => {
      pauseChrono();
    };
  }, [initializeGameSession, resetChrono, startChrono, pauseChrono]);

  // Calcul de l'état du jeu à partir de la grille
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

  /**
   * Reset de la manche en cours.
   */
  const handleResetRound = useCallback(() => {
    resetPions();
    setSelectedDirectionIndex(null);
  }, [resetPions]);

  /**
   * Validation d'un calcul sélectionné.
   */
  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex === null) return;

    confirmCalculation(selectedDirectionIndex);
    setSelectedDirectionIndex(null);
  }, [selectedDirectionIndex, confirmCalculation]);

  /**
   * Redémarrage d'une nouvelle partie / match.
   */
  const handleRestartMatch = useCallback(() => {
    setShowResultZone(false);
    setSelectedDirectionIndex(null);
    processedGamesRef.current = 0;

    initializeGameSession();

    resetChrono(MATCH_DURATION);
    startChrono();
  }, [initializeGameSession, resetChrono, startChrono]);

  /**
   * Affichage des détails du match.
   */
  const handleShowDetails = useCallback(() => {
    const average = cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : "0";

    alert(
      `Détails du match:\n` +
        `Score: ${scoreTotal} pts\n` +
        `Jeux: ${cnbjeu}\n` +
        `Moyenne: ${average} pts`
    );
  }, [scoreTotal, cnbjeu]);

  const helpMessages = useGameHelpRules({
    ...gameState,
    directionsValid,
    hasUsedMultiplicationOrDivision,
  });

  const hasPlacedPions = useMemo(
    () => gameState.placedPions.length > 0,
    [gameState.placedPions.length]
  );

  const selectedGameResult = useMemo(
    () => (selectedDirectionIndex !== null ? gameResults[selectedDirectionIndex] : null),
    [selectedDirectionIndex, gameResults]
  );

  return {
    chrono,
    showResultZone,
    selectedDirectionIndex,
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
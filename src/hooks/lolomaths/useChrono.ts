"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface UseChronoOptions {
  /** Durée initiale en secondes (ex: 300 = 5 minutes) */
  initialSeconds?: number;

  /** Démarre automatiquement au montage */
  autoStart?: boolean;

  /** Callback exécuté lorsque le temps atteint 0 */
  onTimeUp?: () => void;
}

interface UseChronoReturn {
  /** Temps restant en secondes */
  timeLeft: number;

  /** Format lisible "MM:SS" */
  formattedTime: string;

  /** Temps écoulé depuis le début en secondes */
  elapsedTime: number;

  /** True si le chrono décompte */
  isRunning: boolean;

  /** True si le chrono est arrivé à 0 */
  isFinished: boolean;

  /** Démarrer / reprendre */
  start: () => void;

  /** Mettre en pause */
  pause: () => void;

  /** Réinitialiser le chrono */
  reset: (newSeconds?: number) => void;

  /** Ajouter ou retirer des secondes */
  addSeconds: (seconds: number) => void;
}

export function useChrono({
  initialSeconds = 300,
  autoStart = false,
  onTimeUp,
}: UseChronoOptions = {}): UseChronoReturn {
  const normalizedInitial = Math.max(0, Math.floor(initialSeconds));

  const [totalDuration, setTotalDuration] = useState(normalizedInitial);
  const [timeLeft, setTimeLeft] = useState(normalizedInitial);
  const [isRunning, setIsRunning] = useState(autoStart && normalizedInitial > 0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const hasTriggeredTimeUpRef = useRef(false);

  // Stocke le timestamp cible précis (ms) pour compenser le ralentissement des onglets inactifs
  const targetTimeRef = useRef<number | null>(null);

  // Maintient la référence à jour du callback sans recréer les timers
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Boucle du timer basée sur l'horloge réelle (Timestamp Delta)
   */
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      targetTimeRef.current = null;
      return;
    }

    clearTimer();

    // Fixe la date de fin visée
    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + timeLeft * 1000;
    }

    timerRef.current = setInterval(() => {
      if (targetTimeRef.current === null) return;

      const remainingMs = targetTimeRef.current - Date.now();
      const nextTimeLeft = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(nextTimeLeft);

      if (nextTimeLeft <= 0) {
        clearTimer();
        setIsRunning(false);
        targetTimeRef.current = null;

        if (!hasTriggeredTimeUpRef.current) {
          hasTriggeredTimeUpRef.current = true;
          onTimeUpRef.current?.();
        }
      }
    }, 250); // Fréquence de vérification élevée pour une précision exacte

    return clearTimer;
  }, [isRunning, clearTimer, timeLeft]);

  /**
   * Démarrer / Reprendre
   */
  const start = useCallback(() => {
    setTimeLeft((current) => {
      if (current <= 0) return 0;
      targetTimeRef.current = Date.now() + current * 1000;
      setIsRunning(true);
      return current;
    });
  }, []);

  /**
   * Mettre en pause
   */
  const pause = useCallback(() => {
    clearTimer();
    targetTimeRef.current = null;
    setIsRunning(false);
  }, [clearTimer]);

  /**
   * Réinitialisation
   */
  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      targetTimeRef.current = null;
      hasTriggeredTimeUpRef.current = false;
      setIsRunning(false);

      setTotalDuration((prevDuration) => {
        const nextDuration =
          newSeconds !== undefined
            ? Math.max(0, Math.floor(newSeconds))
            : prevDuration;

        setTimeLeft(nextDuration);
        return nextDuration;
      });
    },
    [clearTimer]
  );

  /**
   * Ajouter / Retirer des secondes
   */
  const addSeconds = useCallback((secondsToAdd: number) => {
    if (!Number.isFinite(secondsToAdd)) return;

    const addedMs = Math.floor(secondsToAdd) * 1000;

    if (targetTimeRef.current !== null) {
      targetTimeRef.current += addedMs;
    }

    setTimeLeft((previousTime) => {
      const nextTime = Math.max(0, previousTime + Math.floor(secondsToAdd));

      if (nextTime > 0) {
        hasTriggeredTimeUpRef.current = false;
      }

      return nextTime;
    });
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeft]);

  const elapsedTime = useMemo(
    () => Math.max(0, totalDuration - timeLeft),
    [totalDuration, timeLeft]
  );

  const isFinished = timeLeft === 0;

  return {
    timeLeft,
    formattedTime,
    elapsedTime,
    isRunning,
    isFinished,
    start,
    pause,
    reset,
    addSeconds,
  };
}
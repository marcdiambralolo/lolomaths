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
  /**
   * Normalisation de la durée initiale.
   */
  const normalizedInitialSeconds = Math.max(
    0,
    Math.floor(initialSeconds)
  );

  const [totalDuration, setTotalDuration] = useState(
    normalizedInitialSeconds
  );

  const [timeLeft, setTimeLeft] = useState(
    normalizedInitialSeconds
  );

  const [isRunning, setIsRunning] = useState(
    autoStart && normalizedInitialSeconds > 0
  );

  /**
   * Référence du timer.
   *
   * ReturnType<typeof setInterval> fonctionne correctement
   * côté navigateur et côté TypeScript/Next.js.
   */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  /**
   * Évite que le callback onTimeUp provoque la recréation
   * du timer lorsqu'il change de référence.
   */
  const onTimeUpRef = useRef(onTimeUp);

  /**
   * Empêche onTimeUp d'être appelé plusieurs fois
   * pour le même cycle.
   */
  const hasTriggeredTimeUpRef = useRef(false);

  /**
   * Maintient le callback à jour sans redémarrer le timer.
   */
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  /**
   * Nettoyage centralisé du timer.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Boucle principale du chronomètre.
   *
   * Une seule responsabilité :
   * gérer l'intervalle lorsque isRunning change.
   */
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    /**
     * Sécurité : ne jamais créer deux intervals.
     */
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  /**
   * Gestion de l'arrivée à zéro.
   *
   * IMPORTANT :
   * setIsRunning est maintenant séparé de setTimeLeft.
   *
   * Cela évite les mises à jour d'état imbriquées.
   */
  useEffect(() => {
    if (timeLeft !== 0) {
      return;
    }

    clearTimer();

    if (isRunning) {
      setIsRunning(false);
    }

    if (!hasTriggeredTimeUpRef.current) {
      hasTriggeredTimeUpRef.current = true;
      onTimeUpRef.current?.();
    }
  }, [timeLeft, isRunning, clearTimer]);

  /**
   * Nettoyage lors du démontage.
   */
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  /**
   * Démarrer / reprendre.
   */
  const start = useCallback(() => {
    setTimeLeft((currentTime) => {
      if (currentTime <= 0) {
        return currentTime;
      }

      return currentTime;
    });

    hasTriggeredTimeUpRef.current = false;
    setIsRunning(true);
  }, []);

  /**
   * Pause idempotente.
   *
   * Appeler pause() plusieurs fois ne provoque pas
   * de mise à jour inutile.
   */
  const pause = useCallback(() => {
    clearTimer();

    setIsRunning((previousRunning) => {
      if (!previousRunning) {
        return previousRunning;
      }

      return false;
    });
  }, [clearTimer]);

  /**
   * Réinitialisation.
   */
  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();

      const duration =
        newSeconds !== undefined
          ? Math.max(0, Math.floor(newSeconds))
          : totalDuration;

      hasTriggeredTimeUpRef.current = false;

      setIsRunning(false);

      if (newSeconds !== undefined) {
        setTotalDuration(duration);
      }

      setTimeLeft(duration);
    },
    [clearTimer, totalDuration]
  );

  /**
   * Ajouter / retirer du temps.
   */
  const addSeconds = useCallback((secondsToAdd: number) => {
    if (!Number.isFinite(secondsToAdd)) {
      return;
    }

    setTimeLeft((previousTime) => {
      const nextTime = Math.max(
        0,
        previousTime + Math.floor(secondsToAdd)
      );

      /**
       * Si on ajoute du temps après avoir atteint 0,
       * le callback onTimeUp pourra être déclenché
       * à nouveau lors de la prochaine expiration.
       */
      if (nextTime > 0) {
        hasTriggeredTimeUpRef.current = false;
      }

      return nextTime;
    });
  }, []);

  /**
   * Format MM:SS.
   */
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [timeLeft]);

  /**
   * Temps écoulé.
   */
  const elapsedTime = useMemo(
    () => Math.max(0, totalDuration - timeLeft),
    [totalDuration, timeLeft]
  );

  /**
   * État terminé.
   */
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
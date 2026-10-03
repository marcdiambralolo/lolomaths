"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface UseChronoOptions {
  initialSeconds?: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
}

interface UseChronoReturn {
  timeLeft: number;
  formattedTime: string;
  elapsedTime: number;
  isRunning: boolean;
  isFinished: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
  resetAndStart: (newSeconds: number) => void;
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
  const [isRunning, setIsRunning] = useState(
    autoStart && normalizedInitial > 0
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const hasTriggeredTimeUpRef = useRef(false);

  const targetTimeRef = useRef<number | null>(null);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const totalDurationRef = useRef(totalDuration);
  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (targetTimeRef.current === null) return;

    const remainingMs = targetTimeRef.current - Date.now();
    const nextTimeLeft = Math.max(0, Math.ceil(remainingMs / 1000));

    // Évite les re-renders inutiles si la valeur n'a pas changé
    setTimeLeft((prev) => (prev === nextTimeLeft ? prev : nextTimeLeft));

    if (nextTimeLeft <= 0) {
      clearTimer();
      setIsRunning(false);
      targetTimeRef.current = null;

      if (!hasTriggeredTimeUpRef.current) {
        hasTriggeredTimeUpRef.current = true;
        onTimeUpRef.current?.();
      }
    }
  }, [clearTimer]);

  // Effet principal : démarre / arrête le timer selon isRunning
  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + timeLeftRef.current * 1000;
    }

    clearTimer();
    timerRef.current = setInterval(tick, 250);

    return clearTimer;
  }, [isRunning, clearTimer, tick]);

  // Resynchronisation au retour de l'onglet
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isRunningRef.current) {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  const start = useCallback(() => {
    const current = timeLeftRef.current;
    if (current <= 0) return;

    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + current * 1000;
    }

    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (targetTimeRef.current !== null) {
      const remainingMs = targetTimeRef.current - Date.now();
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
      timeLeftRef.current = remaining;
      setTimeLeft(remaining);
    }
    clearTimer();
    targetTimeRef.current = null;
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      targetTimeRef.current = null;
      hasTriggeredTimeUpRef.current = false;
      setIsRunning(false);

      const nextDuration =
        newSeconds !== undefined
          ? Math.max(0, Math.floor(newSeconds))
          : totalDurationRef.current;

      // Mise à jour SYNCHRONE des refs
      timeLeftRef.current = nextDuration;
      totalDurationRef.current = nextDuration;

      setTotalDuration(nextDuration);
      setTimeLeft(nextDuration);
    },
    [clearTimer]
  );

  /**
   * Reset + démarrage atomique : évite le piège reset() puis start() dans
   * le même tick React (où timeLeftRef n'est pas encore à jour).
   */
  const resetAndStart = useCallback(
    (newSeconds: number) => {
      clearTimer();
      hasTriggeredTimeUpRef.current = false;

      const duration = Math.max(0, Math.floor(newSeconds));
      timeLeftRef.current = duration;
      totalDurationRef.current = duration;
      targetTimeRef.current = Date.now() + duration * 1000;

      setTotalDuration(duration);
      setTimeLeft(duration);
      setIsRunning(true);
    },
    [clearTimer]
  );

  const addSeconds = useCallback((secondsToAdd: number) => {
    if (!Number.isFinite(secondsToAdd)) return;

    const addedMs = Math.floor(secondsToAdd) * 1000;

    if (targetTimeRef.current !== null) {
      targetTimeRef.current += addedMs;
    }

    setTimeLeft((prev) => {
      const next = Math.max(0, prev + Math.floor(secondsToAdd));
      timeLeftRef.current = next;

      if (next > 0) {
        hasTriggeredTimeUpRef.current = false;
      }

      if (targetTimeRef.current === null && isRunningRef.current === false) {
        targetTimeRef.current = Date.now() + next * 1000;
      }

      return next;
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
    resetAndStart,
    addSeconds,
  };
}
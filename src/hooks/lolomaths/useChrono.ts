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

function normalizeSeconds(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export function useChrono({
  initialSeconds = 300,
  autoStart = false,
  onTimeUp,
}: UseChronoOptions = {}): UseChronoReturn {
  const normalizedInitial = normalizeSeconds(initialSeconds);

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
  const totalDurationRef = useRef(totalDuration);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    totalDurationRef.current = totalDuration;
  }, [totalDuration]);

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

    timeLeftRef.current = nextTimeLeft;
    setTimeLeft((prev) => (prev === nextTimeLeft ? prev : nextTimeLeft));

    if (nextTimeLeft <= 0) {
      clearTimer();
      targetTimeRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);

      if (!hasTriggeredTimeUpRef.current) {
        hasTriggeredTimeUpRef.current = true;
        onTimeUpRef.current?.();
      }
    }
  }, [clearTimer]);

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

    hasTriggeredTimeUpRef.current = false;
    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + current * 1000;
    }

    isRunningRef.current = true;
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
    isRunningRef.current = false;
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      targetTimeRef.current = null;
      hasTriggeredTimeUpRef.current = false;
      isRunningRef.current = false;
      setIsRunning(false);

      const nextDuration =
        newSeconds !== undefined
          ? normalizeSeconds(newSeconds)
          : totalDurationRef.current;

      timeLeftRef.current = nextDuration;
      totalDurationRef.current = nextDuration;

      setTotalDuration(nextDuration);
      setTimeLeft(nextDuration);
    },
    [clearTimer]
  );

  const resetAndStart = useCallback(
    (newSeconds: number) => {
      clearTimer();
      hasTriggeredTimeUpRef.current = false;

      const duration = normalizeSeconds(newSeconds);
      timeLeftRef.current = duration;
      totalDurationRef.current = duration;

      setTotalDuration(duration);
      setTimeLeft(duration);

      if (duration > 0) {
        targetTimeRef.current = Date.now() + duration * 1000;
        isRunningRef.current = true;
        setIsRunning(true);
      } else {
        targetTimeRef.current = null;
        isRunningRef.current = false;
        setIsRunning(false);
      }
    },
    [clearTimer]
  );

  const addSeconds = useCallback((secondsToAdd: number) => {
    if (!Number.isFinite(secondsToAdd)) return;

    const delta = Math.floor(secondsToAdd);
    const next = Math.max(0, timeLeftRef.current + delta);
    timeLeftRef.current = next;

    if (next > 0) {
      hasTriggeredTimeUpRef.current = false;
      if (targetTimeRef.current !== null) {
        targetTimeRef.current = Math.max(
          Date.now(),
          targetTimeRef.current + delta * 1000
        );
      } else if (isRunningRef.current) {
        targetTimeRef.current = Date.now() + next * 1000;
      }
    } else {
      targetTimeRef.current = null;
    }

    setTimeLeft(next);
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
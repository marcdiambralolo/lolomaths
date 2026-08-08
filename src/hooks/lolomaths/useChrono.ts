"use client"
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseChronoOptions {
  /** Durée initiale en secondes (ex: 300 pour 5 min) */
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
  /** Démarrer / Reprendre */
  start: () => void;
  /** Mettre en pause */
  pause: () => void;
  /** Réinitialiser le chrono à sa durée initiale */
  reset: (newSeconds?: number) => void;
  /** Ajouter ou retirer des secondes bonus/pénalités */
  addSeconds: (seconds: number) => void;
}

export function useChrono({
  initialSeconds = 300,
  autoStart = false,
  onTimeUp,
}: UseChronoOptions = {}): UseChronoReturn {
  const [totalDuration, setTotalDuration] = useState<number>(initialSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Garder la référence de onTimeUp à jour sans relancer le timer
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Boucle principale du compte à rebours
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (onTimeUpRef.current) {
              onTimeUpRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setIsRunning(false);
    const duration = newSeconds !== undefined ? newSeconds : totalDuration;
    if (newSeconds !== undefined) {
      setTotalDuration(newSeconds);
    }
    setTimeLeft(duration);
  }, [totalDuration]);

  const addSeconds = useCallback((secondsToAdd: number) => {
    setTimeLeft((prev) => Math.max(0, prev + secondsToAdd));
  }, []);

  // Formatage MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const elapsedTime = totalDuration - timeLeft;
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
'use client';
import { useStatsDataWithCache } from '@/hooks/cache/useStatsDataWithCache';
import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { useDiambraStore } from '@/lib/store/diambra.store';
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';
import { useGameStatus } from './useGameStatus';
import { useGameTimers } from './useGameTimers';
import { useLastEndedGame } from './useLastEndedGame';

const QUERY_STALE_TIME = 1000;
const RETRY_ATTEMPTS = 2;
const REFRESH_CONFIG_INTERVAL = 5000;
const CONFIG_GC_TIME = 60 * 1000;

export function useHorlogeInit() {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const setGameConfig = useDiambraStore((state) => state.setGameConfig);
  const setGameIsFinished = useDiambraStore((state) => state.setGameIsFinished);
  const setAfficheChoix = useDiambraStore((state) => state.setAfficheChoix);
  const setAfficheGame = useDiambraStore((state) => state.setAfficheGame);
  const resetGameState = useDiambraStore((state) => state.resetGameState);
  const idEditionencours = useDiambraStore((state) => state.idEditionencours);

  const { stats, isLoading: isStatsLoading, error } = useStatsDataWithCache();

  const { data: gameConfig = null, isLoading: isConfigLoading } = useQuery<LearningConfiguration | null>({
    queryKey: ['game', 'config'],
    queryFn: async () => {
      const { data } = await api.get<LearningConfiguration>('learning-configurations/current-config');
      return data;
    },
    staleTime: QUERY_STALE_TIME,
    refetchInterval: REFRESH_CONFIG_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: RETRY_ATTEMPTS,
    gcTime: CONFIG_GC_TIME,
  });

  const lastSyncedConfigIdRef = useRef<string | null>(null);
  useEffect(() => {
    const configId = gameConfig?._id || gameConfig?.id || null;
    if (gameConfig && configId !== lastSyncedConfigIdRef.current) {
      lastSyncedConfigIdRef.current = configId;
      setGameConfig(gameConfig);
    }
  }, [gameConfig, setGameConfig]);

  const { lastEndedGame, isLoading: isLastEndedLoading } = useLastEndedGame();
  const { currentTimestamp, dates, countdowns } = useGameTimers(gameConfig);
  const { gameState } = useGameStatus({ gameConfig, dates, countdowns, currentTimestamp, lastEndedGame });

  const completeGameCleanup = useCallback(() => {
    setGameIsFinished(false);
    setAfficheChoix(false);
    setAfficheGame(false);
    resetGameState?.();
  }, [setGameIsFinished, setAfficheChoix, setAfficheGame, resetGameState]);

  const navigateToGame = useCallback((path: string, configId: string) => {
    const targetPath = `${path}?puzzle=${configId}`;

    if (pathname === path) {
      router.replace(`${targetPath}&_t=${Date.now()}`);
    } else {
      router.push(targetPath);
    }
  }, [pathname, router]);

  const demarrerJeu = useCallback(() => {
    const configId = gameConfig?._id || gameConfig?.id;
    if (!configId) return;

    startTransition(() => {
      if (idEditionencours === configId) {
        setAfficheGame(true);
        navigateToGame('/star/diambraplay', configId);
      } else {
        setAfficheChoix(true);
        navigateToGame('/star/playlolomaths', configId);
      }
    });
  }, [gameConfig, idEditionencours, setAfficheGame, setAfficheChoix, navigateToGame]);

  const isLoading = isLastEndedLoading || isConfigLoading || isStatsLoading;

  return {
    demarrerJeu,
    completeGameCleanup,
    startDate: dates.startDate,
    endDate: dates.endDate,
    countdown: gameState.countdown,
    error,
    isLoading,
    gameState,
    stats,
  };
}
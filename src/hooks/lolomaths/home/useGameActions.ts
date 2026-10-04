import { CompetitionInfo } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { useCallback, useRef, useTransition } from 'react';

export function useGameActions(gameConfig: any) {
  const [, startTransition] = useTransition();
  const hasRedirectedRef = useRef(false);

  const {
    gameIsFinished,  competitions,
    setGameIsFinished,  
  } = useCompetitionStore();

 const {
    setAfficheChoix,  afficheChoix, 
  } = useUIStore();
  

  const completeGameCleanup = useCallback(() => {
    if (gameIsFinished) setGameIsFinished(false);
    if (afficheChoix) setAfficheChoix(false);
  }, [gameIsFinished, afficheChoix,   setGameIsFinished, setAfficheChoix]);

  const demarrerJeu = useCallback(() => {
    if (hasRedirectedRef.current) return;
    const configId = gameConfig?._id || gameConfig?.id;
    const hasActiveCompetition = competitions.some(
      (competition: CompetitionInfo) => competition.idConfig === configId
    );

    hasRedirectedRef.current = true;

    startTransition(() => {
      if (!hasActiveCompetition) {
        setAfficheChoix(true);
      } else {

      }
    });
  }, [gameConfig, competitions, setAfficheChoix,]);

  return { completeGameCleanup, demarrerJeu };
}
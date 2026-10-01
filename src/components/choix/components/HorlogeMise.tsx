'use client';
import Loader from "@/app/loading";
import { useHorlogeInit } from "@/hooks/learning/home/useHorlogeInit";
import { memo } from 'react';
import DashboardContent from "./DashboardContent";

const HorlogeMise = memo(() => {
  const {
    completeGameCleanup, endDate, isLoading, gameState, countdown, stats, demarrerJeu
  } = useHorlogeInit();

  if (isLoading) return <Loader />;

  return (
    <DashboardContent
      status={gameState.status}
      endDate={endDate}
      countdown={countdown}
      onCompleteGameCleanup={completeGameCleanup}
      stats={stats}
      demarrerJeu={demarrerJeu}
    />
  );
});

export default HorlogeMise;
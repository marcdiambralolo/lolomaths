import Loader from "@/app/loading";
import { useHorloge } from "@/hooks/learning/home/useHorloge";
import { memo } from 'react';
import DashboardContent from "./DashboardContent";

const Horloge = memo(() => {
  const {
    completeGameCleanup, demarrerJeu, endDate, isLoading, gameState, countdown, stats, showBandeauButton,
  } = useHorloge();

  if (isLoading) return <Loader />;

  return (
    <DashboardContent
      status={gameState.status}
      endDate={endDate}
      countdown={countdown}
      onCompleteGameCleanup={completeGameCleanup}
      stats={stats}
      showButton={showBandeauButton}
      demarrerJeu={demarrerJeu}
    />
  );
});

export default Horloge;
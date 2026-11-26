'use client';

import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { memo } from 'react';
import ActiveBannerPlay from "../../home/dashboard/ActiveBannerPlay";
import NoCompetitionBanner from "../../home/dashboard/NoCompetitionBanner";

type GameStatus =
  | 'results_available'
  | 'no_competition'
  | 'not_started'
  | 'ended_no_proclamation'
  | 'active';

interface DashboardContentProps {
  status: GameStatus;
  endDate: Date | null;
  countdown: number | null;
  onCompleteGameCleanup: () => void;
  stats: Stats | null;
  demarrerJeu: () => void;
}

const DashboardContent = memo(({
  status,
  endDate,
  countdown,
  onCompleteGameCleanup,
  stats,
  demarrerJeu,
}: DashboardContentProps) => {
  switch (status) {
    case 'active':
      if (endDate && stats) {
        return (
          <ActiveBannerPlay
            endDate={endDate}
            countdown={countdown}
            onFinish={onCompleteGameCleanup}
            stats={stats}
            showBandeauButton={false}
            demarrerJeu={demarrerJeu}
          />
        );
      }
      return <NoCompetitionBanner />;

    case 'no_competition':
    case 'not_started':
    case 'results_available':
    case 'ended_no_proclamation':
    default:
      return <NoCompetitionBanner />;
  }
});

DashboardContent.displayName = "DashboardContent";

export default DashboardContent;
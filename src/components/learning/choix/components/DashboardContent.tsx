'use client';
import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { memo } from 'react';
import ActiveBannerPlay from "../../home/dashboard/ActiveBannerPlay";
import NoCompetitionBanner from "../../home/dashboard/NoCompetitionBanner";

type GameStatus = 'results_available' | 'no_competition' | 'not_started' | 'ended_no_proclamation' | 'active';

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
    demarrerJeu
}: DashboardContentProps) => {
    switch (status) {
        case 'no_competition':
            return <NoCompetitionBanner />;

        case 'not_started':
            return <NoCompetitionBanner />;

        case 'active':
            if (endDate) {
                return (
                    <ActiveBannerPlay
                        endDate={endDate}
                        countdown={countdown}
                        onFinish={onCompleteGameCleanup}
                        stats={stats!}
                        showBandeauButton={false}
                        demarrerJeu={demarrerJeu}
                    />
                );
            }
            return <NoCompetitionBanner />;

        default:
            return <NoCompetitionBanner />;
    }
});

export default DashboardContent;
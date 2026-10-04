'use client';
import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { memo } from 'react';
import ActiveBanner from "../dashboard/ActiveBanner";
import NoCompetitionBanner from "../dashboard/NoCompetitionBanner";
import NotStartedBanner from "../dashboard/NotStartedBanner";

type GameStatus = 'results_available' | 'no_competition' | 'not_started' | 'ended_no_proclamation' | 'active';

interface DashboardContentProps {
    status: GameStatus;
    startDate: Date | null;
    endDate: Date | null;
    countdown: number | null;
    onDemarrerJeu: () => void;
    onCompleteGameCleanup: () => void;
    stats: Stats | null;
}

const DashboardContent = memo(({
    status,
    startDate,
    endDate,
    countdown,
    onDemarrerJeu,
    onCompleteGameCleanup,
    stats
}: DashboardContentProps) => {
    switch (status) {
        case 'no_competition':
            return <NoCompetitionBanner />;

        case 'not_started':
            if (startDate) {
                return (
                    <NotStartedBanner
                        startDate={startDate}
                        onFinish={onDemarrerJeu}
                        countdown={countdown}
                    />
                );
            }
            return <NoCompetitionBanner />;

        case 'active':
            if (endDate) {
                return (
                    <ActiveBanner
                        demarrerJeu={onDemarrerJeu}
                        endDate={endDate}
                        showButton={true}
                        countdown={countdown}
                        onFinish={onCompleteGameCleanup}
                        stats={stats!}
                    />
                );
            }

            return <NoCompetitionBanner />;

        default:
            return <NoCompetitionBanner />;
    }
});

export default DashboardContent;
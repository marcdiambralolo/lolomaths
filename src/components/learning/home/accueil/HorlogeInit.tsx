'use client';
import Loader from "@/app/loading";
import { useHorlogeInit } from "@/hooks/learning/home/useHorlogeInit";
import { memo } from 'react';
import DashboardContent from "./DashboardContent";

const HorlogeInit = memo(() => {
    const {
        demarrerJeu, completeGameCleanup, startDate, endDate, isLoading, gameState, countdown, stats,
    } = useHorlogeInit();

    if (isLoading) return <Loader />;

    return (
        <DashboardContent
            status={gameState.status}
            startDate={startDate}
            endDate={endDate}
            countdown={countdown}
            onDemarrerJeu={demarrerJeu}
            onCompleteGameCleanup={completeGameCleanup}
            stats={stats}
        />
    );
});

export default HorlogeInit;
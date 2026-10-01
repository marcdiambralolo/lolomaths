'use client';
import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { useFinishState } from "@/hooks/learning/home/useFinishState";
import { useDiambraStore } from "@/lib/store/diambra.store";
import { AlertCircle, History, Trophy } from "lucide-react";
import Link from 'next/link';
import { memo } from 'react';
import { GlowButton } from "../../commons/Boutons";
import { CountdownTimer } from './CountdownTimer';
import { GameStatsGridPlay } from "./GameStatsGridPlay";

interface ActiveBannerProps {
    endDate: Date;
    onFinish: () => void;
    countdown?: number | null;
    isTimeUp?: boolean;
    stats: Stats;
    showBandeauButton: boolean;
    demarrerJeu: () => void;
}

const WARNING_THRESHOLD = 300;

const FinishedState = () => (
    <div className="w-full rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 mb-6 shadow-xl animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-white/20 p-4">
                <Trophy className="w-12 h-12 text-yellow-300" aria-hidden="true" />
            </div>

            <h2 className="text-2xl font-bold text-white">🏆 Édition terminée !</h2>
            <p className="text-white/80 text-sm max-w-xs">
                Le jeu est terminé. Consultez les résultats.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
                <Link
                    href="/star/learning/historique/123456789"
                    className="flex items-center justify-center gap-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                >
                    <History className="w-5 h-5" />
                    Voir l'historique
                </Link>
            </div>
        </div>
    </div>
);

const WarningBanner = ({ countdown }: { countdown: number }) => {
    if (countdown >= WARNING_THRESHOLD || countdown <= 0) return null;

    return (
        <div className="flex items-center gap-2 text-yellow-200 text-xs animate-pulse">
            <AlertCircle className="w-3 h-3" />
            <span>Le jeu se termine bientôt !</span>
        </div>
    );
};

const ActiveGameContent = ({
    endDate,
    onFinish,
    countdown,
    stats,
    showBandeauButton,
    demarrerJeu,
}: {
    endDate: Date;
    onFinish: () => void;
    countdown?: number | null;
    stats: Stats;
    showBandeauButton: boolean;
    demarrerJeu: () => void;
}) => {
    const { gameConfig } = useDiambraStore();

    return (
        <div className="w-full rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 mb-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <div className="text-center w-full">
                    <CountdownTimer targetDate={endDate} onFinish={onFinish} />
                </div>

                {showBandeauButton && countdown !== 0 && (
                    <GlowButton onClick={demarrerJeu} variant="danger" size="lg">
                        JOUER A NOUVEAU
                    </GlowButton>
                )}

                <GameStatsGridPlay gameConfig={gameConfig!} stats={stats} />

                {countdown !== null && (
                    <WarningBanner countdown={countdown!} />
                )}
            </div>
        </div>
    );
};

const ActiveBannerPlay = ({
    endDate,
    onFinish,
    countdown,
    isTimeUp = false,
    stats,
    showBandeauButton,
    demarrerJeu,
}: ActiveBannerProps) => {
    const { showHistory } = useFinishState(isTimeUp);
    const isFinished = isTimeUp || showHistory;

    if (isFinished) {
        return <FinishedState />;
    }

    return (
        <ActiveGameContent
            endDate={endDate}
            onFinish={onFinish}
            countdown={countdown}
            stats={stats}
            showBandeauButton={showBandeauButton}
            demarrerJeu={demarrerJeu}
        />
    );
};

export default memo(ActiveBannerPlay);
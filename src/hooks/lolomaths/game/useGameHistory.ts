import { useCompetitionStore } from "@/lib/store/useCompetitionStore";
import { useEffect, useRef, useState } from "react";

export interface GameHistoryItem {
    score: number;
    combination: string;
}

export const useGameHistory = () => {
    const store = useCompetitionStore();
    const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);

    const processedGamesRef = useRef(0);

    useEffect(() => {
        const currentGameCount = store.cnbjeu;

        if (
            currentGameCount <= processedGamesRef.current ||
            store.gameResults.length === 0
        ) {
            return;
        }

        const lastResult =
            store.gameResults[store.gameResults.length - 1];

        if (!lastResult) {
            return;
        }

        setGameHistory((previousHistory) => [
            ...previousHistory,
            {
                score: lastResult.notedjeu,
                combination: lastResult.combine || "N/A",
            },
        ]);

        processedGamesRef.current = currentGameCount;
    }, [store.cnbjeu, store.gameResults]);

    return { gameHistory };
};
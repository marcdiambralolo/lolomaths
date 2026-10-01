"use client";
import { memo } from "react";
import EditionCard from "./EditionCard";

interface EditionsListProps {
    editions: Array<{
        id: string;
        startDate: string;
        endDate: string;
        status: string;
        isActive: boolean;
        winningCombination: string | null;
    }>;
    getGamesCountByEdition: (editionId: string) => number;
}

const EditionsList = memo(({ editions, getGamesCountByEdition }: EditionsListProps) => {

    if (editions.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">Aucune édition disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {editions.map((edition) => (
                <EditionCard
                    key={edition.id}
                    edition={edition}
                    gamesCount={getGamesCountByEdition(edition.id)}
                />
            ))}
        </div>
    );
});

export default EditionsList;
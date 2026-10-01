"use client";
import EditionsList from "./EditionsList";

const GamesTab = ({
    editions,
    getGamesCountByEdition,
}: {
    editions: any[];
    getGamesCountByEdition: (editionId: string) => number;
}) => (
    <div className="space-y-5">
        <EditionsList
            editions={editions}
            getGamesCountByEdition={getGamesCountByEdition}
        />
    </div>
);

export default GamesTab;
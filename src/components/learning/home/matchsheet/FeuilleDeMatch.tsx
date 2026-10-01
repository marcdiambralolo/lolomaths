'use client';
import { useEndGameGenerator } from "@/hooks/learning/endgame/useEndGameGenerator";
import CompetitionDetails from "./CompetitionDetails";
import LoadMoreButton from "./LoadMoreButton";

const FeuilleDeMatch = () => {
    const {
        handleLoadMoreClick, competitionList, hasMore, remainingCount, isLoadingMore, user,
    } = useEndGameGenerator();

    return (
        <div className="w-full mx-auto max-w-md">
            <div className="space-y-2">
                {competitionList?.map((competition, idx) => (
                    <CompetitionDetails
                        key={competition.id}
                        competition={competition}
                        priority={idx === 0}
                        user={user}
                    />
                ))}

                {hasMore && (
                    <LoadMoreButton
                        onClick={handleLoadMoreClick}
                        remainingCount={remainingCount}
                        isLoading={isLoadingMore}
                    />
                )}
            </div>
        </div>
    );
};

export default FeuilleDeMatch;
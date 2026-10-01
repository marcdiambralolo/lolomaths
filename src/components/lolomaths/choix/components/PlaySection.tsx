'use client';
import { memo } from 'react';
import { PlayButton } from './PlayButton';

const PlaySection = ({
    isSufficient,
    onPlay,
    isPending
}: {
    isSufficient: boolean;
    onPlay: () => void;
    isPending: boolean;
}) => {

    if (!isSufficient) return null;

    return (
        <div className="w-full mt-1">
            <PlayButton
                isSufficient={isSufficient}
                onClick={onPlay}
                isPending={isPending}
            />
        </div>
    );
};

export default PlaySection;
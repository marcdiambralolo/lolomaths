'use client';
import Loader from '@/app/loading';
import ErrorMessage from '@/components/learning/commons/ErrorMessage';
import { useLaMise } from '@/hooks/learning/lamise/useLaMise';
import { memo } from 'react';
import InsufficientTokensMessage from './components/InsufficientTokensMessage';
import MainContainer from './components/MainContainer';
import MarketSection from './components/MarketSection';
import PlaySection from './components/PlaySection';
import { StatusBanner } from './components/StatusBanner';
import { TokenCard } from './components/TokenCard';

const LaMise = () => {
    const {
        handlePlayClick, handleMarketClick,
        isSufficient, loading, requiredQuantity, error, availableQuantity, cardClasses,
    } = useLaMise();

    if (error) return <ErrorMessage />;

    if (loading) return <Loader />;

    return (
        <MainContainer>
            <StatusBanner
                isSufficient={isSufficient}
                requiredQuantity={requiredQuantity}
                availableQuantity={availableQuantity}
            />

            <TokenCard
                isSufficient={isSufficient}
                requiredQuantity={requiredQuantity}
                availableQuantity={availableQuantity}
                cardClasses={cardClasses}
                onPlayClick={handlePlayClick}
                isPending={loading}
            />

            {!isSufficient && <InsufficientTokensMessage />}

            <PlaySection
                isSufficient={isSufficient}
                onPlay={handlePlayClick}
                isPending={loading}
            />

            <MarketSection
                onMarket={handleMarketClick}
                isPending={loading}
            />
        </MainContainer>
    );
};

export default memo(LaMise);
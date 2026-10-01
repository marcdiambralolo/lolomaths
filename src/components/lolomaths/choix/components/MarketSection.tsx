'use client';
import { MarketButton } from './MarketButton';

const MarketSection = ({
    onMarket,
    isPending
}: {
    onMarket: () => void;
    isPending: boolean;
}) => (
    <div className="w-full">
        <MarketButton
            onClick={onMarket}
            isPending={isPending}
        />
    </div>
);

export default MarketSection;
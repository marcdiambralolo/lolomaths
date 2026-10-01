"use client";
import { ShoppingBag, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";

const StatsSection = ({ totalTransactions, totalSpent }: { totalTransactions: number; totalSpent: number }) => (
    <div className="flex gap-4">
        <StatsCard
            label="transactions"
            value={totalTransactions}
            icon={ShoppingBag}
        />
        <StatsCard
            label="dépense"
            value={`${totalSpent.toLocaleString()} F`}
            icon={TrendingUp}
        />
    </div>
);

export default StatsSection;
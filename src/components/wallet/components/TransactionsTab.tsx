"use client";
import { staggerContainer } from "@/lib/animations";
import { motion } from "framer-motion";
import StatsSection from "./StatsSection";
import TransactionEmptyState from "./TransactionEmptyState";
import TransactionList from "./TransactionList";
import TransactionsToolbar from "./TransactionsToolbar";

type SortOrder = "newest" | "oldest" | "amount_high" | "amount_low";

const TransactionsTab = ({
    stats,
    sortOrder,
    setSortOrder,
    onRefresh,
    isRefreshing,
    filteredTransactions,
}: {
    stats: { totalTransactions: number; totalSpent: number };
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    filteredTransactions: any[];
}) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-5"
    >
        <StatsSection
            totalTransactions={stats.totalTransactions}
            totalSpent={stats.totalSpent}
        />

        <TransactionsToolbar
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
        />

        {filteredTransactions.length === 0 ? (
            <TransactionEmptyState />
        ) : (
            <TransactionList transactions={filteredTransactions} />
        )}
    </motion.div>
);

export default TransactionsTab;
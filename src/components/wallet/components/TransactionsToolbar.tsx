"use client";
import { cx } from "@/lib/functions";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

function TransactionsToolbar({
    onRefresh,
    isRefreshing,
    sortOrder,
    setSortOrder,
}: {
    onRefresh: () => void;
    isRefreshing: boolean;
    sortOrder: "newest" | "oldest" | "amount_high" | "amount_low";
    setSortOrder: (v: "newest" | "oldest" | "amount_high" | "amount_low") => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 mb-4">
            <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
                type="button"
            >
                <RefreshCw className={cx("h-4 w-4", isRefreshing && "animate-spin")} />
            </motion.button>

            <select
                value={sortOrder}
                onChange={(e) =>
                    setSortOrder(e.target.value as "newest" | "oldest" | "amount_high" | "amount_low")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
            >
                <option value="newest">📅 Plus récent</option>
                <option value="oldest">📅 Plus ancien</option>
                <option value="amount_high">💰 Montant décroissant</option>
                <option value="amount_low">💰 Montant croissant</option>
            </select>
        </div>
    );
}

export default TransactionsToolbar;
"use client";
import { Transaction, TransactionItem } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Calendar, CreditCard } from "lucide-react";
import { memo, useMemo } from "react";
import { fadeInUp } from "./constantes";
import OfferingItemCard from "./OfferingItemCard";

function normalizeItem(item: TransactionItem) {
    if (typeof item.offeringId === 'object' && item.offeringId !== null) {
        return {
            ...item.offeringId,
            quantity: item.quantity,
            price: item.price ?? item.offeringId.price,
            name: item.offeringId.name ?? 'Jeton',
        };
    }

    return {
        ...item, name: item.name ?? 'Jeton',
        price: item.price ?? item.unitPrice ?? 0,
    };
}

const TransactionCard = memo(function TransactionCard({
    transaction,
}: {
    transaction: Transaction;
    index: number;
}) {

    const normalizedItems = useMemo(
        () => transaction.items.map((item) => normalizeItem(item)),
        [transaction.items]
    );

    return (
        <motion.div
            variants={fadeInUp}
            className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
            <div className="p-4">
                <div className="mb-3 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="h-4 w-4 text-indigo-500" />
                            <p className="text-xs font-mono font-semibold text-gray-500">
                                ID :   {transaction.transactionId?.slice(-12)}
                            </p>
                        </div>
                        <p className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.completedAt || transaction.createdAt).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 space-y-2 overflow-hidden"
                >
                    {normalizedItems.map((item, idx) => (
                        <OfferingItemCard key={idx} item={item} index={idx} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
});

export default TransactionCard;
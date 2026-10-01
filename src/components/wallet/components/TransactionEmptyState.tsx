"use client";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

function TransactionEmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-white border border-gray-100 p-10 text-center shadow-sm"
        >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <ShoppingBag className="h-8 w-8 text-indigo-500" />
            </div>

            <h3 className="mb-1 text-lg font-bold text-gray-800">Aucune transaction</h3>
            <p className="text-sm text-gray-500">
                Vos prochains achats de jetons apparaîtront ici
            </p>
        </motion.div>
    );
}

export default TransactionEmptyState;
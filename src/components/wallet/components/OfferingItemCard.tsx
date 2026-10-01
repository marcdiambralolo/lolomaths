"use client";
import { motion } from "framer-motion";
import { memo } from "react";

interface OfferingItemCardProps {
    item: any;
    index: number;
}

const OfferingItemCard = memo(function OfferingItemCard({
    item,
    index,
}: OfferingItemCardProps) {

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
        >
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                </div>

                <p className="text-xs text-gray-500">
                    {item.quantity} × {item.price?.toLocaleString()} FCFA
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm font-bold text-indigo-600">
                    {(item.quantity * item.price).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400">FCFA</p>
            </div>
        </motion.div>
    );
});

export default OfferingItemCard;
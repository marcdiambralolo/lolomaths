"use client";
import { motion } from "framer-motion";
import { memo, type ElementType } from "react";
import { fadeInUp } from "./constantes";

const StatsCard = memo(function StatsCard({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    icon: ElementType;
}) {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className="flex-1 rounded-xl bg-white border border-gray-100 p-5 shadow-sm text-center"
        >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                <Icon className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
            </p>
        </motion.div>
    );
});

export default StatsCard;
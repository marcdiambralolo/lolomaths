'use client';
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const SecurityBadge = () => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="mt-5 sm:mt-6 text-center"
    >
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-xs sm:text-sm font-medium shadow-lg hover:bg-white/15 transition-colors cursor-default"
        >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />

            <span>Vos données sont protégées.</span>
        </motion.div>
    </motion.div>
); 
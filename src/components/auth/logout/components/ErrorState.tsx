'use client';
import { motion, Variants } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 22, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};

export const ErrorState = () => (
    <motion.div
        key="error"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 text-center"
    >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-xl shadow-orange-500/40" />
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 0.4, repeat: 3 }}>
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
            </div>
        </div>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Petite erreur...</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-5">Redirection en cours...</motion.p>

        <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2E5AA6] sm:h-6 sm:w-6" />
    </motion.div>
);
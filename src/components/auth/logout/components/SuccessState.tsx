'use client';
import { motion, Variants } from "framer-motion";
import { Check, Star } from "lucide-react";

const checkVariants: Variants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1, transition: { delay: 0.15, type: "spring", stiffness: 220, damping: 18 } }
};

const CELEBRATION_STARS = 6;

export const SuccessState = () => (
    <motion.div
        key="success"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 text-center"
    >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-xl shadow-green-500/40" />

            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div variants={checkVariants} initial="hidden" animate="visible">
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[3]" />
                </motion.div>
            </div>

            {[0, 1].map((i) => (
                <motion.div key={i} className="absolute inset-0 border-3 border-green-400 rounded-full" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8 + i * 0.4, opacity: 0 }} transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity, ease: "easeOut" }} />
            ))}
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Déconnexion réussie !</motion.h2>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-slate-600 text-sm sm:text-base">À bientôt sur Lolomaths ✨</motion.p>

        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
            {Array.from({ length: CELEBRATION_STARS }, (_, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15, scale: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.45 + i * 0.08, type: "spring", stiffness: 220 }}>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                </motion.div>
            ))}
        </div>
    </motion.div>
);

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 22, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};
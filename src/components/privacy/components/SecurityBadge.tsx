'use client';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const SecurityBadge = () => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center"
    >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-purple-500" />

            <span className="text-xs text-purple-600">Vos données sont protégées</span>
        </div>
    </motion.div>
);

export default SecurityBadge;
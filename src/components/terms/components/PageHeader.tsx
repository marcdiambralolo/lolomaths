'use client';
import { motion } from 'framer-motion';

const PageHeader = () => (
    <div className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-2 pt-8 pb-6 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3"
            >
                Conditions d'utilisation
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-purple-500 text-sm"
            >
                Dernière mise à jour : <span className="font-semibold text-purple-700">27 mai 2026</span>
            </motion.p>
        </div>
    </div>
);

export default PageHeader;
'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const LAST_UPDATED = '23 août 2026';
const EFFECTIVE_DATE = '23 août 2026';

const PageHeader = () => (
    <div className="relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 mb-4"
            >
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Protection des données</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3"
            >
                Politique de confidentialité
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-purple-500 text-sm"
            >
                Dernière mise à jour : <span className="font-semibold text-purple-700">{LAST_UPDATED}</span>
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-xs text-purple-400"
            >
                Entrée en vigueur le {EFFECTIVE_DATE}
            </motion.p>
        </div>
    </div>
);

export default PageHeader;
'use client';
import { motion } from 'framer-motion';

const LegalNotice = () => (
    <motion.div
        className="mt-8 text-center text-xs text-gray-400 border-t border-purple-100 pt-6"
    >
        <p>© 2026 Diambra — Tous droits réservés.</p>

        <p className="mt-1">
            Conformément à la réglementation ivoirienne sur la protection des données personnelles.
        </p>
    </motion.div>
);

export default LegalNotice;
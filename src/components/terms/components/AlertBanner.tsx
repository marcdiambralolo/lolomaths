'use client';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ANIMATION_VARIANTS } from './constantes';

const AlertBanner = () => (
    <motion.div
        variants={ANIMATION_VARIANTS.fadeInUp}
        className="m-6 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-4"
    >
        <div className="flex items-start gap-3">
            <div className="rounded-full bg-purple-100 p-1.5 mt-0.5">
                <AlertCircle className="h-4 w-4 text-purple-600" />
            </div>

            <div>
                <p className="text-sm font-semibold text-purple-800 mb-1">
                    En jouant à <span className="text-purple-600">Lolomaths </span>, vous acceptez ces conditions.
                </p>
                <p className="text-xs text-purple-600">
                    Ce jeu est un divertissement purement ludique.
                </p>
            </div>
        </div>
    </motion.div>
);

export default AlertBanner;
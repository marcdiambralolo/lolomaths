'use client';
import { motion } from 'framer-motion';
import { Brain, Gamepad2, } from 'lucide-react';
import { ANIMATION_VARIANTS } from './constantes';
import CacheLink from '@/components/commons/CacheLink';

const ActionButtons = () => {
    const { scaleOnHover } = ANIMATION_VARIANTS;

    return (
        <motion.div
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="border-t border-purple-100 bg-purple-50/30 p-6 flex flex-col sm:flex-row gap-3"
        >
            <motion.div {...scaleOnHover} className="flex-1">
                <CacheLink
                    href="/star/profil"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                    <Gamepad2 className="h-4 w-4" />
                    Commencer à jouer
                </CacheLink>
            </motion.div>

            <motion.div {...scaleOnHover} className="flex-1">
                <CacheLink
                    href="/about"
                    className="flex items-center justify-center gap-2 w-full bg-white border-2 border-purple-200 text-purple-700 font-bold py-3 rounded-xl transition-all hover:border-purple-300 hover:text-purple-600"
                >
                    <Brain className="h-4 w-4" />
                    En savoir plus
                </CacheLink>
            </motion.div>
        </motion.div>
    );
};

export default ActionButtons;
'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AnimatedLogo = () => (
    <div className="relative mx-auto mb-6 sm:mb-8 w-32 h-32 sm:w-40 sm:h-40">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-4 border-indigo-200 border-b-indigo-500"
        />
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border-4 border-purple-200/50 border-r-purple-400 rounded-full"
        />

        <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <div className="relative">
                <Sparkles className="h-12 w-12 text-purple-600 sm:h-16 sm:w-16" strokeWidth={1.5} />
                <motion.div
                    className="absolute inset-0 rounded-full bg-purple-400 blur-xl"
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    </div>
);
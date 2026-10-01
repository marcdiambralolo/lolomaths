'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { BackgroundOrbs } from './BackgroundOrbs';
import { FloatingParticles } from './FloatingParticles';
import { LoadingDots } from './LoadingDots';
import { LoadingSteps } from './LoadingSteps';

export const LoadingFallbackComponent = () => {

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white overflow-hidden relative">
            <BackgroundOrbs />
            <FloatingParticles />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                }}
                className="relative z-10 text-center max-w-md"
            >
                <AnimatedLogo />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <motion.h2
                        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Chargement en cours
                    </motion.h2>

                    <p className="text-sm text-gray-500">
                        Veuillez patienter quelques instants
                    </p>

                    <LoadingDots />
                </motion.div>

                <LoadingSteps />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-8"
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Version 1.0
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingFallbackComponent;
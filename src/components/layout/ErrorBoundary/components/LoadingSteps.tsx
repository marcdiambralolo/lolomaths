'use client';
import { motion } from 'framer-motion';

const LOADING_STEPS = [
    { icon: '🎯', text: 'Analyse de vos jeux en cours', delay: 0 },
    { icon: '🧩', text: 'Calcul des points', delay: 0.3 },
    { icon: '✨', text: 'Préparation de votre espace', delay: 0.6 }
];

export const LoadingSteps = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6 sm:mt-8 space-y-2"
    >
        {LOADING_STEPS.map((step, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: step.delay,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 300
                }}
                className="flex items-center justify-center gap-2 text-sm text-gray-600"
            >
                <motion.span
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: step.delay
                    }}
                >
                    {step.icon}
                </motion.span>
                <span>{step.text}</span>
            </motion.div>
        ))}
    </motion.div>
);
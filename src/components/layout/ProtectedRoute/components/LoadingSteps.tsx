'use client';
import { motion } from 'framer-motion';
import { Lock, Shield, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
    { icon: Shield, text: 'Activation de la protection', delay: 0 },
    { icon: Lock, text: 'Securisation de la session', delay: 0.3 },
    { icon: Sparkles, text: 'Ouverture de votre espace', delay: 0.6 },
];

const LoadingSteps = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-10 space-y-2 sm:mt-12"
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
                    stiffness: 300,
                }}
                className="flex items-center justify-center gap-3 text-xs text-violet-100/80 sm:text-sm"
            >
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: step.delay,
                    }}
                >
                    <step.icon className="h-4 w-4" />
                </motion.div>
                <span>{step.text}</span>
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: step.delay,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300"
                />
            </motion.div>
        ))}
    </motion.div>
);

export default LoadingSteps;
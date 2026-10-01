'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import PulseDots from './PulseDots';

const LoaderHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-3"
    >
        <motion.h2
            className="text-2xl font-black tracking-tight sm:text-3xl"
            animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: 'linear',
            }}
            style={{
                backgroundImage:
                    'linear-gradient(90deg, #c4b5fd, #e879f9, #fde68a, #c4b5fd)',
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            Protection de vos jeux en cours
        </motion.h2>

        <motion.p
            className="text-sm font-medium text-violet-100/80 sm:text-base"
            animate={{
                opacity: [0.6, 1, 0.6],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            <Shield className="mr-2 inline h-4 w-4" />
            Harmonisation et sécurisation de votre espace
        </motion.p>

        <PulseDots />
    </motion.div>
);

export default LoaderHeader;
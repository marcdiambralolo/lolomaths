'use client';
import { motion } from 'framer-motion';

export const BackgroundOrbs = () => (
    <>
        <motion.div
            className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 
                       bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="absolute -bottom-20 -right-20 sm:-bottom-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 
                       bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
    </>
);
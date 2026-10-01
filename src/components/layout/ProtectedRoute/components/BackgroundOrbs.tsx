'use client';
import { motion } from 'framer-motion';

const BackgroundOrbs = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.12, 0.24, 0.12],
                x: [0, 50, 0],
                y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl sm:h-96 sm:w-96"
        />
        <motion.div
            animate={{
                scale: [1, 1.4, 1],
                opacity: [0.08, 0.18, 0.08],
                x: [0, -40, 0],
                y: [0, 40, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl sm:h-96 sm:w-96"
        />
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.06, 0.14, 0.06],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/15 blur-3xl sm:h-[32rem] sm:w-[32rem]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
    </div>
);

export default BackgroundOrbs;
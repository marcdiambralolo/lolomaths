'use client';
import { motion } from 'framer-motion';

const PULSE_DOTS = [0, 1, 2];

export const LoadingDots = () => (
    <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
        {PULSE_DOTS.map((i) => (
            <motion.div
                key={i}
                className="h-2.5 w-2.5 rounded-full bg-purple-500"
                animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.3, 1, 0.3]
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2
                }}
            />
        ))}
    </div>
); 
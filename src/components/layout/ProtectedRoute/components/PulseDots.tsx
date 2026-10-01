'use client';
import { motion } from 'framer-motion';

const PULSE_DOTS = [0, 1, 2, 3];

const PulseDots = () => (
    <div className="flex items-center justify-center gap-2 pt-2">
        {PULSE_DOTS.map((i) => (
            <motion.div
                key={i}
                className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                    backgroundColor: ['#8B5CF6', '#E879F9', '#FDE68A', '#8B5CF6'],
                }}
                transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                }}
            />
        ))}
    </div>
);

export default PulseDots;
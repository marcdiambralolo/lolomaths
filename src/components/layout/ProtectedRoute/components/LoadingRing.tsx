'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface LoadingRingProps {
    delay: number;
    duration: number;
    size: string;
    borderClassName: string;
    arcColor: string;
}

const LoadingRing = memo<LoadingRingProps>(
    ({ delay, duration, size, borderClassName, arcColor }) => (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, duration: 0.4, type: 'spring' }}
            className={`absolute ${size} rounded-full border-2 sm:border-4 ${borderClassName}`}
        >
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent sm:border-4"
                style={{
                    borderTopColor: arcColor,
                    borderRightColor: arcColor,
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </motion.div>
    )
);

export default LoadingRing; 
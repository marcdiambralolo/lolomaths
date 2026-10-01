'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface ShieldOrbitProps {
    radius: number;
    duration: number;
    reverse?: boolean;
    dotClassName?: string;
}

export const ShieldOrbit = memo<ShieldOrbitProps>(
    ({ radius, duration, reverse = false, dotClassName = 'bg-violet-300 shadow-violet-400/50' }) => (
        <motion.div
            className="absolute inset-0"
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            <div
                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full shadow-lg ${dotClassName}`}
                style={{
                    transform: `translate(-50%, -50%) translateY(-${radius}px)`,
                }}
            />
        </motion.div>
    )
); 
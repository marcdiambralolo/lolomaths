'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface OrbitingStarProps {
    delay: number;
    duration: number;
    radius: number;
}

const OrbitingStarComponent = ({ delay, duration, radius }: OrbitingStarProps) => {

    return (
        <motion.div
            initial={{ rotate: delay * 120 }}
            animate={{ rotate: delay * 120 + 360 }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
                delay
            }}
            className="absolute inset-0 pointer-events-none"
        >
            <div
                className="absolute left-1/2 top-1/2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg 
                   shadow-yellow-300/50"
                style={{
                    transform: `translate(-50%, -50%) translateX(${radius}px)`
                }}
            />
        </motion.div>
    );
};

export const OrbitingStar = memo(OrbitingStarComponent, (prev, next) => {
    return prev.duration === next.duration && prev.radius === next.radius;
});
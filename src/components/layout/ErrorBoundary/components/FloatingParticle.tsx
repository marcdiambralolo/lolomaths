'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface FloatingParticleProps {
    delay: number;
    x: string;
    y: string;
}

const FloatingParticleComponent = ({ delay, x, y }: FloatingParticleProps) => {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0.2, 0.8, 0.2],
                y: [0, -20, 0]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay
            }}
            className="absolute h-1 w-1 rounded-full bg-[#9BC2FF] sm:h-1.5 sm:w-1.5"
            style={{ left: x, top: y }}
        />
    );
};

export const FloatingParticle = memo(FloatingParticleComponent, (prev, next) => {
    return prev.x === next.x && prev.y === next.y;
});
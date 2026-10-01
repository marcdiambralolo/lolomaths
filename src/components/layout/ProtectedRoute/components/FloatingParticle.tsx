'use client';
import { motion, Variants } from 'framer-motion';
import React, { memo } from 'react';

const particleVariants: Variants = {
    float: (custom: number) => ({
        y: [0, -20, 0],
        x: [0, custom * 5, 0],
        opacity: [0, 1, 0],
        scale: [0.8, 1.15, 0.8],
        transition: {
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: custom * 0.2,
        },
    }),
};

interface FloatingParticleProps {
    Icon: React.ElementType;
    delay: number;
    x: string;
    y: string;
    color: string;
}

export const FloatingParticle = memo<FloatingParticleProps>(({ Icon, delay, x, y, color }) => (
    <motion.div
        className="absolute"
        style={{ left: x, top: y }}
        custom={delay}
        variants={particleVariants}
        animate="float"
    >
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
    </motion.div>
));
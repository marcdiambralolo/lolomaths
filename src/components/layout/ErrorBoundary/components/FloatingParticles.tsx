'use client';
import { motion } from 'framer-motion';

export const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
            { x: '10%', y: '20%', delay: 0 },
            { x: '90%', y: '30%', delay: 0.5 },
            { x: '20%', y: '70%', delay: 1 },
            { x: '80%', y: '60%', delay: 1.5 },
            { x: '50%', y: '15%', delay: 2 },
            { x: '40%', y: '85%', delay: 2.5 }
        ].map((pos, index) => (
            <motion.div
                key={index}
                className="absolute w-1 h-1 bg-purple-300 rounded-full"
                style={{ left: pos.x, top: pos.y }}
                animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: pos.delay,
                    ease: 'easeInOut'
                }}
            />
        ))}
    </div>
); 
'use client';
import { motion } from 'framer-motion';
import { Lock, Shield, Sparkles } from 'lucide-react';

const CenterShield = () => (
    <motion.div
        variants={{
            hidden: { scale: 0, rotate: -180 },
            visible: {
                scale: 1,
                rotate: 0,
                transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    duration: 0.6,
                },
            },
        }}
        className="absolute inset-0 flex items-center justify-center"
    >
        <div className="relative">
            <motion.div
                animate={{
                    scale: [1, 1.18, 1],
                    opacity: [0.35, 0.65, 0.35],
                }}
                transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-violet-500 blur-xl"
            />
            <div
                className="relative flex h-20 w-20 items-center justify-center rounded-[1.4rem]
                    bg-gradient-to-br from-violet-600 via-fuchsia-500 to-purple-500
                    shadow-2xl shadow-violet-500/40 sm:h-24 sm:w-24"
            >
                <Shield className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                <Lock className="absolute h-5 w-5 text-white/90 sm:h-6 sm:w-6" />
                <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-amber-200 sm:h-5 sm:w-5" />
            </div>
        </div>
    </motion.div>
);

export default CenterShield;
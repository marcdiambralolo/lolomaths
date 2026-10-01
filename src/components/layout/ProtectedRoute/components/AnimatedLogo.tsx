'use client';
import { motion, Variants } from 'framer-motion';
import CenterShield from './CenterShield';
import LoadingRings from './LoadingRings';
import { ShieldOrbit } from './ShieldOrbit';

const glowVariants: Variants = {
    pulse: {
        scale: [1, 1.2, 1],
        opacity: [0.25, 0.55, 0.25],
        transition: {
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

const AnimatedLogo = () => (
    <div className="relative mx-auto mb-8 h-40 w-40 sm:h-48 sm:w-48">
        <motion.div
            variants={glowVariants}
            animate="pulse"
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-indigo-400/25 blur-2xl"
        />

        <LoadingRings />
        <CenterShield />

        <ShieldOrbit radius={70} duration={4} dotClassName="bg-violet-300 shadow-violet-400/50" />
        <ShieldOrbit radius={80} duration={5} reverse dotClassName="bg-fuchsia-300 shadow-fuchsia-400/50" />
        <ShieldOrbit radius={90} duration={6} dotClassName="bg-amber-200 shadow-amber-300/50" />
    </div>
);

export default AnimatedLogo;
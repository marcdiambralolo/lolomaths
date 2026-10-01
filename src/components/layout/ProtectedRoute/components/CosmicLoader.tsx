'use client';
import { motion, Variants } from 'framer-motion';
import { memo } from 'react';
import AnimatedLogo from './AnimatedLogo';
import BackgroundOrbs from './BackgroundOrbs';
import FloatingParticlesList from './FloatingParticlesList';
import LoaderHeader from './LoaderHeader';
import LoadingSteps from './LoadingSteps';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

const CosmicLoader = memo(() => (
    <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br
            from-[#12061D] via-[#24103A] to-[#090511]"
    >
        <BackgroundOrbs />
        <FloatingParticlesList />

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="z-10 text-center"
        >
            <AnimatedLogo />
            <LoaderHeader />
            <LoadingSteps />
        </motion.div>
    </div>
));

export default CosmicLoader;
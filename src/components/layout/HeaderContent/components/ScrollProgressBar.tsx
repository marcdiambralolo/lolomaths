'use client';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';

interface ScrollProgressBarProps {
    scrollY: MotionValue<number>;
    progressWidth: string | MotionValue<string>;
}

export function ScrollProgressBar({ scrollY, progressWidth }: ScrollProgressBarProps) {

    return (
        <motion.div
            className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]"
            style={{ width: scrollY.get() > 0 ? progressWidth : '0%' }}
        >
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
        </motion.div>
    );
}
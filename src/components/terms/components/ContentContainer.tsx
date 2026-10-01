'use client';
import { staggerContainer } from '@/lib/animations';
import { motion } from 'framer-motion';

const ContentContainer = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white border border-purple-100 shadow-sm overflow-hidden"
    >
        {children}
    </motion.div>
);

export default ContentContainer;
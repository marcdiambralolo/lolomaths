'use client';
import CacheLink from '@/components/commons/CacheLink';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeaderLogo() {
    return (
        <CacheLink href="/" className="flex items-center gap-2.5 group">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="relative flex items-center justify-center overflow-hidden py-1 px-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
            >
                <div className="relative h-9 w-36 sm:h-12 sm:w-48 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Lolomaths"
                        width={986}
                        height={241}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>

                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#2E5AA6]/20 via-[#4F83D1]/20 to-[#244A8A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            </motion.div>
        </CacheLink>
    );
} 
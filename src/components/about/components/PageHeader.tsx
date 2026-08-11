'use client';
import CacheLink from '@/components/commons/CacheLink';
import { motion } from 'framer-motion';
import { ChevronRight } from "lucide-react";
import Image from 'next/image';
import { BUTTON_STYLES } from './about.constants';

const PageHeader = () => (
    <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative shrink-0"
        >
            <motion.div
                animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-4"
            />

            <div className="relative flex items-center justify-center gap-4">
                <div className="relative h-14 w-14 flex-shrink-0 sm:h-16 sm:w-16">
                    <Image
                        src="/logo.png"
                        alt="Lolomaths Logo"
                        fill
                        priority
                        className="object-contain"
                        sizes="(max-width: 640px) 56px, 64px"
                    />
                </div>
                <div className="flex flex-col items-start text-left">
                    <span className="text-2xl font-black tracking-tight sm:text-3xl">
                        <span className="text-blue-600">Lolomaths</span>
                    </span>
                    <span className="text-xs font-medium text-gray-400 tracking-wider">
                        Réveillons le génie qui sommeille en nous.
                    </span>
                </div>
            </div>
        </motion.div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CacheLink href="/star/profil" className={BUTTON_STYLES.primary}>
                🎯 Jouer maintenant ! <ChevronRight className="h-4 w-4" />
            </CacheLink>
        </div>
    </section>
);

export default PageHeader;
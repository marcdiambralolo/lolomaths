'use client';
import CacheLink from '@/components/commons/CacheLink';
import { motion } from 'framer-motion';
import Image from "next/image";

const Logo = () => (
    <CacheLink href="/" className="block mb-6 group">
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
        >
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                    src="/logo.png"
                    alt="Logo Lolomaths"
                    fill
                    sizes="(max-width: 768px) 120px, 160px"
                    className="object-contain p-3"
                    priority
                />
            </div>
        </motion.div>
    </CacheLink>
);

export default Logo;
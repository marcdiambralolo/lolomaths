'use client';
import { default as CacheLink } from '@/components/commons/CacheLink';
import { motion } from "framer-motion";
import Image from "next/image";

const Logo = () => (
    <CacheLink href="/" className="block group">
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
        >
            <div className="relative w-80 h-10 overflow-hidden">
                <Image
                    src="/logo.png"
                    alt="Lolomaths Logo"
                    fill
                    sizes="(max-width: 768px) 120px, 160px"
                    className="object-contain"
                    priority
                />
            </div>
        </motion.div>
    </CacheLink>
);

export default Logo;
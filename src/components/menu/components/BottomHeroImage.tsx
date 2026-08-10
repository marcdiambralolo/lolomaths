'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

function BottomHeroImage({ splashImage }: { splashImage: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65 }}
            className="mx-auto mt-8 flex w-full max-w-md justify-center"
        >
            <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative w-full"
            >
                <div className="relative flex aspect-[1/1] w-full items-center justify-center overflow-hidden">
                    <Image
                        src={splashImage}
                        alt="jeu Lolomaths"
                        fill
                        priority
                        sizes="(max-width: 640px) 280px, 360px"
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default BottomHeroImage;
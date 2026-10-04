'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

function SplashLogo() {
    return (
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
    );
}

function SplashLoader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex shrink-0 flex-col items-center gap-3"
        >
            <div className="relative w-48 sm:w-64">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/60">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '0%' }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <motion.span
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="h-2.5 w-2.5 rounded-full bg-indigo-400"
                />
                <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-400">
                    CHARGEMENT EN COURS...
                </p>
                <motion.span
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="h-2.5 w-2.5 rounded-full bg-purple-400"
                />
                <motion.span
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
                    className="h-2.5 w-2.5 rounded-full bg-pink-400"
                />
            </div>
        </motion.div>
    );
}

function SplashImageCard({ splashImage }: { splashImage: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex w-full flex-1 items-center justify-center overflow-hidden p-2"
        >
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-full w-full max-w-4xl"
            >
                <Image
                    src={splashImage}
                    alt="Illustration Lolomaths"
                    fill
                    priority
                    className="object-contain"
                    // ✅ Taille réelle : min(100vw, 896px) car le parent a max-w-4xl
                    sizes="(max-width: 896px) 100vw, 896px"
                />
            </motion.div>
        </motion.div>
    );
}

function SplashScreen({ splashImage }: { splashImage: string }) {
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col justify-between overflow-hidden bg-white p-4 sm:p-6">
            <div className="flex shrink-0 flex-col items-center justify-center gap-4 text-center pt-2">
                <SplashLogo />
                <SplashLoader />
            </div>

            <SplashImageCard splashImage={splashImage} />

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="shrink-0 text-center pb-2"
            >
                <p className="text-[10px] sm:text-xs font-medium tracking-widest text-gray-300">
                    © 2026 LOLOMATHS — Tous droits réservés
                </p>
            </motion.footer>
        </div>
    );
}

export default SplashScreen;
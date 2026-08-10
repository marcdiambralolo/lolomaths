'use client';
import { MAIN_MENU_ITEMS, MainMenuItem } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import BottomHeroImage from './components/BottomHeroImage';
import MenuSection from './components/MenuSection';
import PageFooter from './components/PageFooter';
import SplashScreen from './components/SplashScreen';

const SPLASH_IMAGES = [
    '/splash.jpg',
    '/splashone.jpg',
    '/splashtwo.jpg',
    '/splashthree.jpg',
    '/splashfour.jpg',
] as const;

function getRandomSplashImage() {
    const randomIndex = Math.floor(Math.random() * SPLASH_IMAGES.length);
    return SPLASH_IMAGES[randomIndex];
}

function useInitialLoading(delay = 2000) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [delay]);

    return isLoading;
}

function useRandomSplashImage() {
    return useMemo(() => getRandomSplashImage(), []);
}

export default function HomePage() {
    const router = useRouter();
    const isLoading = useInitialLoading(2000);
    const splashImage = useRandomSplashImage();

    const handleNavigation = (item: MainMenuItem) => {
        router.push(item.href);
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45 }}
                >
                    <SplashScreen splashImage={splashImage} />
                </motion.div>
            ) : (
                <motion.main
                    key="home"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="relative min-h-screen select-none overflow-hidden"
                >
                    <div className="w-full max-w-md mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-8">
                        <div className="my-auto flex flex-col items-center">
                            <div className="mb-5 text-center">
                                <motion.h1
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45 }}
                                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl"
                                >
                                    Lolomaths
                                </motion.h1>
                            </div>

                            <MenuSection items={MAIN_MENU_ITEMS} onNavigate={handleNavigation} />

                            <BottomHeroImage splashImage={splashImage} />
                        </div>

                        <PageFooter />
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    );
}
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MAIN_MENU_ITEMS, MainMenuItem } from '@/lib/interfaces';

const SplashScreen: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 relative overflow-hidden">
        <div className="flex flex-col items-center space-y-4 animate-bounce">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-500/25 text-white tracking-widest ring-4 ring-indigo-50">
                LM
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    LOLOMATHS
                </h1>
                <p className="text-xs text-gray-400 font-medium mt-1">Chargement de votre espace...</p>
            </div>
        </div>
    </div>
);

interface IconProps {
    type: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ type, className = "w-6 h-6" }) => {
    const icons: Record<string, React.ReactNode> = {
        'play-circle': (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        'chart-bar': (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
        ),
        'question-mark-circle': (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return icons[type] || null;
};

interface MenuCardProps {
    item: MainMenuItem;
    onClick: (item: MainMenuItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onClick }) => (
    <button
        onClick={() => onClick(item)}
        className="group relative flex items-center p-5 bg-white/80 backdrop-blur-md hover:bg-white border border-gray-100 hover:border-indigo-200 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.98] overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
        <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/30 transition-all duration-300 mr-4 shrink-0">
            <Icon type={item.icon} />
        </div>

        <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {item.title}
            </h2>
            <p className="text-sm text-gray-500 truncate mt-0.5 font-normal">
                {item.description}
            </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 ml-2 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    </button>
);

const Header: React.FC = () => (
    <header className="max-w-2xl mx-auto w-full pt-4 text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-orange-900">
            Lolo<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">maths</span>
        </h1>
    </header>
);

 const useInitialLoading = (delay: number = 600) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return isLoading;
};

 export default function HomePage() {
    const router = useRouter();
    const isLoading = useInitialLoading();

    const handleNavigation = (item: MainMenuItem) => {
        router.push(item.href);
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <main className="w-full max-w-4xl mx-auto bg-white text-gray-900 flex flex-col justify-between p-4 sm:p-8 relative">
            <Header />
            
            <section className="max-w-xl mx-auto w-full my-auto py-8">
                <div className="grid gap-4">
                    {MAIN_MENU_ITEMS.map((item) => (
                        <MenuCard
                            key={item.id}
                            item={item}
                            onClick={handleNavigation}
                        />
                    ))}
                </div>
            </section>

            <footer className="text-center py-4 text-xs text-gray-400 font-medium">
                © {new Date().getFullYear()} Lolomaths — Tous droits réservés.
            </footer>
        </main>
    );
}
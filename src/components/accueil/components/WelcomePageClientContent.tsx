"use client";
import Loader from '@/app/loading';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CallToAction from './CallToAction';
import ChainRuleWarning from './ChainRuleWarning';
import GameFlow from './GameFlow';
import GameLexicon from './GameLexicon';
import GameObjective from './GameObjective';
import GameRules from './GameRules';
import ScoringSystem from './ScoringSystem';
import WelcomeHeader from './WelcomeHeader';

const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-8");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );
        document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

const useAuthRedirect = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user && user.secretCode) {
            setIsRedirecting(true);
            router.replace('/star/profil');
        }
    }, [user, router]);

    return isRedirecting;
};

export default function WelcomePageClientContent() {
    const isRedirecting = useAuthRedirect();

    useScrollReveal();

    if (isRedirecting) {
        return <Loader />;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 overflow-x-hidden">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
                <WelcomeHeader />
                <GameObjective />
                <GameRules />
                <GameFlow />
                <GameLexicon />
                <ScoringSystem />
                <ChainRuleWarning />
                <CallToAction />
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-400">© 2026 Lolomaths - Tous droits réservés.</p>
                </div>
            </div>
        </main>
    );
}
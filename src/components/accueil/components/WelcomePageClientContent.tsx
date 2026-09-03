"use client";
import Loader from '@/app/loading';
import { useScrollReveal } from '@/hooks/about/useScrollReveal';
import { useAuthRedirect } from '@/hooks/accueil/useAuthRedirect';
import CallToAction from './CallToAction';
import ChainRuleWarning from './ChainRuleWarning';
import GameFlow from './GameFlow';
import GameLexicon from './GameLexicon';
import GameObjective from './GameObjective';
import GameRules from './GameRules';
import ScoringSystem from './ScoringSystem';
import WelcomeHeader from './WelcomeHeader';

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
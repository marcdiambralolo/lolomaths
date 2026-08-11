'use client';
import BackButton from './components/BackButton';
import BasicRulesSection from './components/BasicRulesSection';
import ChainRuleWarning from './components/ChainRuleWarning';
import Divider from './components/Divider';
import GameFlowSection from './components/GameFlowSection';
import GameObjective from './components/GameObjective';
import LexiconSection from './components/LexiconSection';
import PageHeader from './components/PageHeader';
import ScoringSection from './components/ScoringSection';

export default function HelpPage() {

    return (
        <main className="w-full max-w-4xl mx-auto bg-white pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                <BackButton />
                <PageHeader />

                <div className="space-y-8">
                    <GameObjective />
                    <BasicRulesSection />
                    <GameFlowSection />
                    <LexiconSection />
                    <Divider />
                    <ScoringSection />
                    <ChainRuleWarning />
                </div>
            </div>
        </main>
    );
}
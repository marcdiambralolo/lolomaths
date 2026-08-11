'use client';
import BasicRules from "./components/BasicRules";
import CallToAction from "./components/CallToAction";
import ChainRuleWarning from "./components/ChainRuleWarning";
import GameFlow from "./components/GameFlow";
import GameObjective from "./components/GameObjective";
import Lexicon from "./components/Lexicon";
import PageHeader from './components/PageHeader';
import ScoringSystem from "./components/ScoringSystem";
import StickyNav from "./components/StickyNav";
import { useScrollReveal } from './components/useScrollReveal';

export default function AboutPageClient() {
  useScrollReveal();

  return (
    <main className="w-full max-w-4xl mx-auto overflow-x-hidden">
      <StickyNav />

      <div className="mx-auto max-w-5xl px-4 py-4 sm:py-8">
        <PageHeader />
        <GameObjective />
        <BasicRules />
        <GameFlow />
        <Lexicon />
        <ScoringSystem />
        <ChainRuleWarning />
        <CallToAction />
      </div>
    </main>
  );
}
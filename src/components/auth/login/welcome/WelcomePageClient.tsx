'use client';
import BasicRules from "./components/BasicRules";
import GameFlow from "./components/GameFlow";
import GameObjective from "./components/GameObjective";
import HowToPlayCard from "./components/HowToPlayCard";
import Lexicon from "./components/Lexicon";
import SectionHeader from "./components/SectionHeader";
import StatsSection from "./components/StatsSection";

const BackgroundEffects = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
    <div className="absolute right-0 top-28 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
    <div className="absolute bottom-20 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/10" />
  </div>
);

const GameMode = () => (
  <section id="jeu">
    <SectionHeader badge="Comment jouer" title="🎯 Mode Clic" />
    <HowToPlayCard />
  </section>
);

export default function WelcomePageClient() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-4 sm:px-6">
      <BackgroundEffects />

      <div className="relative z-10 space-y-6 sm:space-y-8">
        <GameObjective />
        <BasicRules />
        <GameFlow />
        <Lexicon />
        <StatsSection />
        <GameMode />
      </div>
    </div>
  );
}
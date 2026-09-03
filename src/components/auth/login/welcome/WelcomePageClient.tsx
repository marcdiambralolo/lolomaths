'use client';
import BackgroundEffects from "./components/BackgroundEffects";
import BasicRules from "./components/BasicRules";
import GameFlow from "./components/GameFlow";
import GameMode from "./components/GameMode";
import GameObjective from "./components/GameObjective";
import Lexicon from "./components/Lexicon";
import StatsSection from "./components/StatsSection"; 

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
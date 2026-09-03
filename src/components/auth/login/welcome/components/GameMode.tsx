'use client';
import HowToPlayCard from "./HowToPlayCard";
import SectionHeader from "./SectionHeader";

const GameMode = () => (
    <section id="jeu">
        <SectionHeader badge="Comment jouer" title="🎯 Mode Clic" />
        <HowToPlayCard />
    </section>
);

export default GameMode;
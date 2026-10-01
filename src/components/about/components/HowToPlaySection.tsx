"use client";
import ConicSection from "./ConicSection";
import StepGrid from "./StepGrid";
import { CONFIG } from "./Constantes";

const HowToPlaySection = () => (
    <ConicSection id="jeu" headerTitle="🎮 Comment jouer">
        <StepGrid items={CONFIG.STEPS} />
    </ConicSection>
);

export default HowToPlaySection;
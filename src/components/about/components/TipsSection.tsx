"use client";
import ConicSection from "./ConicSection";
import { CONFIG } from "./Constantes";
import TipGrid from "./TipGrid";

const TipsSection = () => (
    <ConicSection id="conseils" headerTitle="💡 Conseils pratiques">
        <TipGrid items={CONFIG.TIPS} />
    </ConicSection>
);

export default TipsSection;
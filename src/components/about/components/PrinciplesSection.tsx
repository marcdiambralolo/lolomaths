"use client";
import { CONFIG } from "./Constantes";
import PillGrid from "./PillGrid";
import PlainSection from "./PlainSection";

const PrinciplesSection = () => (
    <PlainSection
        id="principe"
        headerTitle="📌 Principe du jeu"
        headerSubtitle="Déplacez les éléments du plateau P2 pour reproduire le plateau P1."
    >
        <PillGrid items={CONFIG.PRINCIPLES} columns={{ sm: 3 }} />
    </PlainSection>
);

export default PrinciplesSection;
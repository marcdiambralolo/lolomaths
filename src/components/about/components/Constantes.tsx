"use client";
import {
    Brain, Clock, Eye, Grid, Image as ImageIcon,
    Layers, Lock, Palette, Shuffle, Sparkles, Target, Trophy, Type, Zap
} from "lucide-react";

export const CONFIG = {
    NAV_ITEMS: [
        { id: "principe", label: "Principe" },
        { id: "jeu", label: "Jeu" },
        { id: "modes", label: "Modes" },
        { id: "difficulte", label: "Difficulté" },
        { id: "evaluation", label: "Évaluation" },
        { id: "conseils", label: "Conseils" },
    ],
    OBJECTIVES: [
        { icon: Brain, title: "Mémoire visuelle", desc: "Développez votre capacité à mémoriser des dispositions." },
        { icon: Target, title: "Concentration", desc: "Restez focalisé pour résoudre le puzzle." },
        { icon: Sparkles, title: "Patience & stratégie", desc: "Planifiez vos mouvements pour gagner du temps." },
        { icon: Trophy, title: "Compétition", desc: "Défiez vos amis et participez à des classements." },
    ],
    PRINCIPLES: [
        { icon: Layers, title: "Plateau P1", desc: "Mémorisez la disposition de référence.", tooltip: "P1 est le modèle à reproduire." },
        { icon: Shuffle, title: "Plateau P2", desc: "Échangez les cases pour retrouver la disposition.", tooltip: "Cliquez sur deux cases pour les échanger." },
        { icon: Clock, title: "Temps limité", desc: "Terminez le puzzle avant la fin du chrono.", tooltip: "Plus vous êtes rapide, meilleur est votre score." },
    ],
    STEPS: [
        { icon: Eye, title: "1. Mémorisez", desc: "Observez le plateau P1 pendant quelques secondes." },
        { icon: Shuffle, title: "2. Échangez", desc: "Cliquez sur deux cases du plateau P2 pour les échanger." },
        { icon: Eye, title: "3. Vérifiez", desc: 'Utilisez "Voir P1" pour comparer votre progression.' },
        { icon: Lock, title: "4. Verrouillez", desc: 'Bloguez les cases correctement placées avec "Ajuster".' },
        { icon: Clock, title: "5. Chronométrz", desc: "Complétez le puzzle avant la fin du temps imparti." },
    ],
    MODES: [
        { icon: Grid, title: "Mode Nombre", desc: "Replacez les chiffres dans l'ordre.", tooltip: "Entraînez votre mémoire numérique." },
        { icon: Palette, title: "Mode Couleur", desc: "Retrouvez la séquence de couleurs originale.", tooltip: "Parfait pour la mémoire visuelle." },
        { icon: ImageIcon, title: "Mode Image", desc: "Reconstituez l'image découpée en morceaux.", tooltip: "Un défi pour les amateurs de puzzle." },
        { icon: Type, title: "Mode Lettre", desc: "Réorganisez les paires de lettres alphabétiques.", tooltip: "Stimulez votre mémoire verbale." },
    ],
    DIFFICULTIES: [
        { level: "débutant", label: "2×2 • Débutant" },
        { level: "intermédiaire", label: "4×4 • Intermédiaire" },
        { level: "avancé", label: "6×6 • Avancé" },
        { level: "expert", label: "10×10 • Expert" },
    ],
    TIPS: [
        { icon: Clock, title: "Prenez votre temps", desc: "Mémorisez bien le plateau P1 avant de commencer.", color: "purple" as const },
        { icon: Zap, title: "Jouez régulièrement", desc: "La competition vous améliore vos performances.", color: "purple" as const },
    ],
};

export const BUTTON_CLASSES = {
    primary: [
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white",
        "transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600",
        "hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
    ].join(" "),
};
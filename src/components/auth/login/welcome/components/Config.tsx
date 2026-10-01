"use client";
import {
    Brain, Clock, Eye, Grid, Image as ImageIcon, Rocket,
    Layers, Lock, Palette, Shuffle, Sparkles, Target, Trophy, Type, Zap
} from 'lucide-react';

export const CONFIG = {
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
        { icon: Eye, title: "3. Vérifiez", desc: "Utilisez \"Voir P1\" pour comparer votre progression." },
        { icon: Lock, title: "4. Verrouillez", desc: "Bloguez les cases correctement placées avec \"Ajuster\"." },
        { icon: Clock, title: "5. Chronomètrez", desc: "Complétez le puzzle avant la fin du temps imparti." },
    ],
    MODES: [
        { icon: Grid, title: "Nombre", desc: "Replacez les chiffres dans l'ordre.", tooltip: "Entraînez votre mémoire numérique." },
        { icon: Palette, title: "Couleur", desc: "Retrouvez la séquence de couleurs originale.", tooltip: "Parfait pour la mémoire visuelle." },
        { icon: ImageIcon, title: "Image", desc: "Reconstituez l'image découpée en morceaux.", tooltip: "Un défi pour les amateurs de puzzle." },
        { icon: Type, title: "Lettre", desc: "Réorganisez les paires de lettres alphabétiques.", tooltip: "Stimulez votre mémoire verbale." },
    ],
    DIFFICULTIES: [
        { level: "débutant", label: "2×2 • Débutant" },
        { level: "intermédiaire", label: "4×4 • Intermédiaire" },
        { level: "avancé", label: "6×6 • Avancé" },
        { level: "expert", label: "10×10 • Expert" },
    ],
    TIPS: [
        { icon: Clock, title: "Prenez votre temps", desc: "Mémorisez bien le plateau P1 avant de commencer.", color: "purple" },
        { icon: Target, title: "Commencez facile", desc: "Essayez d'abord les niveaux 2×2 ou 3×3.", color: "indigo" },
        { icon: Zap, title: "Pratiquez régulièrement", desc: "L'entraînement améliore vos performances.", color: "purple" },
        { icon: Rocket, title: "Mode automatique", desc: "Pour un défi chronométré plus intense.", color: "indigo" },
    ]
}; 
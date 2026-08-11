export const BUTTON_STYLES = {
    primary: "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
    secondary: "inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105"
};

export const NAV_ITEMS = [
    { id: "but", label: "But du jeu" },
    { id: "regles", label: "Règles" },
    { id: "deroulement", label: "Déroulement" },
    { id: "lexique", label: "Lexique" },
    { id: "notation", label: "Notation" },
    { id: "enchainement", label: "Enchaînement" }
];

export const RULES_DATA = [
    { icon: "1,3,5", title: "Alternance des nombres", desc: "Pas de juxtaposition de deux pions de nombre.", tooltip: "Les nombres doivent être séparés par des opérateurs" },
    { icon: "+ − × ÷", title: "Alternance des opérateurs", desc: "Pas de juxtaposition de deux pions d'opérateur.", tooltip: "Les opérateurs doivent être séparés par des nombres" },
    { icon: "🚫", title: "Fermeture propre", desc: "Pas de mise d'un pion d'opérateur en bout de combinaison.", tooltip: "Une combinaison doit commencer et finir par un nombre" },
    { icon: "📍", title: "Emplacement unique", desc: "Pas de superposition de pions sur la même case.", tooltip: "Chaque case ne peut contenir qu'un seul pion" }
];

export const LEXICON_DATA = [
    { icon: "+ − × ÷", title: "Opérateurs", desc: "Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷)." },
    { icon: "🎯", title: "Plateau", desc: "Cases comportant des nombres et une case 'Départ'." },
    { icon: "🔢", title: "Pions de nombre", desc: "Pions marqués de nombres (6 pions par jeu)." },
    { icon: "➗", title: "Pions d'opérateur", desc: "Pions marqués d'opérateurs (4 pions par jeu)." },
    { icon: "📊", title: "Nombres du plateau", desc: "Nombres inscrits dans les cases du plateau." },
    { icon: "🧩", title: "Combinaison de pions", desc: "Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre." },
    { icon: "🎮", title: "Jeu", desc: "Combinaison de pions validée." },
    { icon: "🏆", title: "Match", desc: "Ensemble de jeux." }
];

export const BONUS_DATA = [
    { icon: "⭐", title: "Égalité parfaite", value: "+5", color: "green" },
    { icon: "7", title: "7 pions", value: "+1", color: "purple" },
    { icon: "8", title: "8 pions", value: "+2", color: "indigo" },
    { icon: "9", title: "9 pions", value: "+3", color: "pink" },
    { icon: "10", title: "10 pions", value: "+4", color: "orange" },
    { icon: "≥30", title: "Niveau 1", value: "+1", color: "purple" },
    { icon: "≥100", title: "Niveau 2", value: "+1", color: "indigo" },
    { icon: "≥200", title: "Niveau 3", value: "+1", color: "pink" },
    { icon: "≥300", title: "Niveau 4", value: "+1", color: "orange" },
    { icon: "×÷", title: "1ère × ou ÷", value: "+1", color: "green" }
];

export const SCORE_METRICS = [
    { icon: "🎯", title: "Note à un jeu", description: "Note de base + Bonus", gradient: "bg-gradient-to-br from-yellow-50 to-amber-100", titleColor: "text-amber-800", descColor: "text-amber-600" },
    { icon: "🏆", title: "Score d'un match", description: "Cumul des notes", gradient: "bg-gradient-to-br from-blue-50 to-cyan-100", titleColor: "text-blue-800", descColor: "text-blue-600" },
    { icon: "👑", title: "Score Compétition", description: "Cumul des matchs", gradient: "bg-gradient-to-br from-purple-50 to-indigo-100", titleColor: "text-purple-800", descColor: "text-purple-600" }
];
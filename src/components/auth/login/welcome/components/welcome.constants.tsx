import { Brain, Calculator, Star } from 'lucide-react';

type StatItem = {
  id: string;
  value: string;
  label: string;
  gradient: string;
  textColor: string;
  glow: string;
};

export const STATS: StatItem[] = [
  {
    id: 'pions_nombre',
    value: '6',
    label: 'pions de nombre',
    gradient: 'from-purple-500/15 via-fuchsia-500/10 to-indigo-500/15',
    textColor: 'text-purple-700 dark:text-purple-300',
    glow: 'shadow-purple-500/10',
  },
  {
    id: 'pions_operateur',
    value: '4',
    label: 'pions d\'opérateur',
    gradient: 'from-indigo-500/15 via-blue-500/10 to-cyan-500/15',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    glow: 'shadow-indigo-500/10',
  },
  {
    id: 'total_pions',
    value: '10',
    label: 'pions au total',
    gradient: 'from-fuchsia-500/15 via-violet-500/10 to-purple-500/15',
    textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
    glow: 'shadow-fuchsia-500/10',
  },
];

export const CARD_BASE_CLASS =
  'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

export const RULES = [
  {
    id: 'alternance_nombres',
    icon: <div className="text-sm font-bold">1,3,5</div>,
    title: 'Alternance des nombres',
    desc: 'Pas de juxtaposition de deux pions de nombre.',
    tooltip: 'Les nombres doivent être séparés par des opérateurs.',
  },
  {
    id: 'alternance_operateurs',
    icon: <div className="text-sm font-bold">+ − × ÷</div>,
    title: 'Alternance des opérateurs',
    desc: "Pas de juxtaposition de deux pions d'opérateur.",
    tooltip: 'Les opérateurs doivent être séparés par des nombres.',
  },
  {
    id: 'fermeture_propre',
    icon: <div className="text-sm">🚫</div>,
    title: 'Fermeture propre',
    desc: "Pas de mise d'un pion d'opérateur en bout de combinaison.",
    tooltip: 'Une combinaison doit commencer et finir par un nombre.',
  },
  {
    id: 'emplacement_unique',
    icon: <div className="text-sm">📍</div>,
    title: 'Emplacement unique',
    desc: 'Pas de superposition de pions sur la même case.',
    tooltip: 'Chaque case ne peut contenir qu\'un seul pion.',
  },
];

export const LEXIQUE = [
  {
    id: 'operateurs',
    icon: <div className="text-sm font-bold">+ − × ÷</div>,
    title: 'Opérateurs',
    desc: "Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷).",
  },
  {
    id: 'plateau',
    icon: <div className="text-sm">🎯</div>,
    title: 'Plateau',
    desc: 'Cases comportant des nombres et une case "Départ".',
  },
  {
    id: 'pions_nombre',
    icon: <div className="text-sm">🔢</div>,
    title: 'Pions de nombre',
    desc: 'Pions marqués de nombres (6 pions par jeu).',
  },
  {
    id: 'pions_operateur',
    icon: <div className="text-sm">➗</div>,
    title: "Pions d'opérateur",
    desc: "Pions marqués d'opérateurs (6 pions par jeu).",
  },
  {
    id: 'nombres_plateau',
    icon: <div className="text-sm">📊</div>,
    title: 'Nombres du plateau',
    desc: 'Nombres inscrits dans les cases du plateau.',
  },
  {
    id: 'combinaison',
    icon: <div className="text-sm">🧩</div>,
    title: 'Combinaison de pions',
    desc: "Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre.",
  },
  {
    id: 'jeu',
    icon: <div className="text-sm">🎮</div>,
    title: 'Jeu',
    desc: 'Combinaison de pions validée.',
  },
  {
    id: 'match',
    icon: <div className="text-sm">🏆</div>,
    title: 'Match',
    desc: 'Ensemble de jeux.',
  },
];

export const BONUS = [
  { id: 'egalite', icon: <Star className="w-3.5 h-3.5" />, title: 'Égalité parfaite', value: '+5', color: 'green' },
  { id: '7pions', icon: <span className="text-sm font-bold">7</span>, title: '7 pions', value: '+1', color: 'purple' },
  { id: '8pions', icon: <span className="text-sm font-bold">8</span>, title: '8 pions', value: '+2', color: 'indigo' },
  { id: '9pions', icon: <span className="text-sm font-bold">9</span>, title: '9 pions', value: '+3', color: 'pink' },
  { id: '10pions', icon: <span className="text-sm font-bold">10</span>, title: '10 pions', value: '+4', color: 'orange' },
  { id: 'niveau1', icon: <span className="text-sm font-bold">≥30</span>, title: 'Niveau 1', value: '+1', color: 'purple' },
  { id: 'niveau2', icon: <span className="text-sm font-bold">≥100</span>, title: 'Niveau 2', value: '+1', color: 'indigo' },
  { id: 'niveau3', icon: <span className="text-sm font-bold">≥200</span>, title: 'Niveau 3', value: '+1', color: 'pink' },
  { id: 'niveau4', icon: <span className="text-sm font-bold">≥300</span>, title: 'Niveau 4', value: '+1', color: 'orange' },
  { id: 'premiere_x_ou_div', icon: <span className="text-sm font-bold">×÷</span>, title: '1ère × ou ÷', value: '+1', color: 'green' },
];

export const SCORE_METRICS = [
  { icon: '🎯', title: 'Note à un jeu', description: 'Note de base + Bonus' },
  { icon: '🏆', title: "Score d'un match", description: 'Cumul des notes' },
  { icon: '👑', title: 'Score Compétition', description: 'Cumul des matchs' },
];

export const FLOW_STEPS = [
  {
    icon: <Calculator className="h-3.5 w-3.5" />,
    title: 'Validation',
    description:
      'Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.',
    bgBlur: 'bg-green-500/10 dark:bg-green-400/10',
    badgeBg: 'bg-green-50 dark:bg-green-500/10',
    badgeText: 'text-green-700 dark:text-green-300',
  },
  {
    icon: <Brain className="h-3.5 w-3.5" />,
    title: 'Calcul',
    description:
      "Le calcul s'effectue opération par opération de l'autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.",
    bgBlur: 'bg-blue-500/10 dark:bg-blue-400/10',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/10',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
];
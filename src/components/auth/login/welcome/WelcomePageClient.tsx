'use client';
import React, { memo, useCallback, useState } from 'react';
import { 
  Brain, Grid, Info, Sparkles, TrophyIcon, Zap, 
  Target, Gamepad2, Calculator, BookOpen, Award, 
  Star, Crown, AlertCircle, MousePointerClick, BarChart
} from 'lucide-react';

type PillItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tooltip?: string;
};

type StatItem = {
  id: string;
  value: string;
  label: string;
  gradient: string;
  textColor: string;
  glow: string;
};

type BonusItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

// Règles élémentaires du jeu
const RULES: PillItem[] = [
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
    desc: 'Pas de juxtaposition de deux pions d\'opérateur.',
    tooltip: 'Les opérateurs doivent être séparés par des nombres.',
  },
  {
    id: 'fermeture_propre',
    icon: <div className="text-sm">🚫</div>,
    title: 'Fermeture propre',
    desc: 'Pas de mise d\'un pion d\'opérateur en bout de combinaison.',
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

// Éléments du lexique
const LEXIQUE: PillItem[] = [
  {
    id: 'operateurs',
    icon: <div className="text-sm font-bold">+ − × ÷</div>,
    title: 'Opérateurs',
    desc: 'Signes d\'Addition (+), Soustraction (−), Multiplication (×) et Division (÷).',
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
    title: 'Pions d\'opérateur',
    desc: 'Pions marqués d\'opérateurs (4 pions par jeu).',
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
    desc: 'Agencement (en ligne ou colonne) de pion(s) de nombre et d\'opérateur. Débute et finit par un pion de nombre.',
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

// Statistiques
const STATS: StatItem[] = [
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

// Grille des Bonus
const BONUS: BonusItem[] = [
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

const sectionTitleClass =
  'text-center text-xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white';

const sectionTextClass =
  'mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500 sm:text-[14px] dark:text-slate-300/80';

const cardBaseClass =
  'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const SectionHeader = memo(function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      {badge ? (
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
        </div>
      ) : null}

      <h4 className={sectionTitleClass}>{title}</h4>

      {subtitle ? <p className={sectionTextClass}>{subtitle}</p> : null}
    </div>
  );
});

const Pill = memo(function Pill({
  icon,
  title,
  desc,
  tooltip,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tooltip?: string;
  delay?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const closeTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <div
      className={`${cardBaseClass} group p-4 sm:p-5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-indigo-500/[0.05] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.06]" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 transition-transform duration-300 group-active:scale-95 group-hover:scale-105 dark:from-purple-500/20 dark:to-indigo-500/20 dark:text-purple-300">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold leading-tight text-slate-900 sm:text-sm dark:text-white">
                {title}
              </div>
            </div>

            {tooltip ? (
              <button
                type="button"
                onClick={toggleTooltip}
                aria-label={`Informations sur ${title}`}
                aria-expanded={showTooltip}
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition active:scale-95 dark:bg-white/10 dark:text-purple-300"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 sm:text-[14px] dark:text-slate-300/85">
            {desc}
          </p>

          {tooltip ? (
            <div
              className={`grid transition-all duration-200 ${showTooltip
                ? 'mt-3 grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
                }`}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl border border-purple-200/70 bg-purple-50/90 px-3 py-2 text-xs leading-relaxed text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-200">
                  {tooltip}
                  <button
                    type="button"
                    onClick={closeTooltip}
                    className="ml-2 font-bold underline underline-offset-2"
                  >
                    fermer
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

const HowToPlayCard = memo(function HowToPlayCard() {
  return (
    <div className={`${cardBaseClass} p-5 sm:p-6`}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-400/10" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
          <MousePointerClick className="h-3.5 w-3.5" />
          Mode Clic
        </div>

        <p className="text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-200">
          Sélectionnez un chiffre, puis cliquez sur une case vide pour le placer.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-purple-500">
              Étape 1
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Choisir un chiffre
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-500">
              Étape 2
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Placer sur le plateau
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-500">
              Étape 3
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Valider la combinaison
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = memo(function StatCard({ item }: { item: StatItem }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br ${item.gradient} p-5 shadow-xl ${item.glow} backdrop-blur-sm dark:border-white/10`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/20 blur-2xl dark:bg-white/10" />
      <div className="relative text-center">
        <div className={`text-3xl font-black sm:text-4xl ${item.textColor}`}>
          {item.value}
        </div>
        <div className="mt-2 text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">
          {item.label}
        </div>
      </div>
    </div>
  );
});

const BonusCard = memo(function BonusCard({ item }: { item: BonusItem }) {
  const colorClasses = {
    purple: "from-purple-50 to-purple-100 text-purple-700 dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-300",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700 dark:from-indigo-500/20 dark:to-indigo-500/10 dark:text-indigo-300",
    pink: "from-pink-50 to-pink-100 text-pink-700 dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-300",
    green: "from-green-50 to-green-100 text-green-700 dark:from-green-500/20 dark:to-green-500/10 dark:text-green-300",
    orange: "from-orange-50 to-orange-100 text-orange-700 dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-300",
    yellow: "from-yellow-50 to-amber-100 text-amber-700 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-300",
  };
  
  const bgClass = colorClasses[item.color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className={`text-center p-3 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        {item.icon}
        <div className="font-semibold text-xs">{item.title}</div>
      </div>
      <div className="text-xl font-black">{item.value}</div>
    </div>
  );
});

export default function WelcomePageClient() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-4 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
        <div className="absolute right-0 top-28 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute bottom-20 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8">
        
        {/* But du Jeu */}
        <section id="but">
          <SectionHeader
            badge="But du jeu"
            title="🎯 Objectif"
          />
          <div className={`${cardBaseClass} p-5 sm:p-6 text-center`}>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px] dark:text-slate-200">
              Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le <span className="font-bold text-purple-600 dark:text-purple-400">plus approchant</span> ou <span className="font-bold text-purple-600 dark:text-purple-400">strictement égal</span> au nombre du plateau visé.
            </p>
          </div>
        </section>

        {/* Règles élémentaires */}
        <section id="regles">
          <SectionHeader
            badge="Règles élémentaires"
            title="🎮 Comment jouer ?"
            subtitle="Placez votre première combinaison depuis la case 'Départ' en respectant ces 4 règles"
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {RULES.map((item, index) => (
              <Pill
                key={item.id}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                tooltip={item.tooltip}
                delay={index * 60}
              />
            ))}
          </div>
        </section>

        {/* Déroulement du jeu */}
        <section id="deroulement">
          <SectionHeader
            badge="Déroulement"
            title="⚡ Validation & Calcul"
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className={`${cardBaseClass} p-5 sm:p-6`}>
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-green-500/10 blur-3xl dark:bg-green-400/10" />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-green-700 dark:bg-green-500/10 dark:text-green-300">
                  <Calculator className="h-3.5 w-3.5" />
                  Validation
                </div>
                <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px] dark:text-slate-200">
                  Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.
                </p>
              </div>
            </div>

            <div className={`${cardBaseClass} p-5 sm:p-6`}>
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <Brain className="h-3.5 w-3.5" />
                  Calcul
                </div>
                <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px] dark:text-slate-200">
                  Le calcul s&apos;effectue opération par opération de l&apos;autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lexique */}
        <section id="lexique">
          <SectionHeader
            badge="Lexique"
            title="📚 Le vocabulaire essentiel"
            subtitle="Pour bien comprendre le plateau et vos pièces"
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {LEXIQUE.map((item, index) => (
              <Pill
                key={item.id}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                tooltip={item.tooltip}
                delay={index * 40}
              />
            ))}
          </div>
        </section>

        {/* Système de notation */}
        <section id="notation">
          <SectionHeader
            badge="Système de notation"
            title="📊 Note & Bonus"
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Note de base */}
            <div className={`${cardBaseClass} p-5 sm:p-6`}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-purple-500">a)</span> Note de base
              </h4>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                La note de base correspond à l&apos;écart négatif entre votre résultat calculé et le nombre à atteindre.
              </p>
              <div className="mt-3 rounded-xl bg-purple-50/80 px-3 py-2 text-xs text-purple-700 dark:bg-purple-500/10 dark:text-purple-200 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>La note de base est toujours négative ou égale à 0 (en cas d&apos;égalité parfaite).</span>
              </div>
            </div>

            {/* Grille des Bonus */}
            <div className={`${cardBaseClass} p-5 sm:p-6`}>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-purple-500">b)</span> Grille des Bonus
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {BONUS.map((item) => (
                  <BonusCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            <div className={`${cardBaseClass} p-4 text-center`}>
              <div className="text-3xl mb-1">🎯</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Note à un jeu</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Note de base + Bonus</div>
            </div>
            <div className={`${cardBaseClass} p-4 text-center`}>
              <div className="text-3xl mb-1">🏆</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Score d&apos;un match</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cumul des notes</div>
            </div>
            <div className={`${cardBaseClass} p-4 text-center`}>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">Score Compétition</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cumul des matchs</div>
            </div>
          </div>
        </section>

        {/* Règle d'enchaînement */}
        <section id="enchainement">
          <div className={`relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-5 dark:border-orange-400/30 dark:from-orange-500/10 dark:to-amber-500/10`}>
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-400/10" />
            <div className="relative flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5 dark:text-orange-400" />
              <div>
                <h4 className="font-bold text-orange-800 dark:text-orange-300">⚠️ Règle importante d&apos;enchaînement</h4>
                <p className="text-sm text-orange-700 dark:text-orange-200/80 mt-1">
                  Après le premier jeu, <span className="font-bold">tous les coups suivants doivent impérativement comporter</span> au moins un pion déjà placé lors d&apos;un jeu antérieur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section id="stats">
          <SectionHeader
            badge="Le jeu en chiffres"
            title="📊 Les chiffres clés"
          />

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            {STATS.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Mode de jeu */}
        <section id="jeu">
          <SectionHeader
            badge="Comment jouer"
            title="🎯 Mode Clic"
          />

          <HowToPlayCard />
        </section>

      </div>
    </div>
  );
}
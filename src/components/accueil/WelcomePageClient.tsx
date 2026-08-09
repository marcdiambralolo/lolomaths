"use client";
import Loader from '@/app/loading';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Calculator,
  ChevronRight, Gamepad2,
  Info,
  Rocket,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CacheLink from '../commons/CacheLink';

const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

function Pill({ icon, title, desc, tooltip, delay = 0 }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string; delay?: number }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="group relative flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="text-[12px] font-bold text-purple-900">{title}</div>
          {tooltip && (
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-purple-400 hover:text-purple-600 transition"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="mt-1 text-[13px] leading-relaxed text-purple-700">{desc}</div>
      </div>

      {tooltip && showTooltip && (
        <div className="absolute left-0 top-full mt-2 z-10 w-48 rounded-lg bg-purple-900 px-3 py-2 text-xs text-white shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function BonusCard({ icon, title, value, color = "purple" }: { icon: React.ReactNode; title: string; value: string; color?: string }) {
  const colorClasses = {
    purple: "from-purple-50 to-purple-100 text-purple-700",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
    pink: "from-pink-50 to-pink-100 text-pink-700",
    green: "from-green-50 to-green-100 text-green-700",
    orange: "from-orange-50 to-orange-100 text-orange-700",
  };

  const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className={`text-center p-4 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}

export default function WelcomePageClient() {
  return (
    <Suspense fallback={<Loader />}>
      <WelcomePageClientContent />
    </Suspense>
  );
}

export function WelcomePageClientContent() {
  useScrollReveal();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user && user.secretCode) {
      setIsRedirecting(true);
      router.replace('/star/profil');
    }
  }, [user, router, setIsRedirecting]);

  if (isRedirecting) { return (<Loader />); }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">

        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            LOLOMATHS
          </h1>
          <p className="mt-4 text-xl text-purple-600 font-semibold">Le jeu de calcul stratégique</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CacheLink href="/star/profil" className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all">
              <span className="relative z-10 flex items-center gap-2">
                🎯 Jouer maintenant !
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </CacheLink>
          </div>
        </section>

        {/* But du Jeu */}
        <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              🎯 But du Jeu
            </h2>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 text-center border border-purple-100">
            <p className="text-lg text-purple-800 font-medium max-w-3xl mx-auto">
              Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le <span className="font-bold text-purple-600">plus approchant</span> ou <span className="font-bold text-purple-600">strictement égal</span> au nombre du plateau visé.
            </p>
          </div>
        </section>

        {/* Comment jouer ? */}
        <section id="regles" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
              <Gamepad2 className="w-8 h-8 text-indigo-600" />
              🎮 Comment jouer ?
            </h2>
            <p className="text-gray-500 mt-2">Placez votre première combinaison depuis la case &apos;Départ&apos; en respectant ces 4 règles élémentaires</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Pill
              icon={<div className="text-xl font-bold">1,3,5</div>}
              title="Alternance des nombres"
              desc="Pas de juxtaposition de deux pions de nombre."
              tooltip="Les nombres doivent être séparés par des opérateurs"
              delay={0}
            />
            <Pill
              icon={<div className="text-xl font-bold">+ − × ÷</div>}
              title="Alternance des opérateurs"
              desc="Pas de juxtaposition de deux pions d'opérateur."
              tooltip="Les opérateurs doivent être séparés par des nombres"
              delay={50}
            />
            <Pill
              icon={<div className="text-xl">🚫</div>}
              title="Fermeture propre"
              desc="Pas de mise d'un pion d'opérateur en bout de combinaison."
              tooltip="Une combinaison doit commencer et finir par un nombre"
              delay={100}
            />
            <Pill
              icon={<div className="text-xl">📍</div>}
              title="Emplacement unique"
              desc="Pas de superposition de pions sur la même case."
              tooltip="Chaque case ne peut contenir qu'un seul pion"
              delay={150}
            />
          </div>
        </section>

        {/* Déroulement du jeu */}
        <section id="jeu" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-orange-500" />
              ⚡ Déroulement du jeu
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4 shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Validation</h3>
                <p className="text-green-600">Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">Calcul</h3>
                <p className="text-blue-600">Le calcul s&apos;effectue opération par opération de l&apos;autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lexique */}
        <section id="lexique" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
              📚 Lexique du jeu
            </h2>
            <p className="text-gray-500 mt-2">Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pill
              icon={<div className="text-xl font-bold">+ − × ÷</div>}
              title="Opérateurs"
              desc="Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷)."
              delay={0}
            />
            <Pill
              icon={<div className="text-xl">🎯</div>}
              title="Plateau"
              desc="Cases comportant des nombres et une case 'Départ'."
              delay={50}
            />
            <Pill
              icon={<div className="text-xl">🔢</div>}
              title="Pions de nombre"
              desc="Pions marqués de nombres (6 pions par jeu)."
              delay={100}
            />
            <Pill
              icon={<div className="text-xl">➗</div>}
              title="Pions d'opérateur"
              desc="Pions marqués d'opérateurs (4 pions par jeu)."
              delay={150}
            />
            <Pill
              icon={<div className="text-xl">📊</div>}
              title="Nombres du plateau"
              desc="Nombres inscrits dans les cases du plateau."
              delay={200}
            />
            <Pill
              icon={<div className="text-xl">🧩</div>}
              title="Combinaison de pions"
              desc="Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre."
              delay={250}
            />
          </div>
        </section>

        {/* Système de notation & Bonus */}
        <section id="stats" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              📊 Système de notation & Bonus
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Note de base */}
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                <span className="text-xl">a)</span> Note de base
              </h3>
              <p className="text-purple-700">
                La note de base correspond à l&apos;écart négatif entre votre résultat calculé et le nombre à atteindre.
              </p>
              <div className="mt-3 bg-purple-50 rounded-xl p-3 text-sm text-purple-600 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>La note de base est donc toujours négative ou égale à 0 (en cas d&apos;égalité parfaite).</span>
              </div>
            </div>

            {/* Grille des Bonus */}
            <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                <span className="text-xl">b)</span> Grille des Bonus
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <BonusCard icon={<Star className="w-4 h-4" />} title="Égalité parfaite" value="+5" color="green" />
                <BonusCard icon={<span>7</span>} title="7 pions utilisés" value="+1" color="purple" />
                <BonusCard icon={<span>8</span>} title="8 pions utilisés" value="+2" color="indigo" />
                <BonusCard icon={<span>9</span>} title="9 pions utilisés" value="+3" color="pink" />
                <BonusCard icon={<span>10</span>} title="10 pions utilisés" value="+4" color="orange" />
                <BonusCard icon={<span>≥30</span>} title="Niveau 1 (≥30)" value="+1" color="purple" />
                <BonusCard icon={<span>≥100</span>} title="Niveau 2 (≥100)" value="+1" color="indigo" />
                <BonusCard icon={<span>≥200</span>} title="Niveau 3 (≥200)" value="+1" color="pink" />
                <BonusCard icon={<span>≥300</span>} title="Niveau 4 (≥300)" value="+1" color="orange" />
                <BonusCard icon={<span>×÷</span>} title="1ère × ou ÷" value="+1" color="green" />
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold text-amber-800">Note à un jeu</div>
              <div className="text-sm text-amber-600 mt-1">Note de base + Bonus</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-blue-800">Score d&apos;un match</div>
              <div className="text-sm text-blue-600 mt-1">Cumul des notes</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 hover:scale-105 transition-transform">
              <div className="text-3xl mb-2">👑</div>
              <div className="font-bold text-purple-800">Score Compétition</div>
              <div className="text-sm text-purple-600 mt-1">Cumul des matchs</div>
            </div>
          </div>
        </section>

        {/* Règle importante d'enchaînement */}
        <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-600">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-8 border-2 border-orange-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl" />
            <div className="relative flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-orange-800">⚠️ Règle importante d&apos;enchaînement</h3>
                <p className="text-orange-700 mt-2">
                  Après le premier jeu, <span className="font-bold">tous les coups suivants doivent impérativement comporter</span> au moins un pion déjà placé lors d&apos;un jeu antérieur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-700">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-10 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 mb-4">
                <Rocket className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase">Prêt à relever le défi ?</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-6">Commencez votre première partie !</h2>
              <CacheLink href="/star/profil" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Jouer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </CacheLink>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">© 2026 Lolomaths - Tous droits réservés.</p>
        </div>
      </div>
    </main>
  );
}
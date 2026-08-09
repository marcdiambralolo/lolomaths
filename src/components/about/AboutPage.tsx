"use client";
import { cx } from "@/lib/functions";
import {
  ArrowLeft, Brain, ChevronRight, Grid, Info, Trophy as TrophyIcon,
  Target, Gamepad2, Zap, Calculator, BookOpen, Award, Star,
  Crown, AlertCircle, MousePointerClick, BarChart
} from "lucide-react";
import { useEffect, useState } from "react";
import CacheLink from "../commons/CacheLink";

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

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 " +
  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg active:scale-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2";

function ConicPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[28px] p-[1px] bg-gradient-to-br from-purple-100 via-white to-indigo-50 shadow-sm", className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-purple-100 bg-white p-5 sm:p-7 shadow-lg">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 1px 1px, #e9d5ff 1px, transparent 0)", backgroundSize: "14px 14px" }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

function Pill({ icon, title, desc, tooltip }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="group relative flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
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
    yellow: "from-yellow-50 to-amber-100 text-amber-700",
  };

  const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className={`text-center p-3 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        {icon}
        <div className="font-semibold text-xs">{title}</div>
      </div>
      <div className="text-xl font-black">{value}</div>
    </div>
  );
}

export default function AboutPageClient() {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 text-purple-900 overflow-x-hidden">
      <nav className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <CacheLink href="/star/profil" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition">
            <ArrowLeft className="h-4 w-4" />Retour au jeu
          </CacheLink>
          <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold">
            {["but", "regles", "deroulement", "lexique", "notation", "enchainement"].map((item) => (
              <a key={item} className="text-purple-500 hover:text-purple-800 transition capitalize" href={`#${item}`}>
                {item === "regles" ? "Règles" :
                  item === "deroulement" ? "Déroulement" :
                    item === "lexique" ? "Lexique" :
                      item === "notation" ? "Notation" :
                        item === "enchainement" ? "Enchaînement" :
                          item === "but" ? "But du jeu" : item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:py-8">

        {/* Header */}
        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h3 className="text-balance text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-6xl">
            LOLOMATHS
          </h3>
          <p className="mt-2 text-sm text-purple-600 font-semibold sm:text-base">Le jeu de calcul stratégique</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CacheLink href="/star/profil" className={btnPrimary}>
              🎯 Jouer maintenant ! <ChevronRight className="h-4 w-4" />
            </CacheLink>
          </div>
        </section>

        {/* But du Jeu */}
        <section id="but" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
          <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              🎯 But du Jeu
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-700">
              Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le <span className="font-bold text-purple-600">plus approchant</span> ou <span className="font-bold text-purple-600">strictement égal</span> au nombre du plateau visé.
            </p>
          </ConicPanel>
        </section>

        {/* Règles élémentaires */}
        <section id="regles" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-purple-900">🎮 Comment jouer ?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-purple-600">
              Placez votre première combinaison depuis la case &apos;Départ&apos; en respectant ces 4 règles élémentaires
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Pill
              icon={<div className="text-sm font-bold">1,3,5</div>}
              title="Alternance des nombres"
              desc="Pas de juxtaposition de deux pions de nombre."
              tooltip="Les nombres doivent être séparés par des opérateurs"
            />
            <Pill
              icon={<div className="text-sm font-bold">+ − × ÷</div>}
              title="Alternance des opérateurs"
              desc="Pas de juxtaposition de deux pions d'opérateur."
              tooltip="Les opérateurs doivent être séparés par des nombres"
            />
            <Pill
              icon={<div className="text-sm">🚫</div>}
              title="Fermeture propre"
              desc="Pas de mise d'un pion d'opérateur en bout de combinaison."
              tooltip="Une combinaison doit commencer et finir par un nombre"
            />
            <Pill
              icon={<div className="text-sm">📍</div>}
              title="Emplacement unique"
              desc="Pas de superposition de pions sur la même case."
              tooltip="Chaque case ne peut contenir qu'un seul pion"
            />
          </div>
        </section>

        {/* Déroulement du jeu */}
        <section id="deroulement" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
          <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-500" />
              ⚡ Déroulement du jeu
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-green-800">Validation</h3>
                </div>
                <p className="text-sm text-green-700">Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800">Calcul</h3>
                </div>
                <p className="text-sm text-blue-700">Le calcul s&apos;effectue opération par opération de l&apos;autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.</p>
              </div>
            </div>
          </ConicPanel>
        </section>

        <section id="lexique" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-purple-900 flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              📚 Lexique du jeu
            </h2>
            <p className="mx-auto mt-1 max-w-2xl text-sm text-purple-600">
              Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Pill
              icon={<div className="text-sm font-bold">+ − × ÷</div>}
              title="Opérateurs"
              desc="Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷)."
            />
            <Pill
              icon={<div className="text-sm">🎯</div>}
              title="Plateau"
              desc="Cases comportant des nombres et une case 'Départ'."
            />
            <Pill
              icon={<div className="text-sm">🔢</div>}
              title="Pions de nombre"
              desc="Pions marqués de nombres (6 pions par jeu)."
            />
            <Pill
              icon={<div className="text-sm">➗</div>}
              title="Pions d'opérateur"
              desc="Pions marqués d'opérateurs (4 pions par jeu)."
            />
            <Pill
              icon={<div className="text-sm">📊</div>}
              title="Nombres du plateau"
              desc="Nombres inscrits dans les cases du plateau."
            />
            <Pill
              icon={<div className="text-sm">🧩</div>}
              title="Combinaison de pions"
              desc="Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre."
            />
            <Pill
              icon={<div className="text-sm">🎮</div>}
              title="Jeu"
              desc="Combinaison de pions validée."
            />
            <Pill
              icon={<div className="text-sm">🏆</div>}
              title="Match"
              desc="Ensemble de jeux."
            />
          </div>
        </section>

        <section id="notation" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
          <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              📊 Système de notation & Bonus
            </h2>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="bg-purple-50/50 rounded-xl p-4">
                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-1">
                  <span className="text-sm">a)</span> Note de base
                </h3>
                <p className="text-sm text-purple-700">
                  La note de base correspond à l&apos;écart négatif entre votre résultat calculé et le nombre à atteindre.
                </p>
                <div className="mt-2 bg-white/60 rounded-lg p-2 text-xs text-purple-600 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>La note de base est donc toujours négative ou égale à 0 (en cas d&apos;égalité parfaite).</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-1">
                  <span className="text-sm">b)</span> Grille des Bonus
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  <BonusCard icon={<Star className="w-3.5 h-3.5" />} title="Égalité parfaite" value="+5" color="green" />
                  <BonusCard icon={<span className="text-sm font-bold">7</span>} title="7 pions" value="+1" color="purple" />
                  <BonusCard icon={<span className="text-sm font-bold">8</span>} title="8 pions" value="+2" color="indigo" />
                  <BonusCard icon={<span className="text-sm font-bold">9</span>} title="9 pions" value="+3" color="pink" />
                  <BonusCard icon={<span className="text-sm font-bold">10</span>} title="10 pions" value="+4" color="orange" />
                  <BonusCard icon={<span className="text-sm font-bold">≥30</span>} title="Niveau 1" value="+1" color="purple" />
                  <BonusCard icon={<span className="text-sm font-bold">≥100</span>} title="Niveau 2" value="+1" color="indigo" />
                  <BonusCard icon={<span className="text-sm font-bold">≥200</span>} title="Niveau 3" value="+1" color="pink" />
                  <BonusCard icon={<span className="text-sm font-bold">≥300</span>} title="Niveau 4" value="+1" color="orange" />
                  <BonusCard icon={<span className="text-sm font-bold">×÷</span>} title="1ère × ou ÷" value="+1" color="green" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-bold text-amber-800 text-sm">Note à un jeu</div>
                <div className="text-xs text-amber-600 mt-0.5">Note de base + Bonus</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-bold text-blue-800 text-sm">Score d&apos;un match</div>
                <div className="text-xs text-blue-600 mt-0.5">Cumul des notes</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-100">
                <div className="text-2xl mb-1">👑</div>
                <div className="font-bold text-purple-800 text-sm">Score Compétition</div>
                <div className="text-xs text-purple-600 mt-0.5">Cumul des matchs</div>
              </div>
            </div>
          </ConicPanel>
        </section>

        <section id="enchainement" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-600">
          <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-5 border-2 border-orange-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-orange-800">⚠️ Règle importante d&apos;enchaînement</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Après le premier jeu, <span className="font-bold">tous les coups suivants doivent impérativement comporter</span> au moins un pion déjà placé lors d&apos;un jeu antérieur.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-700">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 mb-3">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Prêt à relever le défi ?</span>
            </div>
            <h2 className="text-2xl font-black">Commencez votre première partie !</h2>
            <CacheLink href="/star/profil" className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105">
              Jouer maintenant <ChevronRight className="h-4 w-4" />
            </CacheLink>
          </div>
        </section>
      </div>
    </main>
  );
}
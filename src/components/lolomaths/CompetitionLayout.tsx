import { useChrono } from '@/hooks/lolomaths/useChrono';
import React, { useState } from 'react';
import { OplaGrid } from './game/OplaGrid';
 

interface CompetitionLayoutProps {
  matchNumber?: number;
  totalMatches?: number;
  scoreText?: string;
  onRetry?: () => void;
  onFinishMatch?: () => void;
}

export const CompetitionLayout: React.FC<CompetitionLayoutProps> = ({
  matchNumber = 1,
  totalMatches = 5,
  scoreText = 'Score : 0 pts',
  onRetry,
  onFinishMatch,
}) => {
  // Gestion du Splash & Vues
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showResultZone, setShowResultZone] = useState<boolean>(false);
  const [infoSwitch, setInfoSwitch] = useState<boolean>(true);

  // Hook Chrono personnalisé pour la partie
  const chrono = useChrono({
    initialSeconds: 300,
    autoStart: false,
    onTimeUp: () => {
      setShowResultZone(true);
      if (onFinishMatch) onFinishMatch();
    },
  });

  const handleStartGame = () => {
    setShowSplash(false);
    chrono.start();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* AppBar / Toolbar Top */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-extrabold text-lg tracking-wide uppercase">
            Lolomaths Competition
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
          Match #{matchNumber}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4 overflow-y-auto">
        
        {/* 1. Zone Splash (id: spla / impla) */}
        {showSplash ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center gap-6 my-auto shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-3xl flex items-center justify-center text-4xl font-black text-slate-950 shadow-lg animate-bounce">
              ∑
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100">Prêt pour le Tournoi ?</h2>
              <p className="text-sm text-slate-400 mt-1">
                Résolvez les opérations mathématiques avant la fin du temps imparti.
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="w-full max-w-xs py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              Lancer la partie
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* 2. Zone de Jeu (id: zpla) */}
            {!showResultZone ? (
              <div className="flex flex-col gap-4">
                
                {/* Plateau de Jeu Principal (id: opla) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[260px] flex items-center justify-center relative shadow-inner">
                  <div className="text-center text-slate-500 font-mono text-sm">
                    [ Zone de Plateau - Grille des opérations ]
                  </div>
                </div>

                <div className="w-full flex justify-center">
  <OplaGrid />
</div>

                {/* Barre de Statut : Opérateurs, Progression, Chrono, Bouton Refaire */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                  {/* id: echop */}
                  <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    {['+', '-', '×', '÷'].map((op) => (
                      <span
                        key={op}
                        className="w-8 h-8 flex items-center justify-center bg-slate-800 text-amber-400 font-bold rounded cursor-pointer hover:bg-slate-700 transition"
                      >
                        {op}
                      </span>
                    ))}
                  </div>

                  {/* id: metaj */}
                  <div className="font-mono text-sm font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                    Progression : 0 / {totalMatches}
                  </div>

                  {/* id: chrono (Composant Chrono personnalisé) */}
                  <div className="font-mono font-black text-xl text-amber-400">
                    {chrono.formattedTime}
                  </div>

                  {/* id: btnr */}
                  <button
                    onClick={onRetry}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
                  >
                    Refaire
                  </button>
                </div>

                {/* Info Score & Numéro de Match (id: scoma, mcour) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <span className="text-xs text-slate-500 block uppercase font-medium">Score actuel</span>
                    <span className="text-lg font-black text-rose-400">{scoreText}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <span className="text-xs text-slate-500 block uppercase font-medium">Match en cours</span>
                    <span className="text-lg font-black text-sky-400">N° {matchNumber}</span>
                  </div>
                </div>

                {/* Réserve Chiffres & Switch d'Infos (id: echno, sandwitch) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  {/* id: echno */}
                  <div className="flex gap-2">
                    {[1, 3, 5, 7, 9].map((num) => (
                      <span
                        key={num}
                        className="w-9 h-9 flex items-center justify-center bg-slate-800 text-slate-200 font-bold font-mono rounded-lg border border-slate-700 shadow-sm"
                      >
                        {num}
                      </span>
                    ))}
                  </div>

                  {/* id: sandwitch */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
                    <span>Aide visuelle</span>
                    <input
                      type="checkbox"
                      checked={infoSwitch}
                      onChange={(e) => setInfoSwitch(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </label>
                </div>

              </div>
            ) : (
              /* 3. Zone Résultats (id: zoneresulat) */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 text-center animate-fade-in shadow-2xl">
                <h3 className="text-xl font-bold text-amber-400">Fin de la Partie !</h3>
                
                {/* id: inft */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm">
                  Résumé des performances et statistiques de précision.
                </div>

                {/* id: macour */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-amber-400 font-mono font-bold">
                  Score final : 120 pts
                </div>

                {/* id: pub */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400">
                  [ Bannière d'information / Message Lolomaths ]
                </div>

                <button
                  onClick={() => {
                    setShowResultZone(false);
                    chrono.reset(300);
                  }}
                  className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all"
                >
                  Recommencer le Match
                </button>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};
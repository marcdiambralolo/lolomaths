import { GameResult } from '@/lib/interfaces';
import React, { useState } from 'react';
 
interface AideViewProps {
  /** Ferme la vue aide/historique */
  onClose?: () => void;
  /** Historique des coups ou des parties jouées */
  historyList?: GameResult[];
  /** URL ou contenu HTML personnalisé d'aide */
  helpHtmlContent?: string;
}

export const AideView: React.FC<AideViewProps> = ({
  onClose,
  historyList = [],
  helpHtmlContent,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Toolbar Android Equivalent */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
            title="Retour"
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-amber-400">Aide & Historique</h1>
        </div>

        {/* Commutateur d'onglets (Règles vs Historique) */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Règles du jeu
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Historique ({historyList.length})
          </button>
        </div>
      </header>

      {/* 2. Contenu principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 overflow-y-auto">
        {/* Vue 1: WebView (Règles et Aide) */}
        {activeTab === 'rules' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl prose prose-invert max-w-none">
            {helpHtmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: helpHtmlContent }} />
            ) : (
              <div className="space-y-4 text-slate-300">
                <h2 className="text-xl font-bold text-amber-400">
                  Comment jouer au Tournoi de Calcul ?
                </h2>
                <p>
                  Le but est d'aligner des pions chiffres et opérandes sur le plateau de 17x13
                  cases afin d'atteindre le nombre cible situé en bout de ligne ou de colonne.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Placez des chiffres et des opérateurs (<code className="text-amber-400">+</code>,{' '}
                    <code className="text-amber-400">-</code>, <code className="text-amber-400">*</code>,{' '}
                    <code className="text-amber-400">/</code>).
                  </li>
                  <li>
                    Atteignez exactement la cible pour marquer le maximum de points (5 pts de base).
                  </li>
                  <li>
                    Obtenez des bonus en utilisant les multiplications, divisions et des combinaisons longues.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Vue 2: ScrollView + LinearLayout (#histo) */}
        {activeTab === 'history' && (
          <div className="space-y-3 mb-6">
            {historyList.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                Aucune partie ou coup enregistré dans l'historique.
              </div>
            ) : (
              historyList.map((item, index) => (
                <div
                  key={`histo-${index}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-slate-400">
                      Coup #{index + 1}
                    </span>
                    <span className="font-mono text-base font-bold text-amber-400">
                      {item.combine} = {item.result}
                    </span>
                    <span className="text-xs text-slate-400">
                      Cible : <strong className="text-sky-400">{item.nbreatind}</strong> | Écart :{' '}
                      <strong className={item.nbreatind === item.result ? 'text-emerald-400' : 'text-rose-400'}>
                        {item.nbreatind - item.result}
                      </strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Score</span>
                    <span className="text-xl font-black text-emerald-400">
                      +{item.notedjeu} pts
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};
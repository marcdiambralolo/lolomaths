"use client"
import { useChrono } from '@/hooks/lolomaths/useChrono';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { isStartCaseCovered, getPlacedPions, hasLockedPionInSequence } from '@/components/lolomaths/game/competitionEngine';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Fdialog } from '../game/Fdialog';
import { OplaGrid } from '../game/OplaGrid';
import { StateCase } from '@/lib/interfaces';
import { TileRack } from '../game/TileRack';

export const CompetitionScreen: React.FC = () => {
  const {
    initGame,
    confirmCalculation,
    resetPions,
    resetToInitialState,
    scoreTotal,
    cnbjeu,
    directionsValid,
    gameResults,
    flatGrid,
    grid,
    hasUsedMultiplicationOrDivision
  } = useCompetitionStore();

  const [showResultZone, setShowResultZone] = useState<boolean>(false);
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<Array<{ score: number; combination: string }>>([]);

  // Chronomètre avec gestion du temps global
  const chrono = useChrono({
    initialSeconds: 300, // Temps par défaut (sera remplacé par la config)
    autoStart: false,
    onTimeUp: () => {
      setShowResultZone(true);
    },
  });

  // Initialisation du jeu
  useEffect(() => {
    // Charger la configuration depuis le localStorage ou utiliser les valeurs par défaut
    const savedConfig = localStorage.getItem('lolomaths_config');
    let numbers = ['12', '5', '3', '20', '8', '2'];
    let operators = ['+', '-', '*', '/'];
    let niveau = 3; // Dtfil.Sen par défaut

    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.numbers) numbers = config.numbers;
        if (config.operators) operators = config.operators;
        if (config.niveau !== undefined) niveau = config.niveau;
      } catch (e) {
        console.error('Erreur chargement config:', e);
      }
    }

    initGame(numbers, operators, niveau);
    chrono.start();

    // Nettoyage
    return () => {
      chrono.pause();
    };
  }, []);

  // Mettre à jour l'historique des jeux
  useEffect(() => {
    if (cnbjeu > 0 && gameResults.length > 0) {
      const lastResult = gameResults.find(r => r !== undefined);
      if (lastResult) {
        setGameHistory(prev => [...prev, {
          score: lastResult.notedjeu,
          combination: lastResult.combine || 'N/A'
        }]);
      }
    }
  }, [cnbjeu, gameResults]);

  // Gestion du reset
  const handleResetRound = useCallback(() => {
    resetPions();
    // Réinitialiser les résultats de direction
    setSelectedDirectionIndex(null);
  }, [resetPions]);

  // Gestion de la validation
  const handleOpenDialog = useCallback((index: number) => {
    setSelectedDirectionIndex(index);
  }, []);

  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex !== null) {
      confirmCalculation(selectedDirectionIndex);
      setSelectedDirectionIndex(null);
    }
  }, [selectedDirectionIndex, confirmCalculation]);

  // Vérifications d'état
  const isStartCovered = isStartCaseCovered(flatGrid);
  const placedPions = getPlacedPions(flatGrid);
  const hasLockedPion = hasLockedPionInSequence(placedPions);
  const isFirstGame = cnbjeu === 0;
  const hasAvailablePions = flatGrid.some(c => c.etat === StateCase.Pla || c.etat === StateCase.Choi);

  // Messages d'aide contextuels
  const helpMessages = useMemo(() => {
    const messages: string[] = [];

    if (!isStartCovered) {
      messages.push('🎯 Placez un pion sur la case de départ (★) pour commencer');
    }

    if (isStartCovered && placedPions.length === 0) {
      messages.push('🧩 Sélectionnez un pion dans le porte-pions et placez-le sur le plateau');
    }

    if (placedPions.length > 0 && placedPions.length < 3) {
      messages.push('📐 Une combinaison valide doit contenir au moins 3 pions (nombre-opérateur-nombre)');
    }

    if (placedPions.length > 0 && !isFirstGame && !hasLockedPion) {
      messages.push('🔗 Vous devez utiliser au moins un pion verrouillé (Lo) pour l\'enchaînement');
    }

    if (hasAvailablePions && isStartCovered && placedPions.length >= 3) {
      const hasValidDirection = directionsValid.left || directionsValid.right || directionsValid.up || directionsValid.down;
      if (!hasValidDirection) {
        messages.push('⚠️ La combinaison actuelle n\'est pas valide. Vérifiez l\'alternance et la fermeture.');
      }
    }

    if (hasUsedMultiplicationOrDivision) {
      messages.push('✅ Bonus "× ou ÷" déjà utilisé pour ce match');
    }

    return messages;
  }, [isStartCovered, placedPions, isFirstGame, hasLockedPion, hasAvailablePions, directionsValid, hasUsedMultiplicationOrDivision]);

  // Affichage des directions valides avec leurs scores
  const renderDirectionButtons = useCallback(() => {
    const directions = [
      { key: 'up', label: '↑ Haut', index: 0, valid: directionsValid.up },
      { key: 'down', label: '↓ Bas', index: 1, valid: directionsValid.down },
      { key: 'left', label: '← Gauche', index: 2, valid: directionsValid.left },
      { key: 'right', label: '→ Droite', index: 3, valid: directionsValid.right },
    ];

    const validDirections = directions.filter(d => d.valid);

    if (validDirections.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-pulse">
        {validDirections.map(({ key, label, index }) => (
          <button
            key={key}
            onClick={() => handleOpenDialog(index)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:scale-105 active:scale-95"
          >
            {label} ({gameResults[index]?.notedjeu?.toFixed(1) || 0} pts)
          </button>
        ))}
      </div>
    );
  }, [directionsValid, gameResults, handleOpenDialog]);

  return (
    <div className="w-full mx-auto max-w-md mt-2 flex flex-col select-none">
      <div className="flex flex-col gap-2">
        {!showResultZone ? (
          <div id="zcom" className="flex flex-col gap-2">
            {/* En-tête avec infos match */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 flex justify-between items-center text-xs text-slate-400">
              <span>Match #{cnbjeu + 1}</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {chrono.isRunning ? 'En cours' : 'Pause'}
              </span>
              <span>Score: {scoreTotal} pts</span>
            </div>

            {/* Plateau de jeu */}
            <OplaGrid />

            {/* Porte-pions */}
            <TileRack />

            {/* Messages d'aide */}
            {helpMessages.length > 0 && (
              <div className="p-2 text-center text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                {helpMessages.map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </div>
            )}

            {/* Contrôles */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                Jeu #{cnbjeu + 1}
              </div>
              <div className="font-mono font-black text-2xl text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-1 rounded-xl">
                {chrono.formattedTime}
              </div>
              <button
                onClick={handleResetRound}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition active:scale-95"
                disabled={placedPions.length === 0}
              >
                REFAIRE
              </button>
              <button
                onClick={resetToInitialState}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold rounded-xl text-xs transition active:scale-95"
                title="Réinitialiser complètement le match"
              >
                ↺
              </button>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="text-xs text-slate-500 block uppercase font-medium">Score Total</span>
                <span className="text-xl font-black text-emerald-400">{scoreTotal} pts</span>
                {cnbjeu > 0 && (
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Moy: {(scoreTotal / cnbjeu).toFixed(1)} pts/jeu
                  </span>
                )}
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="text-xs text-slate-500 block uppercase font-medium">Match en cours</span>
                <span className="text-xl font-black text-sky-400">N° {cnbjeu + 1}</span>
                {hasUsedMultiplicationOrDivision && (
                  <span className="text-[10px] text-amber-400 block mt-1">
                    ×÷ bonus utilisé ✓
                  </span>
                )}
              </div>
            </div>

            {/* Historique rapide */}
            {gameHistory.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 max-h-16 overflow-y-auto">
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  {gameHistory.slice(-5).map((g, idx) => (
                    <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded">
                      J{idx + 1}: {g.score}pts
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Directions de validation */}
            {isStartCovered && renderDirectionButtons()}

            {/* Switch d'aide */}
            <div className="flex justify-end p-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
                <span>Aide visuelle</span>
                <input
                  type="checkbox"
                  checked={showHelp}
                  onChange={(e) => setShowHelp(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>
        ) : (
          // Écran de fin de match
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6 text-center shadow-2xl max-w-lg mx-auto my-auto">
            <h3 className="text-2xl font-black text-amber-400">🏆 Match Terminé !</h3>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
              {chrono.isFinished 
                ? '⏰ Temps écoulé ! Bravo pour votre participation.'
                : '✅ Match validé avec succès !'}
            </div>

            {/* Statistiques du match */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Score Final</span>
                <span className="text-2xl font-black text-emerald-400">{scoreTotal} pts</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-500 block">Jeux Joués</span>
                <span className="text-2xl font-black text-sky-400">{cnbjeu}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
                <span className="text-xs text-slate-500 block">Moyenne par jeu</span>
                <span className="text-xl font-black text-amber-400">
                  {cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : 0} pts
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowResultZone(false);
                  setGameHistory([]);
                  const savedConfig = localStorage.getItem('lolomaths_config');
                  let numbers = ['12', '5', '3', '20', '8', '2'];
                  let operators = ['+', '-', '*', '/'];
                  let niveau = 3;
                  if (savedConfig) {
                    try {
                      const config = JSON.parse(savedConfig);
                      if (config.numbers) numbers = config.numbers;
                      if (config.operators) operators = config.operators;
                      if (config.niveau !== undefined) niveau = config.niveau;
                    } catch (e) {}
                  }
                  initGame(numbers, operators, niveau);
                  chrono.reset(300);
                  chrono.start();
                }}
                className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                🔄 RECOMMENCER UN MATCH
              </button>
              <button
                onClick={() => {
                  // Fonction pour voir les détails du match
                  alert(`Détails du match:\nScore: ${scoreTotal} pts\nJeux: ${cnbjeu}\nMoyenne: ${cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : 0} pts`);
                }}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm"
              >
                📊 Voir les détails
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue de validation */}
      <Fdialog
        isOpen={selectedDirectionIndex !== null}
        gameResult={selectedDirectionIndex !== null ? gameResults[selectedDirectionIndex] : null}
        onAccept={handleAcceptCalculation}
        onCancel={() => setSelectedDirectionIndex(null)}
      />
    </div>
  );
};
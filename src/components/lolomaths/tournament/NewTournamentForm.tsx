// components/tournament/NewTournamentForm.tsx
'use client';

import { BoardTheme, GameMatrix, TournamentFormState, DEFAULT_FORM_STATE } from '@/lib/interfaces';
import React, { useState } from 'react';
 

interface NewTournamentFormProps {
  themes: BoardTheme[];
  matrices: GameMatrix[];
  timeOptions: { label: string; value: string }[];
  gamesOptions: number[];
  onSubmit: (data: TournamentFormState) => void;
  onCancel?: () => void;
}

export const NewTournamentForm: React.FC<NewTournamentFormProps> = ({
  themes,
  matrices,
  timeOptions,
  gamesOptions,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<TournamentFormState>(DEFAULT_FORM_STATE);
  const [step, setStep] = useState<'config' | 'customMatches'>('config');

  const handleInputChange = (field: keyof TournamentFormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Passage à l'étape suivante ou validation directe
  const handleSubmitConfig = (e: React.FormEvent) => {
    e.preventDefault();

    // Si aucun numéro de tournoi renseigné, on demande la saisie manuelle des numéros de match
    if (!form.tournamentNumber.trim()) {
      const initialMatchNumbers = Array.from({ length: form.matchesCount }, () =>
        Math.floor(Math.random() * 1000000000).toString().substring(0, 9)
      );
      setForm((prev) => ({ ...prev, customMatchNumbers: initialMatchNumbers }));
      setStep('customMatches');
    } else {
      onSubmit(form);
    }
  };

  const handleCustomMatchNumberChange = (index: number, value: string) => {
    const updated = [...form.customMatchNumbers];
    updated[index] = value.slice(0, 9);
    setForm((prev) => ({ ...prev, customMatchNumbers: updated }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 text-white rounded-2xl shadow-xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        {step === 'config' ? 'Nouveau Tournoi' : 'Saisie des Numéros de Matchs'}
      </h2>

      {step === 'config' ? (
        <form onSubmit={handleSubmitConfig} className="space-y-4">
          {/* Nom du Joueur */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nom du Joueur
            </label>
            <input
              type="text"
              maxLength={20}
              placeholder="Entrez votre nom"
              value={form.playerName}
              onChange={(e) => handleInputChange('playerName', e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Numéro de Tournoi */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Numéro de Tournoi (Optionnel)
            </label>
            <input
              type="text"
              maxLength={9}
              placeholder="Ex: 123456789"
              value={form.tournamentNumber}
              onChange={(e) => handleInputChange('tournamentNumber', e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Nombre de Matchs */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre de Matchs
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={form.matchesCount}
              onChange={(e) => handleInputChange('matchesCount', Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Mode de Temps (Global / Par Match) */}
          <div className="flex items-center space-x-6 py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="timeMode"
                checked={!form.isGlobalTime}
                onChange={() => handleInputChange('isGlobalTime', false)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Temps par match</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="timeMode"
                checked={form.isGlobalTime}
                onChange={() => handleInputChange('isGlobalTime', true)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">Temps global</span>
            </label>
          </div>

          {/* Durée de jeu */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Durée
            </label>
            <select
              value={form.timeLimit}
              onChange={(e) => handleInputChange('timeLimit', e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Niveau / Matrice */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Niveau de difficulté
            </label>
            <select
              value={form.matrixLevelIndex}
              onChange={(e) => handleInputChange('matrixLevelIndex', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {matrices.map((mat, idx) => (
                <option key={idx} value={idx}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thème Visuel */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Thème graphique
            </label>
            <select
              value={form.themeId}
              onChange={(e) => handleInputChange('themeId', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg transition"
            >
              Continuer
            </button>
          </div>
        </form>
      ) : (
        /* Étape de complément des numéros de match */
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <p className="text-sm text-slate-400 mb-4">
            Veuillez vérifier ou personnaliser les identifiants pour chaque match :
          </p>
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {form.customMatchNumbers.map((num, idx) => (
              <div key={idx}>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Match n°{idx + 1}
                </label>
                <input
                  type="text"
                  maxLength={9}
                  value={num}
                  onChange={(e) => handleCustomMatchNumberChange(idx, e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep('config')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Retour
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg shadow-lg transition"
            >
              Démarrer le Tournoi
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
'use client';

import React from 'react';

/**
 * Composant spécialisé pour la préférence d'affichage de l'aide.
 *
 * Single Responsibility :
 * il ne gère que l'activation/désactivation de l'aide visuelle.
 */
interface HelpToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const HelpToggle: React.FC<HelpToggleProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className="flex justify-end p-2 select-none">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
        <span>Aide visuelle</span>

        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
          aria-label="Activer l'aide visuelle"
        />
      </label>
    </div>
  );
};

export default HelpToggle;

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
    <div className="flex justify-end p-2">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer">
        <span>Aide visuelle</span>

        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="w-4 h-4 accent-amber-500 rounded"
          aria-label="Activer l'aide visuelle"
        />
      </label>
    </div>
  );
};

export default HelpToggle;
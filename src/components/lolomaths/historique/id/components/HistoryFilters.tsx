'use client';

interface EditionOption {
  id: string;
  label: string;
}

interface HistoryFiltersProps {
  editions: EditionOption[];
  selectedEditionId: string | null;
  onEditionChange: (id: string | null) => void;
}

export function HistoryFilters({
  editions,
  selectedEditionId,
  onEditionChange,
}: HistoryFiltersProps) {
  if (editions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onEditionChange(null)}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
          selectedEditionId === null
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        Toutes les éditions
      </button>
      {editions.map((edition) => (
        <button
          key={edition.id}
          type="button"
          onClick={() => onEditionChange(edition.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            selectedEditionId === edition.id
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {edition.label}
        </button>
      ))}
    </div>
  );
}
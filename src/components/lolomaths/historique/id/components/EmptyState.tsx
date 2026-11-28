'use client';

import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  message?: string;
  icon?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  title,
  subtitle,
  message,
  icon = '🎯',
  cta,
}: EmptyStateProps) {
  // On affiche le title en priorité, sinon message
  const displayTitle = title ?? message ?? 'Aucune donnée disponible.';

  return (
    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-slate-600 dark:text-slate-400 font-semibold">
        {displayTitle}
      </p>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          {subtitle}
        </p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
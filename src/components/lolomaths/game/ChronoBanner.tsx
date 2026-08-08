import React from 'react';

interface ChronoBannerProps {
  formattedTime: string;
  timeLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const ChronoBanner: React.FC<ChronoBannerProps> = ({
  formattedTime,
  timeLeft,
  totalSeconds,
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  const isWarning = timeLeft <= 30 && timeLeft > 0;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Temps Restant
          </span>
          <span
            className={`text-3xl font-black font-mono transition-colors ${
              isWarning ? 'text-rose-500 animate-pulse' : 'text-amber-400'
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {/* Commandes Manuel */}
        <div className="flex gap-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-semibold transition"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={onStart}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm font-semibold transition"
            >
              Reprendre
            </button>
          )}
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
          >
            Raz
          </button>
        </div>
      </div>

      {/* Barre de progression du temps */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isWarning ? 'bg-rose-500' : 'bg-amber-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
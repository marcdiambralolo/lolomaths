'use client';
import { Info } from 'lucide-react';
import React, { memo, useCallback, useState } from 'react';

const cardBaseClass =
  'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const Pill = memo(function Pill({
  icon,
  title,
  desc,
  tooltip,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tooltip?: string;
  delay?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const closeTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <div
      className={`${cardBaseClass} group p-4 sm:p-5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-indigo-500/[0.05] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.06]" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 transition-transform duration-300 group-active:scale-95 group-hover:scale-105 dark:from-purple-500/20 dark:to-indigo-500/20 dark:text-purple-300">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold leading-tight text-slate-900 sm:text-sm dark:text-white">
                {title}
              </div>
            </div>

            {tooltip ? (
              <button
                type="button"
                onClick={toggleTooltip}
                aria-label={`Informations sur ${title}`}
                aria-expanded={showTooltip}
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition active:scale-95 dark:bg-white/10 dark:text-purple-300"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 sm:text-[14px] dark:text-slate-300/85">
            {desc}
          </p>

          {tooltip ? (
            <div
              className={`grid transition-all duration-200 ${showTooltip
                ? 'mt-3 grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
                }`}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl border border-purple-200/70 bg-purple-50/90 px-3 py-2 text-xs leading-relaxed text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-200">
                  {tooltip}
                  <button
                    type="button"
                    onClick={closeTooltip}
                    className="ml-2 font-bold underline underline-offset-2"
                  >
                    fermer
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default Pill;
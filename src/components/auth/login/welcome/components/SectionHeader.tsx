'use client';
import { Sparkles } from 'lucide-react';
import { memo } from 'react';

const sectionTitleClass =
    'text-center text-xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white';

const sectionTextClass =
    'mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500 sm:text-[14px] dark:text-slate-300/80';

const SectionHeader = memo(function SectionHeader({
    badge,
    title,
    subtitle,
}: {
    badge?: string;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-5 sm:mb-6">
            {badge ? (
                <div className="mb-3 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        {badge}
                    </span>
                </div>
            ) : null}

            <h4 className={sectionTitleClass}>{title}</h4>

            {subtitle ? <p className={sectionTextClass}>{subtitle}</p> : null}
        </div>
    );
});

export default SectionHeader;
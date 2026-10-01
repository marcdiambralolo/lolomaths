"use client";
import { cx } from "@/lib/functions";

const SectionContainer = ({ children }: { children: React.ReactNode }) => (
    <section
        className={cx(
            "w-full max-w-2xl px-3 py-4 sm:px-6 sm:py-6",
            "dark:bg-slate-950/55 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        )}
    >
        <div className="flex flex-col items-center justify-center gap-3">
            {children}
        </div>
    </section>
);

export default SectionContainer;
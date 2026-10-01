"use client";
import { cx } from "@/lib/functions";
import { Sparkles } from "lucide-react";

const SearchIcon = () => (
    <div className="pointer-events-none absolute right-3 top-[42px] hidden sm:block">
        <Sparkles className={cx("h-4 w-4", "text-slate-300 dark:text-zinc-600")} />
    </div>
);

export default SearchIcon;
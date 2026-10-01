"use client";
import { cx } from "@/lib/functions";
import { CityItem } from "@/lib/interfaces";
import { motion } from "framer-motion";

const ROW_VARIANTS = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.12 } },
};

const CityItemRow = ({ city, onSelect }: { city: CityItem; onSelect: (city: CityItem) => void }) => {
    const secondary = [city.region, city.countryName].filter(Boolean).join(" • ");

    return (
        <motion.li variants={ROW_VARIANTS} initial="initial" animate="animate">
            <button
                type="button"
                onClick={() => onSelect(city)}
                className={cx(
                    "w-full px-3 py-2 text-left",
                    "transition-colors",
                    "hover:bg-slate-50 dark:hover:bg-zinc-900",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BC2FF] dark:focus-visible:ring-[#2E5AA6]/40"
                )}
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                            {city.name}
                        </div>
                        {secondary && (
                            <div className="truncate text-xs text-slate-500 dark:text-zinc-400">{secondary}</div>
                        )}
                    </div>
                    <span
                        className={cx(
                            "shrink-0 rounded-full px-2 py-1 text-[11px] font-bold",
                            "bg-[#EEF4FF] text-[#2E5AA6] dark:bg-[#0F1C3F]/40 dark:text-[#9BC2FF]"
                        )}
                    >
                        Choisir
                    </span>
                </div>
            </button>
        </motion.li>
    );
};

export default CityItemRow;
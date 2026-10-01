"use client";
import { cx } from "@/lib/functions";
import { CityItem } from "@/lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import CityItemRow from "./CityItemRow";

const DROPDOWN_VARIANTS = {
    initial: { opacity: 0, y: 6, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.14 } },
    exit: { opacity: 0, y: 6, scale: 0.995, transition: { duration: 0.12 } },
};

const MIN_QUERY_LENGTH = 2;

const DropdownHeader = ({ loading, netError, items }: { loading: boolean; netError: string | null; items: CityItem[] }) => (
    <div className="px-3 py-2 text-xs text-slate-500 dark:text-zinc-400">
        {loading ? "Recherche en cours…" : netError ? "Erreur" : items.length ? "Suggestions" : "Aucun résultat"}
    </div>
);

const NetworkError = ({ error }: { error: string }) => (
    <div className="flex items-start gap-2 px-3 pb-3 text-sm text-rose-700 dark:text-rose-300">
        <AlertCircle className="mt-0.5 h-4 w-4" />
        <span>{error}</span>
    </div>
);

const NoResults = ({ query }: { query: string }) => (
    <div className="px-3 pb-3 text-sm text-slate-600 dark:text-zinc-300">
        Aucun résultat pour “{query}”.
    </div>
);

const CityList = ({ items, onSelect, limit }: { items: CityItem[]; onSelect: (city: CityItem) => void; limit: number }) => (
    <ul className="max-h-64 overflow-auto pb-2">
        {items.slice(0, limit).map((city) => (
            <CityItemRow key={city.id} city={city} onSelect={onSelect} />
        ))}
    </ul>
);

const SuggestionsDropdown = ({
    show,
    loading,
    netError,
    items,
    query,
    onSelect,
    limit,
}: {
    show: boolean;
    loading: boolean;
    netError: string | null;
    items: CityItem[];
    query: string;
    onSelect: (city: CityItem) => void;
    limit: number;
}) => {
    if (!show) return null;

    const hasQuery = query.length >= MIN_QUERY_LENGTH;
    const hasNoResults = !loading && !netError && items.length === 0 && hasQuery;

    return (
        <AnimatePresence>
            <motion.div
                variants={DROPDOWN_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cx(
                    "mx-auto mt-2 w-full max-w-xl overflow-hidden rounded-2xl border text-left shadow-sm",
                    "border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                )}
                role="listbox"
            >
                <DropdownHeader loading={loading} netError={netError} items={items} />

                {netError && <NetworkError error={netError} />}

                {hasNoResults && <NoResults query={query} />}

                {!netError && items.length > 0 && (
                    <CityList items={items} onSelect={onSelect} limit={limit} />
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default SuggestionsDropdown;
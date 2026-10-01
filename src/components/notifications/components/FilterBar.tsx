"use client";
import { filterOptions } from "@/hooks/notifications/useNotificationsPage";
import { cx } from "@/lib/functions";
import { memo } from "react";

const FilterBar = memo(function FilterBar({
    filter,
    setFilter,
}: {
    filter: string;
    setFilter: (value: string) => void;
}) {
    return (
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {filterOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={cx(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                        filter === option.value
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    type="button"
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
});

export default FilterBar;
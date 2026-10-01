"use client";
import { memo, type ReactNode } from "react";

const IdentityPill = memo(function IdentityPill({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {icon}
                {label}
            </div>
            <div className="mt-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {value || "—"}
            </div>
        </div>
    );
});

export default IdentityPill;
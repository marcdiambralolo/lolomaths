"use client";
import { cx } from "@/lib/functions";

function DifficultyBadge({ level, label }: { level: string; label: string }) {
    const colors: Record<string, string> = {
        débutant: "bg-green-100 text-green-700",
        intermédiaire: "bg-yellow-100 text-yellow-700",
        avancé: "bg-orange-100 text-orange-700",
        expert: "bg-red-100 text-red-700",
    };
    return (
        <span className={cx("inline-block rounded-full px-3 py-1 text-xs font-bold", colors[level] || "bg-purple-100 text-purple-700")}>
            {label}
        </span>
    );
}

export default DifficultyBadge; 
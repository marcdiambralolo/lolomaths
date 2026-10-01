"use client";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

const ApiErrorCard = memo(function ApiErrorCard({ apiError }: { apiError: string }) {
    return (
        <div
            className="w-full rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3"
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start justify-center gap-2 text-center">
                <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4" />
                </span>
                <div className="text-[12px] font-semibold text-rose-700 dark:text-rose-300">
                    {apiError}
                </div>
            </div>
        </div>
    );
});

export default ApiErrorCard;
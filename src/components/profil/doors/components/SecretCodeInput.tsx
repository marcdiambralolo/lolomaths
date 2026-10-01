"use client";
import { cx } from "@/lib/functions";
import { Info, KeyRound } from "lucide-react";
import { memo, useEffect, useState } from "react";

const SecretCodeInput = memo(function SecretCodeInput({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (code: string) => void;
    error?: string;
}) {
    const [localCode, setLocalCode] = useState(value);

    useEffect(() => {
        setLocalCode(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.slice(0, 4);
        setLocalCode(val);
        onChange(val);
    };

    return (
        <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Code secret (À retenir)
                </span>
            </label>
            <input
                type="text"
                maxLength={4}
                value={localCode}
                onChange={handleChange}
                className={cx(
                    "w-full rounded-xl border-2 px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] transition-all",
                    error
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-gray-200 bg-white focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800"
                )}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <Info className="h-3 w-3" />
                Code pour récupérer vos gains (4 caractères)
            </p>
        </div>
    );
});

export default SecretCodeInput;
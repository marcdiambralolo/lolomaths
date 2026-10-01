"use client";
import { cx } from "@/lib/functions";
import { Phone } from "lucide-react";
import { memo } from "react";

const PhoneInput = memo(function PhoneInput({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (phone: string) => void;
    error?: string;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value.slice(0, 20));
    };

    return (
        <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Numéro de téléphone
                </span>
            </label>
            <input
                type="text"
                inputMode="text"
                value={value}
                onChange={handleChange}
                className={cx(
                    "w-full rounded-xl border-2 px-4 py-3 transition-all",
                    error
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-gray-200 bg-white focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800"
                )}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
});

export default PhoneInput;
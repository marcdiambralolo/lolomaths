"use client";
import { cx } from "@/lib/functions";
import { Calendar } from "lucide-react";
import { memo } from "react";
import { DAYS, MONTHS, YEARS } from "./constantes";

interface BirthDateInputProps {
    day: string;
    month: string;
    year: string;
    onDayChange: (value: string) => void;
    onMonthChange: (value: string) => void;
    onYearChange: (value: string) => void;
    error?: string;
}

const BirthDateInput = memo(function BirthDateInput({
    day,
    month,
    year,
    onDayChange,
    onMonthChange,
    onYearChange,
    error,
}: BirthDateInputProps) {
    return (
        <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                </span>
            </label>

            <div className="grid grid-cols-3 gap-2">
                <select
                    value={day}
                    onChange={(e) => onDayChange(e.target.value)}
                    className={cx(
                        "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
                        error
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
                    )}
                >
                    <option value="">Jour</option>
                    {DAYS.map((dayOption) => (
                        <option key={dayOption.value} value={dayOption.value}>
                            {dayOption.label}
                        </option>
                    ))}
                </select>

                <select
                    value={month}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className={cx(
                        "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
                        error
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
                    )}
                >
                    <option value="">Mois</option>
                    {MONTHS.map((monthOption) => (
                        <option key={monthOption.value} value={monthOption.value}>
                            {monthOption.label}
                        </option>
                    ))}
                </select>

                <select
                    value={year}
                    onChange={(e) => onYearChange(e.target.value)}
                    className={cx(
                        "rounded-xl border-2 bg-white px-3 py-3 transition-all dark:bg-gray-800",
                        error
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-gray-200 focus:border-purple-500 dark:border-gray-700"
                    )}
                >
                    <option value="">Année</option>
                    {YEARS.map((yearOption) => (
                        <option key={yearOption.value} value={yearOption.value}>
                            {yearOption.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
});

export default BirthDateInput;
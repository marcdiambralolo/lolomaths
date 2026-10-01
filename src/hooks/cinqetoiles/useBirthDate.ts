import { parseDateParts } from "@/lib/functions";
import { useCallback, useEffect, useState } from "react";

export const useBirthDate = (dateNaissance: string) => {
    const initialParts = parseDateParts(dateNaissance);

    const [birthDay, setBirthDay] = useState(initialParts.day);
    const [birthMonth, setBirthMonth] = useState(initialParts.month);
    const [birthYear, setBirthYear] = useState(initialParts.year);

    useEffect(() => {
        const parts = parseDateParts(dateNaissance);
        setBirthDay(parts.day);
        setBirthMonth(parts.month);
        setBirthYear(parts.year);
    }, [dateNaissance]);

    const handleDayChange = useCallback((day: string) => setBirthDay(day), []);
    const handleMonthChange = useCallback((month: string) => setBirthMonth(month), []);
    const handleYearChange = useCallback((year: string) => setBirthYear(year), []);

    return {
        birthDay, birthMonth, birthYear,
        handleDayChange, handleMonthChange, handleYearChange,
    };
};
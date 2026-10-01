'use client';
import { useEffect, useState } from "react";

export const useFinishState = (isTimeUp: boolean) => {
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (isTimeUp) {
            const timer = setTimeout(() => {
                setShowHistory(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTimeUp]);

    return { showHistory };
};
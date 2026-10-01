"use client";
import { useCallback } from "react";

export const useFormHandlers = (handleChange: any) => {
    const handleSecretCodeChange = useCallback(
        (code: string) => {
            handleChange({ target: { name: "secretCode", value: code } } as any);
        },
        [handleChange]
    );

    const handlePhoneChange = useCallback(
        (phone: string) => {
            handleChange({ target: { name: "phone", value: phone } } as any);
        },
        [handleChange]
    );

    return { handleSecretCodeChange, handlePhoneChange };
};
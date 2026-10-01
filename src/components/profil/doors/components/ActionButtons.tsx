"use client";
import { X } from "lucide-react";

const ActionButtons = ({
    onSubmit,
    onReset,
    submitClass,
    cancelClass,
}: {
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
    submitClass: string;
    cancelClass: string;
}) => (
    <div className="flex w-full flex-col items-center justify-center gap-2 pt-1">
        <button type="submit" onClick={onSubmit} className={submitClass}>
            Valider et continuer
        </button>
        <button type="button" onClick={onReset} className={cancelClass}>
            <span className="inline-flex items-center justify-center gap-2">
                <X className="h-4 w-4" />
                Annuler
            </span>
        </button>
    </div>
);

export default ActionButtons;
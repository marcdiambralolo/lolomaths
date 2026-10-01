"use client";
import { Shield } from "lucide-react";

const SecurityFooter = () => (
    <div className="mt-4 w-full text-center">
        <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            Ces informations sont nécessaires pour sécuriser vos gains
        </p>
    </div>
);

export default SecurityFooter;
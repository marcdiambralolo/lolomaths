'use client';
import { SecurityBadge } from "./SecurityBadge";

export const ContentContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {children}
        <SecurityBadge />
    </div>
); 
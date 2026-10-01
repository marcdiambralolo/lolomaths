"use client";
import CacheLink from "@/components/commons/CacheLink";
import { ArrowLeft } from "lucide-react";

interface ButtonProps {
    href: string;
    children: React.ReactNode;
}

function BackButton({ href, children }: ButtonProps) {
    return (
        <CacheLink
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition"
        >
            <ArrowLeft className="h-4 w-4" />
            {children}
        </CacheLink>
    );
}

export default BackButton;
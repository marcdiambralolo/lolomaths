"use client";
import { Info } from "lucide-react";
import { useState } from "react";

function Pill({ icon, title, desc, tooltip }: { icon: React.ReactNode; title: string; desc: string; tooltip?: string }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="group relative flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <div className="text-[12px] font-bold text-purple-900">{title}</div>
                    {tooltip && (
                        <button
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="text-purple-400 hover:text-purple-600 transition"
                        >
                            <Info className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
                <div className="mt-1 text-[13px] leading-relaxed text-purple-700">{desc}</div>
            </div>

            {tooltip && showTooltip && (
                <div className="absolute left-0 top-full mt-2 z-10 w-48 rounded-lg bg-purple-900 px-3 py-2 text-xs text-white shadow-lg">
                    {tooltip}
                </div>
            )}
        </div>
    );
}

export default Pill;
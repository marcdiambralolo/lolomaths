"use client";
import { cx } from "@/lib/functions";

function ConicPanel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cx("rounded-[28px] p-[1px] bg-gradient-to-br from-purple-100 via-white to-indigo-50 shadow-sm", className)}>
            <div className="relative overflow-hidden rounded-[28px] border border-purple-100 bg-white p-5 sm:p-7 shadow-lg">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30"
                    style={{ background: "radial-gradient(circle at 1px 1px, #e9d5ff 1px, transparent 0)", backgroundSize: "14px 14px" }}
                />

                <div className="relative">{children}</div>
            </div>
        </div>
    );
}

export default ConicPanel;
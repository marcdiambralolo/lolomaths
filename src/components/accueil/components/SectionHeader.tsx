"use client";

export const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
    </div>
);
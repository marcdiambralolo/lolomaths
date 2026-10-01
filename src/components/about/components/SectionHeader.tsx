"use client";

const sectionTitleClass = "text-2xl font-black text-purple-900";
const sectionSubtitleClass = "mx-auto mt-2 max-w-2xl text-sm text-purple-600";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, icon }: SectionHeaderProps) => (
    <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <h2 className={sectionTitleClass}>{title}</h2>
        </div>

        {subtitle && <p className={sectionSubtitleClass}>{subtitle}</p>}
    </div>
);

export default SectionHeader;  
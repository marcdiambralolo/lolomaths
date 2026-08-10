"use client";

const SectionHeader: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    className?: string;
}> = ({ icon, title, subtitle, className = '' }) => (
    <div className={`mb-8 ${className}`}>
        <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0 text-indigo-600 shadow-sm">
                {icon}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {title}
            </h2>
        </div>
        {subtitle && (
            <p className="text-gray-500 text-sm sm:text-base mt-2 ml-13 max-w-2xl leading-relaxed">
                {subtitle}
            </p>
        )}
    </div>
);

export default SectionHeader;
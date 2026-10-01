"use client";

function FeatureCard({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2 text-purple-700">
                {icon}
                <span className="font-bold text-purple-900">{title}</span>
            </div>

            <div className="mt-2 text-sm text-purple-700">{children}</div>
        </div>
    );
}

export default FeatureCard;  
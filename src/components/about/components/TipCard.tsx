"use client";

interface TipCardProps {
    icon: React.ElementType;
    title: string;
    desc: string;
    color: "purple" | "indigo";
}

const TipCard = ({ icon: Icon, title, desc, color }: TipCardProps) => {
    const colorClasses = {
        purple: "bg-purple-50 text-purple-700",
        indigo: "bg-indigo-50 text-indigo-700",
    };

    return (
        <div className={`rounded-2xl ${color === "purple" ? "bg-purple-50" : "bg-indigo-50"} p-4`}>
            <div className={`flex items-center gap-2 ${colorClasses[color]}`}>
                <Icon className="h-5 w-5" />
                <span className="font-bold">{title}</span>
            </div>

            <p className={`mt-1 text-sm ${colorClasses[color]}`}>{desc}</p>
        </div>
    );
};

export default TipCard; 
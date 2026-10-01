"use client";
import ConsultationCard from "@/components/commons/ConsultationCard";
import { History } from "lucide-react";

const RecentConsultations = ({ consultations }: { consultations: any[] }) => {
    if (consultations.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-purple-500" />
                Dernières parties (top 10)
            </h3>
            <div className="space-y-3">
                {consultations.slice(0, 10).map((consultation, index) => (
                    <ConsultationCard
                        key={consultation?._id ?? consultation?.id ?? index}
                        consultation={consultation}
                        index={index}
                        showDate={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentConsultations;
"use client";
import IdentityOverview from "./IdentityOverview";
import RecentConsultations from "./RecentConsultations";

const ProfileTab = ({
    fullName,
    dateNaissanceLabel,
    consultations,
}: {
    fullName: string;
    dateNaissanceLabel: string;
    consultations: any[];
}) => (
    <div className="relative mt-8">
        <div className="relative z-10 w-full">
            <div className="space-y-6">
                <IdentityOverview
                    fullName={fullName}
                    dateNaissanceLabel={dateNaissanceLabel}
                />

                <RecentConsultations consultations={consultations} />
            </div>
        </div>
    </div>
);

export default ProfileTab;
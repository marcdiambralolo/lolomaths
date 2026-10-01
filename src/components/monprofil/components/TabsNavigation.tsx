"use client";
import { Gamepad2, History } from "lucide-react";
import TabButton from "./TabButton";

type TabType = "history" | "games";

const TabsNavigation = ({
    activeTab,
    setActiveTab,
    editionsCount,
}: {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    editionsCount: number;
}) => (
    <div className="mb-8">
        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 rounded-2xl">
            <TabButton
                active={activeTab === 'games'}
                onClick={() => setActiveTab('games')}
                icon={<Gamepad2 className="w-4 h-4" />}
                label="Mes Jeux"
                count={editionsCount}
            />
            <TabButton
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                icon={<History className="w-5 h-5 text-purple-500" />}
                label="Mon Profil"
                count={-1}
            />
        </div>
    </div>
);

export default TabsNavigation;
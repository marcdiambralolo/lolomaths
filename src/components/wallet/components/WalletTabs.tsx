"use client";
import { cx } from "@/lib/functions";
import { Clock, Gift } from "lucide-react";

function WalletTabs({
    activeTab,
    setActiveTab,
}: {
    activeTab: "transactions" | "unused-offerings";
    setActiveTab: (tab: "transactions" | "unused-offerings") => void;
}) {
    return (
        <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-xl w-fit mx-auto mb-6">
            <button
                className={cx(
                    "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                    activeTab === "unused-offerings"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setActiveTab("unused-offerings")}
                type="button"
            >
                <Gift className="h-4 w-4 inline mr-2" />
                Jetons disponibles
            </button>
            <button
                className={cx(
                    "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
                    activeTab === "transactions"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setActiveTab("transactions")}
                type="button"
            >
                <Clock className="h-4 w-4 inline mr-2" />
                Transactions
            </button>
        </div>
    );
}

export default WalletTabs;
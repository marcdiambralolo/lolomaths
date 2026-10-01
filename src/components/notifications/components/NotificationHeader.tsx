"use client";
import CacheLink from "@/components/commons/CacheLink";
import { cx } from "@/lib/functions";
import { motion, Variants } from "framer-motion";
import { ArrowLeft, Bell, CheckCheck, Settings } from "lucide-react";
import { memo } from "react";

const scaleOnHover: Variants = {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

interface NotificationHeaderProps {
    unreadCount: number;
    markAllAsRead: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
}

const NotificationHeader = memo(function NotificationHeader({
    unreadCount,
    markAllAsRead,
    showSettings,
    setShowSettings,
}: NotificationHeaderProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <CacheLink href="/star/profil">
                        <motion.button
                            whileHover={{ x: -2 }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
                            aria-label="Retour"
                            type="button"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </motion.button>
                    </CacheLink>

                    <div>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-indigo-500" />
                            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mt-0.5">
                            {unreadCount > 0
                                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                                : "Toutes vos notifications sont lues"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <motion.button
                            {...scaleOnHover}
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100"
                            type="button"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Tout marquer comme lu
                        </motion.button>
                    )}

                    <motion.button
                        {...scaleOnHover}
                        onClick={() => setShowSettings(!showSettings)}
                        className={cx(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                            showSettings
                                ? "bg-indigo-600 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600"
                        )}
                        type="button"
                    >
                        <Settings className="h-4 w-4" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
});

export default NotificationHeader;
"use client";
import { cx, formatDateFRNew } from "@/lib/functions";
import type { Notification } from "@/lib/types/notification.types";
import { motion, Variants } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { memo } from "react";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const notificationIcons: Record<string, { icon: string; bg: string }> = {
    CONSULTATION_RESULT: { icon: "✨", bg: "bg-purple-100" },
    PAYMENT_CONFIRMED: { icon: "💰", bg: "bg-emerald-100" },
    SYSTEM_ANNOUNCEMENT: { icon: "🔔", bg: "bg-amber-100" }
};

interface NotificationCardProps {
    notification: Notification;
    onNotificationClick: (notification: Notification) => void;
    onDelete: (id: string) => void;
}

const NotificationCard = memo(function NotificationCard({
    notification,
    onNotificationClick,
    onDelete,
}: NotificationCardProps) {
    const typeKey = String(notification.type || "SYSTEM_ANNOUNCEMENT");
    const iconInfo = notificationIcons[typeKey] ?? notificationIcons.SYSTEM_ANNOUNCEMENT;

    return (
        <motion.article
            variants={fadeInUp}
            onClick={() => onNotificationClick(notification)}
            className={cx(
                "group relative cursor-pointer rounded-xl bg-white border p-5 transition-all hover:shadow-md",
                notification.isRead ? "border-gray-100" : "border-l-4 border-l-indigo-500 border-gray-100",
            )}
        >
            <div className="flex gap-4">
                <div className={cx(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                    iconInfo.bg
                )}>
                    <span className="text-2xl">{iconInfo.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h3 className={cx(
                                "font-semibold text-gray-900",
                                !notification.isRead && "text-indigo-600"
                            )}>
                                {notification.title}
                            </h3>

                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                {notification.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                            aria-label="Supprimer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDateFRNew(notification.createdAt)}
                    </div>

                    {!notification.isRead && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            </span>
                            Non lue
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
});

export default NotificationCard;
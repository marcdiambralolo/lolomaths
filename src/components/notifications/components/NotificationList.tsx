"use client";
import Loader from "@/app/loading";
import { staggerContainer } from "@/lib/animations";
import type { Notification } from "@/lib/types/notification.types";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import EmptyState from "./EmptyState";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
    notifications: Notification[];
    isLoading: boolean;
    filter: string;
    onNotificationClick: (notification: Notification) => void;
    onDelete: (id: string) => void;
}

const NotificationList = memo(function NotificationList({
    notifications,
    isLoading,
    filter,
    onNotificationClick,
    onDelete,
}: NotificationListProps) {
    const items = useMemo(() => notifications ?? [], [notifications]);

    if (isLoading) return <Loader />;

    if (items.length === 0) return <EmptyState filter={filter} />;

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
        >
            <AnimatePresence mode="popLayout">
                {items.map((notification, index) => (
                    <NotificationCard
                        key={notification._id + index}
                        notification={notification}
                        onNotificationClick={onNotificationClick}
                        onDelete={onDelete}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
});

export default NotificationList;
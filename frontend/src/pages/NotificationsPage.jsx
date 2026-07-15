import React from "react";
import { COLORS, fontHead, fontBody } from "../theme";
import { useNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/dashboard/NotificationCard";

export default function NotificationsPage({ role, initialData }) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications(role, initialData);

  return (
    <div className="max-w-160">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[13.5px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Mark all as read
          </button>
        )}
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
      </p>

      {notifications.length > 0 ? (
        notifications.map((n) => <NotificationCard key={n.id} {...n} onMarkRead={markAsRead} />)
      ) : (
        <p className="text-[14px] text-center py-12" style={{ ...fontBody, color: COLORS.textMuted }}>
          No notifications yet.
        </p>
      )}
    </div>
  );
}
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, fontHead, fontBody } from "../theme";
import NotificationCard from "../components/dashboard/NotificationCard";
import { getMyNotifications, markAsRead, markAllAsRead } from "../api/notifications";
import { useAuth } from "../context/AuthContext";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getMyNotifications(token);
      setNotifications(data);
    } catch {
      // fails gracefully
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markAsRead(id, token);
    } catch {
      fetchNotifications(); // re-sync with server if the optimistic update was wrong
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllAsRead(token);
    } catch {
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-160">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[24px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[13.5px] font-semibold"
            style={{ ...fontBody, color: COLORS.primary }}
          >
            Mark all as read
          </button>
        )}
      </div>
      <p className="text-[14.5px] mb-6" style={{ ...fontBody, color: COLORS.textMuted }}>
        {loading ? "Loading..." : unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
      </p>

      {notifications.length > 0 ? (
        notifications.map((n) => (
          <NotificationCard key={n._id} id={n._id} text={n.text} time={timeAgo(n.createdAt)} read={n.read} onMarkRead={handleMarkRead} />
        ))
      ) : (
        !loading && (
          <p className="text-[14px] text-center py-12" style={{ ...fontBody, color: COLORS.textMuted }}>
            No notifications yet.
          </p>
        )
      )}
    </div>
  );
}
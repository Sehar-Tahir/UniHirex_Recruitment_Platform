import { useState, useEffect } from "react";

export function useNotifications(role, initialData) {
  const storageKey = `unihirex_notifications_${role}`;

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : initialData.map((n) => ({ ...n, read: false }));
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, storageKey]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markAsRead, markAllAsRead, unreadCount };
}
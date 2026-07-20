import request from "./client";

export const getMyNotifications = (token) => request("/notifications/mine", { token });

export const markAsRead = (id, token) => request(`/notifications/${id}/read`, { method: "PATCH", token });

export const markAllAsRead = (token) => request("/notifications/mark-all-read", { method: "PATCH", token });
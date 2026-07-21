import request from "./client";

export const getAllUsers = (token) => request("/admin/users", { token });

export const approveUser = (id, token) => request(`/admin/users/${id}/approve`, { method: "PATCH", token });

export const toggleUserStatus = (id, token) =>
  request(`/admin/users/${id}/toggle-status`, { method: "PATCH", token });

export const getAllJobsForAdmin = (token) => request("/admin/jobs", { token });

export const getAdminStats = (token) => request("/admin/stats", { token });

export const createAdmin = (payload, token) =>
  request("/admin/create-admin", { method: "POST", body: payload, token });
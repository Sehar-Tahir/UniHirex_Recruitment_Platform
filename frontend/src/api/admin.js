import request from "./client";

export const getAllUsers = (token) => request("/admin/users", { token });

export const approveUser = (id, token) => request(`/admin/users/${id}/approve`, { method: "PATCH", token });

export const toggleUserStatus = (id, token) =>
  request(`/admin/users/${id}/toggle-status`, { method: "PATCH", token });

export const getAllJobsForAdmin = (token) => request("/admin/jobs", { token });
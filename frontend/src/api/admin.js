import request from "./client";

export const getAllUsers = (filters = {}, token) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/admin/users${query ? `?${query}` : ""}`, { token });
};

export const approveUser = (id, token) => request(`/admin/users/${id}/approve`, { method: "PATCH", token });

export const toggleUserStatus = (id, token) =>
  request(`/admin/users/${id}/toggle-status`, { method: "PATCH", token });

export const getAllJobsForAdmin = (filters = {}, token) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/admin/jobs${query ? `?${query}` : ""}`, { token });
};

export const getAdminStats = (token) => request("/admin/stats", { token });

export const createAdmin = (payload, token) =>
  request("/admin/create-admin", { method: "POST", body: payload, token });
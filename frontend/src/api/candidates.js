import request from "./client";

export const getCandidates = (filters = {}, token) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/users/candidates${query ? `?${query}` : ""}`, { token });
};

export const getCandidateById = (id, token) => request(`/users/candidates/${id}`, { token });
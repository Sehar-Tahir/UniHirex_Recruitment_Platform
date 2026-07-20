import request from "./client";

export const getMyProfile = (token) => request("/users/me", { token });

export const updateMyProfile = (payload, token) =>
  request("/users/me", { method: "PATCH", body: payload, token });

export const getCandidates = (filters = {}, token) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/users/candidates${query ? `?${query}` : ""}`, { token });
};

export const getCandidateById = (id, token) => request(`/users/candidates/${id}`, { token });

export const toggleSavedJob = (jobId, token) =>
  request(`/users/me/saved-jobs/${jobId}`, { method: "PATCH", token });

export const toggleSavedCandidate = (candidateId, token) =>
  request(`/users/me/saved-candidates/${candidateId}`, { method: "PATCH", token });



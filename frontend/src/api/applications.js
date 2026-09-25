import request from "./client";

export const applyToJob = (jobId, token) =>
  request("/applications", { method: "POST", body: { jobId }, token });

export const getMyApplications = (filters = {}, token) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/applications/mine${query ? `?${query}` : ""}`, { token });
};

export const getApplicantsForJob = (jobId, page, token) =>
  request(`/applications/job/${jobId}?page=${page}`, { token });

export const updateApplicationStatus = (id, status, token) =>
  request(`/applications/${id}/status`, { method: "PATCH", body: { status }, token });
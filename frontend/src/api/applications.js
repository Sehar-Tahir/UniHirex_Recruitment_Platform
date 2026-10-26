import request from "./client";

export const applyToJob = (jobId, details, token) =>
  request("/applications", { method: "POST", body: { jobId, ...details }, token });

export const checkApplied = (jobId, token) => request(`/applications/check/${jobId}`, { token });

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

export const getApplicationById = (id, token) => request(`/applications/${id}`, { token });

export const updateApplicationStatus = (id, status, token) =>
  request(`/applications/${id}/status`, { method: "PATCH", body: { status }, token });

export const getCandidateMatchScore = (applicationId, token) =>
  request(`/applications/${applicationId}/candidate-match`, { token });

export const sendInterviewInvite = (applicationId, payload, token) =>
  request(`/applications/${applicationId}/invite-interview`, { method: "POST", body: payload, token });

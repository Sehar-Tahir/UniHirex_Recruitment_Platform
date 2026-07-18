import request from "./client";

export const applyToJob = (jobId, token) =>
  request("/applications", { method: "POST", body: { jobId }, token });

export const getMyApplications = (token) => request("/applications/mine", { token });

export const getApplicantsForJob = (jobId, token) => request(`/applications/job/${jobId}`, { token });

export const updateApplicationStatus = (id, status, token) =>
  request(`/applications/${id}/status`, { method: "PATCH", body: { status }, token });
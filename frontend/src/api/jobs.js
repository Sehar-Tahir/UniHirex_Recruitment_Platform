import request from "./client";

export const getJobs = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/jobs${query ? `?${query}` : ""}`);
};

export const getJobById = (id) => request(`/jobs/${id}`);

export const getRecommendedJobs = () => request("/jobs/recommended");

export const createJob = (payload, token) => request("/jobs", { method: "POST", body: payload, token });

export const getMyJobs = (token) => request("/jobs/recruiter/mine", { token });

export const getRecruiterStats = (token) => request("/jobs/recruiter/stats", { token });

export const updateJobStatus = (id, status, token) =>
  request(`/jobs/${id}/status`, { method: "PATCH", body: { status }, token });
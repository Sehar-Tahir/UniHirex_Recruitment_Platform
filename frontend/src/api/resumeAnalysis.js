import request from "./client";

export const analyzeResume = (payload, token) =>
  request("/resume-analysis", { method: "POST", body: payload, token });

export const getMyResumeAnalyses = (page, token) => request(`/resume-analysis?page=${page}`, { token });

export const getAnalysisById = (id, token) => request(`/resume-analysis/${id}`, { token });

export const updateSuggestion = (id, payload, token) =>
  request(`/resume-analysis/${id}/suggestions`, { method: "PATCH", body: payload, token });

export const deleteAnalysis = (id, token) => request(`/resume-analysis/${id}`, { method: "DELETE", token });
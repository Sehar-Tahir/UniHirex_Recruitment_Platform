import request from "./client";

export const createInterview = (payload, token) =>
  request("/interviews", { method: "POST", body: payload, token });

export const getInterviewById = (id, token) => request(`/interviews/${id}`, { token });

export const getEphemeralToken = (interviewId, token) =>
  request(`/interviews/${interviewId}/ephemeral-token`, { method: "POST", token });

export const saveTranscript = (interviewId, turns, token) =>
  request(`/interviews/${interviewId}/transcript`, { method: "PATCH", body: { turns }, token });

export const getInterviewReport = (id, token) => request(`/interviews/${id}`, { token });

export const getMyInterviews = (page, token) => request(`/interviews?page=${page}`, { token });
import request from "./client";

export const getMyResumes = (token) => request("/users/me/resumes", { token });

export const addResume = (payload, token) => request("/users/me/resumes", { method: "POST", body: payload, token });

export const updateResume = (id, payload, token) =>
  request(`/users/me/resumes/${id}`, { method: "PATCH", body: payload, token });

export const deleteResume = (id, token) => request(`/users/me/resumes/${id}`, { method: "DELETE", token });
import request from "./client";

export const getMyProfile = (token) => request("/users/me", { token });

export const updateMyProfile = (payload, token) =>
  request("/users/me", { method: "PATCH", body: payload, token });
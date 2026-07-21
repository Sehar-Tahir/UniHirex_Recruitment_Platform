import request from "./client";

export const registerUser = (payload) => request("/auth/register", { method: "POST", body: payload });

export const loginUser = (payload) => request("/auth/login", { method: "POST", body: payload });

export const verifyEmail = (token) => request(`/auth/verify-email/${token}`, { method: "POST" });

export const resendVerification = (email) =>
  request("/auth/resend-verification", { method: "POST", body: { email } });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", { method: "POST", body: { email } });

export const resetPassword = (token, password) =>
  request(`/auth/reset-password/${token}`, { method: "POST", body: { password } });

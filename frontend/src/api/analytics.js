import request from "./client";

const withRange = (path, range) => `${path}?range=${encodeURIComponent(range)}`;

export const getOverview = (range, token) => request(withRange("/admin/analytics/overview", range), { token });
export const getGrowth = (range, token) => request(withRange("/admin/analytics/growth", range), { token });
export const getJobsAnalytics = (range, token) => request(withRange("/admin/analytics/jobs", range), { token });
export const getAiAnalytics = (range, token) => request(withRange("/admin/analytics/ai", range), { token });
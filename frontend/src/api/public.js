import request from "./client";

export const getPublicStats = () => request("/public/stats");
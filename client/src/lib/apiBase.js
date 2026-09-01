// In local dev, Vite proxies "/api" straight to the backend (see vite.config.js),
// so a relative path just works. Once frontend and backend are deployed to
// different domains, set VITE_API_BASE at build time to the deployed
// backend's full URL, e.g. VITE_API_BASE=https://paymend-server.onrender.com/api
export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

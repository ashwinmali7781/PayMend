// Whether the frontend should engage Clerk at all. Mirrors the backend's
// isClerkConfigured() - if no publishable key was set at build time, the
// app renders with no auth gate whatsoever (today's default), rather than
// crashing on a missing ClerkProvider key.
export const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

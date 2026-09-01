import { API_BASE } from "./apiBase.js";

// Set by AuthBridge once Clerk is loaded and signed in. Left null when
// Clerk isn't configured at all, in which case requests just go out
// without an Authorization header - matching the backend's demo-mode
// passthrough when it has no Clerk keys either.
let tokenGetter = null;

export function registerTokenGetter(fn) {
  tokenGetter = fn;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        // tokenGetter exists (Clerk is enabled) but returned nothing -
        // most likely not actually signed in yet, or the session hasn't
        // finished loading. Logged so it's visible in the browser console
        // rather than only showing up as an unexplained 401.
        console.warn(`[apiFetch] No auth token available for ${path} - request will go out unauthenticated.`);
      }
    } catch (err) {
      console.warn(`[apiFetch] Failed to get auth token for ${path}:`, err.message);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    const hadToken = headers.has("Authorization");
    console.warn(
      `[apiFetch] 401 on ${path}. Token was ${hadToken ? "sent" : "NOT sent"} with this request.`,
      hadToken
        ? "A token was attached but the backend rejected it - check that CLERK_SECRET_KEY/CLERK_PUBLISHABLE_KEY in server/.env belong to the SAME Clerk application as VITE_CLERK_PUBLISHABLE_KEY in client/.env."
        : "No token was attached - check that you're actually signed in."
    );
  }

  return res;
}

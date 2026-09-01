/**
 * Whether Clerk auth is actually configured. Mirrors razorpayClient.js's
 * pattern: the app works fully without it (open/demo mode), and only
 * requires real sign-in once real keys are added - so the project never
 * breaks for someone who hasn't set up auth yet.
 *
 * Computed once at module load and cached, rather than re-read on every
 * call. requireAuth.js and index.js both need to agree on this answer for
 * the whole lifetime of the process - if one read it fresh per-request
 * and the other read it once at startup, they could disagree (e.g. under
 * `node --watch`) and produce exactly the crash this was built to avoid:
 * requireAuth() calling getAuth() when clerkMiddleware() was never
 * actually registered for that code path.
 */
const CONFIGURED = Boolean(
  process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.includes("xxxx")
);

export function isClerkConfigured() {
  return CONFIGURED;
}

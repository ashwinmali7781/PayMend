import { verifyToken } from "@clerk/backend";
import { isClerkConfigured } from "../clerkConfig.js";

/**
 * Verifies the Bearer token directly with Clerk's backend SDK, rather than
 * relying on clerkMiddleware() having run earlier in the chain and
 * attached auth state for getAuth() to find. That approach broke in
 * practice (Clerk threw "clerkMiddleware should be registered before
 * using getAuth" even when it demonstrably was registered first) - this
 * version is self-contained: it reads the header, verifies it, done. No
 * ordering to get wrong.
 */
export async function requireAuth(req, res, next) {
  if (!isClerkConfigured()) {
    req.auth = { userId: "demo-user", configured: false };
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized. Sign in required.",
      hasAuthHeader: false,
    });
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      // Real machines drift a few seconds off true time (unsynced system
      // clocks, sleep/wake, VMs). Without tolerance, a token issued a
      // moment ago can look like it's "from the future" and get rejected
      // for no real security reason. 30s comfortably covers normal drift
      // without meaningfully weakening the token's validity window.
      clockSkewInMs: 30_000,
    });
    req.auth = { userId: payload.sub, sessionClaims: payload };
    next();
  } catch (err) {
    // Token was present but failed verification - wrong Clerk app/instance,
    // expired, tampered, or a secret key that doesn't match the
    // publishable key used to issue it. Logged so the exact reason shows
    // up in the terminal without guessing.
    console.error("Token verification failed:", err.message);
    res.status(401).json({
      error: "Unauthorized. Token verification failed.",
      hasAuthHeader: true,
      detail: err.message,
    });
  }
}

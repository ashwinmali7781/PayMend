import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";
import razorpayRouter from "./routes/razorpay.js";
import checkoutRouter from "./routes/checkout.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { isClerkConfigured } from "./clerkConfig.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    // In dev this is unset, so cors() allows all origins (fine locally).
    // In deployment, set CLIENT_ORIGIN to your deployed frontend's URL
    // (e.g. https://paymend.vercel.app) to restrict access properly.
    origin: process.env.CLIENT_ORIGIN || true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "paymend" });
});

// Lets the frontend know whether it should show a sign-in gate at all.
app.get("/api/auth/status", (req, res) => {
  res.json({ configured: isClerkConfigured() });
});

app.use("/api", requireAuth, apiRouter);
app.use("/api/razorpay", requireAuth, razorpayRouter);
app.use("/api/checkout", requireAuth, checkoutRouter);

// Catches errors thrown by clerkMiddleware (e.g. a malformed key) so a
// misconfiguration returns a clean, actionable JSON error instead of an
// unhandled HTML crash page.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({
    error: "Server error",
    detail: err.message,
    hint: err.message?.includes("key")
      ? "Check CLERK_SECRET_KEY / CLERK_PUBLISHABLE_KEY in server/.env are valid test keys from your Clerk dashboard."
      : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`PayMend server running on http://localhost:${PORT}`);
  console.log(`USE_SYNTHETIC_DATA=${process.env.USE_SYNTHETIC_DATA ?? "true"}`);
});

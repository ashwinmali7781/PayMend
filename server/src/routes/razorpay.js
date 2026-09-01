import { Router } from "express";
import { getRazorpayClient, isRazorpayConfigured } from "../razorpayClient.js";
import { fetchRealFailedPayments } from "../data/realPayments.js";
import { runRecoveryPipeline } from "../engine/pipeline.js";

const router = Router();

// GET /api/razorpay/status - lets the frontend know whether real keys are configured
router.get("/status", (req, res) => {
  res.json({ configured: isRazorpayConfigured() });
});

// GET /api/razorpay/config - the key_id is safe to expose to the browser
// (it's the public half of the pair; key_secret never leaves the server)
router.get("/config", (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(400).json({ error: "Razorpay not configured" });
  }
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

// POST /api/razorpay/create-order - creates a small test-mode order so the
// frontend can open Razorpay Checkout and deliberately trigger a failure
// (via UPI id "failure@razorpay" or by clicking "Failure" on the test bank page).
router.post("/create-order", async (req, res) => {
  const client = getRazorpayClient();
  if (!client) {
    return res.status(400).json({
      error: "Razorpay not configured. Add RAZORPAY_KEY_ID/SECRET to server/.env first.",
    });
  }

  try {
    const amount = Number(req.body?.amount) || 49900; // ₹499 in paise
    const order = await client.orders.create({
      amount,
      currency: "INR",
      receipt: `demo_${Date.now()}`,
      notes: { purpose: "revenue-recovery-agent demo failure" },
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed", detail: err.message });
  }
});

// POST /api/razorpay/pull-real-failures - fetches real failed payments from
// the test-mode account and runs them through the SAME pipeline as synthetic
// data (classify -> decide -> execute -> log).
router.post("/pull-real-failures", async (req, res) => {
  try {
    const realPayments = await fetchRealFailedPayments({ count: 50 });
    if (realPayments.length === 0) {
      return res.json({
        processed: 0,
        entries: [],
        message: "No failed payments found yet in test mode. Trigger one via Checkout first.",
      });
    }
    const entries = await runRecoveryPipeline(realPayments);
    res.json({ processed: entries.length, entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to pull real payments", detail: err.message });
  }
});

export default router;

import { Router } from "express";
import { generateAbandonedCheckouts } from "../data/syntheticCheckouts.js";
import { runCheckoutRecoveryPipeline } from "../engine/checkoutPipeline.js";
import { readCheckoutLog, clearCheckoutLog } from "../store/checkoutLog.js";

const router = Router();

// POST /api/checkout/run - generates a fresh synthetic batch of abandoned
// checkouts and runs the full recovery pipeline.
router.post("/run", async (req, res) => {
  try {
    const count = Number(req.body?.count) || 30;
    const abandoned = generateAbandonedCheckouts(count);
    const entries = await runCheckoutRecoveryPipeline(abandoned);
    res.json({ processed: entries.length, entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout pipeline run failed", detail: err.message });
  }
});

// GET /api/checkout/log - full checkout recovery audit trail, newest first
router.get("/log", async (req, res) => {
  const log = await readCheckoutLog();
  res.json(log);
});

// GET /api/checkout/metrics - aggregated numbers for the dashboard
router.get("/metrics", async (req, res) => {
  const log = await readCheckoutLog();

  const totalProcessed = log.length;
  const recovered = log.filter((e) => e.result.recovered);
  const escalated = log.filter((e) => e.result.outcome === "escalated");
  const waiting = log.filter((e) => e.result.outcome === "waiting");
  const stillAbandoned = log.filter((e) => e.result.outcome === "still_abandoned");

  const totalCartValue = log.reduce((sum, e) => sum + e.checkout.cart_value, 0);
  const totalRecoveredValue = recovered.reduce((sum, e) => sum + e.checkout.cart_value, 0);

  const byCategory = {};
  for (const e of log) {
    const cat = e.classification.category;
    byCategory[cat] = byCategory[cat] || { category: cat, label: e.classification.label, count: 0, recovered: 0 };
    byCategory[cat].count += 1;
    if (e.result.recovered) byCategory[cat].recovered += 1;
  }

  res.json({
    totalProcessed,
    recoveredCount: recovered.length,
    escalatedCount: escalated.length,
    waitingCount: waiting.length,
    stillAbandonedCount: stillAbandoned.length,
    recoveryRate: totalProcessed ? recovered.length / totalProcessed : 0,
    totalCartValuePaise: totalCartValue,
    totalRecoveredValuePaise: totalRecoveredValue,
    byCategory: Object.values(byCategory),
  });
});

// DELETE /api/checkout/log - reset the demo
router.delete("/log", async (req, res) => {
  await clearCheckoutLog();
  res.json({ ok: true });
});

export default router;

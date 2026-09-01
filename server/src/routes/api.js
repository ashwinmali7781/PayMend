import { Router } from "express";
import { generateFailedPayments } from "../data/syntheticPayments.js";
import { runRecoveryPipeline } from "../engine/pipeline.js";
import { readAuditLog, clearAuditLog, resolveEscalation } from "../store/auditLog.js";

const router = Router();

// POST /api/run - generates a fresh synthetic batch and runs the full pipeline.
// Swap generateFailedPayments() for a real Razorpay test-mode fetch/webhook
// payload once USE_SYNTHETIC_DATA=false.
router.post("/run", async (req, res) => {
  try {
    const count = Number(req.body?.count) || 60;
    const failedPayments = generateFailedPayments(count);
    const entries = await runRecoveryPipeline(failedPayments);
    res.json({ processed: entries.length, entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pipeline run failed", detail: err.message });
  }
});

// GET /api/audit-log - full audit trail, newest first
router.get("/audit-log", async (req, res) => {
  const log = await readAuditLog();
  res.json(log);
});

// GET /api/metrics - aggregated numbers for the dashboard
router.get("/metrics", async (req, res) => {
  const log = await readAuditLog();

  const totalProcessed = log.length;
  const recovered = log.filter((e) => e.result.recovered);
  const escalated = log.filter((e) => e.result.outcome === "escalated");
  const stillFailing = log.filter((e) => e.result.outcome === "still_failing");
  const pendingEscalations = escalated.filter((e) => !e.resolution);

  const totalAtRisk = log.reduce((sum, e) => sum + e.payment.amount, 0);
  const totalRecovered = recovered.reduce((sum, e) => sum + e.payment.amount, 0);
  const recoveryRate = totalProcessed ? recovered.length / totalProcessed : 0;

  const byCategory = {};
  for (const e of log) {
    const cat = e.classification.category;
    byCategory[cat] = byCategory[cat] || { category: cat, label: e.classification.label, count: 0, recovered: 0 };
    byCategory[cat].count += 1;
    if (e.result.recovered) byCategory[cat].recovered += 1;
  }

  const byAction = {};
  for (const e of log) {
    const action = e.decision.action;
    byAction[action] = byAction[action] || { action, count: 0 };
    byAction[action].count += 1;
  }

  // Revenue impact projection: treats the current processed batch as a
  // representative single day of failed-payment volume, then extrapolates.
  // This is a stated assumption, not a forecast model - the point is to
  // translate "we recovered X in this run" into a business-relevant scale.
  const dailyAtRiskPaise = totalAtRisk;
  const dailyRecoveredPaise = totalRecovered;
  const projection = {
    basis: "current batch treated as one day of failed-payment volume",
    dailyAtRiskPaise,
    dailyRecoveredPaise,
    monthlyAtRiskPaise: dailyAtRiskPaise * 30,
    monthlyRecoveredPaise: dailyRecoveredPaise * 30,
    annualRecoveredPaise: dailyRecoveredPaise * 365,
  };

  res.json({
    totalProcessed,
    recoveredCount: recovered.length,
    escalatedCount: escalated.length,
    pendingEscalationsCount: pendingEscalations.length,
    stillFailingCount: stillFailing.length,
    recoveryRate,
    totalAtRiskPaise: totalAtRisk,
    totalRecoveredPaise: totalRecovered,
    byCategory: Object.values(byCategory),
    byAction: Object.values(byAction),
    projection,
  });
});

// GET /api/escalations - only entries escalated to a human that haven't
// been resolved yet. This is the queue a human works from.
router.get("/escalations", async (req, res) => {
  const log = await readAuditLog();
  const pending = log.filter((e) => e.result.outcome === "escalated" && !e.resolution);
  res.json(pending);
});

// POST /api/escalations/:auditId/resolve - records a human decision on an
// escalated payment. action is one of: approve_retry | dismiss | write_off.
router.post("/escalations/:auditId/resolve", async (req, res) => {
  const { auditId } = req.params;
  const { action, note } = req.body || {};

  const validActions = ["approve_retry", "dismiss", "write_off"];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: `action must be one of: ${validActions.join(", ")}` });
  }

  const updated = await resolveEscalation(auditId, { action, note: note || null });
  if (!updated) {
    return res.status(404).json({ error: "Audit entry not found" });
  }
  res.json(updated);
});

// DELETE /api/audit-log - reset the demo
router.delete("/audit-log", async (req, res) => {
  await clearAuditLog();
  res.json({ ok: true });
});

export default router;

import { nanoid } from "nanoid";
import { classifyFailure } from "./classifier.js";
import { decideAction } from "./decisionEngine.js";
import { executeAction } from "./executor.js";
import { generateRecoveryMessage } from "./messageGenerator.js";
import { appendAuditEntries } from "../store/auditLog.js";

/**
 * Runs the full detect -> diagnose -> decide -> execute -> log loop
 * over a batch of failed-payment events, and persists one audit entry
 * per payment. This is the single function a webhook handler or a
 * "run agent" button both call.
 */
export async function runRecoveryPipeline(failedPayments) {
  const entries = failedPayments.map((payment) => {
    const classification = classifyFailure(payment);
    const decision = decideAction(payment, classification);
    const result = executeAction(decision);
    const message = generateRecoveryMessage(payment, classification, decision);

    return {
      audit_id: `audit_${nanoid(10)}`,
      processed_at: new Date().toISOString(),
      payment,
      classification,
      decision,
      result,
      message,
    };
  });

  await appendAuditEntries(entries);
  return entries;
}

import { nanoid } from "nanoid";
import { classifyAbandonment } from "./checkoutClassifier.js";
import { decideCheckoutAction } from "./checkoutDecisionEngine.js";
import { executeCheckoutAction } from "./checkoutExecutor.js";
import { generateCheckoutMessage } from "./checkoutMessageGenerator.js";
import { appendCheckoutEntries } from "../store/checkoutLog.js";

/**
 * Runs the full detect -> diagnose -> decide -> execute -> log loop over a
 * batch of abandoned checkouts. Mirrors runRecoveryPipeline() for payments,
 * but kept as a separate pipeline since an abandoned checkout is a
 * different event entirely - no charge was ever attempted, so it has its
 * own classifier, decision rules, and message set.
 */
export async function runCheckoutRecoveryPipeline(abandonedCheckouts) {
  const entries = abandonedCheckouts.map((checkout) => {
    const classification = classifyAbandonment(checkout);
    const decision = decideCheckoutAction(checkout, classification);
    const result = executeCheckoutAction(decision);
    const message = generateCheckoutMessage(checkout, classification, decision);

    return {
      audit_id: `chkaudit_${nanoid(10)}`,
      processed_at: new Date().toISOString(),
      checkout,
      classification,
      decision,
      result,
      message,
    };
  });

  await appendCheckoutEntries(entries);
  return entries;
}

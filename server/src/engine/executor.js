/**
 * Execution layer.
 *
 * Simulates carrying out an action. Kept simulated (no real SMS/email
 * spend) so the whole demo runs for free - swap `simulateOutcome` for a
 * real Razorpay retry call / notification provider when going live.
 *
 * Outcomes are randomized with realistic-ish success rates per action so
 * the dashboard shows a believable recovered-vs-unresolved split rather
 * than a suspicious 100%.
 */

const SUCCESS_RATES = {
  auto_retry: 0.55,
  schedule_retry: 0.4,
  notify_customer_update_method: 0.35,
  escalate_to_human: 0, // resolution happens outside the agent; not counted as agent-recovered
};

export function executeAction(decision) {
  const rate = SUCCESS_RATES[decision.action] ?? 0;
  const succeeded = Math.random() < rate;

  if (decision.action === "escalate_to_human") {
    return {
      outcome: "escalated",
      recovered: false,
      note: "Handed off to human collections queue with full context attached.",
    };
  }

  return {
    outcome: succeeded ? "recovered" : "still_failing",
    recovered: succeeded,
    note: succeeded
      ? "Payment succeeded after agent action."
      : "Action taken, payment still failing - will re-enter the pipeline on next attempt or hit the retry cap.",
  };
}

/**
 * Execution layer for checkout recovery. Simulated outcomes, same
 * philosophy as the payment executor: realistic success rates so the
 * dashboard shows a believable split, not a suspicious 100%.
 */

const SUCCESS_RATES = {
  send_discount_nudge: 0.5,
  send_reminder: 0.3,
  notify_sales_human: 0, // resolution happens outside the agent
  wait: 0,
};

export function executeCheckoutAction(decision) {
  if (decision.action === "wait") {
    return {
      outcome: "waiting",
      recovered: false,
      note: "Too soon to act. Will be reconsidered on the next run.",
    };
  }

  if (decision.action === "notify_sales_human") {
    return {
      outcome: "escalated",
      recovered: false,
      note: "Handed off to a human for high-touch outreach.",
    };
  }

  const rate = SUCCESS_RATES[decision.action] ?? 0;
  const succeeded = Math.random() < rate;

  return {
    outcome: succeeded ? "recovered" : "still_abandoned",
    recovered: succeeded,
    note: succeeded
      ? "Customer completed checkout after the nudge."
      : "Nudge sent, cart still abandoned as of this run.",
  };
}

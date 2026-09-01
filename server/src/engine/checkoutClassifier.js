/**
 * Diagnosis layer for checkout abandonment. Same philosophy as the payment
 * classifier: a fixed, readable rule table rather than a model call, so
 * every classification carries the rule that produced it.
 */

const RULES = [
  {
    match: (c) => c.abandonment_reason === "price_hesitation",
    category: "price_hesitation",
    label: "Price hesitation",
    nudgeType: "discount",
    rationale: "Cart was full but the customer stalled at the price. A modest, one-time discount is the standard lever here.",
  },
  {
    match: (c) => c.abandonment_reason === "shipping_cost_shock",
    category: "shipping_cost_shock",
    label: "Shipping cost surprise",
    nudgeType: "discount",
    rationale: "Shipping cost revealed late in checkout is a well-documented drop-off cause. A shipping-offset discount directly addresses it.",
  },
  {
    match: (c) => c.abandonment_reason === "no_saved_payment_method",
    category: "no_saved_payment_method",
    label: "No saved payment method",
    nudgeType: "reminder",
    rationale: "Cart is intact, customer just didn't have a payment method ready. A simple reminder is enough - no discount needed.",
  },
  {
    match: (c) => c.abandonment_reason === "session_timeout",
    category: "session_timeout",
    label: "Session timed out",
    nudgeType: "reminder",
    rationale: "Likely a genuine interruption, not a buying-decision problem. A reminder that the cart is saved is sufficient.",
  },
  {
    match: (c) => c.abandonment_reason === "comparison_shopping",
    category: "comparison_shopping",
    label: "Comparison shopping",
    nudgeType: "reminder",
    rationale: "Customer is likely evaluating alternatives. A discount here just erodes margin without changing the decision - a gentle reminder is the bounded choice.",
  },
  {
    match: (c) => c.abandonment_reason === "technical_glitch",
    category: "technical_glitch",
    label: "Technical glitch at checkout",
    nudgeType: "apology_reminder",
    rationale: "Not the customer's fault - an apologetic nudge with a direct retry link, not a discount pitch.",
  },
];

const FALLBACK = {
  category: "unclassified",
  label: "Unclassified abandonment",
  nudgeType: "none",
  rationale: "No rule matched this abandonment reason. Flagged for manual review rather than guessing at a nudge.",
};

export function classifyAbandonment(checkout) {
  const rule = RULES.find((r) => r.match(checkout));
  if (!rule) return { ...FALLBACK, abandonment_reason: checkout.abandonment_reason };
  const { match, ...classification } = rule;
  return { ...classification, abandonment_reason: checkout.abandonment_reason };
}

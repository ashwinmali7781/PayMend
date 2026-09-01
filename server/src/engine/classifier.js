/**
 * Diagnosis layer.
 *
 * Deliberately rule-based rather than an LLM call: for a finance-adjacent
 * agent, a fixed, auditable rule table is more explainable and reproducible
 * than a model call, and it costs nothing to run. Every classification
 * carries the rule that fired, so the audit trail can show its work.
 */

const RULES = [
  {
    match: (p) => p.error_reason === "insufficient_funds",
    category: "insufficient_funds",
    label: "Insufficient funds",
    retryable: true,
    rationale: "Balance issues often resolve within days (salary credit, top-up). Safe to retry later.",
  },
  {
    match: (p) => p.error_reason === "card_expired",
    category: "card_expired",
    label: "Card expired",
    retryable: false,
    rationale: "Retrying the same card will fail again. Customer must update payment method.",
  },
  {
    match: (p) => p.error_reason === "bank_declined",
    category: "bank_declined",
    label: "Bank declined",
    retryable: true,
    rationale: "Could be a soft decline (limits, OTP mismatch). Worth one retry before escalating.",
  },
  {
    match: (p) => p.error_reason === "issuer_timeout" || p.error_reason === "gateway_timeout",
    category: "network_transient",
    label: "Network/issuer timeout",
    retryable: true,
    rationale: "Transient infrastructure issue, unrelated to the customer. High confidence retry will succeed.",
  },
  {
    match: (p) => p.error_reason === "invalid_cvv",
    category: "invalid_cvv",
    label: "Invalid CVV",
    retryable: false,
    rationale: "Likely a data entry mistake. Needs customer re-entry, not an automatic retry.",
  },
  {
    match: (p) => p.error_reason === "risk_check_failed",
    category: "risk_flagged",
    label: "Risk check failed",
    retryable: false,
    rationale: "Automatic retries on risk-flagged payments could look like abuse. Route to human review.",
  },
];

const FALLBACK = {
  category: "unclassified",
  label: "Unclassified failure",
  retryable: false,
  rationale: "No rule matched this error reason. Flagged for manual review rather than guessing.",
};

export function classifyFailure(payment) {
  const rule = RULES.find((r) => r.match(payment));
  if (!rule) {
    return { ...FALLBACK, error_code: payment.error_code, error_reason: payment.error_reason };
  }
  const { match, ...classification } = rule;
  return { ...classification, error_code: payment.error_code, error_reason: payment.error_reason };
}

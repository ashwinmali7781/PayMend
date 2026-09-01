import { nanoid } from "nanoid";

// Failure reason codes modeled on Razorpay's real error codes/descriptions,
// so swapping in live webhook data later is a drop-in replacement.
const FAILURE_REASONS = [
  { code: "BAD_REQUEST_ERROR", reason: "insufficient_funds", weight: 3 },
  { code: "GATEWAY_ERROR", reason: "card_expired", weight: 2 },
  { code: "GATEWAY_ERROR", reason: "bank_declined", weight: 3 },
  { code: "GATEWAY_ERROR", reason: "issuer_timeout", weight: 2 },
  { code: "BAD_REQUEST_ERROR", reason: "invalid_cvv", weight: 1 },
  { code: "SERVER_ERROR", reason: "gateway_timeout", weight: 1 },
  { code: "BAD_REQUEST_ERROR", reason: "risk_check_failed", weight: 1 },
];

const CUSTOMERS = [
  "Aarav Shah",
  "Priya Nair",
  "Rohan Mehta",
  "Isha Kapoor",
  "Vikram Rao",
  "Ananya Iyer",
  "Karan Malhotra",
  "Sneha Reddy",
  "Arjun Singh",
  "Divya Menon",
  "Kabir Joshi",
  "Meera Pillai",
  "Yash Agarwal",
  "Riya Desai",
  "Nikhil Bose",
];

const PLANS = [
  { name: "Starter Monthly", amount: 49900 },
  { name: "Pro Monthly", amount: 149900 },
  { name: "Pro Annual", amount: 1499900 },
  { name: "Team Monthly", amount: 399900 },
];

function weightedPick(items) {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[0];
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a batch of synthetic failed-payment events shaped like
 * Razorpay payment.failed webhook payloads. Free to run indefinitely,
 * no API calls, no cost - use this to demo before wiring live test-mode webhooks.
 */
export function generateFailedPayments(count = 60) {
  const events = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const failure = weightedPick(FAILURE_REASONS);
    const plan = pick(PLANS);
    const customer = pick(CUSTOMERS);
    // Most payments are on their first failure. Some are already on a
    // retry. A smaller slice have already exhausted the retry cap (2) -
    // these are what populate the escalation queue, representing
    // payments that failed, got retried automatically, and failed again.
    const attemptRoll = Math.random();
    const attempt = attemptRoll < 0.12 ? 3 : attemptRoll < 0.32 ? 2 : 1;
    const ageHours = Math.floor(Math.random() * 96); // spread over last 4 days

    events.push({
      id: `pay_${nanoid(14)}`,
      customer_id: `cust_${nanoid(10)}`,
      customer_name: customer,
      plan: plan.name,
      amount: plan.amount, // paise, matches Razorpay convention
      currency: "INR",
      status: "failed",
      error_code: failure.code,
      error_reason: failure.reason,
      attempt_number: attempt,
      created_at: new Date(now - ageHours * 3600 * 1000).toISOString(),
    });
  }

  return events;
}

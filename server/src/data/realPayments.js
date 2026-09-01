import { getRazorpayClient } from "../razorpayClient.js";

/**
 * Razorpay's real error_reason strings don't line up 1:1 with our internal
 * classification categories, so we normalize by keyword match before
 * handing off to classifyFailure(). Anything that doesn't match falls
 * through to the classifier's "unclassified" bucket rather than guessing.
 */
function normalizeErrorReason(razorpayPayment) {
  const raw = `${razorpayPayment.error_reason || ""} ${razorpayPayment.error_description || ""}`.toLowerCase();

  if (raw.includes("insufficient")) return "insufficient_funds";
  if (raw.includes("expire")) return "card_expired";
  if (raw.includes("cvv") || raw.includes("cvc")) return "invalid_cvv";
  if (raw.includes("timeout") || raw.includes("timed out")) return "issuer_timeout";
  if (raw.includes("risk") || raw.includes("fraud")) return "risk_check_failed";
  if (raw.includes("declin") || raw.includes("failed")) return "bank_declined";

  return razorpayPayment.error_reason || "unknown";
}

/**
 * Fetches real failed payments from the Razorpay test-mode account and
 * reshapes them into the same event shape generateFailedPayments() produces,
 * so the rest of the pipeline (classifier -> decision engine -> executor)
 * doesn't need to know or care whether a payment is real or synthetic.
 */
export async function fetchRealFailedPayments({ count = 50 } = {}) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in server/.env."
    );
  }

  const response = await client.payments.all({ count });
  const failed = (response.items || []).filter((p) => p.status === "failed");

  return failed.map((p) => ({
    id: p.id,
    customer_id: p.contact || p.email || `razorpay_${p.id}`,
    customer_name: p.email || p.contact || "Unknown customer",
    plan: p.description || "Razorpay test payment",
    amount: p.amount,
    currency: p.currency || "INR",
    status: "failed",
    error_code: p.error_code || "UNKNOWN",
    error_reason: normalizeErrorReason(p),
    attempt_number: 1,
    created_at: new Date(p.created_at * 1000).toISOString(),
    source: "razorpay_live_test", // marks this as a real API-sourced record in the audit trail
  }));
}

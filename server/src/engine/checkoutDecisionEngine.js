/**
 * Decision layer for checkout abandonment.
 *
 * Bounded on purpose, same as the payment decision engine:
 *  - never nudges within 30 minutes of abandonment (avoids pestering
 *    someone who may still be actively shopping)
 *  - at most ONE discount per cart, capped at 10% - never stacked, never
 *    re-offered on a second look
 *  - any cart above the high-value threshold routes to a human (sales-style
 *    outreach), regardless of category - not something an automated
 *    discount should touch
 */

const TOO_SOON_MINUTES = 30;
const HIGH_VALUE_PAISE = 1000000; // ₹10,000
const DISCOUNT_CAP_PERCENT = 10;

export function decideCheckoutAction(checkout, classification) {
  if (checkout.minutes_since_abandonment < TOO_SOON_MINUTES) {
    return {
      action: "wait",
      detail: `Only ${checkout.minutes_since_abandonment} min since abandonment - too soon to nudge.`,
      reasoning: "Customer may still be actively shopping. Bounded behavior: no nudge before 30 minutes.",
    };
  }

  if (checkout.cart_value >= HIGH_VALUE_PAISE) {
    return {
      action: "notify_sales_human",
      detail: `Cart value is high (${(checkout.cart_value / 100).toLocaleString("en-IN")} INR) - routed to a human, not an automated discount.`,
      reasoning: "High-value carts get a human touch rather than a blanket automated offer.",
    };
  }

  if (classification.nudgeType === "discount") {
    return {
      action: "send_discount_nudge",
      detail: `One-time ${DISCOUNT_CAP_PERCENT}% discount code, single use, no stacking.`,
      reasoning: classification.rationale,
    };
  }

  if (classification.nudgeType === "reminder" || classification.nudgeType === "apology_reminder") {
    return {
      action: "send_reminder",
      detail: "Cart-saved reminder with a direct checkout link. No discount attached.",
      reasoning: classification.rationale,
    };
  }

  // Safety net: unclassified or unhandled nudge types are escalated,
  // never guessed at with an automatic discount.
  return {
    action: "notify_sales_human",
    detail: "No specific nudge rule for this category.",
    reasoning: "Escalating rather than guessing at an automated offer.",
  };
}

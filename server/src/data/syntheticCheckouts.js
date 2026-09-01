import { nanoid } from "nanoid";

// Abandonment reasons, weighted by how commonly they show up in real
// checkout drop-off data.
const ABANDONMENT_REASONS = [
  { reason: "price_hesitation", weight: 3 },
  { reason: "shipping_cost_shock", weight: 3 },
  { reason: "no_saved_payment_method", weight: 2 },
  { reason: "session_timeout", weight: 2 },
  { reason: "comparison_shopping", weight: 2 },
  { reason: "technical_glitch", weight: 1 },
];

const CUSTOMERS = [
  "Aarav Shah", "Priya Nair", "Rohan Mehta", "Isha Kapoor", "Vikram Rao",
  "Ananya Iyer", "Karan Malhotra", "Sneha Reddy", "Arjun Singh", "Divya Menon",
  "Kabir Joshi", "Meera Pillai", "Yash Agarwal", "Riya Desai", "Nikhil Bose",
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
 * Generates synthetic checkout-abandonment events: a customer added items
 * to cart, started or reached checkout, and left without paying. This is
 * a distinct event from a failed payment - no charge was ever attempted -
 * so it gets its own generator, classifier and decision engine rather than
 * being forced into the payment-failure shape.
 */
export function generateAbandonedCheckouts(count = 40) {
  const events = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const { reason } = weightedPick(ABANDONMENT_REASONS);
    const customer = pick(CUSTOMERS);
    const items = 1 + Math.floor(Math.random() * 5);
    // Cart value skews toward normal purchases, with an occasional big B2B-ish cart
    const isHighValue = Math.random() < 0.12;
    const cartValue = isHighValue
      ? (15000 + Math.floor(Math.random() * 35000)) * 100 // ₹15k-50k
      : (299 + Math.floor(Math.random() * 4000)) * 100; // ₹299-4299
    // Most abandonments are recent; a slice are old enough to safely nudge
    const minutesSinceAbandonment = Math.floor(Math.random() * 4000);
    const device = Math.random() < 0.6 ? "mobile" : "desktop";

    events.push({
      id: `chk_${nanoid(14)}`,
      customer_id: `cust_${nanoid(10)}`,
      customer_name: customer,
      cart_items: items,
      cart_value: cartValue,
      currency: "INR",
      status: "abandoned",
      abandonment_reason: reason,
      minutes_since_abandonment: minutesSinceAbandonment,
      device,
      created_at: new Date(now - minutesSinceAbandonment * 60 * 1000).toISOString(),
    });
  }

  return events;
}

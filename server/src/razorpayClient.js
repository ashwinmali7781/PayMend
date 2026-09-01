import Razorpay from "razorpay";

let instance = null;

/**
 * Lazily instantiates the Razorpay SDK client from env vars.
 * Returns null (rather than throwing) when keys aren't configured yet,
 * so the rest of the app can keep working on synthetic data.
 */
export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.includes("xxxx")) {
    return null;
  }

  if (!instance) {
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return instance;
}

export function isRazorpayConfigured() {
  return getRazorpayClient() !== null;
}

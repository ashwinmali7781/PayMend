/**
 * Generates a ready-to-send Hinglish (Roman-script Hindi/English mix)
 * recovery message per failure category. Template-based on purpose - no
 * translation API, no cost, and every word is auditable rather than
 * generated fresh each time, which matters for anything customer-facing
 * in a finance context.
 *
 * Only produced for actions that involve reaching out to the customer.
 * A silent auto_retry (network blip) has nothing worth messaging about -
 * pestering a customer over a transient error that already resolved
 * itself would be worse than saying nothing.
 */

function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const TEMPLATES = {
  insufficient_funds: ({ name, amount, plan }) =>
    `Namaste ${name}, aapka ${plan} ka payment of ${amount} fail ho gaya tha kyunki account mein sufficient balance nahi tha. Koi baat nahi — hum agle kuch dinon mein dobara try karenge. Aap chahen toh abhi bhi payment complete kar sakte hain: [payment link]. Koi dikkat ho toh humein zaroor batayein!`,

  card_expired: ({ name, plan }) =>
    `Namaste ${name}, aapka card jo ${plan} ke liye use ho raha tha, woh expire ho chuka hai. Kripya apna naya card yahan update kar dein: [update card link], taaki aapki service bina rukawat ke chalti rahe.`,

  bank_declined: ({ name, amount }) =>
    `Namaste ${name}, aapka payment of ${amount} bank se decline ho gaya. Hum ek baar aur try karenge, lekin agar issue dobara aaye toh kripya apne bank se sampark karein ya doosra payment method try karein: [payment link].`,

  invalid_cvv: ({ name }) =>
    `Namaste ${name}, aapke card ka CVV match nahi hua isliye payment fail ho gaya. Kripya sahi CVV ke saath dobara try karein: [payment link].`,

  risk_flagged: ({ name }) =>
    `Namaste ${name}, security ke liye aapka payment review mein hai. Hamari team jald hi aapse sampark karegi. Agar aapko jaldi hai toh humare support team se yahan baat karein: [support link].`,

  unclassified: ({ name, amount }) =>
    `Namaste ${name}, aapka payment of ${amount} process nahi ho paya. Humari team is issue ko dekh rahi hai aur jald hi aapse sampark karegi. Asuvidha ke liye khed hai.`,
};

// Actions where a customer-facing nudge makes sense. auto_retry (transient
// network blips) is deliberately excluded - see module note above.
const MESSAGEABLE_ACTIONS = new Set([
  "notify_customer_update_method",
  "schedule_retry",
  "escalate_to_human",
]);

export function generateRecoveryMessage(payment, classification, decision) {
  if (!MESSAGEABLE_ACTIONS.has(decision.action)) return null;

  const template = TEMPLATES[classification.category] || TEMPLATES.unclassified;
  const text = template({
    name: payment.customer_name?.split(" ")[0] || "there",
    amount: formatINR(payment.amount),
    plan: payment.plan,
  });

  return { language: "hi-Latn", text };
}

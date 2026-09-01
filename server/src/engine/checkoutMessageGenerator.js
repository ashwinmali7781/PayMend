function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const TEMPLATES = {
  price_hesitation: ({ name, value }) =>
    `Namaste ${name}, aapka cart (${value}) abhi bhi humare paas saved hai! Special ke taur par, aapke liye 10% off ka code hai: SAVE10. Ye offer thodi der ke liye hi valid hai — jaldi checkout kar lein: [checkout link]`,

  shipping_cost_shock: ({ name, value }) =>
    `Namaste ${name}, hume pata hai shipping cost thoda zyada laga hoga. Isliye aapke liye 10% off ka code hai jo shipping cost cover karne mein madad karega: SAVE10. Aapka cart (${value}) abhi bhi ready hai: [checkout link]`,

  no_saved_payment_method: ({ name }) =>
    `Namaste ${name}, aapka cart abhi bhi saved hai — bas payment method add karna baaki hai. Ek click mein complete kar sakte hain: [checkout link]`,

  session_timeout: ({ name }) =>
    `Namaste ${name}, lagta hai session beech mein hi timeout ho gaya. Koi baat nahi — aapka cart safe hai, jab chahen complete kar sakte hain: [checkout link]`,

  comparison_shopping: ({ name }) =>
    `Namaste ${name}, jab bhi aap ready hon, aapka cart yahan wait kar raha hai: [checkout link]. Koi sawaal ho toh humein batayein!`,

  technical_glitch: ({ name }) =>
    `Namaste ${name}, humein pata chala ki checkout ke dauraan kuch technical dikkat aayi thi — is asuvidha ke liye khed hai. Kripya dobara try karein: [checkout link]. Agar dobara issue aaye toh humari support team se sampark karein.`,
};

const MESSAGEABLE_ACTIONS = new Set(["send_discount_nudge", "send_reminder"]);

export function generateCheckoutMessage(checkout, classification, decision) {
  if (!MESSAGEABLE_ACTIONS.has(decision.action)) return null;

  const template = TEMPLATES[classification.category];
  if (!template) return null;

  const text = template({
    name: checkout.customer_name?.split(" ")[0] || "there",
    value: formatINR(checkout.cart_value),
  });

  return { language: "hi-Latn", text };
}

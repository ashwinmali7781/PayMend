import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient.js";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckoutScript() {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${CHECKOUT_SRC}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Couldn't load Razorpay Checkout script"));
    document.body.appendChild(script);
  });
}

export default function RealPaymentPanel({ onPulledRealData }) {
  const [configured, setConfigured] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    apiFetch("/razorpay/status")
      .then((r) => r.json())
      .then((d) => setConfigured(Boolean(d?.configured)))
      .catch(() => setConfigured(false));
  }, []);

  async function triggerRealFailure() {
    setBusy(true);
    setStatus(null);
    try {
      await loadCheckoutScript();

      const [orderRes, configRes] = await Promise.all([
        apiFetch("/razorpay/create-order", { method: "POST" }),
        apiFetch("/razorpay/config"),
      ]);
      const order = await orderRes.json();
      const config = await configRes.json();

      if (!orderRes.ok) throw new Error(order.error || "Order creation failed");
      if (!configRes.ok) throw new Error(config.error || "Couldn't load Razorpay config");

      const rzp = new window.Razorpay({
        key: config.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "PayMend — demo",
        description: "Test payment to generate a real failure",
        prefill: { name: "Demo Customer", email: "demo@example.com", contact: "9999999999" },
        theme: { color: "#3395ff" },
        modal: {
          ondismiss: () => setBusy(false),
        },
        handler: () => {
          // Only reaches here on success; for this demo we want a failure,
          // so the instructions below guide the user to fail it instead.
          setStatus({ type: "info", text: "That one succeeded — try the UPI failure@razorpay trick to force a decline." });
          setBusy(false);
        },
      });

      rzp.on("payment.failed", () => {
        setStatus({ type: "success", text: "Failure captured by Razorpay. Click \"Pull into agent\" below." });
        setBusy(false);
      });

      rzp.open();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
      setBusy(false);
    }
  }

  async function pullRealFailures() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await apiFetch("/razorpay/pull-real-failures", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pull failed");
      if (data.processed === 0) {
        setStatus({ type: "info", text: data.message || "No failed payments found yet." });
      } else {
        setStatus({ type: "success", text: `Pulled ${data.processed} real failed payment(s) into the agent.` });
        onPulledRealData?.();
      }
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (configured === false) {
    return (
      <div className="panel real-panel">
        <div className="panel-title">Real Razorpay test-mode data</div>
        <p className="real-panel-copy">
          Add your free test-mode keys to <code>server/.env</code> (
          <code>RAZORPAY_KEY_ID</code> / <code>RAZORPAY_KEY_SECRET</code>) to generate and pull in
          a real failed payment instead of synthetic data. Get them from{" "}
          <a href="https://dashboard.razorpay.com/" target="_blank" rel="noreferrer">
            dashboard.razorpay.com
          </a>{" "}
          — no cost, no KYC needed in test mode.
        </p>
      </div>
    );
  }

  if (configured === null) return null;

  return (
    <div className="panel real-panel">
      <div className="panel-title">Real Razorpay test-mode data</div>
      <p className="real-panel-copy">
        Open the real Razorpay Checkout, and either enter UPI ID{" "}
        <code>failure@razorpay</code> to decline instantly, or pick a test card and click{" "}
        <strong>Failure</strong> on the mock bank page. Then pull it into the agent below.
      </p>
      <div className="real-panel-actions">
        <button className="btn btn-ghost" onClick={triggerRealFailure} disabled={busy}>
          Open Razorpay Checkout
        </button>
        <button className="btn btn-primary" onClick={pullRealFailures} disabled={busy}>
          Pull into agent
        </button>
      </div>
      {status && <div className={`real-status real-status-${status.type}`}>{status.text}</div>}
    </div>
  );
}

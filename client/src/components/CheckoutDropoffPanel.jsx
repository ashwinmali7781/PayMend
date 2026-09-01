import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient.js";

function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const ACTION_LABELS = {
  send_discount_nudge: "Discount nudge sent",
  send_reminder: "Reminder sent",
  notify_sales_human: "Routed to sales",
  wait: "Waiting (too soon)",
};

const OUTCOME_STYLE = {
  recovered: { label: "Recovered", color: "var(--recovered)", bg: "var(--recovered-soft)" },
  escalated: { label: "Routed to human", color: "var(--escalated)", bg: "var(--escalated-soft)" },
  waiting: { label: "Waiting", color: "var(--ink-dim)", bg: "var(--panel-raised)" },
  still_abandoned: { label: "Still abandoned", color: "var(--failing)", bg: "var(--failing-soft)" },
};

function CheckoutRow({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const outcome = OUTCOME_STYLE[entry.result.outcome] ?? OUTCOME_STYLE.still_abandoned;

  return (
    <div className="ledger-row">
      <div className="ledger-row-top">
        <span className="ledger-id">{entry.checkout.id}</span>
        <span className="ledger-customer">{entry.checkout.customer_name}</span>
        <span className="ledger-plan">{entry.checkout.cart_items} item(s)</span>
        <span className="ledger-amount">{formatINR(entry.checkout.cart_value)}</span>
        <span className="ledger-badge" style={{ color: outcome.color, background: outcome.bg }}>
          {outcome.label}
        </span>
      </div>
      <div className="ledger-row-mid">
        <span className="ledger-cause">{entry.classification.label}</span>
        <span className="ledger-arrow">→</span>
        <span className="ledger-action">{ACTION_LABELS[entry.decision.action]}</span>
      </div>
      <div className="ledger-why">
        <span className="ledger-why-label">why</span> {entry.decision.reasoning}
      </div>
      {entry.message && (
        <div className="ledger-message">
          <button className="ledger-message-toggle" onClick={() => setExpanded((e) => !e)}>
            <span className="ledger-message-tag">Hinglish nudge</span>
            {expanded ? "Hide" : "View message"}
          </button>
          {expanded && (
            <div className="ledger-message-body">
              <p>{entry.message.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CheckoutDropoffPanel() {
  const [metrics, setMetrics] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [metricsRes, logRes] = await Promise.all([
        apiFetch("/checkout/metrics"),
        apiFetch("/checkout/log"),
      ]);
      if (!metricsRes.ok || !logRes.ok) {
        const body = await (metricsRes.ok ? logRes : metricsRes).json().catch(() => null);
        throw new Error(body?.error || `Request failed (${metricsRes.status}/${logRes.status})`);
      }
      setMetrics(await metricsRes.json());
      setLog(await logRes.json());
      setError(null);
    } catch (err) {
      setError(err.message || "Couldn't load checkout recovery data.");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function runAgent() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/checkout/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 30 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Checkout run failed");
      }
      await refresh();
      setShowLedger(true);
    } catch (err) {
      setError(err.message || "Couldn't run checkout recovery.");
    } finally {
      setLoading(false);
    }
  }

  async function resetLog() {
    setLoading(true);
    try {
      await apiFetch("/checkout/log", { method: "DELETE" });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  const recoveryPct = Math.round((metrics?.recoveryRate || 0) * 100);

  return (
    <div className="panel checkout-panel">
      <div className="checkout-panel-header">
        <div>
          <div className="panel-title">Checkout drop-off recovery</div>
          <div className="ledger-sub">
            A separate funnel from payment failures — these customers never attempted to pay at
            all.
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={runAgent} disabled={loading}>
            {loading ? "Running…" : "Run checkout recovery"}
          </button>
          <button className="btn btn-ghost" onClick={resetLog} disabled={loading}>
            Reset
          </button>
        </div>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {metrics && metrics.totalProcessed > 0 && (
        <div className="checkout-metric-row">
          <div className="metric-card">
            <div className="metric-eyebrow">Cart value at risk</div>
            <div className="metric-value">{formatINR(metrics.totalCartValuePaise)}</div>
            <div className="metric-sub">{metrics.totalProcessed} abandoned checkouts</div>
          </div>
          <div className="metric-card">
            <div className="metric-eyebrow">Recovered</div>
            <div className="metric-value" style={{ color: "var(--recovered)" }}>
              {formatINR(metrics.totalRecoveredValuePaise)}
            </div>
            <div className="metric-sub">{metrics.recoveredCount} checkouts completed</div>
          </div>
          <div className="metric-card">
            <div className="metric-eyebrow">Recovery rate</div>
            <div className="metric-value" style={{ color: "var(--gold)" }}>{recoveryPct}%</div>
            <div className="metric-sub">of processed batch</div>
          </div>
          <div className="metric-card">
            <div className="metric-eyebrow">Routed to sales</div>
            <div className="metric-value" style={{ color: "var(--escalated)" }}>
              {metrics.escalatedCount}
            </div>
            <div className="metric-sub">high-value carts, human touch</div>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <button className="btn btn-mini checkout-ledger-toggle" onClick={() => setShowLedger((s) => !s)}>
          {showLedger ? "Hide" : "Show"} checkout ledger ({log.length})
        </button>
      )}

      {showLedger && (
        <div className="ledger-list checkout-ledger-list">
          {log.map((entry) => (
            <CheckoutRow key={entry.audit_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

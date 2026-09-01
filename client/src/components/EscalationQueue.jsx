import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient.js";

function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

const RESOLUTION_LABELS = {
  approve_retry: "Manual retry approved",
  dismiss: "Dismissed",
  write_off: "Written off",
};

export default function EscalationQueue({ onResolved, refreshSignal }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [error, setError] = useState(null);

  async function loadQueue() {
    setLoading(true);
    try {
      const res = await apiFetch("/escalations");
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        // A failed request (401, 500, etc.) returns an error object, not
        // an array - setting that directly into queue crashed the whole
        // component on the next .map() call. Fail safe instead: keep the
        // queue empty and show why.
        setQueue([]);
        setError(data?.error || `Couldn't load the escalation queue (${res.status}).`);
      } else {
        setQueue(data);
        setError(null);
      }
    } catch (err) {
      setQueue([]);
      setError(err.message || "Couldn't load the escalation queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQueue();
  }, [refreshSignal]);

  async function resolve(auditId, action) {
    setResolvingId(auditId);
    try {
      const res = await apiFetch(`/escalations/${auditId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Resolve failed");
      }
      setQueue((q) => q.filter((e) => e.audit_id !== auditId));
      setError(null);
      onResolved?.();
    } catch (err) {
      // Keep it in the queue on failure - the person can retry.
      setError(err.message || "Couldn't resolve that item.");
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div className="panel escalation-panel">
      <div className="panel-title">
        Escalation queue
        {queue.length > 0 && <span className="escalation-count-badge">{queue.length}</span>}
      </div>
      <div className="ledger-sub">
        Payments the agent won't touch further — bounded out at the retry cap or an
        unretryable failure. A human decides from here.
      </div>

      {error && <div className="banner-error">{error}</div>}

      {loading ? (
        <div className="ledger-empty">Loading…</div>
      ) : queue.length === 0 ? (
        <div className="ledger-empty">Queue is clear. Nothing waiting on a human right now.</div>
      ) : (
        <div className="escalation-list">
          {queue.map((entry) => (
            <div key={entry.audit_id} className="escalation-row">
              <div className="escalation-row-top">
                <span className="ledger-customer">{entry.payment.customer_name}</span>
                <span className="ledger-plan">{entry.payment.plan}</span>
                <span className="ledger-amount">{formatINR(entry.payment.amount)}</span>
              </div>
              <div className="escalation-reason">
                {entry.classification.label} · {entry.decision.detail}
              </div>
              <div className="escalation-actions">
                <button
                  className="btn btn-mini btn-mini-primary"
                  disabled={resolvingId === entry.audit_id}
                  onClick={() => resolve(entry.audit_id, "approve_retry")}
                >
                  Approve manual retry
                </button>
                <button
                  className="btn btn-mini"
                  disabled={resolvingId === entry.audit_id}
                  onClick={() => resolve(entry.audit_id, "dismiss")}
                >
                  Dismiss
                </button>
                <button
                  className="btn btn-mini btn-mini-danger"
                  disabled={resolvingId === entry.audit_id}
                  onClick={() => resolve(entry.audit_id, "write_off")}
                >
                  Write off
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

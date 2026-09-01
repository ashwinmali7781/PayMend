import { useState } from "react";
import { downloadAuditLogCsv } from "../lib/csvExport.js";

const ACTION_LABELS = {
  auto_retry: "Auto-retry",
  schedule_retry: "Scheduled retry",
  notify_customer_update_method: "Notify customer",
  escalate_to_human: "Escalated",
};

const OUTCOME_STYLE = {
  recovered: { label: "Recovered", color: "var(--recovered)", bg: "var(--recovered-soft)" },
  escalated: { label: "Escalated", color: "var(--escalated)", bg: "var(--escalated-soft)" },
  still_failing: { label: "Still failing", color: "var(--failing)", bg: "var(--failing-soft)" },
};

function formatINR(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function MessagePreview({ message }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API can fail on non-https/localhost edge cases - fail silently
    }
  }

  return (
    <div className="ledger-message">
      <button className="ledger-message-toggle" onClick={() => setExpanded((e) => !e)}>
        <span className="ledger-message-tag">Hinglish reminder</span>
        {expanded ? "Hide" : "View message"}
      </button>
      {expanded && (
        <div className="ledger-message-body">
          <p>{message.text}</p>
          <button className="btn btn-mini" onClick={copyMessage}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

function LedgerRow({ entry }) {
  const outcome = OUTCOME_STYLE[entry.result.outcome] ?? OUTCOME_STYLE.still_failing;

  return (
    <div className="ledger-row">
      <div className="ledger-row-top">
        <span className="ledger-id">{entry.payment.id}</span>
        {entry.payment.source === "razorpay_live_test" && (
          <span className="ledger-live-badge">LIVE</span>
        )}
        <span className="ledger-customer">{entry.payment.customer_name}</span>
        <span className="ledger-plan">{entry.payment.plan}</span>
        <span className="ledger-amount">{formatINR(entry.payment.amount)}</span>
        <span className="ledger-badge" style={{ color: outcome.color, background: outcome.bg }}>
          {outcome.label}
        </span>
      </div>
      <div className="ledger-row-mid">
        <span className="ledger-cause">{entry.classification.label}</span>
        <span className="ledger-arrow">→</span>
        <span className="ledger-action">{ACTION_LABELS[entry.decision.action]}</span>
        <span className="ledger-time">{timeAgo(entry.processed_at)}</span>
      </div>
      <div className="ledger-why">
        <span className="ledger-why-label">why</span> {entry.decision.reasoning}
      </div>
      <MessagePreview message={entry.message} />
    </div>
  );
}

export default function AuditLedger({ entries }) {
  if (!entries) return null;

  return (
    <div className="panel ledger-panel">
      <div className="ledger-panel-header">
        <div className="panel-title">Audit trail</div>
        {entries.length > 0 && (
          <button className="btn btn-mini" onClick={() => downloadAuditLogCsv(entries)}>
            Export CSV
          </button>
        )}
      </div>
      <div className="ledger-sub">Every action the agent takes, with its reasoning attached.</div>
      {entries.length === 0 ? (
        <div className="ledger-empty">No runs yet. Run the agent to populate the ledger.</div>
      ) : (
        <div className="ledger-list">
          {entries.map((entry) => (
            <LedgerRow key={entry.audit_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatINR(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

function Metric({ eyebrow, value, sub, accent }) {
  return (
    <div className="metric-card">
      <div className="metric-eyebrow">{eyebrow}</div>
      <div className="metric-value" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export default function MetricRow({ metrics }) {
  if (!metrics) return null;

  const recoveryPct = Math.round((metrics.recoveryRate || 0) * 100);

  return (
    <div className="metric-row">
      <Metric
        eyebrow="Revenue at risk"
        value={formatINR(metrics.totalAtRiskPaise)}
        sub={`${metrics.totalProcessed} failed payments processed`}
      />
      <Metric
        eyebrow="Revenue recovered"
        value={formatINR(metrics.totalRecoveredPaise)}
        sub={`${metrics.recoveredCount} payments`}
        accent="var(--recovered)"
      />
      <Metric
        eyebrow="Recovery rate"
        value={`${recoveryPct}%`}
        sub="of processed batch"
        accent="var(--gold)"
      />
      <Metric
        eyebrow="Escalated to human"
        value={metrics.escalatedCount}
        sub="hit the retry cap or unretryable"
        accent="var(--escalated)"
      />
    </div>
  );
}

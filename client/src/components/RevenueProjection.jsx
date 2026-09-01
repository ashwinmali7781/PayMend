function formatINR(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: rupees >= 100000 ? "compact" : "standard",
  }).format(rupees);
}

export default function RevenueProjection({ projection, totalProcessed }) {
  if (!projection || !totalProcessed) return null;

  return (
    <div className="panel projection-panel">
      <div className="panel-title">Revenue impact, projected</div>
      <p className="projection-basis">
        Assumes today's batch of {totalProcessed} failed payments is a representative single
        day — a stated assumption, not a forecast model.
      </p>
      <div className="projection-row">
        <div className="projection-cell">
          <div className="metric-eyebrow">Per month</div>
          <div className="projection-value">{formatINR(projection.monthlyRecoveredPaise)}</div>
          <div className="metric-sub">recovered, at current rate</div>
        </div>
        <div className="projection-cell">
          <div className="metric-eyebrow">Per year</div>
          <div className="projection-value" style={{ color: "var(--gold)" }}>
            {formatINR(projection.annualRecoveredPaise)}
          </div>
          <div className="metric-sub">recovered, at current rate</div>
        </div>
        <div className="projection-cell">
          <div className="metric-eyebrow">At risk / month</div>
          <div className="projection-value" style={{ color: "var(--failing)" }}>
            {formatINR(projection.monthlyAtRiskPaise)}
          </div>
          <div className="metric-sub">if nothing were recovered</div>
        </div>
      </div>
    </div>
  );
}

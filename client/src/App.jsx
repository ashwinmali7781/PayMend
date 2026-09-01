import { useCallback, useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/react";
import MetricRow from "./components/MetricRow.jsx";
import CategoryChart from "./components/CategoryChart.jsx";
import AuditLedger from "./components/AuditLedger.jsx";
import RealPaymentPanel from "./components/RealPaymentPanel.jsx";
import EscalationQueue from "./components/EscalationQueue.jsx";
import RevenueProjection from "./components/RevenueProjection.jsx";
import CheckoutDropoffPanel from "./components/CheckoutDropoffPanel.jsx";
import AuthBridge from "./components/AuthBridge.jsx";
import SignInScreen from "./components/SignInScreen.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { apiFetch } from "./lib/apiClient.js";
import { CLERK_ENABLED } from "./lib/clerkConfig.js";
import "./app.css";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const [metricsRes, logRes] = await Promise.all([
        apiFetch("/metrics"),
        apiFetch("/audit-log"),
      ]);
      if (!metricsRes.ok || !logRes.ok) {
        const body = await (metricsRes.ok ? logRes : metricsRes).json().catch(() => null);
        throw new Error(body?.error || "Couldn't load dashboard data.");
      }
      setMetrics(await metricsRes.json());
      setLog(await logRes.json());
      setRefreshSignal((n) => n + 1);
      setError(null);
    } catch (err) {
      setError(err.message || "Couldn't reach the agent server. Is `npm run dev` running in /server?");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function runAgent() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 40 }),
      });
      if (!res.ok) throw new Error("Run failed");
      await refresh();
    } catch (err) {
      setError("Couldn't reach the agent server. Is `npm run dev` running in /server?");
    } finally {
      setLoading(false);
    }
  }

  async function resetLog() {
    setLoading(true);
    try {
      await apiFetch("/audit-log", { method: "DELETE" });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <div className="eyebrow">PayMend · Revenue Recovery Agent</div>
          <h1>Detect. Diagnose. Recover.</h1>
          <p className="subtitle">
            Watches failed payments, classifies the cause, and takes one bounded action per
            payment — every decision logged with its reasoning below.
          </p>
        </div>
        <div className="header-actions">
          {CLERK_ENABLED && (
            <div className="user-button-wrap">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
          <ThemeToggle />
          <button className="btn btn-primary" onClick={runAgent} disabled={loading}>
            {loading ? "Running…" : "Run agent on new batch"}
          </button>
          <button className="btn btn-ghost" onClick={resetLog} disabled={loading}>
            Reset
          </button>
        </div>
      </header>

      {error && <div className="banner-error">{error}</div>}

      <MetricRow metrics={metrics} />

      <RevenueProjection projection={metrics?.projection} totalProcessed={metrics?.totalProcessed} />

      <div className="grid-two">
        <CategoryChart data={metrics?.byCategory} />
        <div className="panel">
          <div className="panel-title">Actions taken</div>
          <ul className="action-list">
            {(metrics?.byAction || []).map((a) => (
              <li key={a.action}>
                <span>{a.action.replaceAll("_", " ")}</span>
                <span className="action-count">{a.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <EscalationQueue refreshSignal={refreshSignal} onResolved={refresh} />

      <RealPaymentPanel onPulledRealData={refresh} />

      <AuditLedger entries={log} />

      <div className="section-divider">
        <span>Checkout Drop-off Recovery</span>
      </div>

      <CheckoutDropoffPanel />

      <footer className="footer">
        Built for the Razorpay Buildathon — AI Revenue Recovery track. Synthetic test-mode data,
        no real payments involved.
      </footer>
    </div>
  );
}

export default function App() {
  // No Clerk key configured at build time -> render the dashboard directly,
  // exactly as before auth was added. No sign-in gate, no crash on a
  // missing key.
  if (!CLERK_ENABLED) {
    return <Dashboard />;
  }

  return (
    <>
      <AuthBridge />
      <Show when="signed-out">
        <SignInScreen />
      </Show>
      <Show when="signed-in">
        <Dashboard />
      </Show>
    </>
  );
}

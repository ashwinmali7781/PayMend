import { SignInButton } from "@clerk/react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function SignInScreen() {
  return (
    <div className="signin-screen">
      <ThemeToggle className="signin-theme-toggle" />
      <div className="signin-card">
        <div className="signin-badge">₹</div>
        <div className="eyebrow">PayMend · Revenue Recovery Agent</div>
        <h1>Sign in to continue</h1>
        <p className="subtitle">
          Each merchant's recovery dashboard is private to their account. Sign in to view
          failed-payment recovery, checkout drop-off recovery, and the audit trail.
        </p>
        <SignInButton mode="modal">
          <button className="btn btn-primary">Sign in</button>
        </SignInButton>
      </div>
    </div>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { dark } from "@clerk/themes";
import App from "./App.jsx";
import { ThemeProvider, useTheme } from "./lib/ThemeContext.jsx";
import { CLERK_ENABLED, CLERK_PUBLISHABLE_KEY } from "./lib/clerkConfig.js";
import "./index.css";

// Reads the shared theme and hands Clerk's own modal/widgets a matching
// appearance, so "dark mode" actually covers Clerk's UI too, not just ours.
function ClerkWithTheme({ children }) {
  const { theme } = useTheme();
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
    >
      {children}
    </ClerkProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

// ThemeProvider wraps everything, including ClerkProvider, so both the
// pre-auth sign-in screen and Clerk's own components can read/toggle the
// same theme. Only wrap in ClerkProvider when a real publishable key is
// present at build time - otherwise the app runs with no auth gate at all.
root.render(
  <React.StrictMode>
    <ThemeProvider>
      {CLERK_ENABLED ? (
        <ClerkWithTheme>
          <App />
        </ClerkWithTheme>
      ) : (
        <App />
      )}
    </ThemeProvider>
  </React.StrictMode>
);

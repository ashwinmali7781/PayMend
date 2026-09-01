import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { registerTokenGetter } from "../lib/apiClient.js";

// Only ever mounted when CLERK_ENABLED is true (see App.jsx), so it's
// always inside a <ClerkProvider> when it renders. Keeps every fetch call
// site free of auth plumbing - they just call apiFetch() and this handles
// getting a fresh token onto every request.
export default function AuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    registerTokenGetter(getToken);
  }, [getToken]);

  return null;
}

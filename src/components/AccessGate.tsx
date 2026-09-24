import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAccess } from "../lib/access";
import { ADMIN_EVENT, isAdminSession } from "../lib/adminAuth";
import { Paywall } from "./Paywall";

/**
 * Route guard for the workspace.
 *
 *   signed out            → /login
 *   trial or paid plan    → the app
 *   trial ended, no plan  → the paywall (nothing else is reachable)
 */
export function AccessGate({ children }: { children: React.ReactNode }) {
  const { signedIn, hasAccess } = useAccess();
  if (!signedIn) return <Navigate to="/login" replace />;
  if (!hasAccess) return <Paywall />;
  return <>{children}</>;
}

/** Route guard for the hidden owner console. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(() => isAdminSession());

  useEffect(() => {
    const sync = () => setAllowed(isAdminSession());
    sync();
    document.addEventListener(ADMIN_EVENT, sync);
    window.addEventListener("storage", sync);
    const id = window.setInterval(sync, 60000);
    return () => {
      document.removeEventListener(ADMIN_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.clearInterval(id);
    };
  }, []);

  if (!allowed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

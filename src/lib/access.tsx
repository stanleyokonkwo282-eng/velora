/**
 * Account session + entitlement: the 7-day free trial, the subscription that
 * follows it, and the payments behind it.
 *
 * HOW ACCESS WORKS
 *   1. A visitor signs in → `trialStartedAt` is stamped and they get
 *      TRIAL_DAYS of full access. No card required.
 *   2. The workspace shows a live countdown. Under two days it turns amber.
 *   3. When the trial ends with no subscription, `mode` flips to "locked" and
 *      AccessGate replaces the workspace with the paywall until a Paystack
 *      payment succeeds.
 *   4. A confirmed payment sets `status: "active"` and `renewsAt`, and every
 *      receipt is kept in `payments` for the billing screen.
 *
 * NOTE: this record lives in localStorage, which is the right call for a
 * front-end build. Real enforcement belongs on the server (see README), where a
 * Paystack webhook is the source of truth rather than the browser.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  TRIAL_DAYS,
  planName,
  type BillingCycle,
  type CurrencyCode,
  type PlanId,
} from "./plans";

export const ACCESS_KEY = "velora.access.v1";
export const SESSION_KEY = "velora.session.v1";
/** Broadcast so every hook re-reads when the session changes. */
export const AUTH_EVENT = "velora:auth";

export type AccessMode = "anonymous" | "trialing" | "active" | "locked";

export interface AccountSession {
  email: string;
  name: string;
  createdAt: string;
}

export interface PaymentRecord {
  reference: string;
  planId: PlanId;
  cycle: BillingCycle;
  currency: CurrencyCode;
  /** Whole units, for display. */
  amount: number;
  amountMinor: number;
  paidAt: string;
  verified: boolean;
  verificationMode: "server" | "unconfigured";
  note: string;
}

export interface AccessRecord {
  trialStartedAt: string;
  trialEndsAt: string;
  status: "trialing" | "active" | "canceled";
  planId?: PlanId;
  cycle?: BillingCycle;
  activatedAt?: string;
  renewsAt?: string;
  canceledAt?: string;
  payments: PaymentRecord[];
  /** How many times an administrator extended this trial. */
  trialExtensions: number;
  /** Whose record this is — a different sign-in starts a fresh trial. */
  ownerEmail?: string;
}

export interface AccessState {
  session: AccountSession | null;
  record: AccessRecord | null;
  mode: AccessMode;
  signedIn: boolean;
  /** True while trialing or on a paid plan — i.e. the workspace is usable. */
  hasAccess: boolean;
  daysLeft: number;
  hoursLeft: number;
  msLeft: number;
  /** 0 → 1, how much of the trial has been consumed. */
  trialUsed: number;
  trialDays: number;
  planLabel: string;
  renewsAt?: string;
  cycle?: BillingCycle;
  payments: PaymentRecord[];
}

export interface ActivateOptions {
  planId: PlanId;
  cycle: BillingCycle;
  currency: CurrencyCode;
  amount: number;
  amountMinor: number;
  reference: string;
  verified: boolean;
  verificationMode: "server" | "unconfigured";
  note?: string;
  paidAt?: string;
}

export interface AccessContextValue extends AccessState {
  signIn: (email: string, name: string) => AccountSession;
  signOut: () => void;
  activate: (options: ActivateOptions) => PaymentRecord;
  cancelRenewal: () => void;
  extendTrial: (days: number) => void;
  grantAccess: (planId: PlanId, cycle: BillingCycle, days: number) => void;
  resetAccess: () => void;
  clearPayments: () => void;
  refresh: () => void;
}

const PERIOD_DAYS: Record<BillingCycle, number> = { monthly: 30, annual: 365 };

/* ------------------------------------------------------------- storage ---- */

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const store = storage();
  if (!store) return;
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode failures */
  }
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function newTrialRecord(now = new Date()): AccessRecord {
  return {
    trialStartedAt: now.toISOString(),
    trialEndsAt: addDays(now, TRIAL_DAYS).toISOString(),
    status: "trialing",
    payments: [],
    trialExtensions: 0,
  };
}

function loadSession(): AccountSession | null {
  const session = readJson<AccountSession>(SESSION_KEY);
  if (!session?.email) return null;
  return session;
}

function loadRecord(): AccessRecord | null {
  return readJson<AccessRecord>(ACCESS_KEY);
}

export function deriveMode(
  session: AccountSession | null,
  record: AccessRecord | null,
  now: number
): AccessMode {
  if (!session) return "anonymous";
  if (record?.status === "active" && record.renewsAt) {
    return new Date(record.renewsAt).getTime() > now ? "active" : "locked";
  }
  if (record?.trialEndsAt && new Date(record.trialEndsAt).getTime() > now) return "trialing";
  return "locked";
}

/** "4 days 6 hours left" · "2 hours 14 minutes left" · "ended" */
export function describeRemaining(msLeft: number): string {
  if (msLeft <= 0) return "ended";
  const minutes = Math.floor(msLeft / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} ${hours}h left`;
  if (hours >= 1) return `${hours}h ${mins}m left`;
  return `${mins} minute${mins === 1 ? "" : "s"} left`;
}

/* ------------------------------------------------------------ provider ---- */

const Ctx = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AccountSession | null>(() => loadSession());
  const [record, setRecord] = useState<AccessRecord | null>(() => loadRecord());
  const [, setTick] = useState(0);

  const refresh = useCallback(() => {
    setSession(loadSession());
    setRecord(loadRecord());
    setTick((t) => t + 1);
  }, []);

  const persistRecord = useCallback((next: AccessRecord | null) => {
    writeJson(ACCESS_KEY, next);
    setRecord(next);
    setTick((t) => t + 1);
  }, []);

  /* Keep every tab, and every panel, honest about the current entitlement. */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (
        !event.key ||
        [SESSION_KEY, ACCESS_KEY, "velora.auth", "velora.admin.session.v1"].includes(event.key)
      ) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener(AUTH_EVENT, refresh);
    document.addEventListener("velora:admin", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener(AUTH_EVENT, refresh);
      document.removeEventListener("velora:admin", refresh);
    };
  }, [refresh]);

  /* A slow heartbeat so the countdown ticks and the lock engages on its own. */
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const signIn = useCallback(
    (email: string, name: string): AccountSession => {
      const now = new Date();
      const cleanEmail = email.trim().toLowerCase();
      const next: AccountSession = {
        email: cleanEmail,
        name: name.trim() || cleanEmail.split("@")[0],
        createdAt: now.toISOString(),
      };
      writeJson(SESSION_KEY, next);

      const existing = loadRecord();
      const sameOwner = !existing || !existing.ownerEmail || existing.ownerEmail === cleanEmail;
      persistRecord(
        sameOwner && existing ? existing : { ...newTrialRecord(now), ownerEmail: cleanEmail }
      );

      try {
        storage()?.setItem("velora.auth", "1"); // legacy flag kept in sync
      } catch {
        /* ignore */
      }
      setSession(next);
      if (typeof document !== "undefined") document.dispatchEvent(new Event(AUTH_EVENT));
      return next;
    },
    [persistRecord]
  );

  const signOut = useCallback(() => {
    writeJson(SESSION_KEY, null);
    try {
      storage()?.removeItem("velora.auth");
    } catch {
      /* ignore */
    }
    setSession(null);
    if (typeof document !== "undefined") document.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const activate = useCallback(
    (options: ActivateOptions): PaymentRecord => {
      const paidAt = options.paidAt ?? new Date().toISOString();
      const payment: PaymentRecord = {
        reference: options.reference,
        planId: options.planId,
        cycle: options.cycle,
        currency: options.currency,
        amount: options.amount,
        amountMinor: options.amountMinor,
        paidAt,
        verified: options.verified,
        verificationMode: options.verificationMode,
        note:
          options.note ??
          (options.verified
            ? "Confirmed against Paystack."
            : "Recorded locally. Not yet confirmed against Paystack."),
      };

      const base = loadRecord() ?? newTrialRecord();
      persistRecord({
        ...base,
        status: "active",
        planId: options.planId,
        cycle: options.cycle,
        activatedAt: paidAt,
        renewsAt: addDays(new Date(paidAt), PERIOD_DAYS[options.cycle]).toISOString(),
        canceledAt: undefined,
        payments: [payment, ...base.payments].slice(0, 60),
      });
      return payment;
    },
    [persistRecord]
  );

  const cancelRenewal = useCallback(() => {
    const base = loadRecord();
    if (!base) return;
    persistRecord({ ...base, canceledAt: new Date().toISOString() });
  }, [persistRecord]);

  const extendTrial = useCallback(
    (days: number) => {
      const now = new Date();
      const base = loadRecord() ?? newTrialRecord(now);
      const currentEnd = new Date(base.trialEndsAt);
      const from = currentEnd.getTime() > now.getTime() ? currentEnd : now;
      persistRecord({
        ...base,
        status: "trialing",
        trialEndsAt: addDays(from, days).toISOString(),
        trialExtensions: base.trialExtensions + 1,
      });
    },
    [persistRecord]
  );

  const grantAccess = useCallback(
    (planId: PlanId, cycle: BillingCycle, days: number) => {
      const now = new Date();
      const base = loadRecord() ?? newTrialRecord(now);
      const currentEnd = base.renewsAt ? new Date(base.renewsAt) : now;
      const from = currentEnd.getTime() > now.getTime() ? currentEnd : now;
      persistRecord({
        ...base,
        status: "active",
        planId,
        cycle,
        activatedAt: base.activatedAt ?? now.toISOString(),
        renewsAt: addDays(from, days).toISOString(),
        canceledAt: undefined,
      });
    },
    [persistRecord]
  );

  const resetAccess = useCallback(() => {
    const now = new Date();
    const email = loadSession()?.email;
    persistRecord({ ...newTrialRecord(now), ownerEmail: email });
  }, [persistRecord]);

  const clearPayments = useCallback(() => {
    const base = loadRecord();
    if (!base) return;
    persistRecord({ ...base, payments: [] });
  }, [persistRecord]);

  const value = useMemo<AccessContextValue>(() => {
    const now = Date.now();
    const mode = deriveMode(session, record, now);
    const trialDays = TRIAL_DAYS + (record?.trialExtensions ?? 0);
    const trialEndMs = record?.trialEndsAt ? new Date(record.trialEndsAt).getTime() : 0;
    const renewMs = record?.renewsAt ? new Date(record.renewsAt).getTime() : 0;

    let msLeft = 0;
    if (mode === "trialing") msLeft = Math.max(0, trialEndMs - now);
    else if (mode === "active") msLeft = Math.max(0, renewMs - now);

    const totalMs = trialDays * 24 * 60 * 60 * 1000;
    const trialUsed =
      mode === "trialing" && totalMs > 0
        ? Math.min(1, Math.max(0, 1 - msLeft / totalMs))
        : mode === "trialing"
        ? 0
        : 1;

    return {
      session,
      record,
      mode,
      signedIn: Boolean(session),
      hasAccess: mode === "trialing" || mode === "active",
      daysLeft: Math.floor(msLeft / (24 * 60 * 60 * 1000)),
      hoursLeft: Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
      msLeft,
      trialUsed,
      trialDays,
      planLabel:
        mode === "active"
          ? planName(record?.planId)
          : mode === "trialing"
          ? "Free trial"
          : "No active plan",
      renewsAt: record?.renewsAt,
      cycle: record?.cycle,
      payments: record?.payments ?? [],
      signIn,
      signOut,
      activate,
      cancelRenewal,
      extendTrial,
      grantAccess,
      resetAccess,
      clearPayments,
      refresh,
    };
  }, [
    session,
    record,
    signIn,
    signOut,
    activate,
    cancelRenewal,
    extendTrial,
    grantAccess,
    resetAccess,
    clearPayments,
    refresh,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccess(): AccessContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccess must be used inside <AccessProvider>");
  return ctx;
}

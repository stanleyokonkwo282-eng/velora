/**
 * Paystack integration — browser side.
 *
 * TWO KEYS, TWO PLACES:
 *   • pk_…  public key  → lives in this front end (.env → VITE_PAYSTACK_PUBLIC_KEY).
 *                          It can only create a checkout, never move money.
 *   • sk_…  secret key  → lives on YOUR SERVER ONLY. It must never be added to a
 *                          VITE_ variable, because Vite inlines those into the
 *                          JavaScript bundle that every visitor downloads.
 *
 * The browser collects a payment, then your server confirms it with the secret
 * key at https://api.paystack.co/transaction/verify/:reference. Point Velora at
 * that endpoint with VITE_PAYSTACK_VERIFY_URL (see README for the 12-line
 * Express example).
 */

import type { CurrencyCode, PlanId } from "./plans";

export const PAYSTACK_INLINE_SRC = "https://js.paystack.co/v2/inline.js";

export const PAYSTACK_PUBLIC_KEY = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
export const PAYSTACK_VERIFY_URL = (import.meta.env.VITE_PAYSTACK_VERIFY_URL || "").trim();

export type PublicKeyMode = "live" | "test" | "missing";

export function publicKeyMode(): PublicKeyMode {
  if (PAYSTACK_PUBLIC_KEY.startsWith("pk_live_")) return "live";
  if (PAYSTACK_PUBLIC_KEY.startsWith("pk_test_")) return "test";
  return "missing";
}

export function isCheckoutConfigured(): boolean {
  return publicKeyMode() !== "missing";
}

export function isServerVerificationConfigured(): boolean {
  return /^https?:\/\//i.test(PAYSTACK_VERIFY_URL);
}

export type PaystackErrorCode =
  | "key-missing"
  | "script-failed"
  | "canceled"
  | "unknown";

export class PaystackError extends Error {
  code: PaystackErrorCode;

  constructor(code: PaystackErrorCode, message: string) {
    super(message);
    this.name = "PaystackError";
    this.code = code;
  }
}

export interface PaystackTransaction {
  reference: string;
  status?: string;
  message?: string;
  trans?: string;
  trxref?: string;
}

interface PaystackPopupHandle {
  cancel: () => void;
  getStatus?: () => unknown;
}

interface PaystackPopupInstance {
  newTransaction: (options: Record<string, unknown>) => PaystackPopupHandle;
}

type PaystackPopConstructor = new () => PaystackPopupInstance;

declare global {
  interface Window {
    PaystackPop?: PaystackPopConstructor;
  }
}

let loader: Promise<void> | null = null;

/**
 * Loads js.paystack.co/v2/inline.js once, on demand, so the checkout script never
 * slows down the first paint of the landing page.
 */
export function loadPaystackInline(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new PaystackError("script-failed", "Paystack requires a browser."));
  }
  if (window.PaystackPop) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const settle = () => {
      if (window.PaystackPop) {
        resolve();
      } else {
        loader = null;
        reject(
          new PaystackError("script-failed", "Paystack loaded but did not expose its checkout.")
        );
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_INLINE_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", settle);
      existing.addEventListener("error", () => {
        loader = null;
        reject(new PaystackError("script-failed", "Could not reach Paystack."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_INLINE_SRC;
    script.async = true;
    script.onload = settle;
    script.onerror = () => {
      loader = null;
      reject(
        new PaystackError(
          "script-failed",
          "Could not reach Paystack. Check your connection and try again."
        )
      );
    };
    document.head.appendChild(script);
  });

  return loader;
}

/* ------------------------------------------------------------- checkout --- */

export interface CheckoutRequest {
  email: string;
  /** Amount in the smallest unit: kobo, cents or pesewas. */
  amountMinor: number;
  currency: CurrencyCode;
  reference: string;
  planId: PlanId;
  /** Paystack plan code (PLN_…) to start a real recurring subscription. */
  planCode?: string;
  fullName?: string;
  phone?: string;
  cycle?: "monthly" | "annual";
  metadata?: Record<string, unknown>;
}

function normalizeTransaction(
  transaction: Partial<PaystackTransaction> | undefined,
  fallbackReference: string
): PaystackTransaction {
  return {
    reference: String(transaction?.reference ?? transaction?.trxref ?? fallbackReference),
    status: transaction?.status,
    message: transaction?.message,
    trans: transaction?.trans,
    trxref: transaction?.trxref,
  };
}

/**
 * Opens the Paystack popup and resolves when the customer completes a charge.
 *
 * We deliberately do not restrict `channels`: Paystack then offers whatever is
 * enabled for the account and currency (card, USSD, bank transfer, M-PESA,
 * mobile money, EFT), which is what a global customer base needs.
 */
export async function openPaystackCheckout(
  req: CheckoutRequest
): Promise<PaystackTransaction> {
  if (!isCheckoutConfigured()) {
    throw new PaystackError(
      "key-missing",
      "Checkout is not configured. Add your Paystack public key to .env as VITE_PAYSTACK_PUBLIC_KEY."
    );
  }

  await loadPaystackInline();
  const PaystackPop = window.PaystackPop;
  if (!PaystackPop) {
    throw new PaystackError("script-failed", "Paystack checkout is unavailable right now.");
  }

  const popup = new PaystackPop();
  const parts = (req.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  const firstname = parts[0];
  const lastname = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

  return new Promise<PaystackTransaction>((resolve, reject) => {
    try {
      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: req.email,
        amount: req.amountMinor,
        currency: req.currency,
        ref: req.reference,
        ...(req.planCode ? { plan: req.planCode } : {}),
        ...(firstname ? { firstname } : {}),
        ...(lastname ? { lastname } : {}),
        ...(req.phone ? { phone: req.phone } : {}),
        metadata: {
          ...(req.metadata ?? {}),
          product: "Velora social operating system",
          plan_id: req.planId,
          billing_cycle: req.cycle ?? "monthly",
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: req.planId },
            {
              display_name: "Billing cycle",
              variable_name: "cycle",
              value: req.cycle ?? "monthly",
            },
          ],
        },
        onSuccess: (transaction: PaystackTransaction) =>
          resolve(normalizeTransaction(transaction, req.reference)),
        onCancel: () =>
          reject(
            new PaystackError("canceled", "Checkout was closed before the payment completed.")
          ),
      });
    } catch (error) {
      reject(
        error instanceof PaystackError
          ? error
          : new PaystackError("unknown", "Paystack could not open the checkout.")
      );
    }
  });
}

/* ---------------------------------------------------------- verification --- */

export interface VerificationResult {
  /** True only when a trusted source (your server) confirmed the charge. */
  verified: boolean;
  mode: "server" | "unconfigured";
  message: string;
  amountMinor?: number;
  currency?: string;
  paidAt?: string;
  reference: string;
}

/**
 * Server-side verification. Your endpoint calls
 *   GET https://api.paystack.co/transaction/verify/:reference
 * with `Authorization: Bearer sk_live_…` and returns Paystack's `data` object.
 *
 * While VITE_PAYSTACK_VERIFY_URL is empty this returns mode "unconfigured", and
 * Velora activates the plan from the popup's own success callback while marking
 * the receipt as unverified. Wire the endpoint before you take real money.
 */
export async function verifyTransaction(reference: string): Promise<VerificationResult> {
  if (!isServerVerificationConfigured()) {
    return {
      verified: false,
      mode: "unconfigured",
      reference,
      message:
        "No verification endpoint is configured, so this charge was not confirmed against Paystack. Set VITE_PAYSTACK_VERIFY_URL before launch.",
    };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(PAYSTACK_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          status?: boolean;
          message?: string;
          data?: { status?: string; amount?: number; currency?: string; paid_at?: string };
        }
      | null;

    const data = payload?.data;
    const paid = data?.status === "success";

    return {
      verified: Boolean(response.ok && paid),
      mode: "server",
      reference,
      amountMinor: data?.amount,
      currency: data?.currency,
      paidAt: data?.paid_at,
      message: paid
        ? "Paystack confirmed this payment."
        : payload?.message || "Paystack has not confirmed this reference yet.",
    };
  } catch (error) {
    return {
      verified: false,
      mode: "server",
      reference,
      message:
        error instanceof DOMException && error.name === "AbortError"
          ? "Verification timed out. Try again in a moment."
          : "We could not reach the verification service.",
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

/* ------------------------------------------------------------ reference --- */

/** Human-readable, collision-resistant reference sent to Paystack. */
export function newPaymentReference(planId: PlanId): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VLR-${planId.toUpperCase()}-${stamp}${random}`;
}

import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useAccess, type PaymentRecord } from "../lib/access";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  PLANS,
  SUPPORT_EMAIL,
  annualSavingPercent,
  formatMoney,
  monthlyEquivalent,
  planById,
  priceFor,
  toMinorUnits,
  type BillingCycle,
  type CurrencyCode,
  type PlanId,
} from "../lib/plans";
import {
  PaystackError,
  isCheckoutConfigured,
  isServerVerificationConfigured,
  newPaymentReference,
  openPaystackCheckout,
  publicKeyMode,
  verifyTransaction,
} from "../lib/paystack";
import { Button } from "./UI";
import { cn } from "../lib/utils";

/**
 * Upgrade / renewal flow.
 *
 * The charge is created in the browser with the public key, then (when
 * VITE_PAYSTACK_VERIFY_URL is configured) the reference is confirmed by your
 * server — the only place the secret key should ever live.
 */
export function Checkout({
  defaultPlanId = "growth",
  defaultCycle = "monthly",
  showPlanPicker = true,
  onPaid,
  className,
}: {
  defaultPlanId?: PlanId;
  defaultCycle?: BillingCycle;
  showPlanPicker?: boolean;
  onPaid?: (payment: PaymentRecord) => void;
  className?: string;
}) {
  const { session, activate } = useAccess();
  const [planId, setPlanId] = useState<PlanId>(defaultPlanId);
  const [cycle, setCycle] = useState<BillingCycle>(defaultCycle);
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);
  const [referenceInput, setReferenceInput] = useState("");
  const [checking, setChecking] = useState(false);

  const plan = useMemo(() => planById(planId) ?? PLANS[0], [planId]);
  const amount = priceFor(planId, cycle, currency);
  const configured = isCheckoutConfigured();
  const keyMode = publicKeyMode();
  const saving = annualSavingPercent(planId, currency);

  async function settle(reference: string) {
    setStatus("idle");
    setMessage("Confirming your payment with Paystack…");
    setBusy(true);
    try {
      const verification = await verifyTransaction(reference);
      const payment = activate({
        planId,
        cycle,
        currency,
        amount,
        amountMinor: toMinorUnits(amount, currency),
        reference,
        verified: verification.verified,
        verificationMode: verification.mode === "server" ? "server" : "unconfigured",
        note: verification.verified
          ? verification.message
          : `${verification.message} Reference ${reference} is recorded for review.`,
      });
      setReceipt(payment);
      setStatus("done");
      setMessage(
        verification.verified
          ? "Payment confirmed. Your workspace is unlocked."
          : "Payment recorded. Paystack has not confirmed it yet — we kept the reference and will verify it."
      );
      onPaid?.(payment);
    } finally {
      setBusy(false);
    }
  }

  async function payNow() {
    if (!session) {
      setStatus("error");
      setMessage("Sign in first so we know which workspace to unlock.");
      return;
    }
    if (plan.contactOnly) {
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Velora Enterprise enquiry`;
      return;
    }
    if (!configured) {
      setStatus("error");
      setMessage(
        "Checkout is not configured yet. Add VITE_PAYSTACK_PUBLIC_KEY to your .env file and restart the dev server."
      );
      return;
    }

    const reference = newPaymentReference(planId);
    setStatus("idle");
    setMessage("Opening secure Paystack checkout…");
    setBusy(true);
    try {
      const transaction = await openPaystackCheckout({
        email: session.email,
        fullName: session.name,
        amountMinor: toMinorUnits(amount, currency),
        currency,
        reference,
        planId,
        cycle,
        planCode: plan.planCodes?.[cycle],
      });
      await settle(transaction.reference);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof PaystackError
          ? error.message
          : "Something interrupted the checkout. No charge was completed — please try again."
      );
      setBusy(false);
    }
  }

  async function checkReference() {
    const reference = referenceInput.trim();
    if (!reference) return;
    setChecking(true);
    try {
      await settle(reference);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className={cn("space-y-5", className)}>
      {showPlanPicker && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((option) => {
            const active = option.id === planId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlanId(option.id)}
                aria-pressed={active}
                className={cn(
                  "panel relative overflow-hidden p-4 text-left transition",
                  active ? "ring-2 ring-azure-400/70" : "hover:-translate-y-0.5"
                )}
              >
                {option.popular && (
                  <span className="absolute right-3 top-3 rounded-full bg-azure-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure-100">
                    Popular
                  </span>
                )}
                <div className="text-sm font-semibold">{option.name}</div>
                <div className="mt-1 text-xs text-slate-400">{option.audience}</div>
                <div className="mt-3 font-serif text-2xl text-white">
                  {option.contactOnly
                    ? "Let's talk"
                    : formatMoney(option.prices[currency][cycle], currency)}
                </div>
                <div className="text-[11px] text-slate-400">
                  {option.contactOnly
                    ? "Custom pricing, invoiced"
                    : cycle === "annual"
                    ? `per year · ${monthlyEquivalent(option.id, "annual", currency)}/mo`
                    : "per month · billed monthly"}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            {(["monthly", "annual"] as BillingCycle[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCycle(option)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition",
                  cycle === option
                    ? "bg-white/90 text-midnight-700"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
            Paying from
            <select
              className="field !min-h-9 !w-auto !py-1 text-xs"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} · {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-azure-300">
              {plan.name} · {cycle}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-4xl text-white">
                {plan.contactOnly ? "Custom" : formatMoney(amount, currency)}
              </span>
              {!plan.contactOnly && (
                <span className="text-sm text-slate-400">
                  /{cycle === "annual" ? "year" : "month"}
                </span>
              )}
            </div>
            {cycle === "annual" && saving > 0 && (
              <div className="mt-1 text-xs font-semibold text-emerald-300">
                Two months free · saves {saving}%
              </div>
            )}
          </div>

          <Button size="lg" onClick={payNow} disabled={busy}>
            {busy ? (
              <>
                <RefreshCw className="animate-spin" size={15} /> Working…
              </>
            ) : (
              <>
                <CreditCard size={15} />
                {plan.contactOnly ? "Talk to sales" : `Pay ${formatMoney(amount, currency)}`}
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Lock size={12} /> Payments handled by Paystack
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} /> Card details never touch Velora
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck size={12} /> Cancel anytime
          </span>
          {keyMode === "test" && (
            <span className="chip border-amber-300/40 text-amber-200">Test key in use</span>
          )}
        </div>

        {!configured && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            <div>
              <b>Checkout is offline.</b> Add <code>VITE_PAYSTACK_PUBLIC_KEY</code> to{" "}
              <code>.env</code> and restart. Keep your <code>sk_live_…</code> secret key on your
              server only — never in this front end.
            </div>
          </div>
        )}

        {configured && !isServerVerificationConfigured() && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            <div>
              Payments are accepted, but no verification endpoint is set. Add{" "}
              <code>VITE_PAYSTACK_VERIFY_URL</code> so your server can confirm every charge with the
              secret key before access is granted.
            </div>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={cn(
              "mt-4 rounded-xl border p-3 text-xs",
              status === "done"
                ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                : status === "error"
                ? "border-rose-300/30 bg-rose-500/10 text-rose-100"
                : "border-white/10 bg-white/5 text-slate-200"
            )}
          >
            {message}
          </div>
        )}

        {receipt && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="font-semibold text-white">Receipt</span>
              <span className="break-anywhere font-mono text-[11px]">{receipt.reference}</span>
              {receipt.verified ? (
                <span className="chip border-emerald-300/40 text-emerald-200">Verified</span>
              ) : (
                <span className="chip border-amber-300/40 text-amber-200">Pending review</span>
              )}
            </div>
            <div className="mt-2 text-slate-400">
              {receipt.currency} · {formatMoney(receipt.amount, receipt.currency)} ·{" "}
              {new Date(receipt.paidAt).toLocaleString()}
            </div>
          </div>
        )}

        {session && (
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="text-xs font-semibold text-slate-200">
              Paid somewhere else? Restore your access
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Paste the Paystack reference from your receipt and we&apos;ll check it.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                className="field flex-1"
                placeholder="VLR-GROWTH-XXXXXXXX"
                value={referenceInput}
                onChange={(event) => setReferenceInput(event.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              <Button
                variant="secondary"
                onClick={checkReference}
                disabled={checking || !referenceInput.trim()}
              >
                {checking ? "Checking…" : "Check reference"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

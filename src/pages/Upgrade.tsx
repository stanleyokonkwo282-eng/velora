import React, { useState } from "react";
import { ArrowLeft, BadgeCheck, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { describeRemaining, useAccess } from "../lib/access";
import { TRIAL_DAYS } from "../lib/plans";
import { Checkout } from "../components/Checkout";
import { PageHeader } from "../components/UI";

/**
 * In-workspace billing. Trial users land here from the ribbon / pill; locked
 * accounts never see it because <AccessGate> shows the paywall instead.
 */
export function Upgrade() {
  const { mode, msLeft, trialDays } = useAccess();
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist transition hover:text-white"
      >
        <ArrowLeft size={13} /> Back to command center
      </Link>

      <div className="mt-4">
        <PageHeader
          kicker={mode === "active" ? "Billing · active plan" : `Billing · ${TRIAL_DAYS}-day free trial`}
          title={mode === "active" ? "Your plan is switched on." : "Keep Velora after your trial."}
          subtitle={
            mode === "active"
              ? "Renew, change plan or currency below. Every receipt is kept on your billing record."
              : `You are on day ${Math.min(trialDays, Math.max(1, trialDays - Math.floor(msLeft / 86400000)))} of ${trialDays} — ${describeRemaining(msLeft)} left. Pay now and the plan starts the moment your trial ends.`
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="space-y-4">
          <div className="panel p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck size={15} className="text-azure-300" /> Why teams stay on Velora
            </div>
            <ul className="mt-3 space-y-2 text-sm text-mist">
              {[
                "Queue, approvals and publishing never sleep",
                "Your OAuth keys stay sealed in your own vault",
                "Cancel anytime — access runs to the end of the paid period",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <BadgeCheck size={14} className="mt-0.5 shrink-0 text-emerald-300" /> {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Lock size={13} className="text-azure-300" /> Payments by Paystack
            </div>
            <p className="mt-1.5 leading-relaxed">
              Card details are typed into Paystack's secure popup — Velora never sees or stores
              them. Pay in NGN, USD, GHS, KES or ZAR; monthly or annual.
            </p>
          </div>
          {done && (
            <div
              role="status"
              className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-xs text-emerald-100"
            >
              Payment received — your workspace access has been extended.
            </div>
          )}
        </div>

        <Checkout onPaid={() => setDone(true)} />
      </div>
    </div>
  );
}

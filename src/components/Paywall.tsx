import React from "react";
import { Check, Lock, LogOut, Mail, ShieldCheck } from "lucide-react";
import { describeRemaining, useAccess } from "../lib/access";
import { SUPPORT_EMAIL, planById } from "../lib/plans";
import { Checkout } from "./Checkout";
import { Button } from "./UI";

/**
 * Shown instead of the workspace once a trial has ended with no active plan.
 * Nothing behind it is reachable until a payment is confirmed.
 */
export function Paywall() {
  const { session, record, signOut, payments } = useAccess();
  const lastPlan = planById(record?.planId);

  const kept = [
    "Every scheduled post, calendar entry and draft",
    "Your connected accounts and vaulted OAuth keys",
    "Approvals, client rooms, inbox history and analytics",
    "Brand voices, media library and evergreen loops",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex items-center gap-3">
          <img
            src="/logo-mark.png"
            alt="Velora"
            className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20"
          />
          <div>
            <div className="font-semibold tracking-tight">Velora</div>
            <div className="text-[11px] text-slate-400">The social operating system</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hidden items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-mist transition hover:bg-white/10 sm:inline-flex"
            >
              <Mail size={13} /> Talk to us
            </a>
            <Button variant="secondary" size="sm" onClick={signOut}>
              <LogOut size={13} /> Sign out
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <div className="chip chip-accent">
              <Lock size={12} /> Trial ended
            </div>
            <h1 className="display-lg mt-4 text-white">
              Your 7-day trial has ended. Your workspace is exactly where you left it.
            </h1>
            <p className="lede mt-4">
              {session?.name ? `${session.name.split(" ")[0]}, ` : ""}
              nothing was deleted. Pick a plan below to switch the queue back on and keep publishing
              to every connected network.
            </p>

            <div className="mt-6 space-y-2">
              {kept.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-mist">
                  <Check size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>

            <div className="panel mt-6 p-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck size={14} className="text-azure-300" /> You are in control
              </div>
              <p className="mt-1.5">
                Monthly plans can be cancelled at any time from Settings — access simply runs to the
                end of the paid period. Payments are processed by Paystack; Velora never stores your
                card.
              </p>
            </div>

            {record && (
              <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="panel p-3">
                  <dt className="text-slate-400">Trial started</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {new Date(record.trialStartedAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="panel p-3">
                  <dt className="text-slate-400">Trial ended</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {new Date(record.trialEndsAt).toLocaleDateString()}
                    <span className="ml-1 font-normal text-slate-400">
                      ({describeRemaining(0)})
                    </span>
                  </dd>
                </div>
                <div className="panel p-3">
                  <dt className="text-slate-400">Last plan</dt>
                  <dd className="mt-1 font-semibold text-white">{lastPlan?.name ?? "Free trial"}</dd>
                </div>
                <div className="panel p-3">
                  <dt className="text-slate-400">Receipts on file</dt>
                  <dd className="mt-1 font-semibold text-white">{payments.length}</dd>
                </div>
              </dl>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Choose a plan</h2>
              <span className="text-xs text-slate-400">Switch on in seconds</span>
            </div>
            <Checkout defaultPlanId={record?.planId ?? "growth"} defaultCycle={record?.cycle ?? "monthly"} />
            <p className="mt-4 text-center text-[11px] text-slate-400">
              Need invoicing, procurement or a private deployment?{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-azure-200 underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

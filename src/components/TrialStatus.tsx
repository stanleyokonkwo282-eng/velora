import React from "react";
import { Clock3, Sparkles, TriangleAlert } from "lucide-react";
import { describeRemaining, useAccess } from "../lib/access";
import { cn } from "../lib/utils";

/**
 * Live entitlement feedback: a trial countdown in the header, a ribbon when the
 * clock is nearly out, and a plan chip once the workspace is paid for.
 */
export function AccessPill({ onUpgrade }: { onUpgrade?: () => void }) {
  const { mode, msLeft, daysLeft, hoursLeft, planLabel, renewsAt } = useAccess();

  if (mode === "trialing") {
    const urgent = daysLeft < 2;
    return (
      <button
        type="button"
        onClick={onUpgrade}
        className={cn(
          "group hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:inline-flex",
          urgent
            ? "border-amber-300/40 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25"
            : "border-white/12 bg-white/6 text-mist hover:bg-white/12"
        )}
        title="Your free trial"
      >
        <Clock3 size={13} />
        <span>Free trial · {describeRemaining(msLeft)}</span>
        <span className="text-azure-200 underline decoration-dotted">Upgrade</span>
      </button>
    );
  }

  if (mode === "active") {
    return (
      <span
        className="hidden items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-500/12 px-3 py-1.5 text-xs font-semibold text-emerald-100 sm:inline-flex"
        title={renewsAt ? `Renews ${new Date(renewsAt).toLocaleDateString()}` : undefined}
      >
        <Sparkles size={13} />
        {planLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onUpgrade}
      className="hidden items-center gap-2 rounded-full border border-rose-300/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-100 sm:inline-flex"
    >
      <TriangleAlert size={13} /> Trial ended · Upgrade
    </button>
  );
}

/** Amber ribbon across the workspace when fewer than two trial days remain. */
export function TrialRibbon({ onUpgrade }: { onUpgrade?: () => void }) {
  const { mode, msLeft, daysLeft, hoursLeft, trialUsed, trialDays } = useAccess();
  if (mode !== "trialing") return null;

  const critical = daysLeft < 1;
  const leave = daysLeft < 2;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:gap-4 sm:px-6",
        leave
          ? "border-amber-300/25 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent text-amber-50"
          : "border-white/10 bg-white/[0.04] text-mist"
      )}
    >
      <div className="flex items-center gap-2 font-semibold">
        <Clock3 size={13} />
        {leave ? "Your free trial is nearly over" : "Free trial in progress"}
        <span className="font-normal text-white/80">
          · {describeRemaining(msLeft)} ({Math.max(0, trialDays - daysLeft)} of {trialDays} days used
          {hoursLeft ? `, ${hoursLeft}h` : ""})
        </span>
      </div>

      <div className="trial-bar w-full sm:max-w-[220px] sm:ml-auto">
        <span
          className={cn(critical ? "is-critical" : leave ? "is-warning" : "")}
          style={{ width: `${Math.min(100, Math.max(3, trialUsed * 100))}%` }}
        />
      </div>

      <button
        type="button"
        onClick={onUpgrade}
        className="whitespace-nowrap rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-midnight-700 transition hover:bg-white"
      >
        Keep my workspace
      </button>
    </div>
  );
}

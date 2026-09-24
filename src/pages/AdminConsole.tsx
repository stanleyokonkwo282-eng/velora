import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Crown, LogOut, Plus, Receipt, RotateCcw,
  Clock3, ShieldCheck, Trash2,
} from "lucide-react";
import { useAccess } from "../lib/access";
import { ADMIN_EMAIL, adminSessionMinutesLeft, signOutAdmin } from "../lib/adminAuth";
import { PLANS, formatMoney, planName, type BillingCycle, type PlanId } from "../lib/plans";
import { Button, Card, Field, PageHeader } from "../components/UI";

export function AdminConsole() {
  const nav = useNavigate();
  const a = useAccess();
  const [days, setDays] = useState(7);
  const [planId, setPlanId] = useState<PlanId>("growth");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [grantDays, setGrantDays] = useState(30);
  const [ack, setAck] = useState<string | null>(null);
  const info = useMemo(() => {
    if (!a.record) return null;
    const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");
    return {
      started: fmt(a.record.trialStartedAt),
      ends: fmt(a.record.trialEndsAt),
      activated: fmt(a.record.activatedAt),
      renews: fmt(a.record.renewsAt),
      plan: planName(a.record.planId),
    };
  }, [a.record]);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <button type="button" onClick={() => nav("/app")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist hover:text-white">
          <ArrowLeft size={13} /> Back to workspace
        </button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <PageHeader kicker="Owner console" title="Workspace ledger"
            subtitle={
              a.session
                ? `Signed in as ${a.session.email} · ${a.mode} · renews ${info?.renews ?? "—"}`
                : `No workspace signed in · ${a.mode}`
            } />
          <Button
            variant="secondary" size="sm"
            onClick={() => {
              signOutAdmin();
              nav("/login");
            }}
          >
            <LogOut size={13} /> Lock console
          </Button>
        </div>
        <div className="panel mt-4 flex items-center gap-2 p-3 text-xs text-slate-200">
          <ShieldCheck size={14} className="shrink-0 text-emerald-300" />
          Owner gate {ADMIN_EMAIL} · admin session {adminSessionMinutesLeft()} min left.
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Crown size={15} className="text-amber-300" /> Account
            </div>
            <div className="mt-2 text-xs leading-relaxed text-slate-300">
              Plan: {info?.plan ?? "—"} · {a.mode}
              <br />Trial {info?.started ?? "—"} → {info?.ends ?? "—"}
              <br />Activated {info?.activated ?? "—"} · renews {info?.renews ?? "—"}
              <br />Extensions: {a.record?.trialExtensions ?? 0}
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Clock3 size={15} className="text-azure-300" /> Extend free trial
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input type="number" min={1} max={90} value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="field h-10 w-24" aria-label="Extra trial days" />
              <Button
                size="sm"
                onClick={() => {
                  const extra = Math.max(1, days || 1);
                  a.extendTrial(extra);
                  setAck(`Trial extended by ${extra} day(s).`);
                }}
              >
                <Plus size={13} /> Add days
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Courtesy extensions are tracked on this record.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <RotateCcw size={15} className="text-emerald-300" /> Repair access
            </div>
            <div className="mt-3 space-y-3">
              <Field label="Grant paid access (manual / bank transfer)">
                <div className="flex flex-wrap gap-2">
                  <select value={planId} onChange={(event) => setPlanId(event.target.value as PlanId)}
                    className="field h-10" aria-label="Plan">
                    {PLANS.filter((p) => !p.contactOnly).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <select value={cycle} onChange={(event) => setCycle(event.target.value as BillingCycle)}
                    className="field h-10" aria-label="Billing cycle">
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                  <input type="number" min={1} max={3650} value={grantDays}
                    onChange={(event) => setGrantDays(Number(event.target.value))}
                    className="field h-10 w-24" aria-label="Days of access" />
                  <Button
                    size="sm"
                    onClick={() => {
                      const total = Math.max(1, grantDays || 1);
                      a.grantAccess(planId, cycle, total);
                      setAck(`Granted ${planName(planId)} (${cycle}) for ${total} day(s).`);
                    }}
                  >Grant</Button>
                </div>
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => { a.resetAccess(); setAck("Fresh trial started."); }}>
                  Fresh trial
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { a.clearPayments(); setAck("Receipt history cleared."); }}>
                  <Trash2 size={13} /> Clear
                </Button>
              </div>
              {ack && <p className="text-[11px] text-emerald-200">{ack}</p>}
            </div>
          </Card>
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Receipt size={15} className="text-azure-300" /> Receipts ({a.payments.length})
          </div>
          {a.payments.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">No payments recorded on this browser yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="text-slate-400">
                    <th className="py-2 pr-3 font-semibold">Reference</th>
                    <th className="py-2 pr-3 font-semibold">Plan</th>
                    <th className="py-2 pr-3 font-semibold">Amount</th>
                    <th className="py-2 pr-3 font-semibold">Paid</th>
                    <th className="py-2 font-semibold">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {a.payments.map((p) => (
                    <tr key={p.reference} className="border-t border-white/10 text-slate-200">
                      <td className="py-2 pr-3 font-mono">{p.reference}</td>
                      <td className="py-2 pr-3">{planName(p.planId)} · {p.cycle}</td>
                      <td className="py-2 pr-3">{formatMoney(p.amount, p.currency)}</td>
                      <td className="py-2 pr-3">{new Date(p.paidAt).toLocaleString()}</td>
                      <td className="py-2">{p.verified ? "server" : "client-trust"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  ArrowRight,
  Check,
  Clock,
  PenLine,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { ANALYTICS, BEST_TIMES } from "../lib/data";
import { useStore } from "../lib/store";
import { Badge, Button, Card, PageHeader, Stat } from "../components/UI";
import { PlatformBadge } from "../lib/platforms";
import { fmt, formatWhen, rel } from "../lib/utils";

export function Dashboard() {
  const { posts, accounts, inbox, user, crisis } = useStore();
  const nav = useNavigate();
  const due = posts.filter((p) => p.status === "scheduled" || p.status === "pending_approval").slice(0, 5);
  const pending = posts.filter((p) => p.status === "pending_approval").length;
  const live = accounts.filter((a) => a.connected).length;
  const expiring = accounts.filter((a) => a.health === "expiring" || a.health === "expired");

  return (
    <div>
      <PageHeader
        kicker="Command"
        title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, ${user.name.split(" ")[0]}.`}
        subtitle="Atelier workspace · Africa/Lagos. Queue is healthy, two tokens want rotation, legal has one still on hold."
        actions={
          <>
            <Button variant="secondary" onClick={() => nav("/app/ai")}>
              <Sparkles size={14} /> Copilot
            </Button>
            <Button onClick={() => nav("/app/compose")}>
              <PenLine size={14} /> Compose
            </Button>
          </>
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Impressions · 14d" value={fmt(ANALYTICS.reduce((a, b) => a + b.impressions, 0))} delta="+12.4% vs prior" up />
        <Stat label="Engagement" value={fmt(ANALYTICS.reduce((a, b) => a + b.engagement, 0))} delta="+6.1%" up />
        <Stat label="Live accounts" value={`${live}`} delta={`${expiring.length} need attention`} up={expiring.length === 0} />
        <Stat label="Awaiting approval" value={`${pending}`} delta={crisis ? "Crisis pause on" : "On-time"} up={!crisis} />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-semibold">Reach & engagement</div>
              <div className="text-xs text-slate-500">All connected surfaces · last 14 days</div>
            </div>
            <Badge tone="blue">Live telemetry</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS}>
                <defs>
                  <linearGradient id="imp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="impressions" stroke="#1E40AF" fill="url(#imp)" strokeWidth={2} />
                <Area type="monotone" dataKey="engagement" stroke="#38BDF8" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Needs you</div>
          <div className="mt-4 space-y-3">
            {expiring.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-0.5 text-amber-600">
                  <AlertTriangle size={14} />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{a.accountName} · {a.handle}</div>
                  <div className="text-xs text-slate-500">OAuth {a.health}. Rotate keys or reconnect.</div>
                </div>
              </div>
            ))}
            {inbox.filter((i) => i.sla !== "ok").slice(0, 3).map((i) => (
              <div key={i.id} className="flex items-start gap-3">
                <div className="mt-0.5 text-rose-600">
                  <Clock size={14} />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{i.from}</div>
                  <div className="text-xs text-slate-500 line-clamp-2">{i.preview}</div>
                </div>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => nav("/app/inbox")}>
              Open inbox <ArrowRight size={12} />
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" pad={false}>
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-sm font-semibold">Upcoming queue</div>
            <button className="text-xs text-royal-700 font-medium" onClick={() => nav("/app/calendar")}>
              Calendar
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {due.map((p) => (
              <div key={p.id} className="px-5 py-3.5 flex items-start gap-4">
                <div className="w-36 shrink-0 text-xs text-slate-500 pt-0.5">{formatWhen(p.scheduledAt)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2">{p.content}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.platforms.map((pl) => (
                      <PlatformBadge key={pl} id={pl} connected />
                    ))}
                    <Badge tone={p.status === "pending_approval" ? "amber" : "blue"}>
                      {p.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs font-semibold text-royal-800">{p.virality}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Best time to post</div>
          <p className="text-xs text-slate-500 mt-1">Modelled on 90 days of your own engagement, WAT.</p>
          <div className="mt-4 space-y-3">
            {BEST_TIMES.map((b) => (
              <div key={b.platform}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {b.platform}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {b.slots.map((s) => (
                    <span key={s} className="rounded-lg bg-royal-50 text-royal-800 text-xs px-2 py-1 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

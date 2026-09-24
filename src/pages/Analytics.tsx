import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ANALYTICS } from "../lib/data";
import { useStore } from "../lib/store";
import { Card, PageHeader, Stat } from "../components/UI";
import { PlatformBadge } from "../lib/platforms";
import { fmt } from "../lib/utils";

const byPlatform = [
  { name: "LinkedIn", impressions: 420000, eng: 4.2, clicks: 11800 },
  { name: "Instagram", impressions: 510000, eng: 3.1, clicks: 9400 },
  { name: "TikTok", impressions: 890000, eng: 6.8, clicks: 21000 },
  { name: "X", impressions: 260000, eng: 2.4, clicks: 6400 },
  { name: "YouTube", impressions: 180000, eng: 5.1, clicks: 4300 },
  { name: "Pinterest", impressions: 140000, eng: 2.9, clicks: 5100 },
];

export function Analytics() {
  const { posts } = useStore();
  const published = posts.filter((p) => p.status === "published");

  return (
    <div>
      <PageHeader
        kicker="Analytics"
        title="Performance, not vanity."
        subtitle="Native telemetry rolled up across every connected surface. Click-through uses Velora's shortener."
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Impressions" value={fmt(ANALYTICS.reduce((a, b) => a + b.impressions, 0))} delta="+12.4%" up />
        <Stat label="Engagements" value={fmt(ANALYTICS.reduce((a, b) => a + b.engagement, 0))} delta="+6.1%" up />
        <Stat label="Link clicks" value={fmt(ANALYTICS.reduce((a, b) => a + b.clicks, 0))} delta="+9.8%" up />
        <Stat label="Net followers" value="+5.8K" delta="14 day" up />
      </div>
      <div className="mt-5 grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3">
          <div className="text-sm font-semibold mb-3">Impressions vs clicks</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="impressions" stroke="#1E40AF" fill="#93C5FD55" strokeWidth={2} />
                <Area type="monotone" dataKey="clicks" stroke="#0F766E" fill="#99F6E455" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold mb-3">By network</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlatform} layout="vertical" margin={{ left: 24 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={72} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="impressions" fill="#2563EB" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-5 grid md:grid-cols-2 gap-5">
        <Card pad={false}>
          <div className="px-5 py-4 text-sm font-semibold border-b border-slate-100">Top published</div>
          {published.map((p) => (
            <div key={p.id} className="px-5 py-3 border-b border-slate-50">
              <div className="text-sm line-clamp-2">{p.content}</div>
              <div className="mt-1 flex gap-1.5">
                {p.platforms.map((pl) => (
                  <PlatformBadge key={pl} id={pl} connected />
                ))}
                <span className="text-xs text-slate-500 ml-auto">Score {p.virality}</span>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div className="text-sm font-semibold">Engagement rate</div>
          <div className="mt-4 space-y-3">
            {byPlatform.map((p) => (
              <div key={p.name}>
                <div className="flex text-xs mb-1">
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-auto text-slate-500">{p.eng}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-royal-600" style={{ width: `${Math.min(100, p.eng * 10)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

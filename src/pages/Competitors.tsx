import React from "react";
import { BEST_TIMES } from "../lib/data";
import { useStore } from "../lib/store";
import { Card, PageHeader, Stat } from "../components/UI";
import { PlatformBadge } from "../lib/platforms";
import { fmt } from "../lib/utils";

const HASHTAGS = [
  { tag: "#BrandStrategy", vol: "120k", fit: 92 },
  { tag: "#SocialOps", vol: "18k", fit: 96 },
  { tag: "#QuietLuxury", vol: "540k", fit: 71 },
  { tag: "#buildinpublic", vol: "890k", fit: 64 },
  { tag: "#ClimateTech", vol: "210k", fit: 88 },
  { tag: "#Atelier", vol: "40k", fit: 79 },
];

export function Competitors() {
  const { competitors } = useStore();
  return (
    <div>
      <PageHeader
        kicker="Grow"
        title="Watch the room, not just the mirror."
        subtitle="Competitor radar, hashtag intelligence, and best-time windows modelled on your own history."
      />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Share of voice" value="18%" delta="+2.1 pts" up />
        <Stat label="Avg competitor cadence" value="10.5" delta="posts / week" up />
        <Stat label="Your cadence" value="14" delta="posts / week" up />
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card pad={false}>
          <div className="px-5 py-4 text-sm font-semibold border-b border-slate-100">Radar</div>
          {competitors.map((c) => (
            <div key={c.id} className="px-5 py-3 border-b border-slate-50 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-slate-500">{c.handle} · {fmt(c.followers)} · {c.engRate}% eng</div>
                <div className="text-xs text-slate-600 mt-1">Top hook · {c.topHook}</div>
              </div>
              <PlatformBadge id={c.platform} connected />
            </div>
          ))}
        </Card>
        <Card>
          <div className="text-sm font-semibold">Hashtag intelligence</div>
          <div className="mt-3 space-y-3">
            {HASHTAGS.map((h) => (
              <div key={h.tag}>
                <div className="flex text-sm">
                  <span className="font-medium">{h.tag}</span>
                  <span className="ml-auto text-xs text-slate-500">{h.vol} · fit {h.fit}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 mt-1">
                  <div className="h-full bg-royal-600 rounded-full" style={{ width: `${h.fit}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm font-semibold">Best windows (WAT)</div>
          <div className="mt-2 space-y-2">
            {BEST_TIMES.map((b) => (
              <div key={b.platform} className="text-xs">
                <span className="font-semibold uppercase text-slate-500">{b.platform} · </span>
                {b.slots.join(" · ")}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

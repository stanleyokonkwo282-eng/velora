import React from "react";
import { useStore } from "../lib/store";
import { Badge, Card, PageHeader } from "../components/UI";
import { fmt } from "../lib/utils";

export function Campaigns() {
  const { posts } = useStore();
  const groups = Array.from(new Set(posts.map((p) => p.campaign || "Untitled")));
  return (
    <div>
      <PageHeader
        kicker="Campaigns"
        title="Briefs with a pulse."
        subtitle="Every post belongs to a campaign. Goals, creative, approvals, and a single teardown when it's over."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {groups.map((g) => {
          const items = posts.filter((p) => (p.campaign || "Untitled") === g);
          const avg = Math.round(items.reduce((s, p) => s + p.virality, 0) / items.length);
          return (
            <Card key={g}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">{g}</div>
                  <div className="text-xs text-slate-500 mt-1">{items.length} assets in flight</div>
                </div>
                <Badge tone="blue">Score {avg}</Badge>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-full bg-royal-600 rounded-full" style={{ width: `${Math.min(100, items.length * 18)}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Array.from(new Set(items.flatMap((i) => i.labels))).map((l) => (
                  <Badge key={l}>{l}</Badge>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Combined predicted reach {fmt(avg * 4200 * items.length)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

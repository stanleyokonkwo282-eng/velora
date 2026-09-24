import React from "react";
import { Repeat } from "lucide-react";
import { useStore } from "../lib/store";
import { Badge, Button, Card, PageHeader } from "../components/UI";
import { PlatformBadge } from "../lib/platforms";
import { formatWhen } from "../lib/utils";

export function Evergreen() {
  const { posts, updatePost } = useStore();
  const looped = posts.filter((p) => p.evergreenInterval);
  const candidates = posts.filter((p) => p.status === "published" && !p.evergreenInterval);

  return (
    <div>
      <PageHeader
        kicker="Evergreen"
        title="The 8% that still earns."
        subtitle="Set high-performing or timeless posts to repost daily, weekly, or monthly. Velora skips if an identical caption is already in the next 7 days."
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <div>
          <div className="text-sm font-semibold mb-3">Active loops</div>
          <div className="space-y-3">
            {looped.map((p) => (
              <Card key={p.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm line-clamp-3">{p.content}</div>
                  <Badge tone="blue">{p.evergreenInterval}</Badge>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {p.platforms.map((pl) => (
                    <PlatformBadge key={pl} id={pl} connected />
                  ))}
                </div>
                <div className="mt-2 text-xs text-slate-400">Next window {formatWhen(p.scheduledAt)}</div>
                <Button size="sm" variant="ghost" className="mt-2" onClick={() => updatePost(p.id, { evergreenInterval: undefined })}>
                  Stop loop
                </Button>
              </Card>
            ))}
            {looped.length === 0 && <Card>No loops yet.</Card>}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Promote from published</div>
          <div className="space-y-3">
            {candidates.map((p) => (
              <Card key={p.id} className="flex items-start gap-3">
                <Repeat size={16} className="text-royal-700 mt-1" />
                <div className="flex-1">
                  <div className="text-sm line-clamp-2">{p.content}</div>
                  <div className="text-xs text-slate-500 mt-1">Score {p.virality}</div>
                  <div className="mt-2 flex gap-2">
                    {(["weekly", "monthly"] as const).map((i) => (
                      <Button key={i} size="sm" variant="secondary" onClick={() => updatePost(p.id, { evergreenInterval: i, status: "evergreen" })}>
                        Repeat {i}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

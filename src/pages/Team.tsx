import React from "react";
import { Check, X } from "lucide-react";
import { useStore } from "../lib/store";
import { Avatar, Badge, Button, Card, PageHeader } from "../components/UI";
import { PlatformBadge } from "../lib/platforms";

const ROLE_TONE = {
  owner: "dark",
  admin: "blue",
  editor: "violet",
  approver: "amber",
  client: "green",
  viewer: "slate",
} as const;

export function TeamPage() {
  const { team, posts, setStatus } = useStore();
  const queue = posts.filter((p) => p.status === "pending_approval");

  return (
    <div>
      <PageHeader
        kicker="Team & approvals"
        title="Draft. Review. Release."
        subtitle="Granular roles so editors never publish, clients never see other clients, and legal can hold a still without freezing the whole calendar."
        actions={<Button variant="secondary">Invite</Button>}
      />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((m) => (
          <Card key={m.id} className="flex items-center gap-3">
            <Avatar seed={m.name} label={m.name} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-slate-500 truncate">{m.email}</div>
            </div>
            <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <div className="text-sm font-semibold mb-3">Approval rail</div>
        <div className="space-y-3">
          {queue.map((p) => (
            <Card key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="text-sm">{p.content}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.platforms.map((pl) => (
                    <PlatformBadge key={pl} id={pl} connected />
                  ))}
                  {p.labels.map((l) => (
                    <Badge key={l} tone={l.includes("legal") ? "amber" : "slate"}>{l}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setStatus(p.id, "scheduled")}>
                  <Check size={14} /> Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => setStatus(p.id, "draft")}>
                  <X size={14} /> Return
                </Button>
              </div>
            </Card>
          ))}
          {queue.length === 0 && <Card>Nothing waiting. The house is clear.</Card>}
        </div>
      </div>
    </div>
  );
}

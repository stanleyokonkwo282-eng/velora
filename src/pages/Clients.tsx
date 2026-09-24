import React from "react";
import { useStore } from "../lib/store";
import { Badge, Card, PageHeader } from "../components/UI";
import { PlatformGlyph, platformById } from "../lib/platforms";
import { fmt } from "../lib/utils";

export function Clients() {
  const { clients, accounts, posts } = useStore();
  return (
    <div>
      <PageHeader
        kicker="Client rooms"
        title="White-label walls between brands."
        subtitle="Each room is a vault of its own: accounts, calendar, approvals, and a portal your client can enter without seeing anyone else."
      />
      <div className="grid lg:grid-cols-3 gap-5">
        {clients.map((c) => {
          const accs = accounts.filter((a) => c.accountIds.includes(a.id) || a.clientId === c.id);
          const n = posts.filter((p) => p.accountIds.some((id) => accs.map((a) => a.id).includes(id))).length;
          return (
            <Card key={c.id}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl" style={{ background: c.color }} />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.industry} · {c.contacts}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {accs.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-1 text-xs">
                    <span className="text-white rounded-full h-4 w-4 grid place-items-center" style={{ background: platformById(a.platform).color }}>
                      <PlatformGlyph id={a.platform} size={9} />
                    </span>
                    {a.handle}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Badge tone="blue">{accs.length} accounts</Badge>
                <Badge>{n} posts in view</Badge>
                <Badge tone="green">Portal on</Badge>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Combined reach {fmt(accs.reduce((s, a) => s + a.followers, 0))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

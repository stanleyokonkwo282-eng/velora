import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Badge, Button, Card, PageHeader } from "../components/UI";
import { rel } from "../lib/utils";

const SAMPLE = `curl -X POST https://api.velora.io/v1/posts \\
  -H "Authorization: Bearer vlr_live_9f2c…" \\
  -H "Content-Type: application/json" \\
  -d '{
    "accountIds": ["acc_li_main"],
    "content": "Quiet software. Loud results.",
    "firstComment": "Brief · vlr.a/vault",
    "scheduledAt": "2026-09-26T09:10:00+01:00"
  }'`;

export function ApiConsole() {
  const { webhooks, apiKeys } = useStore();
  const [log, setLog] = useState(
    "POST /v1/posts 202 accepted  id=p_8k2\nGET  /v1/accounts 200  15 connected\nPOST /v1/webhooks/test 410 zapier catch gone"
  );

  return (
    <div>
      <PageHeader
        kicker="API & webhooks"
        title="n8n, Make, Zapier, or your own worker."
        subtitle="REST for humans, MCP for agents. Publish, fail, and approval events leave the vault as signed webhooks."
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="text-sm font-semibold">Live keys</div>
          <div className="mt-3 space-y-2">
            {apiKeys.map((k) => (
              <div key={k.id} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{k.name}</div>
                  <div className="font-mono text-xs text-slate-500">{k.prefix}••••</div>
                </div>
                <div className="text-[11px] text-slate-400">{k.lastUsed}</div>
              </div>
            ))}
          </div>
          <Button className="mt-4" size="sm" variant="secondary">Mint key</Button>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Webhooks</div>
          <div className="mt-3 space-y-2">
            {webhooks.map((w) => (
              <div key={w.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs truncate">{w.url}</div>
                  <Badge tone={w.status === "healthy" ? "green" : "rose"}>{w.status}</Badge>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{w.events.join(" · ")} · {rel(w.last)}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold mb-3">Quickstart</div>
          <pre className="rounded-2xl bg-slate-950 text-slate-100 p-4 text-xs overflow-auto leading-relaxed">{SAMPLE}</pre>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => setLog((l) => `POST /v1/posts 202 accepted  id=p_${Math.random().toString(36).slice(2, 6)}\n` + l)}>
              Send test job
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard?.writeText(SAMPLE)}>
              Copy curl
            </Button>
          </div>
          <pre className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs font-mono text-slate-600 whitespace-pre-wrap">{log}</pre>
        </Card>
      </div>
    </div>
  );
}

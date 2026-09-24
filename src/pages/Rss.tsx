import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Badge, Button, Card, Field, PageHeader, Toggle, inputClass } from "../components/UI";
import { useNavigate } from "react-router-dom";

export function RssPage() {
  const { feeds, toggleFeed, addFeed, addPost, accounts } = useStore();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const nav = useNavigate();
  const [csv, setCsv] = useState("date,platform,content\n2026-09-26 09:00,linkedin,Northline Q3 field note\n2026-09-27 18:30,x,Vault model, not a login pile");

  return (
    <div>
      <PageHeader
        kicker="RSS & bulk"
        title="The internet, already formatted."
        subtitle="Connect journals and research feeds. Or drop a CSV and queue a month before lunch."
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="text-sm font-semibold">Feeds</div>
          {feeds.map((f) => (
            <Card key={f.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{f.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{f.url}</div>
                </div>
                <Toggle on={f.enabled} onChange={() => toggleFeed(f.id)} />
              </div>
              <div className="mt-3 text-sm text-slate-600">Template · {f.template}</div>
              <div className="mt-1 text-xs text-slate-400">Last · {f.lastItem}</div>
            </Card>
          ))}
          <Card>
            <div className="text-sm font-semibold mb-3">Add feed</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="URL"><input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></Field>
            </div>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => {
                if (!name || !url) return;
                addFeed({ name, url, accounts: [accounts[0].id], template: "{title} {short}", enabled: true });
                setName("");
                setUrl("");
              }}
            >
              Subscribe
            </Button>
          </Card>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Bulk CSV</div>
            <Badge tone="blue">UTF-8 · date, platform, content</Badge>
          </div>
          <textarea className={inputClass + " mt-3 min-h-[240px] font-mono text-xs"} value={csv} onChange={(e) => setCsv(e.target.value)} />
          <Button
            className="mt-3"
            onClick={() => {
              const lines = csv.split("\n").slice(1).filter(Boolean);
              lines.forEach((line) => {
                const [, platform, ...rest] = line.split(",");
                const content = rest.join(",");
                addPost({
                  accountIds: [accounts[0].id],
                  platforms: [(platform as "linkedin" | "x") || "linkedin"],
                  content,
                  scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                  status: "scheduled",
                  campaign: "Bulk import",
                  labels: ["csv"],
                });
              });
              nav("/app/calendar");
            }}
          >
            Queue {Math.max(0, csv.split("\n").length - 1)} posts
          </Button>
        </Card>
      </div>
    </div>
  );
}

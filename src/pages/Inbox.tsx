import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Avatar, Badge, Button, Card, PageHeader, PillTab, inputClass } from "../components/UI";
import { PlatformGlyph } from "../lib/platforms";
import { cn, rel } from "../lib/utils";

export function InboxPage() {
  const { inbox, markInbox, replyInbox } = useStore();
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState(inbox[0]?.id);
  const [draft, setDraft] = useState("");
  const item = inbox.find((i) => i.id === active);
  const filtered = inbox.filter((i) => {
    if (tab === "unread") return i.unread;
    if (tab === "risk") return i.sentiment === "negative" || i.sla === "overdue";
    return true;
  });

  return (
    <div>
      <PageHeader
        kicker="Inbox"
        title="One room for every mention."
        subtitle="Comments, DMs, reviews, and @mentions with sentiment and SLA. Reply without leaving Velora."
        actions={
          <PillTab
            value={tab}
            onChange={setTab}
            items={[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "risk", label: "At risk" },
            ]}
          />
        }
      />
      <div className="grid lg:grid-cols-[360px_1fr] gap-4 min-h-[560px]">
        <Card pad={false} className="overflow-hidden">
          {filtered.map((i) => (
            <button
              key={i.id}
              onClick={() => {
                setActive(i.id);
                markInbox(i.id);
              }}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50",
                active === i.id && "bg-royal-50/60"
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar seed={i.from} label={i.from} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{i.from}</span>
                    {i.unread && <span className="h-1.5 w-1.5 rounded-full bg-royal-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <PlatformGlyph id={i.platform} size={10} /> {i.account} · {rel(i.time)}
                  </div>
                </div>
                <Badge tone={i.sentiment === "positive" ? "green" : i.sentiment === "negative" ? "rose" : "slate"}>
                  {i.sentiment}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{i.preview}</p>
            </button>
          ))}
        </Card>
        <Card className="flex flex-col">
          {item ? (
            <>
              <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                <Avatar seed={item.from} label={item.from} size={44} />
                <div className="flex-1">
                  <div className="font-semibold">{item.from}</div>
                  <div className="text-xs text-slate-500">{item.type} · {item.account} · SLA {item.sla}</div>
                </div>
                <Badge tone={item.sla === "overdue" ? "rose" : item.sla === "due" ? "amber" : "green"}>{item.sla}</Badge>
              </div>
              <div className="flex-1 py-6">
                <p className="text-sm leading-relaxed">{item.preview}</p>
                {item.sentiment === "negative" && (
                  <div className="mt-4 rounded-xl bg-rose-50 text-rose-900 p-3 text-sm">
                    Sentiment model flagged this as negative. Suggested: acknowledge, offer a private path, avoid the timeline debate.
                  </div>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100">
                <textarea
                  className={cn(inputClass, "min-h-[88px]")}
                  placeholder="Write a reply in brand voice…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => {
                      replyInbox(item.id);
                      setDraft("");
                    }}
                  >
                    Send reply
                  </Button>
                  <Button variant="secondary" onClick={() => setDraft("Thank you for flagging this — we'll take it into the studio and reply with a proper brief.")}>
                    Use AI draft
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="m-auto text-sm text-slate-500">Select a conversation</div>
          )}
        </Card>
      </div>
    </div>
  );
}

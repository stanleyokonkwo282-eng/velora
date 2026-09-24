import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ImagePlus, Clock, MessageCircle, Send, Smartphone, Monitor, Link2 } from "lucide-react";
import { useStore } from "../lib/store";
import { PLATFORMS, PlatformGlyph, platformById } from "../lib/platforms";
import { Badge, Button, Card, Field, inputClass, PageHeader, PillTab } from "../components/UI";
import { generateCaptions, generateFirstComment } from "../lib/ai";
import { CHAR_LIMIT, cn, scoreCopy } from "../lib/utils";
import type { PlatformId, PostStatus } from "../lib/types";

export function Compose() {
  const { accounts, addPost, media, signatures, crisis } = useStore();
  const nav = useNavigate();
  const connected = accounts.filter((a) => a.connected);
  const [selected, setSelected] = useState<string[]>([connected[0]?.id, connected[1]?.id].filter(Boolean) as string[]);
  const [content, setContent] = useState(
    "Most teams schedule content. The ones who win design systems.\n\nVelora keeps the keys in your vault, the calendar in one queue, and the first comment where it belongs."
  );
  const [first, setFirst] = useState("");
  const [when, setWhen] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16);
  });
  const [preview, setPreview] = useState<"phone" | "desktop">("phone");
  const [sig, setSig] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");
  const [delay, setDelay] = useState("12");

  const platforms = useMemo(() => {
    const ids = selected
      .map((id) => connected.find((a) => a.id === id)?.platform)
      .filter(Boolean) as PlatformId[];
    return Array.from(new Set(ids));
  }, [selected, connected]);

  const tightest = platforms.reduce((min, p) => Math.min(min, CHAR_LIMIT[p]), 100000);
  const used = content.length;
  const score = scoreCopy(content, platforms);
  const liveAccount = connected.find((a) => a.id === selected[0]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function ai() {
    setBusy(true);
    setTimeout(() => {
      setIdeas(generateCaptions(content.slice(0, 80), "editorial-calm", 3));
      setBusy(false);
    }, 700);
  }

  function publish(status: PostStatus) {
    if (!selected.length) return;
    const post = addPost({
      accountIds: selected,
      platforms,
      content: sig ? `${content}\n\n${signatures.find((s) => s.id === sig)?.text}` : content,
      firstComment: first || undefined,
      scheduledAt: new Date(when).toISOString(),
      status: status === "published" && crisis ? "draft" : status,
      campaign: "Untitled",
      labels: ["composer"],
    });
    setSaved(post.id);
    if (status !== "draft") nav("/app/calendar");
  }

  return (
    <div>
      <PageHeader
        kicker="Compose"
        title="Write once. Dialect per surface."
        subtitle="Select accounts, score the copy, attach a first comment, then schedule with a human delay so it never feels like a bot."
        actions={
          <>
            <Button variant="secondary" onClick={() => publish("draft")}>Save draft</Button>
            <Button variant="secondary" onClick={() => publish("pending_approval")}>Send to approval</Button>
            <Button onClick={() => publish("scheduled")} disabled={!selected.length}>
              <Clock size={14} /> Schedule
            </Button>
          </>
        }
      />

      <div className="grid xl:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Posting set</div>
            <div className="flex flex-wrap gap-2">
              {connected.map((a) => {
                const on = selected.includes(a.id);
                const meta = platformById(a.platform);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggle(a.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                      on ? "border-royal-600 bg-royal-50 text-royal-900" : "border-slate-200 bg-white text-slate-600"
                    )}
                  >
                    <span className="h-5 w-5 rounded-full grid place-items-center text-white" style={{ background: meta.color }}>
                      <PlatformGlyph id={a.platform} size={10} />
                    </span>
                    {a.handle}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Caption</div>
              <div className="flex items-center gap-3 text-xs">
                <span className={used > tightest ? "text-rose-600 font-semibold" : "text-slate-500"}>
                  {used} / {tightest === 100000 ? "∞" : tightest}
                </span>
                <Badge tone={score > 80 ? "green" : score > 65 ? "blue" : "amber"}>Virality {score}</Badge>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={cn(inputClass, "resize-y min-h-[200px] leading-relaxed")}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={ai} disabled={busy}>
                <Sparkles size={13} /> {busy ? "Writing…" : "AI variants"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setFirst(generateFirstComment("https://velora.io/brief"))}>
                <MessageCircle size={13} /> Draft first comment
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setContent((c) => c + "\n\nSave this for your next planning session.")}>
                Add CTA
              </Button>
            </div>
            {ideas.length > 0 && (
              <div className="mt-4 grid gap-2">
                {ideas.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setContent(idea)}
                    className="text-left rounded-xl border border-slate-200 p-3 text-sm hover:border-royal-300 hover:bg-royal-50/40"
                  >
                    <div className="text-[11px] font-semibold text-royal-800 mb-1">Variant {i + 1}</div>
                    <div className="line-clamp-4 text-slate-600 whitespace-pre-wrap">{idea}</div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <Field label="First comment / thread" hint="Fires ~8s after publish">
                <textarea
                  className={cn(inputClass, "min-h-[88px]")}
                  placeholder="Link in bio, source, or the first reply on X / LinkedIn"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                />
              </Field>
              <div className="mt-4">
                <Field label="Signature">
                  <select className={inputClass} value={sig} onChange={(e) => setSig(e.target.value)}>
                    <option value="">None</option>
                    {signatures.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </Card>
            <Card>
              <Field label="Schedule (WAT)">
                <input type="datetime-local" className={inputClass} value={when} onChange={(e) => setWhen(e.target.value)} />
              </Field>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field label="Human delay (sec)">
                  <input className={inputClass} value={delay} onChange={(e) => setDelay(e.target.value)} />
                </Field>
                <Field label="Short link">
                  <div className={cn(inputClass, "flex items-center gap-2 text-slate-500")}>
                    <Link2 size={14} /> vlr.a/auto
                  </div>
                </Field>
              </div>
              <Button className="w-full mt-4" variant="dark" onClick={() => publish("published")} disabled={crisis}>
                <Send size={14} /> {crisis ? "Paused by crisis switch" : "Publish now"}
              </Button>
              {saved && <div className="text-xs text-emerald-700 mt-2">Saved {saved}</div>}
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Media</div>
              <Button size="sm" variant="ghost"><ImagePlus size={13} /> Upload</Button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {media.slice(0, 6).map((m) => (
                <div key={m.id} className="aspect-square rounded-xl border border-slate-200 overflow-hidden">
                  <div className="h-full w-full" style={{ background: m.color }} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4 xl:sticky xl:top-24 h-fit">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Native preview</div>
            <PillTab
              value={preview}
              onChange={(v) => setPreview(v as "phone" | "desktop")}
              items={[
                { id: "phone", label: "9:16" },
                { id: "desktop", label: "Desktop" },
              ]}
            />
          </div>
          {preview === "phone" ? (
            <div className="mx-auto w-[280px] phone-frame rounded-[40px] p-3">
              <div className="rounded-[32px] bg-white overflow-hidden h-[520px] flex flex-col">
                <div className="h-8 bg-white flex items-center justify-center">
                  <div className="h-4 w-20 rounded-full bg-ink" />
                </div>
                <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-100">
                  <div className="h-8 w-8 rounded-full bg-royal-800 text-white grid place-items-center text-xs">
                    {liveAccount?.avatar || "V"}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold">{liveAccount?.handle || "@velora"}</div>
                    <div className="text-slate-400">now · WAT</div>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-3">
                  <div className="aspect-[4/5] rounded-xl" style={{ background: media[0]?.color }} />
                  <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-wrap">{content}</p>
                  {first && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-2 text-[11px] text-slate-600">
                      <span className="font-semibold">First comment · </span>
                      {first}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <Monitor size={14} /> LinkedIn / X desktop
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-royal-800 text-white grid place-items-center text-sm">
                  {liveAccount?.avatar || "V"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{liveAccount?.accountName}</div>
                  <div className="text-xs text-slate-400">{liveAccount?.handle} · 1st</div>
                  <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
                </div>
              </div>
            </Card>
          )}
          <Card>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Limits</div>
            <div className="space-y-2">
              {(platforms.length ? platforms : (["x", "linkedin", "instagram"] as PlatformId[])).map((p) => {
                const meta = platformById(p);
                const over = content.length > meta.limit;
                return (
                  <div key={p} className="flex items-center gap-2 text-xs">
                    <PlatformGlyph id={p} size={12} />
                    <span className="flex-1">{meta.name}</span>
                    <span className={over ? "text-rose-600 font-semibold" : "text-slate-500"}>
                      {content.length}/{meta.limit}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Smartphone size={12} /> Previews are native-sized, not screenshots of screenshots.
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { Badge, Button, Card, PageHeader, PillTab } from "../components/UI";
import { PlatformGlyph } from "../lib/platforms";
import { cn, formatWhen } from "../lib/utils";
import type { ScheduledPost } from "../lib/types";

export function CalendarPage() {
  const { posts, updatePost } = useStore();
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [dragId, setDragId] = useState<string | null>(null);
  const nav = useNavigate();

  const days = useMemo(() => {
    if (view === "day") return [cursor];
    if (view === "week") {
      const s = startOfWeek(cursor, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: s, end: endOfWeek(cursor, { weekStartsOn: 1 }) });
    }
    const s = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const e = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: s, end: e });
  }, [cursor, view]);

  function postsOn(d: Date) {
    return posts.filter((p) => isSameDay(new Date(p.scheduledAt), d));
  }

  function dropOn(d: Date) {
    if (!dragId) return;
    const post = posts.find((p) => p.id === dragId);
    if (!post) return;
    const prev = new Date(post.scheduledAt);
    const next = new Date(d);
    next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
    updatePost(dragId, { scheduledAt: next.toISOString() });
    setDragId(null);
  }

  return (
    <div>
      <PageHeader
        kicker="Calendar"
        title={format(cursor, "MMMM yyyy")}
        subtitle="Drag a card onto another day to reschedule. Approvals stay attached. Africa/Lagos."
        actions={
          <>
            <PillTab
              value={view}
              onChange={(v) => setView(v as typeof view)}
              items={[
                { id: "month", label: "Month" },
                { id: "week", label: "Week" },
                { id: "day", label: "Day" },
              ]}
            />
            <div className="inline-flex rounded-xl border border-slate-200 overflow-hidden">
              <button className="h-9 w-9 grid place-items-center hover:bg-slate-50" onClick={() => setCursor(subMonths(cursor, 1))}>
                <ChevronLeft size={16} />
              </button>
              <button className="h-9 px-3 text-xs font-semibold border-x border-slate-200" onClick={() => setCursor(new Date())}>
                Today
              </button>
              <button className="h-9 w-9 grid place-items-center hover:bg-slate-50" onClick={() => setCursor(addMonths(cursor, 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
            <Button onClick={() => nav("/app/compose")}>
              <Plus size={14} /> New
            </Button>
          </>
        }
      />

      <Card pad={false} className="overflow-hidden">
        {view !== "day" && (
          <div className="calendar-grid border-b border-slate-100 bg-slate-50">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(0, view === "week" ? 7 : 7).map((d) => (
              <div key={d} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {d}
              </div>
            ))}
          </div>
        )}
        <div className={cn("calendar-grid", view === "day" && "!grid-cols-1")}>
          {days.map((d) => {
            const items = postsOn(d);
            const muted = view === "month" && !isSameMonth(d, cursor);
            const today = isSameDay(d, new Date());
            return (
              <div
                key={d.toISOString()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropOn(d)}
                className={cn(
                  "min-h-[128px] border-t border-r border-slate-100 p-2",
                  muted && "bg-slate-50/70 text-slate-400",
                  today && "bg-royal-50/40"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "h-6 w-6 grid place-items-center rounded-full text-xs font-semibold",
                      today && "bg-royal-800 text-white"
                    )}
                  >
                    {format(d, "d")}
                  </span>
                  {items.length > 0 && <span className="text-[10px] text-slate-400">{items.length}</span>}
                </div>
                <div className="space-y-1">
                  {items.slice(0, view === "month" ? 3 : 8).map((p) => (
                    <CalChip key={p.id} post={p} onDrag={() => setDragId(p.id)} />
                  ))}
                  {view === "month" && items.length > 3 && (
                    <div className="text-[10px] text-slate-400 px-1">+{items.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-5">
        <div className="text-sm font-semibold mb-3">Queue detail</div>
        <div className="grid md:grid-cols-2 gap-3">
          {posts
            .slice()
            .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
            .filter((p) => p.status !== "published")
            .slice(0, 6)
            .map((p) => (
              <Card key={p.id} className="flex items-start gap-3">
                <div className="flex -space-x-1 pt-0.5">
                  {p.platforms.map((pl) => (
                    <span key={pl} className="h-6 w-6 rounded-full bg-slate-900 text-white grid place-items-center ring-2 ring-white">
                      <PlatformGlyph id={pl} size={11} />
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm line-clamp-2">{p.content}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatWhen(p.scheduledAt)}</div>
                </div>
                <Badge tone={p.status === "pending_approval" ? "amber" : p.status === "draft" ? "slate" : "blue"}>
                  {p.status.replace("_", " ")}
                </Badge>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

function CalChip({ post, onDrag }: { post: ScheduledPost; onDrag: () => void }) {
  const tone =
    post.status === "pending_approval"
      ? "bg-amber-100 text-amber-900"
      : post.status === "draft"
      ? "bg-slate-100 text-slate-700"
      : post.status === "failed"
      ? "bg-rose-100 text-rose-800"
      : "bg-royal-100 text-royal-900";
  return (
    <div
      draggable
      onDragStart={onDrag}
      className={cn("rounded-md px-1.5 py-1 text-[11px] leading-tight cursor-grab active:cursor-grabbing", tone)}
      title={post.content}
    >
      <div className="flex items-center gap-1">
        {post.platforms.slice(0, 2).map((p) => (
          <PlatformGlyph key={p} id={p} size={9} />
        ))}
        <span className="truncate">{post.content}</span>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, KeyRound, PenLine, Sparkles, Gauge, Inbox, Search } from "lucide-react";

const COMMANDS = [
  { id: "compose", label: "New post", hint: "Open composer", to: "/app/compose", icon: PenLine },
  { id: "cal", label: "Jump to calendar", hint: "Week view", to: "/app/calendar", icon: CalendarDays },
  { id: "ai", label: "Ask the copilot", hint: "AI Studio", to: "/app/ai", icon: Sparkles },
  { id: "acc", label: "Connect an account", hint: "OAuth & BYO keys", to: "/app/accounts", icon: KeyRound },
  { id: "home", label: "Command center", hint: "Home", to: "/app", icon: Gauge },
  { id: "inbox", label: "Open inbox", hint: "Unreplied", to: "/app/inbox", icon: Inbox },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const items = useMemo(
    () => COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()) || c.hint.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else document.dispatchEvent(new CustomEvent("velora:cmd"));
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const openCmd = () => {
      /* parent sets open */
    };
    document.addEventListener("velora:cmd", openCmd);
    return () => document.removeEventListener("velora:cmd", openCmd);
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-b border-slate-100">
          <Search size={16} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search"
            className="flex-1 h-12 text-sm outline-none"
          />
        </div>
        <div className="p-2 max-h-80 overflow-auto">
          {items.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => {
                  nav(c.to);
                  onClose();
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-royal-50"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center text-slate-600">
                  <Icon size={15} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-[11px] text-slate-500">{c.hint}</div>
                </div>
              </button>
            );
          })}
          {items.length === 0 && <div className="p-6 text-sm text-slate-500 text-center">No matches</div>}
        </div>
      </div>
    </div>
  );
}

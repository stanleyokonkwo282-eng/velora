import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Command,
  Gauge,
  Inbox,
  KeyRound,
  LayoutGrid,
  Link2,
  Megaphone,
  PenLine,
  Puzzle,
  Radio,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
  Video,
  BarChart3,
  Clapperboard,
  Building2,
  Webhook,
  Rss,
  Repeat,
  Library,
  ChevronDown,
  Menu,
  X,
  Crown,
  LogOut,
} from "lucide-react";
import { useStore } from "../lib/store";
import { describeRemaining, useAccess } from "../lib/access";
import { ADMIN_EVENT, isAdminSession } from "../lib/adminAuth";
import { Avatar } from "./UI";
import { AccessPill, TrialRibbon } from "./TrialStatus";
import { cn, rel } from "../lib/utils";
import { CommandPalette } from "./CommandPalette";

const NAV = [
  {
    label: "Operate",
    items: [
      { to: "/app", label: "Command", icon: Gauge, end: true },
      { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
      { to: "/app/compose", label: "Compose", icon: PenLine },
      { to: "/app/inbox", label: "Inbox", icon: Inbox },
      { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Studio",
    items: [
      { to: "/app/ai", label: "AI Studio", icon: Sparkles },
      { to: "/app/media", label: "Media library", icon: Library },
      { to: "/app/video", label: "Video lab", icon: Clapperboard },
      { to: "/app/bio", label: "Link in bio", icon: Link2 },
    ],
  },
  {
    label: "Automate",
    items: [
      { to: "/app/plugs", label: "Plugs", icon: Puzzle },
      { to: "/app/rss", label: "RSS & bulk", icon: Rss },
      { to: "/app/evergreen", label: "Evergreen", icon: Repeat },
    ],
  },
  {
    label: "Grow",
    items: [
      { to: "/app/competitors", label: "Competitor radar", icon: Radio },
      { to: "/app/campaigns", label: "Campaigns", icon: Megaphone },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/app/accounts", label: "Accounts & OAuth", icon: KeyRound },
      { to: "/app/clients", label: "Client rooms", icon: Building2 },
      { to: "/app/team", label: "Team & approvals", icon: Users },
      { to: "/app/api", label: "API & webhooks", icon: Webhook },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppShell() {
  const { workspace, user, inbox, notifications, crisis, setCrisis, markAllNotes } = useStore();
  const { session, mode, signOut, daysLeft, msLeft, planLabel } = useAccess();
  const [openCmd, setOpenCmd] = useState(false);
  const [notes, setNotes] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [admin, setAdmin] = useState(() => isAdminSession());
  const loc = useLocation();
  const nav = useNavigate();
  const unreadInbox = inbox.filter((i) => i.unread).length;
  const unreadNotes = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const sync = () => setAdmin(isAdminSession());
    document.addEventListener(ADMIN_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      document.removeEventListener(ADMIN_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /* Whose workspace is this? The signed-in account, not a sample name. */
  const accountName = session?.name || user.name;
  const accountEmail = session?.email || user.email;

  const navGroups = useMemo(() => {
    if (!admin) return NAV;
    return [
      ...NAV,
      {
        label: "Owner",
        items: [{ to: "/admin", label: "Admin console", icon: Crown }],
      },
    ];
  }, [admin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCmd((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const crumb = useMemo(() => {
    const all = navGroups.flatMap((g) => g.items as { to: string; label: string; end?: boolean }[]);
    return (
      all.find((i) => (i.end ? loc.pathname === i.to : loc.pathname.startsWith(i.to)))?.label ||
      "Command"
    );
  }, [loc.pathname, navGroups]);

  return (
    <div className="relative flex min-h-screen">
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-midnight-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 z-50 flex h-screen w-[272px] shrink-0 flex-col border-r border-white/10 text-white transition-transform lg:sticky",
          "bg-midnight-800/95 backdrop-blur-xl",
          mobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-5 pt-5 pb-4 flex items-center gap-3">
          <img src="/logo-mark.png" alt="Velora" className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20" />
          <div className="min-w-0">
            <div className="font-semibold tracking-tight">Velora</div>
            <div className="text-[11px] text-blue-200/80 truncate">Social operating system</div>
          </div>
          <button className="ml-auto lg:hidden text-white/70" onClick={() => setMobile(false)}>
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => nav(mode === "active" ? "/app/settings" : "/app/upgrade")}
          className="mx-3 mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-left transition hover:bg-white/12"
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-azure-400 to-royal-700 text-xs font-bold">
            {workspace.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold">{workspace.name}</div>
            <div className="truncate text-[10px] text-blue-200/70">
              {mode === "active"
                ? `${planLabel} plan`
                : mode === "trialing"
                ? `Free trial · ${describeRemaining(msLeft)}`
                : "Trial ended"}
            </div>
          </div>
          <ChevronDown size={14} className="text-blue-100/70" />
        </button>

        <nav className="flex-1 overflow-y-auto px-3 pb-6 hide-scroll">
          {navGroups.map((g) => (
            <div key={g.label} className="mb-4">
              <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200/50">
                {g.label}
              </div>
              {g.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end as boolean | undefined}
                    onClick={() => setMobile(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition",
                        isActive ? "bg-white text-royal-950 shadow-sm" : "text-blue-50/80 hover:bg-white/10"
                      )
                    }
                  >
                    <Icon size={16} />
                    <span className="flex-1">{item.label}</span>
                    {item.to === "/app/inbox" && unreadInbox > 0 && (
                      <span className="text-[10px] font-bold bg-amber-400 text-ink rounded-full px-1.5 py-0.5">
                        {unreadInbox}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setCrisis(!crisis)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition",
              crisis ? "bg-rose-500 text-white" : "border border-white/10 bg-white/8 text-blue-50 hover:bg-white/12"
            )}
          >
            <ShieldAlert size={14} />
            {crisis ? "Crisis pause is ON" : "Crisis kill-switch"}
          </button>

          {(mode === "trialing" || mode === "locked") && (
            <button
              onClick={() => nav("/app/upgrade")}
              className="mt-2 flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-azure-400 to-royal-700 px-3 py-2 text-xs font-bold text-white transition hover:brightness-110"
            >
              <Sparkles size={14} />
              {mode === "trialing" ? "Upgrade before trial ends" : "Choose a plan"}
            </button>
          )}

          <button
            onClick={() => {
              signOut();
              nav("/");
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-blue-100/80 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-midnight-900/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="-ml-1 p-2 text-slate-300 lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
            <LayoutGrid size={14} />
            <span className="truncate">{workspace.name}</span>
            <span className="text-slate-600">/</span>
            <span className="font-medium text-white">{crumb}</span>
          </div>
          <button
            onClick={() => setOpenCmd(true)}
            className="ml-auto hidden h-10 max-w-md flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/8 sm:ml-8 md:flex"
          >
            <Search size={15} />
            <span className="flex-1 text-left">Search posts, accounts, commands…</span>
            <span className="flex items-center gap-0.5 rounded-md border border-white/12 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              <Command size={10} />K
            </span>
          </button>
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <AccessPill onUpgrade={() => nav("/app/upgrade")} />
            <button
              onClick={() => setOpenCmd(true)}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 md:hidden"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => nav("/app/compose")}
              className="hidden h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-azure-500 to-royal-700 px-3 text-xs font-semibold text-white sm:inline-flex"
            >
              <PenLine size={14} /> Compose
            </button>
            <button
              onClick={() => setNotes((v) => !v)}
              className="relative rounded-xl p-2 text-slate-300 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadNotes > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-azure-400" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-1">
              <Avatar seed={accountName} label={accountName} size={32} />
              <div className="hidden leading-tight xl:block">
                <div className="text-xs font-semibold text-white">{accountName}</div>
                <div className="max-w-[150px] truncate text-[10px] text-slate-400">
                  {accountEmail}
                </div>
              </div>
            </div>
            {admin && (
              <button
                onClick={() => nav("/admin")}
                className="ml-1 hidden items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-100 sm:inline-flex"
                title="Owner console"
              >
                <Crown size={12} /> Owner
              </button>
            )}
            <button
              onClick={() => {
                signOut();
                nav("/");
              }}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <TrialRibbon onUpgrade={() => nav("/app/upgrade")} />

        {crisis && (
          <div className="bg-rose-600 text-white text-xs sm:text-sm px-4 sm:px-6 py-2 flex items-center gap-2">
            <ShieldAlert size={14} />
            Crisis pause is active — publishing queue is frozen. Approvals still flow. Plugs will not fire.
            <button className="ml-auto underline font-semibold" onClick={() => setCrisis(false)}>
              Resume
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {notes && (
        <div className="fixed top-16 right-4 z-40 w-[360px] rounded-2xl border border-slate-200 bg-white shadow-lift overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="text-sm font-semibold">Notifications</div>
            <button className="text-xs text-royal-700 font-medium" onClick={markAllNotes}>
              Mark read
            </button>
          </div>
          <div className="max-h-[420px] overflow-auto">
            {notifications.map((n) => (
              <div key={n.id} className={cn("px-4 py-3 border-b border-slate-50", !n.read && "bg-royal-50/50")}>
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                <div className="text-[11px] text-slate-400 mt-1">{rel(n.time)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CommandPalette open={openCmd} onClose={() => setOpenCmd(false)} />
    </div>
  );
}

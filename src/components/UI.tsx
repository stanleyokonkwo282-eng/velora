import React, { useEffect } from "react";
import { cn, avatarGradient, initials } from "../lib/utils";

export function Card({
  children,
  className,
  pad = true,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={cn("panel", pad && "p-5", className)}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark" | "gold";
  size?: "sm" | "md" | "lg";
}) {
  const v = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
    dark: "btn-secondary",
    gold: "btn-gold",
  }[variant];
  const s = {
    sm: "h-9 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-12 px-5 text-sm rounded-xl",
  }[size];
  return (
    <button
      className={cn(
        "btn font-semibold disabled:opacity-50 disabled:pointer-events-none",
        v,
        s,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "blue" | "green" | "amber" | "rose" | "violet" | "dark";
}) {
  const map = {
    slate: "bg-white/10 text-slate-100 border-white/12",
    blue: "bg-azure-500/20 text-azure-100 border-azure-300/35",
    green: "bg-emerald-500/18 text-emerald-100 border-emerald-300/35",
    amber: "bg-amber-500/18 text-amber-100 border-amber-300/35",
    rose: "bg-rose-500/18 text-rose-100 border-rose-300/35",
    violet: "bg-violet-500/18 text-violet-100 border-violet-300/35",
    dark: "bg-midnight-950/70 text-white border-white/15",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        map
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold text-slate-200">{label}</span>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export const inputClass = "field";

export function Avatar({ seed, label, size = 36 }: { seed: string; label?: string; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white ring-1 ring-white/20"
      style={{ width: size, height: size, background: avatarGradient(seed), fontSize: size * 0.34 }}
      title={label}
    >
      {initials(label || seed)}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-midnight-950/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "glass-strong safe-b relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="flex items-start gap-3 border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <div className="text-lg font-semibold tracking-tight text-white">{title}</div>
            {subtitle && <div className="mt-0.5 text-sm text-slate-400">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <span className="block h-4 w-4 text-center text-lg leading-4">×</span>
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition",
        on ? "bg-azure-500" : "bg-white/20"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
          on ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker && <div className="kicker mb-1">{kicker}</div>}
        <h1 className="display-md text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-mist">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
}) {
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 font-serif text-3xl tracking-tight text-white">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs font-semibold",
            up ? "text-emerald-300" : "text-rose-300"
          )}
        >
          {delta}
        </div>
      )}
    </Card>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-16 text-center">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-400">{body}</div>
    </div>
  );
}

export function PillTab({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 hide-scroll">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition",
            value === t.id
              ? "bg-white text-midnight-700 shadow-sm"
              : "text-slate-400 hover:text-white"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

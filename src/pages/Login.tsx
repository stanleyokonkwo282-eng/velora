import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Globe2, KeyRound, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button, Field } from "../components/UI";
import { AdminLoginModal } from "../components/AdminLoginModal";
import { useAccess } from "../lib/access";
import { CURRENCIES, SUPPORT_EMAIL, TRIAL_DAYS, formatMoney, priceFor } from "../lib/plans";
import { cn } from "../lib/utils";

const PROMISES = [
  "Every network in one queue — X, LinkedIn, Meta, TikTok, YouTube, Threads and 20 more",
  "Your own OAuth keys, sealed with AES-256-GCM",
  "Approvals for editors, legal and clients on one rail",
  "AI studio that writes in your brand voice, not a generic one",
];

const LOGO_TAPS = 5;
const LOGO_TAP_WINDOW_MS = 2200;
const LOGO_HOLD_MS = 1200;

export function Login() {
  const nav = useNavigate();
  const { signIn } = useAccess();

  const [mode, setMode] = useState<"create" | "signin">("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --- hidden owner door: 5 quick taps, one long press, or Ctrl/Cmd+Shift+A --- */
  const [adminOpen, setAdminOpen] = useState(false);
  const taps = useRef<number[]>([]);
  const holdTimer = useRef<number | null>(null);
  const holdFired = useRef(false);

  function registerTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < LOGO_TAP_WINDOW_MS), now];
    if (taps.current.length >= LOGO_TAPS) {
      taps.current = [];
      setAdminOpen(true);
    }
  }

  function startHold() {
    holdFired.current = false;
    holdTimer.current = window.setTimeout(() => {
      holdFired.current = true;
      setAdminOpen(true);
    }, LOGO_HOLD_MS);
  }

  function endHold() {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (!holdFired.current) registerTap();
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setAdminOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const starter = formatMoney(priceFor("starter", "monthly", "USD"), "USD");
  const growth = formatMoney(priceFor("growth", "monthly", "USD"), "USD");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("That email address doesn't look complete.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    setError(null);
    setBusy(true);
    signIn(cleanEmail, name);
    window.setTimeout(() => nav("/app"), 260);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" aria-hidden="true" />

      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
        {/* ------------------------------------------------ brand panel ---- */}
        <section className="mesh noise relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
          <div className="grid-lines" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <img
              src="/logo-mark.png"
              alt="Velora"
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/25"
            />
            <span className="font-semibold tracking-tight">Velora</span>
          </div>

          <div className="relative max-w-xl">
            <div className="kicker">{TRIAL_DAYS}-day free trial · no card required</div>
            <h1 className="display-xl mt-4">
              The social operating system
              <span className="text-azure-200"> for brands that refuse to look ordinary.</span>
            </h1>
            <p className="lede mt-5">
              Velora is what a scheduler becomes when it is built for global brand teams: one queue
              for every network, your own OAuth relationship, and an AI studio that sounds like you.
            </p>

            <ul className="mt-8 space-y-3">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-start gap-3 text-sm text-blue-50/90">
                  <Check size={16} className="mt-0.5 shrink-0 text-azure-300" />
                  {promise}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-2">
              <span className="chip">
                <Globe2 size={12} /> Global teams
              </span>
              <span className="chip">
                <KeyRound size={12} /> Bring your own keys
              </span>
              <span className="chip">
                <ShieldCheck size={12} /> AES-256-GCM vault
              </span>
              <span className="chip">
                <Sparkles size={12} /> MCP agents + REST
              </span>
            </div>
          </div>

          <div className="relative text-xs text-blue-100/70">
            Plans from <b className="text-white">{starter}</b>/mo · most teams start on{" "}
            <b className="text-white">{growth}</b>/mo · pay in{" "}
            {CURRENCIES.map((c) => c.code).join(", ")}
          </div>
        </section>
        {/* -------------------------------------------------- auth panel ---- */}
        <section className="relative flex items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-md">
            <button
              type="button"
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Velora"
              className="mb-8 flex items-center gap-3 rounded-2xl p-1 text-left transition active:scale-[0.99] lg:hidden"
            >
              <img
                src="/logo-mark.png"
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20"
              />
              <span className="font-semibold tracking-tight text-white">Velora</span>
            </button>

            <div className="panel p-6 sm:p-8">
              <h1 className="display-md text-white">
                {mode === "create" ? "Start your free trial" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm text-mist">
                {mode === "create"
                  ? `Full access for ${TRIAL_DAYS} days. No card, no sales call — publish on day one.`
                  : "Sign in to pick up the queue exactly where you left it."}
              </p>

              <div className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                {(
                  [
                    { id: "create", label: "Create account" },
                    { id: "signin", label: "Sign in" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setMode(tab.id);
                      setError(null);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                      mode === tab.id
                        ? "bg-white/90 text-midnight-700"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === "create" && (
                  <Field label="Your name" hint="Optional">
                    <input
                      className="field"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Amara Okonkwo"
                      autoComplete="name"
                    />
                  </Field>
                )}

                <Field label="Work email">
                  <input
                    className="field"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                  />
                </Field>

                <Field label="Password" hint={mode === "create" ? "6+ characters" : undefined}>
                  <input
                    className="field"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "create" ? "new-password" : "current-password"}
                    required
                  />
                </Field>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-xs text-rose-100"
                  >
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Opening your workspace…
                    </>
                  ) : (
                    <>
                      {mode === "create" ? `Start ${TRIAL_DAYS}-day free trial` : "Sign in"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-300" /> No card required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-300" /> Cancel anytime
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Paystack-secured payments
                </span>
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
                After your trial, plans start at {starter}/mo — billed in USD, NGN, GHS, KES or ZAR.
                Questions?{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-azure-200 underline decoration-dotted"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <Link to="/" className="transition hover:text-white">
                ← Back to the marketing site
              </Link>
              {/* The owner arrives from the Velora mark — nothing here advertises it. */}
              <button
                type="button"
                onPointerDown={startHold}
                onPointerUp={endHold}
                onPointerLeave={endHold}
                onContextMenu={(event) => event.preventDefault()}
                aria-hidden="true"
                tabIndex={-1}
                className="hidden select-none px-2 text-transparent lg:inline-block"
              >
                ·
              </button>
            </div>
          </div>
        </section>
      </div>

      <AdminLoginModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onSuccess={() => nav("/admin")}
      />
    </div>
  );
}

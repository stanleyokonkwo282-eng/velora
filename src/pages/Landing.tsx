import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  KeyRound,
  Lock,
  Sparkles,
  CalendarDays,
  Shield,
  Workflow,
  Clapperboard,
  Globe2,
} from "lucide-react";
import { PLATFORMS } from "../lib/platforms";
import { PlatformGlyph } from "../lib/platforms";

const FEATURES = [
  {
    icon: KeyRound,
    title: "Bring your own OAuth",
    body: "Production keys stay in your vault. AES-256-GCM at rest, PKCE where the network requires it, and a provider factory that never shares secrets across tenants.",
  },
  {
    icon: CalendarDays,
    title: "A calendar that behaves",
    body: "Day, week, month. Drag to reschedule. Posting sets, first comments, delays, and evergreen loops — one queue, every dialect.",
  },
  {
    icon: Sparkles,
    title: "AI that learned your house",
    body: "Brand-voice DNA, virality scoring, caption variants, and MCP agents that can schedule from a sentence. Not a chatbot taped to a textarea.",
  },
  {
    icon: Workflow,
    title: "Plugs & approvals",
    body: "Internal accounts warm the room. Global plugs fire on metrics. Legal, client, and editor roles sit on a real approval rail.",
  },
  {
    icon: Clapperboard,
    title: "9:16, without leaving",
    body: "Auto-crop long masters into Shorts, Reels, and TikToks. A Canva-grade stills editor and a DAM sit beside the composer.",
  },
  {
    icon: Globe2,
    title: "25+ networks, one API",
    body: "X, LinkedIn, Meta, TikTok, YouTube, Threads, Pinterest, Reddit, Bluesky, Mastodon, Discord, Google Business, Skool, Listmonk — plus commerce.",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-[#070E24] text-white">
      <div className="mesh noise min-h-screen">
        <header className="mx-auto max-w-7xl px-6 py-5 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" className="h-9 w-9 rounded-xl object-cover" alt="" />
            <span className="font-semibold tracking-tight">Velora</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-blue-100/80">
            <a href="#product" className="hover:text-white">Product</a>
            <a href="#platforms" className="hover:text-white">Networks</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login" className="text-sm text-blue-100/80 hover:text-white">Sign in</Link>
            <Link
              to="/login"
              className="h-10 px-4 rounded-xl bg-white text-royal-950 text-sm font-semibold inline-flex items-center gap-2"
            >
              Open the studio <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
              <Lock size={12} /> Enterprise vault · AES-256-GCM
            </div>
            <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-[72px] leading-[1.05] tracking-tight">
              The social operating system for houses that refuse to look ordinary.
            </h1>
            <p className="mt-6 text-lg text-blue-100/80 max-w-2xl leading-relaxed">
              Velora is what Postiz would be if it were built for brand teams, agencies, and operators who own their OAuth relationship. Schedule, approve, clip, and publish across 25+ networks — without renting someone else's keys.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="h-12 px-5 rounded-xl bg-royal-600 hover:bg-royal-500 text-white font-semibold inline-flex items-center gap-2"
              >
                Enter the command center <ArrowRight size={16} />
              </Link>
              <a
                href="#product"
                className="h-12 px-5 rounded-xl border border-white/20 hover:bg-white/5 font-medium inline-flex items-center"
              >
                See the architecture
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-blue-100/70">
              {["BYO OAuth + PKCE", "BullMQ durable queue", "First-comment automation", "Crisis kill-switch"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <Check size={14} className="text-emerald-300" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-4">
            <PreviewCard title="Composer" kicker="9:16 + desktop">
              <div className="flex gap-3">
                <div className="phone-frame rounded-[28px] w-28 h-48 p-2">
                  <div className="h-full rounded-[20px] bg-gradient-to-b from-royal-700 to-royal-950 p-3">
                    <div className="text-[9px] text-blue-100/70">@maison.atelier</div>
                    <div className="mt-2 h-20 rounded-lg bg-white/10" />
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 bg-white/40 rounded w-full" />
                      <div className="h-1.5 bg-white/25 rounded w-4/5" />
                      <div className="h-1.5 bg-white/20 rounded w-2/3" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-white text-ink p-3">
                  <div className="text-[10px] font-semibold text-royal-800">Virality 84</div>
                  <div className="mt-2 text-[11px] leading-relaxed text-slate-600">
                    Quiet luxury is a supply chain, not a filter…
                  </div>
                  <div className="mt-3 h-1.5 rounded bg-royal-100 overflow-hidden">
                    <div className="h-full w-4/5 bg-royal-600" />
                  </div>
                </div>
              </div>
            </PreviewCard>
            <PreviewCard title="Calendar" kicker="Week · WAT">
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={d + i} className="text-[9px] text-blue-100/50 text-center">{d}</div>
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-lg bg-white/5 p-1 space-y-1">
                    {i % 2 === 0 && <div className="h-4 rounded bg-royal-500/80" />}
                    {i === 2 && <div className="h-4 rounded bg-emerald-400/80" />}
                    {i === 4 && <div className="h-4 rounded bg-amber-300/80" />}
                  </div>
                ))}
              </div>
            </PreviewCard>
            <PreviewCard title="Vault" kicker="User-supplied secrets">
              <div className="space-y-2">
                {["X API v2 · PKCE", "LinkedIn Community", "Meta Graph"].map((r) => (
                  <div key={r} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                    <span className="text-xs">{r}</span>
                    <span className="text-[10px] font-mono text-emerald-300">AES-256</span>
                  </div>
                ))}
              </div>
            </PreviewCard>
          </div>
        </section>
      </div>

      <section id="platforms" className="bg-white text-ink py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-royal-700">Networks</div>
          <h2 className="mt-2 font-serif text-4xl">Twenty-four surfaces. One composer.</h2>
          <p className="mt-3 text-slate-500 max-w-2xl">
            Connect with Velora's managed apps or bring your own Client ID & secret. Tokens never leave the vault unencrypted.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PLATFORMS.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 p-4 hover:border-royal-200 hover:shadow-card transition">
                <div className="h-9 w-9 rounded-xl grid place-items-center text-white" style={{ background: p.color }}>
                  <PlatformGlyph id={p.id} size={16} />
                </div>
                <div className="mt-3 text-sm font-semibold">{p.name}</div>
                <div className="text-[11px] text-slate-500">{p.api}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="bg-slate-50 text-ink py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-royal-700">Beyond Postiz</div>
            <h2 className="mt-2 font-serif text-4xl">Premium where it actually matters.</h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-card">
                <div className="h-10 w-10 rounded-xl bg-royal-50 text-royal-800 grid place-items-center">
                  <f.icon size={18} />
                </div>
                <div className="mt-4 text-lg font-semibold">{f.title}</div>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white text-ink py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-serif text-4xl">Studios, agencies, houses.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            <Price
              name="Studio"
              price="48"
              blurb="For in-house teams who want the vault."
              items={["10 accounts", "AI copilot", "Calendar + composer", "1 workspace"]}
            />
            <Price
              name="Agency"
              price="149"
              featured
              blurb="Client rooms, approvals, white-label."
              items={["Unlimited accounts", "Client groups", "Plugs & RSS", "API + webhooks", "Approval rails"]}
            />
            <Price
              name="Enterprise"
              price="Talk"
              blurb="SSO, residency, dedicated vault."
              items={["SSO / SAML", "EU or US vault", "MCP agents", "SLA + on-call", "Custom OAuth apps"]}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#070E24] text-blue-100/70 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-center gap-2 text-white">
            <img src="/logo-mark.png" className="h-7 w-7 rounded-lg" alt="" />
            Velora
          </div>
          <div className="text-sm">© 2026 Velora Atelier. Built for operators.</div>
          <div className="sm:ml-auto flex items-center gap-2 text-xs">
            <Shield size={12} /> SOC2-ready vault · Lagos / London / Lisbon
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewCard({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[11px] text-blue-100/60">{kicker}</div>
      </div>
      {children}
    </div>
  );
}

function Price({
  name,
  price,
  blurb,
  items,
  featured,
}: {
  name: string;
  price: string;
  blurb: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <div className={featured ? "rounded-3xl p-6 bg-royal-800 text-white shadow-lift" : "rounded-3xl p-6 border border-slate-200"}>
      <div className="text-sm font-semibold">{name}</div>
      <div className="mt-3 flex items-end gap-1">
        {price === "Talk" ? (
          <span className="text-4xl font-serif">Let's talk</span>
        ) : (
          <>
            <span className="text-4xl font-serif">${price}</span>
            <span className="text-sm opacity-70 mb-1">/seat</span>
          </>
        )}
      </div>
      <p className={`mt-2 text-sm ${featured ? "text-blue-100/80" : "text-slate-500"}`}>{blurb}</p>
      <ul className="mt-6 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check size={14} /> {i}
          </li>
        ))}
      </ul>
      <Link
        to="/login"
        className={
          featured
            ? "mt-8 h-11 rounded-xl bg-white text-royal-900 font-semibold grid place-items-center"
            : "mt-8 h-11 rounded-xl bg-royal-800 text-white font-semibold grid place-items-center"
        }
      >
        Start
      </Link>
    </div>
  );
}

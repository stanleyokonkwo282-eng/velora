# Velora — the social operating system

Premium social command center inspired by Postiz, designed for brand teams, agencies, and houses that refuse to rent someone else's OAuth keys.

This repository ships the **Velora product** (Vite + React) plus the **enterprise architecture artifacts** from the technical master specification (Prisma, Docker Compose, AES-256-GCM encryption service).

## Getting started

```bash
npm install
npm run dev
```

Open the app and create an account — every new workspace starts with a **7-day free trial** (no card required). When the trial ends, pick a plan on the paywall to keep publishing.

## Accepting payments (Paystack)

1. Checkout uses your Paystack **public** key: `VITE_PAYSTACK_PUBLIC_KEY` in `.env`.
2. Verifying a charge needs your **secret** key — that must only live on a server endpoint (never in this front end). Point Velora at it with `VITE_PAYSTACK_VERIFY_URL` (see `README-PAYMENTS.md`).

## What you can do

- **Command center** — live telemetry, queue, token health, best-time windows
- **Composer** — posting sets, virality score, AI variants, first comment, 9:16 + desktop preview
- **Calendar** — month / week / day, drag-and-drop reschedule
- **Accounts & OAuth** — 24 networks, BYO Client ID/Secret, simulated PKCE handshake, AES vault preview
- **Inbox** — comments, DMs, reviews, sentiment + SLA
- **AI Studio** — brand voices, idea radar, MCP agent parser
- **Media + Video lab** — stills editor, 9:16 auto-crop plan
- **Plugs, RSS, bulk CSV, evergreen loops**
- **Team approvals, client rooms, campaigns**
- **API console + webhooks** (n8n / Make / Zapier)
- **Link in bio**, competitor radar, crisis kill-switch
- **⌘K** command palette

## Beyond Postiz

| Velora | Typical scheduler |
| --- | --- |
| Bring-your-own OAuth, sealed AES-256-GCM | Platform-owned apps only |
| Client rooms with white-label walls | Flat account lists |
| Approval rail (editor → legal → client) | Publish-or-draft |
| First-comment + internal/global plugs | Manual engagement |
| 9:16 crop lab + DAM | Attach and hope |
| Crisis kill-switch | Delete and pray |
| MCP agents + REST | Zapier as an afterthought |
| Virality score + brand-voice DNA | Generic caption bot |

## Production architecture (spec)

```
[Next.js / this UI] ── REST ──► [NestJS API]
                                   │
                                   ├── PostgreSQL (Prisma)
                                   ├── Redis + BullMQ publishing queue
                                   └── Worker dispatcher → social network APIs
```

See `architecture/`:

- `prisma/schema.prisma` — workspaces, vaulted tokens, post queue
- `docker-compose.yml` — Postgres 15 + Redis 7
- `encryption.service.ts` — `encrypt` / `decrypt` with aes-256-gcm

Provider factory (target): X API v2 PKCE, LinkedIn Community Management, Meta Graph (Facebook Pages & Instagram Business), plus TikTok, YouTube, Threads, Pinterest, Reddit, Bluesky, Mastodon, Discord, Google Business, Skool, Listmonk, Telegram, WhatsApp, Snapchat, Twitch, Slack, Medium, Tumblr, WordPress, Shopify.

## Brand

Deep premium blue canvas with white ink. Royal blue `#1E40AF` / `#2563EB` accents over deep navy `#050D2A` / `#071238`.

OAuth tokens stay sealed in the vault preview. Never paste live production secrets into a public preview — Paystack secret keys belong on your server, never in this front end.

# Velora — Deploy to Vercel (GitHub-connected)

Repo: https://github.com/stanleyokonkwo282-eng/velora (public, branch `main`)
Root: repository root IS the Vite app (`package.json`, `vercel.json` live at `/`).

## 1. Import on the Vercel dashboard (recommended, no CLI token needed)

1. Open https://vercel.com/new
2. `Import Git Repository` → select `stanleyokonkwo282-eng/velora` → `Import`
3. Project name: `velora` (this aims for `velora.vercel.app`; if taken Vercel will
   suggest e.g. `velora-xxx` — accept it or pick another free `.vercel.app` name)
4. Framework Preset: **Vite** (auto-detected from `vercel.json`)
5. Build & Output (already in `vercel.json`, leave as-is):
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Environment Variables → add the **public** values from your local `.env`
   (see `.env.example` for key names — copy values from your own machine, never
   from chat history):
   - `VITE_PAYSTACK_PUBLIC_KEY` (the `pk_live_...` / `pk_test_...` key)
   - `VITE_PAYSTACK_VERIFY_URL` (leave empty until your verify server exists)
   - `VITE_ADMIN_EMAIL`
   - `VITE_SUPPORT_EMAIL`
   - ⚠️ NEVER add a Paystack SECRET key (`sk_live_...` / `sk_test_...`) to Vercel
     or any `VITE_*` variable — `VITE_*` ships in the browser bundle.
7. `Deploy` → Vercel builds (`tsc -b && vite build`) and serves `dist/`.
8. SPA routing is handled by `vercel.json` rewrites (`/(.*)` → `/index.html`),
   so `/login`, `/app/*`, `/admin` all resolve.

## 2. CLI alternative (only if you prefer terminal)

```powershell
npm i -g vercel@latest
cd velora
vercel login        # browser login — no token paste needed
vercel link         # pick scope → project `velora`, confirm root `./`
vercel env add VITE_PAYSTACK_PUBLIC_KEY production
vercel env add VITE_ADMIN_EMAIL production
vercel env add VITE_SUPPORT_EMAIL production
vercel --prod
```

## 3. Security note (read me)

Any token pasted into chat must be treated as compromised: rotate/revoke it at
its provider (Vercel → Account → Tokens, GitHub → Settings → Developer
settings → Personal access tokens) and generate a fresh one if CLI access is
needed. This repo is configured so `.env` / `.env.*` can never be committed
(see `.gitignore`); only `.env.example` (placeholders) is tracked.

import React, { useState } from "react";
import { KeyRound, Lock, Plus, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { useStore } from "../lib/store";
import { PLATFORMS, PlatformGlyph, platformById } from "../lib/platforms";
import { Badge, Button, Card, Field, inputClass, Modal, PageHeader, PillTab, Toggle } from "../components/UI";
import { encryptPreview, fmt, rel } from "../lib/utils";
import type { CustomKeys, PlatformId } from "../lib/types";

export function Accounts() {
  const { accounts, connectAccount, disconnectAccount, saveKeys } = useStore();
  const [tab, setTab] = useState<"connected" | "catalog">("connected");
  const [connectFor, setConnectFor] = useState<PlatformId | null>(null);
  const [keysFor, setKeysFor] = useState<string | null>(null);
  const [byo, setByo] = useState(true);
  const [form, setForm] = useState<CustomKeys>({
    clientId: "",
    clientSecret: "",
    redirectUri: "https://app.velora.io/oauth/callback",
  });
  const [accountName, setAccountName] = useState("");
  const [handle, setHandle] = useState("");
  const [stage, setStage] = useState<"form" | "oauth" | "done">("form");

  const meta = connectFor ? platformById(connectFor) : null;
  const keyAcc = accounts.find((a) => a.id === keysFor);

  function startConnect(id: PlatformId) {
    setConnectFor(id);
    setStage("form");
    setByo(true);
    setAccountName("");
    setHandle("");
    const p = platformById(id);
    setForm({
      clientId: "",
      clientSecret: "",
      redirectUri: `https://app.velora.io/oauth/${id}`,
    });
  }

  function simulateOauth() {
    setStage("oauth");
    setTimeout(() => {
      if (!connectFor) return;
      connectAccount({
        platform: connectFor,
        accountName: accountName || `New ${platformById(connectFor).name}`,
        handle: handle || "@new",
        usingVeloraKeys: !byo,
        customKeys: byo ? { ...form, encrypted: true } : null,
      });
      setStage("done");
    }, 1100);
  }

  return (
    <div>
      <PageHeader
        kicker="Accounts & OAuth"
        title="Your keys. Our queue."
        subtitle="Connect with Velora's managed applications or bring your own Client ID and secret. Secrets are encrypted with AES-256-GCM before they touch disk — we never see them in plaintext after save."
        actions={
          <PillTab
            value={tab}
            onChange={(v) => setTab(v as typeof tab)}
            items={[
              { id: "connected", label: `Connected · ${accounts.filter((a) => a.connected).length}` },
              { id: "catalog", label: "All networks" },
            ]}
          />
        }
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={16} className="text-emerald-600" /> Vault
          </div>
          <p className="mt-2 text-sm text-slate-500">AES-256-GCM · unique IV per secret · key from KMS.</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <KeyRound size={16} className="text-royal-700" /> Provider factory
          </div>
          <p className="mt-2 text-sm text-slate-500">PKCE for X & Bluesky. Meta Graph for IG + Facebook Pages.</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Lock size={16} className="text-slate-700" /> Isolation
          </div>
          <p className="mt-2 text-sm text-slate-500">Client rooms never share tokens. Refresh is per-account.</p>
        </Card>
      </div>

      {tab === "connected" ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((a) => {
            const p = platformById(a.platform);
            return (
              <Card key={a.id}>
                <div className="flex items-start gap-3">
                  <div
                    className="h-11 w-11 rounded-2xl grid place-items-center text-white"
                    style={{ background: p.color }}
                  >
                    <PlatformGlyph id={a.platform} size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{a.accountName}</div>
                    <div className="text-xs text-slate-500">{a.handle} · {fmt(a.followers)} followers</div>
                  </div>
                  <Badge tone={a.health === "healthy" ? "green" : a.health === "expiring" ? "amber" : "rose"}>
                    {a.health}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>API · {p.api}</div>
                  <div>OAuth · {p.oauth}</div>
                  <div>{a.usingVeloraKeys ? "Velora managed keys" : "BYO vaulted keys"}</div>
                  <div>{a.expiresAt ? `Exp ${rel(a.expiresAt)}` : "Expired"}</div>
                </div>
                {a.customKeys && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-2 font-mono text-[10px] text-slate-500">
                    {encryptPreview(a.customKeys.clientId + "secret")}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setKeysFor(a.id)}>
                    <KeyRound size={12} /> Keys
                  </Button>
                  {a.connected ? (
                    <Button size="sm" variant="ghost" onClick={() => disconnectAccount(a.id)}>
                      <Unplug size={12} /> Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => startConnect(a.platform)}>
                      <RefreshCw size={12} /> Reconnect
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {PLATFORMS.map((p) => {
            const n = accounts.filter((a) => a.platform === p.id && a.connected).length;
            return (
              <Card key={p.id} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl grid place-items-center text-white" style={{ background: p.color }}>
                    <PlatformGlyph id={p.id} size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.oauth} · {p.limit.toLocaleString()} chars</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500 flex-1">{p.api}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.scopes.slice(0, 2).map((s) => (
                    <span key={s} className="text-[10px] bg-slate-100 rounded px-1.5 py-0.5 font-mono">{s}</span>
                  ))}
                </div>
                <Button className="w-full mt-4" size="sm" onClick={() => startConnect(p.id)}>
                  <Plus size={12} /> {n ? `Add another · ${n} live` : "Connect"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!connectFor}
        onClose={() => setConnectFor(null)}
        title={meta ? `Connect ${meta.name}` : "Connect"}
        subtitle={meta ? `${meta.api} · ${meta.oauth}` : ""}
      >
        {stage === "form" && meta && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <div>
                <div className="text-sm font-semibold">Bring your own credentials</div>
                <div className="text-xs text-slate-500">Recommended for production. Encrypted at rest.</div>
              </div>
              <Toggle on={byo} onChange={setByo} />
            </div>
            {byo && (
              <>
                <Field label="Client ID">
                  <input className={inputClass} value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} placeholder={`${meta.id.toUpperCase()}_CLIENT_ID`} />
                </Field>
                <Field label="Client secret">
                  <input className={inputClass} type="password" value={form.clientSecret} onChange={(e) => setForm({ ...form, clientSecret: e.target.value })} placeholder="Will be AES-256-GCM sealed" />
                </Field>
                <Field label="Redirect URI">
                  <input className={inputClass} value={form.redirectUri} onChange={(e) => setForm({ ...form, redirectUri: e.target.value })} />
                </Field>
              </>
            )}
            {!byo && (
              <div className="rounded-xl bg-royal-50 text-royal-900 p-3 text-sm">
                Using Velora managed OAuth app. Fine for evaluation — switch to BYO before production volume.
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Display name">
                <input className={inputClass} value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Atelier HQ" />
              </Field>
              <Field label="Handle">
                <input className={inputClass} value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@atelier" />
              </Field>
            </div>
            <Button className="w-full" onClick={simulateOauth}>
              Continue to {meta.name} OAuth
            </Button>
          </div>
        )}
        {stage === "oauth" && (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-royal-50 grid place-items-center text-royal-800 mb-3">
              <Lock size={18} />
            </div>
            <div className="font-semibold">Waiting on the provider…</div>
            <p className="text-sm text-slate-500 mt-1">PKCE challenge issued. Token exchange will be sealed on return.</p>
            <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-2/3 bg-royal-600 animate-pulse" />
            </div>
          </div>
        )}
        {stage === "done" && (
          <div className="py-6 text-center">
            <div className="font-semibold text-emerald-700">Connected & vaulted</div>
            <p className="text-sm text-slate-500 mt-1">Refresh token stored as AES-256-GCM. You can rotate keys anytime.</p>
            <Button className="mt-4" onClick={() => setConnectFor(null)}>Done</Button>
          </div>
        )}
      </Modal>

      <Modal
        open={!!keysFor}
        onClose={() => setKeysFor(null)}
        title="Vaulted credentials"
        subtitle={keyAcc ? `${keyAcc.accountName} · ${platformById(keyAcc.platform).api}` : ""}
      >
        {keyAcc && (
          <div className="space-y-3">
            <Field label="Client ID">
              <input
                className={inputClass}
                defaultValue={keyAcc.customKeys?.clientId || ""}
                placeholder="Paste production client id"
                onBlur={(e) =>
                  saveKeys(keyAcc.id, {
                    clientId: e.target.value,
                    clientSecret: keyAcc.customKeys?.clientSecret || "",
                    redirectUri: keyAcc.customKeys?.redirectUri || "https://app.velora.io/oauth/callback",
                  })
                }
              />
            </Field>
            <Field label="Client secret (write-only)">
              <input className={inputClass} type="password" placeholder="••••••••  ·  re-enter to rotate" />
            </Field>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 font-mono">
              ciphertext · {encryptPreview(keyAcc.id + "token")}
            </div>
            <Button className="w-full" onClick={() => setKeysFor(null)}>Seal & close</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

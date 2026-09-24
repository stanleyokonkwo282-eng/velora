import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Button, Card, Field, PageHeader, Toggle, inputClass } from "../components/UI";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const { workspace, signatures, crisis, setCrisis } = useStore();
  const [delay, setDelay] = useState("12");
  const [tz, setTz] = useState("Africa/Lagos");
  const nav = useNavigate();

  return (
    <div>
      <PageHeader kicker="Settings" title="The house rules." subtitle="Signatures, cadence, residency, and the switch you hope you never need." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <div className="text-sm font-semibold">Workspace</div>
          <div className="mt-4 space-y-3">
            <Field label="Name"><input className={inputClass} defaultValue={workspace.name} /></Field>
            <Field label="Slug"><input className={inputClass} defaultValue={workspace.slug} /></Field>
            <Field label="Timezone">
              <select className={inputClass} value={tz} onChange={(e) => setTz(e.target.value)}>
                <option>Africa/Lagos</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
                <option>Europe/Lisbon</option>
              </select>
            </Field>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Publishing cadence</div>
          <p className="text-sm text-slate-500 mt-1">Human delay between posts in a set, so nothing lands on the same second.</p>
          <div className="mt-4">
            <Field label="Default delay (seconds)">
              <input className={inputClass} value={delay} onChange={(e) => setDelay(e.target.value)} />
            </Field>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Crisis kill-switch</div>
              <div className="text-xs text-slate-500">Freezes the queue. Approvals still work.</div>
            </div>
            <Toggle on={crisis} onChange={setCrisis} />
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Signatures</div>
          <div className="mt-3 space-y-2">
            {signatures.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">{s.name}</div>
                <div className="text-sm mt-1">{s.text}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-semibold">Vault & residency</div>
          <p className="text-sm text-slate-500 mt-2">{workspace.region}</p>
          <p className="text-sm text-slate-500 mt-2">ENCRYPTION_KEY is loaded from KMS at boot. Tokens encrypted with AES-256-GCM, unique IV, auth tag stored beside ciphertext.</p>
          <Button
            className="mt-6"
            variant="danger"
            onClick={() => {
              localStorage.removeItem("velora.auth");
              document.dispatchEvent(new Event("velora:auth"));
              nav("/");
            }}
          >
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  );
}

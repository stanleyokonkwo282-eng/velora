import React, { useEffect, useState } from "react";
import { Fingerprint, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Modal, Button, Field } from "./UI";
import {
  adminLockRemainingMs,
  isCryptoAvailable,
  maskedAdminEmail,
  signInAdmin,
  verifyAdminCredentials,
} from "../lib/adminAuth";
import { cn } from "../lib/utils";

/**
 * The hidden owner door. Reached only from the Velora mark on the sign-in
 * screen (five quick taps, one long press, or Ctrl/Cmd + Shift + A).
 *
 * The passphrase is checked against a PBKDF2-SHA256 digest — nothing secret is
 * stored in the bundle, and repeated guesses are throttled.
 */
export function AdminLoginModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    setFailed(false);
    setPassword("");
    setLockSeconds(Math.ceil(adminLockRemainingMs() / 1000));
  }, [open]);

  useEffect(() => {
    if (!lockSeconds) return;
    const id = window.setInterval(() => {
      setLockSeconds((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [lockSeconds]);

  const cryptoReady = isCryptoAvailable();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFailed(false);
    setMessage(null);
    try {
      const result = await verifyAdminCredentials(email, password);
      if (result.ok) {
        signInAdmin();
        setMessage(null);
        onSuccess();
        onClose();
        return;
      }
      setFailed(true);
      setMessage(result.message ?? "Those credentials were rejected.");
      if (result.lockSeconds) setLockSeconds(result.lockSeconds);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Owner access"
      subtitle="Restricted console. This door is not linked from anywhere."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-azure-300" />
          <div>
            Verified against a PBKDF2-SHA256 digest in the browser. {maskedAdminEmail()} is the only
            accepted identity.
          </div>
        </div>

        <Field label="Owner email">
          <input
            className="field"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={maskedAdminEmail()}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </Field>

        <Field label="Passphrase">
          <input
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
          />
        </Field>

        {!cryptoReady && (
          <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            This page is not running in a secure context, so the browser hides Web Crypto. Open
            Velora on <b>https://</b> or on <b>localhost</b> to use owner access.
          </div>
        )}

        {lockSeconds > 0 && (
          <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-xs text-rose-100">
            Too many failed attempts. Try again in {Math.ceil(lockSeconds / 60)} minute
            {Math.ceil(lockSeconds / 60) === 1 ? "" : "s"}.
          </div>
        )}

        {message && (
          <div
            role="alert"
            className={cn(
              "rounded-xl border p-3 text-xs",
              failed
                ? "border-rose-300/30 bg-rose-500/10 text-rose-100"
                : "border-white/10 bg-white/5 text-slate-200"
            )}
          >
            {message}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className={cn("flex-1", failed && "animate-pulse")}
            disabled={busy || lockSeconds > 0 || !cryptoReady}
          >
            {busy ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Deriving key…
              </>
            ) : (
              <>
                <Lock size={15} /> Unlock console
              </>
            )}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Fingerprint size={12} /> Sessions expire after 12 hours and are bound to this browser.
        </p>
      </form>
    </Modal>
  );
}

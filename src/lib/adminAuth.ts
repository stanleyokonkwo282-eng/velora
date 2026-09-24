/**
 * Hidden administrator access for the Velora console.
 *
 * The owner signs in from the Velora mark on the sign-in screen (five quick
 * taps, a long press, or Ctrl/Cmd + Shift + A) — nothing public links to it.
 *
 * SECURITY MODEL — please read before you change anything here:
 *   • The passphrase is never stored. Only a PBKDF2-SHA256 digest (210 000
 *     iterations, unique salt) ships, and the browser re-derives it with Web
 *     Crypto. Reading the bundle does not reveal the password.
 *   • Client-side gates are deterrents, not strongholds: whoever controls the
 *     browser can edit localStorage. Treat this as a private door on the UI and
 *     enforce real authorisation in your API (the NestJS/Prisma layer in
 *     `architecture/`) before exposing admin actions to the network.
 *   • Web Crypto needs a secure context, so admin sign-in works on localhost and
 *     over HTTPS. On a plain-HTTP LAN address the browser hides it — which is
 *     the correct behaviour, and the form says so.
 *
 * To change the passphrase, regenerate the digest and paste it below:
 *
 *   node -e "const c=require('crypto');const salt=c.randomBytes(16);
 *   const key=c.pbkdf2Sync(process.argv[1],salt,210000,32,'sha256');
 *   console.log('salt:',salt.toString('base64'));
 *   console.log('hash:',key.toString('base64'))" 'YourNewPassphrase'
 */

const ADMIN_EMAIL_FALLBACK = "stanley.okonkwo282@gmail.com";

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || ADMIN_EMAIL_FALLBACK)
  .trim()
  .toLowerCase();

/** PBKDF2-SHA256 · 210 000 iterations · 32-byte key. */
const ADMIN_DIGEST = {
  saltB64: "2oDEG7zmc/8jmrZBijDj5A==",
  hashB64: "Ghg0tErRm1YC5RQucZX7HUCm5iMJNLvymnHZDs4pPAE=",
  iterations: 210000,
  lengthBits: 256,
};

const SESSION_KEY = "velora.admin.session.v1";
const THROTTLE_KEY = "velora.admin.throttle.v1";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export const ADMIN_EVENT = "velora:admin";

export type AdminFailure = "email" | "password" | "throttled" | "insecure" | "unknown";

export interface AdminAuthResult {
  ok: boolean;
  reason?: AdminFailure;
  message?: string;
  attemptsLeft?: number;
  lockSeconds?: number;
}

export interface AdminSession {
  email: string;
  issuedAt: number;
  expiresAt: number;
}

interface ThrottleState {
  failures: number;
  lockedUntil: number;
}

/* --------------------------------------------------------------- helpers -- */

function safeLocalStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const store = safeLocalStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  const store = safeLocalStorage();
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the session simply will not persist */
  }
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/** Length-independent comparison, so timing does not leak the digest. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isCryptoAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.subtle !== "undefined" &&
    typeof window.crypto.subtle.deriveBits === "function" &&
    window.isSecureContext !== false
  );
}

/** Shown as a hint on the hidden form, e.g. `st•••••••••••@g••••.com`. */
export function maskedAdminEmail(): string {
  const [local, domain = ""] = ADMIN_EMAIL.split("@");
  const head = local.slice(0, 2);
  const tld = domain.includes(".") ? domain.slice(domain.lastIndexOf(".")) : "";
  return `${head}${"•".repeat(Math.max(local.length - 2, 3))}@${domain.slice(
    0,
    1
  )}${"•".repeat(Math.max(domain.length - 4, 2))}${tld}`;
}

/* ------------------------------------------------------------- throttle --- */

function readThrottle(): ThrottleState {
  const state = readJson<ThrottleState>(THROTTLE_KEY);
  if (!state || typeof state.failures !== "number") return { failures: 0, lockedUntil: 0 };
  return state;
}

export function adminLockRemainingMs(): number {
  const { lockedUntil } = readThrottle();
  return Math.max(0, lockedUntil - Date.now());
}

function registerFailure(): number {
  const state = readThrottle();
  const failures = state.failures + 1;
  if (failures >= MAX_ATTEMPTS) {
    writeJson(THROTTLE_KEY, { failures: 0, lockedUntil: Date.now() + LOCKOUT_MS });
    return 0;
  }
  writeJson(THROTTLE_KEY, { failures, lockedUntil: 0 });
  return MAX_ATTEMPTS - failures;
}

function clearThrottle(): void {
  try {
    safeLocalStorage()?.removeItem(THROTTLE_KEY);
  } catch {
    /* ignore */
  }
}

/* -------------------------------------------------------------- session --- */

function announce(): void {
  if (typeof document !== "undefined") {
    document.dispatchEvent(new Event(ADMIN_EVENT));
  }
}

export function adminSession(): AdminSession | null {
  const session = readJson<AdminSession>(SESSION_KEY);
  if (!session?.expiresAt) return null;
  if (session.expiresAt <= Date.now()) {
    signOutAdmin();
    return null;
  }
  return session;
}

export function isAdminSession(): boolean {
  return adminSession() !== null;
}

export function adminSessionMinutesLeft(): number {
  const session = adminSession();
  if (!session) return 0;
  return Math.max(0, Math.round((session.expiresAt - Date.now()) / 60000));
}

export function signInAdmin(): AdminSession {
  const now = Date.now();
  const session: AdminSession = {
    email: ADMIN_EMAIL,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  writeJson(SESSION_KEY, session);
  clearThrottle();
  announce();
  return session;
}

export function signOutAdmin(): void {
  try {
    safeLocalStorage()?.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  announce();
}

/* --------------------------------------------------------------- verify --- */

async function deriveDigest(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: base64ToBytes(ADMIN_DIGEST.saltB64),
      iterations: ADMIN_DIGEST.iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    ADMIN_DIGEST.lengthBits
  );
  return bytesToBase64(new Uint8Array(bits));
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  const lockedMs = adminLockRemainingMs();
  if (lockedMs > 0) {
    return {
      ok: false,
      reason: "throttled",
      lockSeconds: Math.ceil(lockedMs / 1000),
      message: "Too many attempts. This door is locked for a few minutes.",
    };
  }

  if (!isCryptoAvailable()) {
    return {
      ok: false,
      reason: "insecure",
      message:
        "Admin sign-in needs a secure context. Open Velora on https:// or on localhost, then try again.",
    };
  }

  const emailMatches = constantTimeEqual(email.trim().toLowerCase(), ADMIN_EMAIL);

  let digest = "";
  try {
    digest = await deriveDigest(password);
  } catch {
    return { ok: false, reason: "unknown", message: "Could not verify those credentials." };
  }

  if (emailMatches && constantTimeEqual(digest, ADMIN_DIGEST.hashB64)) {
    clearThrottle();
    return { ok: true };
  }

  const attemptsLeft = registerFailure();
  const suffix = `${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`;
  return {
    ok: false,
    reason: emailMatches ? "password" : "email",
    attemptsLeft,
    message: emailMatches
      ? `That passphrase is not right. ${suffix}`
      : `That email is not the owner of this workspace. ${suffix}`,
  };
}

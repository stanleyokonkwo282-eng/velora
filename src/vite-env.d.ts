/// <reference types="vite/client" />

/**
 * Client-visible environment variables.
 *
 * Anything declared here ships inside the JavaScript bundle, so it must be safe
 * for the public. The Paystack PUBLIC key (`pk_*`) belongs here. The Paystack
 * SECRET key (`sk_*`) must NEVER be added to a VITE_ variable — keep it on your
 * server (see README → "Accepting payments").
 */
interface ImportMetaEnv {
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string;
  readonly VITE_PAYSTACK_VERIFY_URL?: string;
  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


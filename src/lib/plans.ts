/**
 * Velora plans, pricing and currencies.
 *
 * Velora is sold globally, so every plan carries a local price in each currency
 * Paystack can settle: NGN, USD, GHS, KES and ZAR. Amounts here are whole units
 * and converted to the smallest currency unit (kobo / cents / pesewas) at
 * checkout, which is what Paystack's API expects.
 *
 * If you create recurring Plans in the Paystack dashboard, drop their `PLN_...`
 * codes into `planCodes` and checkout will start a real subscription instead of
 * a one-off charge.
 */

export const TRIAL_DAYS = 7;

export const SUPPORT_EMAIL = (import.meta.env.VITE_SUPPORT_EMAIL || "support@velora.io").trim();

export type CurrencyCode = "NGN" | "USD" | "GHS" | "KES" | "ZAR";
export type PlanId = "starter" | "growth" | "scale" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  symbol: string;
  /** Markets Paystack settles this currency in. */
  markets: string;
  /** Paystack expects integers in the smallest unit. */
  minorPerUnit: number;
}

export const CURRENCIES: CurrencyMeta[] = [
  {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    markets: "Global · cards worldwide",
    minorPerUnit: 100,
  },
  {
    code: "NGN",
    label: "Nigerian Naira",
    symbol: "₦",
    markets: "Nigeria · cards, USSD, bank transfer",
    minorPerUnit: 100,
  },
  {
    code: "GHS",
    label: "Ghanaian Cedi",
    symbol: "GH₵",
    markets: "Ghana · cards, mobile money",
    minorPerUnit: 100,
  },
  {
    code: "KES",
    label: "Kenyan Shilling",
    symbol: "KSh",
    markets: "Kenya · cards, M-PESA",
    minorPerUnit: 100,
  },
  {
    code: "ZAR",
    label: "South African Rand",
    symbol: "R",
    markets: "South Africa · cards, EFT",
    minorPerUnit: 100,
  },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export function currencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Who the plan is built for — used in the pricing grid. */
  audience: string;
  highlights: string[];
  limits: { brands: string; channels: string; seats: string; queue: string };
  prices: Record<CurrencyCode, { monthly: number; annual: number }>;
  /** Optional Paystack plan codes for true recurring billing. */
  planCodes?: { monthly?: string; annual?: string };
  popular?: boolean;
  contactOnly?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Everything a solo operator needs to publish like a studio.",
    audience: "Founders and solo creators",
    highlights: [
      "Command center, calendar and composer",
      "Bring-your-own OAuth keys (client ID & secret)",
      "AI captions, virality score and first comment",
      "Media library with 9:16 crop lab",
      "Email support · 24h response",
    ],
    limits: {
      brands: "1 brand",
      channels: "6 channels",
      seats: "2 seats",
      queue: "200 posts / month",
    },
    prices: {
      USD: { monthly: 29, annual: 290 },
      NGN: { monthly: 24000, annual: 240000 },
      GHS: { monthly: 390, annual: 3900 },
      KES: { monthly: 3900, annual: 39000 },
      ZAR: { monthly: 549, annual: 5490 },
    },
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "The full operating system for an in-house brand team.",
    audience: "Brand teams and studios",
    popular: true,
    highlights: [
      "Everything in Starter, plus:",
      "Approval rail — editor → legal → client",
      "Inbox with sentiment, SLA and plugs",
      "RSS autopilot, evergreen loops, bulk CSV",
      "Competitor radar and campaign planning",
      "Client rooms with white-label walls",
      "Priority support · 4h response",
    ],
    limits: {
      brands: "5 brands",
      channels: "25 channels",
      seats: "15 seats",
      queue: "Unlimited posts",
    },
    prices: {
      USD: { monthly: 79, annual: 790 },
      NGN: { monthly: 65000, annual: 650000 },
      GHS: { monthly: 1090, annual: 10900 },
      KES: { monthly: 10900, annual: 109000 },
      ZAR: { monthly: 1490, annual: 14900 },
    },
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For agencies running many brands, many voices, one queue.",
    audience: "Agencies and multi-brand houses",
    highlights: [
      "Everything in Growth, plus:",
      "Unlimited brands and client rooms",
      "White-label portal on your own domain",
      "MCP agents + REST API console and webhooks",
      "SSO, audit log export and residency choice",
      "Named success manager · 1h response",
    ],
    limits: {
      brands: "Unlimited",
      channels: "Unlimited",
      seats: "Unlimited",
      queue: "Unlimited posts",
    },
    prices: {
      USD: { monthly: 199, annual: 1990 },
      NGN: { monthly: 165000, annual: 1650000 },
      GHS: { monthly: 2690, annual: 26900 },
      KES: { monthly: 26900, annual: 269000 },
      ZAR: { monthly: 3690, annual: 36900 },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Procurement-ready, security-reviewed, yours.",
    audience: "Regulated and listed companies",
    contactOnly: true,
    highlights: [
      "Everything in Scale, plus:",
      "Private cloud or on-premise deployment",
      "Custom DPA, security pack and pen-test reports",
      "SSO/SCIM, IP allow-listing, regional failover",
      "Solution architect and 99.99% SLA",
    ],
    limits: {
      brands: "Unlimited",
      channels: "Unlimited",
      seats: "Unlimited",
      queue: "Dedicated capacity",
    },
    prices: {
      USD: { monthly: 0, annual: 0 },
      NGN: { monthly: 0, annual: 0 },
      GHS: { monthly: 0, annual: 0 },
      KES: { monthly: 0, annual: 0 },
      ZAR: { monthly: 0, annual: 0 },
    },
  },
];

export function planById(id: PlanId | undefined | null): Plan | undefined {
  if (!id) return undefined;
  return PLANS.find((p) => p.id === id);
}

export function planName(id: PlanId | undefined | null): string {
  return planById(id)?.name ?? "Trial";
}

/** Whole-unit price for a plan, cycle and currency. */
export function priceFor(planId: PlanId, cycle: BillingCycle, currency: CurrencyCode): number {
  const plan = planById(planId);
  if (!plan) return 0;
  return plan.prices[currency]?.[cycle] ?? 0;
}

/** Paystack wants integers in the smallest unit (kobo, cents, pesewas). */
export function toMinorUnits(amount: number, currency: CurrencyCode): number {
  return Math.round(amount * currencyMeta(currency).minorPerUnit);
}

export function fromMinorUnits(amountMinor: number, currency: CurrencyCode): number {
  return amountMinor / currencyMeta(currency).minorPerUnit;
}

/** Locale-aware money so a customer in Lagos, Nairobi or Lisbon sees a native price. */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currencyMeta(currency).symbol}${amount.toLocaleString()}`;
  }
}

export function monthlyEquivalent(
  planId: PlanId,
  cycle: BillingCycle,
  currency: CurrencyCode
): string {
  const total = priceFor(planId, cycle, currency);
  const perMonth = cycle === "annual" ? Math.round(total / 12) : total;
  return formatMoney(perMonth, currency);
}

export function annualSavingPercent(planId: PlanId, currency: CurrencyCode): number {
  const monthly = priceFor(planId, "monthly", currency);
  const annual = priceFor(planId, "annual", currency);
  if (!monthly || !annual) return 0;
  const full = monthly * 12;
  return Math.round(((full - annual) / full) * 100);
}

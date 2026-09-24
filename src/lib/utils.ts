import { format, formatDistanceToNow, parseISO, addDays, startOfWeek } from "date-fns";
import type { PlatformId } from "./types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function avatarGradient(seed: string) {
  const palettes = [
    ["#1E40AF", "#60A5FA"],
    ["#0F766E", "#5EEAD4"],
    ["#7C3AED", "#C4B5FD"],
    ["#BE185D", "#F9A8D4"],
    ["#B45309", "#FCD34D"],
    ["#0369A1", "#7DD3FC"],
    ["#9F1239", "#FB7185"],
    ["#365314", "#A3E635"],
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const [a, b] = palettes[h % palettes.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function formatWhen(iso: string) {
  try {
    return format(parseISO(iso), "EEE, MMM d · h:mm a");
  } catch {
    return iso;
  }
}

export function rel(iso: string) {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function weekDays(anchor = new Date()) {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export const CHAR_LIMIT: Record<PlatformId, number> = {
  x: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  threads: 500,
  pinterest: 500,
  reddit: 40000,
  bluesky: 300,
  mastodon: 500,
  discord: 2000,
  gmb: 1500,
  skool: 5000,
  listmonk: 100000,
  telegram: 4096,
  whatsapp: 1024,
  snapchat: 80,
  twitch: 140,
  slack: 40000,
  medium: 100000,
  tumblr: 4096,
  wordpress: 100000,
  shopify: 5000,
};

export function scoreCopy(text: string, platforms: PlatformId[]) {
  let score = 42;
  if (text.length > 40) score += 8;
  if (text.length > 110) score += 6;
  if (/[?!]/.test(text)) score += 4;
  if (/#\w+/.test(text)) score += 6;
  if (/\b(you|your|we|our)\b/i.test(text)) score += 5;
  if (platforms.includes("instagram") && /#/.test(text)) score += 4;
  if (platforms.includes("linkedin") && text.length > 400) score += 6;
  if (platforms.includes("x") && text.length <= 240) score += 5;
  if (/\d/.test(text)) score += 3;
  if (text.split("\n").length >= 3) score += 4;
  return Math.max(12, Math.min(98, score));
}

export function shortLink(id: string) {
  return `vlr.a/${id.replace(/[^a-z0-9]/gi, "").slice(0, 7)}`;
}

export function encryptPreview(secret: string) {
  if (!secret) return "";
  return "AES-256-GCM · " + btoa(secret).slice(0, 22) + "…";
}

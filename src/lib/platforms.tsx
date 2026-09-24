import type { PlatformId } from "./types";

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  category: "social" | "video" | "community" | "commerce" | "owned";
  limit: number;
  oauth: "oauth2-pkce" | "oauth2" | "oauth1" | "api-key";
  color: string;
  scopes: string[];
  api: string;
  firstComment: boolean;
  threads: boolean;
  video: boolean;
}

export const PLATFORMS: PlatformMeta[] = [
  { id: "x", name: "X", category: "social", limit: 280, oauth: "oauth2-pkce", color: "#0F1419", scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"], api: "Twitter API v2", firstComment: true, threads: true, video: true },
  { id: "linkedin", name: "LinkedIn", category: "social", limit: 3000, oauth: "oauth2", color: "#0A66C2", scopes: ["w_member_social", "r_organization_social", "w_organization_social"], api: "Community Management API", firstComment: true, threads: false, video: true },
  { id: "facebook", name: "Facebook", category: "social", limit: 63206, oauth: "oauth2", color: "#1877F2", scopes: ["pages_manage_posts", "pages_read_engagement"], api: "Meta Graph API", firstComment: true, threads: false, video: true },
  { id: "instagram", name: "Instagram", category: "social", limit: 2200, oauth: "oauth2", color: "#E1306C", scopes: ["instagram_content_publish", "instagram_manage_comments"], api: "Meta Graph API", firstComment: true, threads: false, video: true },
  { id: "tiktok", name: "TikTok", category: "video", limit: 2200, oauth: "oauth2", color: "#111111", scopes: ["video.publish", "user.info.basic"], api: "TikTok Content Posting API", firstComment: false, threads: false, video: true },
  { id: "youtube", name: "YouTube", category: "video", limit: 5000, oauth: "oauth2", color: "#FF0000", scopes: ["youtube.upload", "youtube.force-ssl"], api: "YouTube Data API v3", firstComment: false, threads: false, video: true },
  { id: "threads", name: "Threads", category: "social", limit: 500, oauth: "oauth2", color: "#000000", scopes: ["threads_content_publish"], api: "Threads API", firstComment: true, threads: true, video: true },
  { id: "pinterest", name: "Pinterest", category: "social", limit: 500, oauth: "oauth2", color: "#E60023", scopes: ["pins:read", "pins:write"], api: "Pinterest API v5", firstComment: false, threads: false, video: true },
  { id: "reddit", name: "Reddit", category: "community", limit: 40000, oauth: "oauth2", color: "#FF4500", scopes: ["submit", "identity", "read"], api: "Reddit API", firstComment: true, threads: false, video: false },
  { id: "bluesky", name: "Bluesky", category: "social", limit: 300, oauth: "oauth2-pkce", color: "#1185FE", scopes: ["atproto"], api: "AT Protocol", firstComment: false, threads: true, video: true },
  { id: "mastodon", name: "Mastodon", category: "social", limit: 500, oauth: "oauth2", color: "#6364FF", scopes: ["write:statuses", "read:accounts"], api: "Mastodon REST", firstComment: false, threads: true, video: true },
  { id: "discord", name: "Discord", category: "community", limit: 2000, oauth: "oauth2", color: "#5865F2", scopes: ["webhook.incoming", "bot"], api: "Discord API", firstComment: false, threads: false, video: false },
  { id: "gmb", name: "Google Business", category: "owned", limit: 1500, oauth: "oauth2", color: "#4285F4", scopes: ["business.manage"], api: "Business Profile API", firstComment: false, threads: false, video: true },
  { id: "skool", name: "Skool", category: "community", limit: 5000, oauth: "api-key", color: "#FFD700", scopes: ["posts.write"], api: "Skool API", firstComment: false, threads: false, video: false },
  { id: "listmonk", name: "Listmonk", category: "owned", limit: 100000, oauth: "api-key", color: "#0055FF", scopes: ["campaigns"], api: "Listmonk REST", firstComment: false, threads: false, video: false },
  { id: "telegram", name: "Telegram", category: "community", limit: 4096, oauth: "api-key", color: "#26A5E4", scopes: ["bot"], api: "Bot API", firstComment: false, threads: false, video: true },
  { id: "whatsapp", name: "WhatsApp", category: "commerce", limit: 1024, oauth: "oauth2", color: "#25D366", scopes: ["whatsapp_business_messaging"], api: "Cloud API", firstComment: false, threads: false, video: true },
  { id: "snapchat", name: "Snapchat", category: "video", limit: 80, oauth: "oauth2", color: "#FFFC00", scopes: ["snapchat-marketing-api"], api: "Marketing API", firstComment: false, threads: false, video: true },
  { id: "twitch", name: "Twitch", category: "video", limit: 140, oauth: "oauth2", color: "#9146FF", scopes: ["channel:manage:broadcast"], api: "Helix", firstComment: false, threads: false, video: true },
  { id: "slack", name: "Slack", category: "community", limit: 40000, oauth: "oauth2", color: "#4A154B", scopes: ["chat:write", "incoming-webhook"], api: "Web API", firstComment: false, threads: false, video: false },
  { id: "medium", name: "Medium", category: "owned", limit: 100000, oauth: "oauth2", color: "#00AB6C", scopes: ["publishPost"], api: "Medium API", firstComment: false, threads: false, video: false },
  { id: "tumblr", name: "Tumblr", category: "social", limit: 4096, oauth: "oauth2", color: "#001935", scopes: ["write"], api: "Tumblr API", firstComment: false, threads: false, video: true },
  { id: "wordpress", name: "WordPress", category: "owned", limit: 100000, oauth: "oauth2", color: "#21759B", scopes: ["posts"], api: "WP REST / Jetpack", firstComment: false, threads: false, video: true },
  { id: "shopify", name: "Shopify", category: "commerce", limit: 5000, oauth: "oauth2", color: "#96BF48", scopes: ["write_content"], api: "Admin API", firstComment: false, threads: false, video: true },
];

export function platformById(id: PlatformId) {
  return PLATFORMS.find((p) => p.id === id)!;
}

export function PlatformGlyph({ id, size = 18 }: { id: PlatformId; size?: number }) {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24" as const };
  switch (id) {
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.726-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.52V24H.24V8.25zM8.34 8.25h4.33v2.14h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-7.89c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.16V24H8.34V8.25z" transform="scale(0.92) translate(1 0)" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M23 12.2s0-3.4-.4-4.9c-.2-.9-.9-1.6-1.8-1.8C19.1 5 12 5 12 5s-7.1 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 8.8 1 12.2 1 12.2s0 3.4.4 4.9c.2.9.9 1.6 1.8 1.8C4.9 19.4 12 19.4 12 19.4s7.1 0 8.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.9.4-4.9zM9.8 15.5V8.9l6.2 3.3-6.2 3.3z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M14.5 3c.4 2.6 1.9 4.3 4.5 4.7v3.1c-1.5 0-2.9-.5-4.1-1.3v6.6c0 3.6-2.8 6.4-6.4 6.4S2 19.7 2 16.1s2.8-6.4 6.4-6.4c.3 0 .7 0 1 .1v3.3c-.3-.1-.7-.2-1-.2-1.8 0-3.2 1.5-3.2 3.2s1.5 3.2 3.2 3.2 3.2-1.5 3.2-3.2V3h2.9z" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 8.5c1.2-1.6 6.8-2.2 7.6 2.4.6 3.3-2.3 5.3-4.6 5.3-2.6 0-3.8-1.7-3.8-1.7" />
          <path d="M9.2 12.2c4.8 2.3 6.6-2.6 4.4-3.6-1.8-.8-3.7.7-3.2 2.4.4 1.4 4.8 3.4 7.6.4" />
          <path d="M7 5.2C8.6 3.8 10.5 3 12.4 3 17 3 20 6.4 20 12s-3 9-7.6 9c-3.2 0-6-1.8-7.2-4.6" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c3 3.2 3 12.8 0 16M12 4c-3 3.2-3 12.8 0 16" />
        </svg>
      );
  }
}

export function PlatformBadge({ id, connected }: { id: PlatformId; connected?: boolean }) {
  const p = platformById(id);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{
        borderColor: connected ? `${p.color}33` : "#e2e8f0",
        background: connected ? `${p.color}12` : "#fff",
        color: p.color,
      }}
    >
      <PlatformGlyph id={id} size={12} />
      {p.name}
    </span>
  );
}

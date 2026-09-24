export type PlatformId =
  | "x"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "threads"
  | "pinterest"
  | "reddit"
  | "bluesky"
  | "mastodon"
  | "discord"
  | "gmb"
  | "skool"
  | "listmonk"
  | "telegram"
  | "whatsapp"
  | "snapchat"
  | "twitch"
  | "slack"
  | "medium"
  | "tumblr"
  | "wordpress"
  | "shopify";

export type PostStatus =
  | "draft"
  | "pending_approval"
  | "scheduled"
  | "processing"
  | "published"
  | "failed"
  | "evergreen";

export type Role = "owner" | "admin" | "editor" | "approver" | "client" | "viewer";

export interface CustomKeys {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  encrypted?: boolean;
}

export interface SocialAccount {
  id: string;
  platform: PlatformId;
  accountName: string;
  handle: string;
  avatar: string;
  connected: boolean;
  expiresAt?: string;
  followers: number;
  health: "healthy" | "expiring" | "expired" | "error";
  customKeys?: CustomKeys | null;
  usingVeloraKeys: boolean;
  workspaceId: string;
  clientId?: string;
}

export interface MediaAsset {
  id: string;
  kind: "image" | "video" | "gif";
  title: string;
  color: string;
  ratio: "1:1" | "4:5" | "16:9" | "9:16";
  duration?: string;
  tags: string[];
}

export interface ScheduledPost {
  id: string;
  workspaceId: string;
  accountIds: string[];
  platforms: PlatformId[];
  content: string;
  variants?: Partial<Record<PlatformId, string>>;
  media?: MediaAsset[];
  firstComment?: string;
  signatureId?: string;
  scheduledAt: string;
  publishedAt?: string;
  status: PostStatus;
  campaign?: string;
  labels: string[];
  virality: number;
  authorId: string;
  approverId?: string;
  errorLog?: string;
  utm?: string;
  shortUrl?: string;
  evergreenInterval?: "daily" | "weekly" | "monthly";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: "active" | "invited";
}

export interface ClientGroup {
  id: string;
  name: string;
  industry: string;
  color: string;
  accountIds: string[];
  contacts: string;
}

export interface Plug {
  id: string;
  name: string;
  kind: "internal" | "global";
  trigger: string;
  action: string;
  enabled: boolean;
  fires: number;
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  accounts: string[];
  template: string;
  lastItem: string;
  enabled: boolean;
}

export interface InboxItem {
  id: string;
  platform: PlatformId;
  account: string;
  from: string;
  avatar: string;
  preview: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
  sla: "ok" | "due" | "overdue";
  type: "comment" | "dm" | "mention" | "review";
  unread: boolean;
}

export interface AnalyticsPoint {
  day: string;
  impressions: number;
  engagement: number;
  clicks: number;
  followers: number;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: PlatformId;
  followers: number;
  engRate: number;
  postsWeek: number;
  topHook: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "healthy" | "failing";
  last: string;
}

export interface Signature {
  id: string;
  name: string;
  text: string;
}

export interface BrandVoice {
  id: string;
  name: string;
  tone: string;
  doList: string[];
  dontList: string[];
}

export interface BioLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

import { addDays, addHours, format, startOfWeek, subDays } from "date-fns";
import type {
  AnalyticsPoint,
  BioLink,
  BrandVoice,
  ClientGroup,
  Competitor,
  InboxItem,
  MediaAsset,
  NotificationItem,
  Plug,
  RssFeed,
  ScheduledPost,
  Signature,
  SocialAccount,
  TeamMember,
  Webhook,
} from "./types";

const now = new Date();
const iso = (d: Date) => d.toISOString();

export const WORKSPACE = {
  id: "ws_velora_main",
  name: "Velora Atelier",
  slug: "velora-atelier",
  plan: "Enterprise",
  region: "eu-west · AES-256-GCM vault",
};

export const CURRENT_USER = {
  id: "u_amara",
  name: "Amara Okonkwo",
  email: "amara@velora.io",
  role: "owner" as const,
  title: "Head of Social Systems",
};

export const TEAM: TeamMember[] = [
  { id: "u_amara", name: "Amara Okonkwo", email: "amara@velora.io", role: "owner", avatar: "AO", status: "active" },
  { id: "u_jonas", name: "Jonas Meier", email: "jonas@velora.io", role: "admin", avatar: "JM", status: "active" },
  { id: "u_leila", name: "Leila Haddad", email: "leila@velora.io", role: "editor", avatar: "LH", status: "active" },
  { id: "u_soren", name: "Søren Dahl", email: "soren@velora.io", role: "approver", avatar: "SD", status: "active" },
  { id: "u_nia", name: "Nia Brooks", email: "nia@northline.co", role: "client", avatar: "NB", status: "active" },
  { id: "u_kai", name: "Kai Nakamura", email: "kai@velora.io", role: "viewer", avatar: "KN", status: "invited" },
];

export const CLIENTS: ClientGroup[] = [
  { id: "c_north", name: "Northline", industry: "Climate fintech", color: "#0F766E", accountIds: ["acc_li_nl", "acc_x_nl", "acc_ig_nl"], contacts: "Nia Brooks" },
  { id: "c_atelier", name: "Maison Atelier", industry: "Maison / luxury", color: "#1E40AF", accountIds: ["acc_ig_ma", "acc_pin_ma", "acc_yt_ma"], contacts: "Camille Laurent" },
  { id: "c_orbit", name: "Orbit Health", industry: "Digital clinic", color: "#7C3AED", accountIds: ["acc_fb_oh", "acc_tt_oh", "acc_li_oh"], contacts: "Dr. Imani Cole" },
];

export const ACCOUNTS: SocialAccount[] = [
  { id: "acc_x_main", platform: "x", accountName: "Velora", handle: "@velora", avatar: "V", connected: true, expiresAt: iso(addDays(now, 28)), followers: 48200, health: "healthy", usingVeloraKeys: false, workspaceId: WORKSPACE.id, customKeys: { clientId: "veloraX9f2c", clientSecret: "••••••••••••", redirectUri: "https://app.velora.io/oauth/x", encrypted: true } },
  { id: "acc_li_main", platform: "linkedin", accountName: "Velora", handle: "Velora HQ", avatar: "V", connected: true, expiresAt: iso(addDays(now, 52)), followers: 91000, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id },
  { id: "acc_ig_ma", platform: "instagram", accountName: "Maison Atelier", handle: "@maison.atelier", avatar: "M", connected: true, expiresAt: iso(addDays(now, 11)), followers: 228400, health: "expiring", usingVeloraKeys: false, workspaceId: WORKSPACE.id, clientId: "c_atelier", customKeys: { clientId: "IG|284419", clientSecret: "••••••••", redirectUri: "https://app.velora.io/oauth/instagram", encrypted: true } },
  { id: "acc_tt_oh", platform: "tiktok", accountName: "Orbit Health", handle: "@orbit.health", avatar: "O", connected: true, expiresAt: iso(addDays(now, 40)), followers: 640000, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_orbit" },
  { id: "acc_yt_ma", platform: "youtube", accountName: "Maison Atelier", handle: "Maison Atelier", avatar: "M", connected: true, expiresAt: iso(addDays(now, 90)), followers: 120400, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_atelier" },
  { id: "acc_th_main", platform: "threads", accountName: "Velora", handle: "@velora", avatar: "V", connected: true, expiresAt: iso(addDays(now, 20)), followers: 18800, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id },
  { id: "acc_li_nl", platform: "linkedin", accountName: "Northline", handle: "Northline", avatar: "N", connected: true, expiresAt: iso(addDays(now, 33)), followers: 54000, health: "healthy", usingVeloraKeys: false, workspaceId: WORKSPACE.id, clientId: "c_north", customKeys: { clientId: "77n0rth", clientSecret: "••••••••", redirectUri: "https://app.velora.io/oauth/linkedin", encrypted: true } },
  { id: "acc_x_nl", platform: "x", accountName: "Northline", handle: "@northline", avatar: "N", connected: true, expiresAt: iso(addDays(now, 6)), followers: 22100, health: "expiring", usingVeloraKeys: false, workspaceId: WORKSPACE.id, clientId: "c_north" },
  { id: "acc_ig_nl", platform: "instagram", accountName: "Northline", handle: "@northline", avatar: "N", connected: true, expiresAt: iso(addDays(now, 44)), followers: 38900, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_north" },
  { id: "acc_fb_oh", platform: "facebook", accountName: "Orbit Health", handle: "Orbit Health", avatar: "O", connected: true, expiresAt: iso(addDays(now, 18)), followers: 77000, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_orbit" },
  { id: "acc_pin_ma", platform: "pinterest", accountName: "Maison Atelier", handle: "MaisonAtelier", avatar: "M", connected: true, expiresAt: iso(addDays(now, 70)), followers: 156000, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_atelier" },
  { id: "acc_li_oh", platform: "linkedin", accountName: "Orbit Health", handle: "Orbit Health", avatar: "O", connected: false, health: "expired", followers: 41000, usingVeloraKeys: true, workspaceId: WORKSPACE.id, clientId: "c_orbit" },
  { id: "acc_rd_main", platform: "reddit", accountName: "r/socialops", handle: "u/velora", avatar: "V", connected: true, expiresAt: iso(addDays(now, 25)), followers: 12000, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id },
  { id: "acc_bsky", platform: "bluesky", accountName: "Velora", handle: "@velora.bsky.social", avatar: "V", connected: true, expiresAt: iso(addDays(now, 14)), followers: 8600, health: "healthy", usingVeloraKeys: false, workspaceId: WORKSPACE.id, customKeys: { clientId: "did:plc:velora", clientSecret: "••••", redirectUri: "https://app.velora.io/oauth/bluesky", encrypted: true } },
  { id: "acc_gmb", platform: "gmb", accountName: "Velora Studio Lagos", handle: "Velora Studio", avatar: "V", connected: true, expiresAt: iso(addDays(now, 60)), followers: 940, health: "healthy", usingVeloraKeys: true, workspaceId: WORKSPACE.id },
];

export const MEDIA: MediaAsset[] = [
  { id: "m1", kind: "image", title: "Atelier marble still", color: "linear-gradient(135deg,#1E3A8A,#93C5FD)", ratio: "4:5", tags: ["maison", "still"] },
  { id: "m2", kind: "video", title: "Orbit clinic 24s", color: "linear-gradient(135deg,#4C1D95,#C4B5FD)", ratio: "9:16", duration: "0:24", tags: ["orbit", "short"] },
  { id: "m3", kind: "image", title: "Northline grid", color: "linear-gradient(135deg,#134E4A,#5EEAD4)", ratio: "1:1", tags: ["northline"] },
  { id: "m4", kind: "image", title: "Founder desk", color: "linear-gradient(135deg,#1E40AF,#1E3A8A 40%,#F8FAFC)", ratio: "16:9", tags: ["velora", "editorial"] },
  { id: "m5", kind: "video", title: "Runway crop master", color: "linear-gradient(180deg,#0F172A,#1E40AF)", ratio: "9:16", duration: "0:12", tags: ["maison", "crop"] },
  { id: "m6", kind: "image", title: "Product chrome", color: "linear-gradient(135deg,#0B1B4A,#60A5FA)", ratio: "1:1", tags: ["product"] },
  { id: "m7", kind: "gif", title: "Signature loop", color: "linear-gradient(135deg,#2563EB,#93C5FD)", ratio: "1:1", tags: ["brand"] },
  { id: "m8", kind: "video", title: "War-room recap", color: "linear-gradient(135deg,#111827,#2563EB)", ratio: "16:9", duration: "4:02", tags: ["internal"] },
];

const weekStart = startOfWeek(now, { weekStartsOn: 1 });

export const POSTS: ScheduledPost[] = [
  {
    id: "p1",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_li_main", "acc_x_main"],
    platforms: ["linkedin", "x"],
    content: "Most social stacks are a pile of logins. Velora is a vault, a calendar, and a studio that share one source of truth.\n\nBring your own OAuth. Keep the keys. Publish like a house, not a hustle.",
    firstComment: "The architecture brief: vlr.a/vault",
    scheduledAt: iso(addHours(weekStart, 10)),
    status: "scheduled",
    campaign: "Platform launch",
    labels: ["launch", "thought-leadership"],
    virality: 84,
    authorId: "u_amara",
    shortUrl: "vlr.a/vault",
  },
  {
    id: "p2",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_ig_ma", "acc_pin_ma"],
    platforms: ["instagram", "pinterest"],
    content: "Quiet luxury is a supply chain, not a filter. Spring atelier look — marble, navy silk, one gold clasp.",
    media: [MEDIA[0]],
    scheduledAt: iso(addHours(addDays(weekStart, 1), 13)),
    status: "pending_approval",
    campaign: "Maison SS26",
    labels: ["atelier", "needs-legal"],
    virality: 78,
    authorId: "u_leila",
    firstComment: "Full lookbook · link in bio",
  },
  {
    id: "p3",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_tt_oh"],
    platforms: ["tiktok"],
    content: "Your clinic should answer in under 90 seconds. Here's the Orbit front-desk OS — no hold music, no mystery.",
    media: [MEDIA[1]],
    scheduledAt: iso(addHours(addDays(weekStart, 1), 18)),
    status: "scheduled",
    campaign: "Orbit demand",
    labels: ["short", "healthcare"],
    virality: 91,
    authorId: "u_jonas",
  },
  {
    id: "p4",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_li_nl", "acc_x_nl"],
    platforms: ["linkedin", "x"],
    content: "Carbon accounting that a CFO will actually open. Northline's Q3 ledger is live — 40bp tighter than last quarter.",
    scheduledAt: iso(addHours(addDays(weekStart, 2), 9)),
    status: "scheduled",
    campaign: "Northline Q3",
    labels: ["earnings"],
    virality: 73,
    authorId: "u_jonas",
    firstComment: "Report PDF · vlr.a/nl-q3",
    shortUrl: "vlr.a/nl-q3",
  },
  {
    id: "p5",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_th_main", "acc_bsky"],
    platforms: ["threads", "bluesky"],
    content: "Unpopular: scheduling tools didn't fail because of features. They failed because brands didn't own the OAuth relationship.",
    scheduledAt: iso(addHours(addDays(weekStart, 2), 16)),
    status: "draft",
    campaign: "Platform launch",
    labels: ["opinion"],
    virality: 69,
    authorId: "u_amara",
  },
  {
    id: "p6",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_yt_ma"],
    platforms: ["youtube"],
    content: "Inside the atelier: 11 minutes with Camille on why we still cut on the bias.",
    media: [MEDIA[7]],
    scheduledAt: iso(addHours(addDays(weekStart, 3), 15)),
    status: "scheduled",
    campaign: "Maison SS26",
    labels: ["longform"],
    virality: 80,
    authorId: "u_leila",
  },
  {
    id: "p7",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_ig_nl"],
    platforms: ["instagram"],
    content: "The grid this week is a coastline. Northline field notes from Lagos lagoon sensors.",
    media: [MEDIA[2]],
    scheduledAt: iso(addHours(addDays(weekStart, 3), 11)),
    status: "scheduled",
    campaign: "Northline Q3",
    labels: ["field"],
    virality: 71,
    authorId: "u_leila",
  },
  {
    id: "p8",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_x_main"],
    platforms: ["x"],
    content: "First-comment automation is not a growth hack. It's how you keep the timeline clean and the link where it belongs.",
    scheduledAt: iso(addHours(addDays(weekStart, 4), 8)),
    status: "scheduled",
    campaign: "Platform launch",
    labels: ["product"],
    virality: 76,
    authorId: "u_amara",
    firstComment: "Docs · vlr.a/first-comment",
    evergreenInterval: "weekly",
  },
  {
    id: "p9",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_fb_oh", "acc_tt_oh"],
    platforms: ["facebook", "tiktok"],
    content: "Flu season briefing: 3 symptoms, 1 chat, 0 waiting rooms. Orbit is open until 22:00 WAT.",
    scheduledAt: iso(addHours(addDays(weekStart, 4), 17)),
    status: "pending_approval",
    campaign: "Orbit demand",
    labels: ["compliance"],
    virality: 66,
    authorId: "u_jonas",
    approverId: "u_soren",
  },
  {
    id: "p10",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_gmb"],
    platforms: ["gmb"],
    content: "Walk-ins welcome at Velora Studio, Victoria Island — private rooms for client war-rooms, 9–6.",
    scheduledAt: iso(addHours(addDays(weekStart, 5), 9)),
    status: "scheduled",
    campaign: "Studio",
    labels: ["local"],
    virality: 54,
    authorId: "u_jonas",
  },
  {
    id: "p11",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_li_main"],
    platforms: ["linkedin"],
    content: "We don't do 'content calendars'. We do publishing systems with approvals, vaults, and a crisis switch.",
    scheduledAt: iso(subDays(now, 1)),
    publishedAt: iso(subDays(now, 1)),
    status: "published",
    campaign: "Platform launch",
    labels: ["evergreen"],
    virality: 88,
    authorId: "u_amara",
    evergreenInterval: "monthly",
  },
  {
    id: "p12",
    workspaceId: WORKSPACE.id,
    accountIds: ["acc_rd_main"],
    platforms: ["reddit"],
    content: "AMA: we replaced Buffer + a graveyard of Zapier zaps with one queue, BYO OAuth, and BullMQ. Ask us about rate-limit backoff.",
    scheduledAt: iso(addHours(addDays(weekStart, 5), 19)),
    status: "scheduled",
    campaign: "Platform launch",
    labels: ["ama"],
    virality: 82,
    authorId: "u_jonas",
  },
];

export const PLUGS: Plug[] = [
  { id: "pl1", name: "Warm the room", kind: "internal", trigger: "On publish · any Velora HQ account", action: "Connected HQ accounts leave a native first reaction + supportive comment within 90s", enabled: true, fires: 148 },
  { id: "pl2", name: "Link after 100", kind: "global", trigger: "When a post crosses 100 likes", action: "Post a promotional first-comment with short link + UTM", enabled: true, fires: 36 },
  { id: "pl3", name: "Crisis mute", kind: "global", trigger: "Negative sentiment > 40% in 20 minutes", action: "Pause remaining queue, page on-call approver, freeze plugs", enabled: true, fires: 2 },
  { id: "pl4", name: "Maison echo", kind: "internal", trigger: "On Instagram publish · Maison Atelier", action: "Pinterest saves the pin; Threads quotes the still", enabled: false, fires: 11 },
];

export const FEEDS: RssFeed[] = [
  { id: "rss1", name: "Velora Journal", url: "https://velora.io/journal/rss.xml", accounts: ["acc_x_main", "acc_li_main"], template: "From the journal: {title} — {summary} {short}", lastItem: "The vault model of OAuth", enabled: true },
  { id: "rss2", name: "Northline Research", url: "https://northline.co/research/feed", accounts: ["acc_li_nl"], template: "Research note · {title}", lastItem: "Lagoon sensor drift, week 38", enabled: true },
];

export const INBOX: InboxItem[] = [
  { id: "i1", platform: "linkedin", account: "Velora HQ", from: "Priya Raman", avatar: "PR", preview: "This vault idea is the first time I've trusted a scheduler with production keys. Do you SOC2?", time: iso(addHours(now, -1)), sentiment: "positive", sla: "due", type: "comment", unread: true },
  { id: "i2", platform: "instagram", account: "Maison Atelier", from: "c.laurent", avatar: "CL", preview: "The marble still is approved but legal wants the clasp unbranded.", time: iso(addHours(now, -2)), sentiment: "neutral", sla: "ok", type: "dm", unread: true },
  { id: "i3", platform: "x", account: "@velora", from: "devon.build", avatar: "DB", preview: "Does first-comment fire before or after the thread? Need this for a launch.", time: iso(addHours(now, -3)), sentiment: "neutral", sla: "ok", type: "mention", unread: true },
  { id: "i4", platform: "gmb", account: "Velora Studio", from: "Adaeze K.", avatar: "AK", preview: "Five stars. The war-room on VI is quietly the best in the city.", time: iso(addHours(now, -5)), sentiment: "positive", sla: "ok", type: "review", unread: false },
  { id: "i5", platform: "tiktok", account: "Orbit Health", from: "kemi.ok", avatar: "KO", preview: "Is the 90-second claim actually measured? Feels like an ad.", time: iso(addHours(now, -8)), sentiment: "negative", sla: "overdue", type: "comment", unread: true },
  { id: "i6", platform: "facebook", account: "Orbit Health", from: "Ibrahim Sule", avatar: "IS", preview: "Do you take NHIS? The site is unclear.", time: iso(addHours(now, -10)), sentiment: "neutral", sla: "due", type: "dm", unread: false },
];

export const ANALYTICS: AnalyticsPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = subDays(now, 13 - i);
  const wave = Math.sin(i / 2.4) * 0.18 + 1;
  return {
    day: format(d, "MMM d"),
    impressions: Math.round(124000 * wave + i * 1800),
    engagement: Math.round(7400 * wave + i * 90),
    clicks: Math.round(1900 * wave + i * 40),
    followers: 380000 + i * 420,
  };
});

export const COMPETITORS: Competitor[] = [
  { id: "cp1", name: "Buffer", handle: "@buffer", platform: "x", followers: 1020000, engRate: 1.1, postsWeek: 11, topHook: "Simple scheduling forever" },
  { id: "cp2", name: "Hootsuite", handle: "@hootsuite", platform: "linkedin", followers: 890000, engRate: 0.7, postsWeek: 9, topHook: "Enterprise suites" },
  { id: "cp3", name: "Postiz", handle: "@postiz", platform: "x", followers: 18400, engRate: 3.4, postsWeek: 14, topHook: "Open-source alternative" },
  { id: "cp4", name: "Sprout Social", handle: "@sproutsocial", platform: "linkedin", followers: 430000, engRate: 1.4, postsWeek: 8, topHook: "Care + publishing" },
];

export const WEBHOOKS: Webhook[] = [
  { id: "wh1", url: "https://hooks.n8n.cloud/velora/publish", events: ["post.published", "post.failed"], status: "healthy", last: iso(addHours(now, -2)) },
  { id: "wh2", url: "https://hook.eu1.make.com/velora-approvals", events: ["approval.requested", "approval.granted"], status: "healthy", last: iso(addHours(now, -6)) },
  { id: "wh3", url: "https://zapier.com/hooks/catch/velora", events: ["inbox.negative", "crisis.triggered"], status: "failing", last: iso(addHours(now, -26)) },
];

export const SIGNATURES: Signature[] = [
  { id: "sig1", name: "Velora footer", text: "— The Velora studio · velora.io" },
  { id: "sig2", name: "Maison legal", text: "Maison Atelier © SS26. Imagery not for resale." },
  { id: "sig3", name: "Northline disclosure", text: "Not investment advice. Northline Research." },
];

export const VOICES: BrandVoice[] = [
  { id: "v1", name: "Editorial calm", tone: "Quiet, precise, proof-led. Short sentences. No exclamation.", doList: ["Name the system", "Offer a brief", "Speak like a house"], dontList: ["Hustle clichés", "Emoji walls", "Growth-hack tone"] },
  { id: "v2", name: "Bold founder", tone: "Direct, slightly combative, high signal.", doList: ["Take a position", "Use numbers", "Cut filler"], dontList: ["Hedging", "Corporate fog"] },
  { id: "v3", name: "Maison whisper", tone: "Sensory, restrained, French-English mix sparingly.", doList: ["Texture words", "Season codes"], dontList: ["Discount language", "Influencer pose"] },
];

export const BIO_LINKS: BioLink[] = [
  { id: "b1", title: "Book a 12-minute teardown", url: "https://velora.io/teardown", clicks: 1844, active: true },
  { id: "b2", title: "Maison SS26 lookbook", url: "https://maison.atelier/ss26", clicks: 9021, active: true },
  { id: "b3", title: "Northline Q3 ledger", url: "https://northline.co/q3", clicks: 640, active: true },
  { id: "b4", title: "Orbit waitlist", url: "https://orbit.health/join", clicks: 2210, active: false },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Approval requested", body: "Leila submitted Maison marble still · legal label", time: iso(addHours(now, -1)), read: false },
  { id: "n2", title: "Token expiring", body: "@northline on X expires in 6 days — rotate or reconnect", time: iso(addHours(now, -3)), read: false },
  { id: "n3", title: "Plug fired", body: "Link after 100 on Velora LinkedIn essay", time: iso(addHours(now, -5)), read: true },
  { id: "n4", title: "Webhook failing", body: "Zapier catch URL 410 — crisis events not landing", time: iso(addHours(now, -26)), read: false },
];

export const API_KEYS = [
  { id: "k_live", name: "Live · atelier", prefix: "vlr_live_9f2c", created: "12 Aug 2026", lastUsed: "2 hours ago" },
  { id: "k_mcp", name: "MCP agent", prefix: "vlr_mcp_aa31", created: "1 Sep 2026", lastUsed: "18 minutes ago" },
];

export const BEST_TIMES = [
  { platform: "linkedin", slots: ["Tue 09:10", "Wed 08:40", "Thu 12:05"] },
  { platform: "x", slots: ["Mon 07:50", "Wed 18:20", "Fri 08:10"] },
  { platform: "instagram", slots: ["Wed 13:00", "Sat 11:30", "Sun 18:45"] },
  { platform: "tiktok", slots: ["Thu 19:15", "Fri 21:00", "Sun 20:30"] },
];

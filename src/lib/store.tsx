import React, { createContext, useContext, useMemo, useState } from "react";
import {
  ACCOUNTS,
  API_KEYS,
  BIO_LINKS,
  CLIENTS,
  COMPETITORS,
  CURRENT_USER,
  FEEDS,
  INBOX,
  MEDIA,
  NOTIFICATIONS,
  PLUGS,
  POSTS,
  SIGNATURES,
  TEAM,
  VOICES,
  WEBHOOKS,
  WORKSPACE,
} from "./data";
import type {
  BioLink,
  ClientGroup,
  CustomKeys,
  InboxItem,
  MediaAsset,
  NotificationItem,
  PlatformId,
  Plug,
  PostStatus,
  RssFeed,
  ScheduledPost,
  SocialAccount,
  TeamMember,
} from "./types";
import { scoreCopy, shortLink, uid } from "./utils";

interface Store {
  workspace: typeof WORKSPACE;
  user: typeof CURRENT_USER;
  accounts: SocialAccount[];
  posts: ScheduledPost[];
  team: TeamMember[];
  clients: ClientGroup[];
  plugs: Plug[];
  feeds: RssFeed[];
  inbox: InboxItem[];
  media: MediaAsset[];
  notifications: NotificationItem[];
  signatures: typeof SIGNATURES;
  voices: typeof VOICES;
  competitors: typeof COMPETITORS;
  webhooks: typeof WEBHOOKS;
  bioLinks: BioLink[];
  apiKeys: typeof API_KEYS;
  crisis: boolean;
  setCrisis: (v: boolean) => void;
  connectAccount: (partial: Partial<SocialAccount> & { platform: PlatformId; accountName: string }) => void;
  disconnectAccount: (id: string) => void;
  saveKeys: (id: string, keys: CustomKeys) => void;
  addPost: (p: Omit<ScheduledPost, "id" | "workspaceId" | "virality" | "authorId" | "shortUrl"> & { virality?: number }) => ScheduledPost;
  updatePost: (id: string, patch: Partial<ScheduledPost>) => void;
  setStatus: (id: string, status: PostStatus) => void;
  togglePlug: (id: string) => void;
  addPlug: (p: Omit<Plug, "id" | "fires">) => void;
  toggleFeed: (id: string) => void;
  addFeed: (p: Omit<RssFeed, "id" | "lastItem">) => void;
  markInbox: (id: string) => void;
  replyInbox: (id: string) => void;
  addMedia: (m: Omit<MediaAsset, "id">) => void;
  toggleBio: (id: string) => void;
  addBio: (b: Omit<BioLink, "id" | "clicks">) => void;
  markAllNotes: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [posts, setPosts] = useState(POSTS);
  const [plugs, setPlugs] = useState(PLUGS);
  const [feeds, setFeeds] = useState(FEEDS);
  const [inbox, setInbox] = useState(INBOX);
  const [media, setMedia] = useState(MEDIA);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [bioLinks, setBioLinks] = useState(BIO_LINKS);
  const [crisis, setCrisis] = useState(false);

  const value = useMemo<Store>(
    () => ({
      workspace: WORKSPACE,
      user: CURRENT_USER,
      accounts,
      posts,
      team: TEAM,
      clients: CLIENTS,
      plugs,
      feeds,
      inbox,
      media,
      notifications,
      signatures: SIGNATURES,
      voices: VOICES,
      competitors: COMPETITORS,
      webhooks: WEBHOOKS,
      bioLinks,
      apiKeys: API_KEYS,
      crisis,
      setCrisis,
      connectAccount: (partial) => {
        const acc: SocialAccount = {
          id: uid("acc"),
          handle: partial.handle || "@new",
          avatar: (partial.accountName || "N")[0],
          connected: true,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
          followers: 0,
          health: "healthy",
          usingVeloraKeys: !partial.customKeys,
          workspaceId: WORKSPACE.id,
          ...partial,
          platform: partial.platform,
          accountName: partial.accountName,
        };
        setAccounts((s) => [acc, ...s]);
      },
      disconnectAccount: (id) =>
        setAccounts((s) => s.map((a) => (a.id === id ? { ...a, connected: false, health: "expired" } : a))),
      saveKeys: (id, keys) =>
        setAccounts((s) =>
          s.map((a) => (a.id === id ? { ...a, customKeys: { ...keys, encrypted: true }, usingVeloraKeys: false } : a))
        ),
      addPost: (p) => {
        const post: ScheduledPost = {
          ...p,
          id: uid("p"),
          workspaceId: WORKSPACE.id,
          authorId: CURRENT_USER.id,
          virality: p.virality ?? scoreCopy(p.content, p.platforms),
          shortUrl: shortLink(uid("l")),
          status: crisis ? "draft" : p.status,
        };
        setPosts((s) => [post, ...s]);
        return post;
      },
      updatePost: (id, patch) => setPosts((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      setStatus: (id, status) =>
        setPosts((s) =>
          s.map((p) =>
            p.id === id
              ? { ...p, status, publishedAt: status === "published" ? new Date().toISOString() : p.publishedAt }
              : p
          )
        ),
      togglePlug: (id) => setPlugs((s) => s.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))),
      addPlug: (p) => setPlugs((s) => [{ ...p, id: uid("pl"), fires: 0 }, ...s]),
      toggleFeed: (id) => setFeeds((s) => s.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))),
      addFeed: (p) => setFeeds((s) => [{ ...p, id: uid("rss"), lastItem: "Awaiting first item" }, ...s]),
      markInbox: (id) => setInbox((s) => s.map((i) => (i.id === id ? { ...i, unread: false } : i))),
      replyInbox: (id) => setInbox((s) => s.map((i) => (i.id === id ? { ...i, unread: false, sla: "ok" } : i))),
      addMedia: (m) => setMedia((s) => [{ ...m, id: uid("m") }, ...s]),
      toggleBio: (id) => setBioLinks((s) => s.map((b) => (b.id === id ? { ...b, active: !b.active } : b))),
      addBio: (b) => setBioLinks((s) => [{ ...b, id: uid("b"), clicks: 0 }, ...s]),
      markAllNotes: () => setNotifications((s) => s.map((n) => ({ ...n, read: true }))),
    }),
    [accounts, posts, plugs, feeds, inbox, media, notifications, bioLinks, crisis]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("Store missing");
  return s;
}

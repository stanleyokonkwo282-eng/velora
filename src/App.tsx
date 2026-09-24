import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AccessGate, RequireAdmin } from "./components/AccessGate";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { CalendarPage } from "./pages/Calendar";
import { Compose } from "./pages/Compose";
import { Accounts } from "./pages/Accounts";
import { Analytics } from "./pages/Analytics";
import { InboxPage } from "./pages/Inbox";
import { AiStudio } from "./pages/AiStudio";
import { MediaPage } from "./pages/Media";
import { VideoLab } from "./pages/VideoLab";
import { PlugsPage } from "./pages/Plugs";
import { RssPage } from "./pages/Rss";
import { Evergreen } from "./pages/Evergreen";
import { TeamPage } from "./pages/Team";
import { Clients } from "./pages/Clients";
import { SettingsPage } from "./pages/Settings";
import { ApiConsole } from "./pages/ApiConsole";
import { Competitors } from "./pages/Competitors";
import { LinkInBio } from "./pages/LinkInBio";
import { Campaigns } from "./pages/Campaigns";
import { Upgrade } from "./pages/Upgrade";
import { AdminConsole } from "./pages/AdminConsole";

/**
 * Access is decided by <AccessGate>: no session → /login, live trial or paid
 * plan → the workspace, expired trial → the paywall.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      {/* Hidden owner console — reachable only with an admin session. */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminConsole />
          </RequireAdmin>
        }
      />

      <Route
        path="/app"
        element={
          <AccessGate>
            <AppShell />
          </AccessGate>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="compose" element={<Compose />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="ai" element={<AiStudio />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="video" element={<VideoLab />} />
        <Route path="plugs" element={<PlugsPage />} />
        <Route path="rss" element={<RssPage />} />
        <Route path="evergreen" element={<Evergreen />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="clients" element={<Clients />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="api" element={<ApiConsole />} />
        <Route path="competitors" element={<Competitors />} />
        <Route path="bio" element={<LinkInBio />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="upgrade" element={<Upgrade />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

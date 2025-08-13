import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import DashboardLayout from "../layout/DashboardLayout";
import RendererPageLayout from "../layout/RendererPageLayout";

// Shared Pages
import HomePage from "../pages/renderer/LandingPage";
import InboxPage from "../pages/InboxPage";
import SentPage from "../pages/SentPage";
import StarredPage from "../pages/StarredPage";
import ArchivePage from "../pages/ArchivePage";
import TrashPage from "../pages/TrashPage";
import AllMailsPage from "../pages/AllMailsPage";
import EmailDetailsPage from "../pages/EmailDetailsPage";

// User Pages
import UserProfile from "../pages/user/UserProfile";
// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import DomainsPage from "../pages/admin/DomainsPage";
import UsersPage from "../pages/admin/UsersPage";
import MailboxesPage from "../pages/admin/MailboxesPage";
import BillingPage from "../pages/admin/BillingPage";
import AdminSettingsPage from "../pages/admin/SettingsPage";

// Super Admin Pages
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SystemLogsPage from "../pages/superadmin/SystemLogsPage";
import ToolsPage from "../pages/superadmin/ToolsPage";

import NotFoundPage from "../pages/NotFoundPage";
import RequireRole from "../components/auth/RequireRole";
import LoginPage from "../pages/login";
import Register from "../pages/Register";

const getMailRoutes = () => (
  <>
    <Route path="inbox" element={<InboxPage />} />
    <Route path="all-mails" element={<AllMailsPage />} />
    <Route path="starred" element={<StarredPage />} />
    <Route path="sent" element={<SentPage />} />
    <Route path="archive" element={<ArchivePage />} />
    <Route path="trash" element={<TrashPage />} />
    <Route path="detail/:id" element={<EmailDetailsPage />} />
  </>
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🌐 Public Landing Page */}
      <Route path="/" element={<RendererPageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 👤 User Routes */}
      <Route path="/u" element={<DashboardLayout />}>
        <Route index element={<Navigate to="inbox" />} />
        {getMailRoutes()}
        <Route path="profile" element={<UserProfile />} /> {/* ✅ Added */}
      </Route>

      {/* 🛠 Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin", "superadmin"]}>
            <DashboardLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {getMailRoutes()}
        <Route path="domains" element={<DomainsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mailboxes" element={<MailboxesPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 🧠 Super Admin Routes */}
      <Route
        path="/superadmin"
        element={
          <RequireRole roles={["superadmin"]}>
            <DashboardLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        {getMailRoutes()}
        <Route path="domains" element={<DomainsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mailboxes" element={<MailboxesPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="logs" element={<SystemLogsPage />} />
        <Route path="tools" element={<ToolsPage />} />
      </Route>

      {/* ❌ Catch-all Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

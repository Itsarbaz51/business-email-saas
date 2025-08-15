import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import DashboardLayout from "../layout/DashboardLayout.jsx";
import RendererPageLayout from "../layout/RendererPageLayout.jsx";

// Shared Pages
import HomePage from "../pages/renderer/LandingPage.jsx";
import InboxPage from "../pages/InboxPage.jsx";
import SentPage from "../pages/SentPage.jsx";
import StarredPage from "../pages/StarredPage.jsx";
import ArchivePage from "../pages/ArchivePage.jsx";
import TrashPage from "../pages/TrashPage.jsx";
import AllMailsPage from "../pages/AllMailsPage.jsx";
import EmailDetailsPage from "../pages/EmailDetailsPage.jsx";

// User Pages
import UserProfile from "../pages/user/UserProfile.jsx";
// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import DomainsPage from "../pages/admin/DomainsPage.jsx";
import UsersPage from "../pages/admin/UsersPage.jsx";
import MailboxesPage from "../pages/admin/MailboxesPage.jsx";
import BillingPage from "../pages/admin/BillingPage.jsx";
import AdminSettingsPage from "../pages/admin/SettingsPage.jsx";

// Super Admin Pages
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard.jsx";
import SystemLogsPage from "../pages/superadmin/SystemLogsPage.jsx";
import ToolsPage from "../pages/superadmin/ToolsPage.jsx";

import NotFoundPage from "../pages/NotFoundPage.jsx";
import RequireRole from "../components/auth/RequireRole.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";

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
        <Route path="login" element={<Login />} />
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
          <RequireRole roles={["ADMIN", "superadmin"]}>
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

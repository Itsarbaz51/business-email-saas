import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/renderer/LandingPage.jsx";
import InboxPage from "../pages/user/InboxPage.jsx";
import RequireRole from "../components/auth/RequireRole.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Login from "../pages/Login.jsx";
import DomainsPage from "../pages/admin/DomainsPage.jsx";
import UsersPage from "../pages/admin/UsersPage.jsx";
import MailboxesPage from "../pages/admin/MailboxesPage.jsx";
import SettingsPage from "../pages/admin/SettingsPage.jsx";
import BillingPage from "../pages/admin/BillingPage.jsx";
import RendererPageLayout from "../layout/RendererPageLayout.jsx";
import Register from "../pages/Register.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* public routes */}
      <Route path="/" element={<RendererPageLayout />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

      {/* protected routes */}
      <Route element={<RequireRole allowedRoles={["USER"]} />}>
        <Route path="/u" element={<DashboardLayout />}>
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<InboxPage />} />
          {/* ... other user routes */}
        </Route>
      </Route>

      <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="mailboxes" element={<MailboxesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>
      </Route>

      <Route element={<RequireRole allowedRoles={["SUPER_ADMIN"]} />}>
        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* ... other super admin routes */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

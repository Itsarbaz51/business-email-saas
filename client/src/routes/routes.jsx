import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/renderer/LandingPage.jsx";
import InboxPage from "../pages/InboxPage.jsx";
import SentPage from "../pages/SentPage.jsx";
import ArchivePage from "../pages/ArchivePage.jsx";
import TrashPage from "../pages/TrashPage.jsx";
import AllMailsPage from "../pages/AllMailsPage.jsx";
import EmailDetailsPage from "../pages/EmailDetailsPage.jsx";
import RequireRole from "../components/auth/RequireRole.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Login from "../pages/Login.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* user routes */}
      <Route
        path="/u"
        element={
          <RequireRole allowedRoles={["USER"]}>
            <DashboardLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="inbox" replace />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="sent" element={<SentPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="all-mails" element={<AllMailsPage />} />
        <Route path="view-mail/:id" element={<EmailDetailsPage />} />
      </Route>

      {/* admin routes */}
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <DashboardLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="all-mails" element={<AllMailsPage />} />
        <Route path="view-mail/:id" element={<EmailDetailsPage />} />
      </Route>

      {/* super admin routes */}
      <Route
        path="/superadmin"
        element={
          <RequireRole allowedRoles={["SUPER_ADMIN"]}>
            <DashboardLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* <Route path="logs" element={<SystemLogsPage />} />
        <Route path="tools" element={<AdminToolsPage />} /> */}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

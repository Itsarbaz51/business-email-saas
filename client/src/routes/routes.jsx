import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/renderer/LandingPage.jsx";
import InboxPage from "../pages/InboxPage.jsx";
// import SentPage from "../pages/SentPage.jsx";
// import ArchivePage from "../pages/ArchivePage.jsx";
// import TrashPage from "../pages/TrashPage.jsx";
// import AllMailsPage from "../pages/AllMailsPage.jsx";
// import EmailDetailsPage from "../pages/EmailDetailsPage.jsx";
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
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

      {/* protected routes */}
      <Route element={<RequireRole allowedRoles={["USER"]} />}>
        <Route path="/u" element={<DashboardLayout />}>
          <Route index element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<InboxPage />} />
          {/* ... other user routes */}
        </Route>
      </Route>

      <Route element={<RequireRole allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* ... other admin routes */}
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

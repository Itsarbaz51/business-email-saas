import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import HomePage from "../pages/renderer/LandingPage";
import InboxPage from "../pages/dashboard/InboxPage";
import SentPage from "../pages/dashboard/SentPage";
import StarredPage from "../pages/dashboard/StarredPage";
import ArchivePage from "../pages/dashboard/ArchivePage";
import TrashPage from "../pages/dashboard/TrashPage";
import AllMailsPage from "../pages/dashboard/AllMailsPage";
import EmailDetailsPage from "../pages/dashboard/EmailDetailsPage";
import DashboardLayout from "../layout/DashboardLayout";
import RendererPageLayout from "../layout/RendererPageLayout";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RendererPageLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/u" element={<DashboardLayout />}>
        <Route path="inbox" element={<InboxPage />} />
        <Route path="all-mails" element={<AllMailsPage />} />
        <Route path="detail/:id" element={<EmailDetailsPage />} />
        <Route path="starred" element={<StarredPage />} />
        <Route path="sent" element={<SentPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="trash" element={<TrashPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom"; // removed unused Navigate
import { useState } from "react";
import SentEmailForm from "../components/forms/SentEmailForm";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState("new"); // new | reply | forward
  const [selectedMail, setSelectedMail] = useState(null);

  const userEmail = useSelector(
    (state) => state.auth.currentUserData?.emailAddress
  );
  const loading = useSelector((state) => state.mail.isLoading);

  const openCompose = (mode = "new", mail = null) => {
    setComposeMode(mode);
    setSelectedMail(mail);
    setIsComposeOpen(true);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar (glass inside the component) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onCompose={() => openCompose("new")}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Main area: grid with scrollable content and footer pinned at bottom */}
        <main className="relative flex-1 grid grid-rows-[1fr_auto] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          {/* Background Blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tl from-cyan-400/20 to-blue-300/20 rounded-full blur-3xl" />
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 overflow-y-auto p-6 sm:p-8">
            {/* Loading overlay (glass chip) */}
            {loading && (
              <div className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-20 z-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur border border-white/30 shadow-lg">
                  <span className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  <span className="text-sm font-semibold text-gray-700">
                    Loading…
                  </span>
                </div>
              </div>
            )}

            <Outlet context={{ openCompose }} />
          </div>

          {/* Footer (always bottom of main) */}
          <div className="relative z-10">
            <Footer />
          </div>
        </main>

        {/* Compose modal */}
        {isComposeOpen && (
          <SentEmailForm
            onClose={() => setIsComposeOpen(false)}
            userEmail={userEmail}
            initialData={selectedMail || {}}
            mode={composeMode}
          />
        )}
      </div>
    </div>
  );
}

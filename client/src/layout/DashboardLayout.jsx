import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import SentEmailForm from "../components/forms/SentEmailForm";
import { useSelector } from "react-redux";

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
    <div className="flex h-screen w-fit sm:w-full bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onCompose={() => openCompose("new")}
      />

      <div className="flex-1 flex flex-col ">
        <Navbar setSidebarOpen={setSidebarOpen} />
        {loading && (
          <div className="flex justify-center items-center duration- relative">
            <span className="text-white z-10 absolute top-5 bg-purple-400 w-fit px-8 py-2 rounded text-xl">
              Loading...
            </span>
          </div>
        )}
        <main className="flex-1 p-6 h-fit sm:overflow-auto">
          <Outlet context={{ openCompose }} />
        </main>

        {isComposeOpen && (
          <SentEmailForm
            onClose={() => setIsComposeOpen(false)}
            userEmail={userEmail}
            initialData={selectedMail || {}}
            mode={composeMode}
          />
        )}
        <footer className="bg-gray-100 border-t border-gray-300 py-4 text-center text-gray-700 text-sm flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>
            Developed by{" "}
            <strong
              className="cursor-pointer hover:text-gray-800 duration-300"
              onClick={() => window.open("https://azzunique.com", "_blank")}
            >
              Azzunique Software Pvt. Ltd.
            </strong>
          </span>
          <span>•</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}

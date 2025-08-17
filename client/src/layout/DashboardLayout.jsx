import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SentEmailForm from "../components/forms/SentEmailForm";
import { useSelector } from "react-redux";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const useremail = useSelector((state) => state.auth.currentUserData.emailAddress) 
  return (
    <div className="flex h-screen w-fit sm:w-full bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onCompose={() => setIsComposeOpen(true)} />
      <div className="flex-1 flex flex-col">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 h-fit sm:overflow-auto">
          <Outlet />
        </main>
        {isComposeOpen && (
          <div className="fixed flex items-center justify-center bg-black/50 z-50">
            <SentEmailForm onClose={() => setIsComposeOpen(false)} userEmail={useremail}  />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
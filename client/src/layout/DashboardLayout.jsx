import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import SentEmailForm from "../components/forms/SentEmailForm";
import { useSelector } from "react-redux";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState("new"); // new | reply | forward
  const [selectedMail, setSelectedMail] = useState(null);

  const useremail = useSelector((state) => state.auth.currentUserData.emailAddress);

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

      <div className="flex-1 flex flex-col">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 h-fit sm:overflow-auto">
          <Outlet context={{ openCompose }} /> {/* pass openCompose down */}
        </main>

        {console.log(selectedMail)}
        {isComposeOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <SentEmailForm
              onClose={() => setIsComposeOpen(false)}
              userEmail={useremail}
              initialData={
                composeMode === "reply"
                  ? {
                    to:
                      selectedMail?.toEmail,
                    subject: `Re: ${selectedMail?.subject}`,
                    body: `<br/><br/>On ${selectedMail?.sentAt}, ${selectedMail?.fromEmail} wrote:<br/>${selectedMail?.body}`,
                  }
                  : composeMode === "forward"
                    ? {
                      subject: `Fwd: ${selectedMail?.subject}`,
                      body: `<br/><br/>---------- Forwarded message ----------<br/>
                             From: ${selectedMail?.fromEmail}<br/>
                             Date: ${selectedMail?.sentAt}<br/>
                             Subject: ${selectedMail?.subject}<br/><br/>
                             ${selectedMail?.body}`,
                    }
                    : {}
              }

            />
          </div>
        )}
      </div>
    </div>
  );
}

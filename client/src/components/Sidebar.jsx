import React from "react";
import {
  Menu,
  Pencil,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  ChevronDown,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: <Inbox className="w-4 h-4" />, label: "Inbox", path: "/inbox" },
    { icon: <Star className="w-4 h-4" />, label: "Starred", path: "/starred" },
    // { icon: <Clock className="w-4 h-4" />, label: "Snoozed", path: "/snoozed" },
    { icon: <Send className="w-4 h-4" />, label: "Sent", path: "/sent" },
    { icon: <Send className="w-4 h-4" />, label: "All Mail", path: "/all-mail" },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Drafts",
      path: "/drafts",
    },
    { icon: <ChevronDown className="w-4 h-4" />, label: "More", path: "/more" },
  ];

  return (
    <aside className="border-r border-gray-300 h-screen w-full sm:w-64 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <div className="flex items-center gap-2">
            {/* <Menu className="w-5 h-5" /> */}
            <img
              src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
              alt="Gmail Logo"
              className="h-8"
            />
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/90 text-white font-semibold hover:bg-black cursor-pointer w-full">
            <Pencil className="w-4 h-4" /> Compose
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-4 flex flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Labels */}
        <div className="px-4 mt-4 text-sm font-medium flex justify-between items-center">
          <span>Labels</span>
          <PlusCircle className="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-300">
        <button className="flex items-center gap-2 text-sm hover:text-black">
          <span className="text-xs">ⓘ</span> Upgrade{" "}
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, path }) {
  return (
    <Link
    to={path}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active ? "bg-black/10 text-black font-semibold" : "hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

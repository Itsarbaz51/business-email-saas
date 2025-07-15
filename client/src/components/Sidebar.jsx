import {
  Zap,
  Edit3,
  Inbox,
  Star,
  Send,
  Archive,
  Trash2,
  Settings,
  Plus,
  Mails,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    {
      icon: <Mails className="w-5 h-5" />,
      label: "All Mails",
      path: "/all-mails",
      count: 50,
    },
    {
      icon: <Inbox className="w-5 h-5" />,
      label: "Inbox",
      path: "/inbox",
      count: 12,
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Starred",
      path: "/starred",
      count: 3,
    },
    { icon: <Send className="w-5 h-5" />, label: "Sent", path: "/sent" },
    {
      icon: <Archive className="w-5 h-5" />,
      label: "Archive",
      path: "/archive",
    },
    { icon: <Trash2 className="w-5 h-5" />, label: "Trash", path: "/trash" },
   
  ];

  const labels = [
    { name: "Work", color: "bg-blue-500" },
    { name: "Personal", color: "bg-green-500" },
    { name: "Important", color: "bg-red-500" },
    { name: "Travel", color: "bg-yellow-500" },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-72
    transform transition-transform duration-300 ease-in-out
    fixed top-0 left-0 h-full z-40 overflow-y-auto
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0 lg:flex lg:flex-col lg:h-auto lg:z-auto
  `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">MailFlow</h2>

          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden fixed top-5 right-4 p-2 bg-white border font-bold border-gray-300 hover:bg-gray-100 rounded-lg z-30"
            aria-label="Toggle menu"
          >
            <X className="w-4 h-4 font-bold text-black" />
          </button>
        </div>

        {/* Compose Button */}
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
          <Edit3 className="w-5 h-5" />
          <span className="font-medium">Compose</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              setSidebarOpen={setSidebarOpen}
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              count={item.count}
            />
          ))}
        </nav>

        {/* Labels */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Labels</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {labels.map((label) => (
              <div
                key={label.name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${label.color}`}></div>
                <span className="text-sm text-gray-700">{label.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, path, count, setSidebarOpen }) {
  return (
    <Link
      to={path}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? "bg-violet-100 text-violet-700 border border-violet-200"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
      onClick={() => setSidebarOpen((prev) => !prev)}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            active
              ? "bg-violet-200 text-violet-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

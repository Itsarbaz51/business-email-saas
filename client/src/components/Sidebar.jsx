import {
  Inbox,
  Star,
  Send,
  Archive,
  Trash2,
  Settings,
  Mails,
  LayoutDashboard,
  Globe,
  Mailbox,
  CreditCard,
  Zap,
  X,
  Edit3,
  Shield,
  User,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser, logout } from "../redux/slices/authSlice.js";

const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    path: "/:role/dashboard",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <Inbox className="w-5 h-5" />,
    label: "Inbox",
    path: "/:role/inbox",
    count: 12,
    roles: ["USER"],
  },
  {
    icon: <Mails className="w-5 h-5" />,
    label: "All Mails",
    path: "/:role/all-mails",
    count: 50,
    roles: ["USER"],
  },
  {
    icon: <Star className="w-5 h-5" />,
    label: "Starred",
    path: "/:role/starred",
    count: 3,
    roles: ["USER"],
  },
  {
    icon: <Send className="w-5 h-5" />,
    label: "Sent",
    path: "/:role/sent",
    roles: ["USER"],
  },
  {
    icon: <Archive className="w-5 h-5" />,
    label: "Archive",
    path: "/:role/archive",
    roles: ["USER"],
  },
  {
    icon: <Trash2 className="w-5 h-5" />,
    label: "Trash",
    path: "/:role/trash",
    roles: ["USER"],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    label: "Domains",
    path: "/:role/domains",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <Mailbox className="w-5 h-5" />,
    label: "Mailboxes",
    path: "/:role/mailboxes",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: "Billing",
    path: "/:role/billing",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    path: "/:role/settings",
    roles: ["ADMIN", "SUPER_ADMIN", "USER"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "System Logs",
    path: "/superadmin/logs",
    roles: ["SUPER_ADMIN"],
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Admin Tools",
    path: "/superadmin/tools",
    roles: ["SUPER_ADMIN"],
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen, onCompose }) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  const role =
    currentUser?.role?.toUpperCase().replace(" ", "_") || null;
  const location = useLocation();

  if (!role) return null;

  // Base path
  const basePath =
    role === "USER" ? "/u" : role === "ADMIN" ? "/admin" : "/superadmin";

  // Sidebar links
  const visibleLinks = navItems
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      path: item.path.replace(":role", basePath.replace("/", "")),
    }));

  // Split items
  const superAdminItems = visibleLinks.filter(
    (item) => item.roles.length === 1 && item.roles[0] === "SUPER_ADMIN"
  );
  const regularItems = visibleLinks.filter(
    (item) => !superAdminItems.includes(item)
  );

  const labels = [
    { name: "Work", color: "bg-blue-500" },
    { name: "Personal", color: "bg-green-500" },
    { name: "Important", color: "bg-red-500" },
    { name: "Travel", color: "bg-yellow-500" },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-72 fixed top-0 left-0 h-full z-40 overflow-y-auto
      transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:static lg:translate-x-0 lg:flex lg:flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">MailFlow</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed top-5 right-4 p-2 border border-gray-300 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {role === "USER" && <button onClick={onCompose} className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-lg">
          <Edit3 className="w-5 h-5" />
          <span className="font-medium">Compose</span>
        </button>}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-1">
          {regularItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              count={item.count}
              active={location.pathname.startsWith(item.path)}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </nav>

        {superAdminItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">
              Super Admin
            </h3>
            {superAdminItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                count={item.count}
                active={location.pathname.startsWith(item.path)}
                setSidebarOpen={setSidebarOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer (Settings + Logout + Profile) */}
      <div className="p-4 border-t border-gray-200 space-y-2">

        {/* {role === "USER" && (
          <Link
            to="/u/profile"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Profile</span>
          </Link>
        )} */}

        <button
          onClick={() => dispatch(logout())}
          className="flex items-center cursor-pointer gap-3 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, path, active, count, setSidebarOpen }) {
  return (
    <Link
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active
          ? "bg-violet-100 text-violet-700 border border-violet-200"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${active
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

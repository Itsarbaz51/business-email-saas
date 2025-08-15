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
  Users,
  Mailbox,
  CreditCard,
  Zap,
  X,
  Edit3,
  Plus,
  Shield,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../redux/slices/authSlice.js";

/* ─── Helper: choose correct path per role ───────────────────────── */
const getPath = (item, role) => (item.pathFor ? item.pathFor[role] : item.path);

/* ─── Nav items ──────────────────────────────────────────────────── */
const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    pathFor: {
      admin: "/admin/dashboard",
      superadmin: "/superadmin/dashboard",
    },
    roles: ["ADMIN", "superadmin"], // removed "user"
  },
  {
    icon: <Mails className="w-5 h-5" />,
    label: "All Mails",
    pathFor: {
      user: "/u/all-mails",
      admin: "/admin/all-mails",
      superadmin: "/superadmin/all-mails",
    },
    count: 50,
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Inbox className="w-5 h-5" />,
    label: "Inbox",
    pathFor: {
      user: "/u/inbox",
      admin: "/admin/inbox",
      superadmin: "/superadmin/inbox",
    },
    count: 12,
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Star className="w-5 h-5" />,
    label: "Starred",
    pathFor: {
      user: "/u/starred",
      admin: "/admin/starred",
      superadmin: "/superadmin/starred",
    },
    count: 3,
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Send className="w-5 h-5" />,
    label: "Sent",
    pathFor: {
      user: "/u/sent",
      admin: "/admin/sent",
      superadmin: "/superadmin/sent",
    },
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Archive className="w-5 h-5" />,
    label: "Archive",
    pathFor: {
      user: "/u/archive",
      admin: "/admin/archive",
      superadmin: "/superadmin/archive",
    },
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Trash2 className="w-5 h-5" />,
    label: "Trash",
    pathFor: {
      user: "/u/trash",
      admin: "/admin/trash",
      superadmin: "/superadmin/trash",
    },
    roles: ["user", "ADMIN", "superadmin"],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    label: "Domains",
    pathFor: {
      admin: "/admin/domains",
      superadmin: "/superadmin/domains",
    },
    roles: ["ADMIN", "superadmin"],
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Users",
    pathFor: {
      admin: "/admin/users",
      superadmin: "/superadmin/users",
    },
    roles: ["ADMIN", "superadmin"],
  },
  {
    icon: <Mailbox className="w-5 h-5" />,
    label: "Mailboxes",
    pathFor: {
      admin: "/admin/mailboxes",
      superadmin: "/superadmin/mailboxes",
    },
    roles: ["ADMIN", "superadmin"],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: "Billing",
    pathFor: {
      admin: "/admin/billing",
      superadmin: "/superadmin/billing",
    },
    roles: ["ADMIN", "superadmin"],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    pathFor: {
      admin: "/admin/settings",
      superadmin: "/superadmin/settings",
    },
    roles: ["ADMIN", "superadmin"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "System Logs",
    path: "/superadmin/logs",
    roles: ["superadmin"],
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Admin Tools",
    path: "/superadmin/tools",
    roles: ["superadmin"],
  },
];

/* ─── Sidebar component ─────────────────────────────────────────── */
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const role = user?.role;

  const location = useLocation();

  const visibleLinks = navItems.filter((i) => i.roles.includes(role));

  if (["ADMIN", "superadmin"].includes(role)) {
    visibleLinks.sort((a, b) =>
      a.label === "Dashboard" ? -1 : b.label === "Dashboard" ? 1 : 0
    );
  }

  const superOnly =
    role === "superadmin"
      ? visibleLinks.filter(
          (i) => i.roles.length === 1 && i.roles[0] === "superadmin"
        )
      : [];

  const regular = visibleLinks.filter((i) => !superOnly.includes(i));

  const labelTitle =
    role === "superadmin"
      ? "Super Administrator"
      : role === "ADMIN"
      ? "Administrator"
      : "Labels";

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

        <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-lg">
          <Edit3 className="w-5 h-5" />
          <span className="font-medium">Compose</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-1">
          {regular.map((item) => {
            const path = getPath(item, role);
            return (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={path}
                count={item.count}
                active={location.pathname === path}
                setSidebarOpen={setSidebarOpen}
              />
            );
          })}
        </nav>

        {superOnly.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">
              Super Admin
            </h3>
            {superOnly.map((item) => {
              const path = getPath(item, role);
              return (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  path={path}
                  count={item.count}
                  active={location.pathname === path}
                  setSidebarOpen={setSidebarOpen}
                />
              );
            })}
          </div>
        )}

        {/* Labels */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">{labelTitle}</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {labels.map(({ name, color }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg"
              >
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-sm text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings for admin/superadmin */}
      {visibleLinks.some((i) => i.label === "Settings") && (
        <div className="p-4 border-t border-gray-200">
          <Link
            to={getPath(
              navItems.find((i) => i.label === "Settings"),
              role
            )}
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      )}

      {/* Profile for user */}
      {role === "user" && (
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/u/profile"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">Profile</span>
          </Link>
        </div>
      )}
    </aside>
  );
}

/* Sidebar row */
function SidebarItem({ icon, label, path, active, count, setSidebarOpen }) {
  return (
    <Link
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
        active
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

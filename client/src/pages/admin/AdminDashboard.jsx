import { useEffect, useState } from "react";
import {
  Mail,
  Server,
  Send,
  Inbox,
  HardDrive,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Menu,
  X,
  Activity,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { getAlldashboardData } from "../../redux/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.dashboard);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getAlldashboardData());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
    else return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = "blue",
    isLoading = false,
  }) => {
    const colorClasses = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", accent: "bg-blue-500" },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        accent: "bg-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        accent: "bg-purple-500",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        accent: "bg-orange-500",
      },
      indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        accent: "bg-indigo-500",
      },
    };

    if (isLoading) {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="bg-gray-200 rounded-xl p-3 w-12 h-12"></div>
            <div className="bg-gray-200 h-4 w-16 rounded"></div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="bg-gray-200 h-8 w-20 rounded"></div>
            <div className="bg-gray-200 h-4 w-32 rounded"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl ${colorClasses[color].bg} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`h-6 w-6 ${colorClasses[color].text}`} />
          </div>
          {trend && (
            <div className="flex items-center space-x-1 text-green-500 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3" />
              <span className="text-xs font-semibold">+{trend}%</span>
            </div>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          <p className="text-gray-600 font-medium text-sm">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  const DomainCard = ({ domain }) => (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-white border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-white rounded-xl shadow-sm border group-hover:border-blue-200 transition-colors">
          <Server className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
            {domain.name}
          </p>
          <p className="text-sm text-gray-500">
            {domain.mailboxes} mailboxes configured
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            domain.status === "VERIFIED"
              ? "bg-green-100 text-green-800 border-green-200"
              : domain.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-gray-100 text-gray-800 border-gray-200"
          }`}
        >
          {domain.status}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  const EmailCard = ({ email, type = "sent" }) => (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-white border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white rounded-xl shadow-sm border group-hover:border-blue-200 transition-colors flex-shrink-0">
          {type === "sent" ? (
            <Send className="h-5 w-5 text-blue-600" />
          ) : (
            <Inbox className="h-5 w-5 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors truncate text-sm">
            {email.subject}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {type === "sent" ? `To: ${email.to}` : `From: ${email.from}`}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 truncate">{email.mailbox}</p>
            <p className="text-xs text-gray-400 flex items-center space-x-1">
              <CalendarDays className="h-3 w-3" />
              <span>
                {formatDate(type === "sent" ? email.sentAt : email.receivedAt)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn">
          <Eye className="h-4 w-4 text-gray-400 group-hover/btn:text-blue-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="p-6 border-b border-gray-100">
        <div className="bg-gray-200 h-6 w-32 rounded"></div>
      </div>
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="bg-gray-200 rounded-xl w-12 h-12"></div>
            <div className="space-y-2 flex-1">
              <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="ml-16 lg:ml-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Monitor your email infrastructure at a glance
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  System Online
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                <Clock className="h-4 w-4" />
                <span>Updated {formatDate(new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard
            icon={Server}
            title="Active Domains"
            value={dashboardData.totalDomains}
            subtitle="Email domains configured"
            trend="15"
            color="blue"
            isLoading={loading}
          />
          <StatCard
            icon={Users}
            title="Total Mailboxes"
            value={dashboardData.totalMailboxes}
            subtitle="Active email accounts"
            trend="23"
            color="green"
            isLoading={loading}
          />
          <StatCard
            icon={Inbox}
            title="Received Emails"
            value={dashboardData.totalReceivedEmails}
            subtitle="Incoming messages"
            trend="18"
            color="purple"
            isLoading={loading}
          />
          <StatCard
            icon={Send}
            title="Sent Emails"
            value={dashboardData.totalSentEmails}
            subtitle="Outgoing messages"
            trend="27"
            color="orange"
            isLoading={loading}
          />
          <StatCard
            icon={HardDrive}
            title="Storage Used"
            value={formatBytes(dashboardData.storageUsed)}
            subtitle="Total attachment storage"
            color="indigo"
            isLoading={loading}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Domains */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    <span>Recent Domains</span>
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.recentDomains.map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Sent Emails */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    <span>Recent Sent</span>
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.recentSentEmails.map((email) => (
                  <EmailCard key={email.id} email={email} type="sent" />
                ))}
              </div>
            </div>
          )}

          {/* Recent Received Emails */}
          {loading ? (
            <LoadingCard />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <Inbox className="h-5 w-5 text-green-600" />
                    <span>Recent Received</span>
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.recentReceivedEmails.map((email) => (
                  <EmailCard key={email.id} email={email} type="received" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

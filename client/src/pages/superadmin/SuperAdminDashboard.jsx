import {
  Shield,
  Server,
  Activity,
  AlertCircle,
  Globe,
  Users,
  Cpu,
} from "lucide-react";
import { useSelector } from "react-redux";

const SuperAdminDashboard = () => {
  const { domains, users } = useSelector((s) => s.stats);
  const logs = useSelector((s) => s.logs?.recent);
  const currentUser = useSelector((s) => s.auth.user);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">
          Greetings, {currentUser?.name || "SuperAdmin"}
        </p>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Metric
          icon={<Shield className="h-8 w-8 text-red-600" />}
          label="Security Alerts"
          value={34}
        />
        <Metric
          icon={<Server className="h-8 w-8 text-indigo-600" />}
          label="Active Servers"
          value={8}
        />
        <Metric
          icon={<Globe className="h-8 w-8 text-blue-600" />}
          label="Total Domains"
          value={domains.length}
        />
        <Metric
          icon={<Users className="h-8 w-8 text-purple-600" />}
          label="Total Users"
          value={users.length}
        />
      </section>

      {/* Details Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Latest System Logs">
          {logs?.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center mb-2">
              <Cpu className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-800">{log.message}</span>
            </div>
          ))}
        </Card>

        <Card title="Recent Critical Alerts">
          <AlertItem
            icon={<AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
            msg="Database latency spiked"
          />
          <AlertItem
            icon={<Activity className="h-4 w-4 text-yellow-500 mr-2" />}
            msg="High CPU usage detected"
          />
        </Card>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;

/* Helper: Metric block */
const Metric = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      {icon}
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

/* Helper: Section card */
const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

/* Helper: Alert message */
const AlertItem = ({ icon, msg }) => (
  <div className="flex items-center">
    {icon}
    <span className="text-sm text-gray-800">{msg}</span>
  </div>
);

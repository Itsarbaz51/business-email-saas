import {
    Globe,
    Mail,
    Users,
    Database,
    CheckCircle,
    Plus,
} from "lucide-react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const { domains, mailboxes, users } = useSelector((s) => s.stats);
    const currentUser = useSelector((s) => s.auth.user);

    return (
        <div className="p-6">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, {currentUser?.name || "Admin"}
                </p>
            </header>

            {/* Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<Globe className="h-8 w-8 text-blue-600" />}
                    label="Total Domains"
                    value={domains.length}
                />
                <MetricCard
                    icon={<Mail className="h-8 w-8 text-green-600" />}
                    label="Total Mailboxes"
                    value={mailboxes.length}
                />
                <MetricCard
                    icon={<Users className="h-8 w-8 text-purple-600" />}
                    label="Total Users"
                    value={users.length}
                />
                <MetricCard
                    icon={<Database className="h-8 w-8 text-orange-600" />}
                    label="Storage Used"
                    value="7.5 GB"
                />
            </section>

            {/* Recent Items */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WhiteCard title="Recent Domains">
                    {domains.map((d) => (
                        <div key={d.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{d.name}</p>
                                <p className="text-sm text-gray-500">
                                    {d.mailboxes} mailboxes
                                </p>
                            </div>
                            <StatusBadge status={d.status} />
                        </div>
                    ))}
                </WhiteCard>

                <WhiteCard title="Recent Activity">
                    <ActivityItem
                        icon={<CheckCircle className="h-4 w-4 text-green-500 mr-3" />}
                        text="Domain company.com verified"
                    />
                    <ActivityItem
                        icon={<Plus className="h-4 w-4 text-blue-500 mr-3" />}
                        text="New mailbox created: sales@company.com"
                    />
                    <ActivityItem
                        icon={<Users className="h-4 w-4 text-purple-500 mr-3" />}
                        text="User invited: user@company.com"
                    />
                </WhiteCard>
            </section>
        </div>
    );
};

export default AdminDashboard;

/* --- Helpers --- */
const MetricCard = ({ icon, label, value }) => (
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

const WhiteCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const ActivityItem = ({ icon, text }) => (
    <div className="flex items-center">
        {icon}
        <span className="text-sm text-gray-900">{text}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusColorMap = {
        active: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        suspended: "bg-red-100 text-red-700",
        inactive: "bg-gray-100 text-gray-600",
    };

    const normalized = status?.toLowerCase();
    const color = statusColorMap[normalized] || "bg-gray-100 text-gray-600";

    return (
        <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${color}`}
        >
            {status}
        </span>
    );
};

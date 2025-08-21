import React, { useEffect, useState } from 'react';
import {
  Search,
  Database,
  Shield,
  Zap,
  Globe,
  Mail,
  Server,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle,
  Users,
  User,
  Calendar,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Sample admin data based on your JSON structure
  const [adminsData, setAdminsData] = useState({
    totalAdmins: 2,
    page: 1,
    limit: 10,
    admins: [
      {
        id: "cmel1e9t40000pdejiymnxqjn",
        name: "dfs",
        email: "admin@gmail.com",
        role: "ADMIN",
        createdAt: "2025-08-21T06:44:57.984Z",
        totalDomains: 0,
        domainNames: [],
        totalMailboxes: 0,
        mailboxNames: [],
        totalSentEmails: 0,
        totalReceivedEmails: 0,
        lastSubscription: null
      },
      {
        id: "cmekwlbow0000pdwx916mhoy7",
        name: "arbaz",
        email: "admin1@gmail.com",
        role: "ADMIN",
        createdAt: "2025-08-21T04:30:28.976Z",
        totalDomains: 1,
        domainNames: ["primewebdev.in"],
        totalMailboxes: 1,
        mailboxNames: [null],
        totalSentEmails: 0,
        totalReceivedEmails: 0,
        lastSubscription: {
          id: "cmekzgpuz0001pd4mmkawsex9",
          plan: "BASIC",
          billingCycle: "MONTHLY",
          maxMailboxes: 10,
          maxDomains: 3,
          maxSentEmails: 1000,
          maxReceivedEmails: 10000,
          allowedStorageMB: 10240,
          storageUsedMB: 0,
          paymentStatus: "SUCCESS",
          paymentProvider: "RAZORPAY",
          paymentId: "pay_R7sKFBdJDoBALj",
          razorpayOrderId: "order_R7sJEbYUcn3i6T",
          razorpayPaymentId: "pay_R7sKFBdJDoBALj",
          razorpayStatus: "captured",
          startDate: "2025-08-21T05:50:52.893Z",
          endDate: "2025-09-21T05:50:52.893Z",
          isActive: true,
          userId: "cmekwlbow0000pdwx916mhoy7"
        }
      }
    ]
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth || {});

  useEffect(() => {
    // dispatch(allDataGet());
  }, [dispatch]);

  const categories = [
    { id: 'all', name: 'All Admins', count: adminsData.totalAdmins },
    { id: 'active', name: 'Active', count: adminsData.admins.filter(a => a.lastSubscription?.isActive).length },
    { id: 'inactive', name: 'Inactive', count: adminsData.admins.filter(a => !a.lastSubscription?.isActive).length },
    { id: 'basic', name: 'Basic Plan', count: adminsData.admins.filter(a => a.lastSubscription?.plan === 'BASIC').length },
    { id: 'premium', name: 'Premium Plan', count: adminsData.admins.filter(a => a.lastSubscription?.plan === 'PREMIUM').length }
  ];

  const filteredAdmins = adminsData.admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (activeCategory === 'active') matchesCategory = admin.lastSubscription?.isActive;
    else if (activeCategory === 'inactive') matchesCategory = !admin.lastSubscription?.isActive;
    else if (activeCategory === 'basic') matchesCategory = admin.lastSubscription?.plan === 'BASIC';
    else if (activeCategory === 'premium') matchesCategory = admin.lastSubscription?.plan === 'PREMIUM';

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription) return { status: 'No Subscription', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (subscription.isActive) return { status: 'Active', color: 'text-green-600', bg: 'bg-green-100' };
    return { status: 'Expired', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Admin Management
            </h1>
            <p className="text-gray-600 mt-1">Manage administrators and their subscriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus size={20} />
              Add Admin
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900">{adminsData.totalAdmins}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-green-600">
                {adminsData.admins.filter(a => a.lastSubscription?.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Domains</p>
              <p className="text-3xl font-bold text-purple-600">
                {adminsData.admins.reduce((sum, admin) => sum + admin.totalDomains, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mailboxes</p>
              <p className="text-3xl font-bold text-orange-600">
                {adminsData.admins.reduce((sum, admin) => sum + admin.totalMailboxes, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mail size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Admin List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domains</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mailboxes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => {
                const subscriptionStatus = getSubscriptionStatus(admin.lastSubscription);
                return (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {admin.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscriptionStatus.bg} ${subscriptionStatus.color}`}>
                          {subscriptionStatus.status}
                        </span>
                        {admin.lastSubscription && (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getPlanBadgeColor(admin.lastSubscription.plan)}`}>
                            {admin.lastSubscription.plan}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.totalDomains}</div>
                      {admin.domainNames.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {admin.domainNames.filter(d => d).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.totalMailboxes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowAdminModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex gap-2 justify-center items-center"
                        >
                          <Eye size={16} />
                          <span>view</span>
                        </button>
                        {/* <button className="text-gray-600 hover:text-gray-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Detail Modal */}
      {showAdminModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Admin Details</h2>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedAdmin.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedAdmin.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Admin ID</label>
                      <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {selectedAdmin.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-sm text-gray-900">{selectedAdmin.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created At</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedAdmin.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Domains</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAdmin.totalDomains}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Mailboxes</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAdmin.totalMailboxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Emails Sent</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAdmin.totalSentEmails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Emails Received</span>
                      <span className="text-sm font-medium text-gray-900">{selectedAdmin.totalReceivedEmails}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              {selectedAdmin.lastSubscription && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Plan</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${getPlanBadgeColor(selectedAdmin.lastSubscription.plan)}`}>
                            {selectedAdmin.lastSubscription.plan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Billing Cycle</span>
                          <span className="text-sm font-medium text-gray-900">{selectedAdmin.lastSubscription.billingCycle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSubscriptionStatus(selectedAdmin.lastSubscription).bg} ${getSubscriptionStatus(selectedAdmin.lastSubscription).color}`}>
                            {getSubscriptionStatus(selectedAdmin.lastSubscription).status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Start Date</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(selectedAdmin.lastSubscription.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">End Date</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(selectedAdmin.lastSubscription.endDate)}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Domains</span>
                          <span className="text-sm font-medium text-gray-900">{selectedAdmin.lastSubscription.maxDomains}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Mailboxes</span>
                          <span className="text-sm font-medium text-gray-900">{selectedAdmin.lastSubscription.maxMailboxes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Sent Emails</span>
                          <span className="text-sm font-medium text-gray-900">{selectedAdmin.lastSubscription.maxSentEmails.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Storage Limit</span>
                          <span className="text-sm font-medium text-gray-900">{(selectedAdmin.lastSubscription.allowedStorageMB / 1024).toFixed(1)} GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Storage Used</span>
                          <span className="text-sm font-medium text-gray-900">{selectedAdmin.lastSubscription.storageUsedMB} MB</span>
                        </div>
                      </div>
                    </div>

                    {selectedAdmin.lastSubscription.paymentId && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500">Payment ID:</span>
                            <span className="ml-2 font-mono">{selectedAdmin.lastSubscription.paymentId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Order ID:</span>
                            <span className="ml-2 font-mono">{selectedAdmin.lastSubscription.razorpayOrderId}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Domains */}
              {selectedAdmin.domainNames.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Domains</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.domainNames.filter(domain => domain).map((domain, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Admin
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">All Systems</p>
            <p className="font-semibold text-green-600">Operational</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Server size={24} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Server Load</p>
            <p className="font-semibold text-blue-600">12%</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Database size={24} className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Database</p>
            <p className="font-semibold text-purple-600">Healthy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap size={24} className="text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Response Time</p>
            <p className="font-semibold text-orange-600">145ms</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default ToolsPage;
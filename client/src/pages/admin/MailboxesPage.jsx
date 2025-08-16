import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Mail,
  Plus,
  Edit3,
  Shield,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import NotFound from "../../components/NotFound";
import { AddMailbox } from "../../components/forms/AddMailbox";
import {
  createMailbox,
  deleteMailbox,
  fetchMailboxes,
  updateMailbox,
} from "../../redux/slices/mailboxSlice";
import { fetchDomains } from "../../redux/slices/domainSlice";
import ConfirmDelete from "../ConfirmDelete";

// Import your mailbox slice actions

function MailboxesPage() {
  const dispatch = useDispatch();

  // Select mailboxes from Redux store

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMailbox, setEditMailbox] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMailboxes());
  }, [dispatch]);

  const mailboxes = useSelector((state) => state.mailbox?.list || []);
  const { domains } = useSelector((state) => state.domain);

  // Create / Update mailbox
  const handleSaveMailbox = (formData) => {
    if (editMailbox) {
      dispatch(updateMailbox({ id: editMailbox.id, ...formData }));
    } else {
      dispatch(createMailbox(formData));
    }
    setShowCreateModal(false);
    setEditMailbox(null);
  };

  // Delete mailbox confirmed
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteMailbox(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Edit mailbox (open modal with pre-filled data)
  const handleEditMailbox = (mailbox) => {
    setEditMailbox(mailbox);
    setShowCreateModal(true);
  };

  const filteredMailboxes = mailboxes.filter(
    (mailbox) =>
      mailbox.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      mailbox.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      INACTIVE: { color: "bg-red-100 text-red-800", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.INACTIVE;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Email Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your email accounts and settings
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditMailbox(null);
                setShowCreateModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create Mailbox</span>
            </button>
          </div>
        </div>
      </div>

      <div className=" py-6">
        {/* Search and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search mailboxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredMailboxes.length} of {mailboxes.length} mailboxes
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredMailboxes.length === 0 ? (
            <div className="p-8">
              <NotFound
                title="No Mailboxes Found"
                message={
                  searchQuery
                    ? "No mailboxes match your search criteria."
                    : "You haven't added any mailboxes yet. Add one to get started."
                }
                icon="inbox"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mailbox
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMailboxes.map((mailbox) => (
                    <tr key={mailbox.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Mail className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {mailbox.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {mailbox.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(mailbox.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mailbox.lastLogin
                          ? new Date(mailbox.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {mailbox.emailAddress}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditMailbox(mailbox)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            title="Edit mailbox"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(mailbox)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                            title="Delete mailbox"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AddMailbox
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditMailbox(null);
        }}
        onSubmit={handleSaveMailbox}
        initialData={
          editMailbox || { email: "", name: "", password: "", domains }
        }
      />
      <ConfirmDelete
        isOpen={!!deleteTarget}
        domainName={deleteTarget?.name || deleteTarget?.email}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default MailboxesPage;

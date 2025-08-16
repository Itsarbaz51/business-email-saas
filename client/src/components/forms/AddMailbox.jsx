import { useEffect, useState } from "react";
import { X, Mail, AlertCircle, Loader } from "lucide-react";

export const AddMailbox = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    domainId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = initialData && initialData.emailAddress;

  // Avoid infinite loop by using initialData.domains directly
  const domains = initialData?.domains || [];

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: initialData?.name || "",
      email: initialData?.emailAddress || "",
      password: "", // leave blank on edit
      domainId: initialData?.domainId || domains[0]?.id || "", // pre-select correct domain
    });

    setError("");
    setLoading(false);
  }, [initialData, isOpen]); // don't include 'domains' to avoid infinite loop

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isEdit && !formData.password.trim()) {
      setError("Password is required");
      return;
    }
    if (!formData.domainId.trim()) {
      setError("Please select a domain");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to save mailbox. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-in zoom-in-95 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? "Edit Mailbox" : "Add New Mailbox"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEdit
                  ? "Update mailbox details"
                  : "Create a new mailbox under this domain"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onKeyDown={handleKeyPress}
              placeholder="Enter mailbox name"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                error && !formData.name.trim()
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              } focus:outline-none focus:ring-4 disabled:opacity-50`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onKeyDown={handleKeyPress}
              placeholder="user@example.com"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 focus:outline-none focus:ring-4 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isEdit ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onKeyDown={handleKeyPress}
              placeholder={
                isEdit
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 focus:outline-none focus:ring-4 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status Mailbox
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 focus:outline-none focus:ring-4 "
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* Domain Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Domain
            </label>
            <select
              value={formData.domainId}
              onChange={(e) =>
                setFormData({ ...formData, domainId: e.target.value })
              }
              disabled={loading || isEdit}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Domain --</option>

              {domains.length === 0 && formData.domainId && (
                <option value={formData.domainId}>
                  {formData.email?.split("@")[1] || "Unknown Domain"}
                </option>
              )}

              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Mailbox"
              : "Create Mailbox"}
          </button>
        </div>
      </div>
    </div>
  );
};

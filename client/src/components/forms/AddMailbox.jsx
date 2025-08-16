import React, { useState, useEffect } from "react";
import { X, Mail, AlertCircle, Loader, Key } from "lucide-react";

function AddMailbox({ isOpen, onClose, onSubmit, initialData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData?.email) {
      setEmail(initialData.email);
      setPassword(""); // don't prefill password for security
    } else {
      setEmail("");
      setPassword("");
    }
    setError("");
    setLoading(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) {
      setError("Mailbox email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!initialData && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ email: email.trim(), password });
      setEmail("");
      setPassword("");
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to save mailbox. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-in zoom-in-95 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? "Edit Mailbox" : "Add New Mailbox"}
              </h2>
              <p className="text-sm text-gray-500">
                {initialData
                  ? "Update mailbox settings"
                  : "Create a new mailbox under your domain"}
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
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mailbox Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="user@example.com"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                autoFocus
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Password (only for new mailbox) */}
          {!initialData && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          )}

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
            className="px-5 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !email.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading
              ? initialData
                ? "Updating..."
                : "Adding..."
              : initialData
              ? "Update Mailbox"
              : "Add Mailbox"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMailbox;

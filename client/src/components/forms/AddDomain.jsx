import React, { useState, useEffect } from "react";
import { X, Globe, AlertCircle, Loader } from "lucide-react";

function AddDomain({ isOpen, onClose, onSubmit, initialData }) {
    const [domainName, setDomainName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData?.name) {
            setDomainName(initialData.name);
        } else {
            setDomainName("");
        }
        setError("");
        setLoading(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validateDomain = (name) => {
        // Simple regex for domain validation
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(name.trim());
    };

    const handleSubmit = async () => {
        setError("");

        if (!domainName.trim()) {
            setError("Domain name is required");
            return;
        }
        if (!validateDomain(domainName)) {
            setError("Please enter a valid domain name");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({ name: domainName.trim() });
            setDomainName("");
            setLoading(false);
            onClose();
        } catch (err) {
            setError("Failed to save domain. Please try again.");
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
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
                            <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {initialData ? "Edit Domain" : "Add New Domain"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {initialData ? "Update your domain settings" : "Add a domain to your account"}
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
                <div className="p-6">
                    {/* Domain Name Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Domain Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="example.com"
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
                        
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Helper Text */}
                        {!error && (
                            <p className="text-xs text-gray-500 mt-2">
                                Enter your domain without protocol (e.g., example.com, not https://example.com)
                            </p>
                        )}
                    </div>

                    {/* Domain Format Examples */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Valid formats:</h4>
                        <div className="space-y-1 text-xs text-blue-700">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                <span className="font-mono">example.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                <span className="font-mono">subdomain.example.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                <span className="font-mono">my-domain.org</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
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
                        disabled={loading || !domainName.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading
                            ? initialData
                                ? "Updating..."
                                : "Adding..."
                            : initialData
                                ? "Update Domain"
                                : "Add Domain"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddDomain;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Check, Copy, Globe, Shield, ShieldAlert, Edit, Trash2, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import AddDomain from "../../components/forms/AddDomain.jsx";
import { addDomain, deleteDomain, fetchDomains, verifyDomain } from "../../redux/slices/domainSlice.js";
import NotFound from "../../components/NotFound.jsx";
import ConfirmDelete from "../ConfirmDelete.jsx";

function DomainsPage() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editDomainData, setEditDomainData] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [expandedDomains, setExpandedDomains] = useState(new Set());
  const [isVerifying, setIsVerifying] = useState({});
  const [verificationTimer, setVerificationTimer] = useState({});

  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);

  const domains = useSelector((state) => state.domain.domains || []);

  const handleAddDomain = (data) => {
    if (editDomainData) {
      dispatch(editDomain({ id: editDomainData.id, ...data }));
    } else {
      dispatch(addDomain(data));
    }
    setShowForm(false);
    setEditDomainData(null);
  };

  const verifyDnsHandler = (domainName, domainId) => {
    setIsVerifying(prev => ({ ...prev, [domainId]: true }));
    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    setVerificationTimer(prev => ({ ...prev, [domainId]: expiryTime }));

    dispatch(verifyDomain(domainName))
      .unwrap()
      .finally(() => {
        setIsVerifying(prev => ({ ...prev, [domainId]: false }));
      });
  };

  const isWithin24h = (domainId) => {
    const timer = verificationTimer[domainId];
    return timer && Date.now() < timer;
  };

  const handleCopy = (value, id) => {
    navigator.clipboard.writeText(value);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleDomainExpansion = (domainId) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(domainId)) {
        newSet.delete(domainId);
      } else {
        newSet.add(domainId);
      }
      return newSet;
    });
  };

  const getDomainVerificationStatus = (domain) => {
    const hasRecords = domain.dnsRecords && domain.dnsRecords.length > 0;
    if (!hasRecords) return { isVerified: false, hasRecords: false };

    const allVerified = domain.dnsRecords.every(record => record.isVerified === true);
    return { isVerified: allVerified, hasRecords: true };
  };


  // inside DomainsPage component
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteDomain(deleteTarget.name));
      setDeleteTarget(null);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Domain Management</h1>
              <p className="text-gray-600">Manage your domains and DNS configurations</p>
            </div>
            <button
              onClick={() => {
                setEditDomainData(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} /> Add Domain
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {domains?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Domains</p>
                  <p className="text-xl font-bold text-gray-900">{domains.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-xl font-bold text-gray-900">
                    {domains.filter(d => getDomainVerificationStatus(d).isVerified).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold text-gray-900">
                    {domains.filter(d => d.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {domains?.length === 0 ? (
            <div className="col-span-full">
              <NotFound
                title="No Domains Found"
                message="You haven't added any domains yet. Add one to get started."
                icon="inbox"
              />
            </div>
          ) : (
            domains?.map((domain) => {
              const verificationStatus = getDomainVerificationStatus(domain);
              const isVerifyingDomain = isVerifying[domain.id];
              const isPending = isWithin24h(domain.id);

              return (
                <div key={domain.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Domain Header */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 break-all">
                          {domain.name}
                        </h3>

                        {/* Status and Verification Row */}
                        <div className="flex gap-2">
                          {/* Domain Status */}
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${domain.status === "active"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                }`}
                            >
                              {domain.status}
                            </span>
                          </div>

                          {/* Verification Status */}
                          <div className="flex items-center gap-2">
                            {verificationStatus.isVerified ? (
                              <div className="flex items-center gap-1">
                                <ShieldCheck size={16} className="text-green-600" />
                                <span className="text-xs font-medium text-green-600">DNS Verified</span>
                              </div>
                            ) : isPending ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-blue-600">Verification Pending (upto 24h)</span>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            ) : verificationStatus.hasRecords ? (
                              <button
                                className="flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                disabled={isVerifyingDomain}
                                onClick={() => verifyDnsHandler(domain.name, domain.id)}
                              >
                                <ShieldAlert size={16} className="text-red-600" />
                                <span className="text-xs font-medium text-red-600">
                                  {isVerifyingDomain ? "Verifying..." : "DNS Unverified"}
                                </span>
                                <span className="text-xs text-gray-500">(click to verify)</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Shield size={16} className="text-gray-400" />
                                <span className="text-xs font-medium text-gray-500">No DNS Records</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditDomainData(domain);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(domain)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      <ConfirmDelete
                        isOpen={!!deleteTarget}
                        domainName={deleteTarget?.name}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={handleDeleteConfirm}
                      />

                    </div>
                  </div>

                  {/* DNS Records Section */}
                  {domain.dnsRecords?.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      <div className="p-6">
                        <button
                          onClick={() => toggleDomainExpansion(domain.id)}
                          className="w-full flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-gray-900">
                              DNS Records ({domain.dnsRecords.length})
                            </span>
                          </div>
                          <div>
                            {expandedDomains.has(domain.id) ? (
                              <ChevronUp size={16} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-500" />
                            )}
                          </div>
                        </button>
                        <span className="text-xs mx-2.5 text-gray-500">
                          Add these to your DNS provider
                        </span>

                        {expandedDomains.has(domain.id) && (
                          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="font-medium mb-1">Instructions:</p>
                              <p>Add these DNS records to your domain provider (GoDaddy, Hostinger, etc.) to verify ownership and enable services.</p>
                            </div>

                            {domain.dnsRecords.map((record) => (
                              <div
                                key={record.id}
                                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
                              >
                                {/* Record Type and Status */}
                                <div className="flex justify-between items-center mb-3">
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                                    {record.recordType}
                                  </span>
                                  {record.isVerified && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <ShieldCheck size={12} />
                                      <span className="text-xs">Verified</span>
                                    </div>
                                  )}
                                </div>

                                {/* Record Details */}
                                <div className="space-y-3">
                                  {/* Record Name */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Name
                                    </label>
                                    <div className="flex items-center justify-between bg-gray-50 rounded-md border border-gray-200 p-2">
                                      <span className="text-sm font-mono text-gray-900 break-all mr-2">
                                        {record.recordName}
                                      </span>
                                      <button
                                        onClick={() => handleCopy(record.recordName, `name-${record.id}`)}
                                        className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                                        title="Copy to clipboard"
                                      >
                                        {copiedItem === `name-${record.id}` ? (
                                          <Check size={14} className="text-green-600" />
                                        ) : (
                                          <Copy size={14} />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Record Value */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                      Value
                                    </label>
                                    <div className="flex items-center justify-between bg-gray-50 rounded-md border border-gray-200 p-2">
                                      <span className="text-sm font-mono text-gray-900 break-all mr-2">
                                        {record.recordValue}
                                      </span>
                                      <button
                                        onClick={() => handleCopy(record.recordValue, `value-${record.id}`)}
                                        className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                                        title="Copy to clipboard"
                                      >
                                        {copiedItem === `value-${record.id}` ? (
                                          <Check size={14} className="text-green-600" />
                                        ) : (
                                          <Copy size={14} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Domain Form Modal */}
        <AddDomain
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddDomain}
          initialData={editDomainData}
        />
      </div>
    </div>
  );
}

export default DomainsPage;
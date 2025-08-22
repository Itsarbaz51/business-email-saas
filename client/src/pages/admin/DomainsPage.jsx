import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Copy,
  Globe,
  Shield,
  ShieldAlert,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";
import AddDomain from "../../components/forms/AddDomain.jsx";
import {
  addDomain,
  deleteDomain,
  fetchDomains,
  updateDomain,
  verifyDomain,
} from "../../redux/slices/domainSlice.js";
import ConfirmDelete from "../ConfirmDelete.jsx";
import Header from "../../components/ui/Header.jsx";
import StatCard from "../../components/ui/Stats.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Footer from "../../components/Footer.jsx";

function DomainsPage() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editDomainData, setEditDomainData] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const [expandedDomains, setExpandedDomains] = useState(() => new Set());
  const [isVerifying, setIsVerifying] = useState({});
  const [verificationTimer, setVerificationTimer] = useState({});
  const [verificationError, setVerificationError] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const domains = useSelector((state) => state.domain.domains || []);

  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);

  const handleAddDomain = (data) => {
    if (editDomainData) {
      dispatch(updateDomain({ id: editDomainData.id, ...data }));
    } else {
      dispatch(addDomain(data));
    }
    setShowForm(false);
    setEditDomainData(null);
  };

  const verifyDnsHandler = async (domainName, domainId) => {
    setIsVerifying((prev) => ({ ...prev, [domainId]: true }));
    setVerificationError((prev) => ({ ...prev, [domainId]: null }));

    const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
    setVerificationTimer((prev) => ({ ...prev, [domainId]: expiryTime }));

    try {
      const result = await dispatch(verifyDomain(domainName));
      if (!(result && result.success)) {
        setVerificationError((prev) => ({
          ...prev,
          [domainId]: result?.message || "Domain verification failed",
        }));
      }
    } catch (error) {
      setVerificationError((prev) => ({
        ...prev,
        [domainId]: error.message || "Verification request failed",
      }));
    } finally {
      setIsVerifying((prev) => ({ ...prev, [domainId]: false }));
    }
  };

  const isWithin24h = (domainId) => {
    const timer = verificationTimer[domainId];
    return timer && Date.now() < timer;
  };

  const handleCopy = (value, id) => {
    navigator.clipboard.writeText(String(value));
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const toggleDomainExpansion = (domainId) => {
    setExpandedDomains((prev) => {
      const s = new Set(prev);
      s.has(domainId) ? s.delete(domainId) : s.add(domainId);
      return s;
    });
  };

  const getDomainVerificationStatus = (domain) => {
    const hasRecords = domain.dnsRecords && domain.dnsRecords.length > 0;
    if (!hasRecords) return { isVerified: false, hasRecords: false };
    const allVerified = domain.dnsRecords.every((r) => r.isVerified === true);
    return { isVerified: allVerified, hasRecords: true };
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteDomain(deleteTarget.name));
      setDeleteTarget(null);
    }
  };

  // Stats
  const totalDomains = domains.length;
  const verifiedDomains = domains.filter(
    (d) => getDomainVerificationStatus(d).isVerified
  ).length;
  const activeDomains = domains.filter((d) => d.status === "active").length;
  const pendingDomains = domains.filter((d) => isWithin24h(d.id)).length;

  const stats = [
    {
      title: "Total Domains",
      count: totalDomains,
      description: "Registered domains",
      icon: <Globe className="w-6 h-6 text-white" />,
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
    },
    {
      title: "Verified",
      count: verifiedDomains,
      description: "DNS configured",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      gradientFrom: "green-500",
      gradientTo: "emerald-500",
    },
    {
      title: "Active",
      count: activeDomains,
      description: "Currently active",
      icon: <Activity className="w-6 h-6 text-white" />,
      gradientFrom: "purple-500",
      gradientTo: "pink-500",
    },
    {
      title: "Pending",
      count: pendingDomains,
      description: "Verification pending",
      icon: <Clock className="w-6 h-6 text-white" />,
      gradientFrom: "orange-500",
      gradientTo: "red-500",
    },
  ];

  // UI helpers
  const renderDnsStatusPill = (domain) => {
    const verificationStatus = getDomainVerificationStatus(domain);
    const isPending = isWithin24h(domain.id);
    const isVerifyingDomain = isVerifying[domain.id];

    if (verificationStatus.isVerified) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <ShieldCheck size={14} /> DNS Verified
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={14} /> Verification Pending
          <span className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></span>
        </span>
      );
    }
    if (verificationStatus.hasRecords) {
      return (
        <button
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
          disabled={isVerifyingDomain}
          onClick={() => verifyDnsHandler(domain.name, domain.id)}
          title="Verify DNS"
        >
          <ShieldAlert size={14} />
          {isVerifyingDomain ? "Verifying..." : "DNS Unverified"}
        </button>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
        <Shield size={14} /> No DNS Records
      </span>
    );
  };

  const renderDnsRecordsTable = (domain) => (
    <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-gray-200 bg-white/80">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Record Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Record Value
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              TTL (sec)
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {domain.dnsRecords.map((record, index) => (
            <tr
              key={record.id}
              className="hover:bg-blue-50/40 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                  {record.recordType}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900 break-all">
                    {record.recordName}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(record.recordName, `name-${record.id}`)
                    }
                    className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                    title="Copy name"
                  >
                    {copiedItem === `name-${record.id}` ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 max-w-[420px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900 break-all line-clamp-2">
                    {record.recordValue}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(record.recordValue, `value-${record.id}`)
                    }
                    className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                    title="Copy value"
                  >
                    {copiedItem === `value-${record.id}` ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-900">
                    {record.ttl}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(String(record.ttl), `ttl-${record.id}`)
                    }
                    className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                    title="Copy TTL"
                  >
                    {copiedItem === `ttl-${record.id}` ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                {record.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    <ShieldCheck size={14} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    <ShieldAlert size={14} /> Unverified
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() =>
                    handleCopy(
                      `${record.recordType} ${record.recordName} ${record.recordValue} TTL=${record.ttl}`,
                      `all-${record.id}`
                    )
                  }
                  className="px-3 py-2 text-sm rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white font-semibold transition"
                  title="Copy row"
                >
                  {copiedItem === `all-${record.id}` ? "Copied" : "Copy Row"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t">
        Tip: Add all records exactly the same way to your DNS provider.
        Propagation can take from a few minutes to a few hours.
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <Header
        setEditFormData={setEditDomainData}
        setShowForm={setShowForm}
        subTitle="Domain Management System"
        title="Domain Control Center"
        tagLine="Effortlessly manage your domains, verify DNS configurations, and monitor status with our advanced management platform."
        btnName="Add New Domain"
      />

      <div className="flex flex-col gap-y-6">
        {/* Stats */}
        {domains?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        )}

        {/* Domains Table */}
        {domains?.length === 0 ? (
          <EmptyState
            title="No Domains Yet"
            message="Start by adding your first domain to begin managing DNS configurations and monitoring status."
            buttonLabel="Add Your First Domain"
            onButtonClick={() => {
              setEditDomainData(null);
              setShowForm(true);
            }}
          />
        ) : (
          <div className="overflow-x-auto rounded-3xl border-2 border-white/40 bg-white/80 shadow-lg">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Expand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    DNS Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {domains.map((domain) => {
                  const isExpanded = expandedDomains.has(domain.id);
                  const errorMessage = verificationError[domain.id];
                  const recordsCount = domain.dnsRecords?.length || 0;

                  return (
                    <React.Fragment key={domain.id}>
                      <tr className="hover:bg-blue-50/40 transition-colors overflow-auto">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleDomainExpansion(domain.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                              <Globe className="w-4 h-4 text-white" />
                            </span>
                            <span className="font-semibold text-gray-900 break-all">
                              {domain.name}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(domain.name, `domain-${domain.id}`)
                              }
                              className="p-2 rounded-lg bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                              title="Copy domain"
                            >
                              {copiedItem === `domain-${domain.id}` ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                              domain.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                domain.status === "active"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              } animate-pulse`}
                            ></span>
                            {domain.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {renderDnsStatusPill(domain)}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-700">
                          {recordsCount}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditDomainData(domain);
                                setShowForm(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition"
                            >
                              <Edit size={16} /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(domain)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Error message row */}
                      {errorMessage && (
                        <tr>
                          <td colSpan={6} className="px-4 pb-3">
                            <div className="mt-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  size={18}
                                  className="text-red-600"
                                />
                                <p className="text-sm font-medium text-red-700">
                                  {errorMessage}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Expanded DNS Records row */}
                      {isExpanded && domain.dnsRecords?.length > 0 && (
                        <tr className="bg-gradient-to-r from-gray-50/50 to-white/50">
                          <td colSpan={6} className="px-4 pb-6">
                            {/* Scrollable container */}
                            <div className="max-h-96 overflow-y-auto pr-2">
                              {/* Guide */}
                              <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 text-white" />
                                  </div>
                                  <p className="font-semibold text-blue-800">
                                    DNS Configuration Guide
                                  </p>
                                </div>
                                <p className="text-sm text-blue-700">
                                  Copy these DNS records to your registrar
                                  (GoDaddy, Namecheap, Cloudflare, etc.) to
                                  verify ownership.
                                </p>
                              </div>

                              {/* DNS Records Table */}
                              {renderDnsRecordsTable(domain)}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Domain Modal */}
      <AddDomain
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddDomain}
        initialData={editDomainData}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        domainName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default DomainsPage;

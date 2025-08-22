import { useEffect, useMemo, useRef, useState } from "react";
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
  Plus,
  RefreshCw,
  Crown,
  Shield,
  Zap,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PricingSection from "../PricingSection";
import { getMySubscription } from "../../redux/slices/subscriptionSlice";
import Header from "../../components/ui/Header";
import StatCard from "../../components/ui/Stats";

import jsPDF from "jspdf";

function currency(n) {
  if (typeof n !== "number") return n;
  return `₹${n.toFixed(2)}`;
}

export default function BillingPage() {
  const dispatch = useDispatch();
  const { subscription: subscriptionData, loading } = useSelector(
    (state) => state.subscribe ?? { subscription: null, loading: false }
  );

  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showPriceSection, setShowPriceSection] = useState(false);
  const priceRef = useRef(null);

  // Jab showPriceSection true ho, to us block par smooth scroll
  useEffect(() => {
    if (showPriceSection && priceRef.current) {
      // Next tick me scroll, taaki DOM render ho jaye
      requestAnimationFrame(() => {
        priceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [showPriceSection]);
  useEffect(() => {
    dispatch(getMySubscription());
  }, [dispatch]);

  useEffect(() => {
    if (!subscriptionData) return;

    const sub = subscriptionData;

    const price =
      sub.plan === "BASIC"
        ? sub.invoices[0].amount
        : sub.plan === "PREMIUM"
        ? sub.invoices[0].amount
        : 0;
    const storageGb = sub.allowedStorageMB
      ? (sub.allowedStorageMB / 1024).toFixed(1)
      : 1;

    setSubscription({
      plan: sub.plan,
      price,
      billing: sub.billingCycle?.toLowerCase() || "monthly",
      nextBilling: sub.endDate
        ? new Date(sub.endDate).toLocaleDateString()
        : "N/A",
      status: sub.isActive ? "active" : "inactive",
      features: [
        `${sub.maxMailboxes || 0} Mailboxes`,
        `${sub.maxDomains || 0} Domains`,
        `${sub.maxSentEmails || 0} Sent Emails`,
        `${sub.maxReceivedEmails || 0} Received Emails`,
        `${storageGb} GB Storage`,
        `Payment via ${sub.paymentProvider || "Unknown"}`,
      ].filter(Boolean),
      autoRenew: Boolean(sub.autoRenew ?? true),
    });

    setInvoices(
      (sub.invoices || []).map((inv) => ({
        id: inv.invoiceId,
        date: inv.createdAt,
        description: `${sub.plan} Plan`,
        period: `${new Date(sub.startDate).toLocaleDateString()} - ${new Date(
          sub.endDate
        ).toLocaleDateString()}`,
        amount: inv.amount,
        status: inv.status.toLowerCase(),
      }))
    );
  }, [subscriptionData]);

  const totalDue = useMemo(
    () =>
      invoices
        .filter((i) => i.status === "overdue")
        .reduce((s, i) => s + i.amount, 0),
    [invoices]
  );

  const paidCount = useMemo(
    () => invoices.filter((i) => i.status === "paid").length,
    [invoices]
  );
  const overdueCount = useMemo(
    () => invoices.filter((i) => i.status === "overdue").length,
    [invoices]
  );

  function getStatusColor(status) {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "overdue":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  }

  function getPlanIcon(plan) {
    switch (plan) {
      case "PREMIUM":
        return <Crown className="h-6 w-6 text-purple-500" />;
      case "BASIC":
        return <Shield className="h-6 w-6 text-blue-500" />;
      default:
        return <Zap className="h-6 w-6 text-gray-500" />;
    }
  }

  function getPlanGradient(plan) {
    switch (plan) {
      case "PREMIUM":
        return "bg-gradient-to-br from-purple-500 to-pink-500";
      case "BASIC":
        return "bg-gradient-to-br from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  }

  const handleDownloadInvoice = async (invoice) => {
    try {
      // Create new PDF
      const doc = new jsPDF({
        orientation: "p", // portrait
        unit: "pt", // points (small units)
        format: "a4", // page size
        compress: true, // enable compression for smaller size
      });

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Invoice", 40, 40);

      // Basic invoice data
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      const data = {
        ...invoice,
        currency: "INR",
      };

      let y = 70;
      Object.entries(data).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 40, y);
        y += 20;
      });

      // Save PDF
      doc.save(`${invoice.id}.pdf`);
    } catch (e) {
      console.error("PDF Download failed", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="text-center relative z-10">
          <div className="relative w-12 h-12 mx-auto">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse" />
          </div>
          <p className="mt-4 text-slate-700 font-semibold">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Invoices",
      count: invoices.length,
      description: "Total generated",
      icon: <Activity className="w-6 h-6 text-white" />,
      gradientFrom: "blue-500",
      gradientTo: "cyan-500",
    },
    {
      title: "Paid",
      count: paidCount,
      description: "Successful payments",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      gradientFrom: "green-500",
      gradientTo: "emerald-500",
    },
    {
      title: "Overdue",
      count: overdueCount,
      description: "Pending invoices",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      gradientFrom: "orange-500",
      gradientTo: "red-500",
    },
    {
      title: "Total Overdue",
      // currency() agar func hai to use; warna String format kar do
      count:
        typeof currency === "function"
          ? currency(totalDue)
          : `₹${Number(totalDue || 0).toLocaleString()}`,
      description: "Amount due",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      gradientFrom: "purple-500",
      gradientTo: "pink-500",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <Header
          subTitle="Billing & Subscription"
          title="Billing Control Center"
          tagLine="Manage your plan, invoices, and payments in one sleek dashboard."
        />

        <button
          onClick={() => setShowPriceSection((s) => !s)}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative flex items-center gap-3 w-full justify-center">
            <Plus
              size={22}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span>{showPriceSection ? "Hide Plans" : "View Plans"}</span>
            <CreditCard
              size={18}
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-y-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Current Subscription Card */}
        {subscription ? (
          <div className="relative overflow-hidden bg-white/90 rounded-3xl shadow-xl border border-white/30 backdrop-blur-sm">
            <div
              className={`absolute top-0 left-0 right-0 h-2 ${getPlanGradient(
                subscription.plan
              )}`}
            ></div>

            <div className="p-8">
              {/* Plan Header */}
              <div className="flex mb-6 flex-col">
                <div className="flex items-center space-x-4 ">
                  <div
                    className={`p-3 rounded-2xl ${getPlanGradient(
                      subscription.plan
                    )} shadow-lg`}
                  >
                    {getPlanIcon(subscription.plan)}
                  </div>
                  <div className="">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {subscription.plan} Plan
                      {subscription.status === "active" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          Active
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">
                    {currency(subscription.price)}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1 justify-end">
                    <Calendar className="h-4 w-4" />
                    Next: {subscription.nextBilling}
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subscription.features.map((feature, i) => (
                  <div
                    key={i}
                    className="group p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="bg-white/90 rounded-3xl shadow-xl border border-white/30 backdrop-blur-sm p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-700 text-lg font-medium">
              No active subscription found
            </p>
            {
              <button
                onClick={() => setShowPriceSection((s) => !s)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative flex items-center gap-3">
                  <Plus
                    size={22}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                  <span>{showPriceSection ? "Hide Plans" : "View Plans"}</span>
                  <CreditCard
                    size={18}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </button>
            }
          </div>
        )}

        {/* Billing History  */}
        <div className="hidden lg:block bg-white/90 rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Billing History
              </h2>
              {totalDue > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currency(totalDue)} overdue
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Invoice ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-900">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-800">
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {invoice.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {invoice.period}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {currency(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition font-semibold"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}

                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-600 text-lg font-medium">
                          No invoices available
                        </p>
                        <p className="text-slate-400 text-sm">
                          Your billing history will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Helper footer like DomainPage */}
            <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-t">
              Tip: Auto-renew enable karke overdue invoices avoid kar sakte
              hain.
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-slate-200">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 space-y-2 bg-white shadow-sm"
              >
                <div className="text-sm font-mono text-slate-700">
                  <strong>Invoice ID:</strong> {invoice.id}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Date:</strong>{" "}
                  {new Date(invoice.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-900 font-semibold">
                  <strong>Description:</strong> {invoice.description}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Period:</strong> {invoice.period}
                </div>
                <div className="text-sm font-bold text-slate-900">
                  <strong>Amount:</strong> {currency(invoice.amount)}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Status:</strong>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 ml-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusIcon(invoice.status)}
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleDownloadInvoice(invoice)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-600 text-sm">
              <FileText className="mx-auto h-10 w-10 text-slate-300 mb-4" />
              No invoices available.
            </div>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      {showPriceSection && (
        <div className="mt-2" ref={priceRef}>
          <PricingSection
          // optional: agar PricingSection close button dikhata ho
          // onClose={() => setShowPriceSection(false)}
          />
        </div>
      )}
    </div>
  );
}

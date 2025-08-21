import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Edit3,
  Crown,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import PricingSection from "../PricingSection";
import { getMySubscription } from "../../redux/slices/subscriptionSlice";

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
      const blob = new Blob(
        [JSON.stringify({ ...invoice, currency: "INR" }, null, 2)],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading subscription...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center pb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Billing & Subscription
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your subscription and billing history
          </p>
        </div>

        {/* Current Subscription Card */}
        {subscription ? (
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
            <div
              className={`absolute top-0 left-0 right-0 h-2 ${getPlanGradient(
                subscription.plan
              )}`}
            ></div>

            <div className="p-8">
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full ${getPlanGradient(
                      subscription.plan
                    )} shadow-lg`}
                  >
                    {getPlanIcon(subscription.plan)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      {subscription.plan} Plan
                      {subscription.status === "active" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          Active
                        </span>
                      )}
                    </h2>
                    <p className="text-slate-500 capitalize">
                      Billed {subscription.billing}
                      {subscription.autoRenew && " • Auto-renewal enabled"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">
                    {currency(subscription.price)}
                  </p>
                  <p className="text-slate-500 flex items-center gap-1 justify-end">
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
                    className="group p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-md"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowPriceSection(!showPriceSection)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit3 className="h-4 w-4" />
                  Change Plan
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
                  <CreditCard className="h-4 w-4" />
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg">
              No active subscription found
            </p>
            <button
              onClick={() => setShowPriceSection(true)}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              View Plans
            </button>
          </div>
        )}

        {/* Billing History */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
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
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Invoice ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Period
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-25"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-900">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {invoice.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {invoice.period}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        {currency(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
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
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
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
                        <p className="text-slate-500 text-lg">
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
          </div>
        </div>

        {/* Pricing Section */}
        {showPriceSection && (
          <div className="mt-8">
            <PricingSection />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

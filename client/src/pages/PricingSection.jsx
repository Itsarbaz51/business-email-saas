import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import {
  createRazorpayOrder,
  createOrRenewSubscriptionAction,
} from "../redux/slices/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

export const PricingSection = ({
  defaultPlan = "FREE",
  autoSubscribe = false,
}) => {
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [usdToInr, setUsdToInr] = useState(83);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const lastRateRef = useRef(83);
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUserData } = useSelector((state) => state.auth);

  // Use the same plan definitions as backend
  const plans = [
    {
      plan: "FREE",
      price: 0,
      features: {
        maxMailboxes: 1,
        maxDomains: 1,
        maxSentEmails: 50,
        maxReceivedEmails: 500,
        allowedStorageMB: 1024,
      },
    },
    {
      plan: "BASIC",
      price: 5, // Match backend price
      features: {
        maxMailboxes: 10,
        maxDomains: 3,
        maxSentEmails: 1000,
        maxReceivedEmails: 10000,
        allowedStorageMB: 10240,
      },
    },
    {
      plan: "PREMIUM",
      price: 15, // Match backend price
      features: {
        maxMailboxes: 50,
        maxDomains: 10,
        maxSentEmails: "Unlimited",
        maxReceivedEmails: "Unlimited",
        allowedStorageMB: 51200,
      },
    },
  ];

  useEffect(() => {
    if (location !== "/") dispatch(getCurrentUser());
  }, [dispatch, location]);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=INR"
        );
        const data = await res.json();
        const currentRate = data.rates.INR || 83;
        lastRateRef.current = currentRate;
        setUsdToInr(currentRate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }
    fetchRate();
  }, []);

  useEffect(() => {
    const selected =
      plans.find((p) => p.plan === defaultPlan.toUpperCase()) || plans[0];
    setSelectedPlan(selected);

    if (selected.plan === "FREE" && autoSubscribe && currentUserData) {
      handleSubscribe(selected);
    }
  }, [defaultPlan, currentUserData]);

  const getDisplayPrice = (monthlyPrice) => {
    if (monthlyPrice === 0) return 0;

    return billingCycle === "MONTHLY"
      ? Math.round(monthlyPrice * usdToInr)
      : Math.round(monthlyPrice * 12 * 0.8 * usdToInr); // 20% discount yearly
  };

  // Format price with proper Indian Rupee symbol and formatting
  const formatPrice = (price) => {
    if (price === 0) return "Free";

    // Use Indian Rupee symbol (₹) and Indian number formatting
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => {
        toast.error("Failed to load payment system");
        resolve(false);
      };
      document.body.appendChild(script);
    });

  // Generate a shorter receipt ID that meets Razorpay's requirements
  const generateShortReceiptId = (userId, plan) => {
    // Use a short hash of user ID + plan + timestamp
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const shortUserId = userId ? userId.slice(-8) : "unknown"; // Last 8 chars of user ID
    const shortPlan = plan.slice(0, 3); // First 3 letters of plan

    return `ord_${shortPlan}_${shortUserId}_${timestamp}`.slice(0, 40);
  };

  const handleFreeSubscription = async (plan) => {
    try {
      const result = await dispatch(
        createOrRenewSubscriptionAction({
          plan: plan.plan,
          billingCycle: billingCycle,
          paymentStatus: "FREE",
        })
      );

      if (result && result.success !== false) {
        toast.success("Subscribed to Free Plan successfully!");
      } else {
        throw new Error(result?.message || "Free subscription failed");
      }
    } catch (error) {
      toast.error(
        "Free subscription failed: " + (error.message || "Unknown error")
      );
      throw error;
    }
  };

  const handlePaidSubscription = async (plan) => {
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      return;
    }

    try {
      // Create order first - with shorter receipt ID
      const result = await dispatch(
        createRazorpayOrder({
          plan: plan.plan,
          billingCycle: billingCycle,
          receiptId: generateShortReceiptId(currentUserData?.id, plan.plan),
        })
      );

      console.log("result", result);

      const orderData = result?.data || result;

      if (!orderData?.id) {
        throw new Error("Order creation failed - no order ID received");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MailFlow",
        description: `${plan.plan} ${billingCycle} Subscription`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const paymentData = {
              razorpayOrderId: orderData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: plan.plan,
              billingCycle: billingCycle,
              paymentStatus: "SUCCESS",
              paymentProvider: "RAZORPAY",
            };

            await dispatch(createOrRenewSubscriptionAction(paymentData));
            toast.success("Payment successful! Subscription activated.");
          } catch (error) {
            toast.error("Payment verification failed: " + error.message);
            console.error("Payment error:", error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUserData.name || "Test User",
          email: currentUserData.email || "test@example.com",
          contact: currentUserData.phone?.toString() || "9999999999",
        },

        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      // toast.error("Subscription failed: " + (error.message || "Unknown error"));
      console.error("Subscription error:", error.message);
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!currentUserData) {
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      if (plan.price === 0) {
        await handleFreeSubscription(plan);
      } else {
        await handlePaidSubscription(plan);
      }
    } catch (error) {
      // Error is already handled in the respective functions
    } finally {
      setIsProcessing(false);
    }
  };

  const formatStorage = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MailFlow</h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your email management needs
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-full p-1 flex">
            {["MONTHLY", "YEARLY"].map((cycle) => (
              <button
                key={cycle}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                  billingCycle === cycle
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => setBillingCycle(cycle)}
              >
                {cycle}
                {cycle === "YEARLY" && (
                  <span className="text-green-500 ml-1">(Save 20%)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const displayPrice = getDisplayPrice(plan.price);

            return (
              <div
                key={idx}
                className={`p-8 border rounded-2xl transition-all duration-300 bg-white ${
                  selectedPlan?.plan === plan.plan
                    ? "ring-4 ring-blue-500 shadow-xl transform -translate-y-2"
                    : "hover:shadow-lg hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.plan}
                  </h3>
                  {plan.plan === "PREMIUM" && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      POPULAR
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(displayPrice)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">
                      /{billingCycle.toLowerCase()}
                    </span>
                  )}
                </div>

                <ul className="text-gray-700 mb-8 space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>
                      <strong>{plan.features.maxMailboxes}</strong> Mailboxes
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>
                      <strong>{plan.features.maxDomains}</strong> Domains
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>
                      <strong>
                        {formatStorage(plan.features.allowedStorageMB)}
                      </strong>{" "}
                      Storage
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>
                      {plan.features.maxSentEmails === "Unlimited"
                        ? "Unlimited Sent Emails"
                        : `Up to ${plan.features.maxSentEmails.toLocaleString(
                            "en-IN"
                          )} Sent Emails/mo`}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>
                      {plan.features.maxReceivedEmails === "Unlimited"
                        ? "Unlimited Received Emails"
                        : `Up to ${plan.features.maxReceivedEmails.toLocaleString(
                            "en-IN"
                          )} Received Emails/mo`}
                    </span>
                  </li>
                </ul>

                <button
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.plan === "PREMIUM"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      : plan.plan === "BASIC"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-600 hover:bg-gray-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handleSubscribe(plan)}
                >
                  {isProcessing
                    ? "Processing..."
                    : plan.price === 0
                    ? "Start Free"
                    : "Subscribe Now"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional information */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            All plans include 24/7 support and a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;

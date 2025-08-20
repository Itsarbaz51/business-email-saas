import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import { createOrRenewSubscription } from "../redux/slices/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../redux/slices/authSlice";

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

  const plans = [
    {
      plan: "FREE",
      price: 0,
      maxMailboxes: 1,
      maxDomains: 1,
      allowedStorageMB: 1024,
    },
    {
      plan: "BASIC",
      price: 10,
      maxMailboxes: 5,
      maxDomains: 3,
      allowedStorageMB: 5120,
    },
    {
      plan: "PREMIUM",
      price: 25,
      maxMailboxes: 20,
      maxDomains: 10,
      allowedStorageMB: 20480,
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

  const getDisplayPrice = (monthlyPrice) =>
    billingCycle === "MONTHLY"
      ? Math.round(monthlyPrice * usdToInr)
      : Math.round(monthlyPrice * 12 * 0.8 * usdToInr);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const subscribeUser = async (
    plan,
    paymentData = { paymentStatus: "FREE" }
  ) => {
    return await dispatch(
      createOrRenewSubscription({
        plan: plan.plan,
        billingCycle,
        ...paymentData,
      })
    );
  };
  const handleSubscribe = async (plan) => {
    if (!currentUserData) {
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    if (plan.price === 0) {
      // Free plan, no payment needed
      await subscribeUser(plan);
      setIsProcessing(false);
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Failed to load payment gateway.");
      setIsProcessing(false);
      return;
    }

    // Step 1: Create order without payment details
    const orderRes = await subscribeUser(plan, { paymentStatus: "INITIATED" });

    if (!orderRes?.data?.id) {
      alert("Order creation failed.");
      setIsProcessing(false);
      return;
    }

    const { id: razorpayOrderId, amount, currency } = orderRes.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Azzunique Software Pvt. Ltd.",
      description: `${plan.plan} Subscription`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        // Step 2: After payment success, send payment details to backend
        const paymentData = {
          razorpayOrderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayStatus: "captured",
          paymentStatus: "SUCCESS",
          paymentId: response.razorpay_payment_id,
          paymentProvider: "RAZORPAY",
        };
        await subscribeUser(plan, paymentData);
      },
      prefill: {
        name: currentUserData.name,
        email: currentUserData.email,
        contact: currentUserData.phone,
      },
      theme: { color: "#3399cc" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    setIsProcessing(false);
  };

  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-10">Choose Your Plan</h2>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            {["MONTHLY", "YEARLY"].map((cycle) => (
              <button
                key={cycle}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  billingCycle === cycle
                    ? "bg-blue-600 text-white"
                    : "text-gray-700"
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
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 border rounded-2xl transition ${
                selectedPlan?.plan === plan.plan
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-lg"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.plan}</h3>
              <p className="text-gray-600 mb-4">
                {plan.price === 0
                  ? "Free"
                  : `₹${getDisplayPrice(plan.price).toLocaleString(
                      "en-IN"
                    )}/${billingCycle.toLowerCase()}`}
              </p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {plan.maxMailboxes} Mailboxes
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {plan.maxDomains} Domains
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {plan.allowedStorageMB / 1024} GB Storage
                </li>
              </ul>
              <button
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleSubscribe(plan)}
              >
                {plan.price === 0 ? "Start Free (8 Days)" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

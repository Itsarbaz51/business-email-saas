import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import { createOrRenewSubscription } from "../redux/slices/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCurrentUser } from "../redux/slices/authSlice";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [usdToInr, setUsdToInr] = useState(83);
  const lastRateRef = useRef(83);

  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  const { currentUserData } = useSelector((state) => state.auth);

  // Fetch USD→INR once on mount
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=INR"
        );
        const data = await res.json();
        const currentRate = data.rates.INR;

        if (!currentRate) throw new Error("Invalid rate received");

        // if (currentRate < lastRateRef.current) {
        //   console.log(
        //     `📉 Rate dropped: ${lastRateRef.current} → ${currentRate}`
        //   );
        // } else if (currentRate > lastRateRef.current) {
        //   console.log(
        //     `📈 Rate increased: ${lastRateRef.current} → ${currentRate}`
        //   );
        // } else {
        //   console.log(`➡️ Rate unchanged: ${currentRate}`);
        // }

        lastRateRef.current = currentRate;
        setUsdToInr(currentRate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    }
    fetchRate();
  }, []);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const plans = [
    {
      plan: "FREE",
      price: 0,
      maxMailboxes: 1,
      maxDomains: 1,
      maxSentEmails: 100,
      maxReceivedEmails: 1000,
      allowedStorageMB: 1024,
    },
    {
      plan: "BASIC",
      price: 10,
      maxMailboxes: 5,
      maxDomains: 3,
      maxSentEmails: 1000,
      maxReceivedEmails: 5000,
      allowedStorageMB: 5120,
    },
    {
      plan: "PREMIUM",
      price: 25,
      maxMailboxes: 20,
      maxDomains: 10,
      maxSentEmails: 10000,
      maxReceivedEmails: 50000,
      allowedStorageMB: 20480,
    },
  ];

  const getDisplayPrice = (monthlyPrice) => {
    if (billingCycle === "MONTHLY") {
      return Math.round(monthlyPrice * usdToInr);
    }
    return Math.round(monthlyPrice * 12 * 0.8 * usdToInr);
  };

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async (plan) => {
    if (plan.price === 0) {
      dispatch(
        createOrRenewSubscription({
          plan: plan.plan,
          billingCycle,
          paymentStatus: "FREE",
        })
      );
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    try {
      const orderRes = await axios.post(`${baseURL}/payment/create-order`, {
        amount: getDisplayPrice(plan.price) * 100,
        currency: "INR",
        plan: plan.plan,
        billingCycle,
      });

      const { id: razorpayOrderId, amount, currency } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Azzunique Software Pvt. Ltd.",
        description: `${plan.plan} Subscription`,
        order_id: razorpayOrderId,
        handler: function (response) {
          const paymentData = {
            razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayStatus: "captured",
            paymentStatus: "SUCCESS",
            paymentId: response.razorpay_payment_id,
            paymentProvider: "RAZORPAY",
          };
          dispatch(
            createOrRenewSubscription({
              plan: plan.plan,
              billingCycle,
              ...paymentData,
            })
          );
        },
        prefill: {
          name: `${currentUserData.name}`,
          email: `${currentUserData?.email}`,
          contact: `${currentUserData?.phone}`,
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to start payment. Please try again.");
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-10">Choose Your Plan</h2>

        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                billingCycle === "MONTHLY"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setBillingCycle("MONTHLY")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                billingCycle === "YEARLY"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setBillingCycle("YEARLY")}
            >
              Yearly <span className="text-green-500">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition"
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
                className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
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

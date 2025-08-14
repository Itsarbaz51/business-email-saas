import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputField from "../components/ui/InputField";
import ButtonField from "../components/ui/ButtonField";
import { login } from "../redux/slices/authSlice";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "emailOrPhone") {
      newValue = newValue.replace(/\s+/g, "");
    } else if (name === "password") {
      newValue = newValue.replace(/[^A-Za-z0-9@#$%&₹]+$/g, "").slice(0, 20);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(login(formData));
    } finally {
      setLoading(false);
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 -my-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-normal text-gray-900">Sign in</h1>
            <p className="text-gray-600 text-sm">to access Email Home</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Email address or mobile number"
              autoComplete="username"
              error={errors.emailOrPhone}
            />

            <InputField
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              autoComplete="current-password"
              error={errors.password}
            />

            <ButtonField type="submit" submitLabel="Login" loading={loading} />
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm text-gray-600 pt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign up now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

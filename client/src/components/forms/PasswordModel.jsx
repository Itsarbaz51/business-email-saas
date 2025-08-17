import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

function PasswordModel({ onSubmit }) {
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordErrors, setPasswordErrors] = useState([]);

    const handleInputChange = (field, value) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validatePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;
        const errors = [];

        if (!currentPassword) {
            errors.push("Current password is required");
        }
        if (newPassword && newPassword.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        if (newPassword && !/(?=.*[a-z])/.test(newPassword)) {
            errors.push("Password must contain at least one lowercase letter");
        }
        if (newPassword && !/(?=.*[A-Z])/.test(newPassword)) {
            errors.push("Password must contain at least one uppercase letter");
        }
        if (newPassword && !/(?=.*\d)/.test(newPassword)) {
            errors.push("Password must contain at least one number");
        }
        if (newPassword && !/(?=.*[@$!%*?&])/.test(newPassword)) {
            errors.push("Password must contain at least one special character");
        }
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            errors.push("Passwords do not match");
        }

        setPasswordErrors(errors);
        return errors.length === 0;
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;

        const strengthMap = {
            0: { label: "Very Weak", color: "bg-red-500" },
            1: { label: "Weak", color: "bg-red-400" },
            2: { label: "Fair", color: "bg-yellow-400" },
            3: { label: "Good", color: "bg-blue-400" },
            4: { label: "Strong", color: "bg-green-400" },
            5: { label: "Very Strong", color: "bg-green-500" },
        };

        return { strength: score, ...strengthMap[score] };
    };

    const passwordStrength = getPasswordStrength(passwords.newPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatePassword()) {
            onSubmit(passwords); // send passwords back to parent
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
            {/* Current Password */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Password Strength */}
                {passwords.newPassword && (
                    <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                                {passwordStrength.label}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            {/* Errors */}
            {passwordErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-red-800 font-semibold mb-2">
                                Please fix the following issues:
                            </h4>
                            <ul className="text-red-700 text-sm space-y-1">
                                {passwordErrors.map((error, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                className={`w-full py-3 px-4 font-semibold rounded-xl transition-colors bg-purple-600 text-white hover:bg-purple-700
                    }`}
            >
                Update Password
            </button>

        </form>
    );
}

export default PasswordModel;

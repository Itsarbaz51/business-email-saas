import React, { useState } from "react";
import { Save, Key, User } from "lucide-react";
import ProfileModel from "../../components/forms/ProfileModel";
import { useSelector, useDispatch } from "react-redux";
import { changePassword, updateProfile } from "../../redux/slices/authSlice";
import PasswordModel from "../../components/forms/PasswordModel";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const profileData = useSelector((state) => state.auth.currentUserData);

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: profileData.name || "",
    email: profileData.email || profileData.emailAddress || "",
    phone: profileData.phone || "",
    role: profileData.role || "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (activeTab === "password") {
      const data = dispatch(changePassword(formData));
      if (data) {
        navigate("/login");
      }
    } else {
      dispatch(updateProfile(formData));
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    {
      id: "profile",
      name: "Profile",
      icon: <User size={18} />,
      description: "Manage your personal information",
    },
    {
      id: "password",
      name: "Security",
      icon: <Key size={18} />,
      description: "Update your password and security settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          {activeTab === "profile" && (
            <button
              className="bg-purple-600 text-white p-4 rounded cursor-pointer"
              onClick={() => handleSubmit(profile)}
            >
              Profile save
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50/50">
            <nav className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 cursor-pointer border-b-2 font-medium text-sm flex items-center gap-3 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  {tab.icon}
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className="text-xs opacity-70 hidden sm:block">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="flex gap-8 ">
                {/* Profile Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 lg:w-[24rem] space-y-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Profile Preview
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {profileData?.name?.[0]}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {profileData?.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {profileData?.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm space-y-4">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {profileData?.email || profileData?.emailAddress}
                    </p>
                    {profileData?.role !== "USER" && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {profileData?.phone}
                      </p>
                    )}
                    {profileData.isActive === true && (
                      <p>
                        <span className="font-medium">Account Status:</span>{" "}
                        Active
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {profileData?.createdAt}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="w-full">
                  <ProfileModel
                    profileDataUpdate={profile}
                    onProfileChange={handleProfileChange}
                  />
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Change Password
                </h3>
                <p className="text-gray-600 mb-6">
                  Update your password to keep your account secure.
                </p>

                <PasswordModel onSubmit={handleSubmit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

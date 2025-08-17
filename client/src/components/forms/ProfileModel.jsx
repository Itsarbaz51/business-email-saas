function ProfileModel({ profileDataUpdate, onProfileChange }) {
    return (
        <div className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                </label>
                <input
                    type="text"
                    value={profileDataUpdate?.name || ""}
                    onChange={(e) => onProfileChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter name"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    value={profileDataUpdate?.email || ""}
                    onChange={(e) => onProfileChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    type="number"
                    value={profileDataUpdate?.phone || ""}
                    onChange={(e) => onProfileChange("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter phone number"
                />
            </div>

            {/* Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role
                    </label>
                    <select
                        value={profileDataUpdate?.role || ""}
                        disabled
                        onChange={(e) => onProfileChange("role", e.target.value)}
                        className="w-full px-4 py-3 disabled:cursor-not-allowed disabled:text-gray-400 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                        <option value={profileDataUpdate?.role}>
                            {profileDataUpdate?.role}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default ProfileModel;

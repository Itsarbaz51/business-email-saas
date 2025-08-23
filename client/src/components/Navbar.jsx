import { Bell, User, Menu } from "lucide-react";

function Navbar({ setSidebarOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="lg:hidden sticky top-4 left-4 p-2 bg-white hover:bg-gray-100 rounded-lg z-30"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </button>
        <div
          className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:from-violet-600 hover:to-purple-700 transition-all"
          aria-label="User profile"
          role="button"
          tabIndex={0}
        >
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;

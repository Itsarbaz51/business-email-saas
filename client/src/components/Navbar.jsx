import { useState } from "react";
import { Search, Bell, User, Menu, Command } from "lucide-react";

function Navbar({ setSidebarOpen }) {
  const [showSearch, setShowSearch] = useState(false);

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

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

        {/* Search toggle icon (mobile only) */}
        <button
          onClick={handleToggleSearch}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle search"
        >
          <Search className="w-5 h-5 text-black" />
        </button>

        {/* Search bar (responsive + animated) */}
        <div
          className={`
            flex items-center bg-gray-50 rounded-xl border border-gray-200
            focus-within:border-violet-300 focus-within:bg-white
            transition-all duration-300 ease-in-out overflow-hidden
            sm:flex sm:max-w-md sm:px-4 sm:py-2.5 sm:opacity-100
             w-full
            ${
              showSearch
                ? "max-w-md px-4 py-2.5 opacity-100"
                : "max-w-0 px-0 py-0 opacity-0 pointer-events-none"
            }
          `}
        >
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="bg-transparent outline-none px-3 text-sm w-full text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
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

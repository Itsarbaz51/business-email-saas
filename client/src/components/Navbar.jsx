import React from "react";
import {
  Search,
  SlidersHorizontal,
  HelpCircle,
  Settings,
  Sparkles,
  Grid,
  UserCircle,
  SearchIcon,
} from "lucide-react";
function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-300 w-full">
      {/* Search Box */}
      <div className="flex items-center bg-[#eaf1fb] rounded-full px-4 py-2 w-full max-w-2xl">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search mail"
          className="bg-transparent outline-none px-2 text-sm w-full"
        />
        <SearchIcon className="w-4 h-4 cursor-pointer" />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4 ml-4">
        <HelpCircle className="w-5 h-5 cursor-pointer" />
        <Settings className="w-5 h-5 cursor-pointer" />
        <Sparkles className="w-5 h-5 cursor-pointer" />
        <Grid className="w-5 h-5 cursor-pointer" />
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
          a
        </div>
      </div>
    </div>
  );
}

export default Navbar
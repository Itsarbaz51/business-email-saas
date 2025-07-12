import React from "react";
import {
  ChevronDown,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
function MailToolbar({onRefresh}) {

  function refresh() {
    window.location.reload()
  }
  
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white  text-sm">
      {/* Left Section: Checkbox + Icons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 hover:bg-gray-200 p-1.5 rounded">
          <input type="checkbox" id="selectall" className="cursor-pointer" />
          <label htmlFor="selectall">All</label>
        </button>

        <button className="hover:bg-gray-200 p-1.5 rounded " onClick={onRefresh} >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section: Pagination Info */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">1–50 of 179</span>
        <button
          className="hover:bg-gray-100 p-1.5 rounded disabled:opacity-50"
          disabled
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="hover:bg-gray-200 p-1.5 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default MailToolbar;

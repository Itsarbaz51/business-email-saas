import {
  Send,
  RefreshCw,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState } from "react";

export default function MailHeader({
  name,
  mails = [],
  selectedMails,
  toggleSelectAll,
  handleRefresh,
  handleMoveTrash,
  isLoading,

  // 🔹 Props from InboxPage
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Send className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {name}
            </h1>
            <p className="text-slate-600">
              {mails.length} emails found
              {selectedMails.size > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {selectedMails.size} selected
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading && "animate-spin"}`} />
            Refresh
          </button>

          {selectedMails.size > 0 && (
            <button
              onClick={handleMoveTrash}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedMails.size})
            </button>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search emails, recipients, subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${showFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {showFilters && (
              <div className="absolute -bottom-10 right-26 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 min-w-72">
                <div className="flex gap-8 w-full">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="ALL">All Status</option>
                      <option value="SENT">Sent</option>
                      <option value="FAILED">Failed</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sort
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleSelectAll}
            className="flex cursor-pointer items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-all duration-200"
          >
            {selectedMails.size === mails.length && mails.length > 0 ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All
          </button>
        </div>
      </div>
    </div>
  );
}

import { Send, Clock, User, Archive, Heart, MessageCircle, Reply, Forward, RefreshCw, Search, Filter, Trash2, Check, X, Mail, CheckSquare, Square, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteMail, getAllSentMails } from "../../redux/slices/mailSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Mock sent emails data for demonstration
// const mockSentMails = [
//   {
//     id: 1,
//     toEmail: "team@company.com",
//     subject: "Weekly Team Update - Project Progress",
//     preview: "Hi team, here's our weekly update on the current project status and upcoming milestones. We've made significant progress this week.",
//     date: "2 hours ago",
//     size: "1.2 MB",
//     status: "SENT"
//   },
//   {
//     id: 2,
//     toEmail: "client@example.com",
//     subject: "Proposal for New Marketing Campaign",
//     preview: "Thank you for your interest in our services. Please find attached our detailed proposal for the upcoming marketing campaign.",
//     date: "1 day ago",
//     size: "3.4 MB",
//     status: "SENT"
//   },
//   {
//     id: 3,
//     toEmail: "hr@company.com",
//     subject: "Leave Application - Next Week",
//     preview: "I would like to request leave for next week from Monday to Wednesday for personal reasons. Please let me know if this is approved.",
//     date: "2 days ago",
//     size: "245 KB",
//     status: "FAILED"
//   },
//   {
//     id: 4,
//     toEmail: "support@vendor.com",
//     subject: "Technical Issue with Recent Order",
//     preview: "We are experiencing some technical difficulties with our recent order #12345. Could you please assist us with resolving this issue?",
//     date: "3 days ago",
//     size: "678 KB",
//     status: "PENDING"
//   },
//   {
//     id: 5,
//     toEmail: "marketing@partner.com",
//     subject: "Collaboration Proposal",
//     preview: "We would like to explore potential collaboration opportunities between our companies. Let's schedule a meeting to discuss this further.",
//     date: "5 days ago",
//     size: "2.1 MB",
//     status: "SENT"
//   },
//   {
//     id: 6,
//     toEmail: "finance@company.com",
//     subject: "Budget Report Q4",
//     preview: "Please find attached the comprehensive budget report for Q4. All expenses and projections are included in the detailed spreadsheet.",
//     date: "1 week ago",
//     size: "5.2 MB",
//     status: "SENT"
//   }
// ];

export default function EnhancedSentPage() {
  const [selectedMails, setSelectedMails] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllSentMails())
  }, [dispatch])

  const mockSentMails = useSelector((state) => state.mail?.list)
  const [sentMails, setSentMails] = useState(mockSentMails);

  // Filter and search functionality
  const filteredMails = sentMails.filter(mail => {
    const matchesSearch = mail.toEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.preview?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "ALL" || mail.status?.toUpperCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Sort functionality
  const sortedMails = [...filteredMails].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (sortOrder === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would fetch from your API
      setSentMails([...mockSentMails]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    if (newSelected.has(mailId)) {
      newSelected.delete(mailId);
    } else {
      newSelected.add(mailId);
    }
    setSelectedMails(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMails.size === sortedMails.length && sortedMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(sortedMails.map(mail => mail.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedMails.size > 0) {
      if (confirm(`Delete ${selectedMails.size} selected emails?`)) {
        setSentMails(prevMails => prevMails.filter(mail => !selectedMails.has(mail.id)));
        setSelectedMails(new Set());
      }
    }
  };

  const handleSingleDelete = (mailId) => {
    if (confirm("Delete this email?")) {
      setSentMails(prevMails => prevMails.filter(mail => mail.id !== mailId));
      setSelectedMails(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(mailId);
        return newSelected;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SENT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const stringToColor = (str) => {
    if (!str) return '#6366f1';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#f59e0b'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Sent Mail
                </h1>
                <p className="text-slate-600">
                  {sortedMails.length} emails found
                  {selectedMails.size > 0 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {selectedMails.size} selected
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {selectedMails.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedMails.size})
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
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
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-4 min-w-48 z-100">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sort</label>
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
                className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-all duration-200"
              >
                {selectedMails.size === sortedMails.length && sortedMails.length > 0 ?
                  <CheckSquare className="w-4 h-4" /> :
                  <Square className="w-4 h-4" />
                }
                Select All
              </button>
            </div>
          </div>
        </div>

        {/* Mail List */}
        <div className="space-y-4">
          {sortedMails.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
              <Mail className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No emails found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            sortedMails.map((mail, index) => (
              <div
                key={mail.id}
                className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 ${selectedMails.has(mail.id)
                  ? 'border-blue-300 bg-blue-50/80 shadow-lg shadow-blue-100'
                  : 'border-white/30 hover:border-blue-200'
                  }`}
              >
                {/* Selection Indicator */}
                {selectedMails.has(mail.id) && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
                )}

                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(mail.id)}
                    className="mt-1 p-1 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {selectedMails.has(mail.id) ?
                      <CheckSquare className="w-5 h-5 text-blue-600" /> :
                      <Square className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                    }
                  </button>

                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${stringToColor(mail.toEmail)}, ${stringToColor(mail.toEmail)}dd)`
                    }}
                  >
                    {mail.toEmail?.slice(0, 1).toUpperCase() || 'U'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-slate-800 truncate">
                          To: {mail.toEmail}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(mail.status)}`}>
                          {mail.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {mail?.sentAt
                          ? new Date(new Date(mail.sentAt).getTime() + 24 * 60 * 60 * 1000).toLocaleString()
                          : 'No date'}
                      </div>
                    </div>

                    <div className="cursor-pointer group">
                      <h4 className="text-slate-800 font-medium mb-2 group-hover:text-blue-600 transition-colors text-lg">
                        {mail.subject || 'No subject'}
                      </h4>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <Link to={`/u/inbox/detail/${mail.id}`} state={{ mailId: mail.id }} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all duration-200 text-sm font-medium">
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all duration-200 text-sm font-medium">
                          <Forward className="w-4 h-4" />
                          Forward
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSingleDelete(mail.id);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        {mail.size || 'Unknown size'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sortedMails.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-slate-600 text-sm">
              Showing {sortedMails.length} of {sentMails.length} emails
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Send, Clock, User, Archive, Heart, MessageCircle, Reply, Forward } from "lucide-react";
import { Link } from "react-router-dom";
import MailToolbar from "../../components/MailToolbar.jsx";
import { useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";

// Mock sent emails data
const sentMails = [
  {
    id: 1,
    to: "team@company.com",
    subject: "Weekly Team Update - Project Progress",
    preview: "Hi team, here's our weekly update on the current project status and upcoming milestones.",
    date: "3 hours ago",
    size: "1.2 MB",
    status: "delivered"
  },
  {
    id: 2,
    to: "client@example.com",
    subject: "Proposal for New Marketing Campaign",
    preview: "Thank you for your interest in our services. Please find attached our detailed proposal.",
    date: "1 day ago",
    size: "3.4 MB",
    status: "read"
  },
  {
    id: 3,
    to: "hr@company.com",
    subject: "Leave Application - Next Week",
    preview: "I would like to request leave for next week from Monday to Wednesday for personal reasons.",
    date: "2 days ago",
    size: "245 KB",
    status: "delivered"
  },
  {
    id: 4,
    to: "support@vendor.com",
    subject: "Technical Issue with Recent Order",
    preview: "We are experiencing some technical difficulties with our recent order. Could you please assist?",
    date: "5 days ago",
    size: "678 KB",
    status: "pending"
  }
];

export default function SentPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMails, setSelectedMails] = useState(new Set());

  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    if (newSelected.has(mailId)) {
      newSelected.delete(mailId);
    } else {
      newSelected.add(mailId);
    }
    setSelectedMails(newSelected);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'read': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  usePageTitle('sent')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-500" />
            Sent
          </h1>
          <p className="text-gray-600 text-sm">You have sent {sentMails.length} emails</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Export
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Filter
          </button>
        </div>
      </div>

      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />

      {/* Mail Cards */}
      <div key={refreshKey} className="space-y-4">
        {sentMails.map((mail) => (
          <div
            key={mail.id}
            className={`group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-violet-300 transition-all duration-300 hover:shadow-lg hover:shadow-violet-100 ${selectedMails.has(mail.id) ? 'border-violet-400 bg-violet-50' : ''
              }`}
          >
            {/* Selection Indicator */}
            {selectedMails.has(mail.id) && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-violet-500 rounded-full"></div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                <Send className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">To: {mail.to}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(mail.status)}`}>
                      {mail.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {mail.date}
                  </div>
                </div>

                <Link to={`/sent/detail/${mail.id}`}>
                  <h4 className="text-gray-800 font-medium mb-2 hover:text-violet-600 transition-colors">
                    {mail.subject}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {mail.preview}
                  </p>
                </Link>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSelect(mail.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedMails.has(mail.id)
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {selectedMails.has(mail.id) ? 'Selected' : 'Select'}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Forward className="w-4 h-4" />
                      Forward
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {mail.size}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
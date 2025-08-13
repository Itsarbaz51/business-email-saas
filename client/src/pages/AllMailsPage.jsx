import { Mail, Clock, User, Archive, Heart, MessageCircle } from "lucide-react";
import { mails } from "../../index.js";
import { Link } from "react-router-dom";
import MailToolbar from "../components/MailToolbar.jsx";
import { useState } from "react";
import usePageTitle from "../components/usePageTitle.js";
import { useSelector } from "react-redux";

export default function AllMailsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMails, setSelectedMails] = useState(new Set());
  const { role } = useSelector((state) => state?.auth?.user)


  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    newSelected.has(mailId) ? newSelected.delete(mailId) : newSelected.add(mailId);
    setSelectedMails(newSelected);
  };

  usePageTitle("All Mails");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Mails</h1>
          <p className="text-gray-600 text-sm">
            You have {mails.length} total messages
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
            Mark all read
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Filter
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />

      {/* Mail Cards */}
      <div className="space-y-4">
        {mails.map((mail, index) => (
          <div
            key={mail.id}
            className={`group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-violet-300 transition-all duration-300 hover:shadow-lg hover:shadow-violet-100 ${selectedMails.has(mail.id) ? "border-violet-400 bg-violet-50" : ""
              }`}
          >
            {/* Selection Indicator */}
            {selectedMails.has(mail.id) && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-violet-500 rounded-full" />
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {mail.from?.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {mail.from}
                    </h3>
                    <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                      {index % 2 === 0 ? "Work" : "Personal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {mail.date}
                  </div>
                </div>

                {/* Subject + Preview Link */}
                <Link to={`/${role}/detail/${mail.id}`}>
                  <h4 className="text-gray-800 font-medium mb-2 hover:text-violet-600 transition-colors">
                    {mail.subject || "No Subject"}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {mail.preview || "No preview available. This message may be empty."}
                  </p>
                </Link>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSelect(mail.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedMails.has(mail.id)
                          ? "bg-violet-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {selectedMails.has(mail.id) ? "Selected" : "Select"}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">{mail.size}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

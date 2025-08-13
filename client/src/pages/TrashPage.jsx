import { Trash2, Clock, User, RotateCcw, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import MailToolbar from "../components/MailToolbar.jsx";
import { useState } from "react";
import usePageTitle from "../components/usePageTitle.js";

// Mock trash emails data
const trashedMails = [
  {
    id: 1,
    from: "Spam Sender",
    subject: "You've Won a Million Dollars!",
    preview:
      "Congratulations! You've been selected as our lucky winner. Click here to claim your prize now!",
    date: "1 day ago",
    size: "234 KB",
    deletedDate: "1 day ago",
  },
  {
    id: 2,
    from: "Old Client",
    subject: "Re: Project Discussion",
    preview:
      "Thanks for the update. I think we should reconsider the timeline for this project.",
    date: "3 days ago",
    size: "1.1 MB",
    deletedDate: "2 days ago",
  },
  {
    id: 3,
    from: "Marketing Platform",
    subject: "Your campaign performance this week",
    preview:
      "Your recent email campaign achieved a 15% open rate and 3% click-through rate.",
    date: "1 week ago",
    size: "645 KB",
    deletedDate: "5 days ago",
  },
];

export default function TrashPage() {
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

  const restoreFromTrash = (mailId) => {
    // In a real app, this would update the backend
    console.log(`Restoring mail ${mailId} from trash`);
  };

  const permanentlyDelete = (mailId) => {
    // In a real app, this would permanently delete the email
    console.log(`Permanently deleting mail ${mailId}`);
  };

  const emptyTrash = () => {
    // In a real app, this would delete all emails in trash
    console.log("Emptying trash");
  };

  usePageTitle('trash')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            Trash
          </h1>
          <p className="text-gray-600 text-sm">
            You have {trashedMails.length} emails in trash
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Items in trash will be permanently deleted after 30 days
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={emptyTrash}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Empty Trash
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Filter
          </button>
        </div>
      </div>

      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />

      {/* Mail Cards */}
      <div key={refreshKey} className="space-y-4">
        {trashedMails.map((mail) => (
          <div
            key={mail.id}
            className={`group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-100 ${selectedMails.has(mail.id) ? "border-red-400 bg-red-50" : ""
              }`}
          >
            {/* Selection Indicator */}
            {selectedMails.has(mail.id) && (
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-red-500 rounded-full"></div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {mail.from.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {mail.from}
                    </h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Deleted {mail.deletedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {mail.date}
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">
                  {mail.subject}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {mail.preview}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSelect(mail.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedMails.has(mail.id)
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <User className="w-4 h-4" />
                      {selectedMails.has(mail.id) ? "Selected" : "Select"}
                    </button>

                    <button
                      onClick={() => restoreFromTrash(mail.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>

                    <button
                      onClick={() => permanentlyDelete(mail.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Delete Forever
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {mail.size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {trashedMails.length === 0 && (
        <div className="text-center py-12">
          <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your trash is empty
          </h3>
          <p className="text-gray-500">Deleted emails will appear here</p>
        </div>
      )}
    </div>
  );
}

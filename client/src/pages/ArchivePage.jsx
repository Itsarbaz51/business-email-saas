import { Archive, Clock, User, Inbox, Heart, MessageCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import MailToolbar from "../components/MailToolbar.jsx";
import { useState } from "react";
import usePageTitle from "../components/usePageTitle.js";

// Mock archived emails data
const archivedMails = [
  {
    id: 1,
    from: "Newsletter Team",
    subject: "Monthly Newsletter - October 2024",
    preview: "Check out our latest updates, product releases, and company news in this month's newsletter.",
    date: "2 weeks ago",
    size: "2.8 MB",
    category: "newsletter"
  },
  {
    id: 2,
    from: "Project Manager",
    subject: "Project Alpha - Final Documentation",
    preview: "All project documentation has been completed and is ready for final review and approval.",
    date: "3 weeks ago",
    size: "5.2 MB",
    category: "project"
  },
  {
    id: 3,
    from: "IT Support",
    subject: "System Maintenance Complete",
    preview: "The scheduled system maintenance has been completed successfully. All systems are now operational.",
    date: "1 month ago",
    size: "156 KB",
    category: "system"
  },
  {
    id: 4,
    from: "Training Team",
    subject: "Completed: Security Training Module",
    preview: "Thank you for completing the mandatory security training. Your certificate is attached.",
    date: "1 month ago",
    size: "892 KB",
    category: "training"
  }
];

export default function ArchivePage() {
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

  const restoreFromArchive = (mailId) => {
    // In a real app, this would update the backend
    console.log(`Restoring mail ${mailId} from archive`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'newsletter': return 'bg-purple-100 text-purple-700';
      case 'project': return 'bg-blue-100 text-blue-700';
      case 'system': return 'bg-orange-100 text-orange-700';
      case 'training': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  usePageTitle("archive");


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Archive className="w-6 h-6 text-gray-600" />
            Archive
          </h1>
          <p className="text-gray-600 text-sm">You have {archivedMails.length} archived conversations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Restore all
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Filter
          </button>
        </div>
      </div>

      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />

      {/* Mail Cards */}
      <div key={refreshKey} className="space-y-4">
        {archivedMails.map((mail) => (
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
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {mail.from.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">{mail.from}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(mail.category)}`}>
                      {mail.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {mail.date}
                  </div>
                </div>

                <Link to={`/archive/detail/${mail.id}`}>
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
                    <button
                      onClick={() => restoreFromArchive(mail.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Inbox className="w-4 h-4" />
                      Move to Inbox
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
import { Star, Clock, User, Archive, Heart, MessageCircle, StarOff } from "lucide-react";
import { Link } from "react-router-dom";
import MailToolbar from "../../components/MailToolbar.jsx";
import { useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";

// Mock starred emails data
const starredMails = [
  {
    id: 1,
    from: "Sarah Johnson",
    subject: "Important: Q4 Budget Review Meeting",
    preview: "Please review the attached budget documents before our meeting tomorrow at 2 PM.",
    date: "2 hours ago",
    size: "2.3 MB",
    priority: "high"
  },
  {
    id: 2,
    from: "Marketing Team",
    subject: "New Campaign Launch Strategy",
    preview: "The new product launch campaign is ready for review. Please check the creative assets.",
    date: "1 day ago",
    size: "5.1 MB",
    priority: "medium"
  },
  {
    id: 3,
    from: "John Smith",
    subject: "Project Milestone Achieved",
    preview: "Great news! We've successfully completed the first phase of the project ahead of schedule.",
    date: "3 days ago",
    size: "892 KB",
    priority: "low"
  }
];

export default function StarredPage() {
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

  const removeFromStarred = (mailId) => {
    // In a real app, this would update the backend
    console.log(`Removing mail ${mailId} from starred`);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  usePageTitle('star')


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            Starred
          </h1>
          <p className="text-gray-600 text-sm">You have {starredMails.length} starred conversations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Unstar all
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
            Filter
          </button>
        </div>
      </div>

      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />

      {/* Mail Cards */}
      <div key={refreshKey} className="space-y-4">
        {starredMails.map((mail) => (
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
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {mail.from.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">{mail.from}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(mail.priority)}`}>
                      {mail.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {mail.date}
                  </div>
                </div>

                <Link to={`/starred/detail/${mail.id}`}>
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
                      onClick={() => removeFromStarred(mail.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <StarOff className="w-4 h-4" />
                      Unstar
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      <Archive className="w-4 h-4" />
                      Archive
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
import {
  Star,
  Clock,
  User,
  Archive,
  Heart,
  MessageCircle,
  StarOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import MailToolbar from "../../components/MailToolbar.jsx";
import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { getAllStarred } from "../../redux/slices/mailSlice.js";
import { useDispatch, useSelector } from "react-redux";
import MailList from "../../components/user/MailList.jsx";

// Mock starred emails data
const starredMails = [
  {
    id: 1,
    from: "Sarah Johnson",
    subject: "Important: Q4 Budget Review Meeting",
    preview:
      "Please review the attached budget documents before our meeting tomorrow at 2 PM.",
    date: "2 hours ago",
    size: "2.3 MB",
    priority: "high",
  },
  {
    id: 2,
    from: "Marketing Team",
    subject: "New Campaign Launch Strategy",
    preview:
      "The new product launch campaign is ready for review. Please check the creative assets.",
    date: "1 day ago",
    size: "5.1 MB",
    priority: "medium",
  },
  {
    id: 3,
    from: "John Smith",
    subject: "Project Milestone Achieved",
    preview:
      "Great news! We've successfully completed the first phase of the project ahead of schedule.",
    date: "3 days ago",
    size: "892 KB",
    priority: "low",
  },
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
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  usePageTitle("starred");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllStarred());
  }, [dispatch]);

  const allStarredMails = useSelector((state) => state.mail?.list);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            Starred
          </h1>
          <p className="text-gray-600 text-sm">
            You have {starredMails.length} starred conversations
          </p>
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
      <MailList
        mails={allStarredMails}
        selectedMails={selectedMails}
        toggleSelect={toggleSelect}
      />
    </div>
  );
}

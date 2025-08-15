import {
  ArrowLeft,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  Heart,
  MoreHorizontal,
  Paperclip,
  Download,
  Clock,
  User,
  Mail,
  Shield,
  AlertTriangle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flag,
  Bookmark,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "../../components/usePageTitle";
import { useSelector } from "react-redux";

// Mock email data
const mockEmail = {
  id: 1,
  from: {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "SJ",
  },
  to: [
    { name: "John Doe", email: "john.doe@mycompany.com" },
    { name: "Jane Smith", email: "jane.smith@mycompany.com" },
  ],
  cc: [{ name: "Mike Wilson", email: "mike.wilson@mycompany.com" }],
  subject: "Q4 Marketing Campaign Strategy Review",
  date: "2024-01-15T10:30:00Z",
  body: `
    <p>Hi John and Jane,</p>
    
    <p>I hope this email finds you well. I wanted to follow up on our discussion from last week regarding the Q4 marketing campaign strategy.</p>
    
    <p>After reviewing the analytics from our previous campaigns and conducting market research, I've prepared a comprehensive strategy document that outlines our approach for the upcoming quarter. Here are the key highlights:</p>
    
    <ul>
      <li><strong>Target Audience:</strong> We'll be focusing on millennials and Gen Z consumers aged 25-40</li>
      <li><strong>Budget Allocation:</strong> 40% digital advertising, 30% content marketing, 20% social media, 10% traditional media</li>
      <li><strong>Timeline:</strong> Campaign launch scheduled for October 1st, with pre-launch activities starting September 15th</li>
      <li><strong>Key Metrics:</strong> Targeting 25% increase in brand awareness and 15% boost in lead generation</li>
    </ul>
    
    <p>I've attached the detailed strategy document for your review. Please take a look and let me know your thoughts by Friday so we can incorporate any feedback before presenting to the executive team next week.</p>
    
    <p>Additionally, I'd like to schedule a team meeting to discuss the implementation timeline and assign responsibilities. Are you available for a 1-hour meeting sometime next Tuesday or Wednesday?</p>
    
    <p>Looking forward to your feedback and collaboration on this exciting project!</p>
    
    <p>Best regards,<br>
    Sarah Johnson<br>
    Marketing Director<br>
    Company Inc.<br>
    Phone: (555) 123-4567<br>
    Email: sarah.johnson@company.com</p>
  `,
  attachments: [
    {
      id: 1,
      name: "Q4_Marketing_Strategy_2024.pdf",
      size: "2.4 MB",
      type: "application/pdf",
    },
    {
      id: 2,
      name: "Budget_Breakdown.xlsx",
      size: "856 KB",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    {
      id: 3,
      name: "Campaign_Timeline.png",
      size: "1.2 MB",
      type: "image/png",
    },
  ],
  isStarred: false,
  isLiked: false,
  isRead: true,
  priority: "high",
  tags: ["Work", "Marketing"],
  size: "2.4 MB",
};

export default function EmailDetailsPage() {
  const [email, setEmail] = useState(mockEmail);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showFullHeaders, setShowFullHeaders] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const { role } = useSelector((state) => state?.auth?.user)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateMobile = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleStar = () => {
    setEmail((prev) => ({ ...prev, isStarred: !prev.isStarred }));
  };

  const toggleLike = () => {
    setEmail((prev) => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const toggleRead = () => {
    setEmail((prev) => ({ ...prev, isRead: !prev.isRead }));
  };

  const downloadAttachment = (attachment) => {
    console.log(`Downloading ${attachment.name}`);
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊";
    return "📎";
  };

  const getFileColor = (type) => {
    if (type.includes("pdf")) return "bg-red-50 text-red-700 border-red-200";
    if (type.includes("image"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (type.includes("spreadsheet") || type.includes("excel"))
      return "bg-green-50 text-green-700 border-green-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  usePageTitle("email-view");


  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <Link
              to={`/${role}/dashboard`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Inbox
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Email Details
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Viewing conversation from {email.from.name}
            </p>
          </div>

          {/* Desktop Quick Actions */}
          <div className="hidden  sm:flex items-center gap-3">
            <button
              onClick={toggleRead}
              className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-sm text-sm font-medium ${email.isRead
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
            >
              {email.isRead ? "Mark as Unread" : "Mark as Read"}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreOptions((prev) => !prev)}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm text-sm font-medium"
              >
                More Actions
              </button>
              {showMoreOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Flag for Follow-up
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Add to Bookmarks
                  </button>
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white -mx-4 rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-violet-200">
          {/* Email Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-lg">
                {email.from.avatar}
              </div>

              {/* Header Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                      {email.from.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {email.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {email.priority === "high" && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          High Priority
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={toggleStar}
                      className={`p-2 rounded-lg transition-colors ${email.isStarred
                        ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        }`}
                    >
                      <Star
                        className={`w-4 h-4 ${email.isStarred ? "fill-current" : ""
                          }`}
                      />
                    </button>
                    <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="sm:hidden">
                        {formatDateMobile(email.date)}
                      </span>
                      <span className="hidden sm:inline">
                        {formatDate(email.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className="text-gray-800 font-medium text-base sm:text-lg mb-4 leading-relaxed">
                  {email.subject}
                </h4>
              </div>
            </div>
          </div>

          {/* Email Details */}
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-gray-500 font-medium w-16 flex-shrink-0">
                  From:
                </span>
                <span className="text-gray-700 break-all">
                  {email.from.email}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <span className="text-gray-500 font-medium w-16 flex-shrink-0">
                  To:
                </span>
                <div className="flex flex-wrap gap-1">
                  {email.to.map((recipient, index) => (
                    <span
                      key={index}
                      className="text-gray-700 bg-white px-2 py-1 rounded-md text-xs"
                    >
                      {recipient.name}
                    </span>
                  ))}
                </div>
              </div>
              {email.cc.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="text-gray-500 font-medium w-16 flex-shrink-0">
                    Cc:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {email.cc.map((recipient, index) => (
                      <span
                        key={index}
                        className="text-gray-700 bg-white px-2 py-1 rounded-md text-xs"
                      >
                        {recipient.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowFullHeaders(!showFullHeaders)}
                className="text-violet-600 hover:text-violet-800 text-sm flex items-center gap-1 font-medium group"
              >
                {showFullHeaders ? (
                  <>
                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    Show details
                  </>
                )}
              </button>
            </div>

            {showFullHeaders && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">
                    Subject:
                  </span>
                  <span className="text-gray-700">{email.subject}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">
                    Date:
                  </span>
                  <span className="text-gray-700">
                    {formatDate(email.date)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">
                    Size:
                  </span>
                  <span className="text-gray-700">{email.size}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="text-green-800 font-medium text-sm">
                  Verified sender
                </span>
                <p className="text-green-700 text-xs mt-1">
                  This email passed all security checks
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base">
                <Paperclip className="w-5 h-5" />
                Attachments ({email.attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {email.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`p-4 rounded-xl border-2 border-dashed hover:border-solid transition-all duration-200 hover:shadow-md ${getFileColor(
                      attachment.type
                    )}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">
                        {getFileIcon(attachment.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs opacity-75">{attachment.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadAttachment(attachment)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="p-4 sm:p-6">
            <div
              className="prose prose-sm sm:prose max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center justify-between p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm">
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
                <ReplyAll className="w-4 h-4" />
                Reply All
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
                <Forward className="w-4 h-4" />
                Forward
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200">
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium border ${email.isLiked
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <Heart
                  className={`w-4 h-4 ${email.isLiked ? "fill-current" : ""}`}
                />
                {email.isLiked ? "Liked" : "Like"}
              </button>
              <div className="text-xs text-gray-500 px-2">{email.size}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm">
        <div className="p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowMobileActions(!showMobileActions)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <span>Quick Actions</span>
              {showMobileActions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLike}
                className={`p-2 rounded-lg transition-colors ${email.isLiked
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                <Heart
                  className={`w-4 h-4 ${email.isLiked ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={toggleStar}
                className={`p-2 rounded-lg transition-colors ${email.isStarred
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                <Star
                  className={`w-4 h-4 ${email.isStarred ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {showMobileActions && (
            <div className="grid grid-cols-2 gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <ReplyAll className="w-4 h-4" />
                Reply All
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <Forward className="w-4 h-4" />
                Forward
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-medium shadow-lg">
            <Reply className="w-4 h-4" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

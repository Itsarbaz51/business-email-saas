import { Link } from "react-router-dom";
import {
  CheckSquare,
  Square,
  Clock,
  Eye,
  Reply,
  Forward,
  Trash2,
} from "lucide-react";

export default function MailList({
  mails = [],
  selectedMails,
  toggleSelect,
  handleTrash,
}) {
  if (mails?.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
        <h3 className="text-xl font-semibold text-slate-600 mb-2">
          No emails found
        </h3>
        <p className="text-slate-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function sumAttachmentSizes(attachments) {
    if (!attachments || attachments.length === 0) return "0 B";
    const totalBytes = attachments.reduce(
      (sum, att) => sum + (att.fileSize || 0),
      0
    );
    return formatFileSize(totalBytes);
  }

  const stringToColor = (str) => {
    if (!str) return "#6366f1";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f97316",
      "#10b981",
      "#06b6d4",
      "#f59e0b",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "SENT":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "DELETED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {mails?.map((mail) => (
        <div
          key={mail.id}
          className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 ${
            selectedMails.has(mail.id)
              ? "border-blue-300 bg-blue-50/80 shadow-lg shadow-blue-100"
              : "border-white/30 hover:border-blue-200"
          }`}
        >
          {selectedMails.has(mail.id) && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
          )}

          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <button
              onClick={() => toggleSelect(mail.id)}
              className="mt-1 p-1 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {selectedMails.has(mail.id) ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 hover:text-blue-500" />
              )}
            </button>

            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${stringToColor(
                  mail.toEmail || mail.fromEmail
                )}, ${stringToColor(mail.toEmail || mail.fromEmail)}dd)`,
              }}
            >
              {(mail.toEmail || mail.fromEmail)?.slice(0, 1).toUpperCase() ||
                "U"}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {mail.toEmail
                      ? `To: ${mail.toEmail}`
                      : `From: ${mail.fromEmail}`}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      mail.status
                    )}`}
                  >
                    {mail.status || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {mail?.sentAt
                    ? new Date(mail.sentAt).toLocaleString()
                    : "No date"}
                </div>
              </div>

              <div className="cursor-pointer group">
                <h4 className="text-slate-800 font-medium mb-2 group-hover:text-blue-600 transition-colors text-lg">
                  {mail.subject || "No subject"}
                </h4>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/u/inbox/detail/${mail.id}`}
                    state={{ mailId: mail.id }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  {mail.deleted == false && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all duration-200 text-sm font-medium">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                  {mail.deleted == false && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-all duration-200 text-sm font-medium">
                      <Forward className="w-4 h-4" />
                      Forward
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTrash(mail.id);
                    }}
                    disabled={mail.deleted === true}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                    ${
                      mail.deleted
                        ? "cursor-not-allowed bg-red-400 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {mail.deleted ? "Deleted" : "Delete"}
                  </button>
                </div>
                <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  {sumAttachmentSizes(mail.attachments) || "Unknown size"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

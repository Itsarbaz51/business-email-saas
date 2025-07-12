import { Mail, Paperclip, Trash2, Flag, Star } from "lucide-react";
import { mails } from "../../../index.js";
import { Link } from "react-router-dom";
import MailToolbar from "../../components/MailToolbar.jsx";
import { useState } from "react";

export default function Inbox() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-md overflow-hidden">
      <MailToolbar onRefresh={() => setRefreshKey((prev) => prev + 1)} />
      <div key={refreshKey}>
        <div className="bg-gray-200 px-4 py-2 text-xs font-semibold">2022</div>
        {mails.map((mail) => (
          <div className="group flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100 border-t border-gray-300">
            <Link to={`/inbox/detail/${mail.id}`} key={mail.id}>
              {/* Left Section */}
              <div className="flex items-center gap-3">
                {/* Checkbox appears on hover */}
                <input
                  type="checkbox"
                  className="cursor-pointer opacity-0 group-hover:opacity-100 transition"
                />

                <div>
                  <div className="font-medium  flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {mail.from}
                  </div>
                  <div className="text-gray-600 text-sm">{mail.subject}</div>
                </div>
              </div>
            </Link>
            {/* Right Section */}
            <div className="flex items-center gap-4 text-xs">
              <Star className="w-6 h-6 opacity-0 group-hover:opacity-100 cursor-pointer transition hover:bg-gray-300 p-1 rounded-full" />
              <span>{mail.size}</span>
              <span>{mail.date}</span>
              {/* Trash icon appears on hover */}
              <Trash2 className="w-8 h-8 opacity-0 group-hover:opacity-100 cursor-pointer transition hover:bg-gray-300 p-2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





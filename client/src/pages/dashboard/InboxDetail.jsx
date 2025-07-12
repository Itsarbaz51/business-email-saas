import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mails } from "../../../index.js";
import { ArrowLeft } from "lucide-react";

function InboxDetail() {
  const { id } = useParams();
  const mail = mails.find((item) => item.id === Number(id));
  const navigate = useNavigate();

  if (!mail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg">
        Mail not found.
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 p-1 mr-2 hover:bg-black hover:text-white rounded-full" />
          Back to Inbox
        </button>

        {/* Subject */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 break-words">
          {mail.subject}
        </h1>

        {/* From / To / Date / Size */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-sm text-gray-600 mb-6 border-b border-gray-200 pb-4 gap-4">
          <div className="space-y-1">
            <p>
              <span className="font-medium text-gray-800">From:</span>{" "}
              {mail.from}
            </p>
            <p>
              <span className="font-medium text-gray-800">To:</span> {mail.to}
            </p>
          </div>
          <div className="text-sm space-y-1 sm:text-right">
            <p>
              <span className="font-medium text-gray-800">Date:</span>{" "}
              {mail.date}
            </p>
            <p>
              <span className="font-medium text-gray-800">Size:</span>{" "}
              {mail.size}
            </p>
          </div>
        </div>

        {/* Email Body */}
        <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {mail.content}
        </div>
      </div>
        <div className="space-x-3.5  w-fit my-2">
          <button className="bg-gray-200 hover:bg-gray-300 duration-300 w-fit px-4 py-2.5  rounded-2xl cursor-pointer">Reply</button>
          <button className="bg-gray-200 hover:bg-gray-300 duration-300 w-fit px-4 py-2.5  rounded-2xl cursor-pointer">Forward</button>
        </div>
    </div>
  );
}

export default InboxDetail;

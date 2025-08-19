import { Archive } from "lucide-react";
import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { getAllArchive } from "../../redux/slices/mailSlice.js";
import { useDispatch, useSelector } from "react-redux";
import MailList from "../../components/user/MailList.jsx";
import MailToolbar from "../../components/MailToolbar.jsx";

export default function ArchivePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMails, setSelectedMails] = useState(new Set());

  const dispatch = useDispatch();
  const allArchiveMails = useSelector((state) => state.mail?.list || []);

  console.log(allArchiveMails);
  
  usePageTitle("archive");

  useEffect(() => {
    dispatch(getAllArchive());
  }, [dispatch, refreshKey]);

  const toggleSelect = (mailId) => {
    setSelectedMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(mailId) ? newSet.delete(mailId) : newSet.add(mailId);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Archive className="w-6 h-6 text-gray-600" />
            Archive
          </h1>
          <p className="text-gray-600 text-sm">
            You have {allArchiveMails.length} archived conversations
          </p>
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
      <MailList
        mails={allArchiveMails}
        selectedMails={selectedMails}
        toggleSelect={toggleSelect}
      />
    </div>
  );
}

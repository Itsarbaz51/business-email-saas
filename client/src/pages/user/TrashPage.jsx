import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePageTitle from "../../components/usePageTitle.js";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";
import { getTrash, deleteMails } from "../../redux/slices/mailSlice.js";

export default function TrashPage() {
  usePageTitle("Trash");
  const dispatch = useDispatch();
  const trashMails = useSelector((state) => state.mail.list || []);

  const [selectedMails, setSelectedMails] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(getTrash());
  }, [dispatch]);

  // Toggle single mail selection
  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    newSelected.has(mailId)
      ? newSelected.delete(mailId)
      : newSelected.add(mailId);
    setSelectedMails(newSelected);
  };

  // Toggle select all mails
  const toggleSelectAll = () => {
    if (selectedMails.size === trashMails.length && trashMails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(trashMails.map((m) => m.id)));
    }
  };

  // Refresh mails
  const handleRefresh = () => {
    dispatch(getTrash());
    setSelectedMails(new Set());
    setRefreshKey((prev) => prev + 1);
  };

  // Empty selected mails
  const handleEmptyTrash = () => {
    if (selectedMails.size === 0) return;
    dispatch(deleteMails([...selectedMails]));
    setSelectedMails(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MailHeader
        name="Trash"
        mails={trashMails}
        selectedMails={selectedMails}
        toggleSelectAll={toggleSelectAll}
        handleRefresh={handleRefresh}
        handleMoveTrash={handleEmptyTrash}
      />

      {/* Mail List */}
      <div key={refreshKey} className="space-y-4">
        <MailList
          mails={trashMails}
          selectedMails={selectedMails}
          toggleSelect={toggleSelect}
        />
      </div>

      {/* Empty State */}
      {trashMails.length === 0 && (
        <div className="text-center py-12">
          <MailHeader
            name="Trash Empty"
            mails={[]}
            selectedMails={new Set()}
            toggleSelectAll={() => {}}
            handleRefresh={() => {}}
            handleMoveTrash={() => {}}
            
          />
        </div>
      )}
    </div>
  );
}

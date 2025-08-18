import { useEffect, useState } from "react";
import usePageTitle from "../../components/usePageTitle.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllReceivedMails,
  moveToTrash,
} from "../../redux/slices/mailSlice.js";
import MailList from "../../components/user/MailList.jsx";
import MailHeader from "../../components/user/MailHeader.jsx";

export default function InboxPage() {
  usePageTitle("Inbox");

  const dispatch = useDispatch();
  const mails = useSelector((state) =>
    Array.isArray(state.mail?.list) ? state.mail.list : []
  );
  const [selectedMails, setSelectedMails] = useState(new Set());

  useEffect(() => {
    dispatch(getAllReceivedMails());
  }, [dispatch]);

  const toggleSelect = (mailId) => {
    const newSelected = new Set(selectedMails);
    newSelected.has(mailId)
      ? newSelected.delete(mailId)
      : newSelected.add(mailId);
    setSelectedMails(newSelected);
  };

  const handleRefresh = () => {
    dispatch(getAllReceivedMails());
    setSelectedMails(new Set()); // reset selection
  };

  const handleMoveTrash = () => {
    if (
      selectedMails.size > 0 &&
      confirm(`Delete ${selectedMails.size} selected emails?`)
    ) {
      dispatch(moveToTrash([...selectedMails]));
      setSelectedMails(new Set());
    }
  };

  const toggleSelectAll = () => {
    if (selectedMails.size === mails.length && mails.length > 0) {
      setSelectedMails(new Set());
    } else {
      setSelectedMails(new Set(mails.map((m) => m.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MailHeader
        name="Inbox"
        mails={mails}
        selectedMails={selectedMails}
        toggleSelectAll={toggleSelectAll}
        handleRefresh={handleRefresh}
        handleMoveTrash={handleMoveTrash}
      />

      {/* Mail List */}
      <div className="space-y-4">
        <MailList
          mails={mails}
          selectedMails={selectedMails}
          toggleSelect={toggleSelect}
        />
      </div>
    </div>
  );
}

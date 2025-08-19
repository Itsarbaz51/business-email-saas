import { useState, useMemo } from "react";

/**
 * Custom hook to handle searching, filtering & sorting mails
 *
 * @param {Array} mails - original mail list
 * @returns {Object} { processedMails, searchQuery, setSearchQuery, filterStatus, setFilterStatus, sortOrder, setSortOrder }
 */
export default function useMailSearchFilter(mails = []) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("latest");

    const processedMails = useMemo(() => {
        // 🔍 Search + Filter
        const filtered = mails.filter((mail) => {
            const matchesSearch =
                mail.fromEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mail.toEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mail.subject?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                filterStatus === "ALL" ||
                mail.status?.toUpperCase() === filterStatus;

            return matchesSearch && matchesFilter;
        });

        // ⏳ Sort
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.date || a.receivedAt || a.sentAt);
            const dateB = new Date(b.date || b.receivedAt || b.sentAt);
            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });

        return sorted;
    }, [mails, searchQuery, filterStatus, sortOrder]);

    return {
        processedMails,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        sortOrder,
        setSortOrder,
    };
}

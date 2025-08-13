import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title + ' | MailFlow';
    }, [title]);
};

export default usePageTitle;

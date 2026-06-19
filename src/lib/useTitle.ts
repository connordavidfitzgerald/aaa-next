import { useEffect } from "react";

// Replaces Next's metadata exports: set the document title for a page.
export function useTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

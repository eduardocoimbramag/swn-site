import { useEffect } from 'react';

/* Default title from index.html — restored when leaving inner pages */
const BASE_TITLE = document.title;

/**
 * Sets the tab title while the page is mounted.
 * e.g. useDocumentTitle('SaaS · Cases') → "SaaS · Cases — SWN Studio"
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    if (!title) return undefined;
    document.title = `${title} — SWN Studio`;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the right place on every route change:
 *  - With a hash → scrolls to that section (e.g. /#portfolio)
 *  - Without hash → scrolls to the top of the page
 *
 * Mounted once inside <BrowserRouter>.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      /* Defer one frame so the target section has been mounted by React */
      const raf = requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

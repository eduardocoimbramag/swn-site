import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Navigation to the home sections (#about, #contact…) from any route.
 * On the home page: smooth scroll to the section. Elsewhere (e.g. /cases):
 * navigate to "/#id" and ScrollToTop positions the section once home mounts.
 */
export const useSectionNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';

  /* 'hero' is the top of the home page — clean URL instead of "/#hero" */
  const hrefFor = (id) => (id === 'hero' ? '/' : `/#${id}`);

  const goTo = (id) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(hrefFor(id));
    }
  };

  return { isHome, pathname, hrefFor, goTo };
};

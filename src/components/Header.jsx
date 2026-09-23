import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSectionNav } from '../hooks/useSectionNav';

const NAV = [
  { id: 'hero', label: 'Início' },
  { id: 'about', label: 'Sobre' },
  { id: 'services', label: 'Serviços' },
  { id: 'process', label: 'Processo' },
  /* Off the home page, "Cases" opens the /cases index instead of the landing section */
  { id: 'portfolio', label: 'Cases', route: '/cases' },
  { id: 'contact', label: 'Contato' }
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const navigate = useNavigate();
  const { isHome, pathname, hrefFor, goTo: goToSection } = useSectionNav();

  /* Off the home page there are no sections to observe — highlight "Cases" on /cases routes */
  const current = isHome ? active : pathname.startsWith('/cases') ? 'portfolio' : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let observer;
    const raf = requestAnimationFrame(() => {
      const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
      if (!sections.length) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach((s) => observer.observe(s));
    });
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  const goTo = (id) => {
    goToSection(id);
    setOpen(false);
  };

  const hrefForItem = (item) => (!isHome && item.route ? item.route : hrefFor(item.id));

  const handleNav = (e, item) => {
    e.preventDefault();
    if (isHome || !item.route) {
      goTo(item.id);
      return;
    }
    setOpen(false);
    if (pathname === item.route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(item.route);
    }
  };

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-content">
          <a href={hrefFor('hero')} onClick={(e) => { e.preventDefault(); goTo('hero'); }}>
            <img src="/logo-branca.png" alt="SWN Studio" className="header-logo" />
          </a>

          <nav className="header-nav" aria-label="Principal">
            <ul>
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={hrefForItem(item)}
                    className={current === item.id ? 'active' : ''}
                    aria-current={!isHome && current === item.id ? 'page' : undefined}
                    onClick={(e) => handleNav(e, item)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            className="header-button"
            onClick={() => goTo('contact')}
          >
            Falar com a SWN
          </button>

          <button
            className="header-menu-toggle"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={hrefForItem(item)}
                    className={current === item.id ? 'active' : ''}
                    aria-current={!isHome && current === item.id ? 'page' : undefined}
                    onClick={(e) => handleNav(e, item)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              className="header-button"
              onClick={() => goTo('contact')}
            >
              Falar com a SWN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

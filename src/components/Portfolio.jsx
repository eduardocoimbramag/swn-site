import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from 'react-icons/fi';
import { cases } from '../data/cases';
import {
  DashboardMockup,
  MobileMockup,
  SiteMockup
} from './svg/PortfolioMockups';

const Mockup = ({ kind }) => {
  if (kind === 'dashboard') return <DashboardMockup />;
  if (kind === 'mobile') return <MobileMockup />;
  return <SiteMockup />;
};

const swanEase = [0.22, 1, 0.36, 1];

const Portfolio = () => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNavState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* Defer initial measurement until after layout — entry animations and
       lazy SVG mockups can shift scrollWidth on first paint. */
    const raf = requestAnimationFrame(updateNavState);
    const timer = setTimeout(updateNavState, 350);
    el.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      el.removeEventListener('scroll', updateNavState);
      window.removeEventListener('resize', updateNavState);
    };
  }, [updateNavState]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.case-card');
    const step = card ? card.getBoundingClientRect().width + 24 : 360;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="cases">
      <div className="cases-head">
        <motion.div
          className="cases-head-text"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          <h2 className="cases-title">
            Beleza que <span className="cyan">gera resultado.</span>
          </h2>
          <p className="cases-subtitle">
            Uma seleção das experiências digitais que desenhamos e construímos
            com nossos parceiros.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: swanEase }}
        >
          <Link to="/cases" className="cases-head-link">
            Conheça todos os cases
            <FiArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      <div className="cases-track-wrap">
        <ul
          ref={trackRef}
          className="cases-track"
          role="list"
        >
          {cases.map((c, i) => (
            <motion.li
              key={c.id}
              className="case-card"
              style={{ '--accent': c.accent }}
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: swanEase }}
            >
              <div className="case-media">
                <div className="case-media-glow" aria-hidden="true" />
                <div className="case-media-inner">
                  <Mockup kind={c.mockup} />
                </div>
                <span className="case-tag">{c.tag}</span>
                <Link
                  to={`/cases/${c.slug}`}
                  className="case-cta"
                  aria-label={`Conheça o case ${c.client}`}
                >
                  Conheça este case
                  <FiArrowUpRight size={12} aria-hidden="true" />
                </Link>
              </div>

              <div className="case-body">
                <p className="case-text">
                  <strong>{c.boldLead}</strong>{' '}
                  <span className="case-text-mute">{c.cardText}</span>
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Edge fade overlays */}
        <div className="cases-edge cases-edge--left" aria-hidden="true" />
        <div className="cases-edge cases-edge--right" aria-hidden="true" />
      </div>

      <div className="cases-nav">
        <button
          type="button"
          className="cases-nav-btn"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Case anterior"
        >
          <FiChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="cases-nav-btn"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Próximo case"
        >
          <FiChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default Portfolio;

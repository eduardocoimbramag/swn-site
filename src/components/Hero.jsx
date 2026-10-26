import React, { useLayoutEffect, useRef } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { FiArrowRight, FiPlayCircle, FiArrowDown } from 'react-icons/fi';
import HeroSwan from './svg/HeroSwan';
import { SWAN_PATH } from './svg/BrandSwan';
import HeroSky from './HeroSky';
import HeroTitle from './HeroTitle';

const swanEase = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  hidden: { y: 24, opacity: 0, filter: 'blur(8px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.1, delay, ease: swanEase }
  }
});

const Hero = () => {
  const handleScroll = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const contentRef = useRef(null);
  const slotRef = useRef(null);
  const hintRef = useRef(null);

  /* Os botões ficam exatamente no meio entre o título e o "Role para
     descobrir" — medido de novo quando as fontes carregam e a tela muda */
  useLayoutEffect(() => {
    const content = contentRef.current;
    const slot = slotRef.current;
    const hint = hintRef.current;
    const title = content?.querySelector('.hero-title');
    if (!slot || !hint || !title) return undefined;
    let alive = true;
    let raf = 0;
    const place = () => {
      if (!alive) return;
      const label = hint.querySelector('.hero-scroll-hint-label');
      const anchor = label && label.offsetParent !== null ? label : hint;
      slot.style.transform = '';
      const t = title.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const offset = (t.bottom + a.top) / 2 - (s.top + s.height / 2);
      slot.style.transform = `translateY(${offset.toFixed(1)}px)`;
    };
    place();
    document.fonts?.ready.then(place);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    });
    ro.observe(content.parentElement);
    ro.observe(title);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="hero-swan-layer"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: swanEase }}
        aria-hidden="true"
      >
        {/* o cisne flutua devagar, como sobre a água */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, -0.6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HeroSwan size={460} />
        </motion.div>
      </motion.div>

      <section id="hero" className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-aurora" />
          <div className="hero-grid" />
          <HeroSky />
        </div>

        <motion.div
          ref={contentRef}
          className="hero-content"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hero-swan-mobile"
            variants={fadeUp(0.05)}
            aria-hidden="true"
          >
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hero-mobile-grad" x1="0.1" y1="0" x2="0.9" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#83DFE9" />
                  <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <path d={SWAN_PATH} fill="url(#hero-mobile-grad)" fillRule="evenodd" />
            </svg>
          </motion.div>

          <HeroTitle />

          {/* espaçador invisível: mantém o título na posição original */}
          <p className="hero-subtitle hero-subtitle--spacer" aria-hidden="true">
            Criamos softwares, sites e experiências digitais para empresas que querem
            sair do improviso e crescer com sofisticação — com a leveza de um cisne
            e a precisão de um relógio.
          </p>

          <div ref={slotRef} className="hero-buttons-slot">
            <motion.div className="hero-buttons" variants={fadeUp(0.95)}>
              <button
                className="btn-primary"
                onClick={() => handleScroll('#contact')}
              >
                Solicitar proposta <FiArrowRight className="btn-arrow" size={16} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleScroll('#services')}
              >
                <FiPlayCircle size={16} /> Conhecer serviços
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.button
          ref={hintRef}
          className="hero-scroll-hint"
          onClick={() => handleScroll('#about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, ease: swanEase }}
          aria-label="Role para descobrir mais"
        >
          <span className="hero-scroll-hint-label">Role para descobrir</span>
          <motion.span
            className="hero-scroll-hint-icon"
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <FiArrowDown size={14} />
          </motion.span>
        </motion.button>
      </section>
    </MotionConfig>
  );
};

export default Hero;

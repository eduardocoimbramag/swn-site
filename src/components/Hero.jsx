import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlayCircle, FiArrowDown } from 'react-icons/fi';
import HeroSwan from './svg/HeroSwan';
import { SWAN_PATH } from './svg/BrandSwan';
import Feathers from './svg/Feathers';

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

  return (
    <>
      <motion.div
        className="hero-swan-layer"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: swanEase }}
        aria-hidden="true"
      >
        <HeroSwan size={460} />
      </motion.div>

      <section id="hero" className="hero">
        <div className="hero-bg">
          <motion.div
            className="hero-aurora"
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="hero-grid" />
          <Feathers />
        </div>

      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-swan-mobile" variants={fadeUp(0.05)} aria-hidden="true">
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

        <motion.h1 className="hero-title" variants={fadeUp(0.15)}>
          <span className="grad">Onde a beleza</span>
          <br />
          encontra a <span className="italic">performance</span>.
        </motion.h1>

        <motion.p className="hero-subtitle" variants={fadeUp(0.35)}>
          Criamos softwares, sites e experiências digitais para empresas que querem
          sair do improviso e crescer com sofisticação — com a leveza de um cisne
          e a precisão de um relógio.
        </motion.p>

        <motion.div className="hero-buttons" variants={fadeUp(0.55)}>
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
      </motion.div>

      <motion.button
        className="hero-scroll-hint"
        onClick={() => handleScroll('#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6, ease: swanEase }}
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
    </>
  );
};

export default Hero;

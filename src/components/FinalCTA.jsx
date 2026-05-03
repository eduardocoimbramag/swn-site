import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SwanSilhouette from './svg/SwanSilhouette';

const swanEase = [0.22, 1, 0.36, 1];

const FinalCTA = () => {
  const goContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="cta" className="cta">
      <motion.div
        className="cta-aurora"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <SwanSilhouette className="cta-silhouette" opacity={0.04} />

      <div className="cta-content">
        <motion.h2
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          <span className="grad">Sua empresa não precisa parecer maior.</span>
          <br />
          Ela precisa estar pronta para crescer.
        </motion.h2>
        <motion.p
          className="cta-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: swanEase }}
        >
          Vamos criar uma solução digital com beleza, estratégia e performance
          para o seu negócio. Em movimento, com a leveza de um cisne.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.3, ease: swanEase }}
        >
          <button className="btn-primary" onClick={goContact}>
            Falar com a SWN Studio
            <FiArrowRight className="btn-arrow" size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;

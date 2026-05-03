import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { prefillContactInterest } from '../lib/contactBridge';

const swanEase = [0.22, 1, 0.36, 1];

const GlowCard = ({ title, description, items, icon, index = 0, ctaInterest }) => {
  const ref = useRef(null);
  const [iconPlaying, setIconPlaying] = useState(false);

  /* Mouse-tracked spotlight + 3D tilt */
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    /* spotlight position */
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    /* tilt 3D suave (max ±4°) */
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -4;
    const ry = ((x - cx) / cx) * 4;
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => {
    setIconPlaying(true);
  };

  const handleMouseLeave = () => {
    setIconPlaying(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const handleCta = () => {
    if (ctaInterest) prefillContactInterest(ctaInterest);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={ref}
      className="glow-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: swanEase }}
    >
      <span className="glow-card-spotlight" />
      {icon && (
        <div className="glow-card-icon">
          <motion.div
            className="glow-card-icon-inner"
            animate={
              iconPlaying
                ? { rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.9, ease: swanEase }}
          >
            {icon}
          </motion.div>
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="glow-card-items">
        {items.map((item, i) => (
          <li key={i}>
            <span className="item-dot" /> {item}
          </li>
        ))}
      </ul>

      <button type="button" className="glow-card-cta" onClick={handleCta}>
        Falar sobre {title.split(' ')[0]}
        <FiArrowRight className="btn-arrow" size={14} aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default GlowCard;

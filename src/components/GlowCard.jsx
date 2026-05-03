import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const swanEase = [0.22, 1, 0.36, 1];

const GlowCard = ({ title, description, items, icon, index = 0 }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      className="glow-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: swanEase }}
    >
      <span className="glow-card-spotlight" />
      {icon && <div className="glow-card-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      <ul className="glow-card-items">
        {items.map((item, i) => (
          <li key={i}>
            <span className="item-dot" /> {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default GlowCard;

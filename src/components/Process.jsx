import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DiagnoseIcon,
  StrategyIcon,
  DevelopIcon,
  DeliverIcon
} from './svg/ServiceIcons';

const swanEase = [0.22, 1, 0.36, 1];

const steps = [
  {
    n: '01',
    title: 'Diagnóstico',
    description:
      'Entendemos o momento da empresa, seus objetivos e os gargalos que precisam ser resolvidos.',
    icon: <DiagnoseIcon size={28} />,
    /* "Lupa procurando" — rotação leve de busca */
    signature: { rotate: [0, -14, 14, 0], scale: [1, 1.05, 1] }
  },
  {
    n: '02',
    title: 'Estratégia',
    description:
      'Desenhamos a solução ideal com foco em estética, usabilidade, clareza e performance.',
    icon: <StrategyIcon size={28} />,
    /* "Mira focando" — pulsação que aproxima e centra */
    signature: { scale: [1, 1.12, 1], rotate: [0, 8, 0] }
  },
  {
    n: '03',
    title: 'Desenvolvimento',
    description:
      'Criamos o projeto com tecnologia, atenção aos detalhes e uma experiência refinada.',
    icon: <DevelopIcon size={28} />,
    /* "Chevrons trafegando" — translate horizontal sutil */
    signature: { x: [0, -4, 4, 0], scale: [1, 1.06, 1] }
  },
  {
    n: '04',
    title: 'Entrega & Evolução',
    description:
      'Entregamos uma solução funcional, elegante e preparada para crescer junto com o negócio.',
    icon: <DeliverIcon size={28} />,
    /* "Check confirmando" — pulse com leve subida */
    signature: { y: [0, -3, 0], scale: [1, 1.1, 1] }
  }
];

const ProcessCard = ({ step, index, onHover, onLeave }) => {
  const ref = useRef(null);
  const [iconPlaying, setIconPlaying] = useState(false);

  /* Mouse-tracked tilt 3D (max ±4°) */
  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((e.clientY - rect.top - cy) / cy) * -4;
    const ry = ((e.clientX - rect.left - cx) / cx) * 4;
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => {
    setIconPlaying(true);
    onHover(index);
  };

  const handleMouseLeave = () => {
    setIconPlaying(false);
    const el = ref.current;
    if (el) {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }
    onLeave();
  };

  return (
    <motion.div
      ref={ref}
      className="process-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: swanEase }}
    >
      <span className="process-num" aria-hidden="true">
        <svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg">
          <text x="55" y="84" textAnchor="middle">{step.n}</text>
        </svg>
      </span>
      <div className="process-icon">
        <motion.div
          className="process-icon-inner"
          animate={
            iconPlaying ? step.signature : { rotate: 0, scale: 1, x: 0, y: 0 }
          }
          transition={{ duration: 0.9, ease: swanEase }}
        >
          {step.icon}
        </motion.div>
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </motion.div>
  );
};

const Process = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="process" className="process">
      <div className="section-head">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          Nosso <span className="cyan">processo.</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: swanEase }}
        >
          Da estratégia à entrega, cada etapa é pensada para unir estética,
          funcionalidade e resultado.
        </motion.p>
      </div>

      <div className={`process-grid ${hoveredIndex !== null ? 'is-focusing' : ''}`}>
        {steps.map((step, i) => (
          <ProcessCard
            key={step.n}
            step={step}
            index={i}
            onHover={setHoveredIndex}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
    </section>
  );
};

export default Process;

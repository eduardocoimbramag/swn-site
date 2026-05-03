import React from 'react';
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
    icon: <DiagnoseIcon size={28} />
  },
  {
    n: '02',
    title: 'Estratégia',
    description:
      'Desenhamos a solução ideal com foco em estética, usabilidade, clareza e performance.',
    icon: <StrategyIcon size={28} />
  },
  {
    n: '03',
    title: 'Desenvolvimento',
    description:
      'Criamos o projeto com tecnologia, atenção aos detalhes e uma experiência refinada.',
    icon: <DevelopIcon size={28} />
  },
  {
    n: '04',
    title: 'Entrega & Evolução',
    description:
      'Entregamos uma solução funcional, elegante e preparada para crescer junto com o negócio.',
    icon: <DeliverIcon size={28} />
  }
];

const Process = () => {
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

      <div className="process-grid">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            className="process-card"
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: swanEase }}
          >
            <span className="process-num" aria-hidden="true">
              <svg viewBox="0 0 110 100" xmlns="http://www.w3.org/2000/svg">
                <text x="55" y="84" textAnchor="middle">{step.n}</text>
              </svg>
            </span>
            <div className="process-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Process;

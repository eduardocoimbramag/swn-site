import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiSun, FiCode, FiGitMerge } from 'react-icons/fi';

const Process = () => {
  const steps = [
    {
      id: 1,
      title: 'Diagnóstico',
      description: 'Entendemos o momento da empresa, seus objetivos e os gargalos que precisam ser resolvidos.',
      icon: <FiTarget size={24} />
    },
    {
      id: 2,
      title: 'Estratégia',
      description: 'Desenhamos a solução ideal com foco em estética, usabilidade, clareza e performance.',
      icon: <FiSun size={24} />
    },
    {
      id: 3,
      title: 'Desenvolvimento',
      description: 'Criamos o projeto com tecnologia, atenção aos detalhes e uma experiência refinada.',
      icon: <FiCode size={24} />
    },
    {
      id: 4,
      title: 'Entrega e evolução',
      description: 'Entregamos uma solução funcional, elegante e preparada para crescer junto com o negócio.',
      icon: <FiGitMerge size={24} />
    }
  ];

  return (
    <section id="process" className="process">
      <div className="process-content">
        <h2>Nosso processo</h2>
        <p className="process-subtitle">
          Da estratégia à entrega, cada etapa é pensada para unir estética, funcionalidade e resultado.
        </p>
        <div className="process-grid">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: step.id * 0.1 } }
              }}
              initial="hidden"
              animate="visible"
              className="process-card"
            >
              <div className="process-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
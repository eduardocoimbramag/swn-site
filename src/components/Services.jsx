import React from 'react';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import GlowCard from './GlowCard';
import { SoftwareIcon, WebIcon, DesignIcon } from './svg/ServiceIcons';

const swanEase = [0.22, 1, 0.36, 1];

const iconMap = {
  software: <SoftwareIcon size={36} />,
  web: <WebIcon size={36} />,
  design: <DesignIcon size={36} />
};

const Services = () => {
  return (
    <section id="services" className="services">
      <div className="section-head">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          Serviços <span className="cyan">com propósito.</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: swanEase }}
        >
          Desenvolvimento, presença digital e design estratégico para empresas que
          querem crescer com sofisticação e resultado.
        </motion.p>
      </div>

      <div className="services-grid">
        {services.map((service, i) => (
          <GlowCard
            key={service.key}
            index={i}
            icon={iconMap[service.key]}
            title={service.title}
            description={service.description}
            items={service.items}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;

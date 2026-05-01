import React from 'react';
import { services } from '../data/services';
import GlowCard from './GlowCard';

const Services = () => {
  return (
    <section id="services" className="services">
      <div className="services-content">
        <h2>Serviços</h2>
        <p className="services-subtitle">
          Desenvolvimento, presença digital e design estratégico para empresas que querem crescer com sofisticação.
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <GlowCard key={index} title={service.title} description={service.description} items={service.items} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
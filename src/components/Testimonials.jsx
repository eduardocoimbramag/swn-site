import React from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin } from 'react-icons/fi';

const swanEase = [0.22, 1, 0.36, 1];

/* Compact testimonials — short, scannable, premium. */
const quotes = [
  {
    text: 'Sutil, sofisticado e funcional — exatamente o que vendíamos no atendimento e não conseguíamos mostrar online.',
    name: 'Marina Costa',
    role: 'CEO',
    company: 'Atelier Nordi',
    initials: 'MC',
    linkedin: 'https://linkedin.com/in/'
  },
  {
    text: 'Saímos do improviso. O sistema da SWN automatizou processos que consumiam o time inteiro.',
    name: 'Rafael Lima',
    role: 'COO',
    company: 'Vexa Group',
    initials: 'RL',
    linkedin: 'https://linkedin.com/in/'
  },
  {
    text: 'Profissionais raros. Entrega de agência grande, com o cuidado de uma boutique.',
    name: 'Helena Duarte',
    role: 'Founder',
    company: 'Casa Plena',
    initials: 'HD',
    linkedin: 'https://linkedin.com/in/'
  },
  {
    text: 'Resultado mensurável em poucas semanas. Marca posicionada e métricas crescendo juntas.',
    name: 'Lucas Andrade',
    role: 'CMO',
    company: 'Lumen Labs',
    initials: 'LA',
    linkedin: 'https://linkedin.com/in/'
  },
  {
    text: 'Atenção aos detalhes que fez diferença real. Tudo soa premium, do micro-interação ao copy.',
    name: 'Sofia Reis',
    role: 'Head of Design',
    company: 'Studio Marche',
    initials: 'SR',
    linkedin: 'https://linkedin.com/in/'
  }
];

const Avatar = ({ initials }) => (
  <div className="testimonial-avatar" aria-hidden="true">
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`avg-${initials}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#B7ECF1" />
          <stop offset="60%" stopColor="#83DFE9" />
          <stop offset="100%" stopColor="#3F9098" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#avg-${initials})`} />
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.2)" />
    </svg>
    <span className="testimonial-avatar-initials">{initials}</span>
  </div>
);

const TestimonialCard = ({ item }) => (
  <figure className="testimonial">
    <blockquote>
      <p>{item.text}</p>
    </blockquote>

    <figcaption className="testimonial-author">
      <Avatar initials={item.initials} />
      <div className="testimonial-author-meta">
        <strong>{item.name}</strong>
        <span className="testimonial-role">
          {item.role} · {item.company}
        </span>
      </div>
      <a
        className="testimonial-linkedin"
        href={item.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`LinkedIn de ${item.name}`}
      >
        <FiLinkedin size={14} />
      </a>
    </figcaption>
  </figure>
);

const Testimonials = () => {
  /* Duplicate the list so the marquee loops seamlessly */
  const loop = [...quotes, ...quotes];

  return (
    <section id="testimonials" className="testimonials">
      <div className="section-head">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          Marcas que <span className="cyan">deslizam conosco.</span>
        </motion.h2>
      </div>

      <div className="testimonials-marquee" aria-label="Depoimentos de clientes">
        {/* Edge fades */}
        <div className="testimonials-edge testimonials-edge--left" aria-hidden="true" />
        <div className="testimonials-edge testimonials-edge--right" aria-hidden="true" />

        <div className="testimonials-track">
          {loop.map((q, i) => (
            <TestimonialCard key={`${q.name}-${i}`} item={q} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from 'react-icons/fi';
import {
  DashboardMockup,
  MobileMockup,
  SiteMockup
} from './svg/PortfolioMockups';

const swanEase = [0.22, 1, 0.36, 1];

const cases = [
  {
    id: 'vexa',
    tag: 'SaaS · Software',
    boldLead: 'Plataforma de gestão.',
    text: 'SaaS multitenant que automatizou fluxos operacionais e reduziu o tempo de resposta interna em mais de um terço.',
    metric: { value: '−38%', label: 'tempo operacional' },
    stack: ['Next.js', 'Postgres', 'tRPC'],
    mockup: 'dashboard',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))'
  },
  {
    id: 'casaplena',
    tag: 'Mobile · App nativo',
    boldLead: 'App de fidelidade.',
    text: 'Aplicativo nativo iOS/Android com push notifications, analytics em tempo real e integração total ao backend do cliente.',
    metric: { value: '12k', label: 'downloads em 90 dias' },
    stack: ['React Native', 'Expo', 'Firebase'],
    mockup: 'mobile',
    accent:
      'linear-gradient(180deg, rgba(131, 223, 233, 0.18), rgba(0, 0, 0, 0.4))'
  },
  {
    id: 'nordi',
    tag: 'Web · Institucional',
    boldLead: 'Site institucional premium.',
    text: 'Reposicionamento digital com narrativa de marca, motion design e foco em captação qualificada de leads B2B.',
    metric: { value: '+72%', label: 'leads qualificados' },
    stack: ['React', 'Vite', 'Framer Motion'],
    mockup: 'site',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.16), rgba(131, 223, 233, 0.02))'
  },
  {
    id: 'marche',
    tag: 'E-commerce · Web',
    boldLead: 'Loja virtual de alta conversão.',
    text: 'Plataforma com integração de pagamentos, controle de estoque em tempo real e design premium focado em CRO.',
    metric: { value: '180', label: 'pedidos / dia' },
    stack: ['Shopify', 'Hydrogen', 'Klaviyo'],
    mockup: 'site',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.20), rgba(131, 223, 233, 0.04))'
  },
  {
    id: 'lumen',
    tag: 'SaaS · Analytics',
    boldLead: 'Dashboard de BI sob medida.',
    text: 'Suite analítica com visualizações customizadas, exportação automatizada e permissões granulares por equipe.',
    metric: { value: '4x', label: 'velocidade de decisão' },
    stack: ['React', 'D3.js', 'GraphQL'],
    mockup: 'dashboard',
    accent:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))'
  }
];

const Mockup = ({ kind }) => {
  if (kind === 'dashboard') return <DashboardMockup />;
  if (kind === 'mobile') return <MobileMockup />;
  return <SiteMockup />;
};

const Portfolio = () => {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNavState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* Defer initial measurement until after layout — entry animations and
       lazy SVG mockups can shift scrollWidth on first paint. */
    const raf = requestAnimationFrame(updateNavState);
    const timer = setTimeout(updateNavState, 350);
    el.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      el.removeEventListener('scroll', updateNavState);
      window.removeEventListener('resize', updateNavState);
    };
  }, [updateNavState]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.case-card');
    const step = card ? card.getBoundingClientRect().width + 24 : 360;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="cases">
      <div className="cases-head">
        <motion.div
          className="cases-head-text"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          <h2 className="cases-title">
            Beleza que <span className="cyan">gera resultado.</span>
          </h2>
          <p className="cases-subtitle">
            Uma seleção das experiências digitais que desenhamos e construímos
            com nossos parceiros.
          </p>
        </motion.div>

        <motion.a
          className="cases-head-link"
          href="#contact"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: swanEase }}
        >
          Conheça todos os cases
          <FiArrowUpRight size={16} aria-hidden="true" />
        </motion.a>
      </div>

      <div className="cases-track-wrap">
        <ul
          ref={trackRef}
          className="cases-track"
          role="list"
        >
          {cases.map((c, i) => (
            <motion.li
              key={c.id}
              className="case-card"
              style={{ '--accent': c.accent }}
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: swanEase }}
            >
              <div className="case-media">
                <div className="case-media-glow" aria-hidden="true" />
                <div className="case-media-inner">
                  <Mockup kind={c.mockup} />
                </div>
                <span className="case-tag">{c.tag}</span>
                <a
                  href="#services"
                  className="case-cta"
                  aria-label={`Conheça nossos cases — ${c.boldLead}`}
                >
                  Conheça nossos cases
                  <FiArrowUpRight size={12} aria-hidden="true" />
                </a>
              </div>

              <div className="case-body">
                <p className="case-text">
                  <strong>{c.boldLead}</strong>{' '}
                  <span className="case-text-mute">{c.text}</span>
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Edge fade overlays */}
        <div className="cases-edge cases-edge--left" aria-hidden="true" />
        <div className="cases-edge cases-edge--right" aria-hidden="true" />
      </div>

      <div className="cases-nav">
        <button
          type="button"
          className="cases-nav-btn"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Case anterior"
        >
          <FiChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="cases-nav-btn"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Próximo case"
        >
          <FiChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default Portfolio;

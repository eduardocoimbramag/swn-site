import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import {
  DashboardMockup,
  MobileMockup,
  SiteMockup
} from './svg/PortfolioMockups';

const swanEase = [0.22, 1, 0.36, 1];

const cases = [
  {
    tag: 'SaaS · Software',
    client: 'Vexa Group · Logística',
    title: 'Plataforma de gestão',
    text: 'SaaS multitenant que automatizou fluxos operacionais e reduziu o tempo de resposta interna em mais de um terço.',
    metric: { value: '−38%', label: 'tempo operacional' },
    stack: ['Next.js', 'Postgres', 'tRPC'],
    span: 'wide',
    mockup: 'dashboard',
    gradient:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.22), rgba(131, 223, 233, 0.04))'
  },
  {
    tag: 'Mobile · App nativo',
    client: 'Casa Plena · Fidelidade',
    title: 'App de fidelidade',
    text: 'Aplicativo nativo iOS/Android com push, analytics e integração ao backend do cliente.',
    metric: { value: '12k', label: 'downloads em 90 dias' },
    stack: ['React Native', 'Expo', 'Firebase'],
    span: 'tall',
    mockup: 'mobile',
    gradient:
      'linear-gradient(180deg, rgba(131, 223, 233, 0.18), rgba(0, 0, 0, 0.4))'
  },
  {
    tag: 'Web · Institucional',
    client: 'Atelier Nordi · Moda',
    title: 'Site institucional premium',
    text: 'Reposicionamento digital com narrativa de marca, motion design e foco em captação qualificada.',
    metric: { value: '+72%', label: 'leads qualificados' },
    stack: ['React', 'Vite', 'Framer Motion'],
    span: 'med',
    mockup: 'site',
    gradient:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.16), rgba(131, 223, 233, 0.02))'
  },
  {
    tag: 'E-commerce · Web',
    client: 'Studio Marche · Beleza',
    title: 'Loja virtual de alta conversão',
    text: 'Plataforma com integração de pagamentos, estoque e design premium focado em CRO.',
    metric: { value: '180', label: 'pedidos / dia' },
    stack: ['Shopify', 'Hydrogen', 'Klaviyo'],
    span: 'med',
    mockup: 'site',
    gradient:
      'linear-gradient(135deg, rgba(131, 223, 233, 0.20), rgba(131, 223, 233, 0.04))'
  }
];

const Mockup = ({ kind }) => {
  if (kind === 'dashboard') return <DashboardMockup />;
  if (kind === 'mobile') return <MobileMockup />;
  return <SiteMockup />;
};

const Portfolio = () => {
  return (
    <section id="portfolio" className="portfolio">
      <div className="section-head">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          Beleza que <span className="cyan">gera resultado.</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: swanEase }}
        >
          Uma seleção das experiências digitais que desenhamos e construímos
          com nossos parceiros.
        </motion.p>
      </div>

      <div className="portfolio-grid">
        {cases.map((c, i) => (
          <motion.article
            key={c.title}
            className={`portfolio-card portfolio-card--${c.span}`}
            style={{ '--gradient': c.gradient }}
            initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: i * 0.12, ease: swanEase }}
          >
            <div className="portfolio-mockup-wrap">
              <Mockup kind={c.mockup} />
            </div>

            <div className="portfolio-body">
              <div className="portfolio-meta">
                <span className="portfolio-tag">{c.tag}</span>
                <span className="portfolio-client">{c.client}</span>
              </div>

              <h3>
                {c.title}
                <FiArrowUpRight size={20} className="portfolio-arrow" aria-hidden="true" />
              </h3>
              <p>{c.text}</p>

              <div className="portfolio-footer">
                <div className="portfolio-metric">
                  <span className="portfolio-metric-value">{c.metric.value}</span>
                  <span className="portfolio-metric-label">{c.metric.label}</span>
                </div>
                <ul className="portfolio-stack" aria-label="Stack">
                  {c.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;

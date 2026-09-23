import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiPlus
} from 'react-icons/fi';
import { getCategoryBySlug } from '../data/caseCategories';
import { getCaseBySlug, getCasePath, getCasesByCategory } from '../data/cases';
import CaseCard from '../components/CaseCard';
import BrandSwan from '../components/svg/BrandSwan';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const swanEase = [0.22, 1, 0.36, 1];

/* Entrance on load (above-the-fold content) */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay, ease: swanEase }
});

/* Entrance when scrolled into view */
const revealUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, delay, ease: swanEase }
});

/* Last card in the grid — an invitation for the category's next project */
const CtaCard = ({ category, index }) => (
  <motion.article
    className="cases-index-card cases-cta-card"
    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: swanEase }}
  >
    <Link
      to="/#contact"
      state={{ contactInterest: category.name }}
      className="cases-index-card-link"
    >
      <div className="cases-index-card-media cases-cta-card-media">
        <span className="cases-cta-card-orbit" aria-hidden="true" />
        <span className="cases-cta-card-icon" aria-hidden="true">
          <FiPlus size={26} />
        </span>
        <span className="cases-index-card-tag">Novo projeto</span>
      </div>
      <div className="cases-index-card-body">
        <h3 className="cases-index-card-title">
          Seu projeto aqui
          <FiArrowUpRight size={18} aria-hidden="true" className="cases-index-card-arrow" />
        </h3>
        <p>
          <strong>Vamos construir juntos?</strong>{' '}
          <span>
            Conte o que você precisa e desenhamos a solução ideal para o seu negócio.
          </span>
        </p>
      </div>
    </Link>
  </motion.article>
);

/* Category with no published projects yet */
const EmptyGallery = ({ category }) => (
  <motion.div className="cases-gallery-empty" {...revealUp(0)}>
    <span className="cases-cta-card-orbit" aria-hidden="true" />
    <span className="cases-cta-card-icon cases-gallery-empty-icon" aria-hidden="true">
      <BrandSwan size={30} />
    </span>
    <h3>Novos projetos em breve</h3>
    <p>
      Estamos preparando a vitrine de {category.name}. Enquanto isso, conte o que
      você precisa — desenhamos a solução ideal para o seu negócio.
    </p>
    <div className="cases-gallery-empty-actions">
      <Link
        to="/#contact"
        state={{ contactInterest: category.name }}
        className="btn-primary"
      >
        Falar sobre {category.name}
        <FiArrowRight className="btn-arrow" size={16} aria-hidden="true" />
      </Link>
      <Link to="/cases" className="btn-secondary">
        Ver outras categorias
      </Link>
    </div>
  </motion.div>
);

const CaseCategoryPage = () => {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  useDocumentTitle(category ? `${category.name} · Cases` : null);

  if (!category) {
    /* Legacy links (/cases/:case-slug) forward to the case's current URL */
    const legacyCase = getCaseBySlug(categorySlug);
    return <Navigate to={legacyCase ? getCasePath(legacyCase) : '/cases'} replace />;
  }

  const projects = getCasesByCategory(category.slug);

  return (
    <>
      <Header />
      {/* key: switching categories remounts the page so the entrances replay */}
      <main className="cases-gallery" key={category.slug}>
        <motion.div className="cases-index-back-wrap" {...fadeUp(0)}>
          <Link to="/cases" className="cases-index-back">
            <FiArrowLeft size={14} aria-hidden="true" />
            <span>Todos os cases</span>
          </Link>
        </motion.div>

        {/* Project gallery */}
        <section aria-labelledby="cases-gallery-title">
          <motion.div className="cases-gallery-section-head" {...fadeUp(0.08)}>
            <h1 id="cases-gallery-title">Projetos de {category.name}</h1>
            {projects.length > 0 && (
              <span className="cases-gallery-count">
                {String(projects.length).padStart(2, '0')}{' '}
                {projects.length === 1 ? 'projeto' : 'projetos'}
              </span>
            )}
          </motion.div>

          {projects.length > 0 ? (
            <div className="cases-index-grid">
              {projects.map((p, i) => (
                <CaseCard
                  key={p.id}
                  to={getCasePath(p, category.slug)}
                  tag={p.tag}
                  title={p.client}
                  lead={p.boldLead}
                  text={p.cardText}
                  accent={p.accent}
                  mockup={p.mockup}
                  headingLevel="h3"
                  index={i}
                />
              ))}
              <CtaCard category={category} index={projects.length} />
            </div>
          ) : (
            <EmptyGallery category={category} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CaseCategoryPage;

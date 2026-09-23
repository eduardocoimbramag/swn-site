import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';
import {
  getCaseBySlug,
  getCasePath,
  getCasesByCategory,
  getNextCaseInCategory
} from '../data/cases';
import { getCategoryBySlug, getCategoryPath } from '../data/caseCategories';
import CaseImage from '../components/CaseImage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const swanEase = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, delay, ease: swanEase }
});

/* SVG hash mark — animated ascent decoration for "back" arrow */
const BackArrowAnim = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <motion.path
      d="M10 3 L 4 8 L 10 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7, ease: swanEase }}
    />
    <motion.path
      d="M4 8 L 14 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: swanEase }}
    />
  </svg>
);

const SECTIONS = [
  { id: 'overview',  label: 'Sobre' },
  { id: 'challenge', label: 'Desafio' },
  { id: 'solution',  label: 'Solução' },
  { id: 'result',    label: 'Resultado' },
  { id: 'stack',     label: 'Stack & Time' }
];

const CasePage = () => {
  const { category: categorySlug, slug } = useParams();
  const caseData = getCaseBySlug(slug);
  const category = getCategoryBySlug(categorySlug);
  const isValid = Boolean(
    caseData && category && caseData.categories.includes(category.slug)
  );
  const [activeSection, setActiveSection] = useState('overview');

  useDocumentTitle(isValid ? `${caseData.client} · ${category.name}` : null);

  /* Active section indicator — IntersectionObserver on each block.
     categorySlug in deps: the same case can be opened from another category,
     which remounts <main> (see key below) with fresh section nodes. */
  useEffect(() => {
    if (!isValid) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isValid, caseData, categorySlug]);

  if (!isValid) {
    /* Unknown case → category gallery (or the index).
       Category that doesn't list this case → the case's canonical URL. */
    const fallback = category ? getCategoryPath(category.slug) : '/cases';
    return <Navigate to={caseData ? getCasePath(caseData) : fallback} replace />;
  }

  const siblings = getCasesByCategory(category.slug);
  const nextCase = getNextCaseInCategory(category.slug, caseData.slug);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header />
      <main className="case-page" key={`${category.slug}/${caseData.slug}`}>
        <div className="case-page-shell">
          {/* ─── ASIDE — left rail ─── */}
          <aside className="case-aside" aria-label="Navegação dos cases">
            {/* Back buttons: category gallery first, then the cases index */}
            <div className="case-aside-back-group">
              <span className="case-aside-label">Voltar para</span>
              <Link
                to={getCategoryPath(category.slug)}
                className="case-aside-back"
                aria-label={`Voltar para ${category.name}`}
              >
                <BackArrowAnim />
                <span>{category.name}</span>
              </Link>
              <Link to="/cases" className="case-aside-back case-aside-back--home">
                <BackArrowAnim />
                <span>Todos os cases</span>
              </Link>
            </div>

            <div className="case-aside-divider" aria-hidden="true" />

            {/* Section navigation */}
            <nav className="case-aside-sections" aria-label="Seções desta página">
              <span className="case-aside-label">Nesta página</span>
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(s.id)}
                      className={`case-aside-section ${
                        activeSection === s.id ? 'is-active' : ''
                      }`}
                    >
                      <span className="case-aside-section-dot" aria-hidden="true" />
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Other cases in this category — hidden when this is the only one */}
            {siblings.length > 1 && (
              <>
                <div className="case-aside-divider" aria-hidden="true" />
                <nav className="case-aside-list" aria-label={`Projetos de ${category.name}`}>
                  <span className="case-aside-label">Nesta categoria</span>
                  <ul>
                    {siblings.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={getCasePath(c, category.slug)}
                          className={`case-aside-link ${
                            c.slug === slug ? 'is-current' : ''
                          }`}
                          aria-current={c.slug === slug ? 'page' : undefined}
                        >
                          <span className="case-aside-link-bullet" aria-hidden="true" />
                          <span className="case-aside-link-text">
                            <strong>{c.client}</strong>
                            <em>{c.tag}</em>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </aside>

          {/* ─── CONTENT — middle column ─── */}
          <article className="case-content">
            {/* Hero */}
            <motion.section
              id="overview"
              className="case-hero"
              {...fadeUp(0)}
            >
              <span className="case-hero-tag">{caseData.tag}</span>
              <h1 className="case-hero-client">{caseData.client}</h1>
              <p className="case-hero-headline">{caseData.headline}</p>
              <p className="case-hero-subhead">{caseData.subhead}</p>

              <div className="case-hero-image">
                <CaseImage
                  accent={caseData.accent}
                  mockup={caseData.mockup}
                  watermark={caseData.client}
                  variant="hero"
                />
              </div>
            </motion.section>

            {/* Metrics row */}
            <motion.section className="case-metrics" {...fadeUp(0.1)}>
              {caseData.metrics.map((m) => (
                <div key={m.label} className="case-metric">
                  <span className="case-metric-value">{m.value}</span>
                  <span className="case-metric-label">{m.label}</span>
                </div>
              ))}
            </motion.section>

            {/* Challenge */}
            <motion.section id="challenge" className="case-block" {...fadeUp(0)}>
              <span className="case-block-eyebrow">01 · {caseData.challenge.title}</span>
              <h2 className="case-block-title">{caseData.challenge.title}</h2>
              <p>{caseData.challenge.text}</p>
            </motion.section>

            {/* Solution */}
            <motion.section id="solution" className="case-block" {...fadeUp(0)}>
              <span className="case-block-eyebrow">02 · {caseData.solution.title}</span>
              <h2 className="case-block-title">{caseData.solution.title}</h2>
              <p>{caseData.solution.text}</p>

              {caseData.solution.features?.length > 0 && (
                <ul className="case-features">
                  {caseData.solution.features.map((f) => (
                    <li key={f}>
                      <FiCheck size={14} aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>

            {/* Result */}
            <motion.section id="result" className="case-block" {...fadeUp(0)}>
              <span className="case-block-eyebrow">03 · {caseData.result.title}</span>
              <h2 className="case-block-title">{caseData.result.title}</h2>
              <p>{caseData.result.text}</p>
            </motion.section>

            {/* Testimonial */}
            {caseData.testimonial && (
              <motion.section className="case-testimonial" {...fadeUp(0)}>
                <p className="case-testimonial-text">
                  <span className="case-testimonial-quote" aria-hidden="true">&ldquo;</span>
                  {caseData.testimonial.text}
                </p>
                <footer className="case-testimonial-author">
                  <span className="case-testimonial-avatar">{caseData.testimonial.avatar}</span>
                  <div>
                    <strong>{caseData.testimonial.author}</strong>
                    <span>{caseData.testimonial.role} · {caseData.client}</span>
                  </div>
                </footer>
              </motion.section>
            )}

            {/* Stack & Time */}
            <motion.section id="stack" className="case-block" {...fadeUp(0)}>
              <span className="case-block-eyebrow">04 · Stack & Time</span>
              <h2 className="case-block-title">Como foi construído</h2>

              <div className="case-stack-grid">
                <div>
                  <span className="case-stack-label">Stack principal</span>
                  <ul className="case-chips">
                    {caseData.stack.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                {caseData.integrations?.length > 0 && (
                  <div>
                    <span className="case-stack-label">Integrações</span>
                    <ul className="case-chips">
                      {caseData.integrations.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Next case in this category (none when it's the only one) */}
            {nextCase && (
              <motion.section className="case-next" {...fadeUp(0)}>
                <Link to={getCasePath(nextCase, category.slug)} className="case-next-link">
                  <span className="case-next-label">Próximo case</span>
                  <span className="case-next-client">
                    {nextCase.client}
                    <FiArrowRight size={20} aria-hidden="true" />
                  </span>
                  <span className="case-next-tag">{nextCase.tag}</span>
                </Link>
              </motion.section>
            )}
          </article>

          {/* ─── META — right column ─── */}
          <aside className="case-meta" aria-label="Informações do projeto">
            <div className="case-meta-block">
              <span className="case-meta-label">Cliente</span>
              <strong>{caseData.client}</strong>
            </div>
            <div className="case-meta-block">
              <span className="case-meta-label">Setor</span>
              <strong>{caseData.sector}</strong>
            </div>
            <div className="case-meta-block">
              <span className="case-meta-label">Ano</span>
              <strong>{caseData.year}</strong>
            </div>
            <div className="case-meta-block">
              <span className="case-meta-label">Duração</span>
              <strong>{caseData.duration}</strong>
            </div>
            <div className="case-meta-block">
              <span className="case-meta-label">Time SWN</span>
              <strong>{caseData.teamSize} {caseData.teamSize === 1 ? 'pessoa' : 'pessoas'}</strong>
            </div>

            {caseData.liveUrl && (
              <a
                className="case-meta-link"
                href={caseData.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver projeto ao vivo
                <FiArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CasePage;

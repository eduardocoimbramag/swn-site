import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { caseCategories, getCategoryPath } from '../data/caseCategories';
import CaseCard from '../components/CaseCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const swanEase = [0.22, 1, 0.36, 1];

const CasesIndex = () => {
  useDocumentTitle('Cases');

  return (
    <>
      <Header />
      <main className="cases-index">
        <motion.div
          className="cases-index-back-wrap"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: swanEase }}
        >
          <Link to="/#portfolio" className="cases-index-back">
            <FiArrowLeft size={14} aria-hidden="true" />
            <span>Voltar ao site</span>
          </Link>
        </motion.div>

        <section className="cases-index-head">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.1, ease: swanEase }}
          >
            Beleza que <span className="cyan">gera resultado.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: swanEase }}
          >
            Explore nosso portfólio por especialidade. Escolha uma categoria para
            conhecer os projetos que desenhamos e construímos com nossos parceiros.
          </motion.p>
        </section>

        <section className="cases-index-grid" aria-label="Categorias de cases">
          {caseCategories.map((c, i) => (
            <CaseCard
              key={c.slug}
              to={getCategoryPath(c.slug)}
              tag={c.tag}
              title={c.name}
              lead={c.tagline}
              text={c.description}
              accent={c.accent}
              mockup={c.mockup}
              index={i}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CasesIndex;

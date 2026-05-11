import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiArrowLeft } from 'react-icons/fi';
import { cases } from '../data/cases';
import CaseImage from '../components/CaseImage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const swanEase = [0.22, 1, 0.36, 1];

const CasesIndex = () => {
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
            Cada projeto é desenhado em conjunto com nossos parceiros — da
            estratégia à entrega final.
          </motion.p>
        </section>

        <section className="cases-index-grid">
          {cases.map((c, i) => (
            <motion.article
              key={c.id}
              className="cases-index-card"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.05 * i, ease: swanEase }}
            >
              <Link to={`/cases/${c.slug}`} className="cases-index-card-link">
                <div className="cases-index-card-media">
                  <CaseImage caseData={c} variant="card" />
                  <span className="cases-index-card-tag">{c.tag}</span>
                </div>
                <div className="cases-index-card-body">
                  <h2>
                    {c.client}
                    <FiArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="cases-index-card-arrow"
                    />
                  </h2>
                  <p>
                    <strong>{c.boldLead}</strong>{' '}
                    <span>{c.cardText}</span>
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CasesIndex;

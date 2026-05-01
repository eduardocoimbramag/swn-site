import React from 'react';
import { motion } from 'framer-motion';
import { FiPlayCircle, FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <motion.h1
            variants={{
              hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
              visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.2 } }
            }}
            initial="hidden"
            animate="visible"
          >
            SWN Studio
          </motion.h1>
          <motion.h2
            variants={{
              hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
              visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.4 } }
            }}
            initial="hidden"
            animate="visible"
          >
            Soluções digitais com beleza, estratégia e performance.
          </motion.h2>
          <motion.p
            variants={{
              hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
              visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.6 } }
            }}
            initial="hidden"
            animate="visible"
          >
            Criamos softwares, sites e experiências digitais para empresas que querem sair do improviso e crescer com sofisticação.
          </motion.p>
          <div className="hero-buttons">
            <motion.button
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }
              }}
              initial="hidden"
              animate="visible"
              className="btn-primary"
            >
              Solicitar proposta
            </motion.button>
            <motion.button
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.9 } }
              }}
              initial="hidden"
              animate="visible"
              className="btn-secondary"
            >
              Conhecer serviços <FiArrowRight size={16} />
            </motion.button>
          </div>
        </div>
        <div className="hero-bg">
          <motion.div
            className="aurora"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.3, transition: { duration: 2, delay: 0.5 } }
            }}
            initial="hidden"
            animate="visible"
          />
          <motion.img
            src="/logo-branca.png"
            alt="SWN Studio"
            className="hero-logo"
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 0.1, transition: { duration: 1.5, delay: 0.7 } }
            }}
            initial="hidden"
            animate="visible"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
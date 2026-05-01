import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <div className="about-text">
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
            initial="hidden"
            animate="visible"
          >
            Sutileza, beleza e performance em cada movimento.
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
            }}
            initial="hidden"
            animate="visible"
          >
            A SWN nasce da palavra Swan, que significa cisne. Assim como o animal, a marca carrega precisão, elegância e fluidez em cada solução digital criada para o seu negócio.
          </motion.p>
        </div>
        <div className="about-pillars">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.4 } }
            }}
            initial="hidden"
            animate="visible"
            className="pillar"
          >
            <FiCheckCircle size={24} className="pillar-icon" />
            <h3>Sutileza</h3>
            <p>Design limpo, preciso e intencional.</p>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.6 } }
            }}
            initial="hidden"
            animate="visible"
            className="pillar"
          >
            <FiCheckCircle size={24} className="pillar-icon" />
            <h3>Beleza</h3>
            <p>Experiências visuais que elevam a percepção da marca.</p>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.8 } }
            }}
            initial="hidden"
            animate="visible"
            className="pillar"
          >
            <FiCheckCircle size={24} className="pillar-icon" />
            <h3>Performance</h3>
            <p>Soluções criadas para gerar resultado real.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
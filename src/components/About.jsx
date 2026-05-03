import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OrbitalRings from './svg/OrbitalRings';
import PillarMark from './svg/PillarMark';

const swanEase = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

const pillars = [
  {
    key: 'sutileza',
    title: 'Sutileza',
    text: 'Design limpo, preciso e intencional — nada em excesso.'
  },
  {
    key: 'beleza',
    title: 'Beleza',
    text: 'Experiências visuais que elevam a percepção da marca.'
  },
  {
    key: 'performance',
    title: 'Performance',
    text: 'Soluções criadas para gerar resultado real e mensurável.'
  }
];

const About = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="about" className="about">
      <div className="about-grid">
        <div className="about-text">
          <motion.h2
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 1, ease: swanEase }}
          >
            Sutileza, beleza e performance{' '}
            <span className="cyan">em cada movimento.</span>
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 1, delay: 0.2, ease: swanEase }}
          >
            A SWN nasce da palavra <strong>Swan</strong>, que significa cisne. Assim como o
            animal, a marca carrega precisão, elegância e fluidez em cada solução
            digital criada para o seu negócio. Pensamos estratégia, desenhamos
            interfaces e construímos sistemas com a mesma serenidade de quem
            desliza sobre a água — mas com a engenharia que move tudo por baixo.
          </motion.p>

          <div className="about-pillars">
            {pillars.map((p, i) => (
              <motion.div
                key={p.key}
                className={`pillar ${active === p.key ? 'pillar--active' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: swanEase }}
                onMouseEnter={() => setActive(p.key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.key)}
                onBlur={() => setActive(null)}
                tabIndex={0}
              >
                <div className="pillar-icon">
                  <PillarMark delay={i * 0.4} />
                </div>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="about-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: swanEase }}
        >
          <OrbitalRings
            size={420}
            pillars={pillars}
            active={active}
            onActiveChange={setActive}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;

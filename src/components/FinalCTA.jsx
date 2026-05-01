import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = () => {
  return (
    <section id="cta" className="cta">
      <div className="cta-content">
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          initial="hidden"
          animate="visible"
        >
          Sua empresa não precisa parecer maior. Ela precisa estar pronta para crescer.
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
          }}
          initial="hidden"
          animate="visible"
          className="cta-subtitle"
        >
          Vamos criar uma solução digital com beleza, estratégia e performance para o seu negócio.
        </motion.p>
        <motion.button
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
          }}
          initial="hidden"
          animate="visible"
          className="btn-primary"
        >
          Falar com a SWN Studio
        </motion.button>
      </div>
    </section>
  );
};

export default FinalCTA;
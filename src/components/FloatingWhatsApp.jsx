import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildWhatsAppLink } from '../lib/contact';

const swanEase = [0.22, 1, 0.36, 1];

const WhatsAppGlyph = ({ size = 26 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M16.02 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.56-1.7a12.74 12.74 0 0 0 6.26 1.62h.01c7.06 0 12.8-5.74 12.8-12.8s-5.75-12.72-12.81-12.72Zm0 23.31a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.01 1.04-3.79-.25-.4a10.51 10.51 0 0 1-1.64-5.62c0-5.86 4.78-10.63 10.64-10.63 2.84 0 5.5 1.1 7.51 3.11a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.78 10.51-10.73 10.51Zm6.13-7.92c-.34-.17-1.99-.98-2.3-1.09-.31-.11-.53-.17-.76.17-.22.34-.87 1.09-1.07 1.31-.2.22-.39.25-.73.08-.34-.17-1.43-.53-2.72-1.69a10.16 10.16 0 0 1-1.88-2.34c-.2-.34 0-.52.15-.69.16-.16.34-.4.51-.6.17-.2.22-.34.34-.56.11-.22.06-.42-.03-.6-.08-.17-.76-1.83-1.05-2.51-.27-.66-.55-.57-.76-.58H10.06c-.22 0-.59.08-.9.42-.31.34-1.18 1.16-1.18 2.83 0 1.66 1.21 3.27 1.38 3.49.17.22 2.39 3.65 5.79 5.12.81.35 1.44.56 1.93.72.81.26 1.55.22 2.13.13.65-.1 1.99-.81 2.27-1.6.28-.79.28-1.46.2-1.6-.08-.14-.31-.22-.65-.39Z"
    />
  </svg>
);

const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          className="float-wa"
          href={buildWhatsAppLink('Olá SWN! Vim pelo site.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a SWN no WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 320,
            damping: 22,
            mass: 0.6
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Outer breathing glow ring */}
          <motion.span
            className="float-wa-pulse"
            aria-hidden="true"
            animate={{
              opacity: [0.55, 0, 0.55],
              scale: [1, 1.55, 1]
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1]
            }}
          />
          {/* Soft halo behind the button */}
          <motion.span
            className="float-wa-halo"
            aria-hidden="true"
            animate={{
              opacity: [0.35, 0.85, 0.35],
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          {/* Sliding shimmer */}
          <span className="float-wa-shimmer" aria-hidden="true" />

          <span className="float-wa-icon">
            <WhatsAppGlyph size={26} />
          </span>

          <span className="float-wa-tooltip" aria-hidden="true">
            Fale com a SWN
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsApp;

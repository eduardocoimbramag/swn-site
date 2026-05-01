import React from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ children, variant, custom }) => {
  // Define variants
  const variants = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    },
    fadeInBlur: {
      hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } }
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
    }
  };

  const variantToUse = variant || 'fadeIn';
  const customVariants = custom || {};

  return (
    <motion.span
      variants={variants[variantToUse] || variants.fadeIn}
      initial="hidden"
      animate="visible"
      {...customVariants}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedText;
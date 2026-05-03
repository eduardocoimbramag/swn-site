import React from 'react';
import { motion } from 'framer-motion';

/**
 * Subtle, shared micro-animation for the About pillars.
 * A breathing concentric mark — neutral enough to fit all three concepts
 * (sutileza, beleza, performance) without competing with the text.
 */
const PillarMark = ({ size = 38, delay = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'block', overflow: 'visible' }}
  >
    {/* Outer halo — slow pulse */}
    <motion.circle
      cx="20"
      cy="20"
      r="14"
      fill="none"
      stroke="#83DFE9"
      strokeOpacity="0.35"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
      animate={{ r: [14, 18, 14], opacity: [0.35, 0, 0.35] }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    />

    {/* Mid ring — gentle rotation */}
    <motion.circle
      cx="20"
      cy="20"
      r="11"
      fill="none"
      stroke="#83DFE9"
      strokeOpacity="0.55"
      strokeWidth="1"
      strokeDasharray="2 4"
      vectorEffect="non-scaling-stroke"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      style={{ originX: '20px', originY: '20px' }}
    />

    {/* Inner dot — soft breathing */}
    <motion.circle
      cx="20"
      cy="20"
      r="3"
      fill="#83DFE9"
      animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      style={{ originX: '20px', originY: '20px' }}
    />
  </svg>
);

export default PillarMark;

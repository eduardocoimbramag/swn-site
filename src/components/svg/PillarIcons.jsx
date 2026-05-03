import React from 'react';
import { motion } from 'framer-motion';

const CYAN = '#83DFE9';

const baseProps = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 40 40',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: CYAN,
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
  'aria-hidden': 'true',
  style: { display: 'block', overflow: 'visible' }
});

/* ----------------------------------------------------------------
   WIND — Sutileza
   Three flowing lines with gentle horizontal drift.
---------------------------------------------------------------- */
export const WindIcon = ({ size = 38, delay = 0 }) => (
  <svg {...baseProps(size)}>
    <motion.path
      d="M5 14 C 12 14, 16 10, 22 12 C 27 13.5, 30 13, 32 11"
      animate={{ x: [0, 1.6, 0], opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay }}
    />
    <motion.path
      d="M5 21 C 14 21, 20 18, 28 19 C 32 19.5, 34 19, 35 18"
      strokeOpacity="0.85"
      animate={{ x: [0, 2.4, 0], opacity: [1, 0.7, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.4 }}
    />
    <motion.path
      d="M5 28 C 11 28, 14 26, 19 27 C 23 27.8, 26 27.4, 28 26"
      strokeOpacity="0.55"
      animate={{ x: [0, 1.2, 0], opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.8 }}
    />
  </svg>
);

/* ----------------------------------------------------------------
   MUSE — Beleza
   Profile with long hair flowing back. Minimal, elegant line.
---------------------------------------------------------------- */
export const MuseIcon = ({ size = 38, delay = 0 }) => (
  <svg {...baseProps(size)}>
    {/* Hair flowing back */}
    <motion.path
      d="M27 11 C 33 13, 35 18, 34 23 C 33 28, 30 32, 26 33"
      strokeOpacity="0.65"
      animate={{ pathLength: [0.92, 1, 0.92], opacity: [0.6, 0.85, 0.6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    />
    <motion.path
      d="M28 9 C 35 11, 37 17, 36 22 C 35 27, 33 31, 30 34"
      strokeOpacity="0.4"
      animate={{ pathLength: [0.88, 1, 0.88], opacity: [0.35, 0.6, 0.35] }}
      transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.3 }}
    />
    {/* Profile silhouette */}
    <path d="M22 9 C 18 9, 15 12, 15 16 C 15 19, 17 21, 19 22 L 19 26 L 16 27 C 14 27.5, 13 29, 13 31 L 13 34" />
    {/* Subtle eye/lash */}
    <path d="M17 16 L 18.5 16" strokeWidth="1" strokeOpacity="0.7" />
    {/* Lip hint */}
    <path d="M18 19.5 L 19.5 19.5" strokeWidth="1" strokeOpacity="0.55" />
  </svg>
);

/* ----------------------------------------------------------------
   ROCKET — Performance
   Diagonal silhouette with a flame that pulses.
---------------------------------------------------------------- */
export const RocketIcon = ({ size = 38, delay = 0 }) => (
  <svg {...baseProps(size)}>
    {/* Body */}
    <path d="M28 7 C 30 11, 30 17, 26 21 L 19 28 L 12 21 L 19 14 C 23 10, 26 8, 28 7 Z" />
    {/* Window */}
    <circle cx="22.5" cy="17.5" r="2.2" strokeOpacity="0.85" />
    {/* Fin left */}
    <path d="M14 19 L 11 23 L 13 25 L 15 23" strokeOpacity="0.7" />
    {/* Fin right */}
    <path d="M24 27 L 26 30 L 28 28 L 26 26" strokeOpacity="0.7" />
    {/* Flame */}
    <motion.path
      d="M11 22 L 7 28 L 9 27 L 8 31 L 11 27 L 13 30 L 13 26"
      strokeOpacity="0.9"
      animate={{
        opacity: [0.9, 0.45, 0.9],
        scale: [1, 0.92, 1]
      }}
      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ originX: '10px', originY: '28px' }}
    />
    {/* Spark */}
    <motion.circle
      cx="6"
      cy="32"
      r="0.8"
      fill={CYAN}
      stroke="none"
      animate={{ opacity: [0, 1, 0], y: [0, 3, 6] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: delay + 0.4 }}
    />
  </svg>
);

/* Static (non-animated) variants for use inside the orbital rings,
   where the SVG is already moving along its rotation. */
export const WindGlyph = ({ size = 18 }) => (
  <svg {...baseProps(size)}>
    <path d="M5 14 C 12 14, 16 10, 22 12 C 27 13.5, 30 13, 32 11" />
    <path d="M5 21 C 14 21, 20 18, 28 19 C 32 19.5, 34 19, 35 18" strokeOpacity="0.85" />
    <path d="M5 28 C 11 28, 14 26, 19 27 C 23 27.8, 26 27.4, 28 26" strokeOpacity="0.55" />
  </svg>
);

export const MuseGlyph = ({ size = 18 }) => (
  <svg {...baseProps(size)}>
    <path d="M27 11 C 33 13, 35 18, 34 23 C 33 28, 30 32, 26 33" strokeOpacity="0.7" />
    <path d="M22 9 C 18 9, 15 12, 15 16 C 15 19, 17 21, 19 22 L 19 26 L 16 27 C 14 27.5, 13 29, 13 31 L 13 34" />
    <path d="M17 16 L 18.5 16" strokeWidth="1" strokeOpacity="0.7" />
    <path d="M18 19.5 L 19.5 19.5" strokeWidth="1" strokeOpacity="0.55" />
  </svg>
);

export const RocketGlyph = ({ size = 18 }) => (
  <svg {...baseProps(size)}>
    <path d="M28 7 C 30 11, 30 17, 26 21 L 19 28 L 12 21 L 19 14 C 23 10, 26 8, 28 7 Z" />
    <circle cx="22.5" cy="17.5" r="2.2" strokeOpacity="0.85" />
    <path d="M14 19 L 11 23 L 13 25 L 15 23" strokeOpacity="0.7" />
    <path d="M24 27 L 26 30 L 28 28 L 26 26" strokeOpacity="0.7" />
    <path d="M11 22 L 7 28 L 9 27 L 8 31 L 11 27 L 13 30 L 13 26" strokeOpacity="0.85" />
  </svg>
);

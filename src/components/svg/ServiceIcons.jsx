import React from 'react';
import { motion } from 'framer-motion';

const baseProps = {
  fill: 'none',
  stroke: '#83DFE9',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke'
};

const drawTransition = (delay = 0) => ({
  duration: 1.6,
  delay,
  ease: [0.22, 1, 0.36, 1]
});

export const SoftwareIcon = ({ size = 64 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <motion.rect
      x="6" y="12" width="52" height="36" rx="4"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0)}
    />
    <motion.path
      d="M22 30 L 16 36 L 22 42 M 42 30 L 48 36 L 42 42 M 36 26 L 28 46"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0.4)}
    />
    <motion.path
      d="M24 54 L 40 54"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0.8)}
    />
  </svg>
);

export const WebIcon = ({ size = 64 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <motion.circle
      cx="32" cy="32" r="22"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0)}
    />
    <motion.path
      d="M10 32 L 54 32 M 32 10 C 22 22, 22 42, 32 54 M 32 10 C 42 22, 42 42, 32 54"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0.4)}
    />
  </svg>
);

export const DesignIcon = ({ size = 64 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
    <motion.path
      d="M14 50 L 14 18 C 14 14, 17 12, 20 14 L 50 32 C 52 33, 52 36, 50 37 L 36 42 L 28 50 C 26 52, 22 52, 20 50 Z"
      {...baseProps}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={drawTransition(0)}
    />
    <motion.circle
      cx="22" cy="22" r="2"
      fill="#83DFE9"
      stroke="none"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.2, duration: 0.4 }}
    />
  </svg>
);

import React from 'react';
import { motion } from 'framer-motion';
import { SWAN_PATH } from './BrandSwan';

const swanEase = [0.22, 1, 0.36, 1];

const HeroSwan = ({ size = 520 }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-18%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(131,223,233,0.28), transparent 60%)',
          filter: 'blur(28px)',
          pointerEvents: 'none'
        }}
        animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        viewBox="0 0 1024 1024"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, overflow: 'visible', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="hero-swan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="hero-swan-grad" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#83DFE9" />
            <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="hero-swan-fill" cx="50%" cy="55%" r="60%">
            <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        <motion.path
          d={SWAN_PATH}
          fill="url(#hero-swan-fill)"
          fillRule="evenodd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.2, ease: swanEase }}
        />

        <motion.path
          d={SWAN_PATH}
          fill="none"
          stroke="url(#hero-swan-grad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fillRule="evenodd"
          vectorEffect="non-scaling-stroke"
          filter="url(#hero-swan-glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.4, delay: 0.4, ease: swanEase }}
        />
      </svg>
    </div>
  );
};

export default HeroSwan;

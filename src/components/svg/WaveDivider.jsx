import React from 'react';
import { motion } from 'framer-motion';

const WaveDivider = ({ flip = false, opacity = 0.18, height = 120 }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height,
        overflow: 'hidden',
        position: 'relative',
        transform: flip ? 'scaleY(-1)' : 'none',
        pointerEvents: 'none'
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#83DFE9" stopOpacity="0" />
            <stop offset="50%" stopColor="#83DFE9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 60 C 240 20, 480 100, 720 60 C 960 20, 1200 100, 1440 60"
          fill="none"
          stroke="url(#waveStroke)"
          strokeWidth="1.2"
          strokeOpacity={opacity * 5}
          vectorEffect="non-scaling-stroke"
          animate={{
            d: [
              'M0 60 C 240 20, 480 100, 720 60 C 960 20, 1200 100, 1440 60',
              'M0 60 C 240 100, 480 20, 720 60 C 960 100, 1200 20, 1440 60',
              'M0 60 C 240 20, 480 100, 720 60 C 960 20, 1200 100, 1440 60'
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 80 C 240 40, 480 110, 720 80 C 960 50, 1200 110, 1440 80"
          fill="none"
          stroke="#83DFE9"
          strokeWidth="0.8"
          strokeOpacity={opacity * 2.5}
          vectorEffect="non-scaling-stroke"
          animate={{
            d: [
              'M0 80 C 240 40, 480 110, 720 80 C 960 50, 1200 110, 1440 80',
              'M0 80 C 240 110, 480 40, 720 80 C 960 110, 1200 40, 1440 80',
              'M0 80 C 240 40, 480 110, 720 80 C 960 50, 1200 110, 1440 80'
            ]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;

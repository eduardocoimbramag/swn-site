import React from 'react';
import { motion } from 'framer-motion';

const Feather = ({ x, y, rotate, size, delay, duration, opacity = 0.5 }) => (
  <motion.svg
    viewBox="0 0 60 120"
    width={size}
    height={size * 2}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      top: y,
      left: x,
      pointerEvents: 'none',
      overflow: 'visible'
    }}
    initial={{ opacity: 0, y: -40, rotate: rotate - 12 }}
    animate={{
      opacity: [0, opacity, opacity, 0],
      y: [-40, 80, 200, 320],
      rotate: [rotate - 12, rotate, rotate + 8, rotate + 18]
    }}
    transition={{
      duration,
      delay,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 0
    }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`feather-${x}-${y}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Spine */}
    <path
      d="M30 8 C 30 40, 30 80, 30 112"
      stroke={`url(#feather-${x}-${y})`}
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    {/* Barbs */}
    <path
      d="M30 18 C 22 22, 18 30, 16 40
         M30 30 C 20 34, 14 44, 12 56
         M30 44 C 18 48, 12 60, 10 74
         M30 60 C 18 64, 14 76, 14 88
         M30 76 C 20 80, 18 90, 20 100"
      stroke="#83DFE9"
      strokeOpacity="0.55"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M30 18 C 38 22, 42 30, 44 40
         M30 30 C 40 34, 46 44, 48 56
         M30 44 C 42 48, 48 60, 50 74
         M30 60 C 42 64, 46 76, 46 88
         M30 76 C 40 80, 42 90, 40 100"
      stroke="#83DFE9"
      strokeOpacity="0.55"
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </motion.svg>
);

const Feathers = () => {
  const feathers = [
    { x: '8%', y: '-6%', rotate: 18, size: 18, delay: 0, duration: 14, opacity: 0.35 },
    { x: '22%', y: '-10%', rotate: -22, size: 14, delay: 3.2, duration: 18, opacity: 0.28 },
    { x: '68%', y: '-8%', rotate: 28, size: 22, delay: 1.6, duration: 16, opacity: 0.4 },
    { x: '82%', y: '-4%', rotate: -16, size: 16, delay: 5.4, duration: 20, opacity: 0.3 },
    { x: '46%', y: '-12%', rotate: 8, size: 12, delay: 7.2, duration: 22, opacity: 0.25 },
    { x: '90%', y: '-14%', rotate: -28, size: 20, delay: 2.4, duration: 17, opacity: 0.32 }
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {feathers.map((f, i) => (
        <Feather key={i} {...f} />
      ))}
    </div>
  );
};

export default Feathers;

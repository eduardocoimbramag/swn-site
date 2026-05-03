import React from 'react';
import { motion } from 'framer-motion';

const baseStroke = {
  fill: 'none',
  stroke: 'rgba(131, 223, 233, 0.6)',
  strokeWidth: 1,
  vectorEffect: 'non-scaling-stroke'
};

/* -------------------- Dashboard mockup -------------------- */
export const DashboardMockup = () => (
  <svg
    viewBox="0 0 600 380"
    xmlns="http://www.w3.org/2000/svg"
    className="portfolio-mockup portfolio-mockup--dashboard"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="dash-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0B1316" />
        <stop offset="100%" stopColor="#080C0E" />
      </linearGradient>
      <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Frame */}
    <rect x="0" y="0" width="600" height="380" rx="14" fill="url(#dash-bg)" />
    <rect x="0" y="0" width="600" height="380" rx="14" fill="none" stroke="rgba(255,255,255,0.06)" />

    {/* Window chrome */}
    <circle cx="20" cy="22" r="4" fill="rgba(255,255,255,0.16)" />
    <circle cx="34" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    <circle cx="48" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    <line x1="0" y1="44" x2="600" y2="44" stroke="rgba(255,255,255,0.06)" />

    {/* Sidebar */}
    <rect x="0" y="44" width="120" height="336" fill="rgba(255,255,255,0.02)" />
    <line x1="120" y1="44" x2="120" y2="380" stroke="rgba(255,255,255,0.06)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x="14" y={68 + i * 36} width="14" height="14" rx="3" fill="rgba(131,223,233,0.16)" />
        <rect x="36" y={72 + i * 36} width={70 - i * 10} height="6" rx="2" fill="rgba(255,255,255,0.10)" />
      </g>
    ))}

    {/* Header */}
    <rect x="140" y="62" width="120" height="10" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x="140" y="80" width="200" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
    <rect x="510" y="60" width="70" height="20" rx="6" fill="#83DFE9" fillOpacity="0.18" stroke="#83DFE9" strokeOpacity="0.4" />

    {/* KPI cards */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${140 + i * 110}, 110)`}>
        <rect width="100" height="64" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
        <rect x="10" y="12" width="44" height="6" rx="2" fill="rgba(255,255,255,0.20)" />
        <rect x="10" y="28" width="60" height="14" rx="3" fill="#83DFE9" fillOpacity="0.7" />
        <rect x="10" y="48" width="30" height="5" rx="2" fill="rgba(131,223,233,0.4)" />
      </g>
    ))}

    {/* Chart area */}
    <rect x="140" y="190" width="330" height="170" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
    <rect x="156" y="208" width="80" height="6" rx="2" fill="rgba(255,255,255,0.20)" />

    {/* Animated chart line */}
    <motion.path
      d="M 156 320 L 196 296 L 236 308 L 276 268 L 316 280 L 356 240 L 396 252 L 436 220 L 456 232"
      {...baseStroke}
      stroke="#83DFE9"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.path
      d="M 156 320 L 196 296 L 236 308 L 276 268 L 316 280 L 356 240 L 396 252 L 436 220 L 456 232 L 456 350 L 156 350 Z"
      fill="url(#dash-area)"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.4, delay: 1.4, ease: 'easeOut' }}
    />

    {/* Side panel */}
    <rect x="486" y="190" width="100" height="170" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
    <rect x="498" y="206" width="60" height="6" rx="2" fill="rgba(255,255,255,0.20)" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <circle cx="504" cy={234 + i * 28} r="5" fill="rgba(131,223,233,0.4)" />
        <rect x="516" y={230 + i * 28} width={56 - i * 6} height="5" rx="2" fill="rgba(255,255,255,0.14)" />
        <rect x="516" y={241 + i * 28} width={36 - i * 4} height="4" rx="2" fill="rgba(255,255,255,0.06)" />
      </g>
    ))}
  </svg>
);

/* -------------------- Mobile app mockup -------------------- */
export const MobileMockup = () => (
  <svg
    viewBox="0 0 220 420"
    xmlns="http://www.w3.org/2000/svg"
    className="portfolio-mockup portfolio-mockup--mobile"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="phone-frame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A1F22" />
        <stop offset="100%" stopColor="#0A0D0F" />
      </linearGradient>
      <linearGradient id="phone-screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1316" />
        <stop offset="100%" stopColor="#070A0C" />
      </linearGradient>
      <linearGradient id="phone-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Phone body */}
    <rect x="10" y="10" width="200" height="400" rx="32" fill="url(#phone-frame)" stroke="rgba(255,255,255,0.10)" />
    <rect x="18" y="18" width="184" height="384" rx="26" fill="url(#phone-screen)" />

    {/* Notch */}
    <rect x="86" y="22" width="48" height="14" rx="7" fill="#000" />

    {/* Status */}
    <rect x="30" y="48" width="20" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
    <rect x="160" y="48" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

    {/* Greeting */}
    <rect x="30" y="66" width="80" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x="30" y="78" width="120" height="10" rx="2" fill="rgba(255,255,255,0.5)" />

    {/* Featured card */}
    <rect x="30" y="100" width="160" height="86" rx="10" fill="url(#phone-card)" stroke="rgba(131,223,233,0.4)" />
    <rect x="40" y="112" width="40" height="6" rx="2" fill="rgba(0,0,0,0.4)" />
    <rect x="40" y="124" width="80" height="10" rx="2" fill="rgba(0,0,0,0.6)" />
    <motion.rect
      x="40" y="160" width="50" height="14" rx="7"
      fill="#FFFFFF"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 40 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />

    {/* Section label */}
    <rect x="30" y="200" width="60" height="6" rx="2" fill="rgba(255,255,255,0.18)" />

    {/* Tile grid */}
    {[0, 1, 2, 3].map((i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return (
        <g key={i} transform={`translate(${30 + col * 86}, ${218 + row * 78})`}>
          <rect width="74" height="68" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
          <rect x="10" y="10" width="20" height="20" rx="6" fill="rgba(131,223,233,0.18)" />
          <rect x="10" y="38" width="40" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
          <rect x="10" y="48" width="28" height="4" rx="2" fill="rgba(255,255,255,0.10)" />
        </g>
      );
    })}

    {/* Bottom nav */}
    <line x1="18" y1="370" x2="202" y2="370" stroke="rgba(255,255,255,0.06)" />
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={42 + i * 46} cy="386" r="4" fill={i === 0 ? '#83DFE9' : 'rgba(255,255,255,0.3)'} />
    ))}
  </svg>
);

/* -------------------- Institutional site mockup -------------------- */
export const SiteMockup = () => (
  <svg
    viewBox="0 0 600 380"
    xmlns="http://www.w3.org/2000/svg"
    className="portfolio-mockup portfolio-mockup--site"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="site-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1316" />
        <stop offset="100%" stopColor="#070A0C" />
      </linearGradient>
      <linearGradient id="site-hero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Browser frame */}
    <rect x="0" y="0" width="600" height="380" rx="14" fill="url(#site-bg)" />
    <rect x="0" y="0" width="600" height="380" rx="14" fill="none" stroke="rgba(255,255,255,0.06)" />

    {/* Top bar */}
    <circle cx="20" cy="22" r="4" fill="rgba(255,255,255,0.16)" />
    <circle cx="34" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    <circle cx="48" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    <rect x="120" y="14" width="240" height="16" rx="4" fill="rgba(255,255,255,0.05)" />
    <line x1="0" y1="44" x2="600" y2="44" stroke="rgba(255,255,255,0.06)" />

    {/* Site nav */}
    <rect x="32" y="58" width="44" height="10" rx="2" fill="rgba(255,255,255,0.65)" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={350 + i * 50} y="60" width="34" height="6" rx="2" fill="rgba(255,255,255,0.30)" />
    ))}
    <rect x="552" y="54" width="32" height="16" rx="8" fill="#83DFE9" fillOpacity="0.7" />

    {/* Hero block */}
    <rect x="32" y="98" width="536" height="180" rx="10" fill="url(#site-hero)" />
    <rect x="56" y="124" width="60" height="8" rx="2" fill="#83DFE9" fillOpacity="0.7" />
    <rect x="56" y="146" width="280" height="18" rx="3" fill="rgba(255,255,255,0.85)" />
    <rect x="56" y="170" width="220" height="18" rx="3" fill="rgba(255,255,255,0.55)" />
    <rect x="56" y="204" width="320" height="6" rx="2" fill="rgba(255,255,255,0.30)" />
    <rect x="56" y="216" width="280" height="6" rx="2" fill="rgba(255,255,255,0.20)" />
    <motion.rect
      x="56" y="240" width="100" height="22" rx="11"
      fill="#83DFE9"
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
    <rect x="170" y="240" width="80" height="22" rx="11" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />

    {/* Decorative ornament inside hero */}
    <motion.circle
      cx="500" cy="188" r="56"
      fill="none" stroke="rgba(131,223,233,0.45)" strokeWidth="1"
      strokeDasharray="3 6"
      vectorEffect="non-scaling-stroke"
      animate={{ rotate: 360 }}
      style={{ originX: '500px', originY: '188px' }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
    />
    <circle cx="500" cy="188" r="22" fill="rgba(131,223,233,0.18)" stroke="rgba(131,223,233,0.5)" />

    {/* Three feature cards */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${32 + i * 180}, 296)`}>
        <rect width="168" height="64" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" />
        <rect x="14" y="14" width="16" height="16" rx="4" fill="rgba(131,223,233,0.4)" />
        <rect x="14" y="38" width="100" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
        <rect x="14" y="48" width="80" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
      </g>
    ))}
  </svg>
);

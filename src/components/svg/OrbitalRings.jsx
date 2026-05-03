import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Each ring = one pillar (Sutileza, Beleza, Performance).
 * Hovering a ring (or receiving an external `active` from the pillars)
 * highlights it and reveals a tooltip naming the concept.
 */

const RING_DEFS = {
  sutileza:    { rx: 180, ry: 60,  color: '#83DFE9', dir:  1, duration: 38, satellite: { angle: 0 } },
  beleza:      { rx: 150, ry: 150, color: '#FFFFFF', dir: -1, duration: 52, satellite: null },
  performance: { rx: 100, ry: 180, color: '#83DFE9', dir:  1, duration: 24, satellite: { angle: 270 } }
};

const Ring = ({ pKey, def, isActive, onActivate, onDeactivate }) => {
  const inactiveOpacity = def.color === '#FFFFFF' ? 0.18 : 0.45;
  const activeOpacity   = 0.95;

  return (
    <g>
      {/* Hit area — invisible thicker stroke for easier hover */}
      <ellipse
        cx="200"
        cy="200"
        rx={def.rx}
        ry={def.ry}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
        onMouseEnter={() => onActivate(pKey)}
        onMouseLeave={onDeactivate}
      />

      <motion.g
        animate={{ rotate: 360 * def.dir }}
        transition={{ duration: def.duration, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '200px', originY: '200px', pointerEvents: 'none' }}
      >
        <motion.ellipse
          cx="200"
          cy="200"
          rx={def.rx}
          ry={def.ry}
          fill="none"
          stroke={def.color}
          strokeWidth={isActive ? 1.6 : 1}
          strokeDasharray={def.color === '#FFFFFF' ? '2 6' : 'none'}
          vectorEffect="non-scaling-stroke"
          animate={{ strokeOpacity: isActive ? activeOpacity : inactiveOpacity }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {def.satellite && (
          <motion.circle
            cx={200 + Math.cos((def.satellite.angle * Math.PI) / 180) * def.rx}
            cy={200 + Math.sin((def.satellite.angle * Math.PI) / 180) * def.ry}
            r={isActive ? 4 : 3}
            fill={def.color}
            animate={{ opacity: isActive ? 1 : 0.85 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.g>
    </g>
  );
};

const OrbitalRings = ({
  size = 360,
  pillars = [],
  active = null,
  onActiveChange = () => {}
}) => {
  const activePillar = pillars.find((p) => p.key === active);

  return (
    <div
      className="orbital-wrap"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orbCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#83DFE9" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="60" fill="url(#orbCenter)" />

        {Object.entries(RING_DEFS).map(([pKey, def]) => (
          <Ring
            key={pKey}
            pKey={pKey}
            def={def}
            isActive={active === pKey}
            onActivate={onActiveChange}
            onDeactivate={() => onActiveChange(null)}
          />
        ))}

        <motion.circle
          cx="200"
          cy="200"
          r="6"
          fill="#83DFE9"
          animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.4, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '200px', originY: '200px' }}
        />
      </svg>

      <AnimatePresence mode="wait">
        {activePillar && (
          <motion.div
            key={activePillar.key}
            className="orbital-tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="orbital-tooltip-title">{activePillar.title}</span>
            <span className="orbital-tooltip-text">{activePillar.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrbitalRings;

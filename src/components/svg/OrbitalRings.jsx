import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WindGlyph, MuseGlyph, RocketGlyph } from './PillarIcons';

/**
 * Each ring = one pillar (Sutileza, Beleza, Performance).
 * Hovering a ring (or receiving an external `active` from the pillars)
 * highlights it and reveals a tooltip naming the concept.
 *
 * Each ring carries a glyph chip representing its pillar, riding the
 * orbit so the metaphor reads at a glance.
 */

const CENTER = 280; // viewBox is 560x560

const RING_DEFS = {
  sutileza: {
    rx: 240,
    ry: 90,
    color: '#83DFE9',
    dir: 1,
    duration: 38,
    /* anchor angle (deg) where the chip sits on the ellipse */
    chipAngle: 0,
    Glyph: WindGlyph
  },
  beleza: {
    rx: 200,
    ry: 200,
    color: '#FFFFFF',
    dir: -1,
    duration: 52,
    chipAngle: 270,
    Glyph: MuseGlyph
  },
  performance: {
    rx: 130,
    ry: 240,
    color: '#83DFE9',
    dir: 1,
    duration: 24,
    chipAngle: 90,
    Glyph: RocketGlyph
  }
};

const Ring = ({ pKey, def, isActive, onActivate, onDeactivate }) => {
  const inactiveOpacity = def.color === '#FFFFFF' ? 0.18 : 0.45;
  const activeOpacity = 0.95;

  /* Chip position on the ellipse */
  const rad = (def.chipAngle * Math.PI) / 180;
  const chipX = CENTER + Math.cos(rad) * def.rx;
  const chipY = CENTER + Math.sin(rad) * def.ry;

  return (
    <g>
      {/* Hit area — invisible thicker stroke for easier hover */}
      <ellipse
        cx={CENTER}
        cy={CENTER}
        rx={def.rx}
        ry={def.ry}
        fill="none"
        stroke="transparent"
        strokeWidth="22"
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
        onMouseEnter={() => onActivate(pKey)}
        onMouseLeave={onDeactivate}
      />

      <motion.g
        animate={{ rotate: 360 * def.dir }}
        transition={{ duration: def.duration, repeat: Infinity, ease: 'linear' }}
        style={{ originX: `${CENTER}px`, originY: `${CENTER}px`, pointerEvents: 'none' }}
      >
        <motion.ellipse
          cx={CENTER}
          cy={CENTER}
          rx={def.rx}
          ry={def.ry}
          fill="none"
          stroke={def.color}
          strokeWidth={isActive ? 1.8 : 1}
          strokeDasharray={def.color === '#FFFFFF' ? '2 6' : 'none'}
          vectorEffect="non-scaling-stroke"
          animate={{ strokeOpacity: isActive ? activeOpacity : inactiveOpacity }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Chip riding the orbit */}
        <g
          transform={`translate(${chipX} ${chipY})`}
          style={{ pointerEvents: 'none' }}
        >
          {/* Counter-rotate the chip so the glyph stays upright */}
          <motion.g
            animate={{ rotate: -360 * def.dir }}
            transition={{ duration: def.duration, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '0px', originY: '0px' }}
          >
            {/* Outer halo */}
            <motion.circle
              r="22"
              fill="rgba(131, 223, 233, 0.18)"
              animate={{
                r: isActive ? [22, 26, 22] : [20, 22, 20],
                opacity: isActive ? 0.55 : 0.3
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Chip background */}
            <circle
              r="18"
              fill="#06090B"
              stroke="#83DFE9"
              strokeWidth={isActive ? 1.6 : 1}
              strokeOpacity={isActive ? 1 : 0.7}
              vectorEffect="non-scaling-stroke"
            />
            {/* Glyph centered on chip — the icon viewBox is 0..40, so we center via translate(-9 -9) for size=18 */}
            <g transform="translate(-9 -9)">
              <def.Glyph size={18} />
            </g>
          </motion.g>
        </g>
      </motion.g>
    </g>
  );
};

const OrbitalRings = ({
  size = 560,
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
        viewBox="0 0 560 560"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orbCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#83DFE9" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r="90" fill="url(#orbCenter)" />

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
          cx={CENTER}
          cy={CENTER}
          r="8"
          fill="#83DFE9"
          animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.4, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: `${CENTER}px`, originY: `${CENTER}px` }}
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

import React, { useId } from 'react';
import { motion } from 'framer-motion';

const swanEase = [0.22, 1, 0.36, 1];
const inView = { once: true, margin: '-40px' };

const baseStroke = {
  fill: 'none',
  stroke: 'rgba(131, 223, 233, 0.6)',
  strokeWidth: 1,
  vectorEffect: 'non-scaling-stroke'
};

/* Unique, url(#…)-safe id prefix — the same mockup can render several times
   on one page, and duplicate gradient ids break rendering. */
const useSvgId = () => useId().replace(/:/g, '');

/* Default entrance: fade + slight offset, triggered when scrolled into view */
const reveal = (delay = 0, y = 10) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: inView,
  transition: { duration: 0.8, delay, ease: swanEase }
});

/* Stroke drawn via pathLength — also used to make bars "grow" */
const draw = (delay = 0, duration = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: inView,
  transition: { duration, delay, ease: swanEase }
});

/* Spring pop — badges and confirmations */
const pop = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: inView,
  transition: { type: 'spring', stiffness: 400, damping: 15, delay }
});

/* -------------------- Shared pieces -------------------- */

const AvatarGradient = ({ id }) => (
  <radialGradient id={id} cx="35%" cy="30%" r="80%">
    <stop offset="0%" stopColor="#B7ECF1" />
    <stop offset="60%" stopColor="#83DFE9" />
    <stop offset="100%" stopColor="#3F9098" />
  </radialGradient>
);

/* 600×380 window: background, border, traffic lights and optional address bar */
const WindowFrame = ({ uid, address = false }) => (
  <>
    <defs>
      <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1316" />
        <stop offset="100%" stopColor="#070A0C" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="600" height="380" rx="14" fill={`url(#${uid}-bg)`} />
    <rect x="0" y="0" width="600" height="380" rx="14" fill="none" stroke="rgba(255,255,255,0.06)" />
    <circle cx="20" cy="22" r="4" fill="rgba(255,255,255,0.16)" />
    <circle cx="34" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    <circle cx="48" cy="22" r="4" fill="rgba(255,255,255,0.10)" />
    {address && <rect x="120" y="14" width="240" height="16" rx="4" fill="rgba(255,255,255,0.05)" />}
    <line x1="0" y1="44" x2="600" y2="44" stroke="rgba(255,255,255,0.06)" />
  </>
);

/* 220×420 phone: body, screen and notch */
const PhoneFrame = ({ uid }) => (
  <>
    <defs>
      <linearGradient id={`${uid}-frame`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A1F22" />
        <stop offset="100%" stopColor="#0A0D0F" />
      </linearGradient>
      <linearGradient id={`${uid}-screen`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B1316" />
        <stop offset="100%" stopColor="#070A0C" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="200" height="400" rx="32" fill={`url(#${uid}-frame)`} stroke="rgba(255,255,255,0.10)" />
    <rect x="18" y="18" width="184" height="384" rx="26" fill={`url(#${uid}-screen)`} />
    <rect x="86" y="22" width="48" height="14" rx="7" fill="#000" />
  </>
);

/* Icons (24×24 grid, Feather-style strokes) — placed with a <g transform> */
const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';
const COMMENT_PATH =
  'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z';
const SEND_PATH = 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z';
const BOOKMARK_PATH = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';
const USER_PLUS_PATH = 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M20 8v6M23 11h-6';

const iconStroke = {
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

/* -------------------- Dashboard mockup (SaaS) -------------------- */
export const DashboardMockup = () => {
  const uid = useSvgId();

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--dashboard"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B1316" />
          <stop offset="100%" stopColor="#080C0E" />
        </linearGradient>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Frame */}
      <rect x="0" y="0" width="600" height="380" rx="14" fill={`url(#${uid}-bg)`} />
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
        viewport={inView}
        transition={{ duration: 2.2, ease: swanEase }}
      />
      <motion.path
        d="M 156 320 L 196 296 L 236 308 L 276 268 L 316 280 L 356 240 L 396 252 L 436 220 L 456 232 L 456 350 L 156 350 Z"
        fill={`url(#${uid}-area)`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
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
};

/* -------------------- Mobile app mockup -------------------- */
export const MobileMockup = () => {
  const uid = useSvgId();

  return (
    <svg
      viewBox="0 0 220 420"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--mobile"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <PhoneFrame uid={uid} />

      {/* Status */}
      <rect x="30" y="48" width="20" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="160" y="48" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

      {/* Greeting */}
      <rect x="30" y="66" width="80" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
      <rect x="30" y="78" width="120" height="10" rx="2" fill="rgba(255,255,255,0.5)" />

      {/* Featured card */}
      <rect x="30" y="100" width="160" height="86" rx="10" fill={`url(#${uid}-card)`} stroke="rgba(131,223,233,0.4)" />
      <rect x="40" y="112" width="40" height="6" rx="2" fill="rgba(0,0,0,0.4)" />
      <rect x="40" y="124" width="80" height="10" rx="2" fill="rgba(0,0,0,0.6)" />
      <motion.rect
        x="40" y="160" width="50" height="14" rx="7"
        fill="#FFFFFF"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 40 }}
        viewport={inView}
        transition={{ duration: 0.8, delay: 0.6, ease: swanEase }}
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
};

/* -------------------- Institutional site mockup -------------------- */
export const SiteMockup = () => {
  const uid = useSvgId();

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--site"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-hero`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Browser frame + top bar */}
      <WindowFrame uid={uid} address />

      {/* Site nav */}
      <rect x="32" y="58" width="44" height="10" rx="2" fill="rgba(255,255,255,0.65)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={350 + i * 50} y="60" width="34" height="6" rx="2" fill="rgba(255,255,255,0.30)" />
      ))}
      <rect x="552" y="54" width="32" height="16" rx="8" fill="#83DFE9" fillOpacity="0.7" />

      {/* Hero block */}
      <rect x="32" y="98" width="536" height="180" rx="10" fill={`url(#${uid}-hero)`} />
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
        viewport={inView}
        transition={{ duration: 0.7, delay: 0.6, ease: swanEase }}
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
};

/* -------------------- Landing page mockup -------------------- */
/* Centered hero, no menu, a single CTA being clicked and result cards */
export const LandingMockup = () => {
  const uid = useSvgId();

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--landing"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-spot`} cx="50%" cy="28%" r="62%">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
        </linearGradient>
        <AvatarGradient id={`${uid}-avatar`} />
      </defs>

      <WindowFrame uid={uid} address />
      <rect x="1" y="45" width="598" height="320" fill={`url(#${uid}-spot)`} />

      {/* Minimal nav — a landing page doesn't distract with menus */}
      <rect x="32" y="60" width="44" height="10" rx="2" fill="rgba(255,255,255,0.65)" />
      <rect x="504" y="55" width="64" height="20" rx="10" fill="none" stroke="rgba(131,223,233,0.5)" />
      <rect x="518" y="63" width="36" height="4" rx="2" fill="rgba(131,223,233,0.7)" />

      {/* Eyebrow */}
      <rect x="250" y="92" width="100" height="18" rx="9" fill="rgba(131,223,233,0.08)" stroke="rgba(131,223,233,0.4)" />
      <circle cx="263" cy="101" r="3" fill="#83DFE9" />
      <rect x="272" y="98.5" width="66" height="5" rx="2" fill="rgba(131,223,233,0.7)" />

      {/* Headline + subtitle */}
      <rect x="146" y="124" width="308" height="20" rx="4" fill="rgba(255,255,255,0.88)" />
      <rect x="194" y="152" width="212" height="20" rx="4" fill="rgba(255,255,255,0.55)" />
      <rect x="178" y="186" width="244" height="6" rx="2" fill="rgba(255,255,255,0.28)" />
      <rect x="212" y="198" width="176" height="6" rx="2" fill="rgba(255,255,255,0.18)" />

      {/* Single CTA with a pulsing halo */}
      <rect className="mk-ping" x="234" y="218" width="132" height="32" rx="16" fill="none" stroke="#83DFE9" strokeOpacity="0.6" />
      <motion.g
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={inView}
        transition={{ duration: 0.7, delay: 0.3, ease: swanEase }}
      >
        <rect x="240" y="222" width="120" height="24" rx="12" fill="#83DFE9" />
        <rect x="268" y="231.5" width="64" height="5" rx="2" fill="rgba(0,0,0,0.5)" />
      </motion.g>

      {/* Social proof */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={258 + i * 13} cy="274" r="8" fill={`url(#${uid}-avatar)`} stroke="#0B1316" strokeWidth="2" />
      ))}
      <rect x="312" y="268" width="44" height="5" rx="2" fill="rgba(131,223,233,0.6)" />
      <rect x="312" y="277" width="32" height="4" rx="2" fill="rgba(255,255,255,0.2)" />

      {/* Floating card — new lead */}
      <motion.g {...reveal(1.0, 12)}>
        <rect x="30" y="300" width="148" height="52" rx="12" fill="#0D1518" stroke="rgba(255,255,255,0.08)" />
        <circle cx="54" cy="326" r="11" fill="rgba(131,223,233,0.14)" stroke="rgba(131,223,233,0.5)" />
        <path d="M 49 326 L 53 330 L 60 322" fill="none" stroke="#83DFE9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="74" y="316" width="78" height="6" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="74" y="328" width="52" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
      </motion.g>

      {/* Floating card — conversion rate going up */}
      <motion.g {...reveal(1.2, 12)}>
        <rect x="430" y="286" width="140" height="68" rx="12" fill="#0D1518" stroke="rgba(131,223,233,0.3)" />
        <rect x="444" y="299" width="50" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="444" y="311" width="46" height="13" rx="3" fill="#83DFE9" fillOpacity="0.85" />
        <path d="M 444 342 L 466 338 L 488 340 L 510 330 L 532 332 L 556 316 L 556 346 L 444 346 Z" fill={`url(#${uid}-area)`} />
        <motion.path
          d="M 444 342 L 466 338 L 488 340 L 510 330 L 532 332 L 556 316"
          fill="none"
          stroke="#83DFE9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...draw(1.5, 1.2)}
        />
      </motion.g>

      {/* Cursor gliding to the CTA */}
      <motion.g
        initial={{ opacity: 0, x: 60, y: 46 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={inView}
        transition={{ duration: 1.1, delay: 0.7, ease: swanEase }}
      >
        <path
          d="M 336 236 L 336 256 L 341 251.5 L 344.5 259.5 L 348 258 L 344.5 250 L 351 250 Z"
          fill="#FFFFFF"
          stroke="#0B1316"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
};

/* -------------------- E-commerce mockup -------------------- */
const ProductShape = ({ shape, cx, cy, fill }) => {
  const stroke = 'rgba(131,223,233,0.5)';
  const cap = 'rgba(131,223,233,0.6)';

  if (shape === 'bottle') {
    return (
      <g>
        <rect x={cx - 14} y={cy - 22} width="28" height="48" rx="8" fill={fill} stroke={stroke} />
        <rect x={cx - 6} y={cy - 32} width="12" height="11" rx="2" fill={cap} />
      </g>
    );
  }
  if (shape === 'jar') {
    return (
      <g>
        <rect x={cx - 22} y={cy - 10} width="44" height="34" rx="9" fill={fill} stroke={stroke} />
        <rect x={cx - 25} y={cy - 19} width="50" height="10" rx="3" fill={cap} />
      </g>
    );
  }
  if (shape === 'tube') {
    return (
      <g>
        <path
          d={`M ${cx - 13} ${cy - 26} L ${cx + 13} ${cy - 26} L ${cx + 9} ${cy + 20} L ${cx - 9} ${cy + 20} Z`}
          fill={fill}
          stroke={stroke}
          strokeLinejoin="round"
        />
        <rect x={cx - 7} y={cy + 20} width="14" height="9" rx="2" fill={cap} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r="26" fill={fill} stroke={stroke} />
      <circle cx={cx} cy={cy} r="15" fill="none" stroke="rgba(255,255,255,0.35)" />
    </g>
  );
};

const PRODUCTS = [
  { shape: 'bottle' },
  { shape: 'jar', active: true },
  { shape: 'tube' },
  { shape: 'compact' }
];

export const StoreMockup = () => {
  const uid = useSvgId();
  const productFill = `url(#${uid}-product)`;

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--store"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-banner`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={`${uid}-product`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <WindowFrame uid={uid} address />

      {/* Store header */}
      <rect x="32" y="60" width="44" height="10" rx="2" fill="rgba(255,255,255,0.65)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={214 + i * 48} y="62.5" width="34" height="5" rx="2" fill="rgba(255,255,255,0.28)" />
      ))}
      <circle cx="512" cy="64" r="6" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" />
      <path d="M 516.5 68.5 L 520 72" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 537 60 L 555 60 L 553 74 L 539 74 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 541 60 C 541 53, 551 53, 551 60" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />

      {/* Bag badge — pops when the product is added */}
      <motion.g {...pop(1.5)}>
        <circle cx="557" cy="57" r="7" fill="#83DFE9" />
        <rect x="555.8" y="54" width="2.4" height="6" rx="1" fill="rgba(0,0,0,0.65)" />
      </motion.g>

      {/* Promo banner */}
      <rect x="32" y="88" width="536" height="64" rx="10" fill={`url(#${uid}-banner)`} stroke="rgba(131,223,233,0.18)" />
      <rect x="52" y="103" width="62" height="6" rx="2" fill="#83DFE9" fillOpacity="0.75" />
      <rect x="52" y="116" width="190" height="12" rx="3" fill="rgba(255,255,255,0.8)" />
      <rect x="52" y="134" width="128" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="470" y="104" width="26" height="40" rx="7" fill={productFill} stroke="rgba(131,223,233,0.5)" />
      <rect x="477" y="97" width="12" height="9" rx="2" fill="rgba(131,223,233,0.6)" />
      <rect x="506" y="118" width="38" height="26" rx="7" fill={productFill} stroke="rgba(131,223,233,0.5)" />
      <rect x="503" y="112" width="44" height="8" rx="3" fill="rgba(131,223,233,0.6)" />

      {/* Product grid */}
      {PRODUCTS.map((p, i) => {
        const x = 32 + i * 137;
        return (
          <motion.g key={p.shape} {...reveal(0.2 + i * 0.12, 14)}>
            <rect
              x={x} y="166" width="125" height="194" rx="10"
              fill="rgba(255,255,255,0.03)"
              stroke={p.active ? 'rgba(131,223,233,0.45)' : 'rgba(255,255,255,0.06)'}
            />
            <rect x={x + 8} y="174" width="109" height="100" rx="8" fill="rgba(131,223,233,0.05)" />
            <ProductShape shape={p.shape} cx={x + 62.5} cy={224} fill={productFill} />
            <rect x={x + 10} y="286" width="78" height="6" rx="2" fill="rgba(255,255,255,0.5)" />
            <rect x={x + 10} y="298" width="54" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
            <rect x={x + 10} y="322" width="42" height="11" rx="3" fill="#83DFE9" fillOpacity={p.active ? 0.95 : 0.7} />
            {p.active && (
              <circle className="mk-ping" cx={x + 103} cy="327" r="15" fill="none" stroke="#83DFE9" strokeOpacity="0.6" />
            )}
            <circle
              cx={x + 103} cy="327" r="12"
              fill={p.active ? '#83DFE9' : 'rgba(131,223,233,0.1)'}
              stroke={p.active ? 'none' : 'rgba(131,223,233,0.45)'}
            />
            <path
              d={`M ${x + 98} 327 L ${x + 108} 327 M ${x + 103} 322 L ${x + 103} 332`}
              stroke={p.active ? '#0B1316' : '#83DFE9'}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </motion.g>
        );
      })}
    </svg>
  );
};

/* -------------------- CRM mockup -------------------- */
/* Kanban pipeline — a deal slides from "Proposal" to "Won" */
const DealCard = ({ x, y, avatar, highlight = false }) => (
  <g>
    <rect
      x={x} y={y} width="101" height="50" rx="8"
      fill={highlight ? 'rgba(131,223,233,0.08)' : 'rgba(255,255,255,0.04)'}
      stroke={highlight ? 'rgba(131,223,233,0.55)' : 'rgba(255,255,255,0.07)'}
    />
    <circle cx={x + 16} cy={y + 16} r="7" fill={avatar} />
    <rect x={x + 29} y={y + 11} width="52" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
    <rect x={x + 29} y={y + 20} width="34" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x={x + 10} y={y + 34} width="40" height="6" rx="2" fill="#83DFE9" fillOpacity="0.7" />
    <rect x={x + 64} y={y + 32} width="27" height="10" rx="5" fill="rgba(255,255,255,0.06)" />
  </g>
);

const PIPELINE = [
  { cards: 3, progress: 0.25 },
  { cards: 2, progress: 0.45 },
  { cards: 1, progress: 0.65 },
  { cards: 1, progress: 0.95 }
];
const COL_W = 117;
const colX = (i) => 76 + i * 129;
const dealY = (j) => 138 + j * 60;

export const CrmMockup = () => {
  const uid = useSvgId();
  const avatar = `url(#${uid}-avatar)`;

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--crm"
      aria-hidden="true"
    >
      <defs>
        <AvatarGradient id={`${uid}-avatar`} />
      </defs>

      <WindowFrame uid={uid} />

      {/* Navigation rail */}
      <path d="M 0 44 H 56 V 380 H 14 A 14 14 0 0 1 0 366 Z" fill="rgba(255,255,255,0.02)" />
      <line x1="56" y1="44" x2="56" y2="380" stroke="rgba(255,255,255,0.06)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="18" y={64 + i * 36} width="20" height="20" rx="6"
          fill={i === 1 ? 'rgba(131,223,233,0.55)' : 'rgba(255,255,255,0.08)'}
        />
      ))}

      {/* Cabeçalho */}
      <rect x="76" y="62" width="96" height="10" rx="2" fill="rgba(255,255,255,0.7)" />
      <rect x="76" y="80" width="150" height="6" rx="2" fill="rgba(255,255,255,0.14)" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={452 + i * 14} cy="71" r="9" fill={avatar} stroke="#0B1316" strokeWidth="2" />
      ))}
      <rect x="500" y="60" width="80" height="22" rx="11" fill="#83DFE9" fillOpacity="0.9" />
      <path d="M 514 71 L 522 71 M 518 67 L 518 75" stroke="#0B1316" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="528" y="68.5" width="40" height="5" rx="2" fill="rgba(0,0,0,0.5)" />

      {/* Pipeline columns */}
      {PIPELINE.map((col, i) => {
        const x = colX(i);
        return (
          <g key={i}>
            <rect x={x} y="104" width={COL_W} height="260" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" />
            <rect x={x + 10} y="115" width="48" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x={x + COL_W - 30} y="111" width="20" height="13" rx="6.5" fill="rgba(255,255,255,0.06)" />
            <rect x={x + COL_W - 23} y="115.5" width="6" height="4" rx="1" fill="rgba(255,255,255,0.4)" />
            <rect x={x + 10} y="128" width={COL_W - 20} height="2" rx="1" fill="#83DFE9" fillOpacity={col.progress} />
            {Array.from({ length: col.cards }).map((_, j) => (
              <motion.g key={j} {...reveal(0.15 + i * 0.1 + j * 0.06, 8)}>
                <DealCard x={x + 8} y={dealY(j)} avatar={avatar} />
              </motion.g>
            ))}
          </g>
        );
      })}

      {/* Deal moving from "Proposal" to "Won" — rendered in its source column so
          there's no initial transform (framer applies SVG transforms only after measuring) */}
      <motion.g
        initial={{ x: 0 }}
        whileInView={{ x: colX(3) - colX(2) }}
        viewport={inView}
        transition={{ duration: 1.3, delay: 0.9, ease: swanEase }}
      >
        <DealCard x={colX(2) + 8} y={dealY(1)} avatar={avatar} highlight />
      </motion.g>
      <motion.g {...pop(2.1)}>
        <circle cx="568" cy="200" r="9" fill="#83DFE9" />
        <path d="M 563.5 200 L 566.8 203.3 L 572.5 197.5" fill="none" stroke="#0B1316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
};

/* -------------------- Chatbot mockup -------------------- */
/* Phone conversation: question, quick replies and the bot typing */
export const ChatbotMockup = () => {
  const uid = useSvgId();

  return (
    <svg
      viewBox="0 0 220 420"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--chat"
      aria-hidden="true"
    >
      <defs>
        <AvatarGradient id={`${uid}-avatar`} />
      </defs>

      <PhoneFrame uid={uid} />

      {/* Status */}
      <rect x="30" y="48" width="20" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="160" y="48" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

      {/* Header: assistant online */}
      <circle cx="44" cy="78" r="12" fill={`url(#${uid}-avatar)`} />
      <path
        d="M 44 71 L 45.8 76.2 L 51 78 L 45.8 79.8 L 44 85 L 42.2 79.8 L 37 78 L 42.2 76.2 Z"
        fill="#0B1316"
        fillOpacity="0.75"
      />
      <rect x="62" y="70" width="62" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
      <circle className="mk-blink" cx="65" cy="85" r="2.5" fill="#83DFE9" />
      <rect x="71" y="83" width="34" height="4" rx="2" fill="rgba(131,223,233,0.5)" />
      <line x1="18" y1="100" x2="202" y2="100" stroke="rgba(255,255,255,0.06)" />

      {/* Bot */}
      <motion.g {...reveal(0.3, 8)}>
        <rect x="28" y="112" width="124" height="36" rx="12" fill="rgba(255,255,255,0.06)" />
        <rect x="39" y="122" width="100" height="5" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="39" y="132" width="72" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      </motion.g>

      {/* Customer */}
      <motion.g {...reveal(0.7, 8)}>
        <rect x="100" y="156" width="92" height="24" rx="12" fill="#83DFE9" fillOpacity="0.88" />
        <rect x="111" y="165.5" width="68" height="5" rx="2" fill="rgba(0,0,0,0.45)" />
      </motion.g>

      {/* Bot with quick replies */}
      <motion.g {...reveal(1.1, 8)}>
        <rect x="28" y="188" width="136" height="26" rx="12" fill="rgba(255,255,255,0.06)" />
        <rect x="39" y="198.5" width="108" height="5" rx="2" fill="rgba(255,255,255,0.45)" />
        {[[28, 46], [80, 54], [140, 42]].map(([x, w]) => (
          <g key={x}>
            <rect x={x} y="220" width={w} height="18" rx="9" fill="rgba(131,223,233,0.06)" stroke="rgba(131,223,233,0.5)" />
            <rect x={x + 10} y="227" width={w - 20} height="4" rx="2" fill="rgba(131,223,233,0.75)" />
          </g>
        ))}
      </motion.g>

      {/* Customer picks an option */}
      <motion.g {...reveal(1.5, 8)}>
        <rect x="118" y="248" width="74" height="24" rx="12" fill="#83DFE9" fillOpacity="0.88" />
        <rect x="129" y="257.5" width="52" height="5" rx="2" fill="rgba(0,0,0,0.45)" />
      </motion.g>

      {/* Bot typing */}
      <motion.g {...reveal(1.9, 8)}>
        <rect x="28" y="282" width="52" height="26" rx="12" fill="rgba(255,255,255,0.06)" />
        <g className="mk-typing">
          <circle cx="42" cy="295" r="3" fill="rgba(255,255,255,0.7)" />
          <circle cx="54" cy="295" r="3" fill="rgba(255,255,255,0.7)" />
          <circle cx="66" cy="295" r="3" fill="rgba(255,255,255,0.7)" />
        </g>
      </motion.g>

      {/* Message field */}
      <rect x="28" y="344" width="132" height="28" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <rect x="42" y="356" width="72" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
      <circle cx="178" cy="358" r="14" fill="#83DFE9" />
      <path d="M 172 358 L 184 358 M 179 353 L 184 358 L 179 363" fill="none" stroke="#0B1316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="388" width="60" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
};

/* -------------------- Social media mockup -------------------- */
/* Featured post, growth metrics, notifications and a content grid */
const NOTIFICATIONS = [
  { y: 62, icon: 'heart', title: 84, meta: 52 },
  { y: 110, icon: 'comment', title: 72, meta: 58 },
  { y: 158, icon: 'follow', title: 60, meta: 64 }
];

const NotificationIcon = ({ icon, x, y }) => {
  if (icon === 'heart') {
    return (
      <g transform={`translate(${x}, ${y}) scale(0.5)`}>
        <path d={HEART_PATH} fill="#83DFE9" />
      </g>
    );
  }
  if (icon === 'comment') {
    return (
      <g transform={`translate(${x}, ${y}) scale(0.5)`}>
        <path d={COMMENT_PATH} {...iconStroke} stroke="#83DFE9" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y}) scale(0.5)`}>
      <path d={USER_PLUS_PATH} {...iconStroke} stroke="#83DFE9" />
      <circle cx="8.5" cy="7" r="4" {...iconStroke} stroke="#83DFE9" />
    </g>
  );
};

export const SocialMockup = () => {
  const uid = useSvgId();
  const cardFill = `url(#${uid}-card)`;
  const photoFill = `url(#${uid}-photo)`;

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--social"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F181B" />
          <stop offset="100%" stopColor="#080C0E" />
        </linearGradient>
        <linearGradient id={`${uid}-photo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B7ECF1" />
          <stop offset="100%" stopColor="#3F9098" />
        </linearGradient>
        <AvatarGradient id={`${uid}-avatar`} />
      </defs>

      {/* Follower growth */}
      <motion.g {...reveal(0.5, 12)}>
        <rect x="24" y="62" width="156" height="134" rx="14" fill={cardFill} stroke="rgba(255,255,255,0.08)" />
        <rect x="40" y="80" width="62" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="40" y="93" width="64" height="14" rx="3" fill="#83DFE9" fillOpacity="0.9" />
        <rect x="112" y="94" width="50" height="12" rx="6" fill="rgba(131,223,233,0.1)" stroke="rgba(131,223,233,0.4)" />
        <path d="M 120 103 L 124 97 L 128 103" fill="none" stroke="#83DFE9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="132" y="98" width="22" height="4" rx="2" fill="rgba(131,223,233,0.7)" />
        {[18, 26, 22, 34, 42, 38, 56].map((h, i) => (
          <motion.line
            key={i}
            x1={46 + i * 18} y1="182" x2={46 + i * 18} y2={182 - h}
            stroke="#83DFE9"
            strokeOpacity={i === 6 ? 0.95 : 0.35}
            strokeWidth="10"
            {...draw(0.8 + i * 0.07, 0.9)}
          />
        ))}
      </motion.g>

      {/* Engagement */}
      <motion.g {...reveal(0.7, 12)}>
        <rect x="24" y="210" width="156" height="92" rx="14" fill={cardFill} stroke="rgba(255,255,255,0.08)" />
        <circle cx="62" cy="256" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <g transform="rotate(-90 62 256)">
          <motion.circle
            cx="62" cy="256" r="22"
            fill="none"
            stroke="#83DFE9"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 0.72, opacity: 1 }}
            viewport={inView}
            transition={{ duration: 1.4, delay: 1.0, ease: swanEase }}
          />
        </g>
        <rect x="54" y="253" width="16" height="6" rx="2" fill="rgba(255,255,255,0.75)" />
        <rect x="98" y="238" width="62" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="98" y="250" width="46" height="10" rx="2" fill="rgba(255,255,255,0.8)" />
        <rect x="98" y="266" width="56" height="4" rx="2" fill="rgba(131,223,233,0.55)" />
      </motion.g>

      {/* Featured post */}
      <motion.g {...reveal(0.2, 16)}>
        <rect x="200" y="18" width="200" height="344" rx="18" fill={cardFill} stroke="rgba(255,255,255,0.1)" />
        <circle cx="226" cy="44" r="12" fill="none" stroke={`url(#${uid}-ring)`} strokeWidth="2" />
        <circle cx="226" cy="44" r="8.5" fill={`url(#${uid}-avatar)`} />
        <rect x="246" y="37" width="64" height="6" rx="2" fill="rgba(255,255,255,0.65)" />
        <rect x="246" y="48" width="40" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={370 + i * 6} cy="44" r="1.6" fill="rgba(255,255,255,0.5)" />
        ))}

        {/* Image */}
        <rect x="212" y="66" width="176" height="176" rx="10" fill={photoFill} />
        <circle cx="330" cy="120" r="22" fill="rgba(131,223,233,0.16)" stroke="rgba(131,223,233,0.45)" />
        <path
          d="M 212 206 C 244 184, 272 186, 300 202 C 328 218, 356 214, 388 192 L 388 232 A 10 10 0 0 1 378 242 L 222 242 A 10 10 0 0 1 212 232 Z"
          fill="rgba(131,223,233,0.18)"
        />
        <path
          d="M 212 222 C 250 204, 284 212, 312 224 C 340 236, 364 230, 388 216 L 388 232 A 10 10 0 0 1 378 242 L 222 242 A 10 10 0 0 1 212 232 Z"
          fill="rgba(131,223,233,0.28)"
        />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={292 + i * 8} cy="252" r="2.2" fill={i === 0 ? '#83DFE9' : 'rgba(255,255,255,0.25)'} />
        ))}

        {/* Actions — the like pops and hearts float up */}
        <g transform="translate(213, 262) scale(0.75)">
          <motion.path
            d={HEART_PATH}
            fill="#83DFE9"
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: [0.4, 1.25, 1], opacity: 1 }}
            viewport={inView}
            transition={{ duration: 0.8, delay: 1.3, ease: swanEase }}
          />
        </g>
        {[[217, 250], [226, 254], [209, 256]].map(([x, y], i) => (
          <g key={x} transform={`translate(${x}, ${y}) scale(0.4)`}>
            <path className={`mk-float mk-float--${i + 1}`} d={HEART_PATH} fill="#83DFE9" />
          </g>
        ))}
        <g transform="translate(240, 262) scale(0.75)">
          <path d={COMMENT_PATH} {...iconStroke} stroke="rgba(255,255,255,0.7)" />
        </g>
        <g transform="translate(267, 262) scale(0.75)">
          <path d={SEND_PATH} {...iconStroke} stroke="rgba(255,255,255,0.7)" />
        </g>
        <g transform="translate(369, 262) scale(0.75)">
          <path d={BOOKMARK_PATH} {...iconStroke} stroke="rgba(255,255,255,0.7)" />
        </g>

        {/* Likes + caption */}
        <rect x="212" y="292" width="84" height="6" rx="2" fill="rgba(255,255,255,0.6)" />
        <rect x="212" y="306" width="170" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="212" y="317" width="124" height="5" rx="2" fill="rgba(255,255,255,0.18)" />
        <rect x="212" y="336" width="64" height="4" rx="2" fill="rgba(255,255,255,0.14)" />
      </motion.g>

      {/* Notifications */}
      {NOTIFICATIONS.map((n, i) => (
        <motion.g
          key={n.icon}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={inView}
          transition={{ duration: 0.8, delay: 0.9 + i * 0.18, ease: swanEase }}
        >
          <rect x="420" y={n.y} width="156" height="38" rx="19" fill={cardFill} stroke="rgba(255,255,255,0.08)" />
          <circle cx="440" cy={n.y + 19} r="11" fill="rgba(131,223,233,0.12)" stroke="rgba(131,223,233,0.45)" />
          <NotificationIcon icon={n.icon} x={434} y={n.y + 13} />
          <rect x="460" y={n.y + 12} width={n.title} height="5" rx="2" fill="rgba(255,255,255,0.55)" />
          <rect x="460" y={n.y + 22} width={n.meta} height="4" rx="2" fill="rgba(255,255,255,0.2)" />
        </motion.g>
      ))}

      {/* Content grid */}
      <motion.g {...reveal(1.1, 12)}>
        {[1, 0.6, 0.85, 0.7, 1, 0.5].map((opacity, i) => {
          const x = 420 + (i % 3) * 54;
          const y = 214 + Math.floor(i / 3) * 54;
          return (
            <g key={i}>
              <rect x={x} y={y} width="48" height="48" rx="8" fill={photoFill} fillOpacity={opacity} stroke="rgba(255,255,255,0.06)" />
              {i === 1 && (
                <path d={`M ${x + 19} ${y + 16} L ${x + 32} ${y + 24} L ${x + 19} ${y + 32} Z`} fill="rgba(255,255,255,0.85)" />
              )}
              {i === 3 && (
                <g>
                  <rect x={x + 30} y={y + 6} width="10" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                  <rect x={x + 33} y={y + 9} width="10" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                </g>
              )}
            </g>
          );
        })}
      </motion.g>
    </svg>
  );
};

/* -------------------- Tráfego pago mockup -------------------- */
/* Ads manager: KPIs, conversion funnel and weekly performance */
const FUNNEL = [
  { top: 184, bottom: 146, fill: 0.14 },
  { top: 146, bottom: 108, fill: 0.24 },
  { top: 108, bottom: 72, fill: 0.4 },
  { top: 72, bottom: 40, fill: 0.75 }
];
const WEEKLY = [44, 58, 50, 74, 66, 92, 104, 128];
const barX = (i) => 296 + i * 34;
const TREND = WEEKLY.map((h, i) => `${i === 0 ? 'M' : 'L'} ${barX(i)} ${344 - h - 14}`).join(' ');

export const AdsMockup = () => {
  const uid = useSvgId();
  const lastX = barX(WEEKLY.length - 1);
  const lastY = 344 - WEEKLY[WEEKLY.length - 1] - 14;

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--ads"
      aria-hidden="true"
    >
      <WindowFrame uid={uid} />

      {/* Header, platforms and date range */}
      <rect x="32" y="60" width="118" height="10" rx="2" fill="rgba(255,255,255,0.7)" />
      <rect x="32" y="78" width="84" height="5" rx="2" fill="rgba(255,255,255,0.16)" />
      <rect x="346" y="58" width="66" height="22" rx="11" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <circle cx="361" cy="69" r="5" fill="none" stroke="#83DFE9" strokeWidth="1.6" />
      <rect x="372" y="67" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="418" y="58" width="66" height="22" rx="11" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <path d="M 428 73 L 433 64 L 438 73 Z" fill="none" stroke="#83DFE9" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="444" y="67" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="490" y="58" width="78" height="22" rx="11" fill="rgba(131,223,233,0.08)" stroke="rgba(131,223,233,0.4)" />
      <rect x="502" y="64" width="10" height="10" rx="2" fill="none" stroke="#83DFE9" strokeWidth="1.3" />
      <rect x="518" y="67" width="38" height="4" rx="2" fill="rgba(131,223,233,0.7)" />

      {/* KPIs — the last one (ROAS) highlighted */}
      {[0, 1, 2, 3].map((i) => {
        const x = 32 + i * 136;
        const highlight = i === 3;
        return (
          <motion.g key={i} {...reveal(0.15 + i * 0.1, 10)}>
            <rect
              x={x} y="96" width="128" height="56" rx="10"
              fill={highlight ? 'rgba(131,223,233,0.07)' : 'rgba(255,255,255,0.03)'}
              stroke={highlight ? 'rgba(131,223,233,0.4)' : 'rgba(255,255,255,0.06)'}
            />
            <rect x={x + 12} y="109" width="50" height="5" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x={x + 12} y="122" width={highlight ? 50 : 60} height="14" rx="3" fill={highlight ? '#83DFE9' : 'rgba(255,255,255,0.8)'} />
            <rect x={x + 84} y="123" width="32" height="12" rx="6" fill="rgba(131,223,233,0.12)" />
            <path d={`M ${x + 91} 132 L ${x + 95} 126 L ${x + 99} 132`} fill="none" stroke="#83DFE9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={x + 102} y="127" width="9" height="4" rx="1.5" fill="rgba(131,223,233,0.8)" />
          </motion.g>
        );
      })}

      {/* Funnel: impressions → clicks → leads → sales */}
      <rect x="32" y="166" width="220" height="196" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
      <rect x="48" y="181" width="70" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
      {FUNNEL.map((f, i) => {
        const cx = 142;
        const y = 200 + i * 38;
        const points = `${cx - f.top / 2},${y} ${cx + f.top / 2},${y} ${cx + f.bottom / 2},${y + 32} ${cx - f.bottom / 2},${y + 32}`;
        return (
          <motion.g key={i} {...reveal(0.5 + i * 0.15, -6)}>
            <polygon points={points} fill="#83DFE9" fillOpacity={f.fill} stroke="rgba(131,223,233,0.35)" strokeLinejoin="round" />
            <rect x={cx - 14} y={y + 13.5} width="28" height="5" rx="2" fill={i === FUNNEL.length - 1 ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'} />
          </motion.g>
        );
      })}

      {/* Weekly performance */}
      <rect x="264" y="166" width="304" height="196" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
      <rect x="280" y="181" width="92" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="480" cy="184" r="3" fill="rgba(131,223,233,0.35)" />
      <rect x="487" y="182" width="24" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="522" cy="184" r="3" fill="#83DFE9" />
      <rect x="529" y="182" width="24" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="280" y1={236 + i * 36} x2="552" y2={236 + i * 36} stroke="rgba(255,255,255,0.04)" />
      ))}
      {WEEKLY.map((h, i) => (
        <motion.line
          key={i}
          x1={barX(i)} y1="344" x2={barX(i)} y2={344 - h}
          stroke="#83DFE9"
          strokeOpacity={i === WEEKLY.length - 1 ? 0.9 : 0.28}
          strokeWidth="16"
          {...draw(0.6 + i * 0.08, 1)}
        />
      ))}
      <motion.path
        d={TREND}
        fill="none"
        stroke="#83DFE9"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(1.4, 1.6)}
      />
      <motion.g {...pop(2.8)}>
        <circle cx={lastX} cy={lastY} r="7" fill="rgba(131,223,233,0.2)" />
        <circle cx={lastX} cy={lastY} r="3.5" fill="#83DFE9" />
      </motion.g>
    </svg>
  );
};

/* -------------------- Sistema de gestão mockup -------------------- */
/* ERP: modules, cash breakdown, KPIs and an orders table */
const STATUS_STYLES = {
  done: { fill: 'rgba(131,223,233,0.14)', stroke: 'rgba(131,223,233,0.5)', ink: 'rgba(131,223,233,0.9)' },
  pending: { fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(255,255,255,0.14)', ink: 'rgba(255,255,255,0.4)' },
  transit: { fill: 'none', stroke: 'rgba(131,223,233,0.4)', ink: 'rgba(131,223,233,0.6)', dash: '3 3' }
};

const StatusPill = ({ x, y, status }) => {
  const s = STATUS_STYLES[status];
  return (
    <g>
      <rect x={x} y={y} width="60" height="16" rx="8" fill={s.fill} stroke={s.stroke} strokeDasharray={s.dash} />
      <circle cx={x + 10} cy={y + 8} r="2.5" fill={s.ink} />
      <rect x={x + 17} y={y + 6} width="32" height="4" rx="2" fill={s.ink} />
    </g>
  );
};

const ORDERS = [
  { status: 'done', name: 64 },
  { status: 'pending', name: 52, selected: true },
  { status: 'done', name: 72 },
  { status: 'transit', name: 46 },
  { status: 'done', name: 58 },
  { status: 'pending', name: 66 }
];

const CASH_SEGMENTS = [
  { from: 0, length: 0.5, opacity: 0.95 },
  { from: 0.53, length: 0.27, opacity: 0.55 },
  { from: 0.83, length: 0.14, opacity: 0.28 }
];

const STAT_SPARKS = [
  'M 138 294 L 150 288 L 162 291 L 174 280 L 184 276',
  'M 138 342 L 150 338 L 162 332 L 174 334 L 184 324'
];

export const ErpMockup = () => {
  const uid = useSvgId();
  const avatar = `url(#${uid}-avatar)`;

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="portfolio-mockup portfolio-mockup--erp"
      aria-hidden="true"
    >
      <defs>
        <AvatarGradient id={`${uid}-avatar`} />
      </defs>

      <WindowFrame uid={uid} />

      {/* Modules */}
      <rect x="20" y="56" width="20" height="20" rx="6" fill="rgba(131,223,233,0.55)" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={60 + i * 70} y="63.5" width="48" height="5" rx="2"
          fill={i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.28)'}
        />
      ))}
      <motion.rect
        x="60" y="80" width="48" height="2" rx="1"
        fill="#83DFE9"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={inView}
        transition={{ duration: 0.8, delay: 0.3, ease: swanEase }}
      />
      <rect x="436" y="56" width="108" height="20" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      <circle cx="450" cy="66" r="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" />
      <rect x="460" y="64" width="50" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
      <circle cx="564" cy="66" r="10" fill={avatar} />
      <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.06)" />

      {/* Cash breakdown */}
      <rect x="20" y="102" width="176" height="150" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
      <rect x="34" y="116" width="64" height="5" rx="2" fill="rgba(255,255,255,0.35)" />
      <circle cx="74" cy="190" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="11" />
      {CASH_SEGMENTS.map((s, i) => (
        <g key={i} transform={`rotate(${-90 + s.from * 360} 74 190)`}>
          <motion.circle
            cx="74" cy="190" r="34"
            fill="none"
            stroke="#83DFE9"
            strokeOpacity={s.opacity}
            strokeWidth="11"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: s.length }}
            viewport={inView}
            transition={{ duration: 1.1, delay: 0.4 + i * 0.35, ease: swanEase }}
          />
        </g>
      ))}
      <rect x="62" y="186" width="24" height="8" rx="2" fill="rgba(255,255,255,0.8)" />
      {CASH_SEGMENTS.map((s, i) => (
        <g key={i}>
          <rect x="124" y={170 + i * 16} width="8" height="8" rx="2" fill="#83DFE9" fillOpacity={s.opacity} />
          <rect x="138" y={172 + i * 16} width={40 - i * 6} height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        </g>
      ))}

      {/* KPIs */}
      {STAT_SPARKS.map((spark, i) => {
        const y = 264 + i * 50;
        return (
          <motion.g key={i} {...reveal(0.5 + i * 0.12, 8)}>
            <rect x="20" y={y} width="176" height="42" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
            <rect x="32" y={y + 11} width="20" height="20" rx="6" fill="rgba(131,223,233,0.12)" stroke="rgba(131,223,233,0.4)" />
            <rect x="38" y={y + 18} width="8" height="6" rx="1.5" fill="rgba(131,223,233,0.8)" />
            <rect x="62" y={y + 12} width="46" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="62" y={y + 22} width="62" height="9" rx="2" fill="rgba(255,255,255,0.8)" />
            <path d={spark} fill="none" stroke="#83DFE9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        );
      })}

      {/* Orders table */}
      <rect x="208" y="102" width="372" height="254" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
      <rect x="224" y="117" width="96" height="7" rx="2" fill="rgba(255,255,255,0.6)" />
      <rect x="496" y="112" width="68" height="18" rx="9" fill="none" stroke="rgba(255,255,255,0.12)" />
      <rect x="508" y="119" width="44" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      {[[224, 28], [284, 56], [404, 40], [492, 44]].map(([x, w]) => (
        <rect key={x} x={x} y="144" width={w} height="4" rx="2" fill="rgba(255,255,255,0.2)" />
      ))}
      <line x1="224" y1="156" x2="564" y2="156" stroke="rgba(255,255,255,0.06)" />
      {ORDERS.map((row, i) => {
        const y = 160 + i * 32;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: swanEase }}
          >
            {row.selected && <rect x="216" y={y + 2} width="356" height="28" rx="6" fill="rgba(131,223,233,0.06)" />}
            <rect x="224" y={y + 14} width="26" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <circle cx="290" cy={y + 16} r="6" fill={avatar} fillOpacity="0.8" />
            <rect x="302" y={y + 13.5} width={row.name} height="5" rx="2" fill="rgba(255,255,255,0.55)" />
            <rect x="404" y={y + 13.5} width="44" height="5" rx="2" fill="rgba(255,255,255,0.45)" />
            <StatusPill x={492} y={y + 8} status={row.status} />
            {i < ORDERS.length - 1 && (
              <line x1="224" y1={y + 32} x2="564" y2={y + 32} stroke="rgba(255,255,255,0.04)" />
            )}
          </motion.g>
        );
      })}
    </svg>
  );
};

/* -------------------- Resolver -------------------- */
const MOCKUPS = {
  dashboard: DashboardMockup,
  mobile: MobileMockup,
  site: SiteMockup,
  landing: LandingMockup,
  store: StoreMockup,
  crm: CrmMockup,
  chat: ChatbotMockup,
  social: SocialMockup,
  ads: AdsMockup,
  erp: ErpMockup
};

/* Resolves the illustration from the `mockup` kind set in the data (cases and categories) */
export const Mockup = ({ kind }) => {
  const Component = MOCKUPS[kind] || SiteMockup;
  return <Component />;
};

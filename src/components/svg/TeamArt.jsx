import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ilustrações neon das funções do time — ocupam o card enquanto não há foto.
 * viewBox 400×600 (a mesma proporção 2:3 do card). `active` liga os loops
 * sutis só no card que está na frente.
 */

const CYAN = '#83DFE9';
const INK = '#050708';
const FAINT = 'rgba(255, 255, 255, 0.16)';
const GRID = 'rgba(131, 223, 233, 0.12)';
const fillBox = { transformBox: 'fill-box', transformOrigin: 'center' };

const loop = (duration, extra = {}) => ({ duration, repeat: Infinity, ease: 'easeInOut', ...extra });
const rest = { duration: 0.4, ease: 'easeOut' };

/* ---------- Designer e Planejamento: a curva de Bézier sendo ajustada ---------- */
const CURVE = 'M70 420 C70 318 178 344 200 260 C222 176 292 152 340 152';
const HANDLES = [[70, 318], [178, 344], [222, 176], [292, 152]];

const DesignArt = ({ uid, active }) => (
  <>
    {/* prancheta: marcas de corte, colunas e o círculo de proporção */}
    <path d="M52 114 V96 H70 M330 96 H348 V114 M348 438 V456 H330 M70 456 H52 V438" fill="none" stroke={FAINT} />
    <path d="M130 96 V456 M200 96 V456 M270 96 V456 M52 276 H348" fill="none" stroke={GRID} strokeDasharray="2 7" />
    <circle cx="200" cy="276" r="124" fill="none" stroke={GRID} />

    <path d="M70 420 V318 M178 344 L222 176 M340 152 H292" fill="none" stroke="rgba(255, 255, 255, 0.42)" strokeWidth="1.2" />

    <path d={CURVE} fill="none" stroke={`url(#${uid}-ink)`} strokeWidth="2.6" strokeLinecap="round" filter={`url(#${uid}-glow)`} />
    {/* um ponto de luz percorre o traço */}
    <motion.path
      d={CURVE}
      pathLength="1"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeDasharray="0.07 0.93"
      filter={`url(#${uid}-glow)`}
      initial={false}
      animate={active ? { strokeDashoffset: [0.07, -1], opacity: 1 } : { strokeDashoffset: 0.07, opacity: 0 }}
      transition={active ? { strokeDashoffset: loop(3.2, { repeatDelay: 0.8 }), opacity: rest } : rest}
    />

    {HANDLES.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill={INK} stroke={CYAN} strokeWidth="1.4" />
    ))}
    {[[70, 420], [340, 152]].map(([x, y]) => (
      <rect key={x} x={x - 5} y={y - 5} width="10" height="10" fill={INK} stroke="#FFFFFF" strokeWidth="1.4" />
    ))}

    {/* âncora selecionada */}
    <motion.rect
      x="194"
      y="254"
      width="12"
      height="12"
      fill="none"
      stroke={CYAN}
      style={fillBox}
      initial={false}
      animate={active ? { scale: [1, 2.6], opacity: [0.8, 0] } : { scale: 1, opacity: 0 }}
      transition={active ? loop(2.2, { ease: 'easeOut' }) : rest}
    />
    <rect x="194" y="254" width="12" height="12" fill={CYAN} filter={`url(#${uid}-glow)`} />

    {/* cursor segurando a alça */}
    <motion.g
      initial={false}
      animate={active ? { x: [0, 3, 0], y: [0, -3, 0] } : { x: 0, y: 0 }}
      transition={active ? loop(3.4) : rest}
    >
      <path
        d="M222 176 v24 l6.5 -6 l4.5 10.5 l4.5 -2 l-4.5 -10 h9 z"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </motion.g>
  </>
);

/* ---------- Engenheiro de Software: editor + arquitetura em produção ---------- */
const CODE = [
  [[80, 34, 'kw'], [120, 74, 'tx'], [200, 26, 'ac']],
  [[100, 52, 'tx'], [158, 92, 'mu']],
  [[100, 28, 'kw'], [134, 60, 'tx'], [200, 44, 'mu']],
  [[120, 84, 'tx'], [210, 52, 'ac']],
  [[120, 46, 'mu'], [172, 72, 'tx']],
  [[100, 20, 'kw'], [126, 50, 'tx']],
  [[80, 16, 'kw']]
];
const TONE = {
  kw: 'rgba(131, 223, 233, 0.95)',
  ac: 'rgba(131, 223, 233, 0.45)',
  tx: 'rgba(255, 255, 255, 0.4)',
  mu: 'rgba(255, 255, 255, 0.16)'
};
const rowY = (r) => 160 + r * 22;

/* A linha em execução para em cada linha do código e volta ao topo */
const STEP_Y = [];
const STEP_T = [];
CODE.forEach((_, r) => {
  STEP_Y.push(rowY(r) - 9, rowY(r) - 9);
  STEP_T.push(r / CODE.length, (r + 0.72) / CODE.length);
});
STEP_Y.push(rowY(0) - 9);
STEP_T.push(1);

const PACKETS = [
  { cx: [200, 200], cy: [328, 380], delay: 0 },
  { cx: [200, 116], cy: [392, 434], delay: 0.7 },
  { cx: [200, 284], cy: [392, 434], delay: 1.2 }
];

const SoftwareArt = ({ uid, active }) => (
  <>
    <rect x="58" y="96" width="284" height="230" rx="16" fill="rgba(5, 7, 8, 0.6)" stroke="rgba(255, 255, 255, 0.2)" />
    <path d="M58 130 H342" stroke="rgba(255, 255, 255, 0.08)" />
    <circle cx="80" cy="113" r="3.5" fill={CYAN} />
    <circle cx="96" cy="113" r="3.5" fill="rgba(255, 255, 255, 0.22)" />
    <circle cx="112" cy="113" r="3.5" fill="rgba(255, 255, 255, 0.22)" />

    <motion.rect
      x="66"
      width="268"
      height="18"
      rx="5"
      fill="rgba(131, 223, 233, 0.09)"
      initial={false}
      animate={active ? { y: STEP_Y, opacity: 1 } : { y: rowY(0) - 9, opacity: 0 }}
      transition={
        active
          ? { y: { duration: 6, times: STEP_T, repeat: Infinity, ease: 'easeInOut' }, opacity: rest }
          : rest
      }
    />

    {CODE.map((row, r) =>
      row.map(([x, w, tone]) => (
        <rect key={`${r}-${x}`} x={x} y={rowY(r) - 3.5} width={w} height="7" rx="3.5" fill={TONE[tone]} />
      ))
    )}
    <motion.rect
      x="102"
      y={rowY(6) - 8}
      width="2.5"
      height="16"
      rx="1"
      fill={CYAN}
      initial={false}
      animate={active ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
      transition={active ? { duration: 1.1, times: [0, 0.5, 0.55, 1], repeat: Infinity, ease: 'linear' } : rest}
    />

    {/* deploy → serviços */}
    <path d="M200 326 V378" stroke="rgba(131, 223, 233, 0.4)" strokeDasharray="3 5" />
    <path d="M200 392 L116 434 M200 392 L284 434" fill="none" stroke="rgba(131, 223, 233, 0.45)" strokeWidth="1.2" />
    <path d="M124 436 H276" stroke={FAINT} strokeDasharray="2 6" />
    <circle cx="200" cy="392" r="12" fill="rgba(131, 223, 233, 0.14)" stroke={CYAN} strokeWidth="1.6" filter={`url(#${uid}-glow)`} />
    <circle cx="200" cy="392" r="4" fill={CYAN} />
    <circle cx="116" cy="434" r="8" fill={INK} stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.3" />
    <circle cx="284" cy="434" r="8" fill={INK} stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.3" />

    {/* pacotes de dados (movidos por transform: mais leve que animar cx/cy) */}
    {PACKETS.map((pk) => (
      <motion.circle
        key={pk.delay}
        r="3"
        cx={pk.cx[0]}
        cy={pk.cy[0]}
        fill="#FFFFFF"
        filter={`url(#${uid}-glow)`}
        initial={false}
        animate={
          active
            ? { x: [0, pk.cx[1] - pk.cx[0]], y: [0, pk.cy[1] - pk.cy[0]], opacity: [0, 1, 1, 0] }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={
          active
            ? { duration: 1.4, delay: pk.delay, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }
            : rest
        }
      />
    ))}
  </>
);

/* ---------- Gestor de Tráfego: crescimento rumo ao alvo ---------- */
const BARS = [[104, 372], [152, 344], [200, 322], [248, 266], [296, 204]];
const TREND = [[104, 352], [152, 322], [200, 302], [248, 240], [296, 178], [334, 128]];
const TREND_D = `M${TREND.map(([x, y]) => `${x} ${y}`).join(' L')}`;

const TrafficArt = ({ uid, active }) => (
  <>
    <path d="M64 176 H344 M64 256 H344 M64 336 H344" stroke={GRID} strokeDasharray="2 7" />
    <path d="M64 96 V420 H344" fill="none" stroke="rgba(255, 255, 255, 0.24)" />

    {/* barras "respirando" como dados ao vivo */}
    {BARS.map(([x, top], i) => (
      <motion.rect
        key={x}
        x={x - 14}
        y={top}
        width="28"
        height={420 - top}
        rx="5"
        fill="rgba(131, 223, 233, 0.09)"
        stroke="rgba(131, 223, 233, 0.34)"
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        initial={false}
        animate={active ? { scaleY: [1, 0.9, 1] } : { scaleY: 1 }}
        transition={active ? loop(2.6, { delay: i * 0.18 }) : rest}
      />
    ))}

    <path
      d={TREND_D}
      fill="none"
      stroke={`url(#${uid}-ink)`}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={`url(#${uid}-glow)`}
    />
    {TREND.slice(0, -1).map(([cx, cy]) => (
      <circle key={cx} cx={cx} cy={cy} r="4.5" fill={INK} stroke={CYAN} strokeWidth="1.4" />
    ))}

    {/* alvo */}
    <circle cx="334" cy="128" r="22" fill="none" stroke="rgba(131, 223, 233, 0.35)" strokeDasharray="3 5" />
    <circle cx="334" cy="128" r="11" fill="none" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.3" />
    <circle cx="334" cy="128" r="4.5" fill={CYAN} filter={`url(#${uid}-glow)`} />
    <motion.circle
      cx="334"
      cy="128"
      r="11"
      fill="none"
      stroke={CYAN}
      vectorEffect="non-scaling-stroke"
      style={fillBox}
      initial={false}
      animate={active ? { scale: [1, 3.2], opacity: [0.75, 0] } : { scale: 1, opacity: 0 }}
      transition={active ? loop(2.2, { ease: 'easeOut' }) : rest}
    />

    {/* um dado percorre a curva de crescimento */}
    <motion.circle
      r="3.5"
      cx={TREND[0][0]}
      cy={TREND[0][1]}
      fill="#FFFFFF"
      filter={`url(#${uid}-glow)`}
      initial={false}
      animate={
        active
          ? {
              x: TREND.map((p) => p[0] - TREND[0][0]),
              y: TREND.map((p) => p[1] - TREND[0][1]),
              opacity: [0, 1, 1, 1, 1, 0]
            }
          : { x: 0, y: 0, opacity: 0 }
      }
      transition={active ? { duration: 3, repeat: Infinity, repeatDelay: 0.6, ease: 'linear' } : rest}
    />
  </>
);

const ARTS = { design: DesignArt, software: SoftwareArt, traffic: TrafficArt };

const TeamArt = ({ kind, uid, active = false }) => {
  const Art = ARTS[kind];
  if (!Art) return null;

  return (
    <svg className="team-card-art" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${uid}-ink`} x1="60" y1="440" x2="340" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.5" />
          <stop offset="0.6" stopColor={CYAN} />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <Art uid={uid} active={active} />
    </svg>
  );
};

export default TeamArt;

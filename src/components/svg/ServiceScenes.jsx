import React, { useId } from 'react';

/**
 * Cenas dos cards de serviço — ilustrações em traço ciano, viewBox 360×180.
 *
 * Não animam sozinhas: a coreografia é CSS e depende do estado do card
 * (`.is-seen` desenha a cena quando o card pousa · `.is-live` liga os loops
 * enquanto ele está no topo da pilha). `--k` ordena a entrada de cada peça.
 *
 * Traços desenhados usam pathLength="1" num único subpath, sem
 * non-scaling-stroke (o Chrome ignora pathLength junto dele).
 */

const k = (n) => ({ '--k': n });

/* ---------- Software: editor de código alimentando um fluxo de automação ---------- */
const CODE = [
  [40, 62, 58, false],
  [52, 75, 96, true],
  [64, 88, 74, false],
  [64, 101, 108, true],
  [52, 114, 52, false],
  [40, 127, 30, false],
  [40, 140, 84, true]
];

const WIRES = [
  'M216 70 C 234 70, 232 49.5, 250 49.5',
  'M216 118 C 234 118, 232 130.5, 250 130.5',
  'M305 49.5 C 320 49.5, 326 60, 328 75',
  'M305 130.5 C 320 130.5, 326 120, 328 105'
];

export const SoftwareScene = () => (
  <svg viewBox="0 0 360 180" className="scene scene--software" aria-hidden="true" focusable="false">
    <rect className="scene-stroke scene-frame" x="20.5" y="20.5" width="196" height="139" rx="10" pathLength="1" />
    <path className="scene-stroke scene-faint" style={k(1)} d="M21 44 H216" pathLength="1" />
    {[34, 45, 56].map((cx, i) => (
      <circle key={cx} className="scene-pop scene-dot-ui" style={k(i)} cx={cx} cy="32.5" r="2.6" />
    ))}

    {CODE.map(([x, y, w, accent], i) => (
      <rect
        key={y}
        className={`scene-bar${accent ? ' is-accent' : ''}`}
        style={k(i)}
        x={x}
        y={y - 2.5}
        width={w}
        height="5"
        rx="2.5"
      />
    ))}
    <rect className="scene-caret" x="129" y="135" width="1.8" height="10" rx="0.9" />

    {WIRES.map((d, i) => (
      <path key={d} className="scene-stroke scene-wire" style={k(i + 2)} d={d} pathLength="1" />
    ))}
    {WIRES.map((d, i) => (
      <path key={`p-${d}`} className="scene-pulse" style={k(i)} d={d} pathLength="1" />
    ))}

    <rect className="scene-pop scene-node" style={k(3)} x="250.5" y="36.5" width="54" height="26" rx="7" />
    <rect className="scene-bar is-accent" style={k(5)} x="259" y="44" width="26" height="4" rx="2" />
    <rect className="scene-bar" style={k(6)} x="259" y="51" width="36" height="4" rx="2" />
    <rect className="scene-pop scene-node" style={k(4)} x="250.5" y="117.5" width="54" height="26" rx="7" />
    <rect className="scene-bar is-accent" style={k(6)} x="259" y="125" width="34" height="4" rx="2" />
    <rect className="scene-bar" style={k(7)} x="259" y="132" width="20" height="4" rx="2" />

    <circle className="scene-pop scene-node scene-core" style={k(6)} cx="330" cy="90" r="15" />
    <circle className="scene-ping" cx="330" cy="90" r="15" />
    <path className="scene-stroke scene-check" style={k(8)} d="M323.5 90.5 L 328 95 L 337 85.5" pathLength="1" />
  </svg>
);

/* ---------- Web: página que se monta, clique no CTA e conversão subindo ---------- */
export const WebScene = () => {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 360 180" className="scene scene--web" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#83DFE9" stopOpacity="0.32" />
          <stop offset="1" stopColor="#83DFE9" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect className="scene-stroke scene-frame" x="20.5" y="16.5" width="319" height="147" rx="10" pathLength="1" />
      <path className="scene-stroke scene-faint" style={k(1)} d="M21 38 H339" pathLength="1" />
      {[33, 44, 55].map((cx, i) => (
        <circle key={cx} className="scene-pop scene-dot-ui" style={k(i)} cx={cx} cy="27.5" r="2.6" />
      ))}
      <rect className="scene-pop scene-url" style={k(2)} x="110.5" y="23.5" width="140" height="9" rx="4.5" />

      <rect className="scene-bar is-accent" style={k(0)} x="38" y="55" width="118" height="9" rx="4.5" />
      <rect className="scene-bar is-bright" style={k(1)} x="38" y="69" width="92" height="9" rx="4.5" />
      <rect className="scene-bar" style={k(2)} x="38" y="87" width="124" height="4" rx="2" />
      <rect className="scene-bar" style={k(3)} x="38" y="96" width="104" height="4" rx="2" />
      <rect className="scene-pop scene-btn" style={k(5)} x="38" y="113" width="70" height="20" rx="10" />
      <rect className="scene-btn-label" x="51" y="121" width="44" height="4" rx="2" />
      <rect className="scene-pop scene-btn-ghost" style={k(6)} x="116.5" y="113.5" width="52" height="19" rx="9.5" />
      <circle className="scene-ripple" cx="73" cy="123" r="12" />

      <rect className="scene-pop scene-panel" style={k(3)} x="190.5" y="52.5" width="132" height="96" rx="9" />
      <rect className="scene-bar" style={k(5)} x="200" y="61" width="34" height="4" rx="2" />
      <rect className="scene-bar is-accent" style={k(6)} x="290" y="61" width="22" height="4" rx="2" />
      {[80, 102, 124].map((y, i) => (
        <path key={y} className="scene-stroke scene-grid" style={k(i + 4)} d={`M200 ${y} H313`} pathLength="1" />
      ))}
      <path
        className="scene-area"
        fill={`url(#${id}-area)`}
        d="M200 138 C 224 134, 232 114, 252 112 S 288 84, 312 72 V 140 H 200 Z"
      />
      <path
        className="scene-stroke scene-hero-line"
        style={k(6)}
        d="M200 138 C 224 134, 232 114, 252 112 S 288 84, 312 72"
        pathLength="1"
      />
      <circle className="scene-ping" cx="312" cy="72" r="3.5" />
      <circle className="scene-pop scene-end" style={k(10)} cx="312" cy="72" r="3.5" />

      <g className="scene-cursor">
        <path d="M0 0 L0 15 L4 11.5 L7 18 L9.6 16.8 L6.7 10.5 L12 10.5 Z" />
      </g>
    </svg>
  );
};

/* ---------- Design: curva de bézier na prancheta, paleta e tipografia ---------- */
const ANCHORS = [
  [52, 142],
  [150, 102],
  [236, 104],
  [314, 70]
];

export const DesignScene = () => (
  <svg viewBox="0 0 360 180" className="scene scene--design" aria-hidden="true" focusable="false">
    <rect className="scene-board" x="20.5" y="16.5" width="319" height="147" rx="10" />
    {[100, 180, 260].map((x, i) => (
      <path key={x} className="scene-stroke scene-grid" style={k(i)} d={`M${x} 17 V163`} pathLength="1" />
    ))}

    <circle className="scene-pop scene-swatch" style={k(1)} cx="44" cy="38" r="7" />
    <circle className="scene-pop scene-swatch is-light" style={k(2)} cx="62" cy="38" r="7" />
    <circle className="scene-pop scene-swatch is-dark" style={k(3)} cx="80" cy="38" r="7" />
    <text className="scene-type" x="318" y="46" textAnchor="end">
      Aa
    </text>

    <path className="scene-stroke scene-handle" style={k(7)} d="M128 76 L 172 128" pathLength="1" />
    <path className="scene-stroke scene-handle" style={k(8)} d="M218 128 L 254 80" pathLength="1" />
    {[
      [128, 76],
      [172, 128],
      [218, 128],
      [254, 80]
    ].map(([cx, cy], i) => (
      <circle key={`${cx}-${cy}`} className="scene-pop scene-knob" style={k(i + 8)} cx={cx} cy={cy} r="2.6" />
    ))}

    <path
      className="scene-stroke scene-curve"
      style={k(2)}
      d="M52 142 C 60 96, 118 72, 150 102 S 204 150, 236 104 S 290 46, 314 70"
      pathLength="1"
    />
    {ANCHORS.map(([cx, cy], i) => (
      <rect
        key={cx}
        className={`scene-pop scene-anchor${i === 1 ? ' is-active' : ''}`}
        style={k(i + 4)}
        x={cx - 3.5}
        y={cy - 3.5}
        width="7"
        height="7"
        rx="1.2"
      />
    ))}

    <g className="scene-pen">
      <path d="M0 0 L3.5 -11 L14 -21.5 L21.5 -14 L11 -3.5 Z" />
      <circle cx="7.6" cy="-7.6" r="1.6" />
    </g>
  </svg>
);

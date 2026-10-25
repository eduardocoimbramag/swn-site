import React, { useId } from 'react';

/**
 * Estrela-bússola de 8 pontas — quatro longas nos eixos e quatro diagonais
 * curtas. Cada ponta é dividida em duas faces, uma na luz e outra na sombra,
 * sempre do mesmo lado: o relevo vem só do degradê, no ciano da marca.
 */

const C = 16;       // centro do viewBox 32×32
const MAIN = 15;    // pontas dos eixos
const DIAG = 10.5;  // pontas diagonais
const VALLEY = 6;   // vale entre uma ponta e outra — pontas largas, facetadas

const at = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
};

const facets = (len, offset) => {
  let lit = '';
  let shade = '';
  for (let k = 0; k < 4; k++) {
    const deg = offset + k * 90;
    lit += `M${C} ${C}L${at(deg - 22.5, VALLEY)}L${at(deg, len)}Z`;
    shade += `M${C} ${C}L${at(deg, len)}L${at(deg + 22.5, VALLEY)}Z`;
  }
  return { lit, shade };
};

const AXES = facets(MAIN, 0);
const DIAGONALS = facets(DIAG, 45);
const OUTLINE = `M${Array.from({ length: 16 }, (_, i) =>
  at(i * 22.5, i % 2 ? VALLEY : i % 4 === 0 ? MAIN : DIAG)
).join('L')}Z`;

const CompassStar = ({ size, className }) => {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-lit`} x1="5" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C6F3F7" />
          <stop offset="1" stopColor="#83DFE9" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="5" y1="2" x2="27" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#83DFE9" />
          <stop offset="1" stopColor="#2A7680" />
        </linearGradient>
      </defs>

      <g opacity="0.82">
        <path d={DIAGONALS.shade} fill={`url(#${id}-shade)`} />
        <path d={DIAGONALS.lit} fill={`url(#${id}-lit)`} />
      </g>
      <path d={AXES.shade} fill={`url(#${id}-shade)`} />
      <path d={AXES.lit} fill={`url(#${id}-lit)`} />
      <path
        d={OUTLINE}
        fill="none"
        stroke="rgba(3, 12, 14, 0.55)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CompassStar;

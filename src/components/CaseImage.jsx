import React from 'react';
import { Mockup } from './svg/PortfolioMockups';

/**
 * CaseImage — imagem de capa de cases e categorias, preparada para troca por
 * screenshots reais. Hoje renderiza o mockup SVG sobre o gradient de destaque
 * (+ marca d'água discreta no hero). Quando os screenshots chegarem, basta
 * trocar o conteúdo interno por uma <img>.
 *
 * Props:
 *   accent    — gradient CSS de fundo
 *   mockup    — kind do mockup (ver Mockup em svg/PortfolioMockups.jsx)
 *   watermark — texto no canto inferior (apenas variant 'hero')
 *   variant   — 'hero' (grande, topo de página) | 'card' (listagens)
 */
const CaseImage = ({ accent, mockup, watermark, variant = 'card' }) => (
  <div
    className={`case-image case-image--${variant}`}
    style={{ '--accent': accent }}
    aria-hidden="true"
  >
    <div className="case-image-glow" />
    <div className="case-image-inner">
      <Mockup kind={mockup} />
    </div>
    {variant === 'hero' && watermark && (
      <span className="case-image-watermark">{watermark}</span>
    )}
  </div>
);

export default CaseImage;

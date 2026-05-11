import React from 'react';
import {
  DashboardMockup,
  MobileMockup,
  SiteMockup
} from './svg/PortfolioMockups';

/**
 * CaseImage — placeholder das imagens de case, preparado para troca por
 * screenshots reais. Hoje renderiza o mockup SVG + accent gradient + nome do
 * cliente em sobreposição sutil. Quando os screenshots chegarem, basta trocar
 * o conteúdo interno por uma <img>.
 *
 * Props:
 *   caseData — objeto do case (esperando `accent`, `client`, `mockup`)
 *   variant  — 'hero' (grande, página individual) | 'card' (carrossel)
 */
const Mockup = ({ kind }) => {
  if (kind === 'dashboard') return <DashboardMockup />;
  if (kind === 'mobile') return <MobileMockup />;
  return <SiteMockup />;
};

const CaseImage = ({ caseData, variant = 'card' }) => {
  if (!caseData) return null;
  const { accent, client, mockup } = caseData;

  return (
    <div
      className={`case-image case-image--${variant}`}
      style={{ '--accent': accent }}
      aria-hidden="true"
    >
      <div className="case-image-glow" />
      <div className="case-image-inner">
        <Mockup kind={mockup} />
      </div>
      {variant === 'hero' && (
        <span className="case-image-watermark">{client}</span>
      )}
    </div>
  );
};

export default CaseImage;

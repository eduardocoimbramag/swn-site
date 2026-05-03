import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SWAN_PATH } from './BrandSwan';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

/**
 * Cinema Frames — 4 atos sincronizados ao desenho da marca.
 *
 *  0% — 25%   ATO 1 "Origem"      → pescoço & cabeça do cisne
 *  25% — 55%  ATO 2 "Forma"       → corpo principal
 *  55% — 80%  ATO 3 "Identidade"  → asas se completam, fill começa
 *  80% — 100% ATO 4 "Marca"       → fill total, clímax (pulse + flash)
 *
 * Cada ato carrega:
 *  - número (01/04, 02/04, ...)
 *  - palavra-tema grande à esquerda (cross-fade)
 *  - micro-legenda explicando o ato
 */

const ACTS = [
  {
    num: '01',
    word: 'Origem',
    caption: 'Toda marca começa com uma única linha.'
  },
  {
    num: '02',
    word: 'Forma',
    caption: 'Da intenção nasce o gesto — preciso, intencional.'
  },
  {
    num: '03',
    word: 'Identidade',
    caption: 'Cada curva carrega uma decisão de design.'
  },
  {
    num: '04',
    word: 'Marca',
    caption: 'Quando tudo se alinha, o cisne é SWN.'
  }
];

const SwanScrollDraw = () => {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28, mass: 0.8 });

  /* --- Curvas de animação --- */
  const strokeLen     = useTransform(smooth, [0.06, 0.78], [0, 1]);
  const fillOpacity   = useTransform(smooth, [0.62, 0.86], [0, 1]);
  const haloOpacity   = useTransform(smooth, [0, 0.5, 0.85, 1], [0.2, 0.7, 1, 0.85]);
  const haloScale     = useTransform(smooth, [0, 0.5, 1], [0.95, 1.05, 1.15]);

  /* Anel de clímax — expande quando o fill se completa */
  const ringScale     = useTransform(smooth, [0.86, 0.96], [0, 2.4]);
  const ringOpacity   = useTransform(smooth, [0.86, 0.90, 0.96], [0, 0.85, 0]);

  /* Flash discreto no momento do clímax (88-92%) */
  const flashOpacity  = useTransform(smooth, [0.86, 0.89, 0.92], [0, 0.18, 0]);

  /* Atos — cada um tem janela de fade-in/hold/fade-out */
  const act1Op = useTransform(smooth, [0.00, 0.05, 0.22, 0.30], [0, 1, 1, 0]);
  const act2Op = useTransform(smooth, [0.25, 0.32, 0.50, 0.58], [0, 1, 1, 0]);
  const act3Op = useTransform(smooth, [0.53, 0.60, 0.74, 0.82], [0, 1, 1, 0]);
  const act4Op = useTransform(smooth, [0.78, 0.85, 1.00, 1.00], [0, 1, 1, 1]);

  /* Pequeno deslocamento Y por ato (entrada de baixo pra cima) */
  const act1Y = useTransform(smooth, [0.00, 0.05], [24, 0]);
  const act2Y = useTransform(smooth, [0.25, 0.32], [24, 0]);
  const act3Y = useTransform(smooth, [0.53, 0.60], [24, 0]);
  const act4Y = useTransform(smooth, [0.78, 0.85], [24, 0]);

  /* Barra de progresso vertical (indicador discreto) */
  const progressScaleY = useTransform(smooth, [0, 1], [0, 1]);

  /* --- Reduced motion: estado final estático --- */
  if (reducedMotion) {
    const finalAct = ACTS[ACTS.length - 1];
    return (
      <section
        ref={ref}
        className="swan-scroll swan-scroll--reduced"
        aria-label="A marca SWN"
      >
        <div className="swan-scroll-sticky swan-scroll-sticky--reduced">
          <div className="swan-scroll-inner">
            <div className="swan-scroll-act swan-scroll-act--static">
              <span className="swan-scroll-act-num">{finalAct.num} / 04</span>
              <h2 className="swan-scroll-act-word">{finalAct.word}</h2>
              <p className="swan-scroll-act-caption">{finalAct.caption}</p>
            </div>

            <div className="swan-scroll-stage">
              <div className="swan-scroll-halo" style={{ opacity: 1 }} />
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                className="swan-scroll-svg"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="scrollSwanFillStatic" cx="50%" cy="55%" r="60%">
                    <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.1" />
                  </radialGradient>
                </defs>
                <path d={SWAN_PATH} fill="url(#scrollSwanFillStatic)" fillRule="evenodd" />
                <path
                  d={SWAN_PATH}
                  fill="none"
                  stroke="#83DFE9"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fillRule="evenodd"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="swan-scroll"
      aria-label="A marca SWN sendo desenhada"
    >
      <div className="swan-scroll-sticky">
        {/* Flash do clímax — vive dentro do sticky para acompanhar o frame */}
        <motion.div
          className="swan-scroll-flash"
          style={{ opacity: flashOpacity }}
          aria-hidden="true"
        />

        <div className="swan-scroll-inner">
          {/* Coluna esquerda: ATOS (palavras grandes em cross-fade) */}
          <div className="swan-scroll-acts" aria-hidden="true">
            {/* Indicador de progresso vertical */}
            <div className="swan-scroll-progress">
              <motion.span
                className="swan-scroll-progress-bar"
                style={{ scaleY: progressScaleY }}
              />
            </div>

            <div className="swan-scroll-acts-stack">
              {[
                { ...ACTS[0], op: act1Op, y: act1Y },
                { ...ACTS[1], op: act2Op, y: act2Y },
                { ...ACTS[2], op: act3Op, y: act3Y },
                { ...ACTS[3], op: act4Op, y: act4Y }
              ].map((act) => (
                <motion.div
                  key={act.num}
                  className="swan-scroll-act"
                  style={{ opacity: act.op, y: act.y }}
                >
                  <span className="swan-scroll-act-num">{act.num} / 04</span>
                  <h2 className="swan-scroll-act-word">{act.word}</h2>
                  <p className="swan-scroll-act-caption">{act.caption}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Coluna direita: o palco do cisne */}
          <div className="swan-scroll-stage">
            <motion.div
              className="swan-scroll-halo"
              style={{ opacity: haloOpacity, scale: haloScale }}
            />

            {/* Anel de clímax */}
            <motion.div
              className="swan-scroll-pulse-ring"
              style={{ scale: ringScale, opacity: ringOpacity }}
              aria-hidden="true"
            />

            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className="swan-scroll-svg"
              aria-hidden="true"
            >
              <defs>
                <filter id="scrollSwanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="scrollSwanGlowSoft" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="14" result="b2" />
                  <feMerge>
                    <feMergeNode in="b2" />
                  </feMerge>
                </filter>
                <linearGradient id="scrollSwanStroke" x1="0.1" y1="0" x2="0.9" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#83DFE9" />
                  <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.7" />
                </linearGradient>
                <radialGradient id="scrollSwanFill" cx="50%" cy="55%" r="60%">
                  <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              {/* Fill (preenchimento radial) */}
              <motion.path
                d={SWAN_PATH}
                fill="url(#scrollSwanFill)"
                fillRule="evenodd"
                style={{ opacity: fillOpacity }}
              />

              {/* Echo stroke — atrás, mais grosso/blur, dá densidade ao traço */}
              <motion.path
                d={SWAN_PATH}
                fill="none"
                stroke="rgba(131, 223, 233, 0.4)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fillRule="evenodd"
                vectorEffect="non-scaling-stroke"
                filter="url(#scrollSwanGlowSoft)"
                style={{ pathLength: strokeLen }}
              />

              {/* Main stroke — gradiente, desenho principal */}
              <motion.path
                d={SWAN_PATH}
                fill="none"
                stroke="url(#scrollSwanStroke)"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fillRule="evenodd"
                vectorEffect="non-scaling-stroke"
                filter="url(#scrollSwanGlow)"
                style={{ pathLength: strokeLen }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwanScrollDraw;

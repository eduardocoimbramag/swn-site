import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
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
 * Cinema Frames v2 — Barra contínua + Atos cumulativos + Pulse por reveal.
 *
 * Diferente da v1, os 4 atos não fazem cross-fade no mesmo lugar:
 * eles são empilhados e revelados conforme a barra de progresso (que percorre
 * a seção inteira) atravessa cada marcador. Cada reveal dispara um pulse no
 * cisne. Atos revelados permanecem visíveis (estado cumulativo).
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

const REVEAL_POINTS = [0.05, 0.32, 0.60, 0.88];
const PULSE_DURATION_MS = 1600;

const SwanScrollDraw = () => {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28, mass: 0.8 });

  /* --- Curvas mantidas da v1 --- */
  const strokeLen     = useTransform(smooth, [0.06, 0.78], [0, 1]);
  const fillOpacity   = useTransform(smooth, [0.62, 0.86], [0, 1]);
  const haloOpacity   = useTransform(smooth, [0, 0.5, 0.85, 1], [0.2, 0.7, 1, 0.85]);
  const haloScale     = useTransform(smooth, [0, 0.5, 1], [0.95, 1.05, 1.15]);
  const flashOpacity  = useTransform(smooth, [0.86, 0.89, 0.92], [0, 0.18, 0]);

  /* Barra de progresso (preenche a seção inteira) */
  const progressScaleY = useTransform(smooth, [0, 1], [0, 1]);

  /* Estado cumulativo dos atos revelados */
  const [revealed, setRevealed] = useState([false, false, false, false]);
  const prevRevealedCount = useRef(0);
  const [pulses, setPulses] = useState([]);

  useMotionValueEvent(smooth, 'change', (value) => {
    setRevealed((prev) => {
      const next = REVEAL_POINTS.map((p, i) => prev[i] || value >= p);
      return next.some((v, i) => v !== prev[i]) ? next : prev;
    });
  });

  /* Dispara um novo pulse cada vez que a contagem de revealed cresce */
  useEffect(() => {
    const count = revealed.filter(Boolean).length;
    if (count > prevRevealedCount.current) {
      const id = Date.now() + Math.random();
      setPulses((p) => [...p, id]);
      const timer = setTimeout(() => {
        setPulses((p) => p.filter((x) => x !== id));
      }, PULSE_DURATION_MS);
      prevRevealedCount.current = count;
      return () => clearTimeout(timer);
    }
    prevRevealedCount.current = count;
  }, [revealed]);

  /* --- Reduced motion: estado final estático --- */
  if (reducedMotion) {
    return (
      <section
        ref={ref}
        className="swan-scroll swan-scroll--reduced"
        aria-label="A marca SWN"
      >
        <div className="swan-scroll-sticky swan-scroll-sticky--reduced">
          <div className="swan-scroll-inner">
            <div className="swan-scroll-progress-rail" aria-hidden="true" />

            <div className="swan-scroll-acts">
              {ACTS.map((act) => (
                <div key={act.num} className="swan-scroll-act is-revealed">
                  <h3 className="swan-scroll-act-word">{act.word}</h3>
                  <p className="swan-scroll-act-caption">{act.caption}</p>
                </div>
              ))}
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
          {/* Coluna 1: trilho de progresso full-height */}
          <div className="swan-scroll-progress-rail" aria-hidden="true">
            <motion.span
              className="swan-scroll-progress-fill"
              style={{ scaleY: progressScaleY }}
            />
            {REVEAL_POINTS.map((p, i) => (
              <span
                key={i}
                className={`swan-scroll-progress-marker ${revealed[i] ? 'is-reached' : ''}`}
                style={{ top: `${p * 100}%` }}
              />
            ))}
          </div>

          {/* Coluna 2: ATOS empilhados, revelados cumulativamente */}
          <div className="swan-scroll-acts">
            {ACTS.map((act, i) => (
              <div
                key={act.num}
                className={`swan-scroll-act ${revealed[i] ? 'is-revealed' : ''}`}
                aria-current={revealed[i] ? 'step' : undefined}
              >
                <h3 className="swan-scroll-act-word">{act.word}</h3>
                <p className="swan-scroll-act-caption">{act.caption}</p>
              </div>
            ))}
          </div>

          {/* Coluna 3: o palco do cisne */}
          <div className="swan-scroll-stage">
            <motion.div
              className="swan-scroll-halo"
              style={{ opacity: haloOpacity, scale: haloScale }}
            />

            {/* Pulses sobrepostos — um a cada reveal */}
            {pulses.map((id) => (
              <motion.div
                key={id}
                className="swan-scroll-pulse-ring"
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              />
            ))}

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

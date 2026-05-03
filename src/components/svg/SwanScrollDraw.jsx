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

const SwanScrollDraw = () => {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 28, mass: 0.8 });

  const strokeLen     = useTransform(smooth, [0.08, 0.72], [0, 1]);
  const fillOpacity   = useTransform(smooth, [0.72, 0.88], [0, 1]);
  const titleOpacity  = useTransform(smooth, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const titleY        = useTransform(smooth, [0, 0.08], [40, 0]);
  const haloOpacity   = useTransform(smooth, [0.08, 0.4], [0, 1]);
  const narrativeOp   = useTransform(smooth, [0.88, 0.96], [0, 1]);
  const narrativeY    = useTransform(smooth, [0.88, 0.96], [20, 0]);

  if (reducedMotion) {
    return (
      <section
        ref={ref}
        className="swan-scroll swan-scroll--reduced"
        aria-label="A marca SWN"
      >
        <div className="swan-scroll-sticky">
          <div className="swan-scroll-title">
            <h2>
              Swan. <span className="cyan">Movimento que se desenha.</span>
            </h2>
            <p>
              Cada linha é traçada com intenção — assim como cada solução que entregamos.
            </p>
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
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fillRule="evenodd"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <p className="swan-scroll-narrative swan-scroll-narrative--static">
            Cada solução que entregamos é desenhada com a mesma atenção.
            <br />
            <span className="cyan">Linha por linha. Projeto por projeto.</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="swan-scroll"
      aria-label="A marca SWN"
    >
      <div className="swan-scroll-sticky">
        <motion.div
          className="swan-scroll-title"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h2>
            Swan. <span className="cyan">Movimento que se desenha.</span>
          </h2>
          <p>
            Cada linha é traçada com intenção — assim como cada solução que entregamos.
          </p>
        </motion.div>

        <div className="swan-scroll-stage">
          <motion.div
            className="swan-scroll-halo"
            style={{ opacity: haloOpacity }}
          />
          <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className="swan-scroll-svg"
            aria-hidden="true"
          >
            <defs>
              <filter id="scrollSwanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
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

            <motion.path
              d={SWAN_PATH}
              fill="url(#scrollSwanFill)"
              fillRule="evenodd"
              style={{ opacity: fillOpacity }}
            />

            <motion.path
              d={SWAN_PATH}
              fill="none"
              stroke="url(#scrollSwanStroke)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fillRule="evenodd"
              vectorEffect="non-scaling-stroke"
              filter="url(#scrollSwanGlow)"
              style={{ pathLength: strokeLen }}
            />
          </svg>
        </div>

        <motion.p
          className="swan-scroll-narrative"
          style={{ opacity: narrativeOp, y: narrativeY }}
        >
          Cada solução que entregamos é desenhada com a mesma atenção.
          <br />
          <span className="cyan">Linha por linha. Projeto por projeto.</span>
        </motion.p>
      </div>
    </section>
  );
};

export default SwanScrollDraw;

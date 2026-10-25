import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Título do Hero — "Onde a beleza encontra a ___."
 *
 * As palavras sobem uma a uma com blur (a mesma coreografia da Equipe) e o
 * trecho em gradiente recebe, de tempos em tempos, um brilho que atravessa a
 * linha. A última palavra troca como no rio: a rajada leva as letras para a
 * esquerda, começando pela última, e a próxima chega da direita, letra a
 * letra. A largura da palavra é medida e animada, então o ponto final desliza
 * junto em vez de pular. Quando a palavra assenta, uma linha d'água se
 * desenha embaixo dela e um reflexo de luz a percorre.
 *
 * A troca só corre com o título na tela e a aba ativa; com movimento reduzido
 * a palavra fica fixa.
 */

const swanEase = [0.22, 1, 0.36, 1];
const landEase = [0.25, 1, 0.5, 1];    // easeOutQuart: a letra pousa macia
const windEase = [0.55, 0, 0.75, 0.25]; // a rajada acelera ao levar a letra

const LEAD = ['Onde', 'a', 'beleza'];
const BRIDGE = ['encontra', 'a'];
const WORDS = ['performance', 'precisão', 'estratégia', 'tecnologia', 'conversão'];

const HOLD_MS = 3800;        // tempo de cada palavra em cena
const FIRST_IN_S = 0.5;      // a primeira chega logo depois de "encontra a"
const NEXT_IN_S = 0.4;       // as seguintes chegam quando a rajada já levou a anterior
const CHAR_STAGGER = 0.038;  // entre letras na chegada
const WIND_STAGGER = 0.022;  // na saída a rajada leva a palavra mais junta
const LINE_H = 16;           // altura da linha d'água (px)

const WORD = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(10px)' },
  show: (i) => ({
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.95, delay: 0.12 + i * 0.07, ease: swanEase },
    transitionEnd: { filter: 'none' }
  })
};

const CHAR = {
  enter: { opacity: 0, x: '0.45em', y: '0.3em', rotate: 10, filter: 'blur(10px)' },
  show: ({ i, delay }) => ({
    opacity: 1,
    x: '0em',
    y: '0em',
    rotate: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.95, delay: delay + i * CHAR_STAGGER, ease: landEase }
  }),
  exit: ({ i, n }) => ({
    opacity: 0,
    x: '-0.6em',
    y: '-0.34em',
    rotate: -14,
    filter: 'blur(8px)',
    transition: {
      default: { duration: 0.55, delay: (n - 1 - i) * WIND_STAGGER, ease: windEase },
      opacity: { duration: 0.36, delay: (n - 1 - i) * WIND_STAGGER, ease: 'easeIn' }
    }
  })
};

const LINE = {
  enter: { pathLength: 0, opacity: 0 },
  show: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, delay, ease: swanEase },
      opacity: { duration: 0.3, delay }
    }
  }),
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

/* reflexo: um trecho curto de luz que percorre a linha uma vez */
const GLINT = {
  enter: { pathLength: 0.18, pathOffset: -0.18, opacity: 0 },
  show: (delay) => ({
    pathLength: 0.18,
    pathOffset: 1,
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.5, delay: delay + 0.8, ease: [0.45, 0, 0.25, 1], times: [0, 0.15, 0.8, 1] }
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

/* Onda suave do tamanho exato da palavra (em px, sem escala — o traço
   anima igual em todos os navegadores) */
const wavePath = (w) => {
  const mid = LINE_H / 2;
  const amp = LINE_H * 0.2;
  const half = w / (Math.max(2, Math.round(w / 64)) * 2);
  let d = `M 0 ${mid} Q ${half / 2} ${mid - amp} ${half} ${mid}`;
  for (let x = half * 2; x <= w + 0.5; x += half) d += ` T ${x.toFixed(1)} ${mid}`;
  return d;
};

const chars = (word) => Array.from(word);

const HeroTitle = () => {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');

  const titleRef = useRef(null);
  const measureRef = useRef(null);
  const cycledRef = useRef(false);
  const shownRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState(null);
  const [running, setRunning] = useState(false);
  const width = useMotionValue('auto');

  /* Mede cada palavra (com as mesmas letras soltas da animação) — de novo
     quando as fontes carregam e quando o tamanho do título muda */
  useLayoutEffect(() => {
    const el = measureRef.current;
    const title = titleRef.current;
    if (!el || !title) return undefined;
    let alive = true;
    let raf = 0;
    const measure = () => {
      if (!alive) return;
      const next = Array.from(el.children, (c) => Math.ceil(c.getBoundingClientRect().width));
      setWidths((prev) => (prev && prev.every((v, i) => v === next[i]) ? prev : next));
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(title);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* A largura acompanha a palavra: anima na troca, ajusta direto na medição */
  useLayoutEffect(() => {
    if (!widths) return undefined;
    const target = widths[index];
    if (shownRef.current === null || shownRef.current === index) {
      shownRef.current = index;
      width.set(target);
      return undefined;
    }
    shownRef.current = index;
    const controls = animate(width, target, { duration: 1.05, delay: 0.08, ease: swanEase });
    return () => controls.stop();
  }, [widths, index, width]);

  /* A troca só corre com o título na tela e a aba ativa */
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;
    let inView = false;
    const sync = () => setRunning(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (reduced || !running) return undefined;
    const wait = cycledRef.current ? HOLD_MS : HOLD_MS + FIRST_IN_S * 1000 + 600;
    const id = setTimeout(() => {
      cycledRef.current = true;
      setIndex((i) => (i + 1) % WORDS.length);
    }, wait);
    return () => clearTimeout(id);
  }, [index, running, reduced]);

  const word = WORDS[index];
  const letters = chars(word);
  const delay = cycledRef.current ? NEXT_IN_S : FIRST_IN_S;
  const lineDelay = delay + letters.length * CHAR_STAGGER + 0.3;
  const lineW = widths?.[index];

  let wordIndex = 0;
  const words = (list, className) =>
    list.map((w, i) => (
      <React.Fragment key={w + i}>
        {i > 0 && ' '}
        <motion.span
          className={className}
          variants={WORD}
          custom={wordIndex}
          style={{ '--i': wordIndex++ }}
        >
          {w}
        </motion.span>
      </React.Fragment>
    ));

  return (
    <motion.h1
      ref={titleRef}
      className="hero-title"
      initial={reduced ? false : 'hidden'}
      animate="show"
    >
      <span className="sr-only">Onde a beleza encontra a {WORDS[0]}.</span>

      <span className="hero-title-visual" aria-hidden="true">
        <span className="hero-title-line">{words(LEAD, 'hero-word hero-word--grad')}</span>
        <span className="hero-title-line">{words(BRIDGE, 'hero-word')}</span>
        <span className="hero-title-line">
          <motion.span className="hero-rotator" style={{ width }}>
            <span className="hero-rotator-strut">{'​'}</span>
            <AnimatePresence initial={!reduced}>
              <motion.span
                key={index}
                className="hero-rotator-word"
                initial={reduced ? false : 'enter'}
                animate="show"
                exit="exit"
              >
                {letters.map((c, i) => (
                  <motion.span
                    key={i}
                    className="hero-rotator-char"
                    variants={CHAR}
                    custom={{ i, n: letters.length, delay }}
                  >
                    {c}
                  </motion.span>
                ))}

                {lineW ? (
                  <svg
                    className="hero-rotator-line"
                    width={lineW}
                    height={LINE_H}
                    viewBox={`0 0 ${lineW} ${LINE_H}`}
                  >
                    <defs>
                      <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#83DFE9" stopOpacity="0" />
                        <stop offset="18%" stopColor="#83DFE9" stopOpacity="0.85" />
                        <stop offset="82%" stopColor="#83DFE9" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={wavePath(lineW)}
                      fill="none"
                      stroke={`url(#${uid}-line)`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      variants={LINE}
                      custom={lineDelay}
                    />
                    <motion.path
                      d={wavePath(lineW)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      variants={GLINT}
                      custom={lineDelay}
                    />
                  </svg>
                ) : null}
              </motion.span>
            </AnimatePresence>
          </motion.span>
          <motion.span className="hero-word hero-title-dot" variants={WORD} custom={wordIndex + 1}>
            .
          </motion.span>
        </span>
      </span>

      {/* régua invisível: a largura de cada palavra, letra a letra */}
      <span ref={measureRef} className="hero-rotator-measure" aria-hidden="true">
        {WORDS.map((w) => (
          <span key={w}>
            {chars(w).map((c, i) => (
              <span key={i} className="hero-rotator-char">
                {c}
              </span>
            ))}
          </span>
        ))}
      </span>
    </motion.h1>
  );
};

export default HeroTitle;

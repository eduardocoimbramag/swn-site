import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { services } from '../data/services';
import { prefillContactInterest } from '../lib/contactBridge';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { SoftwareScene, WebScene, DesignScene } from './svg/ServiceScenes';

/**
 * Nossos Serviços — o título no centro da tela e um baralho que chega por
 * cima dele, em carrossel diagonal, guiado pelo scroll.
 *
 * Roteiro (com a cena fixa na tela):
 *   1. Título  — as letras sobem do desfoque enquanto a seção entra.
 *   2. Voo     — cada card chega em arco pela diagonal, inclinado em 3D e com
 *                rastro de movimento; ao pousar, um reflexo atravessa o vidro.
 *   3. Pilha   — quem já pousou recua pela mesma diagonal, menor, mais escuro
 *                e fora de foco. O título recua junto, como numa troca de
 *                foco de câmera.
 *
 * `pos` é a fonte única: −1 = nenhum card · i = card i no topo. Tudo deriva
 * dela via motion values — nenhum re-render do React por frame.
 */

const N = services.length;
const TITLE = [
  { word: 'Nossos', accent: false },
  { word: 'Serviços', accent: true }
];
const TITLE_TEXT = TITLE.map((t) => t.word).join(' ');
const TITLE_LEN = TITLE_TEXT.replace(/\s/g, '').length;

const SCENES = {
  software: SoftwareScene,
  web: WebScene,
  design: DesignScene
};

/* Roteiro em vh de rolagem com a cena fixa — define a altura da seção */
const INTRO_VH = 35;  // só o título, assentado
const STEP_VH = 80;   // cada card: voo + pouso + leitura
const OUTRO_VH = 30;  // a pilha completa antes de soltar
const PINNED_VH = INTRO_VH + N * STEP_VH + OUTRO_VH;
const Q0 = INTRO_VH / PINNED_VH;
const Q1 = 1 - OUTRO_VH / PINNED_VH;

/* Coreografia */
const HOLD = 0.16;          // fração de cada passo com o card parado (leitura)
const STACK_SCALE = 0.055;  // cada camada da pilha encolhe…
const STACK_TILT = -3.2;    // …gira (deg)…
const STACK_BLUR = 1.1;     // …e sai de foco (px por camada)
const FLIGHT = { rx: 34, ry: -26, rz: 14, arc: 90, grow: 0.1, blur: 9 };
const STAGE_PAD = 20;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (t) => t * t * (3 - 2 * t);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Progresso do scroll (u) → posição do baralho. `s` é onde a cena fixa. */
const deckPosition = (u, s) => {
  const q = (u - s) / (1 - s);
  const t = clamp01((q - Q0) / (Q1 - Q0)) * N;
  const step = Math.min(N - 1, Math.floor(t));
  return step - 1 + easeInOutCubic(clamp01((t - step - HOLD) / (1 - HOLD * 2)));
};

/* Inverso: progresso em que o card i está assentado no topo */
const progressFor = (i, s) => s + (Q0 + ((i + 1) / N) * (Q1 - Q0)) * (1 - s);

/* As letras do título sobem enquanto a seção entra na tela */
const titleReveal = (u, s) => clamp01((u - s * 0.2) / (s * 0.8));

/* Pose de um card pela distância até o topo (local = pos − i) */
const cardPose = (local, L) => {
  const { dx, dy, travel, fit, ox, oy, step, lite } = L;
  let x;
  let y;
  let rx = 0;
  let ry = 0;
  let rz;
  let scale;
  let opacity = 1;
  let blur = 0;
  let glare = 140;
  let depth = 0;

  if (local < 0) {
    /* em voo: arco sobre a diagonal, inclinado, endireitando ao pousar */
    const a = Math.min(1, -local);
    const arc = Math.sin(a * Math.PI) * FLIGHT.arc;
    x = dx * travel * a + dy * arc;
    y = dy * travel * a - dx * arc;
    rx = FLIGHT.rx * a;
    ry = FLIGHT.ry * a;
    rz = FLIGHT.rz * a;
    scale = 1 + FLIGHT.grow * a;
    opacity = 1 - smoothstep(clamp01((a - 0.62) / 0.38));
    if (!lite) blur = FLIGHT.blur * smoothstep(clamp01((a - 0.08) / 0.92));
    /* o reflexo atravessa o vidro na aproximação final */
    glare = -140 + 280 * easeInOutCubic(clamp01(1 - a / 0.6));
  } else {
    /* na pilha: recua pela mesma diagonal */
    const d = Math.min(local, N);
    x = -dx * step * d;
    y = -dy * step * d;
    rz = STACK_TILT * d;
    scale = 1 - STACK_SCALE * d;
    opacity = 1 - smoothstep(clamp01((d - (N - 0.6)) / 0.6));
    if (!lite) blur = Math.min(d, 2) * STACK_BLUR;
    depth = Math.min(d, 3);
  }

  return {
    transform:
      `translate(-50%, -50%) translate3d(${(x + ox).toFixed(2)}px, ${(y + oy).toFixed(2)}px, 0) ` +
      `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(3)}deg) ` +
      `scale(${(scale * fit).toFixed(4)})`,
    opacity,
    blur,
    glare,
    depth
  };
};

/* ---------- Título ---------- */
const TitleChar = ({ ch, order, reveal, liteRef }) => {
  const lead = TITLE_LEN > 1 ? order / (TITLE_LEN - 1) : 0;
  const e = useTransform(reveal, (r) => easeOutCubic(clamp01(r * 1.6 - lead * 0.6)));
  const y = useTransform(e, (v) => `${((1 - v) * 62).toFixed(2)}%`);
  const rotate = useTransform(e, (v) => (1 - v) * 9);
  const filter = useTransform(e, (v) =>
    liteRef.current.lite || v > 0.985 ? 'none' : `blur(${((1 - v) * 16).toFixed(2)}px)`
  );
  return (
    <motion.span className="services-title-char" style={{ y, rotate, opacity: e, filter }}>
      {ch}
    </motion.span>
  );
};

/* ---------- Card ---------- */
const ServiceCard = ({ service, index, pos, layout, L, live, seen, interactive, onFocusCard }) => {
  const ref = useRef(null);
  const Scene = SCENES[service.key];

  const pose = useTransform([pos, layout], ([p]) => cardPose(p - index, L.current));
  const tiltX = useSpring(0, { stiffness: 150, damping: 18, mass: 0.6 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 18, mass: 0.6 });
  const transform = useTransform(
    [pose, tiltX, tiltY],
    ([P, tx, ty]) => `${P.transform} rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`
  );
  const opacity = useTransform(pose, (P) => P.opacity);
  const filter = useTransform(pose, (P) => (P.blur > 0.05 ? `blur(${P.blur.toFixed(2)}px)` : 'none'));
  const glare = useTransform(pose, (P) => P.glare.toFixed(1));
  const depth = useTransform(pose, (P) => P.depth.toFixed(3));

  /* Card do topo: inclina com o cursor e a luz o acompanha */
  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || !live || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = clamp01((e.clientX - r.left) / r.width);
    const py = clamp01((e.clientY - r.top) / r.height);
    tiltX.set((0.5 - py) * 7);
    tiltY.set((px - 0.5) * 9);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const onCta = () => {
    prefillContactInterest(service.title);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.article
      ref={ref}
      className={`service-card${live ? ' is-live' : ''}${seen ? ' is-seen' : ''}`}
      style={interactive ? { transform, opacity, filter, '--glare': glare, '--depth': depth } : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
      onFocusCapture={interactive ? () => onFocusCard(index) : undefined}
      aria-labelledby={`service-${service.key}-title`}
    >
      <div className="service-card-body">
        <h3 id={`service-${service.key}-title`} className="service-card-title">
          <span className="service-card-title-inner">{service.title}</span>
        </h3>
        <p className="service-card-desc">{service.description}</p>
        <ul className="service-card-list">
          {service.items.map((item, k) => (
            <li key={item} style={{ '--k': k }}>
              <span className="service-card-bullet" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="service-card-cta" onClick={onCta}>
        <span className="service-card-cta-label">Falar sobre {service.title.split(' ')[0]}</span>
        <span className="service-card-cta-icon" aria-hidden="true">
          <FiArrowUpRight size={17} />
        </span>
      </button>

      <div className="service-card-visual">{Scene && <Scene />}</div>

      <span className="service-card-border" aria-hidden="true" />
      <span className="service-card-spot" aria-hidden="true" />
      <span className="service-card-glare" aria-hidden="true" />
      <span className="service-card-grain" aria-hidden="true" />
      <span className="service-card-dim" aria-hidden="true" />
    </motion.article>
  );
};

/* ---------- Seção ---------- */
const Services = () => {
  const reduced = usePrefersReducedMotion();
  const interactive = !reduced;

  const sectionRef = useRef(null);
  const deckRef = useRef(null);
  const L = useRef({ s: 0.2, dx: 0.83, dy: 0.56, travel: 1400, fit: 1, ox: 0, oy: 0, step: 54, lite: false });
  const layout = useMotionValue(0); // muda a cada medição: força recalcular as poses
  const [deck, setDeck] = useState({ live: -1, seen: -1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4, restDelta: 0.0002 });
  const pos = useTransform([smooth, layout], ([u]) => deckPosition(u, L.current.s));
  const reveal = useTransform([smooth, layout], ([u]) => titleReveal(u, L.current.s));

  /* O título recua em profundidade conforme os cards o cobrem */
  const covered = useTransform(pos, (p) => smoothstep(clamp01(p + 1)));
  const stacked = useTransform(pos, (p) => clamp01((p + 1) / N));
  const titleScale = useTransform(stacked, (v) => 1 - 0.08 * v);
  const titleY = useTransform(stacked, (v) => -34 * v);
  const titleOpacity = useTransform([covered, stacked], ([c, v]) => 1 - 0.38 * c - 0.2 * v);
  const titleFilter = useTransform([covered, layout], ([c]) => {
    const b = L.current.lite ? 0 : 7 * c;
    return b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
  });

  useMotionValueEvent(pos, 'change', (p) => {
    const live = p < -0.5 ? -1 : Math.min(N - 1, Math.round(p));
    const seen = Math.min(N - 1, Math.floor(p + 0.3));
    setDeck((cur) => (cur.live === live && cur.seen === seen ? cur : { live, seen }));
  });

  /* Medidas: onde a cena fixa, direção da diagonal e escala que cabe no palco */
  useEffect(() => {
    if (!interactive) return undefined;
    const section = sectionRef.current;
    const stage = deckRef.current;
    if (!section || !stage) return undefined;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const cards = Array.from(stage.children);
      const cardW = Math.max(1, ...cards.map((c) => c.offsetWidth));
      const cardH = Math.max(1, ...cards.map((c) => c.offsetHeight));
      const narrow = vw < 760; // mesmo corte do layout empilhado no CSS
      const lite =
        window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches ||
        (navigator.hardwareConcurrency || 8) <= 4;

      /* mais vertical no celular, mais aberta no desktop */
      const angle = ((narrow ? 58 : 34) * Math.PI) / 180;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const step = narrow ? 34 : 54;
      const spread = step * (N - 1);
      const fit = Math.min(
        1,
        (H - STAGE_PAD * 2 - dy * spread) / cardH,
        (W - STAGE_PAD * 2 - dx * spread) / cardW
      );

      L.current = {
        s: Math.min(0.9, vh / Math.max(1, section.offsetHeight)),
        dx,
        dy,
        travel: Math.hypot(vw, vh) * 0.78,
        fit: Math.max(0.55, fit),
        /* a pilha inteira centrada no palco, não só o card do topo */
        ox: (dx * spread) / 2,
        oy: (dy * spread) / 2,
        step,
        lite
      };
      section.dataset.lite = lite ? 'true' : 'false';
      layout.set(layout.get() + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(stage);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [interactive, layout]);

  /* Tab até um card escondido na pilha: o baralho vai até ele. Fica para o
     próximo frame porque o navegador rola até o elemento focado depois do
     evento de foco, e sobrescreveria esta rolagem. */
  const onFocusCard = (i) => {
    if (i === deck.live) return;
    requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const u = progressFor(i, L.current.s);
      window.scrollTo({ top: top - window.innerHeight + u * section.offsetHeight + 1, behavior: 'instant' });
    });
  };

  let order = 0;
  const title = (
    <h2 className="services-title" aria-label={TITLE_TEXT}>
      <motion.span
        className="services-title-inner"
        aria-hidden="true"
        style={
          interactive
            ? { scale: titleScale, y: titleY, opacity: titleOpacity, filter: titleFilter }
            : undefined
        }
      >
        {TITLE.map(({ word, accent }) => (
          <span key={word} className={`services-title-word${accent ? ' is-accent' : ''}`}>
            {Array.from(word).map((ch) => {
              const o = order++;
              return interactive ? (
                <TitleChar key={o} ch={ch} order={o} reveal={reveal} liteRef={L} />
              ) : (
                <span key={o} className="services-title-char">
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </h2>
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`services${interactive ? '' : ' services--static'}`}
      style={interactive ? { height: `calc(100vh + ${PINNED_VH}vh)` } : undefined}
    >
      <div className="services-sticky">
        {title}
        <div ref={deckRef} className="services-deck">
          {services.map((service, i) => (
            <ServiceCard
              key={service.key}
              service={service}
              index={i}
              pos={pos}
              layout={layout}
              L={L}
              live={interactive && deck.live === i}
              seen={!interactive || deck.seen >= i}
              interactive={interactive}
              onFocusCard={onFocusCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

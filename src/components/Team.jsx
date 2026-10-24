import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { FiArrowUpRight, FiPause, FiPlay } from 'react-icons/fi';
import { team } from '../data/team';
import { prefillContactInterest } from '../lib/contactBridge';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import TeamArt from './svg/TeamArt';

/**
 * Nosso time — um baralho de cards que gira a cada 10s: o profissional da
 * frente sai pela esquerda e se encaixa no fim da fila enquanto os outros
 * avançam. A copy da esquerda troca junto, com o marca-texto revelando o
 * trecho em destaque.
 *
 * O timer só corre com a seção visível e pausa no hover, no foco por teclado
 * e no botão de pausa. Com movimento reduzido a troca automática começa
 * desligada.
 */

const swanEase = [0.22, 1, 0.36, 1];
const ROTATE_MS = 10000; // tempo de cada profissional na frente
const SWAP_S = 1.5;      // duração da troca do card da frente
const COUNT = team.length;

/* Poses do baralho, da frente (0) ao fundo. x/y em % do próprio card; a
   rotação pivota na base e abre o leque para a direita. */
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, dim: 0, z: 30 },
  { x: 9, y: -2, rotate: 3.5, scale: 0.93, dim: 0.42, z: 20 },
  { x: 18, y: -4, rotate: 7, scale: 0.86, dim: 0.7, z: 10 }
];
/* Ponto alto do arco: o card sai pela esquerda antes de ir para o fim da fila
   (e faz o caminho inverso quando a troca volta) */
const APEX = { x: -34, y: 3, rotate: -8, scale: 0.95 };
const APEX_AT = 0.44; // fração da troca em que o card passa pelo ponto alto

const slotOf = (i, active) => (((i - active) % COUNT) + COUNT) % COUNT;
const pct = (v) => `${v}%`;
const pad = (n) => String(n).padStart(2, '0');

/* Destino, coreografia, z-index e escurecimento de cada card para o estado
   atual do baralho. `early` = a troca ainda não passou do ponto alto do arco. */
const DIM_DEFAULT = { duration: 1, delay: 0.2, ease: swanEase };
const cardMotion = (i, deck, revealed, early) => {
  const slot = slotOf(i, deck.active);
  const s = SLOTS[Math.min(slot, SLOTS.length - 1)];
  const pose = { x: pct(s.x), y: pct(s.y), rotate: s.rotate, scale: s.scale, opacity: slot < SLOTS.length ? 1 : 0 };

  if (!revealed) {
    return {
      animate: { x: '0%', y: '7%', rotate: 0, scale: 0.94, opacity: 0 },
      transition: { duration: 0 },
      z: s.z,
      dim: { opacity: 0, transition: { duration: 0 } }
    };
  }

  /* primeira aparição: o leque abre do fundo para a frente */
  if (deck.dir === 0) {
    return {
      animate: pose,
      transition: { duration: 1.3, delay: 0.15 + 0.14 * (COUNT - 1 - slot), ease: swanEase },
      z: s.z,
      dim: { opacity: s.dim, transition: DIM_DEFAULT }
    };
  }

  const prev = slotOf(i, deck.active - deck.dir);
  const tucking = deck.dir === 1 && prev === 0;          // frente → fim da fila
  const pulling = deck.dir === -1 && prev === COUNT - 1; // fim da fila → frente

  if (tucking || pulling) {
    /* o z-index vira no ponto alto do arco: na ida o card passa por trás do
       baralho, na volta ele reaparece por cima */
    let z = s.z;
    if (early) z = tucking ? 40 : 5;
    return {
      animate: {
        x: [null, pct(APEX.x), pose.x],
        y: [null, pct(APEX.y), pose.y],
        rotate: [null, APEX.rotate, pose.rotate],
        scale: [null, APEX.scale, pose.scale],
        opacity: pose.opacity
      },
      transition: {
        default: { duration: SWAP_S, times: [0, APEX_AT, 1], ease: [[0.55, 0, 0.3, 1], swanEase] },
        opacity: { duration: 0.4 }
      },
      z,
      /* aceso durante o arco; só afunda no escuro ao passar para trás */
      dim: {
        opacity: s.dim,
        transition: tucking
          ? { duration: 0.8, delay: SWAP_S * APEX_AT, ease: swanEase }
          : { duration: 0.6, ease: swanEase }
      }
    };
  }

  /* os demais avançam (ou recuam) um lugar, logo depois do arco começar */
  return {
    animate: pose,
    transition: { duration: 1.15, delay: 0.22, ease: swanEase },
    z: s.z,
    dim: { opacity: s.dim, transition: DIM_DEFAULT }
  };
};

/* ---------- Copy ---------- */
const WORD = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(10px)' },
  show: (i) => ({
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 0.85, delay: 0.06 + i * 0.055, ease: swanEase }
  })
};
const MARK = {
  hidden: { backgroundSize: '0% 100%' },
  show: (i) => ({
    backgroundSize: '100% 100%',
    transition: { duration: 0.8, delay: 0.32 + i * 0.055, ease: [0.65, 0, 0.35, 1] }
  })
};
const FADE = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay, ease: swanEase }
  })
};
const SLIDE_EXIT = {
  opacity: 0,
  y: -16,
  filter: 'blur(8px)',
  transition: { duration: 0.42, ease: [0.4, 0, 1, 1] }
};

/* Headline em palavras; os trechos `mark` ganham o marca-texto, que só passa
   depois que as palavras dele começam a subir */
const Headline = ({ segments, animated = false }) => {
  let index = 0;
  const word = (text, key) =>
    animated ? (
      <motion.span key={key} className="team-word" variants={WORD} custom={index++}>
        {text}
      </motion.span>
    ) : (
      <span key={key} className="team-word">
        {text}
      </span>
    );

  return (
    <p className="team-headline">
      {segments.map((seg, si) => {
        const first = index;
        const words = seg.text.trim().split(/\s+/);
        const content = words.flatMap((w, wi) => (wi ? [' ', word(w, wi)] : [word(w, wi)]));
        const spacer = si < segments.length - 1 ? ' ' : null;
        if (!seg.mark) {
          return (
            <React.Fragment key={si}>
              {content}
              {spacer}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={si}>
            {animated ? (
              <motion.span className="team-mark" variants={MARK} custom={first}>
                {content}
              </motion.span>
            ) : (
              <span className="team-mark">{content}</span>
            )}
            {spacer}
          </React.Fragment>
        );
      })}
    </p>
  );
};

const goToContact = (interest) => {
  prefillContactInterest(interest);
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

const Team = () => {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');

  const sectionRef = useRef(null);
  const innerRefs = useRef([]);
  const fillRefs = useRef([]);
  const tabRefs = useRef([]);
  const touchRef = useRef(null);

  const [deck, setDeck] = useState({ active: 0, dir: 0, seq: 0 });
  /* última troca que já passou do ponto alto (framer não anima z-index) */
  const [apexSeq, setApexSeq] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(reduced);

  const activeRef = useRef(0);
  const elapsedRef = useRef(0);
  const engagedRef = useRef(false); // seção bem visível: o timer pode correr
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  const member = team[deck.active];

  const go = useCallback((next) => {
    setDeck((d) => {
      const target = ((next % COUNT) + COUNT) % COUNT;
      if (target === d.active) return d;
      const dir = target === (d.active + 1) % COUNT ? 1 : -1;
      return { active: target, dir, seq: d.seq + 1 };
    });
  }, []);

  useEffect(() => setPaused(reduced), [reduced]);

  /* Revela na primeira vez que a seção aparece; o timer só corre com ela
     bem visível */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        engagedRef.current = entry.intersectionRatio >= 0.35;
        if (entry.intersectionRatio >= 0.2) setRevealed(true);
      },
      { threshold: [0, 0.2, 0.35, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Troca de profissional: zera o timer, as barras e a inclinação do card */
  useEffect(() => {
    activeRef.current = deck.active;
    elapsedRef.current = 0;
    fillRefs.current.forEach((el) => {
      if (el) el.style.transform = 'scaleX(0)';
    });
    innerRefs.current.forEach((el) => {
      el?.style.setProperty('--rx', '0deg');
      el?.style.setProperty('--ry', '0deg');
    });
  }, [deck.active]);

  useEffect(() => {
    const id = setTimeout(() => setApexSeq(deck.seq), SWAP_S * APEX_AT * 1000);
    return () => clearTimeout(id);
  }, [deck.seq]);

  /* Timer de 10s — também desenha a barra do profissional atual */
  useEffect(() => {
    if (!revealed || !inView) return undefined;
    let raf = 0;
    let last = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(100, now - last) : 0;
      last = now;
      if (!paused && engagedRef.current && !hoverRef.current && !focusRef.current) {
        elapsedRef.current += dt;
      }
      const progress = Math.min(1, elapsedRef.current / ROTATE_MS);
      const fill = fillRefs.current[activeRef.current];
      if (fill) fill.style.transform = `scaleX(${progress.toFixed(4)})`;
      if (progress >= 1) {
        elapsedRef.current = 0;
        go(activeRef.current + 1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, inView, paused, go]);

  /* ---------- Interações ---------- */
  const onStageEnter = (e) => {
    if (e.pointerType === 'mouse') hoverRef.current = true;
  };
  const onStageLeave = () => {
    hoverRef.current = false;
  };

  const onFocus = (e) => {
    try {
      if (e.target.matches(':focus-visible')) focusRef.current = true;
    } catch {
      focusRef.current = true;
    }
  };
  const onBlur = (e) => {
    if (!sectionRef.current?.contains(e.relatedTarget)) focusRef.current = false;
  };

  /* inclinação 3D + luz que segue o mouse no card da frente */
  const onDeckMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = innerRefs.current[activeRef.current];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - py) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const onDeckLeave = () => {
    innerRefs.current.forEach((el) => {
      el?.style.setProperty('--rx', '0deg');
      el?.style.setProperty('--ry', '0deg');
    });
  };

  /* swipe no celular: para a esquerda chama o próximo, para a direita volta */
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      go(activeRef.current + (dx < 0 ? 1 : -1));
    }
  };

  const onTabsKey = (e) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    let next;
    if (e.key in keys) next = (activeRef.current + keys[e.key] + COUNT) % COUNT;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = COUNT - 1;
    else return;
    e.preventDefault();
    go(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="team"
        ref={sectionRef}
        className="team"
        aria-labelledby={`${uid}-title`}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className="team-grid">
          <div className="team-copy">
            <motion.h2
              id={`${uid}-title`}
              className="eyebrow team-eyebrow"
              variants={FADE}
              custom={0}
              initial="hidden"
              animate={revealed ? 'show' : 'hidden'}
            >
              Nosso time
            </motion.h2>

            {/* as cópias fantasmas reservam a altura da maior copy: nada pula
                quando o texto troca */}
            <div
              id={`${uid}-panel`}
              className="team-copy-stack"
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${deck.active}`}
              aria-live={paused ? 'polite' : 'off'}
            >
              {team.map((m) => (
                <div key={m.key} className="team-copy-ghost" aria-hidden="true">
                  <Headline segments={m.headline} />
                  <p className="team-lead">{m.description}</p>
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={member.key}
                  className="team-copy-slide"
                  initial="hidden"
                  animate={revealed ? 'show' : 'hidden'}
                  exit={SLIDE_EXIT}
                >
                  <Headline segments={member.headline} animated />
                  <motion.p className="team-lead" variants={FADE} custom={0.4}>
                    {member.description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="team-actions"
              variants={FADE}
              custom={0.55}
              initial="hidden"
              animate={revealed ? 'show' : 'hidden'}
            >
              <button type="button" className="btn-primary team-cta" onClick={() => goToContact(member.interest)}>
                Solicitar orçamento
                <FiArrowUpRight className="btn-arrow" size={17} aria-hidden="true" />
              </button>
              <div className="team-note-stack">
                {team.map((m) => (
                  <p key={m.key} className="team-note team-note--ghost" aria-hidden="true">
                    {m.note}
                  </p>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={member.key}
                    className="team-note"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55, ease: swanEase } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                  >
                    {member.note}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="team-stage" onPointerEnter={onStageEnter} onPointerLeave={onStageLeave}>
            <div
              className="team-deck"
              onPointerMove={onDeckMove}
              onPointerLeave={onDeckLeave}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {team.map((m, i) => {
                const slot = slotOf(i, deck.active);
                const front = slot === 0;
                const { animate, transition, z, dim } = cardMotion(i, deck, revealed, apexSeq !== deck.seq);
                const title = m.name || m.role;

                return (
                  <motion.article
                    key={m.key}
                    className="team-card"
                    style={{ zIndex: z }}
                    aria-hidden={!front}
                    initial={false}
                    animate={animate}
                    transition={transition}
                  >
                    {/* o tilt 3D fica num invólucro próprio: o recorte arredondado
                        do card não pode morar no mesmo elemento da transformação 3D */}
                    <div
                      className="team-card-tilt"
                      ref={(el) => {
                        innerRefs.current[i] = el;
                      }}
                    >
                      <div className="team-card-inner">
                        <div className="team-card-media">
                          {m.photo ? (
                            <>
                              <img
                                className="team-card-photo"
                                src={m.photo}
                                alt={front ? `${title} — SWN Studio` : ''}
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="team-card-tint" />
                            </>
                          ) : (
                            <TeamArt
                              kind={m.key}
                              uid={`${uid}-art${i}`}
                              active={front && revealed && inView && !reduced}
                            />
                          )}
                        </div>
                        <span className="team-card-shade" />
                        <span className="team-card-spot" />
                        <span className="team-card-index">{pad(i + 1)}</span>

                        <div className="team-card-meta">
                          <div>
                            <h3 className="team-card-name">{title}</h3>
                            <p className="team-card-role">{m.name ? m.role : m.specialty}</p>
                          </div>
                          <button
                            type="button"
                            className="team-card-cta"
                            tabIndex={front ? 0 : -1}
                            aria-label={`Solicitar orçamento — ${m.role}`}
                            onClick={() => goToContact(m.interest)}
                          >
                            <FiArrowUpRight size={20} aria-hidden="true" />
                          </button>
                        </div>

                        {/* reflexo que atravessa o card quando ele chega à frente */}
                        {front && revealed && (
                          <motion.span
                            key={`sheen-${deck.seq}`}
                            className="team-card-sheen"
                            initial={{ x: '-110%' }}
                            animate={{ x: '110%' }}
                            transition={{ duration: 1.3, delay: deck.dir === 0 ? 1.1 : 0.95, ease: [0.4, 0, 0.2, 1] }}
                          />
                        )}
                        <motion.span className="team-card-dim" initial={false} animate={dim} />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <motion.div
              className="team-rail"
              variants={FADE}
              custom={0.7}
              initial="hidden"
              animate={revealed ? 'show' : 'hidden'}
            >
              <div className="team-tabs" role="tablist" aria-label="Profissionais" onKeyDown={onTabsKey}>
                {team.map((m, i) => (
                  <button
                    key={m.key}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`${uid}-tab-${i}`}
                    type="button"
                    role="tab"
                    className="team-tab"
                    aria-selected={i === deck.active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={i === deck.active ? 0 : -1}
                    onClick={() => go(i)}
                  >
                    <span className="team-tab-label">
                      <span className="team-tab-num">{pad(i + 1)}</span>
                      {m.tab}
                    </span>
                    <span className="team-tab-track">
                      <span
                        className="team-tab-fill"
                        ref={(el) => {
                          fillRefs.current[i] = el;
                        }}
                      />
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="team-pause"
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? 'Retomar a troca automática' : 'Pausar a troca automática'}
              >
                {paused ? <FiPlay size={14} aria-hidden="true" /> : <FiPause size={14} aria-hidden="true" />}
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Team;

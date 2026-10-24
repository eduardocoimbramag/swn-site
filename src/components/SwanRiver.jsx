import React, { useEffect, useRef } from 'react';
import { SWAN_PATH } from './svg/BrandSwan';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { RiverScene, clamp01, segment, smoothstep } from '../lib/riverScene';

/**
 * SwanRiver — o cisne desenhado pelo scroll, agora nadando num rio.
 *
 * Três tempos, guiados pelo progresso da seção (fixa na tela via sticky):
 *   1. Desenho  — horizonte, água e cisne são traçados conforme o scroll.
 *   2. Calmaria — a cena estabiliza: o reflexo surge e a água só respira.
 *   3. Nado     — a barra avança com o scroll; ao encostar em cada ponto o
 *                 scroll para e a troca acontece: o vento sobe, o texto atual
 *                 é levado, o próximo chega da direita, o cisne rema sem sair
 *                 do centro e, quando a palavra assenta, desacelera. Só então
 *                 o scroll é liberado.
 *
 * Tudo roda num único requestAnimationFrame imperativo (canvas + estilos
 * escritos direto no DOM) — nenhum re-render do React por frame.
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
    word: 'Marca',
    caption: 'Quando tudo se alinha, o cisne é SWN.'
  }
];

/* Linha do tempo — progresso da seção (0 = fixou na tela, 1 = vai soltar) */
const TIMELINE = {
  horizon: [-0.06, 0.06],
  ridge: [0.04, 0.15],
  water: [0.02, 0.22],
  stroke: [0.03, 0.21],
  fill: [0.16, 0.25],
  reflection: [0.2, 0.3],
  acts: [0.37, 0.61, 0.85] // pontos da barra: cada um é uma parada do scroll
};

/* O SWAN_PATH tem 5 subpaths; cada um vira uma "caneta" com sua janela no
   desenho. Traçar subpath a subpath deixa o progresso idêntico em todos os
   navegadores (o Chrome reinicia o tracejado a cada subpath e ignora
   pathLength junto de non-scaling-stroke). */
const SWAN_STROKES = SWAN_PATH.split(/(?=M\s)/).map((d) => d.trim());
const STROKE_WINDOWS = [
  [0, 0.62],    // pescoço, cabeça e peito
  [0.18, 0.74], // asa superior
  [0.3, 0.86],  // asa do meio
  [0.42, 0.96], // asa inferior (casco)
  [0.7, 1]      // bico
];
const STROKE_PX = 3.4; // espessura na tela, independente da escala do cisne
const ECHO_PX = 6;
const TIP_PX = 4.5;

const ACT_IN_S = 1.35;     // borda → centro
const ACT_OUT_S = 0.95;    // centro → fora: a rajada leva a palavra
const STAGGER = 0.5;       // atraso entre a primeira e a última letra (entrada)
const STAGGER_OUT = 0.35;  // na saída a rajada leva a palavra mais junta

/* Nado: o vento sobe quando um texto é trazido/levado e o cisne desacelera
   com inércia quando a palavra assenta no centro. */
const SWIM_SETTLE = 0.12;  // deslize suave com um texto em cena
const SWIM_ACCEL = 4.6;    // ω da mola ao acelerar (~0,9s)
const SWIM_DECEL = 2.4;    // ω ao desacelerar (~1,5s de inércia)
const WIND_TO_ENTER = 0.3; // da calmaria, o texto só parte quando o vento pegou
const WIND_TO_EXIT = 0.22; // a rajada chega antes de levar a palavra
const LANDED = 0.85;       // progresso em que a palavra já assentou aos olhos

/* Parada em cada ponto: o scroll só volta a andar depois que o cisne
   desacelerou (nado ≤ RELEASE_SWIM). LOCK_MAX_S é a válvula de segurança. */
const RELEASE_SWIM = SWIM_SETTLE + 0.12;
const LOCK_MAX_S = 7;
const SCROLL_KEYS = new Set([' ', 'Spacebar', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeInExit = (t) => Math.pow(t, 2.2);

/* Qual texto o scroll pede neste momento (−1 = nenhum ainda) */
const wantedAct = (p) => {
  let want = -1;
  TIMELINE.acts.forEach((at, i) => {
    if (p >= at) want = i;
  });
  return want;
};

/* Posição da barra (em índices de ponto) para um progresso de scroll */
const railPosition = (p) => {
  const T = TIMELINE.acts;
  if (p <= T[0]) return 0;
  for (let i = 0; i < T.length - 1; i++) {
    if (p < T[i + 1]) return i + (p - T[i]) / (T[i + 1] - T[i]);
  }
  return T.length - 1;
};

/* Pula para uma posição sem a rolagem suave global (html { scroll-behavior }) */
const jumpTo = (y) => {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, y);
  root.style.scrollBehavior = prev;
};

/* Leva o ato até o alvo (0 fora à direita · 1 centro · 2 fora à esquerda) em
   velocidade constante — a suavização vem das curvas por letra. Devolve true
   ao chegar. */
const moveAct = (act, target, dt) => {
  const step = dt / (target === 1 ? ACT_IN_S : ACT_OUT_S);
  const diff = target - act.a;
  if (Math.abs(diff) <= step) {
    act.a = target;
    return true;
  }
  act.a += Math.sign(diff) * step;
  return false;
};

/* Escreve a pose de um glifo. O "arrasto do vento" (blur, inclinação e
   estiramento) vem da velocidade real do glifo: rápido = borrado, parado =
   nítido. */
const writeGlyph = (el, st, g) => {
  const v = (g.x - st.x) / g.dt;
  st.x = g.x;
  st.v += (v - st.v) * (1 - Math.exp(-g.dt * 14));
  const m = clamp01(Math.abs(st.v) / g.vRef);
  const lean = clamp01(-st.v / g.vRef) - clamp01(st.v / g.vRef);

  const blur = m * 4.5 * g.strength;
  const skew = lean * 14 * g.strength;
  const stretch = 1 + m * 0.5 * g.strength;
  const y = (Math.sin(g.t * 2.6 + g.seed * 0.55) * 14 * g.travel + Math.sin(g.t * 1.7 + g.seed * 0.6) * 1.4 * g.sway) * g.k;
  const rot = Math.sin(g.t * 2.1 + g.seed * 0.9) * 7 * g.travel * g.strength + Math.sin(g.t * 1.3 + g.seed) * 0.5 * g.sway;

  /* 2D de propósito: camada 3D + background-clip:text falha no Safari */
  el.style.transform = `translate(${g.x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg) scaleX(${stretch.toFixed(3)})`;
  el.style.opacity = g.opacity.toFixed(3);
  el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : '';
};

const SwanRiver = () => {
  const reduced = usePrefersReducedMotion();
  const hiddenStroke = reduced ? undefined : { strokeDasharray: '0 1', visibility: 'hidden' };

  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const swanBoxRef = useRef(null);
  const swanBodyRef = useRef(null);
  const fillRef = useRef(null);
  const echoGroupRef = useRef(null);
  const strokeGroupRef = useRef(null);
  const tipsGroupRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const markerRefs = useRef([]);
  const actRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return undefined;

    const lite =
      window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
    const scene = new RiverScene({
      back: backRef.current,
      front: frontRef.current,
      swanPath: SWAN_PATH,
      lite
    });
    const echoes = Array.from(echoGroupRef.current.children);
    const strokes = Array.from(strokeGroupRef.current.children);
    const tips = Array.from(tipsGroupRef.current.children);
    const lengths = strokes.map((el) => el.getTotalLength());

    let L = null;
    let range = 1;

    const measure = () => {
      const W = sticky.clientWidth;
      const H = sticky.clientHeight;
      if (!W || !H) return;
      L = scene.resize(W, H, window.devicePixelRatio || 1);
      range = Math.max(1, section.offsetHeight - H);
      const box = swanBoxRef.current.style;
      box.left = `${L.swanX}px`;
      box.top = `${L.swanY}px`;
      box.width = `${L.S}px`;
      box.height = `${L.S}px`;
      sticky.style.setProperty('--river-text-y', `${L.textY}px`);
      /* traço com espessura constante na tela (em unidades do viewBox) */
      strokeGroupRef.current.setAttribute('stroke-width', (STROKE_PX / L.scale).toFixed(2));
      echoGroupRef.current.setAttribute('stroke-width', (ECHO_PX / L.scale).toFixed(2));
      for (const tip of tips) tip.setAttribute('r', (TIP_PX / L.scale).toFixed(2));
    };

    /* Cada caneta avança na sua janela; a ponta luminosa acompanha o traço */
    let lastDraw = -1;
    const drawSwan = (draw) => {
      if (Math.abs(draw - lastDraw) < 0.0004) return;
      lastDraw = draw;
      strokes.forEach((el, i) => {
        const [a, b] = STROKE_WINDOWS[i] || [0, 1];
        const len = smoothstep(segment(draw, a, b));
        const dash = `${len} 1`;
        const visibility = len < 0.001 ? 'hidden' : 'visible';
        el.style.strokeDasharray = dash;
        el.style.visibility = visibility;
        echoes[i].style.strokeDasharray = dash;
        echoes[i].style.visibility = visibility;

        const tip = tips[i];
        const drawing = len > 0.001 && len < 0.999;
        tip.style.opacity = drawing ? '1' : '0';
        if (drawing) {
          const pt = el.getPointAtLength(len * lengths[i]);
          tip.setAttribute('cx', pt.x.toFixed(1));
          tip.setAttribute('cy', pt.y.toFixed(1));
        }
      });
    };

    /* ---------- Reduced motion: um único quadro, calmo e completo ---------- */
    if (reduced) {
      const paint = () => {
        measure();
        if (L) scene.renderStatic();
      };
      paint();
      const ro = new ResizeObserver(paint);
      ro.observe(sticky);
      return () => ro.disconnect();
    }

    /* ---------- Estado da animação ---------- */
    const acts = actRefs.current.map((el) => {
      const chars = Array.from(el.querySelectorAll('.swan-river-char'));
      return {
        el,
        chars,
        caption: el.querySelector('.swan-river-act-caption'),
        glyphs: chars.map(() => ({ x: 0, v: 0 })),
        cap: { x: 0, v: 0 },
        a: 0,
        idle: false
      };
    });

    let p = null;       // progresso suavizado
    let rawPrev = 0;
    let scrollSpeed = 0;
    let swim = 0;       // intensidade do nado/vento (mola)
    let swimVel = 0;
    let lastFill = -1;
    let barVisible = false;
    const barLit = ACTS.map(() => false);
    const barActive = ACTS.map(() => false);
    let t = 0;

    /* ---------- Diretor de cena: um único texto no palco por vez ----------
       O scroll só diz qual texto deveria estar em cena; a troca é sempre em
       sequência — o atual sai por completo antes de o próximo entrar. Num
       scroll rápido os textos intermediários são pulados, nunca empilhados. */
    const stage = {
      cur: -1,         // texto no palco (entrando, parado ou saindo)
      phase: 'idle',   // 'idle' | 'enter' | 'shown' | 'exit'
      exitTo: 2,       // para onde o texto atual está saindo
      last: -1,        // último texto que saiu do palco…
      lastExitTo: 2,   // …e por qual lado
      shown: -1,       // último texto que assentou no centro
      landed: false    // a palavra em cena já assentou (o cisne pode desacelerar)
    };

    const direct = (want, dt) => {
      if (stage.phase === 'idle') {
        if (want < 0) return;
        /* avançando, entra pela direita; voltando, pelo lado onde tinha saído */
        acts[want].a =
          want === stage.last ? stage.lastExitTo : want > stage.last ? 0 : 2;
        stage.cur = want;
        stage.phase = 'enter';
        stage.landed = false;
      }

      const act = acts[stage.cur];
      if ((stage.phase === 'enter' || stage.phase === 'shown') && want !== stage.cur) {
        stage.phase = 'exit';
        stage.exitTo = want > stage.cur ? 2 : 0;
        stage.landed = false;
      } else if (stage.phase === 'exit' && want === stage.cur) {
        stage.phase = 'enter'; // voltou atrás no meio da saída: o texto retorna
      }

      if (stage.phase === 'enter') {
        if ((act.a === 0 || act.a === 2) && swim < WIND_TO_ENTER) return;
        const arrived = moveAct(act, 1, dt);
        /* pousou: pulso na água e o cisne começa a desacelerar */
        if (!stage.landed && Math.abs(act.a - 1) <= 1 - LANDED) {
          stage.landed = true;
          const final = stage.cur === ACTS.length - 1;
          scene.pulse(final ? 1.3 : 0.85, final);
        }
        if (arrived) {
          stage.phase = 'shown';
          stage.shown = stage.cur;
        }
      } else if (stage.phase === 'exit') {
        if (act.a === 1 && swim < WIND_TO_EXIT) return;
        if (moveAct(act, stage.exitTo, dt)) {
          stage.last = stage.cur;
          stage.lastExitTo = stage.exitTo;
          stage.cur = -1;
          stage.phase = 'idle';
          if (want < 0) stage.shown = -1;
        }
      }
    };

    const readProgress = () => {
      const top = section.getBoundingClientRect().top;
      return Math.max(-0.3, Math.min(1, -top / range));
    };

    /* ---------- Paradas do scroll ----------
       A barra anda com o scroll; ao encostar num ponto o scroll trava ali,
       a troca acontece (sai o texto, o cisne acelera, entra o próximo, o
       cisne desacelera) e só então o scroll volta a andar. Um scroll rápido
       nunca pula pontos: para sempre no primeiro que cruzar. */
    let request = -1; // texto que o scroll já pediu (sincronizado após medir)
    const lock = { active: false, at: 0, y: 0, since: 0 };
    let lastScrollY = window.scrollY;
    let navigating = false; // clique em link/botão: rolagem programática, sem paradas
    let navTimer = 0;

    const blockInput = (e) => {
      if (e.cancelable) e.preventDefault();
    };
    const blockKeys = (e) => {
      if (!SCROLL_KEYS.has(e.key)) return;
      const el = e.target;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
    };
    const lockInput = (on) => {
      const method = on ? 'addEventListener' : 'removeEventListener';
      window[method]('wheel', blockInput, { passive: false });
      window[method]('touchmove', blockInput, { passive: false });
      window[method]('keydown', blockKeys);
    };

    const lockYFor = (at) =>
      window.scrollY + section.getBoundingClientRect().top + at * range;

    const engage = (at) => {
      lock.active = true;
      lock.at = at;
      lock.since = t;
      lock.y = lockYFor(at);
      lockInput(true);
      jumpTo(lock.y);
    };

    const release = () => {
      if (!lock.active) return;
      lock.active = false;
      lockInput(false);
    };

    const STOP_PAD = 2; // px além do ponto: imune a arredondamento do scrollTo

    const onScroll = () => {
      if (navigating) {
        /* a rolagem programática continua: segue sem paradas até ela parar */
        clearTimeout(navTimer);
        navTimer = setTimeout(() => {
          navigating = false;
        }, 250);
      }

      const y = window.scrollY;
      const jump = Math.abs(y - lastScrollY) > window.innerHeight * 0.9;
      lastScrollY = y;

      if (lock.active) {
        /* a cena está fixa na tela: devolver o scroll ao ponto é invisível */
        if (Math.abs(y - lock.y) > 1) jumpTo(lock.y);
        lastScrollY = lock.y;
        return;
      }

      const want = wantedAct(readProgress());
      if (want === request) return;
      if (navigating || jump) {
        request = want; // navegação ou restauração de posição: sem paradas
        return;
      }
      /* cruzou um ponto rolando: avança (ou volta) um texto e trava no ponto */
      const T = TIMELINE.acts;
      if (want > request) {
        request += 1;
        engage(T[request] + STOP_PAD / range);
      } else {
        engage(T[request] - STOP_PAD / range); // logo antes do ponto que ficou para trás
        request -= 1;
      }
    };

    /* roda, toque ou tecla de rolagem: é o usuário rolando, não navegação */
    const onUserScrollIntent = (e) => {
      if (e.type !== 'keydown' || SCROLL_KEYS.has(e.key)) navigating = false;
    };
    const onClick = (e) => {
      if (!e.target.closest?.('a[href], button')) return;
      navigating = true;
      release();
      clearTimeout(navTimer);
      navTimer = setTimeout(() => {
        navigating = false;
      }, 600);
    };

    const updateLock = () => {
      if (!lock.active) return;
      const settled =
        request < 0
          ? stage.phase === 'idle' && swim < 0.06
          : stage.phase === 'shown' && stage.cur === request && swim <= RELEASE_SWIM;
      if (settled || t - lock.since > LOCK_MAX_S) release();
    };

    /* Barra: exclusiva dos textos — um ponto em cada extremidade; o
       preenchimento segue o scroll e o ponto em troca pulsa até liberar. */
    const renderRail = () => {
      const pos = lock.active ? railPosition(lock.at) : railPosition(p);
      railFillRef.current.style.transform = `scaleX(${(pos / (ACTS.length - 1)).toFixed(4)})`;

      ACTS.forEach((_, i) => {
        const lit = request >= i;
        if (lit !== barLit[i]) {
          barLit[i] = lit;
          markerRefs.current[i]?.classList.toggle('is-reached', lit);
        }
        const active = lock.active && request === i;
        if (active !== barActive[i]) {
          barActive[i] = active;
          markerRefs.current[i]?.classList.toggle('is-active', active);
        }
      });

      const visible = request >= 0 || stage.cur >= 0;
      if (visible !== barVisible) {
        barVisible = visible;
        railRef.current?.classList.toggle('is-visible', visible);
      }
    };

    const renderActs = (dt, I) => {
      const { W, k } = L;
      const D = W * 0.62 + 60;
      const vRef = W * 1.3;

      acts.forEach((act, i) => {
        const enter = clamp01(act.a);
        const exit = clamp01(act.a - 1);
        const offstage = enter === 0 || exit === 1;

        /* fora de cena e já escrito como tal: nada a fazer neste frame */
        if (offstage && act.idle) return;
        if (act.idle) {
          /* voltando à cena: parte do lado certo, sem velocidade herdada */
          const from = act.a > 1 ? -D : D;
          for (const st of act.glyphs) {
            st.x = from;
            st.v = 0;
          }
          act.cap.x = from;
          act.cap.v = 0;
        }
        act.idle = offstage;

        const wordEnter = clamp01(enter / 0.85);
        const n = act.chars.length;
        for (let j = 0; j < n; j++) {
          const lead = n > 1 ? j / (n - 1) : 0;
          const ej = clamp01(wordEnter * (1 + STAGGER) - STAGGER * lead);
          const xj = clamp01(exit * (1 + STAGGER_OUT) - STAGGER_OUT * lead);
          const travel = Math.min(1, 1 - ej + xj);
          writeGlyph(act.chars[j], act.glyphs[j], {
            x: offstage ? (exit === 1 ? -D : D) : D * (1 - easeOutQuart(ej)) - D * easeInExit(xj),
            opacity: offstage ? 0 : smoothstep(clamp01(ej * 2.4)) * (1 - smoothstep(clamp01((xj - 0.12) / 0.6))),
            travel,
            sway: I * (1 - travel),
            strength: 1,
            seed: j + i * 3,
            dt,
            t,
            k,
            vRef
          });
        }

        /* legenda: chega um tempo depois da palavra e sai junto com ela */
        const ec = clamp01((enter - 0.3) / 0.7);
        const xc = clamp01(exit * 1.25);
        const travel = Math.min(1, 1 - ec + xc);
        writeGlyph(act.caption, act.cap, {
          x: offstage ? (exit === 1 ? -D : D) : D * (1 - easeOutQuart(ec)) - D * easeInExit(xc),
          opacity: offstage ? 0 : smoothstep(clamp01(ec * 2)) * (1 - smoothstep(clamp01(xc / 0.7))),
          travel: travel * 0.5,
          sway: I * (1 - travel) * 0.6,
          strength: 0.55,
          seed: 11 + i,
          dt,
          t,
          k,
          vRef
        });
      });
    };

    const tick = (dt) => {
      t += dt;
      const raw = readProgress();
      if (p === null) {
        p = raw;
        rawPrev = raw;
      }
      p += (raw - p) * (1 - Math.exp(-dt * 7));
      scrollSpeed += (Math.abs(raw - rawPrev) / dt - scrollSpeed) * (1 - Math.exp(-dt * 4));
      rawPrev = raw;

      direct(request, dt);

      /* mola criticamente amortecida: acelera rápido, desacelera com inércia */
      const busy = stage.phase === 'exit' || (stage.phase === 'enter' && !stage.landed);
      const swimTarget = busy ? 1 : stage.shown >= 0 ? SWIM_SETTLE : 0;
      const w = swimTarget > swim ? SWIM_ACCEL : SWIM_DECEL;
      swimVel += (w * w * (swimTarget - swim) - 2 * w * swimVel) * dt;
      swim = clamp01(swim + swimVel * dt);
      const I = swim;

      const fill = smoothstep(segment(p, ...TIMELINE.fill));

      const pose = scene.step(dt, { swim: I, boost: clamp01(scrollSpeed / 0.35) * I, presence: fill });
      scene.render({
        horizon: segment(p, ...TIMELINE.horizon),
        ridge: segment(p, ...TIMELINE.ridge),
        water: segment(p, ...TIMELINE.water),
        reflection: smoothstep(segment(p, ...TIMELINE.reflection)),
        presence: fill,
        halo: smoothstep(segment(p, -0.04, 0.25))
      });

      /* cisne SVG: traço, preenchimento e pose do nado */
      drawSwan(segment(p, ...TIMELINE.stroke));
      if (Math.abs(fill - lastFill) > 0.002) {
        lastFill = fill;
        fillRef.current.style.opacity = fill.toFixed(3);
      }
      swanBodyRef.current.style.transform =
        `translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, 0) rotate(${pose.rot.toFixed(3)}deg) skewX(${pose.skew.toFixed(3)}deg)`;

      updateLock();
      renderRail();
      renderActs(dt, I);
    };

    /* ---------- Loop: só roda com a seção perto da tela ---------- */
    let raf = 0;
    let last = 0;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.1, Math.max(0.001, (now - last) / 1000)) : 1 / 60;
      last = now;
      if (L) tick(dt);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    measure();
    request = wantedAct(readProgress());
    lastScrollY = window.scrollY;
    if (L) tick(1 / 60);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '200px 0px' }
    );
    io.observe(section);

    const ro = new ResizeObserver(() => {
      measure();
      if (lock.active) {
        lock.y = lockYFor(lock.at);
        jumpTo(lock.y);
      }
    });
    ro.observe(sticky);
    ro.observe(section);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onUserScrollIntent, { passive: true });
    window.addEventListener('touchstart', onUserScrollIntent, { passive: true });
    window.addEventListener('keydown', onUserScrollIntent);
    document.addEventListener('click', onClick, true);

    return () => {
      stop();
      release();
      clearTimeout(navTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onUserScrollIntent);
      window.removeEventListener('touchstart', onUserScrollIntent);
      window.removeEventListener('keydown', onUserScrollIntent);
      document.removeEventListener('click', onClick, true);
    };
  }, [reduced]);

  const actsMarkup = (
    <div className={`swan-river-acts ${reduced ? 'swan-river-acts--static' : ''}`}>
      {ACTS.map((act, i) => (
        <div
          key={act.num}
          ref={(el) => {
            actRefs.current[i] = el;
          }}
          className="swan-river-act"
        >
          <h3 className="swan-river-act-word">
            <span className="swan-river-sr">{act.word}</span>
            <span aria-hidden="true">
              {Array.from(act.word).map((ch, j) => (
                <span key={j} className="swan-river-char">
                  {ch}
                </span>
              ))}
            </span>
          </h3>
          <p className="swan-river-act-caption">{act.caption}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={`swan-river ${reduced ? 'swan-river--static' : ''}`}
      aria-label="A marca SWN: o cisne desenhado sobre o rio"
    >
      <div ref={stickyRef} className="swan-river-sticky">
        <canvas ref={backRef} className="swan-river-canvas" aria-hidden="true" />

        <div ref={swanBoxRef} className="swan-river-swan" aria-hidden="true">
          <div ref={swanBodyRef} className="swan-river-swan-body">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="swan-river-svg">
              <defs>
                <filter id="riverSwanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="riverSwanGlowSoft" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                {/* em userSpace: um único degradê atravessa o cisne inteiro */}
                <linearGradient id="riverSwanStroke" gradientUnits="userSpaceOnUse" x1="196" y1="157" x2="809" y2="847">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#83DFE9" />
                  <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.7" />
                </linearGradient>
                <radialGradient id="riverSwanFill" cx="50%" cy="55%" r="60%">
                  <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#83DFE9" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              <path
                ref={fillRef}
                d={SWAN_PATH}
                fill="url(#riverSwanFill)"
                fillRule="evenodd"
                style={{ opacity: reduced ? 1 : 0 }}
              />
              {/* Eco — atrás, mais grosso e desfocado, dá densidade ao traço */}
              <g
                ref={echoGroupRef}
                fill="none"
                stroke="rgba(131, 223, 233, 0.4)"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#riverSwanGlowSoft)"
              >
                {SWAN_STROKES.map((d, i) => (
                  <path key={i} d={d} pathLength="1" style={hiddenStroke} />
                ))}
              </g>
              <g
                ref={strokeGroupRef}
                fill="none"
                stroke="url(#riverSwanStroke)"
                strokeWidth="7.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#riverSwanGlow)"
              >
                {SWAN_STROKES.map((d, i) => (
                  <path key={i} d={d} pathLength="1" style={hiddenStroke} />
                ))}
              </g>
              {/* Pontas luminosas — a "caneta" de cada traço enquanto desenha */}
              <g ref={tipsGroupRef} fill="#FFFFFF" filter="url(#riverSwanGlow)">
                {SWAN_STROKES.map((_, i) => (
                  <circle key={i} r="10" style={{ opacity: 0 }} />
                ))}
              </g>
            </svg>
          </div>
        </div>

        <canvas ref={frontRef} className="swan-river-canvas swan-river-canvas--front" aria-hidden="true" />

        {!reduced && actsMarkup}

        {!reduced && (
          <div ref={railRef} className="swan-river-progress" aria-hidden="true">
            <span ref={railFillRef} className="swan-river-progress-fill" />
            {ACTS.map((act, i) => (
              <span
                key={act.num}
                ref={(el) => {
                  markerRefs.current[i] = el;
                }}
                className="swan-river-progress-marker"
                style={{ left: `${(i / (ACTS.length - 1)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {reduced && actsMarkup}
    </section>
  );
};

export default SwanRiver;

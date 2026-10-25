import { segment, smoothstep } from './riverScene';

/**
 * SkyScene — o céu noturno do Hero.
 *
 * Um campo de estrelas em profundidade: cada uma cintila no seu ritmo e as
 * mais próximas acompanham levemente o cursor. De tempos em tempos uma estrela
 * cadente risca o céu — acende, estica um rastro afinado, solta faíscas e
 * acorda as estrelas por onde passa. Às vezes vem acompanhada de uma segunda,
 * quase paralela, como numa chuva de meteoros.
 *
 * Esta classe só guarda o estado e desenha; o componente dono do canvas chama
 * update(dt) e draw() num único requestAnimationFrame — nenhum re-render do
 * React por frame.
 */

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const WHITE = '#ffffff';
const CYAN = '#83DFE9';

/* Estrelas */
const STAR_DENSITY = 1 / 6400; // estrelas por px² de céu
const STAR_MIN = 70;
const STAR_MAX = 260;
const INTRO_S = [0.2, 2]; // o céu acende aos poucos na abertura
const PARALLAX_X = 18;    // px de deslocamento da estrela mais próxima
const PARALLAX_Y = 10;

/* Estrelas cadentes */
const FIRST_METEOR_S = 2.4;  // a primeira chega depois que o título assentou
const METEOR_GAP = [3.8, 8]; // intervalo entre uma e outra
const PAIR_CHANCE = 0.22;    // chance de vir uma segunda logo atrás
const WAKE_RADIUS = 120;     // alcance do brilho que a cadente deixa nas estrelas
const EMBER_RATE = 44;       // faíscas por segundo com a cadente no auge
const EMBER_MAX = 120;

/* Céu mais limpo atrás do título e apagando perto do horizonte */
const starFade = (nx, ny) => {
  const dx = (nx - 0.5) / 0.3;
  const dy = (ny - 0.44) / 0.26;
  const clearing = 0.28 + 0.72 * smoothstep(segment(Math.hypot(dx, dy), 0.5, 1.35));
  const horizon = 1 - smoothstep(segment(ny, 0.58, 0.9));
  return clearing * horizon;
};

export class SkyScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = 0;
    this.h = 0;
    this.time = 0;
    this.still = false; // movimento reduzido: um único frame, sem cadentes
    this.stars = [];
    this.meteors = [];
    this.embers = [];
    this.nextMeteor = FIRST_METEOR_S;
    /* parallax atual e alvo vindo do cursor, ambos em −1..1 */
    this.px = 0;
    this.py = 0;
    this.tx = 0;
    this.ty = 0;
  }

  resize(w, h) {
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, w > 1600 ? 1.5 : 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* As estrelas vivem em coordenadas normalizadas: só refaz o céu quando a
       área muda de verdade (a barra do navegador no mobile não conta) */
    const count = Math.round(Math.min(STAR_MAX, Math.max(STAR_MIN, w * h * STAR_DENSITY)));
    if (Math.abs(count - this.stars.length) > this.stars.length * 0.25) this.seed(count);
  }

  seed(count) {
    this.stars = Array.from({ length: count }, () => {
      const depth = Math.pow(Math.random(), 2.2); // 0 = distante, 1 = próxima
      const nx = Math.random();
      const ny = Math.pow(Math.random(), 1.25); // mais densas no alto do céu
      return {
        nx,
        ny,
        depth,
        r: 0.35 + depth * 1.15,
        alpha: 0.22 + Math.random() * 0.42 + depth * 0.32,
        fade: starFade(nx, ny),
        speed: rand(0.5, 2.2),
        phase: Math.random() * TAU,
        cyan: Math.random() < 0.2,
        wake: 0
      };
    });
  }

  pointer(x, y) {
    this.tx = x;
    this.ty = y;
  }

  spawn(delay = 0, lead = null) {
    const { w, h } = this;
    const scale = Math.min(1.15, Math.max(0.6, w / 1440));
    const dir = lead ? lead.dir : Math.random() < 0.72 ? -1 : 1; // a maioria desce para a esquerda
    const tilt = lead ? lead.tilt + rand(-0.03, 0.03) : rand(0.3, 0.56);
    const ux = Math.cos(tilt) * dir;
    const uy = Math.sin(tilt);

    let x;
    let y;
    if (lead) {
      /* a companheira sai do lado, um pouco atrás, no mesmo rumo */
      const side = rand(38, 96) * (Math.random() < 0.5 ? -1 : 1);
      const back = rand(20, 80);
      x = lead.x0 - uy * side - ux * back;
      y = lead.y0 + ux * side - uy * back;
    } else {
      x = dir < 0 ? rand(0.42, 1.05) * w : rand(-0.05, 0.58) * w;
      y = rand(-0.04, 0.36) * h;
    }

    const meteor = {
      x,
      y,
      x0: x,
      y0: y,
      ux,
      uy,
      dir,
      tilt,
      delay,
      age: 0,
      emit: 0,
      speed: rand(950, 1550) * scale * (lead ? 0.92 : 1),
      life: rand(0.85, 1.35),
      len: rand(170, 320) * scale * (lead ? 0.7 : 1),
      width: rand(1.2, 1.9) * (lead ? 0.8 : 1),
      bright: rand(0.78, 1) * (lead ? 0.72 : 1)
    };
    this.meteors.push(meteor);
    return meteor;
  }

  /* Acende rápido, sustenta e se apaga com calma */
  meteorAlpha(m) {
    const p = m.age / m.life;
    return m.bright * smoothstep(segment(p, 0, 0.14)) * (1 - smoothstep(segment(p, 0.5, 1)));
  }

  /* O rastro estica na ignição e encolhe quando a cadente se apaga */
  tailLength(m) {
    const p = m.age / m.life;
    return m.len * easeOutCubic(segment(p, 0, 0.32)) * (1 - 0.55 * smoothstep(segment(p, 0.65, 1)));
  }

  starX(s) {
    return s.nx * this.w + this.px * s.depth * PARALLAX_X;
  }

  starY(s) {
    return s.ny * this.h + this.py * s.depth * PARALLAX_Y;
  }

  update(dt) {
    this.time += dt;

    const k = 1 - Math.exp(-dt * 2.4);
    this.px += (this.tx - this.px) * k;
    this.py += (this.ty - this.py) * k;

    if (this.time >= this.nextMeteor) {
      const lead = this.spawn();
      if (Math.random() < PAIR_CHANCE) this.spawn(rand(0.2, 0.5), lead);
      this.nextMeteor = this.time + rand(METEOR_GAP[0], METEOR_GAP[1]);
    }

    const decay = Math.exp(-dt * 1.5);
    for (const s of this.stars) s.wake *= decay;

    for (const m of this.meteors) {
      if (m.delay > 0) {
        m.delay -= dt;
        continue;
      }
      m.age += dt;
      m.x += m.ux * m.speed * dt;
      m.y += m.uy * m.speed * dt;
      const a = this.meteorAlpha(m);

      /* faíscas soltando da cabeça */
      m.emit += dt * EMBER_RATE * a;
      while (m.emit >= 1) {
        m.emit -= 1;
        if (this.embers.length >= EMBER_MAX) continue;
        const back = rand(0, 16);
        this.embers.push({
          x: m.x - m.ux * back + rand(-1.5, 1.5),
          y: m.y - m.uy * back + rand(-1.5, 1.5),
          vx: m.ux * m.speed * 0.04 + rand(-12, 12),
          vy: m.uy * m.speed * 0.04 + rand(-6, 14),
          r: rand(0.5, 1.2),
          a,
          age: 0,
          life: rand(0.4, 0.95)
        });
      }

      /* acorda as estrelas por onde passa */
      if (a > 0.05) {
        for (const s of this.stars) {
          const d = Math.hypot(this.starX(s) - m.x, this.starY(s) - m.y);
          if (d < WAKE_RADIUS) s.wake = Math.max(s.wake, (1 - d / WAKE_RADIUS) * a);
        }
      }
    }
    this.meteors = this.meteors.filter((m) => m.age < m.life);

    const drag = Math.exp(-dt * 2.6);
    for (const e of this.embers) {
      e.age += dt;
      e.vx *= drag;
      e.vy = e.vy * drag + 22 * dt;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
    }
    this.embers = this.embers.filter((e) => e.age < e.life);
  }

  draw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    const intro = this.still ? 1 : smoothstep(segment(this.time, INTRO_S[0], INTRO_S[1]));
    for (const s of this.stars) {
      const twinkle = this.still ? 0.85 : 0.58 + 0.42 * Math.sin(this.time * s.speed + s.phase);
      const a = Math.min(1, (s.alpha * twinkle * intro + s.wake * 0.9) * s.fade);
      if (a < 0.015) continue;
      const x = this.starX(s);
      const y = this.starY(s);
      const r = s.r * (1 + s.wake * 0.9);
      ctx.fillStyle = s.cyan ? CYAN : WHITE;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      /* halo nas estrelas mais próximas e nas que a cadente acordou */
      if (s.depth > 0.62 || s.wake > 0.15) {
        ctx.globalAlpha = a * 0.14;
        ctx.beginPath();
        ctx.arc(x, y, r * 3.4, 0, TAU);
        ctx.fill();
      }
    }

    if (this.meteors.length || this.embers.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (const m of this.meteors) {
        if (m.delay > 0) continue;
        const a = this.meteorAlpha(m);
        if (a < 0.01) continue;
        this.drawMeteor(m, a);
      }
      ctx.fillStyle = '#C8F4F9';
      for (const e of this.embers) {
        const t = e.age / e.life;
        ctx.globalAlpha = (1 - t) * (1 - t) * 0.8 * e.a;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * (1 - t * 0.5), 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  drawMeteor(m, a) {
    const { ctx } = this;
    const len = this.tailLength(m);
    const tx = m.x - m.ux * len;
    const ty = m.y - m.uy * len;
    const nx = -m.uy; // normal ao rumo — dá a largura do rastro
    const ny = m.ux;

    const tail = ctx.createLinearGradient(m.x, m.y, tx, ty);
    tail.addColorStop(0, `rgba(255, 255, 255, ${a})`);
    tail.addColorStop(0.12, `rgba(200, 244, 249, ${a * 0.85})`);
    tail.addColorStop(0.45, `rgba(131, 223, 233, ${a * 0.32})`);
    tail.addColorStop(1, 'rgba(131, 223, 233, 0)');

    /* rastro afinado: um halo largo e suave por baixo e o núcleo por cima */
    const taper = (half, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(m.x + nx * half, m.y + ny * half);
      ctx.lineTo(tx, ty);
      ctx.lineTo(m.x - nx * half, m.y - ny * half);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = tail;
    taper(m.width * 2.8, 0.22);
    taper(m.width * 0.7, 1);

    /* cabeça incandescente */
    const hr = m.width * 5.5;
    const head = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, hr);
    head.addColorStop(0, `rgba(255, 255, 255, ${a})`);
    head.addColorStop(0.3, `rgba(200, 244, 249, ${a * 0.55})`);
    head.addColorStop(1, 'rgba(131, 223, 233, 0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.arc(m.x, m.y, hr, 0, TAU);
    ctx.fill();
  }
}

/**
 * RiverScene — motor em canvas do cenário "cisne no rio".
 *
 * Desenha tudo o que não é o cisne: horizonte, margem distante, linhas d'água
 * em perspectiva, reflexo, ondulações/esteira, vento e partículas. O cisne
 * continua sendo o SVG neon (traço por pathLength) — aqui só calculamos a pose
 * do nado para que reflexo, oclusão e esteira acompanhem o corpo.
 *
 * Duas camadas: `back` fica atrás do cisne; `front` passa na frente dele
 * (rajadas mais próximas da câmera + flash do clímax).
 *
 * O cisne nunca sai do centro: a sensação de nado vem do rio correndo para a
 * esquerda com paralaxe (linhas próximas correm mais que as distantes).
 */

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const CYAN = '131, 223, 233';
const FOAM = '214, 248, 252';

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const segment = (v, a, b) => clamp01((v - a) / (b - a));
export const smoothstep = (t) => t * t * (3 - 2 * t);

/* Geometria do SWAN_PATH (viewBox 1024), medida a partir do próprio path */
export const SWAN = {
  box: 1024,
  centerX: 502,   // centro horizontal do bounding box
  top: 157,
  bodyY: 600,     // centro visual do corpo (halo)
  waterline: 805, // onde o casco encontra a água
  tailX: 300,     // cauda na linha d'água
  chestX: 790,    // peito na linha d'água — frente do nado
  hullHalf: 250   // meia largura do contato com a água
};

export const computeLayout = (W, H) => {
  const portrait = H > W;
  const compact = W < 720;
  const S = Math.min(H * (portrait ? 0.46 : 0.54), W * (compact ? 0.88 : 0.5), 640);
  const scale = S / SWAN.box;
  const waterY = Math.round(H * (portrait ? 0.64 : 0.7));
  const swanX = W / 2 - SWAN.centerX * scale;
  const swanY = waterY - SWAN.waterline * scale;
  const swanTop = swanY + SWAN.top * scale;
  const safeTop = compact ? 76 : 92; // header fixo

  return {
    W,
    H,
    S,
    scale,
    compact,
    cx: W / 2,
    waterY,
    swanX,
    swanY,
    horizonY: waterY - Math.max(16, H * 0.045),
    textY: Math.round(safeTop + (swanTop - safeTop) * 0.5),
    k: Math.min(1.3, Math.max(0.62, H / 900)) // escala das medidas "de design"
  };
};

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const makeCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
};

/* Brilho máximo no centro (onde está o cisne), sumindo nas bordas da tela */
const EDGE_STOPS = [[0, 0], [0.12, 0.3], [0.32, 0.78], [0.5, 1], [0.68, 0.78], [0.88, 0.3], [1, 0]];

const edgeGradient = (ctx, W, rgb) => {
  const g = ctx.createLinearGradient(0, 0, W, 0);
  for (const [o, a] of EDGE_STOPS) g.addColorStop(o, `rgba(${rgb}, ${a})`);
  return g;
};

/* Rajadas: o vento nunca é constante */
const gustAt = (t) =>
  clamp01(0.68 + 0.2 * Math.sin(t * 0.83) + 0.12 * Math.sin(t * 2.37 + 1.3) + 0.06 * Math.sin(t * 5.1));

export class RiverScene {
  constructor({ back, front, swanPath, lite = false }) {
    this.back = back;
    this.front = front;
    this.b = back.getContext('2d');
    this.f = front.getContext('2d');
    this.path = new Path2D(swanPath);
    this.lite = lite;

    this.t = 0;
    this.I = 0;
    this.flow = 0;
    this.flowSpeed = 0;
    this.gust = 0.7;
    this.chop = 0.2;
    this.bobPhase = 0;
    this.energy = 0; // pulso de chegada de cada ato (decai sozinho)
    this.flash = 0;
    this.pose = { x: 0, y: 0, rot: 0, skew: 0 };

    this.rings = [];
    this.streaks = [];
    this.spray = [];
    this.motes = [];
    this.ringClock = 0.4;
    this.streakClock = 0;
    this.sprayClock = 0;
  }

  /* ------------------------------------------------------------------ setup */

  resize(W, H, dpr = 1) {
    this.L = computeLayout(W, H);
    this.dpr = Math.min(dpr, this.lite ? 1.5 : 2);
    this.fdpr = Math.min(dpr, 1.5);
    this.back.width = Math.round(W * this.dpr);
    this.back.height = Math.round(H * this.dpr);
    this.front.width = Math.round(W * this.fdpr);
    this.front.height = Math.round(H * this.fdpr);

    this.buildWater();
    this.buildSprites();
    this.seedMotes();
    this.rings.length = 0;
    this.streaks.length = 0;
    this.spray.length = 0;
    return this.L;
  }

  buildWater() {
    const { W, H, horizonY, waterY, k } = this.L;
    const rand = mulberry32(7);
    const n = this.lite ? 11 : 16;
    const bottom = H * 1.04;

    this.lines = [];
    for (let i = 0; i < n; i++) {
      const u = (i + 1) / n; // 0 = horizonte, 1 = junto da câmera
      this.lines.push({
        i,
        u,
        s: 0.18 + 0.82 * u, // fator de perspectiva/paralaxe
        y: horizonY + (bottom - horizonY) * Math.pow(u, 1.75),
        k1: TAU / (lerp(110, 400, u) * k),
        p1: rand() * TAU,
        p2: rand() * TAU,
        p3: rand() * TAU,
        alpha: lerp(0.2, 0.6, Math.pow(u, 0.7)) * (u > 0.8 ? lerp(1, 0.5, (u - 0.8) / 0.2) : 1),
        width: lerp(0.75, 1.5, u),
        delay: (i / n) * 0.5,
        dashed: i % 3 === 1,
        amp: 0
      });
    }

    /* paralaxe na profundidade do cisne — a esteira deriva nessa velocidade */
    const uW = Math.pow((waterY - horizonY) / (bottom - horizonY), 1 / 1.75);
    this.sWater = 0.18 + 0.82 * uW;

    this.coreGrad = edgeGradient(this.b, W, FOAM);
    this.glowGrad = edgeGradient(this.b, W, CYAN);
  }

  buildSprites() {
    const { S, scale } = this.L;
    const dpr = this.dpr;
    const wl = SWAN.waterline;

    /* Ponto de luz — pontas do traço, partículas, cristas */
    const dot = makeCanvas(64, 64);
    const dg = dot.getContext('2d');
    const rg = dg.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255, 255, 255, 1)');
    rg.addColorStop(0.18, `rgba(${FOAM}, 0.85)`);
    rg.addColorStop(0.45, `rgba(${CYAN}, 0.28)`);
    rg.addColorStop(1, `rgba(${CYAN}, 0)`);
    dg.fillStyle = rg;
    dg.fillRect(0, 0, 64, 64);
    this.dot = dot;

    /* Reflexo: o cisne espelhado na linha d'água, com o degradê de profundidade
       já aplicado (o fatiamento por frame fica barato). */
    const hR = (wl - SWAN.top) * scale + 6;
    const ref = makeCanvas(S * dpr, hR * dpr);
    const g = ref.getContext('2d');
    g.setTransform(scale * dpr, 0, 0, -scale * dpr, 0, wl * scale * dpr);
    g.fillStyle = `rgba(${CYAN}, 0.14)`;
    g.fill(this.path, 'evenodd');
    g.shadowColor = `rgba(${CYAN}, 0.9)`;
    g.shadowBlur = 9 * dpr;
    g.lineJoin = 'round';
    g.lineWidth = 2.2 / scale;
    g.strokeStyle = `rgb(${CYAN})`;
    g.stroke(this.path);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.shadowColor = 'transparent';
    g.globalCompositeOperation = 'destination-in';
    const fade = g.createLinearGradient(0, 0, 0, ref.height);
    fade.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
    fade.addColorStop(0.45, 'rgba(0, 0, 0, 0.2)');
    fade.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = fade;
    g.fillRect(0, 0, ref.width, ref.height);
    this.reflection = { canvas: ref, h: hR };

    /* Oclusão: silhueta dilatada e suavizada, só acima da linha d'água.
       O blur vem de shadowBlur (desenha fora da área e projeta só a sombra),
       que funciona em todos os navegadores — ctx.filter não. */
    const pad = 24;
    const ow = S + pad * 2;
    const oh = wl * scale + pad * 2;
    const occ = makeCanvas(ow * dpr, oh * dpr);
    const og = occ.getContext('2d');
    const shift = occ.width + 64;
    og.shadowColor = '#000';
    og.shadowBlur = 8 * dpr;
    og.shadowOffsetX = shift;
    og.setTransform(scale * dpr, 0, 0, scale * dpr, pad * dpr - shift, pad * dpr);
    og.fillStyle = '#000';
    og.fill(this.path, 'nonzero');
    og.lineJoin = 'round';
    og.lineWidth = 40;
    og.strokeStyle = '#000';
    og.stroke(this.path);
    og.setTransform(1, 0, 0, 1, 0, 0);
    og.shadowColor = 'transparent';
    og.shadowOffsetX = 0;
    og.globalCompositeOperation = 'destination-out';
    const yW = (wl * scale + pad) * dpr;
    const cut = og.createLinearGradient(0, yW - 5 * dpr, 0, yW + dpr);
    cut.addColorStop(0, 'rgba(0, 0, 0, 0)');
    cut.addColorStop(1, 'rgba(0, 0, 0, 1)');
    og.fillStyle = cut;
    og.fillRect(0, yW - 5 * dpr, occ.width, occ.height);
    this.occluder = { canvas: occ, w: ow, h: oh, pad };
  }

  seedMotes() {
    const { W, H } = this.L;
    const rand = mulberry32(42);
    const n = this.lite ? 22 : 44;
    this.motes = Array.from({ length: n }, () => ({
      x: rand() * W,
      y: rand() * H * 0.95,
      z: 0.25 + rand() * 0.75,
      vx: 0,
      vy: 0,
      ph: rand() * TAU,
      size: 0.6 + rand() * 1.2
    }));
  }

  /* ------------------------------------------------------------- simulação */

  /**
   * Avança a simulação. `swim` (0–1) é a intensidade do nado/vento,
   * `boost` (0–1) a velocidade do scroll e `presence` (0–1) o quanto o cisne
   * já existe na cena (só ondula a água depois de desenhado).
   */
  step(dt, { swim = 0, boost = 0, presence = 1 } = {}) {
    const L = this.L;
    if (!L) return this.pose;
    const I = swim;
    const k = L.k;

    this.t += dt;
    this.I = I;
    this.gust = gustAt(this.t);
    this.chop = 0.2 + 0.8 * I;
    this.flowSpeed = lerp(6, 170, I) * k * (0.8 + 0.4 * this.gust) * (1 + 0.5 * boost);
    this.flow += this.flowSpeed * dt;

    /* Pose: balanço lento na calmaria → ritmo de remada no nado */
    this.bobPhase += TAU * lerp(0.22, 0.78, I) * dt;
    const ph = this.bobPhase;
    const p = this.pose;
    p.y = Math.sin(ph) * lerp(2.4, 5.6, I) * k;
    p.x = (Math.sin(ph + 0.6) * 3.5 - (this.gust - 0.68) * 6) * I * k;
    p.rot = Math.sin(ph - 0.8) * lerp(0.4, 1.5, I) + 0.5 * I;
    p.skew = Math.sin(ph + 1.5) * lerp(0.25, 1.15, I);

    this.energy *= Math.exp(-dt * 1.5);
    this.flash *= Math.exp(-dt * 2.4);

    this.updateRings(dt, I, presence);
    this.updateStreaks(dt, I);
    this.updateMotes(dt, I);
    this.updateSpray(dt, I);
    return p;
  }

  /** Chegada de um ato: anel forte na água + halo; `final` acende o flash. */
  pulse(strength = 1, final = false) {
    const L = this.L;
    if (!L) return;
    this.energy = Math.min(1.6, this.energy + strength);
    if (final) this.flash = 1;
    this.rings.push({
      x: L.cx + this.pose.x,
      y: L.waterY + 2,
      r0: SWAN.hullHalf * L.scale * 0.9,
      grow: 150 * L.k,
      life: 2.6,
      age: 0,
      a: 0.85 * strength,
      squash: 0.15
    });
  }

  updateRings(dt, I, presence) {
    const L = this.L;
    const k = L.k;
    const drift = this.flowSpeed * this.sWater;

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.age += dt;
      r.x -= drift * dt;
      if (r.age >= r.life) this.rings.splice(i, 1);
    }

    /* Calmaria: anéis lentos ao redor do casco (no nado, a esteira assume) */
    if (presence < 0.6 || I > 0.35) return;
    this.ringClock -= dt;
    if (this.ringClock > 0) return;
    this.ringClock = 2.7;
    this.rings.push({
      x: L.cx + this.pose.x,
      y: L.waterY + 2,
      r0: SWAN.hullHalf * L.scale,
      grow: 34 * k,
      life: 4.6,
      age: 0,
      a: 0.5 * (1 - I),
      squash: 0.14
    });
  }

  updateStreaks(dt, I) {
    const L = this.L;
    const k = L.k;

    for (let i = this.streaks.length - 1; i >= 0; i--) {
      const s = this.streaks[i];
      s.x -= s.speed * (0.7 + 0.5 * this.gust) * dt;
      s.age += dt;
      if (s.x + s.len < -20) this.streaks.splice(i, 1);
    }

    if (I < 0.05) return;
    const max = this.lite ? 14 : 30;
    this.streakClock -= dt * I * (0.6 + 0.8 * this.gust) * (this.lite ? 7 : 14);
    while (this.streakClock <= 0) {
      this.streakClock += 1;
      if (this.streaks.length >= max) continue;
      const z = Math.random();
      const overWater = Math.random() < 0.3;
      this.streaks.push({
        x: L.W + Math.random() * 120,
        y: overWater
          ? lerp(L.horizonY + 6, L.H * 0.94, Math.pow(Math.random(), 1.4))
          : lerp(L.H * 0.08, L.horizonY - 14, Math.random()),
        len: lerp(70, 300, z) * k * (overWater ? 0.7 : 1),
        speed: lerp(700, 1500, z) * k,
        width: lerp(0.6, 1.5, z),
        alpha: lerp(0.18, 0.55, z) * (overWater ? 0.6 : 1),
        amp: lerp(2, 10, Math.random()) * k,
        freq: lerp(0.008, 0.02, Math.random()),
        ph: Math.random() * TAU,
        front: z > 0.72 && !overWater,
        age: 0
      });
    }
  }

  updateMotes(dt, I) {
    const { W, H, k } = this.L;
    const wind = 560 * k * I * (0.6 + 0.6 * this.gust);
    const follow = 1 - Math.exp(-dt * 2.2);

    for (const m of this.motes) {
      const tx = -(5 + 7 * m.z) * k - wind * m.z;
      const ty = (-4 * m.z + Math.sin(this.t * 0.6 + m.ph) * 3) * k * (1 - I * 0.6);
      m.vx += (tx - m.vx) * follow;
      m.vy += (ty - m.vy) * follow;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.x < -60) {
        m.x = W + 40 + Math.random() * 80;
        m.y = Math.random() * H * 0.95;
      }
      if (m.y < -20) m.y = H * 0.95;
      else if (m.y > H) m.y = 0;
    }
  }

  updateSpray(dt, I) {
    const L = this.L;
    const k = L.k;

    for (let i = this.spray.length - 1; i >= 0; i--) {
      const s = this.spray[i];
      s.age += dt;
      s.vy += 260 * k * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.age > s.life || s.y > L.waterY + 4) this.spray.splice(i, 1);
    }

    if (I < 0.2) return;
    const chestX = L.swanX + SWAN.chestX * L.scale + this.pose.x;
    this.sprayClock -= dt * I * (this.lite ? 14 : 26) * (0.7 + 0.6 * this.gust);
    while (this.sprayClock <= 0) {
      this.sprayClock += 1;
      this.spray.push({
        x: chestX + (Math.random() - 0.5) * 8 * k,
        y: L.waterY - 1,
        vx: -lerp(30, 150, Math.random()) * k,
        vy: -lerp(25, 85, Math.random()) * k,
        age: 0,
        life: lerp(0.45, 0.9, Math.random()),
        size: lerp(2, 4.5, Math.random()) * k
      });
    }
  }

  /* ---------------------------------------------------------------- render */

  waveY(line, x) {
    const X = x + this.flow * line.s;
    const t = this.t;
    return (
      line.y +
      line.amp *
        (0.62 * Math.sin(line.k1 * X + line.p1 + t * 0.8) +
          0.3 * Math.sin(line.k1 * 2.13 * X + line.p2 - t * 1.15) +
          this.chop * 0.16 * Math.sin(line.k1 * 4.7 * X + line.p3 + t * 2.6))
    );
  }

  /**
   * `horizon`, `ridge`, `water`, `reflection` (0–1) revelam cada camada pelo
   * scroll; `presence` é o cisne preenchido; `halo` a aura dele.
   */
  render({ horizon = 1, ridge = 1, water = 1, reflection = 1, presence = 1, halo = 1 } = {}) {
    const L = this.L;
    if (!L) return;
    const { W, H, k } = L;
    const b = this.b;
    const f = this.f;
    const I = this.I;

    b.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    b.globalCompositeOperation = 'source-over';
    b.globalAlpha = 1;
    b.clearRect(0, 0, W, H);
    f.setTransform(this.fdpr, 0, 0, this.fdpr, 0, 0);
    f.globalCompositeOperation = 'source-over';
    f.globalAlpha = 1;
    f.clearRect(0, 0, W, H);

    const ampBase = (2.2 + 9.5 * I * (0.8 + 0.4 * this.gust)) * k;
    for (const line of this.lines) line.amp = ampBase * Math.pow(line.s, 1.3);

    /* Fundo: tudo que fica atrás do cisne */
    b.globalCompositeOperation = 'lighter';
    this.drawWaterBody(b, water);
    this.drawMotes(b, false, horizon);
    this.drawStreaks(b, false, I);
    this.drawRidge(b, ridge);
    this.drawHorizon(b, horizon);
    this.drawReflection(b, reflection, I);
    this.drawWater(b, water, I);
    this.drawRings(b);
    this.drawWake(b, presence, I);
    this.eraseSwan(b, presence);

    /* Luz emitida pelo cisne e o que acontece na linha d'água */
    b.globalCompositeOperation = 'lighter';
    this.drawHalo(b, halo, I);
    this.drawContact(b, presence, I);
    this.drawGlints(b, water, I);
    this.drawSpray(b);
    b.globalAlpha = 1;

    /* Frente: rajadas próximas da câmera passam por cima do cisne */
    f.globalCompositeOperation = 'lighter';
    this.drawMotes(f, true, horizon);
    this.drawStreaks(f, true, I);
    this.drawFlash(f);
    f.globalAlpha = 1;
  }

  /** Quadro único e calmo — usado com prefers-reduced-motion. */
  renderStatic() {
    this.t = 1.4;
    this.I = 0;
    this.render();
  }

  drawTip(ctx, x, y, a, size) {
    ctx.globalAlpha = a;
    ctx.drawImage(this.dot, x - size / 2, y - size / 2, size, size);
  }

  drawWaterBody(ctx, r) {
    if (r <= 0) return;
    const { W, H, horizonY } = this.L;
    const g = ctx.createLinearGradient(0, horizonY, 0, H);
    g.addColorStop(0, `rgba(${CYAN}, 0.05)`);
    g.addColorStop(0.35, `rgba(${CYAN}, 0.022)`);
    g.addColorStop(1, `rgba(${CYAN}, 0)`);
    ctx.globalAlpha = smoothstep(clamp01(r * 1.6));
    ctx.fillStyle = g;
    ctx.fillRect(0, horizonY, W, H - horizonY);
  }

  drawHorizon(ctx, r) {
    if (r <= 0) return;
    const { W, H, cx, horizonY: y, k } = this.L;
    const e = smoothstep(r);
    const half = e * (W / 2 + 10);

    const mist = ctx.createLinearGradient(0, y - H * 0.09, 0, y + H * 0.04);
    mist.addColorStop(0, `rgba(${CYAN}, 0)`);
    mist.addColorStop(0.7, `rgba(${CYAN}, 0.045)`);
    mist.addColorStop(1, `rgba(${CYAN}, 0)`);
    ctx.globalAlpha = e * e;
    ctx.fillStyle = mist;
    ctx.fillRect(0, y - H * 0.09, W, H * 0.13);

    ctx.beginPath();
    ctx.moveTo(cx - half, y);
    ctx.lineTo(cx + half, y);
    ctx.strokeStyle = this.glowGrad;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.22;
    ctx.stroke();
    ctx.strokeStyle = this.coreGrad;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();

    if (r < 1) {
      const tip = 14 * k;
      this.drawTip(ctx, cx - half, y, 0.9, tip);
      this.drawTip(ctx, cx + half, y, 0.9, tip);
    }
  }

  /* Margem distante — um relevo baixo que corre devagar (paralaxe mínima) */
  drawRidge(ctx, r) {
    if (r <= 0) return;
    const { W, H, cx, horizonY } = this.L;
    const e = smoothstep(r);
    const half = e * (W / 2 + 10);
    const x0 = cx - half;
    const x1 = cx + half;
    const R = H * 0.032;
    const off = this.flow * 0.04;
    const ridgeY = (x) => {
      const X = x + off;
      const h =
        0.5 +
        0.3 * Math.sin(X * 0.0042 + 1.1) +
        0.18 * Math.sin(X * 0.0113 + 0.4) +
        0.07 * Math.sin(X * 0.029 + 2.3);
      return horizonY - R * Math.max(0.06, h);
    };

    ctx.beginPath();
    for (let x = x0; ; x += 12) {
      const xx = Math.min(x, x1);
      const y = ridgeY(xx);
      if (xx === x0) ctx.moveTo(xx, y);
      else ctx.lineTo(xx, y);
      if (xx >= x1) break;
    }
    ctx.strokeStyle = this.coreGrad;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2 * e;
    ctx.stroke();

    ctx.lineTo(x1, horizonY);
    ctx.lineTo(x0, horizonY);
    ctx.closePath();
    const land = ctx.createLinearGradient(0, horizonY - R, 0, horizonY);
    land.addColorStop(0, `rgba(${CYAN}, 0.03)`);
    land.addColorStop(1, `rgba(${CYAN}, 0.008)`);
    ctx.fillStyle = land;
    ctx.globalAlpha = e;
    ctx.fill();
  }

  drawWater(ctx, reveal, I) {
    if (reveal <= 0) return;
    const { W, cx, k } = this.L;
    const step = this.lite ? 14 : 10;

    for (const line of this.lines) {
      const r = smoothstep(segment(reveal, line.delay, line.delay + 0.5));
      if (r <= 0) continue;
      const half = r * (W / 2 + 24);
      const x0 = cx - half;
      const x1 = cx + half;

      ctx.beginPath();
      for (let x = x0; ; x += step) {
        const xx = Math.min(x, x1);
        const y = this.waveY(line, xx);
        if (xx === x0) ctx.moveTo(xx, y);
        else ctx.lineTo(xx, y);
        if (xx >= x1) break;
      }

      ctx.strokeStyle = this.glowGrad;
      ctx.lineWidth = line.width * 3.4;
      ctx.globalAlpha = line.alpha * 0.32;
      ctx.stroke();

      /* Na água agitada algumas linhas se partem em traços que correm com o fluxo */
      const dashed = line.dashed && I > 0.02;
      if (dashed) {
        ctx.setLineDash([lerp(260, 34, I) * k * line.s, lerp(0, 16, I) * k * line.s]);
        ctx.lineDashOffset = this.flow * line.s;
      }
      ctx.strokeStyle = this.coreGrad;
      ctx.lineWidth = line.width;
      ctx.globalAlpha = line.alpha;
      ctx.stroke();
      if (dashed) ctx.setLineDash([]);

      if (r < 1) {
        const tip = (8 + 10 * line.u) * k;
        this.drawTip(ctx, x0, this.waveY(line, x0), 0.85, tip);
        this.drawTip(ctx, x1, this.waveY(line, x1), 0.85, tip);
      }
    }
  }

  /* Cristas que brilham quando o vento agita a água */
  drawGlints(ctx, reveal, I) {
    if (I < 0.03 || reveal < 1) return;
    const { W, cx, k } = this.L;
    const t = this.t;
    ctx.strokeStyle = `rgb(${FOAM})`;
    ctx.lineWidth = 1.3;

    for (const line of this.lines) {
      if (line.u < 0.4) continue;
      const off = this.flow * line.s;
      /* topo visual da onda principal: sin(θ) = −1 */
      const base = -Math.PI / 2 - line.p1 - t * 0.8;
      const mA = Math.ceil((line.k1 * off - base) / TAU);
      const mB = Math.floor((line.k1 * (W + off) - base) / TAU);
      const len = (8 + 18 * line.u) * k;
      const ds = (6 + 12 * line.u) * k;

      for (let m = mA; m <= mB; m++) {
        const x = (base + TAU * m) / line.k1 - off;
        const tw = 0.5 + 0.5 * Math.sin(t * 2.3 + m * 2.17 + line.i * 1.7);
        const edge = clamp01((1 - Math.abs(x - cx) / (W * 0.5)) * 1.6);
        const a = Math.min(1, 1.6 * I * line.alpha * smoothstep(clamp01((tw - 0.4) / 0.6)) * edge);
        if (a < 0.03) continue;
        const y = this.waveY(line, x);
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(x - len / 2, this.waveY(line, x - len / 2));
        ctx.lineTo(x, y);
        ctx.lineTo(x + len / 2, this.waveY(line, x + len / 2));
        ctx.stroke();
        ctx.drawImage(this.dot, x - ds / 2, y - ds / 2, ds, ds);
      }
    }
  }

  /* Reflexo fatiado em faixas com deslocamento senoidal — a água "quebra" a imagem */
  drawReflection(ctx, alpha, I) {
    if (alpha <= 0.01) return;
    const { S, swanX, waterY, k } = this.L;
    const { canvas, h } = this.reflection;
    const p = this.pose;
    const t = this.t;
    const dpr = this.dpr;
    const band = 2;
    const squash = 0.92;
    const amp = lerp(1.6, 8, I) * k;

    ctx.save();
    /* espelho da pose: rotação e inclinação invertidas, balanço oposto */
    ctx.translate(swanX + S / 2 + p.x, waterY - p.y);
    ctx.rotate(-p.rot * DEG);
    ctx.transform(1, 0, Math.tan(-p.skew * DEG), 1, 0, 0);
    for (let r = 0; r < h; r += band) {
      const depth = r / h;
      const dx =
        amp * (0.35 + depth) * Math.sin(r * 0.075 + t * 2.1) +
        amp * 0.45 * Math.sin(r * 0.21 - t * 3.3);
      const shimmer = 1 - I * 0.45 * (0.5 + 0.5 * Math.sin(r * 0.32 + t * 5));
      ctx.globalAlpha = alpha * shimmer;
      ctx.drawImage(canvas, 0, r * dpr, canvas.width, band * dpr, -S / 2 + dx, r * squash, S, band * squash + 0.6);
    }
    ctx.restore();
  }

  drawRings(ctx) {
    for (const r of this.rings) {
      const q = r.age / r.life;
      const rx = r.r0 + r.grow * r.age * (1 - 0.35 * q);
      const a = r.a * Math.pow(1 - q, 1.6) * Math.min(1, q * 8);
      if (a < 0.01) continue;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, rx, rx * r.squash, 0, 0, TAU);
      ctx.strokeStyle = `rgba(${CYAN}, 1)`;
      ctx.lineWidth = 3.2;
      ctx.globalAlpha = a * 0.25;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${FOAM}, 1)`;
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = a;
      ctx.stroke();
    }
  }

  /* Esteira em V: dois braços abrem a partir do peito (o de cima some atrás do
     casco), com cristas transversais entre eles — o padrão de Kelvin, parado
     em relação ao cisne enquanto o rio corre por baixo. */
  drawWake(ctx, presence, I) {
    const a = presence * smoothstep(clamp01((I - 0.1) / 0.6));
    if (a <= 0.01) return;
    const { k, scale, swanX, waterY, W } = this.L;
    const t = this.t;
    const x0 = swanX + SWAN.chestX * scale + this.pose.x - 4 * k;
    const len = Math.min(W * 0.46, 640 * k);
    const near = 0.13;  // braço que vem na direção da câmera
    const far = -0.045; // braço que se afasta, achatado pela perspectiva
    const armY = (spread, d, ph) =>
      waterY + spread * d + Math.sin(d * 0.045 - t * 5.5 + ph) * (0.6 + (d / len) * 2.2) * k;

    const fade = ctx.createLinearGradient(x0, 0, x0 - len, 0);
    fade.addColorStop(0, `rgba(${FOAM}, 0)`);
    fade.addColorStop(0.06, `rgba(${FOAM}, 1)`);
    fade.addColorStop(0.45, `rgba(${FOAM}, 0.45)`);
    fade.addColorStop(1, `rgba(${FOAM}, 0)`);
    ctx.strokeStyle = fade;

    for (const [spread, alpha, ph] of [[near, 0.8, 0], [far, 0.5, 1.7]]) {
      ctx.beginPath();
      for (let d = 0; d <= len; d += 10) {
        const y = armY(spread, d, ph);
        if (d) ctx.lineTo(x0 - d, y);
        else ctx.moveTo(x0, y);
      }
      ctx.lineWidth = 3.2;
      ctx.globalAlpha = alpha * a * 0.25;
      ctx.stroke();
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = alpha * a;
      ctx.stroke();
    }

    /* cristas transversais — arcos entre os braços, curvados para trás */
    const gap = 58 * k;
    ctx.lineWidth = 1;
    for (let d = gap * 0.8, j = 0; d < len * 0.85; d += gap * (1 + j * 0.08), j++) {
      const q = d / len;
      const shimmer = 0.55 + 0.45 * Math.sin(t * 3.2 - j * 1.1);
      ctx.globalAlpha = a * 0.42 * (1 - q) * shimmer;
      const x = x0 - d;
      const yTop = armY(far, d, 1.7);
      const yBot = armY(near, d, 0);
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.quadraticCurveTo(x + (yBot - yTop) * 0.55, (yTop + yBot) / 2, x, yBot);
      ctx.stroke();
    }
  }

  /* Recorta o que está atrás do corpo do cisne (aplica a mesma pose do SVG) */
  eraseSwan(ctx, alpha) {
    if (alpha <= 0.01) return;
    const { S, swanX, waterY, scale } = this.L;
    const { canvas, w, h, pad } = this.occluder;
    const p = this.pose;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = alpha;
    /* mesma origem do transform-origin do SVG: centro da caixa, na linha d'água */
    ctx.translate(swanX + S / 2 + p.x, waterY + p.y);
    ctx.rotate(p.rot * DEG);
    ctx.transform(1, 0, Math.tan(p.skew * DEG), 1, 0, 0);
    ctx.drawImage(canvas, -S / 2 - pad, -SWAN.waterline * scale - pad, w, h);
    ctx.restore();
  }

  drawHalo(ctx, a, I) {
    const L = this.L;
    const amt = a * (1 + 0.6 * this.energy);
    if (amt <= 0.01) return;

    /* aura do cisne — no nado ela se alonga para trás, como um rastro de luz */
    const R = L.S * 0.66;
    ctx.save();
    ctx.translate(L.cx + this.pose.x - I * L.S * 0.04, L.swanY + SWAN.bodyY * L.scale + this.pose.y);
    ctx.scale(1 + 0.12 * I, 1);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    g.addColorStop(0, `rgba(${CYAN}, ${0.22 * amt})`);
    g.addColorStop(0.45, `rgba(${CYAN}, ${0.09 * amt})`);
    g.addColorStop(1, `rgba(${CYAN}, 0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.restore();

    /* poça de luz refletida na água */
    const R2 = L.S * 0.95;
    ctx.save();
    ctx.translate(L.cx, L.waterY + L.H * 0.012);
    ctx.scale(1, 0.17);
    const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, R2);
    g2.addColorStop(0, `rgba(${CYAN}, ${0.14 * amt})`);
    g2.addColorStop(0.5, `rgba(${CYAN}, ${0.05 * amt})`);
    g2.addColorStop(1, `rgba(${CYAN}, 0)`);
    ctx.fillStyle = g2;
    ctx.fillRect(-R2, -R2, R2 * 2, R2 * 2);
    ctx.restore();
  }

  /* Menisco: o brilho onde o casco toca a água + onda de proa no nado */
  drawContact(ctx, a, I) {
    if (a <= 0.01) return;
    const L = this.L;
    const { k, scale, swanX, waterY } = L;
    const t = this.t;
    const x0 = swanX + SWAN.tailX * scale + this.pose.x - 20 * k;
    const x1 = swanX + SWAN.chestX * scale + this.pose.x + 16 * k;

    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, `rgba(${FOAM}, 0)`);
    g.addColorStop(0.3, `rgba(${FOAM}, 0.45)`);
    g.addColorStop(0.8, `rgba(${FOAM}, 0.6)`);
    g.addColorStop(1, `rgba(${FOAM}, 0)`);
    ctx.beginPath();
    for (let x = x0; ; x += 8) {
      const xx = Math.min(x, x1);
      const y = waterY + 0.5 + Math.sin(xx * 0.05 + t * 3) * 0.8 * (1 + 2 * I);
      if (xx === x0) ctx.moveTo(xx, y);
      else ctx.lineTo(xx, y);
      if (xx >= x1) break;
    }
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = a;
    ctx.stroke();

    if (I > 0.05) {
      const chest = swanX + SWAN.chestX * scale + this.pose.x;
      const beat = 0.6 + 0.4 * Math.sin(this.bobPhase * 2);
      ctx.strokeStyle = `rgb(${FOAM})`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 2; i++) {
        ctx.globalAlpha = a * I * beat * (i ? 0.35 : 0.7);
        ctx.beginPath();
        ctx.ellipse(chest + (2 + i * 7) * k, waterY + 1.5, (12 + i * 10 + beat * 5) * k, (2.6 + i * 1.4) * k, 0, -0.1 * Math.PI, 1.05 * Math.PI);
        ctx.stroke();
      }
    }
  }

  drawSpray(ctx) {
    for (const s of this.spray) {
      const a = (1 - s.age / s.life) * 0.8;
      this.drawTip(ctx, s.x, s.y, a, s.size * 2.4);
    }
  }

  drawMotes(ctx, front, presence) {
    if (presence <= 0) return;
    const t = this.t;
    for (const m of this.motes) {
      if (m.z > 0.82 !== front) continue;
      const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + m.ph * 3);
      const a = (0.16 + 0.4 * m.z) * tw * presence;
      const speed = -m.vx;
      if (speed > 90) {
        /* com vento, a poeira vira risco na direção do sopro */
        const len = Math.min(120, speed * 0.05);
        ctx.globalAlpha = a * 0.6;
        ctx.strokeStyle = `rgb(${FOAM})`;
        ctx.lineWidth = m.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + len, m.y - m.vy * 0.02);
        ctx.stroke();
      }
      const r = m.size * (2 + 2 * m.z);
      this.drawTip(ctx, m.x, m.y, a, r * 2);
    }
  }

  drawStreaks(ctx, front, I) {
    if (!this.streaks.length) return;
    const t = this.t;
    const fade = Math.min(1, I * 1.4);
    for (const s of this.streaks) {
      if (s.front !== front) continue;
      const a = s.alpha * Math.min(1, s.age * 4) * fade;
      if (a < 0.01) continue;
      const g = ctx.createLinearGradient(s.x, 0, s.x + s.len, 0);
      g.addColorStop(0, `rgba(${FOAM}, ${a})`);
      g.addColorStop(0.25, `rgba(${CYAN}, ${a * 0.55})`);
      g.addColorStop(1, `rgba(${CYAN}, 0)`);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = g;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      for (let j = 0; j <= 6; j++) {
        const x = s.x + (s.len * j) / 6;
        const y = s.y + Math.sin(x * s.freq + s.ph + t * 2.2) * s.amp;
        if (j) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }

  drawFlash(ctx) {
    if (this.flash < 0.01) return;
    const L = this.L;
    const R = Math.max(L.W, L.H) * 0.6;
    const y = L.swanY + SWAN.bodyY * L.scale;
    const g = ctx.createRadialGradient(L.cx, y, 0, L.cx, y, R);
    g.addColorStop(0, `rgba(${CYAN}, ${0.2 * this.flash})`);
    g.addColorStop(1, `rgba(${CYAN}, 0)`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, L.W, L.H);
  }
}

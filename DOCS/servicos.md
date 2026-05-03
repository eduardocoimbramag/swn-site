# Serviços — Sugestões de Refinamento Premium

> Documento com sugestões de design para elevar a seção `#services` ao patamar de páginas como Linear, Stripe, Vercel, Resend — **sem mexer na estrutura atual** (grid de 3 cards `GlowCard` com ícone, título, descrição, lista, CTA). As sugestões são modulares: dá para aplicar todas, escolher 2-3, ou usar como cardápio para iterações futuras.

**Estado atual referenciado:**
- [src/components/Services.jsx](../src/components/Services.jsx)
- [src/components/GlowCard.jsx](../src/components/GlowCard.jsx)
- [src/data/services.js](../src/data/services.js)
- Bloco CSS `.services` / `.glow-card*` em [src/index.css](../src/index.css)

**O que NÃO muda:** layout grid de 3 colunas, paleta ciano `#83DFE9`, fontes Sora + Manrope, easing `--ease-swan`, estrutura de dados em `services.js`.

---

## Sumário das sugestões

| # | Sugestão | Esforço | Impacto |
|---|---|---|---|
| 1 | Header da seção com eyebrow + número de serviços | Baixo | Médio |
| 2 | Numeração refinada nos cards (01 / 02 / 03) | Baixo | Médio |
| 3 | Conic-gradient border mais lento + duplo halo | Baixo | Alto |
| 4 | Ícones com micro-animação on-hover | Médio | Alto |
| 5 | Lista de items com hover lateral + ícone check ciano | Baixo | Médio |
| 6 | Métrica/tag pequena por card ("12+ projetos", "SaaS B2B") | Baixo | Alto |
| 7 | "Ferramentas/Stack" abaixo da lista (chips minúsculos) | Médio | Alto |
| 8 | Linha conectora horizontal entre os 3 cards | Médio | Médio |
| 9 | Card destacado ("recomendado") com aurora intensificada | Baixo | Médio |
| 10 | Wave/grid pattern sutil no fundo da seção | Baixo | Médio |
| 11 | Tilt 3D suave no mouse-move (já tem spotlight, falta perspective) | Médio | Alto |
| 12 | "Tempo médio de entrega" como métrica visual | Baixo | Médio |
| 13 | Reveal em cascata mais coreografado (já existe, mas pode melhorar) | Baixo | Baixo |
| 14 | Dot da lista ganha glow pulsante quando o card é hover | Baixo | Médio |
| 15 | CTA inline com underline animado em vez de pill | Baixo | Baixo |

---

## 1. Header da seção com eyebrow + contador

Hoje só temos `<h2>` + subtítulo. Adicionar um **eyebrow tipográfico** (já existe `.eyebrow` no CSS, basta usar) com a quantidade de serviços ou uma label estratégica.

```jsx
<div className="section-head">
  <span className="eyebrow">3 frentes · 1 método</span>
  <motion.h2 className="section-title">
    Serviços <span className="cyan">com propósito.</span>
  </motion.h2>
  <motion.p className="section-subtitle">
    Desenvolvimento, presença digital e design estratégico para empresas que
    querem crescer com sofisticação e resultado.
  </motion.p>
</div>
```

**Por que é premium:** todas as marcas premium usam eyebrow para "ancorar" o leitor antes do título. Stripe ("Built for global businesses"), Linear ("The issue tracker..."), Vercel ("Develop. Preview. Ship.").

---

## 2. Numeração refinada nos cards

Adicionar um número grande no canto superior direito de cada card — bem sutil, em cinza muito escuro com leve brilho ciano. Lembra revistas editoriais.

```jsx
{/* dentro do GlowCard */}
<span className="glow-card-num">{String(index + 1).padStart(2, '0')}</span>
```

```css
.glow-card-num {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 3.5rem;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(131,223,233,0.18));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  transition: opacity 0.5s ease;
}

.glow-card:hover .glow-card-num {
  opacity: 1.3; /* sobe a percepção sem ficar gritante */
}
```

**Por que é premium:** padrão clássico de revistas (Monocle, Wallpaper). Cria hierarquia visual sem competir com o título.

---

## 3. Conic-gradient mais lento + duplo halo no hover

Hoje o `::before` do glow-card tem `animation: rotateBorder 6s linear infinite`. Em sites premium, esse efeito é **mais lento** (10-14s) para parecer "vivo, não nervoso", e ganha um **segundo halo radial** que aparece atrás no hover.

```css
.glow-card::before {
  /* ... mantém tudo que tem ... */
  animation-duration: 12s; /* era 6s */
}

.glow-card::after {
  /* substituir o background atual por: */
  background:
    radial-gradient(60% 50% at 50% 0%, rgba(131, 223, 233, 0.08), transparent 70%),
    linear-gradient(180deg, #0A0D0F, #06080A);
}

/* Novo halo externo no hover — vive fora do card */
.glow-card {
  /* ... resto igual ... */
}

.glow-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 30px 80px -30px rgba(131, 223, 233, 0.45),
    0 0 0 1px rgba(131, 223, 233, 0.2);
}
```

**Por que é premium:** o que diferencia "card legal" de "card premium" é justamente a velocidade da animação ambiental e a sombra projetada no hover. Hoje a sombra está fraca.

---

## 4. Ícones com micro-animação no hover

Os ícones em [ServiceIcons.jsx](../src/components/svg/ServiceIcons.jsx) são SVG line. Aplicar um `<motion.g>` que faz uma rotação de 360° super suave **uma única vez** quando o card entra em hover, OU um stroke-dashoffset que "redesenha" o ícone.

```jsx
// Dentro do GlowCard.jsx
const [iconPlaying, setIconPlaying] = useState(false);

<motion.div
  ref={ref}
  className="glow-card"
  onMouseEnter={() => setIconPlaying(true)}
  onMouseLeave={() => setIconPlaying(false)}
>
  <div className="glow-card-icon">
    <motion.div
      animate={iconPlaying ? { rotate: [0, -8, 8, 0], scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.9, ease: swanEase }}
    >
      {icon}
    </motion.div>
  </div>
  ...
</motion.div>
```

Variante mais sofisticada — **path stroke redesenha** quando o card é hover (já temos infraestrutura para isso no Hero/Swan). Cada ícone pode ter sua "assinatura" de movimento (ex: ícone de software pisca leds, web "carrega" uma barra, design desenha um traço).

---

## 5. Lista de items com hover lateral + check ciano

Hoje a lista tem `<span className="item-dot" />` — uma bolinha. Versão premium: o item inteiro **desliza 4px para a direita** ao passar o mouse, e o dot vira um check ciano.

```css
.glow-card-items li {
  position: relative;
  padding-left: 1.5rem;
  cursor: default;
  transition: color 0.3s ease, transform 0.4s var(--ease-swan);
}

.glow-card-items li:hover {
  color: var(--white);
  transform: translateX(4px);
}

.item-dot {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  /* ... resto igual ... */
}

/* Quando o card está hover, dots ganham um pulse muito sutil */
.glow-card:hover .item-dot {
  animation: dotPulse 2.4s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 8px var(--cyan-glow); }
  50%      { box-shadow: 0 0 16px var(--cyan-glow); }
}
```

---

## 6. Tag/métrica pequena por card

Cada serviço pode ter uma **tag de credibilidade** abaixo da descrição: "12+ entregas", "SaaS B2B", "Marcas premium". Texto em Sora 0.7rem, letter-spacing alto, com pílula ciano-line.

Atualizar `services.js`:

```js
{
  key: 'software',
  title: 'Software Development',
  tag: '12+ produtos no ar',
  // ...
},
{
  key: 'web',
  title: 'Web Development',
  tag: 'Foco em conversão',
  // ...
},
{
  key: 'design',
  title: 'Design & Social Media',
  tag: 'Marcas premium',
  // ...
}
```

```jsx
{tag && <span className="glow-card-tag">{tag}</span>}
```

```css
.glow-card-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cyan);
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--cyan-line);
  border-radius: 999px;
  background: rgba(131, 223, 233, 0.06);
  margin-bottom: 1rem;
  align-self: flex-start;
}

.glow-card-tag::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}
```

**Por que é premium:** tags pequenas ancoram credibilidade rapidamente. Stripe, Linear e Vercel usam micro-credentials assim em todas as suas seções de produto.

---

## 7. Stack de ferramentas abaixo da lista

Para cada serviço, mostrar **3-5 chips** com as tecnologias/ferramentas usadas. O Portfolio já usa `.portfolio-stack` — aqui seria uma versão mais compacta.

`services.js`:

```js
{
  key: 'software',
  // ...
  stack: ['React', 'Node', 'Postgres', 'AWS', 'Docker']
},
{
  key: 'web',
  // ...
  stack: ['Next.js', 'Framer Motion', 'Tailwind', 'Vercel']
},
{
  key: 'design',
  // ...
  stack: ['Figma', 'After Effects', 'Lottie', 'Webflow']
}
```

```jsx
{stack && (
  <ul className="glow-card-stack">
    {stack.map((s) => <li key={s}>{s}</li>)}
  </ul>
)}
```

```css
.glow-card-stack {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0 0 1rem;
  padding: 0;
}

.glow-card-stack li {
  font-family: 'Sora', sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--text-soft);
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  transition: border-color 0.3s ease, color 0.3s ease;
}

.glow-card:hover .glow-card-stack li {
  border-color: var(--border-strong);
}
```

---

## 8. Linha conectora entre os 3 cards

Em desktop, uma linha tracejada **horizontal** atrás dos 3 cards, com 3 dots ciano nos pontos onde cada card "intercepta". Sutil mas conta uma história visual de "fluxo".

```css
.services-grid {
  position: relative;
}

.services-grid::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 8%;
  right: 8%;
  height: 1px;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    var(--cyan-line) 30%,
    var(--cyan-line) 70%,
    transparent 100%
  );
  background-size: 8px 1px;
  background-repeat: repeat-x;
  background-position: center;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .services-grid::before {
    display: none; /* em coluna única perde sentido */
  }
}
```

**Variação:** linha vertical à esquerda da seção (não dentro do grid) com 3 dots alinhados aos cards. Estilo "timeline editorial".

---

## 9. Card "destacado" (recomendado)

Um dos serviços (provavelmente Software Development) ganha:
- Um label "RECOMENDADO" no topo (eyebrow ciano-fill, não outline)
- Aurora interna mais intensa (radial gradient ciano em vez de quase imperceptível)
- Borda animada **mais rápida** (4s em vez de 12s)

```jsx
// services.js
{
  key: 'software',
  featured: true,
  // ...
}

// GlowCard.jsx
<motion.div className={`glow-card ${featured ? 'glow-card--featured' : ''}`}>
  {featured && <span className="glow-card-flag">Recomendado</span>}
  ...
</motion.div>
```

```css
.glow-card--featured {
  /* aurora interna mais presente */
}

.glow-card--featured::after {
  background:
    radial-gradient(60% 50% at 50% 0%, rgba(131, 223, 233, 0.18), transparent 70%),
    linear-gradient(180deg, #0A0D0F, #06080A);
}

.glow-card--featured::before {
  animation-duration: 5s; /* mais rápido = mais "atenção" */
  opacity: 0.35; /* parcialmente visível mesmo sem hover */
}

.glow-card-flag {
  position: absolute;
  top: -0.6rem;
  left: 1.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--black);
  background: var(--cyan);
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  box-shadow: 0 6px 18px -4px var(--cyan-glow);
  z-index: 2;
}
```

---

## 10. Background pattern sutil na seção

A seção `.services` está num fundo padrão. Adicionar um **grid pattern muito discreto** (já existe `body::after`, mas localmente pode ser intensificado) ou uma **mancha de aurora** atrás dos cards.

```css
.services {
  position: relative;
}

.services::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1000px 500px at 50% 0%, rgba(131, 223, 233, 0.06), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.section-head,
.services-grid {
  position: relative;
  z-index: 1;
}
```

---

## 11. Tilt 3D suave no mouse-move

Hoje o card já recebe `--mx`/`--my` para o spotlight. Aproveitar e adicionar **rotateX/rotateY pequenos** (max 4°) baseados na posição do mouse — o card "olha" para o cursor.

```jsx
const handleMouseMove = (e) => {
  const el = ref.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);

  /* tilt suave: -4° a +4° */
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rx = ((y - cy) / cy) * -4;
  const ry = ((x - cx) / cx) * 4;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
};

const handleMouseLeave = () => {
  const el = ref.current;
  if (!el) return;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
};
```

```css
.glow-card {
  perspective: 1000px;
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
  transition: transform 0.6s var(--ease-swan), border-color 0.4s ease;
}

.glow-card:hover {
  transform:
    perspective(1000px)
    rotateX(var(--rx, 0deg))
    rotateY(var(--ry, 0deg))
    translateY(-6px);
}
```

**Por que é premium:** o tilt 3D é a marca registrada de UI/UX modernas (Apple, Linear). É sutil, quase subliminar — o usuário não percebe conscientemente, mas sente que o card "vive".

---

## 12. Métrica de "tempo médio de entrega"

Embaixo da lista, um pequeno bloco com uma métrica forte:

```jsx
<div className="glow-card-metric">
  <span className="glow-card-metric-value">4 semanas</span>
  <span className="glow-card-metric-label">tempo médio de entrega</span>
</div>
```

```css
.glow-card-metric {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border);
}

.glow-card-metric-value {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
  color: var(--cyan);
}

.glow-card-metric-label {
  font-size: 0.78rem;
  color: var(--text-mute);
  letter-spacing: 0.04em;
}
```

---

## 13. Reveal em cascata mais coreografado

Hoje cada card entra com `delay: index * 0.12`. Versão refinada:
- O **header da seção** entra primeiro
- Os ícones de cada card entram **antes** do resto do conteúdo (delay extra)
- Os items da lista entram em cascata interna depois do card aparecer

```jsx
// dentro do GlowCard
<motion.div className="glow-card" /* ... */>
  <motion.div
    className="glow-card-icon"
    initial={{ scale: 0.6, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, delay: index * 0.12 + 0.3, ease: swanEase }}
    viewport={{ once: true }}
  >
    {icon}
  </motion.div>

  {/* ... */}

  <ul className="glow-card-items">
    {items.map((item, i) => (
      <motion.li
        key={i}
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.12 + 0.6 + i * 0.06 }}
        viewport={{ once: true }}
      >
        <span className="item-dot" /> {item}
      </motion.li>
    ))}
  </ul>
</motion.div>
```

---

## 14. Dots da lista com glow pulsante

Quando o card está em hover, os dots da lista ganham um glow ciano pulsando — reforça que o card está "ativo".

```css
@keyframes dotPulseGlow {
  0%, 100% {
    box-shadow: 0 0 8px var(--cyan-glow);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 18px var(--cyan-glow), 0 0 4px var(--cyan);
    opacity: 0.85;
  }
}

.glow-card:hover .item-dot {
  animation: dotPulseGlow 2s ease-in-out infinite;
}
```

E para os dots **entrarem em cascata sequencial** quando o card é hover (efeito "carregando do topo pra baixo"):

```css
.glow-card:hover .glow-card-items li:nth-child(1) .item-dot { animation-delay: 0.0s; }
.glow-card:hover .glow-card-items li:nth-child(2) .item-dot { animation-delay: 0.15s; }
.glow-card:hover .glow-card-items li:nth-child(3) .item-dot { animation-delay: 0.3s; }
.glow-card:hover .glow-card-items li:nth-child(4) .item-dot { animation-delay: 0.45s; }
.glow-card:hover .glow-card-items li:nth-child(5) .item-dot { animation-delay: 0.6s; }
```

---

## 15. CTA inline com underline animado

Hoje o CTA é uma pílula com border ciano. Versão alternativa premium: **link inline** com underline animado da esquerda pra direita no hover (estilo Linear).

```css
.glow-card-cta {
  /* remove background, padding, border-radius, border */
  background: transparent;
  border: 0;
  padding: 0;
  margin-top: 1.25rem;
  align-self: flex-start;

  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: -0.005em;
  color: var(--cyan);
  position: relative;
  cursor: pointer;
}

.glow-card-cta::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1px;
  background: var(--cyan);
  transform: scaleX(0.4);
  transform-origin: left;
  transition: transform 0.5s var(--ease-swan);
}

.glow-card-cta:hover::after {
  transform: scaleX(1);
}

.glow-card-cta:hover .btn-arrow {
  transform: translateX(4px);
}
```

**Por que é premium:** menos UI, mais conteúdo. Pílulas são úteis mas se houver muitas na página, perdem peso. Underline animado é "tipográfico", não "componente".

---

## Combinações recomendadas

Depende do quanto você quer puxar a seção pra cima:

### 🥉 Pacote "Refresh leve" (1-2h)
Sugestões **1 + 2 + 3 + 14**
- Eyebrow no topo
- Numeração 01/02/03 nos cards
- Conic-gradient mais lento + sombra hover mais forte
- Dots pulsantes no hover

### 🥈 Pacote "Editorial" (2-3h)
Sugestões **1 + 2 + 6 + 7 + 11 + 15**
- Eyebrow + numeração
- Tag de credibilidade
- Stack de ferramentas
- Tilt 3D
- CTA com underline em vez de pílula

### 🥇 Pacote "Marca premium" (4-5h)
Sugestões **1 + 2 + 4 + 6 + 7 + 9 + 11 + 12 + 13**
- Tudo do Editorial
- + Ícones com micro-animação assinatura
- + Card destacado "Recomendado"
- + Métrica de tempo de entrega
- + Reveal coreografado em cascata

---

## Notas de implementação

- **Compatibilidade:** todas as sugestões respeitam a estrutura atual de `services.js` — basta adicionar campos opcionais (`tag`, `stack`, `featured`, `metric`)
- **Reduced motion:** qualquer animação repetitiva (pulse, conic rotation) deve respeitar `@media (prefers-reduced-motion: reduce)` — já existe um override global no projeto
- **Performance:** o tilt 3D usa CSS variables setadas via JS, não causa reflow. O conic-gradient com `@property --angle` é GPU-accelerated. Tudo viável sem jank
- **Acessibilidade:** ícone de check (sugestão 5) deve ter `aria-hidden`, tag de "Recomendado" deve ser legível por leitores de tela (não só decorativa)

---

## Próximos passos

Quando quiser implementar, me indica qual pacote (🥉/🥈/🥇) ou quais números específicos das 15 sugestões. Posso fazer todas em uma rodada ou iterativamente em PRs separados.

---

*Documento de sugestões. Nenhum código foi alterado — aguardando seleção.*

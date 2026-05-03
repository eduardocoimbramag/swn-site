# Processo — Sugestões de Refinamento Premium

> Documento com sugestões de design para elevar a seção `#process` ao patamar editorial premium (Stripe, Linear, Vercel, Resend), **sem mexer na estrutura atual** (grid de 4 cards numerados 01→04 com ícone, título, descrição). As sugestões são modulares: aplicar todas, escolher 2-3, ou usar como cardápio para iterações.

**Estado atual referenciado:**
- [src/components/Process.jsx](../src/components/Process.jsx)
- Bloco CSS `.process*` em [src/index.css](../src/index.css)

**O que NÃO muda:** layout grid de 4 colunas, paleta ciano `#83DFE9`, fontes Sora + Manrope, easing `--ease-swan`, estrutura dos 4 passos (Diagnóstico → Estratégia → Desenvolvimento → Entrega & Evolução).

---

## Sumário das sugestões

| # | Sugestão | Esforço | Impacto |
|---|---|---|---|
| 1 | Eyebrow "MÉTODO SWN" + "4 etapas, 1 entrega" no header | Baixo | Médio |
| 2 | Linha conectora **animada** entre os 4 cards (ligação por scroll) | Médio | Alto |
| 3 | Numeração outline → fill ciano gradual no hover | Baixo | Alto |
| 4 | Ícone com micro-animação assinatura por etapa | Médio | Alto |
| 5 | Step-by-step ativo durante scroll (sticky timeline mode) | Alto | Alto |
| 6 | Indicador de progresso interno por card (barra fina ciano) | Baixo | Médio |
| 7 | Tag de duração estimada por etapa ("2-3 dias", "1 semana") | Baixo | Alto |
| 8 | Tilt 3D suave (igual aos GlowCards de Services) | Baixo | Médio |
| 9 | Reveal coreografado em cascata + linha desenhando | Médio | Alto |
| 10 | Card destacado para a etapa atual (estado "ativo") | Médio | Médio |
| 11 | Mini-checklist por etapa (3 entregáveis-chave) | Médio | Alto |
| 12 | Badge "início" / "fim" nos cards 01 e 04 | Baixo | Baixo |
| 13 | Hover sincronizado: ao passar em um card, os outros desbotam | Baixo | Médio |
| 14 | Background com grade técnica sutil + aurora ciano | Baixo | Médio |
| 15 | Versão alternativa: timeline vertical (mobile-first) | Alto | Alto |

---

## 1. Eyebrow "MÉTODO SWN" no header

Hoje só tem `<h2>` + subtítulo. Adicionar uma label estratégica acima do título, reforçando que o processo é **proprietário** (não genérico).

```jsx
<div className="section-head">
  <span className="eyebrow">Método SWN · 4 etapas, 1 entrega</span>
  <motion.h2 className="section-title">
    Nosso <span className="cyan">processo.</span>
  </motion.h2>
  <motion.p className="section-subtitle">
    Da estratégia à entrega, cada etapa é pensada para unir estética,
    funcionalidade e resultado.
  </motion.p>
</div>
```

A classe `.eyebrow` já existe no projeto — basta usar. **Por que é premium:** ancora o leitor, sinaliza estrutura, evita parecer "um processo genérico copiado".

---

## 2. Linha conectora animada entre os cards

Hoje os 4 cards estão soltos no grid. Versão premium: uma **linha tracejada horizontal** atrás dos cards, com 4 dots ciano alinhados aos centros, **e a linha "preenche" da esquerda pra direita conforme o usuário rola** a seção.

### 2.1 Estrutura

```jsx
<div className="process-grid">
  <span className="process-rail" aria-hidden="true">
    <motion.span
      className="process-rail-fill"
      style={{ scaleX: railProgress }}
    />
  </span>

  {steps.map((step, i) => (
    <motion.div className="process-card" /* ... */>
      <span className="process-rail-dot" data-step={i + 1} />
      {/* resto do card */}
    </motion.div>
  ))}
</div>
```

### 2.2 CSS

```css
.process-grid {
  position: relative;
}

.process-rail {
  position: absolute;
  top: 50%;
  left: 6%;
  right: 6%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
  z-index: 0;
}

.process-rail-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--cyan), rgba(131, 223, 233, 0.3));
  transform-origin: left;
  box-shadow: 0 0 14px var(--cyan-glow);
}

.process-rail-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-elev);
  border: 1.5px solid var(--cyan-line);
  transform: translate(-50%, -50%);
  z-index: 1;
  transition: background 0.4s var(--ease-swan), border-color 0.4s ease;
}

.process-card.is-reached .process-rail-dot {
  background: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 14px var(--cyan-glow);
}

@media (max-width: 1024px) {
  .process-rail { display: none; } /* perde sentido em coluna única */
}
```

### 2.3 Lógica React

```jsx
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start 80%', 'end 20%']
});
const railProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
const [reached, setReached] = useState([false, false, false, false]);

useMotionValueEvent(railProgress, 'change', (v) => {
  setReached([v >= 0.1, v >= 0.35, v >= 0.6, v >= 0.85]);
});
```

E aplica `className={`process-card ${reached[i] ? 'is-reached' : ''}`}`.

**Por que é premium:** transforma 4 cards isolados em **uma jornada visual** ligada. É a metáfora literal do "processo" — não só semântica, mas visual.

---

## 3. Numeração outline → fill no hover

Hoje os números (`process-num text`) usam `fill: none; stroke: rgba(...)` — outline ciano translúcido. Versão refinada: no hover do card, o número **se preenche gradualmente** de baixo pra cima com ciano (efeito "carregando").

```css
.process-num text {
  fill: rgba(131, 223, 233, 0); /* começa transparente */
  stroke: rgba(131, 223, 233, 0.32);
  stroke-width: 1.4;
  paint-order: stroke;
  transition: fill 0.7s var(--ease-swan), stroke 0.4s ease;
}

.process-card:hover .process-num text {
  fill: rgba(131, 223, 233, 0.18);
  stroke: var(--cyan);
}
```

Variação ainda mais sofisticada — fill com gradient vertical animado:

```css
.process-num text {
  fill: url(#numGradient);
}
```

```jsx
<svg>
  <defs>
    <linearGradient id="numGradient" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#83DFE9" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#83DFE9" stopOpacity="0" />
    </linearGradient>
  </defs>
  <text>{step.n}</text>
</svg>
```

---

## 4. Ícones com micro-animação assinatura

Cada ícone tem uma **animação própria** quando o card é hover, alinhada ao significado da etapa:

| Etapa | Ícone | Micro-animação |
|---|---|---|
| 01 Diagnóstico | DiagnoseIcon (lupa) | rotação leve de busca (-15° → 15° → 0°) |
| 02 Estratégia | StrategyIcon (mira) | escala pulsante das ramificações (1 → 1.1 → 1) |
| 03 Desenvolvimento | DevelopIcon (chevrons) | translate horizontal (entrada/saída) |
| 04 Entrega | DeliverIcon (check) | check redesenha (pathLength 0→1) |

```jsx
const [iconPlaying, setIconPlaying] = useState(false);

<motion.div
  className="process-icon-inner"
  animate={iconPlaying ? signature[i] : { rotate: 0, scale: 1, x: 0 }}
  transition={{ duration: 0.9, ease: swanEase }}
>
  {step.icon}
</motion.div>
```

**Por que é premium:** ícones que "respondem" são marca registrada de produtos como Linear, Notion. Faz o usuário querer passar o mouse em todos para "ver o que cada um faz".

---

## 5. Sticky timeline mode (modo dramático)

Versão mais ambiciosa: a seção `.process` ganha altura `220vh`, e dentro dela um sticky frame mostra **um card grande por vez** ocupando 60% da viewport, enquanto o usuário rola passa para o próximo. Igual ao SwanScrollDraw.

**Pros:** extremamente premium, cinematográfico.
**Cons:** mexe muito na estrutura (não é mais grid de 4 cards, vira animação por scroll).
**Recomendação:** só implementar se quiser **substituir** o layout atual; senão, manter o grid e usar a sugestão #2 (rail) que entrega 70% do efeito com 20% do esforço.

---

## 6. Indicador de progresso interno por card

Cada card ganha uma **barra fina ciano no topo** que carrega lentamente (loop infinito muito sutil) — sugestão de "processo em andamento" sem ser intrusivo.

```css
.process-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--cyan) 50%,
    transparent 100%
  );
  background-size: 50% 100%;
  background-repeat: no-repeat;
  background-position: -50% 0;
  animation: processBarSlide 4s linear infinite;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.process-card:hover::before {
  opacity: 1;
}

@keyframes processBarSlide {
  to { background-position: 150% 0; }
}
```

Ativa só no hover — não polui na visualização passiva.

---

## 7. Tag de duração estimada

Cada etapa ganha uma **pílula com tempo estimado**, similar às tags do Portfolio. Adiciona dimensão de "compromisso" — vende confiança operacional.

`Process.jsx`:

```js
const steps = [
  { n: '01', title: 'Diagnóstico', duration: '2-3 dias', /* ... */ },
  { n: '02', title: 'Estratégia', duration: '1 semana', /* ... */ },
  { n: '03', title: 'Desenvolvimento', duration: '3-6 semanas', /* ... */ },
  { n: '04', title: 'Entrega & Evolução', duration: 'contínuo', /* ... */ }
];
```

```jsx
<span className="process-duration">{step.duration}</span>
```

```css
.process-duration {
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
  margin-top: 0.85rem;
  align-self: flex-start;
}

.process-duration::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 6px var(--cyan);
}
```

**Por que é premium:** transparência operacional. Saber **quanto tempo dura cada etapa** é o que separa "vou contratar" de "vou pensar".

---

## 8. Tilt 3D suave (igual aos GlowCards)

Replicar o tilt 3D já implementado em [GlowCard.jsx](../src/components/GlowCard.jsx) — `--rx`/`--ry` baseados na posição do mouse, max ±4°.

```jsx
const handleMouseMove = (e) => {
  const el = ref.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const rx = ((e.clientY - rect.top - cy) / cy) * -4;
  const ry = ((e.clientX - rect.left - cx) / cx) * 4;
  el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
  el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
};

const handleMouseLeave = () => {
  ref.current?.style.setProperty('--rx', '0deg');
  ref.current?.style.setProperty('--ry', '0deg');
};
```

```css
.process-card {
  perspective: 1000px;
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.6s var(--ease-swan), border-color 0.4s ease, box-shadow 0.5s ease;
}

.process-card:hover {
  transform:
    perspective(1000px)
    rotateX(var(--rx, 0deg))
    rotateY(var(--ry, 0deg))
    translateY(-6px);
  /* substituindo o box-shadow atual */
  box-shadow:
    0 28px 70px -28px rgba(131, 223, 233, 0.40),
    0 0 0 1px rgba(131, 223, 233, 0.15);
}
```

---

## 9. Reveal coreografado em cascata

Hoje o reveal é simples: `delay: i * 0.12`. Versão premium:

1. Header da seção entra
2. Linha conectora "desenha" da esquerda pra direita (`scaleX 0→1` em 1.2s)
3. Os 4 cards entram em cascata 0.15s entre cada
4. Dentro de cada card, ícone aparece primeiro (delay extra), depois título, depois descrição
5. Os números (01, 02, 03, 04) "preenchem" do outline para o stroke ciano em sequência

```jsx
<motion.div
  className="process-card"
  initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.9, delay: i * 0.15, ease: swanEase }}
>
  <motion.span
    className="process-num"
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: i * 0.15 + 0.4, ease: swanEase }}
  >
    {/* svg */}
  </motion.span>

  <motion.div
    className="process-icon"
    initial={{ scale: 0.6, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, delay: i * 0.15 + 0.5, ease: swanEase }}
  >
    {step.icon}
  </motion.div>

  <motion.h3
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: i * 0.15 + 0.7 }}
  >
    {step.title}
  </motion.h3>

  <motion.p
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: i * 0.15 + 0.85 }}
  >
    {step.description}
  </motion.p>
</motion.div>
```

---

## 10. Card "ativo" (estado destacado)

Em alguns sites, o **primeiro card** já vem em estado "ativo" para chamar atenção (borda ciano, número fill, etc.) — sugere "começa aqui". Variantes:

- **Sempre o primeiro destacado** — simples, mas estático
- **Destacado sincronizado com scroll** — o card ativo muda conforme o usuário rola (acompanha o `is-reached` do rail)
- **Destacado quando o cursor está fora dos cards** — primeiro card volta a destaque ao perder o hover dos outros

Recomendação: combinar com #2 — o card vira `is-reached` quando o rail passa por ele, ganha:
- Borda ciano cheia (não translúcida)
- Número com fill ciano
- Ícone com background mais saturado

```css
.process-card.is-reached {
  border-color: var(--cyan-line);
}
.process-card.is-reached .process-num text {
  fill: rgba(131, 223, 233, 0.18);
  stroke: var(--cyan);
}
.process-card.is-reached .process-icon {
  background: rgba(131, 223, 233, 0.14);
  border-color: var(--cyan);
}
```

---

## 11. Mini-checklist por etapa

Cada card ganha **3 entregáveis-chave** abaixo da descrição. Transforma o card de "descrição vaga" em "promessa concreta".

`Process.jsx`:

```js
const steps = [
  {
    n: '01',
    title: 'Diagnóstico',
    description: 'Entendemos o momento da empresa, seus objetivos e os gargalos que precisam ser resolvidos.',
    duration: '2-3 dias',
    deliverables: [
      'Briefing estratégico',
      'Mapa de gargalos',
      'Definição de escopo'
    ]
  },
  // ... outros steps
];
```

```jsx
{step.deliverables && (
  <ul className="process-deliverables">
    {step.deliverables.map((d) => (
      <li key={d}><span className="process-deliverable-mark" /> {d}</li>
    ))}
  </ul>
)}
```

```css
.process-deliverables {
  list-style: none;
  display: grid;
  gap: 0.4rem;
  margin: 1rem 0 0;
  padding: 1rem 0 0;
  border-top: 1px dashed var(--border);
  padding: 0;
}

.process-deliverables li {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.84rem;
  color: var(--text-soft);
}

.process-deliverable-mark {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 6px var(--cyan-glow);
  flex-shrink: 0;
}
```

---

## 12. Badges "Início" / "Fim"

Pequenas etiquetas nos cards 01 e 04 sinalizando o começo e o fim do processo. Sutil mas reforça narrativa.

```jsx
{i === 0 && <span className="process-badge process-badge--start">início</span>}
{i === steps.length - 1 && <span className="process-badge process-badge--end">entrega</span>}
```

```css
.process-badge {
  position: absolute;
  top: -0.55rem;
  left: 1.5rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  z-index: 2;
}

.process-badge--start {
  background: var(--cyan);
  color: var(--black);
  box-shadow: 0 6px 18px -4px var(--cyan-glow);
}

.process-badge--end {
  background: rgba(131, 223, 233, 0.12);
  color: var(--cyan);
  border: 1px solid var(--cyan-line);
}
```

---

## 13. Hover sincronizado: outros cards desbotam

Quando o usuário passa o mouse em um card, os **outros 3 ficam com opacity reduzida** — foco visual concentrado.

```jsx
const [hoveredIndex, setHoveredIndex] = useState(null);

<div className={`process-grid ${hoveredIndex !== null ? 'is-focusing' : ''}`}>
  {steps.map((step, i) => (
    <motion.div
      className="process-card"
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
```

```css
.process-grid.is-focusing .process-card {
  opacity: 0.55;
  filter: saturate(0.6);
  transition: opacity 0.4s ease, filter 0.4s ease;
}

.process-grid.is-focusing .process-card:hover {
  opacity: 1;
  filter: saturate(1);
}
```

**Por que é premium:** padrão clássico de interfaces editoriais. Reduz "ruído visual" ao concentrar atenção.

---

## 14. Background técnico + aurora

Hoje a `.process` tem um gradient muito sutil. Versão premium: grade técnica de fundo (sutil, ~0.02 opacity) + uma aurora ciano horizontal centralizada.

```css
.process {
  position: relative;
  isolation: isolate;
}

.process::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(131, 223, 233, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(131, 223, 233, 0.025) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, black 0%, transparent 80%);
  pointer-events: none;
  z-index: -1;
}

.process::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 300px at 50% 50%, rgba(131, 223, 233, 0.08), transparent 70%);
  pointer-events: none;
  z-index: -1;
}
```

---

## 15. Variante alternativa — Timeline vertical

Em vez de grid horizontal, **timeline vertical** com:
- Linha vertical ciano à esquerda
- 4 nós (dots) alinhados à linha
- Conteúdo do passo à direita do nó
- Linha "preenche" de cima pra baixo conforme scroll

**Funciona muito bem em mobile** (não precisa virar coluna única, já é vertical) e tem leitura mais "narrativa" (estilo storytelling).

**Cons:** ocupa muito mais altura vertical, e perde a vibe "estrutural / método" do grid 4×1.

**Recomendação:** manter grid 4×1 em desktop (visual atual), e aplicar timeline vertical APENAS em mobile (≤ 768px). Isso resolve o ponto fraco do mobile (cards empilhados sem conexão visual).

```css
@media (max-width: 768px) {
  .process-grid {
    grid-template-columns: 1fr;
    /* ... */
  }
  .process-card {
    padding-left: 4rem; /* espaço pra linha vertical */
    position: relative;
  }
  .process-card::before {
    content: '';
    position: absolute;
    left: 1.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--cyan-line), rgba(131, 223, 233, 0.05));
  }
  .process-card:last-child::before {
    bottom: 50%;
  }
  .process-card::after {
    content: '';
    position: absolute;
    left: 1rem;
    top: 2rem;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--bg-elev);
    border: 2px solid var(--cyan);
    box-shadow: 0 0 12px var(--cyan-glow);
  }
}
```

---

## Combinações recomendadas

### 🥉 Pacote "Refresh leve" (1-2h)
Sugestões **1 + 3 + 7 + 14**
- Eyebrow "Método SWN"
- Numeração outline → fill no hover
- Tag de duração por etapa
- Background técnico + aurora

### 🥈 Pacote "Editorial" (2-3h)
Sugestões **1 + 2 + 3 + 7 + 8 + 13 + 14**
- Tudo do leve
- + Linha conectora animada com dots
- + Tilt 3D
- + Hover sincronizado (outros desbotam)

### 🥇 Pacote "Marca premium" (4-5h)
Sugestões **1 + 2 + 3 + 4 + 7 + 8 + 9 + 10 + 11 + 14 + 15**
- Tudo do Editorial
- + Ícones com micro-animação assinatura
- + Card ativo sincronizado com scroll
- + Mini-checklist de entregáveis por etapa
- + Reveal coreografado em cascata
- + Timeline vertical em mobile

---

## Notas de implementação

- **Compatibilidade:** todas as sugestões respeitam a estrutura atual de `steps` em `Process.jsx` — basta adicionar campos opcionais (`duration`, `deliverables`)
- **Reduced motion:** o pulso do progresso (#6), o reveal coreografado (#9) e o rail animado (#2) devem respeitar `@media (prefers-reduced-motion: reduce)` — o override global já cuida da maior parte, mas validar para o `useScroll` (substitui por estado final)
- **Performance:** `useMotionValueEvent` na linha conectora é leve (só atualiza state quando bool muda). Tilt 3D usa CSS variables sem reflow. Tudo viável
- **Acessibilidade:** rail e dots são decorativos (`aria-hidden`). Tag de duração e checklist são informativos — devem ser legíveis por leitor de tela

---

## Próximos passos

Quando quiser implementar, me indica qual pacote (🥉/🥈/🥇) ou quais números específicos das 15 sugestões. Posso fazer todas em uma rodada ou iterativamente.

---

*Documento de sugestões. Nenhum código foi alterado — aguardando seleção.*

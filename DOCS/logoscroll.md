# SwanScrollDraw — Diagnóstico & Alternativas Premium

> Documento focado na seção que "trava" a tela enquanto o cisne é desenhado por scroll. O efeito de desenho deve ser preservado — o objetivo é elevar a apresentação ao nível premium e resolver os problemas de composição visual.

---

## 1. O que existe hoje

**Componente.** [src/components/svg/SwanScrollDraw.jsx](../src/components/svg/SwanScrollDraw.jsx) renderiza uma `<section>` com altura `260vh` que contém um wrapper `position: sticky; top: 0; height: 100vh`. Conforme o usuário rola, três curvas de transformação animam:

- `strokeLen` (pathLength 0→1) entre 8% e 72% do progresso → o cisne é "desenhado"
- `fillOpacity` (0→1) entre 72% e 88% → o preenchimento aparece
- `narrativeOpacity` (0→1) entre 88% e 96% → texto secundário entra
- `titleOpacity` desce a 0 entre 90% e 100%

**CSS.** `.swan-scroll-stage` tem `width: min(46vh, 420px)` — o cisne fica **muito pequeno** (~420px de lado) ocupando uma fração mínima da viewport.

**Halo.** Um único `radial-gradient` circular ciano com blur de 28px serve de fundo.

---

## 2. Problemas identificados (análise do print)

### 🔴 P1 — Composição vazia e desbalanceada
A seção tem `260vh` de scroll travado mas **mostra apenas o cisne pequeno no centro**. O título fica grudado no topo, o cisne ocupa ~30% da viewport, e há ~25% de espaço vazio acima e abaixo. Falta densidade visual — a tela está **literalmente vazia** durante metade da animação.

### 🔴 P2 — Cisne genérico, sem destaque
O traço final tem `strokeWidth: 2.6` em um SVG de 1024×1024 escalado para 420px. Visualmente fica fino, sem brilho real. O `feGaussianBlur stdDeviation: 5` é discreto demais para uma marca que precisa "pulsar".

### 🔴 P3 — Halo plano e estático
Um único radial gradient circular com 0.28 opacity. **Não tem camadas**, **não respira**, **não acompanha o desenho**. Em sites premium (Apple, Stripe, Linear), o ambiente reage à animação principal — aqui o halo só existe.

### 🔴 P4 — Não há "recompensa" pelo scroll travado
O usuário rola 260vh (1500-2000px) e o que ele vê é: título → cisne sendo desenhado → cisne preenchido → frase secundária → fim. **Sem clímax**. Sem partículas, sem beat de transição, sem "pulse" no momento em que o cisne se completa. O scroll lock é alto demais para a quantidade de informação.

### 🔴 P5 — Tipografia genérica
"Swan. Movimento que se desenha." está em um `h2` simples com `clamp(1.8rem, 4vw, 2.8rem)`. Falta hierarquia tipográfica de marca — em premium isso seria um displayface gigante (60-90px), com tracking negativo expressivo, talvez com efeito de **kinetic typography** que se monta letra a letra.

### 🔴 P6 — Falta narrativa de marca
A seção é uma demonstração técnica do desenho de logo, mas **não conta nada sobre a SWN**. Premium vende: o desenho deveria ser metáfora visual de algo (cada linha = cada decisão do projeto, cada curva = um valor da marca). Sem isso, vira "cisne legal animando" e nada mais.

### 🟡 P7 — Performance
Cada quadro de scroll dispara: `pathLength`, `opacity` em 4 elementos, blur SVG dinâmico. Em notebooks médios pode causar jank. O `useSpring` ajuda mas não resolve o custo do filtro `feGaussianBlur` recalculado por frame.

### 🟡 P8 — Final abrupto
Em 96% do progresso a animação termina. O usuário ainda rola mais 4vh "vazio" antes do unstick. **Esse trecho final é desperdício de scroll** — ou usar para algo, ou cortar.

### 🟡 P9 — Tema da seção isolado
A `.swan-scroll` tem um background gradiente próprio (`#050708 → #07090A → #050708`) que não dialoga com nada antes ou depois. Não há transição de cor, não há divisor visual sofisticado.

---

## 3. Princípios para o redesign premium

1. **A marca deve ocupar a tela.** O cisne tem que ser **grande** (60-70% da altura da viewport, não 30%).
2. **Cada frame de scroll precisa ter algo acontecendo.** Sem trechos "mortos".
3. **Camadas, não elementos isolados.** Halo, partículas, grid de fundo, traço, fill, glow — tudo coreografado em camadas que entram e saem em momentos diferentes.
4. **Tipografia como performance.** Texto que se monta, se reorganiza, ou cresce conforme a marca se forma.
5. **Clímax explícito.** Quando o cisne se completa, **algo acontece**: pulso, flash sutil, partículas, mudança de cor da página.
6. **Narrativa.** Cada fase do desenho deve carregar uma palavra/conceito (ex: "Sutileza" aparece junto com a curva do pescoço; "Performance" junto com a base que se preenche).
7. **Tempo de scroll calibrado.** 260vh é muito. **180vh-220vh é o sweet spot** para uma única animação de marca.

---

## 4. Cinco alternativas concretas (escolher 1 ou combinar)

### 🅰 Alternativa A — "Cinema Frames" (mais cinematográfica)

Conceito: **a seção é dividida em 4 atos**, cada um com sua palavra-chave que aparece sincronizada com uma fase do desenho.

```
0% — 25%   ATO 1 "Origem"      → traço inicial do pescoço + palavra à esquerda
25% — 55%  ATO 2 "Forma"       → corpo do cisne sendo traçado + palavra muda
55% — 80%  ATO 3 "Identidade"  → asas se completam + fill começa + palavra muda
80% — 100% ATO 4 "Marca"       → fill total + pulso + frase final
```

- **Lado esquerdo:** palavra grande (8rem) que faz cross-fade entre os 4 atos
- **Lado direito:** o cisne (60% da altura)
- Cisne **maior** (até 720px), strokeWidth aumentado para 3.4
- Halo pulsa em sincronia com o ato corrente

**Por que é premium:** lembra reveals da Apple (página AirPods, Watch). Cada palavra reforça a marca. Scroll vira storytelling.

**Custo de implementação:** médio-alto. Refactor do componente para suportar atos. Tempo: ~3h.

---

### 🅱 Alternativa B — "Constelação"

Conceito: o cisne é **construído por linhas/pontos que aparecem como constelação** antes do path principal ser desenhado.

```
0% — 15%   pontos surgem em posições estratégicas do contorno do cisne
15% — 35%  linhas conectam os pontos formando uma "estrutura"
35% — 75%  o stroke real do cisne é desenhado por cima da estrutura
75% — 100% fill + os pontos se apagam, restando só a marca limpa
```

- Visual remete a engenharia, precisão, cálculo
- 30-50 pontos de luz ciano com `box-shadow` ciano forte
- Linhas conectoras em opacity 0.15 (esqueleto)
- O traço principal **substitui** a estrutura

**Por que é premium:** combina a metáfora "engenharia + arte" da SWN. Lembra páginas de marca como Linear, Vercel, Resend. Tem profundidade técnica.

**Custo:** alto. Precisa calcular pontos de origem ao longo do path. Tempo: ~5h.

---

### 🅲 Alternativa C — "Aurora Reativa" (mais simples + alto impacto)

Conceito: mantém a estrutura atual mas adiciona **3 camadas reativas** ao redor do cisne.

1. **Aurora de fundo** — duas elipses gigantes em ciano que se deformam (`useTransform` no `borderRadius`/`scale`) conforme o desenho avança. Lembra a aurora boreal animada do site da Stripe.
2. **Partículas (10-15)** que orbitam sem rumo no início, e quando o desenho começa elas começam a **convergir** pra dentro do contorno do cisne, como se "alimentando" o desenho.
3. **Anel pulsante** ao redor do cisne que **expande exatamente quando** o fill termina (clímax).

- Cisne aumentado para 600px
- StrokeWidth 3.2 + segundo path stroke "echo" mais fino atrás (efeito double-line tipográfico premium)
- No clímax, **flash branco sutil** no body da página (50ms) — sensação de "shutter" de câmera

**Por que é premium:** muito visual com pouco texto. Fica gravado. Fácil de admirar sem ler nada.

**Custo:** médio. Reaproveita 80% do componente atual. Tempo: ~2h.

---

### 🅳 Alternativa D — "Palavras que Desenham"

Conceito: o **stroke do cisne é literalmente formado por palavras** ("Sutileza · Beleza · Performance · Estratégia · Design · Engenharia · Marca...") que se alinham ao path como em um **text-on-path SVG**.

- À medida que o usuário rola, mais palavras aparecem ao longo do contorno
- Ao completar, as palavras se dissolvem e o stroke "limpo" toma o lugar
- Fill chega depois com radial gradient

**Por que é premium:** literal poesia visual. Cada palavra é um valor da SWN. Único. Difícil de copiar.

**Custo:** alto. Requer SVG `<textPath>` com cálculo de offset por palavra. Tempo: ~6h.

---

### 🅴 Alternativa E — "Reveal por Camadas" (mais minimalista)

Conceito: **menos é mais.** O cisne ocupa 70% da viewport. Não há texto durante o desenho. Só som visual: o traço, o brilho, o silêncio.

```
0% — 10%    fade-in do palco escuro
10% — 75%   stroke do cisne sendo desenhado (lentamente, com beleza)
75% — 85%   pausa: o cisne está pronto, só com stroke
85% — 95%   fill aparece de dentro pra fora (radial mask)
95% — 100%  uma única linha de texto entra: "SWN" + tagline
```

- Cisne enorme (até 800px ou 75vh)
- Trilha sonora visual: glow muda intensidade durante o desenho
- Background ganha vinheta progressiva (escurece bordas conforme cisne se forma)
- Tipografia só aparece no fim — minimalismo absoluto

**Por que é premium:** confiança. Marcas confiantes não explicam — mostram. Lembra o reveal de logos da Tesla, Aesop, A24.

**Custo:** baixo. Refactor leve. Tempo: ~1.5h.

---

## 5. Recomendação

Para o estilo da SWN (cisne, ciano, "beleza encontra performance"), a **Alternativa C — Aurora Reativa** é o melhor custo/benefício imediato. Combinar com **elementos da Alternativa A** (palavra-chave por ato à esquerda) eleva sem complicar:

> **Híbrido recomendado:** Aurora Reativa + 1 palavra grande à esquerda que cross-fade entre 3 valores: **Sutileza → Beleza → Performance** sincronizados com 3 fases do desenho.

Isso resolve P1 (composição), P2 (cisne ganha aurora + double-stroke), P3 (halo vira camada viva), P4 (clímax = anel pulsante + flash), P6 (narrativa via 3 palavras) — sem quebrar P7 (performance manageable) nem P8 (uso de cada % de scroll).

Estimativa: **~2.5h** para a versão híbrida completa.

---

## 6. Especificação técnica do híbrido recomendado

### 6.1 Layout

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   SUTILEZA          ┌──────────────────┐             │
│   (palavra ATO)     │                  │             │
│                     │      CISNE       │             │
│                     │   (60vh, 700px)  │             │
│                     │                  │             │
│                     └──────────────────┘             │
│                                                      │
│              (linha narrativa pequena no fim)        │
└──────────────────────────────────────────────────────┘
```

- Grid: `grid-template-columns: 1fr 1.4fr`
- Em mobile (< 1024px): vira coluna única, palavra acima do cisne
- `swan-scroll` reduzido de **260vh → 200vh** (padding total mais respirável)

### 6.2 Stack de camadas (z-index, do fundo pro topo)

1. `.swan-scroll-aurora` — duas elipses gigantes ciano com `filter: blur(80px)` e `mix-blend-mode: screen`. Animam scale 1→1.2 conforme scroll.
2. `.swan-scroll-vignette` — máscara radial que escurece bordas conforme progresso.
3. `.swan-scroll-particles` — 12 pontos ciano com `box-shadow` forte. Iniciam orbitando aleatoriamente, convergem para o centro a partir de 60% do scroll.
4. `.swan-scroll-svg` — o cisne (stroke + fill).
5. `.swan-scroll-pulse-ring` — anel branco que expande de 0→2x scale com fade no momento do clímax (88-92%).
6. `.swan-scroll-act-word` — palavra grande absolutamente posicionada à esquerda.

### 6.3 Curvas de animação (cada uma é um `useTransform`)

```js
// Stroke
strokeLen     = [0.10, 0.78] → [0, 1]

// Aurora — sempre presente, intensifica no clímax
auroraScale   = [0, 0.5, 1]   → [1, 1.08, 1.2]
auroraOpacity = [0, 0.3, 0.8] → [0.4, 0.7, 1]

// Vinheta — escurece progressivamente
vignetteOp    = [0, 0.5, 1]   → [0, 0.5, 0.85]

// Partículas — convergem
particleScale = [0.4, 0.85]   → [1, 0.2]   // encolhem ao se aproximar do centro
particleOp    = [0.0, 0.6, 0.85, 1] → [0, 1, 1, 0]

// Fill do cisne
fillOpacity   = [0.78, 0.88]  → [0, 1]

// Anel de clímax (pulse)
ringScale     = [0.86, 0.94]  → [0, 2.2]
ringOpacity   = [0.86, 0.90, 0.94] → [0, 0.7, 0]

// Palavras dos atos (3 ranges separados)
word1Op = [0.05, 0.20, 0.35] → [0, 1, 0]   // "Sutileza"
word2Op = [0.30, 0.45, 0.60] → [0, 1, 0]   // "Beleza"
word3Op = [0.55, 0.70, 0.85] → [0, 1, 0]   // "Performance"

// Narrativa final
narrativeOp   = [0.92, 0.98]  → [0, 1]
```

### 6.4 Mudanças de CSS

```css
.swan-scroll {
  height: 200vh; /* era 260vh */
  background:
    radial-gradient(ellipse 80% 60% at 50% 50%, #0A1012 0%, var(--bg) 70%);
}

.swan-scroll-sticky {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  align-items: center;
  padding: 4rem 6rem;
  gap: 3rem;
}

.swan-scroll-stage {
  width: min(60vh, 720px);
  height: min(60vh, 720px);
}

.swan-scroll-act-word {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 7vw, 7rem);
  letter-spacing: -0.04em;
  line-height: 0.95;
  background: linear-gradient(180deg, #fff 0%, var(--cyan) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: right;
  position: absolute;
  /* ... */
}

.swan-scroll-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid var(--cyan);
  pointer-events: none;
}

@media (max-width: 1024px) {
  .swan-scroll-sticky {
    grid-template-columns: 1fr;
  }
  .swan-scroll-act-word {
    text-align: center;
    position: relative;
    margin-bottom: 2rem;
  }
}
```

### 6.5 StrokeWidth & glow do cisne

```jsx
{/* Echo stroke — fino, atrás, mais leve */}
<motion.path
  d={SWAN_PATH}
  fill="none"
  stroke="rgba(131, 223, 233, 0.35)"
  strokeWidth="5"
  filter="url(#scrollSwanGlowSoft)"
  style={{ pathLength: strokeLen }}
/>

{/* Main stroke — grosso, gradiente, cima */}
<motion.path
  d={SWAN_PATH}
  fill="none"
  stroke="url(#scrollSwanStroke)"
  strokeWidth="3.4"
  filter="url(#scrollSwanGlow)"
  style={{ pathLength: strokeLen }}
/>
```

Filtro com `stdDeviation: 8` (era 5) e segundo filtro `stdDeviation: 18` para o echo.

---

## 7. Comparativo final

| Critério | Hoje | Híbrido (C+A) |
|---|---|---|
| Cisne (tamanho) | ~30% viewport | ~60% viewport |
| Camadas visuais | 3 (halo, stroke, fill) | 6 (aurora, vignette, partículas, stroke duplo, fill, ring) |
| Texto narrativo | 1 título + 1 frase | 3 palavras-ato + 1 frase final |
| Clímax | Inexistente | Anel pulse + flash + narrativa |
| Scroll lock | 260vh (excessivo) | 200vh (calibrado) |
| Performance | OK | OK (mesma quantidade de transformações) |
| Identidade SWN | Genérica | "Sutileza, Beleza, Performance" virou parte da animação |

---

## 8. Próximos passos sugeridos

1. **Alinhar conceito** — você escolhe entre A, B, C, D, E ou aprova o híbrido C+A.
2. **Implementar em branch separado** — `feat/swan-scroll-premium`. Não sobrescrever o componente atual antes da aprovação visual.
3. **Demo lado a lado** — manter a versão antiga como fallback comparativo durante 1 deploy.
4. **Métricas** — tempo médio de scroll na seção (Hotjar/Clarity) antes/depois.

---

*Documento criado para discussão antes da implementação. Nenhum código foi alterado ainda.*

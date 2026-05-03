# SWN Studio — Plano de Responsividade & Escalas de Zoom

> Documento focado em resolver problemas que aparecem **na mesma resolução física** quando o usuário usa **escalas de DPI diferentes** (100%, 125%, 150%) — cenário extremamente comum em notebooks Windows que vêm de fábrica em 125%.

---

## 1. Por que isso é um problema

A maioria dos sites é desenhada assumindo que **1 pixel CSS = 1 pixel físico**. No Windows isso é falso para a maior parte dos notebooks: o sistema usa "Escala recomendada" de 125% ou 150%, o que reduz a área lógica disponível.

| Resolução física | Escala Windows | Viewport CSS efetiva |
|---|---|---|
| 1920 × 1080 | 100% | 1920 × 1080 |
| 1920 × 1080 | 125% | **1536 × 864** |
| 1920 × 1080 | 150% | **1280 × 720** |
| 1366 × 768 (notebook básico) | 100% | 1366 × 768 |
| 1366 × 768 | 125% | **1093 × 614** |

**A diferença entre 100% e 125% na mesma tela é a mesma coisa que pegar um monitor 25% menor.** Layouts pensados em desktop largo "quebram" sem que o usuário mude de máquina.

Para piorar, o **navegador roda dentro do Windows**, então a área visível ainda perde:
- Barra de tarefas (~40-48px reais ≈ **60-72px lógicos** em 125%)
- Barra de abas + endereço do Chrome (~80-90px reais ≈ **100-110px lógicos** em 125%)
- Total de "chrome" do sistema: até **~180px lógicos consumidos** em 125%.

Conclusão: em uma tela 1920×1080 com escala 125%, o Hero tem na prática **~684px de altura útil**, não 1080px nem 864px. Qualquer coisa que use `100vh` cego vai vazar.

---

## 2. Problemas observados nos prints

### 🔴 P1 — `hero-scroll-hint` é tampado pela barra de tarefas em 125%
**Causa.** O hint usa `position: absolute; bottom: 2.25rem` dentro de `.hero` que tem `min-height: 100vh`. Em 125%, `100vh` ainda é a viewport inteira, mas a viewport inteira **inclui** uma fita inferior que será coberta pelo Chrome (caso fullscreen) ou pela barra do Windows (em janela maximizada). O hint cai dentro dessa zona morta.

**Sintoma adicional.** Mesmo quando aparece, fica colado na borda — sem respiro.

### 🔴 P2 — Cisne "cola" no texto em 125%
**Causa.** `.hero-swan-layer` tem `width: min(580px, 50vw)` e `transform: translateX(-20%)`. Em 100% (viewport 1920), 50vw = 960px → cisne com 580px sobra ~380px de "folga horizontal". Em 125% (viewport 1536), 50vw = 768px → cisne com 580px sobra **só 188px de folga** — visualmente toca o texto.

O `max-width: 880px` do `.hero-content` mantém o texto centrado em 880px (não escala junto), então a folga horizontal entre fim-do-texto e início-do-cisne diminui linearmente com a viewport.

### 🔴 P3 — Logo do Header colada nos itens de menu
**Causa.** `.header-content` usa `gap: 2rem` + `justify-content: space-between` com `max-width: 1320px`. Em 125%/150%, com viewport menor, o `<nav>` central encosta na logo. O alvo de toque também diminui visualmente.

### 🟡 P4 — Hero respira "demais" para baixo em 100%, mas "engasga" em 125%
**Causa.** `padding: 9rem 1.5rem 6rem` é fixo em `rem`. Em 100%, sobra espaço; em 125%/150%, o padding superior + título + subtítulo + botões + scroll-hint **somam mais que a altura útil disponível**, empurrando o hint para fora da view inicial.

### 🟡 P5 — Texto do título pode ficar muito grande em 125%/150%
**Causa.** `clamp(2.8rem, 8.5vw, 6.4rem)` — em 125% (1536vw), `8.5vw = 130.5px ≈ 8.16rem` (fica perto do max). Em 150% (1280vw), `8.5vw = 108.8px` ainda muito alto. O título ocupa 3 linhas e empurra subtítulo + botões pra baixo.

### 🟡 P6 — Sem teste para janelas curtas (`landscape laptop`)
**Causa.** Não há media query baseada em **altura** (`max-height`). Notebooks 13" em 1280×800 com escala 125% têm viewport 1024×640 — viewport curta e larga. O Hero em 100vh nesse cenário fica claustrofóbico.

---

## 3. Princípios da solução

1. **Nunca usar `100vh` no Hero.** Usar `min-height: 100svh` (small viewport height — desconta UI dinâmica do mobile) com fallback para `100vh`, e em última instância `min-height: clamp(640px, 100svh, 900px)`.
2. **Posicionar o scroll-hint com `bottom: max(env(safe-area-inset-bottom), 1rem)`** para respeitar áreas seguras dispositivos com notch e simular "respiro" mínimo.
3. **Fluidizar gaps e paddings** com `clamp()`, não `rem` fixo, em todo o Hero e Header.
4. **Usar media queries de DPI** (`min-resolution`) ou de `width` calibradas para os 3 alvos: 100% (≥1440px), 125% (1280-1439px), 150% (1024-1279px).
5. **Sempre testar com DevTools → Device Toolbar → Custom**: criar 3 presets — `Notebook 100%` (1920×1080), `Notebook 125%` (1536×864), `Notebook 150%` (1280×720).
6. **Usar `cqi`/`cqh` (container queries)** quando o componente precisa reagir ao próprio container, não à viewport. Para o Hero não vale a pena, mas para cards do Portfolio, sim.

---

## 4. Soluções concretas por problema

### 🛠 P1 — Scroll hint não pode ser tampado

**Fix CSS:**

```css
.hero-scroll-hint {
  position: absolute;
  /* antes: bottom: 2.25rem; */
  bottom: max(env(safe-area-inset-bottom, 0px), 1.75rem);
  left: 50%;
  transform: translateX(-50%);
  /* aumenta área de toque sem mexer no visual */
  padding: 0.75rem 1rem;
}

/* Em viewports curtas, sobe o hint para evitar a barra do Windows */
@media (max-height: 760px) {
  .hero-scroll-hint {
    bottom: max(env(safe-area-inset-bottom, 0px), 2.5rem);
  }
}

@media (max-height: 640px) {
  .hero-scroll-hint {
    /* hide label only — keep arrow visible */
    bottom: 1.5rem;
  }
  .hero-scroll-hint-label {
    display: none;
  }
}
```

### 🛠 P2 — Cisne com folga garantida

**Fix CSS:**

```css
.hero-swan-layer {
  /* antes: width: min(580px, 50vw); */
  /* agora: cresce até no máximo 42vw, com hard cap em 580px */
  width: clamp(280px, 42vw, 580px);
  /* desloca menos quando viewport é menor — usa cqw seria ideal,
     mas como é absolute na main, usamos breakpoints */
}

/* 1280-1439px (escala 125% em 1080p, ou notebook 1280px) */
@media (max-width: 1439px) and (min-width: 1280px) {
  .hero-swan-layer {
    width: clamp(320px, 38vw, 460px);
    opacity: 0.4;
    transform: scaleX(-1) translateX(-12%);
  }
}

/* 1024-1279px (escala 150% em 1080p) */
@media (max-width: 1279px) and (min-width: 1024px) {
  .hero-swan-layer {
    width: clamp(280px, 36vw, 380px);
    opacity: 0.32;
    transform: scaleX(-1) translateX(-8%);
  }
}
```

**Alternativa mais robusta** — limitar o `.hero-content` para que tenha um espaçamento mínimo do cisne:

```css
.hero {
  display: grid;
  /* coluna de conteúdo + coluna reservada pro cisne */
  grid-template-columns: minmax(0, 1fr) clamp(280px, 36vw, 580px);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
  text-align: left;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

Esta abordagem é mais "premium" porque o cisne deixa de ser decoração absoluta e passa a fazer parte do **layout**, sempre com espaço garantido.

### 🛠 P3 — Header com proporções fluidas

**Fix CSS:**

```css
.header-content {
  /* antes: gap: 2rem; */
  gap: clamp(1rem, 2.5vw, 2.5rem);
  padding: 0 clamp(1rem, 2vw, 1.75rem);
}

.header-logo {
  /* antes: height: 44px; */
  height: clamp(34px, 3vw, 48px);
}

.header.scrolled .header-logo {
  height: clamp(28px, 2.4vw, 38px);
}

/* Em 125%/150%, o nav-pill encolhe um chouquinho */
@media (max-width: 1439px) {
  .header-nav a {
    font-size: 0.86rem;
    padding: 0.5rem 0.85rem;
  }
}
```

### 🛠 P4 — Hero com altura inteligente

**Fix CSS:**

```css
.hero {
  /* antes: min-height: 100vh; padding: 9rem 1.5rem 6rem; */
  min-height: 100svh;            /* desconta UI dinâmica em mobile */
  min-height: clamp(640px, 100svh, 1000px); /* clamp evita "giant hero" em 4K */
  padding: clamp(6rem, 11vh, 10rem) clamp(1.25rem, 3vw, 2rem) clamp(4rem, 8vh, 7rem);
}

/* Garantir que em viewports curtas o conteúdo encolhe junto */
@media (max-height: 760px) {
  .hero {
    padding-top: clamp(5.5rem, 9vh, 7rem);
    padding-bottom: clamp(3.5rem, 6vh, 5rem);
  }
}
```

A regra `clamp(640px, 100svh, 1000px)` faz o Hero ter no mínimo 640px (não desaparece em telas curtíssimas) e no máximo 1000px (não vira tela gigante em monitor 4K).

### 🛠 P5 — Tipografia responsiva mais conservadora

**Fix CSS:**

```css
.hero-title {
  /* antes: font-size: clamp(2.8rem, 8.5vw, 6.4rem); */
  font-size: clamp(2.6rem, 7vw + 0.5rem, 5.4rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
}

.hero-subtitle {
  /* antes: font-size: clamp(1.05rem, 1.6vw, 1.3rem); */
  font-size: clamp(1rem, 1.2vw + 0.4rem, 1.25rem);
  margin-bottom: clamp(1.75rem, 4vh, 3rem);
}
```

A fórmula `vw + rem` (em vez de `vw` puro) mantém um piso confortável e cresce de forma mais previsível em viewports estreitas.

### 🛠 P6 — Suporte a notebooks com viewport curta

```css
/* Viewport curta + larga (notebooks 13" em 125%, 1280×640 lógico) */
@media (max-height: 720px) and (min-width: 1024px) {
  .hero-content {
    transform: translateY(-1.5rem); /* compensa o padding */
  }
  .hero-title {
    font-size: clamp(2.4rem, 5vw + 0.4rem, 4.4rem);
  }
  .hero-subtitle {
    margin-bottom: 1.5rem;
  }
  .hero-buttons {
    gap: 0.75rem;
  }
}
```

---

## 5. Tabela mestre de breakpoints (a adotar)

Substituir o conjunto atual `@media (max-width: 1024px) | (max-width: 768px)` por uma escala de 5 breakpoints baseada em **dispositivos reais com escala**, não em números redondos:

| Nome | Range CSS | Cobre |
|---|---|---|
| `--bp-xs` | até **480px** | celulares pequenos |
| `--bp-sm` | até **768px** | celulares grandes / phablet |
| `--bp-md` | até **1023px** | tablets / notebooks 1366×768 em 125% |
| `--bp-lg` | até **1279px** | 1080p em **escala 150%** + notebooks 1280px nativos |
| `--bp-xl` | até **1439px** | 1080p em **escala 125%** |
| `(default)` | **≥ 1440px** | desktops 100% / monitores 1440p+ |

Em CSS:

```css
/* 100% em 1080p (>= 1440px lógicos) — comportamento padrão, sem media query */

/* 125% em 1080p */
@media (max-width: 1439px) { /* ajustes "leves" */ }

/* 150% em 1080p / notebooks antigos 1280×720 */
@media (max-width: 1279px) { /* ajustes "médios" */ }

/* tablets / notebooks 1366×768 em 125% */
@media (max-width: 1023px) { /* layout passa a 1 coluna em várias seções */ }

/* mobile */
@media (max-width: 767px) { /* layout mobile */ }
@media (max-width: 479px) { /* otimização mobile pequeno */ }
```

Bônus — usar `tokens` para os breakpoints e referenciar via `@custom-media` (CSS Modules ou PostCSS):

```css
@custom-media --bp-xl (max-width: 1439px);
@custom-media --bp-lg (max-width: 1279px);
@custom-media --bp-md (max-width: 1023px);
@custom-media --bp-sm (max-width: 767px);
```

---

## 6. Itens de checklist por escala (matriz de teste)

Use isto como **lista de QA** ao alterar qualquer seção:

### ✅ Em **1920×1080 @ 100%** (viewport 1920×1080)
- [ ] Logo do header com folga ≥ 32px do nav
- [ ] Cisne sem encostar no texto (folga horizontal ≥ 80px)
- [ ] Scroll hint com folga ≥ 32px da borda inferior
- [ ] Hero ocupa ~100vh, mas não força barra de scroll
- [ ] Tipografia: título em ≤2 linhas

### ✅ Em **1920×1080 @ 125%** (viewport 1536×864)
- [ ] Scroll hint visível **acima** da barra do Windows (com Chrome em janela maximizada)
- [ ] Cisne reduzido proporcionalmente (≤460px largura), folga ≥ 60px do texto
- [ ] Header com gap ≥ 16px entre logo, nav e botão
- [ ] Hero entra inteiro na primeira dobra
- [ ] Botões não quebram para 2 linhas

### ✅ Em **1920×1080 @ 150%** (viewport 1280×720)
- [ ] Cisne reduzido a ~360px ou menos
- [ ] Hero altura mínima 640px, conteúdo cabe sem corte
- [ ] Scroll hint com `label` oculto, só ícone (economia de altura)
- [ ] Tipografia: título em ≤3 linhas, subtítulo em ≤3 linhas
- [ ] Header: nav talvez vire menu hamburguer já em 1023px

### ✅ Em **1366×768 @ 100%** (notebook básico)
- [ ] Mesmo comportamento que 1280×720
- [ ] Hero respira; não força scroll horizontal

### ✅ Em **1366×768 @ 125%** (viewport 1093×614)
- [ ] Layout colapsa para "tablet": cisne pode aparecer abaixo do texto
- [ ] Header vira mobile (< 1024px)
- [ ] Hero scroll hint aparece logo após botões, não fixo na base

### ✅ Em **375×812 @ mobile**
- [ ] Cisne aparece acima do título (já implementado)
- [ ] Scroll hint só com ícone (já implementado)
- [ ] Padding lateral ≥ 1.25rem

---

## 7. Como simular cada cenário no DevTools

Criar **presets customizados** no Chrome DevTools:

1. F12 → ícone de dispositivo (Toggle device toolbar) → "Edit"
2. "Add custom device":

| Nome | Width | Height | DPR |
|---|---|---|---|
| `1080p @ 100%` | 1920 | 1080 | 1 |
| `1080p @ 125%` | 1536 | 864 | 1.25 |
| `1080p @ 150%` | 1280 | 720 | 1.5 |
| `1366 @ 100%` | 1366 | 768 | 1 |
| `1366 @ 125%` | 1093 | 614 | 1.25 |

⚠️ Importante: o DPR no DevTools simula a densidade real do pixel — **não** simula sozinho a "sensação" de escala do Windows. Para isso, o que mais importa é a **viewport CSS efetiva** (largura e altura). O DPR só altera nitidez de imagens.

**Atalho para testar manualmente:**
- `Ctrl + +` no Chrome aumenta o zoom da página em 10%. Cada nível corresponde a uma viewport menor:
  - Zoom 100% = viewport real
  - Zoom 110% = viewport reduzida em ~9%
  - Zoom 125% = simula bem **escala Windows 125%** sem precisar mexer no SO

---

## 8. Sobre `svh` / `dvh` / `lvh` (viewport units modernas)

Resumo prático para usar nas correções:

| Unit | O que mede | Quando usar |
|---|---|---|
| `vh` | altura inicial da viewport | nunca mais (legado) |
| `lvh` | altura **maior** possível (sem barras de UI) | quando você quer "tela cheia ideal" |
| `svh` | altura **menor** possível (com todas as barras visíveis) | **default novo** — garante que não haja vazamento |
| `dvh` | altura **dinâmica** (muda enquanto o usuário rola) | hero ultra-imersivo (cuidado: causa reflows em mobile) |

Para o Hero da SWN: **`min-height: 100svh`** é a escolha correta — garante que o conteúdo cabe mesmo com toda a UI do navegador visível.

---

## 9. Sobre o problema da Logo no Header (P3 detalhado)

A logo cisne tem `height: 44px` (escala 100%) — isso vira **35px lógicos em 125%** e **29px em 150%**. Em escala 150% a logo fica menor que os ícones de menu, o que rompe a hierarquia visual.

**Soluções possíveis (escolher uma):**

**A)** Logo fluida (recomendado):
```css
.header-logo {
  height: clamp(36px, 2.6vw + 8px, 52px);
}
```
Em 1920px: ~58px. Em 1536px: ~48px. Em 1280px: ~41px. Cresce de forma mais consistente com a viewport.

**B)** Adicionar wordmark texto ao lado em viewports ≥1280:
```jsx
<a href="#hero" className="header-brand">
  <img src="/logo-branca.png" alt="" className="header-logo" />
  <span className="header-wordmark">SWN STUDIO</span>
</a>
```
```css
.header-brand { display: flex; align-items: center; gap: 0.6rem; }
.header-wordmark {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  color: var(--white);
}
@media (max-width: 1023px) { .header-wordmark { display: none; } }
```

**C)** Aumentar o `gap` do `header-content` em escalas pequenas:
```css
@media (max-width: 1439px) {
  .header-content { gap: 1.25rem; }
}
@media (max-width: 1279px) {
  .header-content { gap: 0.75rem; }
  .header-nav a { padding: 0.5rem 0.7rem; font-size: 0.85rem; }
}
```

A combinação **A + C** resolve sem mexer no JSX.

---

## 10. Roadmap de implementação

Ordenado por **impacto/esforço**:

### Sprint 1 — Correções críticas (1-2h)
1. Trocar `100vh` por `100svh` no `.hero` e adicionar clamp
2. Reposicionar `hero-scroll-hint` com `max(env(safe-area-inset-bottom), Xrem)`
3. Adicionar media query `(max-height: 720px)` que esconde o label do scroll-hint
4. Aumentar gap do header em viewports `< 1440px`

### Sprint 2 — Layout do Hero (2-3h)
5. Refatorar `.hero` para `display: grid` (conteúdo + cisne lado a lado), com colapso em 1024px
6. Aplicar `clamp()` em todos os paddings/gaps do Hero
7. Reduzir clamp do `.hero-title` para evitar título gigante em 125%

### Sprint 3 — Sistema de breakpoints (3-4h)
8. Definir variáveis `--bp-*` no `:root`
9. Auditar todas as media queries existentes e migrar para a escala de 5 breakpoints
10. Criar arquivo `src/styles/_breakpoints.css` (ou similar) como fonte única

### Sprint 4 — QA matriz (2h)
11. Testar a checklist da seção 6 nos 5 cenários
12. Documentar prints "antes/depois" em uma pasta `DOCS/qa/`

---

## 11. Princípios para manter daqui pra frente

1. **Nunca mais usar `100vh`** — sempre `100svh` ou `clamp(min, 100svh, max)`.
2. **Nunca mais usar `padding` ou `gap` fixo em `rem`** em zonas de Hero/Header — usar `clamp()` baseado em `vw` ou `vh`.
3. **Toda nova seção deve passar pelo checklist da seção 6** antes de ser commitada.
4. **Pensar em viewport, não em resolução.** "Funciona em 1080p" não significa nada — funciona em 1080p em qual escala?
5. **Sempre prever a "área tomada pelo SO + browser"**. A regra prática: nunca posicionar elemento crítico nos 60px inferiores ou superiores da viewport sem `safe-area-inset`.
6. **Container queries quando possível.** Para componentes que aparecem em colunas (cards, testimonials), usar `@container` em vez de media query global, para que se adaptem ao próprio container, não à tela inteira.

---

*Documento vivo. Atualizar conforme novos cenários de quebra forem reportados.*

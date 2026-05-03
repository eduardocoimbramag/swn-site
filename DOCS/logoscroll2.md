# SwanScrollDraw v2 — Barra contínua + Atos cumulativos + Pulse por reveal

> Iteração sobre a versão atual ("Cinema Frames"). Mantém o visual premium implementado (tipografia, halo, double-stroke do cisne, paleta) e altera **apenas três comportamentos**: a barra de progresso percorre a seção inteira, os 4 atos ficam empilhados e visíveis, cada ato é "ligado" quando a barra passa por ele, e cada reveal de ato dispara o pulse ring no cisne.

---

## 1. Mudanças solicitadas (resumo)

| # | Mudança | Hoje (v1) | Alvo (v2) |
|---|---|---|---|
| 1 | Barra de progresso | Curta, alinhada apenas à coluna dos atos | Percorre toda a altura visível da seção, lateral à coluna esquerda |
| 2 | Apresentação dos atos | Cross-fade no mesmo lugar (só 1 visível por vez) | Empilhados verticalmente, todos visíveis ao final |
| 3 | Reveal dos atos | Aparece e desaparece | Aparece e **fica** (estado cumulativo) |
| 4 | Pulse ring no cisne | Único, no clímax (~88% do scroll) | **4 pulsos**, um por reveal de ato |

O resto **não muda**: tipografia (Sora 800, gradient white→cyan), halo radial, double-stroke do cisne (echo + main), paleta, scroll lock de 220vh.

---

## 2. Estrutura nova de DOM

```
.swan-scroll                        ← 220vh, background com radial
  .swan-scroll-sticky               ← sticky top:0, height:100vh, flex center
    .swan-scroll-flash              ← (mantido) flash discreto no clímax
    .swan-scroll-inner              ← grid 2 colunas, max-width 1320
      .swan-scroll-progress-rail    ← NOVO — barra full-height, lateral
        .swan-scroll-progress-fill  ← preenchimento ciano que sobe com scroll
        .swan-scroll-progress-marker × 4   ← marcadores de cada ato na barra
      .swan-scroll-acts             ← coluna 1: lista de atos empilhados
        .swan-scroll-act × 4        ← cada ato é um bloco visível
      .swan-scroll-stage            ← coluna 2: cisne (igual à v1)
```

**Comparação com v1:**

- `.swan-scroll-progress` (era um filete dentro de `.swan-scroll-acts`) → vira `.swan-scroll-progress-rail` **dentro do inner**, ocupando altura total
- `.swan-scroll-acts-stack` deixa de ser um grid sobreposto (`grid-row: 1` para todos) e vira **flex column** com `gap` real entre atos

---

## 3. Layout & dimensionamento

### 3.1 Grid principal (`.swan-scroll-inner`)

```css
.swan-scroll-inner {
  display: grid;
  /* coluna do trail | coluna dos atos | coluna do palco */
  grid-template-columns: 24px minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: stretch;
  gap: clamp(1.5rem, 3vw, 3rem);
  height: 100%;          /* ocupa toda a altura do sticky frame */
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(3rem, 6vh, 5rem) clamp(2rem, 5vw, 5rem);
}
```

A barra de progresso é a **primeira coluna** (24px de largura, contendo o filete de 2px centralizado). Ela passa a ter altura idêntica à do conteúdo (100% do `.swan-scroll-sticky` menos paddings).

### 3.2 Trilho de progresso

```css
.swan-scroll-progress-rail {
  position: relative;
  width: 24px;
  display: flex;
  justify-content: center;
}

.swan-scroll-progress-rail::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1px;
}

.swan-scroll-progress-fill {
  position: absolute;
  top: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--cyan) 0%, rgba(131, 223, 233, 0.4) 100%);
  box-shadow: 0 0 18px var(--cyan-glow);
  transform-origin: top;
  /* height controlled by JS: scaleY = scrollYProgress */
}
```

### 3.3 Marcadores na barra (4 dots)

Cada ato tem um marcador na barra na posição percentual onde ele se torna ativo.

```css
.swan-scroll-progress-marker {
  position: absolute;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(10, 13, 15, 1);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  transform: translateX(-50%);
  transition: border-color 0.5s var(--ease-swan), background 0.5s ease;
}

.swan-scroll-progress-marker.is-reached {
  background: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 14px var(--cyan-glow);
}
```

Posições (top em %): `[5%, 32%, 60%, 88%]` — alinhadas com os pontos de reveal dos atos.

### 3.4 Coluna de atos (empilhados)

```css
.swan-scroll-acts {
  display: flex;
  flex-direction: column;
  justify-content: space-around;   /* distribui os 4 atos verticalmente */
  gap: clamp(1rem, 2vh, 2rem);
  align-self: stretch;
  min-width: 0;
}

.swan-scroll-act {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  /* Estado inicial — invisível e levemente abaixo */
  opacity: 0;
  transform: translateY(28px);
  /* Reveal animado por classe via Framer Motion */
  transition: opacity 0.7s var(--ease-swan), transform 0.7s var(--ease-swan);
  min-width: 0;
}

.swan-scroll-act.is-revealed {
  opacity: 1;
  transform: translateY(0);
}
```

**Tipografia (mantida da v1):**

```css
.swan-scroll-act-word {
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 3.6vw, 3.4rem);   /* menor que v1 — agora cabem 4 */
  line-height: 0.95;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, #fff 0%, var(--cyan) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

> ⚠️ **Atenção:** o `font-size` cai de `clamp(2.6rem, 5.5vw, 5.6rem)` (v1) para `clamp(2rem, 3.6vw, 3.4rem)` (v2). Isso é necessário porque agora os 4 atos precisam caber empilhados na altura visível (100vh menos paddings). Sem essa redução, em viewports curtas eles se sobrepõem.

---

## 4. Lógica de animação

### 4.1 Pontos de reveal (constantes)

```js
const REVEAL_POINTS = [0.05, 0.32, 0.60, 0.88];
// posições em scrollYProgress onde cada ato vira "revealed"
```

Esses são os mesmos pontos onde os marcadores ficam na barra (linha do `top: %`).

### 4.2 Estado de "atos revelados" via `useTransform`

A v1 usa 4 `useTransform` separados que calculam opacidade. A v2 substitui por **um único `useMotionValueEvent`** que atualiza um state com o array de atos já revelados:

```jsx
import { useMotionValueEvent } from 'framer-motion';

const [revealed, setRevealed] = useState([false, false, false, false]);

useMotionValueEvent(smooth, 'change', (value) => {
  setRevealed((prev) => {
    const next = REVEAL_POINTS.map((p, i) => prev[i] || value >= p);
    // só atualiza se algo mudou (evita re-render por scroll)
    return next.some((v, i) => v !== prev[i]) ? next : prev;
  });
});
```

**Por que cumulativo:** o `prev[i] || value >= p` garante que uma vez que um ato é revelado, ele permanece. Mesmo se o usuário rolar pra cima, ele fica visível (o que é desejável — não há razão visual para fazer o ato "voltar" a sumir).

### 4.3 Aplicação nos elementos

```jsx
{ACTS.map((act, i) => (
  <div
    key={act.num}
    className={`swan-scroll-act ${revealed[i] ? 'is-revealed' : ''}`}
  >
    <span className="swan-scroll-act-num">{act.num} / 04</span>
    <h3 className="swan-scroll-act-word">{act.word}</h3>
    <p className="swan-scroll-act-caption">{act.caption}</p>
  </div>
))}

{REVEAL_POINTS.map((p, i) => (
  <span
    key={i}
    className={`swan-scroll-progress-marker ${revealed[i] ? 'is-reached' : ''}`}
    style={{ top: `${p * 100}%` }}
  />
))}
```

### 4.4 Fill da barra (continua sendo `useTransform`)

```jsx
const fillScaleY = useTransform(smooth, [0, 1], [0, 1]);

<motion.span
  className="swan-scroll-progress-fill"
  style={{ scaleY: fillScaleY, height: '100%' }}
/>
```

---

## 5. Pulse ring por reveal (4 pulsos)

### 5.1 Conceito

Hoje (v1) o `.swan-scroll-pulse-ring` é controlado por dois `useTransform` (`ringScale` e `ringOpacity`) que definem **um único pulso** entre 86%-96% do scroll.

Na v2, o pulse vira **um efeito imperativo** disparado **toda vez que um ato muda de `revealed = false` para `true`**. Quatro reveals → quatro pulsos.

### 5.2 Implementação com `AnimatePresence` + key incrementável

```jsx
const [pulseKey, setPulseKey] = useState(0);
const prevRevealedCount = useRef(0);

useEffect(() => {
  const count = revealed.filter(Boolean).length;
  if (count > prevRevealedCount.current) {
    setPulseKey((k) => k + 1);   // dispara um novo pulso
  }
  prevRevealedCount.current = count;
}, [revealed]);

<AnimatePresence>
  <motion.div
    key={pulseKey}
    className="swan-scroll-pulse-ring"
    initial={{ scale: 0, opacity: 0.85 }}
    animate={{ scale: 2.2, opacity: 0 }}
    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    aria-hidden="true"
  />
</AnimatePresence>
```

**Como funciona:** cada vez que `pulseKey` incrementa, o React desmonta o ring antigo e monta um novo com `initial` zero, animando até `animate`. O `AnimatePresence` poderia segurar o anterior em `exit` para sobreposição (efeito "ondas múltiplas") — opcional.

### 5.3 Variante "ondas sobrepostas" (opcional, mais premium)

Para que dois pulsos possam coexistir brevemente quando o usuário rola rápido (cenário real onde a animação ainda está terminando quando outra começa):

```jsx
const [pulses, setPulses] = useState([]);

useEffect(() => {
  const count = revealed.filter(Boolean).length;
  if (count > prevRevealedCount.current) {
    const id = Date.now();
    setPulses((p) => [...p, id]);
    setTimeout(() => {
      setPulses((p) => p.filter((x) => x !== id));
    }, 1600); // duração da animação + buffer
  }
  prevRevealedCount.current = count;
}, [revealed]);

{pulses.map((id) => (
  <motion.div
    key={id}
    className="swan-scroll-pulse-ring"
    initial={{ scale: 0, opacity: 0.9 }}
    animate={{ scale: 2.4, opacity: 0 }}
    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
  />
))}
```

**Recomendação:** começar com a versão simples (key incrementável) e migrar para a variante de ondas sobrepostas se a sensação não estiver "rica" o suficiente.

---

## 6. Curvas mantidas da v1 (não mudar)

```js
const strokeLen   = useTransform(smooth, [0.06, 0.78], [0, 1]);
const fillOpacity = useTransform(smooth, [0.62, 0.86], [0, 1]);
const haloOpacity = useTransform(smooth, [0, 0.5, 0.85, 1], [0.2, 0.7, 1, 0.85]);
const haloScale   = useTransform(smooth, [0, 0.5, 1], [0.95, 1.05, 1.15]);
const flashOpacity = useTransform(smooth, [0.86, 0.89, 0.92], [0, 0.18, 0]);
```

**Removidas da v2:**

- `act1Op`, `act2Op`, `act3Op`, `act4Op` (substituídos por state booleano)
- `act1Y`...`act4Y` (substituídos por classe CSS `.is-revealed`)
- `ringScale`, `ringOpacity` (substituídos por sistema de pulse imperativo)

---

## 7. Sincronização ato ↔ desenho do cisne

Pontos de reveal dos atos vs. progresso do desenho do cisne:

| Ato | Reveal em | Estado do cisne nesse ponto |
|---|---|---|
| 01 — Origem | 5% | Cisne começou (stroke ~0%) |
| 02 — Forma | 32% | Cisne com ~36% do stroke |
| 03 — Identidade | 60% | Cisne com ~75% do stroke + fill iniciando |
| 04 — Marca | 88% | Cisne com fill quase completo + clímax |

**Por que essas porcentagens:**

- `5%` — primeiro reveal acontece **logo que entra na seção**, evita "tela vazia" no início
- `32%` — alinhado a 1/3 do stroke, simbolicamente quando "a forma já é reconhecível"
- `60%` — momento em que o usuário "vê" o cisne pela primeira vez completo (asas terminando)
- `88%` — junto com o flash do clímax, fechando a narrativa

---

## 8. Comportamento responsivo

### 8.1 Tablet (1025-1280px)

- Barra reduz para 16px de largura
- Atos com `font-size: clamp(1.8rem, 3vw, 2.8rem)`
- Resto idêntico ao desktop

### 8.2 Mobile (≤ 1024px)

Como na v1: o scroll lock é desabilitado, todos os atos aparecem como uma lista vertical estática (sem reveal por scroll), barra de progresso e pulse ring escondidos.

```css
@media (max-width: 1024px) {
  .swan-scroll-progress-rail {
    display: none;
  }
  .swan-scroll-inner {
    grid-template-columns: 1fr;
  }
  .swan-scroll-act {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 9. Acessibilidade

- `prefers-reduced-motion: reduce` continua mostrando o estado final estático com **todos os 4 atos visíveis** (já alinhado com a nova versão — vantagem do design cumulativo)
- A barra de progresso é decorativa, com `aria-hidden="true"`
- Cada `.swan-scroll-act` recebe `aria-current="step"` quando `revealed = true` para leitores de tela navegando por seções
- O pulse ring é decorativo, `aria-hidden="true"`

---

## 10. Comparativo final

| Critério | v1 (atual) | v2 (alvo) |
|---|---|---|
| Atos visíveis simultaneamente | 1 | até 4 (cumulativo) |
| Barra de progresso | Curta, alinhada à coluna | Full-height da seção |
| Marcadores de ato na barra | Não | Sim, 4 dots iluminam ao passar |
| Pulse ring | 1× no clímax | 4×, um por reveal |
| Tipografia (palavra-ato) | clamp(2.6, 5.5vw, 5.6rem) | clamp(2, 3.6vw, 3.4rem) |
| Cross-fade entre atos | Sim | Não (todos ficam) |
| Estado final (após scroll) | Apenas ato 4 visível | Todos os 4 visíveis |

---

## 11. Arquivos afetados

| Arquivo | Mudanças |
|---|---|
| [src/components/svg/SwanScrollDraw.jsx](../src/components/svg/SwanScrollDraw.jsx) | Reescrita do JSX (estrutura DOM nova); state de `revealed`; sistema de `pulses`; remoção dos 4 `useTransform` de ato |
| [src/index.css](../src/index.css) — bloco `.swan-scroll*` | Grid 3 colunas no `.swan-scroll-inner`; novo `.swan-scroll-progress-rail` full-height; novos marcadores; ajuste do `font-size` da palavra-ato |

Estimativa: **~1.5h** de implementação + 30min de QA.

---

## 12. Roadmap de implementação

1. Adicionar a coluna do trilho ao `.swan-scroll-inner` (CSS) — sem JSX ainda
2. Refatorar JSX da barra: `.swan-scroll-progress-rail` + filete + 4 marcadores
3. Substituir os 4 `useTransform` por state `revealed` + `useMotionValueEvent`
4. Adaptar `.swan-scroll-acts` para flex column com `space-around`
5. Reduzir `font-size` da palavra-ato + adicionar classe `.is-revealed`
6. Implementar sistema de `pulses` (versão simples primeiro)
7. Aplicar `aria-current="step"` + `aria-hidden` nos elementos decorativos
8. QA: testar em 1920×1080, 1536×864, 1280×720, mobile

---

*Documento de especificação. Nenhum código foi alterado ainda — aguardando aprovação para implementar.*

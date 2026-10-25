# Sugestões — Hero e Serviços

> Documento de proposta. Nenhuma alteração de código foi feita.
> Data: 2026-10-24

## 1. Diagnóstico

As seções mais fortes do site (Parallax/`SwanRiver`, Cases/`Portfolio`, Equipe/`Team` e Formulário/`Contact`) têm três coisas em comum:

1. **Contam uma história em tempo.** O cisne é desenhado, assenta e nada. O baralho da equipe gira com timer e barra de progresso. O formulário avança em passos. Existe *antes, durante e depois*.
2. **Respondem ao usuário.** O scroll guia a cena do rio, o hover pausa o baralho, o carrossel tem bordas com fade e navegação que reage ao estado.
3. **Têm coreografia fina.** Palavras sobem uma a uma com blur (`WORD` em `Team.jsx`), o marca-texto ciano revela o trecho em destaque, os cards fazem um arco com ponto alto (`APEX`).

O **Hero** e o **Serviços** ainda usam só o padrão base do projeto: `fadeUp` com blur e stagger fixo. São bonitos, mas estáticos depois que entram:

- **Hero:** título, subtítulo e botões entram juntos e param. O cisne grande à direita só "respira" (pulso de opacidade). A aurora e as penas são fundo, não interagem. Não existe ligação visual com o `SwanRiver`, que vem logo abaixo e é a seção mais marcante do site.
- **Serviços:** três `GlowCard` iguais em grid. O hover é bom (tilt 3D, spotlight, borda cônica), mas os três cards têm o mesmo peso, a mesma estrutura e a mesma animação. Não há hierarquia, narrativa, nem um "momento" memorável. A lista de itens é só texto.

## 2. Padrões que todas as sugestões seguem

Para manter a identidade do projeto:

| Elemento | Padrão existente |
|---|---|
| Easing | `swanEase = [0.22, 1, 0.36, 1]` / `--ease-swan` |
| Entrada | `opacity + y + filter: blur()`, `whileInView`, `viewport={{ once: true }}` |
| Cor | `--cyan #83DFE9` como único acento, sobre `--bg #050708` |
| Tipografia | Sora (títulos, 800, tracking negativo) + Manrope (texto) |
| Destaque | gradiente `#fff → cyan` com `background-clip: text` (`.grad`, `.team-mark`) |
| Traço SVG | `stroke #83DFE9`, `strokeWidth ~1.4`, `vectorEffect: non-scaling-stroke`, `pathLength` |
| Animação pesada | um único `requestAnimationFrame` escrevendo direto no DOM/canvas, sem re-render do React por frame (como em `SwanRiver`) |
| Visibilidade | `IntersectionObserver` liga e desliga loops (como o timer do `Team`) |
| Acessibilidade | `usePrefersReducedMotion` com versão estática; `aria-hidden` em decoração |
| Conversão | CTAs usam `prefillContactInterest()` antes de rolar até `#contact` |

---

## 3. Hero — 5 sugestões

### H1. O cisne se desenha na abertura (e entrega para o rio)

**Ideia:** hoje o cisne do Hero só aparece com fade. Ele passaria a ser **traçado na tela** no carregamento, como no `SwanRiver`: a linha percorre pescoço, asas e bico, o preenchimento com gradiente entra por último e o glow acende no fim. A abertura do site vira a assinatura da marca.

**Animação:**
- 0–1,6s: traço dos 5 subpaths com janelas sobrepostas. Reaproveita a mesma divisão do `SwanRiver` (`SWAN_PATH.split(/(?=M\s)/)` + `STROKE_WINDOWS`). Assim o comportamento fica igual em todos os navegadores.
- Uma "ponta de caneta" (círculo pequeno com blur ciano) segue a ponta do traço.
- 1,4–2,2s: o `fill` com gradiente entra com opacidade e o `feGaussianBlur` do glow cresce.
- Depois o pulso atual (`opacity [0.55, 1, 0.55]`) continua como respiração.
- **Ponte com o rio:** com `useScroll` ligado ao Hero, o cisne perde opacidade e desce levemente ao sair da tela (`y: 0 → 80`, `opacity: 0.5 → 0`). Isso prepara a entrada do cisne desenhado no `SwanRiver`. A sensação é de *um* cisne que acompanha a página.

**Por que funciona:** dá ao Hero o mesmo vocabulário da seção mais forte do site. A primeira impressão passa a ser movimento intencional, não só fade.

**Onde mexe:** `svg/HeroSwan.jsx`, `Hero.jsx`. **Esforço:** médio.
**Movimento reduzido:** cisne já completo, sem traço nem saída por scroll.

---

### H2. Título vivo: palavras com vento e uma palavra que troca

**Ideia:** o título usa a mesma coreografia de palavras da Equipe e ganha um elemento rotativo:

> **Onde a beleza**
> encontra a ***performance*** → ***precisão*** → ***conversão*** → ***elegância***

**Animação:**
- Entrada palavra a palavra com `WORD` (`y: 0.55em`, `blur(10px)`, stagger de ~55ms), o mesmo do `Team.jsx`.
- "Onde a beleza" ganha um **brilho que passa uma vez** pelo gradiente: `background-position` de um gradiente largo `#fff → cyan → #fff`, cerca de 1,2s, depois que a linha assenta.
- A palavra em itálico troca a cada ~3,5s com o **efeito de vento do `SwanRiver`**: as letras da palavra atual saem para a esquerda com blur e stagger curto (`STAGGER_OUT`), e a nova chega da direita letra a letra (`easeOutQuart`).
- Embaixo da palavra ativa, um **sublinhado em traço SVG** se desenha (`pathLength 0 → 1`) com uma leve curva de onda, como uma linha d'água.
- A largura do container anima com `layout` do Framer, para "encontra a" não pular quando a palavra muda de tamanho.

**Por que funciona:** o título deixa de ser estático, mas o ritmo é calmo (3,5s, easing suave), longe de um efeito "digitando". A palavra que troca comunica os pilares da marca sem precisar de outra seção para isso.

**Onde mexe:** `Hero.jsx`, novo trecho de CSS `.hero-title-rotator`. **Esforço:** baixo/médio.
**Acessibilidade:** a palavra trocada fica com `aria-live="off"`. O `<h1>` lê só "performance" via texto `sr-only`, para leitores de tela não ouvirem a troca. Com movimento reduzido, a palavra fica fixa.

---

### H3. Água no horizonte: o Hero termina onde o rio começa

**Ideia:** criar na base do Hero uma **faixa de água em canvas** (cerca de 18–22% da altura), com linha de horizonte fina em ciano e ondulação lenta. Ela é a mesma linguagem visual do `RiverScene`. O cursor e os cliques criam **ondulações concêntricas** na água.

**Animação:**
- A linha do horizonte se desenha da esquerda para a direita na entrada (0,4–1,4s).
- A água "respira" com 2–3 senoides sobrepostas e amplitude baixa, como na calmaria do `SwanRiver`.
- `pointermove` sobre a faixa deixa um rastro suave. Um clique (inclusive nos CTAs) gera um anel que se expande e some (raio 0 → 180px, opacidade 0,5 → 0, ~1,4s).
- O reflexo do cisne (H1) aparece invertido na água com opacidade baixa e distorção ondulada.
- Ao rolar, a faixa de água "cola" visualmente no topo do `SwanRiver`: mesma cor, mesma altura de horizonte. Com isso a troca de seção parece contínua. O `WaveDivider` entre as duas pode sair.

**Por que funciona:** cria interatividade real no Hero (o usuário mexe e algo responde), costura o Hero com o Parallax e reforça a metáfora do cisne.

**Onde mexe:** `Hero.jsx`, reaproveita utilitários de `lib/riverScene.js` (`lerp`, `smoothstep`, `computeLayout`). Possivelmente uma classe `HeroWater` nova em `lib/`. **Esforço:** alto.
**Performance:** um único rAF, pausado por `IntersectionObserver` quando o Hero sai da tela. DPR limitado a 2. Com movimento reduzido, o canvas desenha um frame estático.

---

### H4. Profundidade com o cursor (parallax em camadas + grid revelado)

**Ideia:** hoje as camadas do Hero (aurora, grid, penas, cisne, texto) estão no mesmo plano. Cada uma passaria a reagir ao cursor em **profundidade diferente**, e o grid de fundo só aparece **ao redor do cursor**, como uma lanterna. É o mesmo princípio do spotlight do `GlowCard`, levado para a página inteira.

**Animação:**
- `useMotionValue` para x/y normalizados do cursor (−1..1), passados por `useSpring({ stiffness: 60, damping: 20 })` para dar inércia.
- Deslocamentos por camada: aurora ±30px, grid ±12px, penas ±20px, cisne ±18px com rotação ±2°, texto ±4px. A diferença entre as camadas cria a sensação de 3D.
- A máscara do `.hero-grid` passa a seguir o cursor: `mask-image: radial-gradient(260px at var(--mx) var(--my), black, transparent)`, somada à máscara central atual com opacidade menor. As linhas do grid "acendem" onde o mouse passa.
- No scroll de saída (`useScroll`), o conteúdo sobe mais devagar que a página (`y: 0 → -60`) e ganha blur leve (`0 → 6px`). Isso dá profundidade também na rolagem.
- **Mobile:** troca o cursor por `deviceorientation` com amplitude bem menor. Se o navegador pedir permissão, fica desligado.

**Por que funciona:** é sofisticado e sutil, combina com "sutileza, beleza e performance". Custa pouco, porque são só transforms em GPU.

**Onde mexe:** `Hero.jsx`, `.hero-grid` no `index.css`. **Esforço:** baixo/médio.
**Movimento reduzido:** tudo desligado. O grid volta à máscara fixa atual.

---

### H5. CTAs magnéticos + faixa de credibilidade

**Ideia:** focada em UX e conversão. Os botões ganham presença física, e o rodapé do Hero ganha uma **faixa discreta de prova** (números ou especialidades) no lugar de só "Role para descobrir".

**Animação dos CTAs:**
- **Magnético:** a até ~80px do botão, ele se desloca até 6px na direção do cursor (spring). O ícone `FiArrowRight` anda o dobro. Ao sair, volta com mola.
- **Brilho de passagem:** a cada ~6s, um reflexo diagonal atravessa o `btn-primary` uma vez (`translateX(-120% → 120%)`). Ele chama o olhar sem piscar.
- **Clique:** o botão aperta (`scale 0.97`), e o anel de onda da H3 sai dele. O "Solicitar proposta" chama `prefillContactInterest('Proposta geral')`.

**Faixa de credibilidade (abaixo dos botões):**
- 3 itens em linha com separador de ponto ciano (o `.item-dot` já existe), por exemplo: `+40 projetos entregues · 3 especialidades · Atendimento em todo o Brasil`. **Os números são placeholder e precisam ser reais.**
- Os contadores sobem de 0 até o valor (~1,6s, `easeOutQuart`) quando a faixa entra.
- Alternativa sem números: um marquee lento e muito sutil com as especialidades (`SaaS · Landing Pages · Branding · Automação · Motion…`), com fade nas bordas igual ao `.cases-edge`.

**Por que funciona:** o Hero hoje promete, mas não prova. A faixa responde "por que confiar?" logo na primeira dobra. Os botões magnéticos aumentam a sensação de qualidade sem poluir.

**Onde mexe:** `Hero.jsx`, possivelmente um componente `MagneticButton.jsx` reaproveitável em outros CTAs. **Esforço:** baixo.
**Movimento reduzido:** sem magnetismo nem brilho; os contadores já aparecem no valor final.

---

## 4. Serviços — 5 sugestões

### S1. Serviços como atos (seção fixa guiada pelo scroll)

**Ideia:** levar a narrativa do `SwanRiver` para os serviços, numa versão **mais leve e sem travar o scroll**. A seção fica `sticky` por ~250vh. À esquerda, um índice com os três serviços e uma barra de progresso. À direita, o painel do serviço ativo ocupando a tela.

```
┌──────────────────────────────────────────────────────────┐
│  Serviços com propósito.                                 │
│                                                          │
│  01  Software ━━━━━━━━━░░░    ┌───────────────────────┐  │
│  02  Web                      │  [ícone grande vivo]  │  │
│  03  Design                   │  Software Development │  │
│                               │  descrição…           │  │
│                               │  • SaaS               │  │
│                               │  • Automação…         │  │
│                               │  [Falar sobre…]       │  │
│                               └───────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Animação:**
- O progresso da seção (`useScroll` + `useTransform`) se divide em 3 faixas. A barra do item ativo enche como as barras do timer do `Team`.
- Na troca, o painel atual sai com `SLIDE_EXIT` (sobe com blur) e o próximo entra com `FADE`. Os itens da lista entram um a um (stagger 70ms).
- O número grande (`01`, `02`, `03`) troca com efeito de rolagem vertical (odômetro).
- O índice da esquerda é clicável e leva o scroll até a faixa do serviço.
- **Mobile:** sem sticky. Vira uma pilha de painéis com a mesma entrada em blur.

**Por que funciona:** dá a cada serviço um momento próprio e hierarquia clara. O ritmo de leitura fica igual ao do Parallax, mas sem a trava de scroll, que pode cansar se repetida.

**Onde mexe:** `Services.jsx` (reescrita), `index.css`. `GlowCard` pode continuar sendo usado no mobile. **Esforço:** alto.

---

### S2. Painéis expansíveis (accordion horizontal)

**Ideia:** no desktop, os três cards ficam lado a lado em uma faixa. **O card em foco se expande** (cerca de 55% da largura) e os outros se comprimem em colunas estreitas com título vertical e ícone. Por padrão o primeiro fica aberto.

**Animação:**
- `flex-grow` animado via `layout` do Framer (`transition: { duration: 0.9, ease: swanEase }`), no hover/foco (desktop) ou clique (tablet).
- No card comprimido, o título gira 90° e fica vertical. Ao expandir, ele volta para horizontal com crossfade.
- Ao expandir, o conteúdo entra em cascata: descrição, depois itens (stagger), depois CTA. O ícone **se redesenha** (`pathLength 0 → 1`, que hoje só acontece uma vez).
- A borda cônica (`rotateBorder`) e o spotlight existentes ficam só no card aberto.
- No painel aberto entra um bloco que hoje não existe: **"Como entregamos"**, com 3 micro-etapas e prazo médio. Isso responde dúvidas antes do formulário.
- **Mobile:** accordion vertical com a mesma lógica.

**Por que funciona:** cria foco (um serviço por vez), cabe mais informação sem poluir e dá uma interação satisfatória e "premium". É um padrão comum em sites de estúdio de alto nível.

**Onde mexe:** `Services.jsx`, `GlowCard.jsx` (variante `expanded`), `data/services.js` (novos campos `steps` e `timeline`). **Esforço:** médio.

---

### S3. Ícones viram mini-cenas animadas

**Ideia:** hoje os ícones de 36px são desenhados uma vez e giram no hover. Cada serviço passaria a ter uma **cena pequena (≈ 200×120px) no topo do card**, no estilo de traço fino dos `PortfolioMockups`, que roda em loop suave só quando o card está visível ou com hover.

| Serviço | Mini-cena |
|---|---|
| **Software** | Terminal: linhas de código se digitam (barras de largura variável, sem texto real), um cursor pisca, um `✓` verde-ciano aparece e um gráfico de barras sobe ao lado |
| **Web** | Navegador wireframe: os blocos da página se montam (header → hero → cards) com stagger. Um cursor clica no botão e a página "rola" um pouco |
| **Design** | Ferramenta caneta: uma curva bézier com alças visíveis se desenha e forma **o pescoço do cisne**. Depois, amostras de cor (círculos) aparecem |

**Animação:**
- Ciclo de ~5s por cena, com `repeat: Infinity` e `repeatDelay: 2`, ligado por `IntersectionObserver` (sem loop fora da tela).
- No hover, a cena acelera (`timeScale` maior) e ganha glow. O tilt 3D do card faz a cena se mover em parallax interno (`translateZ`).

**Por que funciona:** mostra o serviço em vez de descrever. A cena do Design fazendo o cisne amarra o serviço com a marca.

**Onde mexe:** `svg/ServiceIcons.jsx` (ou novo `svg/ServiceScenes.jsx`), `GlowCard.jsx`. **Esforço:** médio.
**Movimento reduzido:** mostra o último frame de cada cena, estático.

---

### S4. Monte sua proposta (itens selecionáveis + bandeja)

**Ideia:** focada em **conversão**. Os itens de cada card (`SaaS`, `Landing Pages`, `Branding`…) viram **chips selecionáveis**. Ao selecionar, aparece uma **bandeja flutuante** no rodapé da seção: "3 itens selecionados — Montar proposta →". O clique leva ao formulário já preenchido.

**Animação:**
- Ao clicar, o chip ganha o estilo dos chips ciano do formulário (`.form-wizard-channel`), o `.item-dot` vira `✓` com escala e o chip pulsa levemente.
- **O chip "voa" até a bandeja:** um clone segue um arco do chip até o contador com `layoutId` ou keyframes x/y (mesma ideia do arco `APEX` do `Team`), e o contador da bandeja sobe com efeito odômetro.
- A bandeja entra de baixo (`y: 100% → 0`, `swanEase`) na primeira seleção e sai quando zera.
- No clique em "Montar proposta", a bandeja se estica, vira uma linha de luz e o scroll vai até `#contact`. O formulário abre no passo 2 com os itens listados.

**Por que funciona:** o visitante já sai da seção com intenção declarada. O formulário recebe contexto ("quero SaaS + Automação"), e o lead fica mais qualificado.

**Onde mexe:** `GlowCard.jsx`, `Services.jsx`, `lib/contactBridge.js` (hoje envia um único `interest`; precisa aceitar `items: string[]`), `Contact.jsx` (mostrar os itens no passo 2 e incluí-los na mensagem). **Esforço:** médio.
**Acessibilidade:** chips como `<button aria-pressed>`; a bandeja com `aria-live="polite"`.

---

### S5. Fio de luz que acende os serviços

**Ideia:** uma **linha SVG fina em ciano** sai do título da seção e passa pelos três cards, desenhada pelo scroll (`pathLength` ligado a `useScroll`). Uma partícula de luz corre na ponta. **Quando a linha chega a um card, ele "acende"**: borda cônica liga, ícone se desenha, itens entram. É a ideia do fio condutor da marca: uma linha que vira forma.

**Animação:**
- Path calculado a partir das posições reais dos cards (`getBoundingClientRect` + `ResizeObserver`): uma curva suave em "S" que passa pelo topo de cada card.
- A ponta tem um círculo com blur e um rastro curto (stroke com gradiente de opacidade), como a caneta do `SwanRiver`.
- O card só faz a entrada (`blur → nítido`) quando a linha toca nele, não por `whileInView` genérico. A sequência fica amarrada ao gesto do usuário.
- Depois de completa, a linha mantém um pulso de luz lento que percorre o caminho a cada ~6s.
- O título "Serviços **com propósito.**" usa as palavras do `Team` e o marca-texto em "com propósito".
- **Mobile:** a linha fica vertical, na lateral esquerda, como uma timeline.

**Por que funciona:** dá ritmo e narrativa sem mudar o layout em grid (risco menor que S1/S2) e conecta visualmente com o traço do cisne no Parallax.

**Onde mexe:** `Services.jsx`, `GlowCard.jsx` (prop `lit` controlando a entrada), `index.css`. **Esforço:** médio.
**Movimento reduzido:** linha completa e estática, cards já visíveis.

---

## 5. Combinações recomendadas

Nem tudo combina junto. Caminhos coerentes:

**Hero — caminho recomendado:** **H1 + H2 + H4 + H5.**
H3 (água) é a mais impactante, mas também a mais cara. Vale como segunda fase, depois de medir o desempenho em mobile.

**Serviços — escolher uma estrutura:**
- **Opção A (mais segura):** S5 (fio de luz) + S3 (mini-cenas) + S4 (proposta). Mantém o grid atual e acrescenta narrativa, demonstração e conversão.
- **Opção B (mais ousada):** S2 (painéis expansíveis) + S3 + S4. Foco em um serviço por vez, mais conteúdo por serviço.
- S1 (atos com sticky) só faz sentido se o Hero não ficar pesado demais. Duas seções seguidas guiadas por scroll (Parallax + Serviços) podem cansar.

**Ordem sugerida de implementação** (do maior impacto por esforço ao menor):

1. H2 — título vivo
2. H5 — CTAs magnéticos + credibilidade
3. S4 — monte sua proposta
4. H1 — cisne desenhado
5. S3 — mini-cenas
6. S5 ou S2 — estrutura de Serviços
7. H4 — profundidade com cursor
8. H3 — água no horizonte

## 6. Cuidados técnicos (para todas)

- **Performance:** só animar `transform`, `opacity` e `filter`. Animar `filter: blur` em muitos elementos ao mesmo tempo pesa em mobile, então limitar a ~10 elementos simultâneos. Loops contínuos sempre pausados fora da tela.
- **Movimento reduzido:** toda sugestão precisa de uma versão estática via `usePrefersReducedMotion`, como `SwanRiver` e `Team` já fazem.
- **Touch:** hover e magnetismo não existem em toque. Usar `@media (hover: hover)` para ativá-los e ter alternativa por toque (S2, S4).
- **LCP:** o `<h1>` do Hero precisa estar visível e legível rápido. As animações de entrada não devem passar de ~1,2s para o título.
- **Remontagem:** o `HomePage` remonta `<main>` em cada navegação por causa do `useScroll`. Sugestões que usam `useScroll` (H1, H4, S1, S5) dependem desse comportamento, que não deve ser removido.

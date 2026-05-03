# SWN Studio — Análise de Design & UX/UI

> Análise profunda do estado atual do site (após o ciclo de reformulação) e mapa de melhorias priorizadas, com foco em reforçar a identidade da marca (Swan / sutileza / performance), corrigir riscos de UX e elevar a percepção premium.

---

## 0. Sumário executivo

O site já tem uma base visual coerente com a marca (paleta cyan/preto, tipografia Sora + Manrope, motion fluido com `ease-swan`, identidade do cisne presente em Hero e Sobre). O que ainda falta para passar de "site bonito" para "estúdio premium reconhecível" se divide em quatro grandes blocos:

1. **Conteúdo real** — provas, números e cases concretos (hoje há placeholders).
2. **Conversão & UX** — CTAs sem feedback, formulário sem validação, links externos vazios, ausência de WhatsApp flutuante.
3. **Refino visual** — pequenas inconsistências de espaçamento, hierarquia em mobile, tratamento de imagens reais.
4. **Performance, acessibilidade e SEO** — itens técnicos invisíveis ao olho mas que o Google e leitores de tela percebem (ainda sem `prefers-reduced-motion`, sem alt em decorativos certos, sem sitemap, etc.).

A seguir, cada frente está detalhada com **diagnóstico → recomendação → impacto/esforço**.

---

## 1. Identidade da marca & narrativa visual

### 1.1 — A "história do cisne" não é contada visualmente
**Diagnóstico.** O cisne aparece como ornamento (Hero, Sobre, FinalCTA), mas a metáfora "Swan = sutileza + performance" não vira **micro-narrativa**. O usuário vê o cisne, mas não entende por que ele está ali.

**Recomendação.**
- No Hero, abaixo dos botões, adicionar uma linha curta tipo: *"Swan · do inglês, cisne. Movimento silencioso, resultado preciso."* — em fonte Sora 12-13px, letter-spacing alto, opacidade 0.5.
- Na seção Sobre, criar um pequeno "selo" ao lado do título: ícone-cisne mini + texto vertical "S W A N". Reforça a marca sem competir com o conteúdo.
- Considerar uma seção curta "Por que Swan?" (~80 palavras) entre Sobre e Serviços, contando o nome da marca em primeira pessoa. **Storytelling vende mais do que feature list.**

**Impacto:** alto · **Esforço:** baixo

### 1.2 — Falta um "manifesto visual" de cores secundárias
**Diagnóstico.** A paleta é só cyan + branco + preto. Funciona, mas em telas longas (Portfolio, Process) tudo vira a mesma textura — falta variação cromática para diferenciar seções.

**Recomendação.**
- Manter cyan como cor de marca, mas introduzir **dois tons de apoio derivados**:
  - `--cyan-deep: #2A8C95` (para fundos esfumaçados em seções ímpares)
  - `--cyan-pale: #D4F4F8` (para hover sobre superfícies brancas, se algum dia houver tema claro)
- Aplicar `background: linear-gradient(180deg, transparent, rgba(42, 140, 149, 0.04), transparent)` em seções alternadas para criar **ritmo cromático sutil**.

**Impacto:** médio · **Esforço:** baixo

### 1.3 — Logo no Header ainda parece pequena em desktop largo
**Diagnóstico.** Em `1920px+` a logo de 44px desaparece visualmente perto dos itens de menu (que usam pill-nav).

**Recomendação.**
- Em `min-width: 1440px`, subir para `48-52px`.
- Ou substituir por **logo + wordmark** ("SWN STUDIO" em Sora 800 ao lado do símbolo) — fica menos isolado.

**Impacto:** baixo · **Esforço:** baixo

---

## 2. Conteúdo & Provas (o que falta para vender)

### 2.1 — Portfolio sem case real
**Diagnóstico.** Os 4 cards de [Portfolio.jsx](../src/components/Portfolio.jsx) usam textos genéricos ("Plataforma de gestão", "Loja virtual"). Sem **screenshot real, métrica ou cliente**, parece template.

**Recomendação.**
- Substituir os SVG decorativos por **mockups reais** (mesmo que fictícios bem feitos): 1 print de dashboard, 1 mockup mobile, 1 frame de site institucional.
- Cada card deve ter:
  - Nome do cliente (ou pseudônimo + setor: "Atelier de moda · Curitiba")
  - **Uma métrica concreta**: "+38% conversão", "180 pedidos/dia", "redução de 12h/semana de operação"
  - 2-3 tags de tecnologia (Next.js, Stripe, etc.)
- Criar página individual de case (`/cases/[slug]`) — mesmo que MVP de 1 página, dá profundidade.

**Impacto:** muito alto (é o que mais converte para B2B premium) · **Esforço:** médio

### 2.2 — Depoimentos sem rosto e sem prova
**Diagnóstico.** [Testimonials.jsx](../src/components/Testimonials.jsx) usa avatares com iniciais genéricas. Para B2B premium isso quebra confiança.

**Recomendação.**
- Foto real (mesmo que recortada em círculo + cyan tint).
- Adicionar logo da empresa abaixo do nome.
- Idealmente, **link para o LinkedIn da pessoa** (clicável, com `<FiLinkedin>` discreto).
- Considerar formato mais ousado: 1 depoimento grande tipo "magazine quote" (ocupando metade da viewport) + 2 menores ao lado. Cria hierarquia.

**Impacto:** alto · **Esforço:** baixo (assumindo que depoimentos existem)

### 2.3 — Falta seção de números/conquistas
**Diagnóstico.** Não há nenhuma "stats bar" tipo: *"50+ projetos · 8 anos · 4 países"*. Esses números são âncoras de credibilidade rápidas.

**Recomendação.**
- Adicionar uma faixa fina entre Sobre e Serviços com 3-4 estatísticas + animação de contador (`framer-motion` + `useInView` com `useMotionValue`).
- Tipografia grande (Sora 800, 4-5rem) em cyan, label pequeno em Manrope abaixo.

**Impacto:** alto · **Esforço:** baixo

### 2.4 — Sem FAQ
**Diagnóstico.** Clientes B2B premium têm dúvidas recorrentes (*"qual é o ticket médio?"*, *"vocês trabalham por hora ou por projeto?"*, *"em quanto tempo entregam?"*). A ausência empurra o lead a só conseguir resposta no formulário, **aumentando fricção**.

**Recomendação.** Seção FAQ minimalista com `<details>` HTML5 estilizado (4-6 perguntas), entre Process e Portfolio.

**Impacto:** médio-alto · **Esforço:** baixo

---

## 3. Hero — refinos pontuais

### 3.1 — Texto pode ganhar uma "kicker" antes do título
**Diagnóstico.** O título começa direto. Em sites premium, costuma haver um label discreto antes (ex.: "Estúdio digital · est. 2024") para ancorar identidade.

**Recomendação.** Voltar com um eyebrow **discreto e diferente** dos eyebrows que removemos: sem pílula, apenas texto small caps em cyan, com uma linha vertical fina à esquerda. Texto: *"Estúdio digital · São Paulo / Curitiba"*. (Confirmar localização.)

**Impacto:** médio · **Esforço:** baixo

### 3.2 — CTAs ainda são genéricos
**Diagnóstico.** "Solicitar proposta" + "Conhecer serviços" — funcionais, mas neutros. Para um estúdio premium, CTAs com promessa específica convertem mais.

**Recomendação.**
- CTA primário: *"Iniciar um projeto"* ou *"Agendar diagnóstico (gratuito)"* — mais leve que "proposta".
- CTA secundário: manter "Conhecer serviços" ou trocar por *"Ver cases"* (mais persuasivo).
- Adicionar **micro-copy abaixo dos botões**: *"Resposta em até 24h · sem compromisso"* — quebra objeções silenciosas.

**Impacto:** alto · **Esforço:** baixo

### 3.3 — Cisne em mobile fica "perdido"
**Diagnóstico.** Em telas <768px o cisne fica com opacity `0.16` e empurrado para fora — quase invisível. A marca perde presença justamente onde mais usuários acessam.

**Recomendação.** Em mobile, mover o cisne para **acima do título** (formato vertical) com tamanho menor (~120px), opacidade `0.7`, atuando como "símbolo da marca" no topo. O texto fica abaixo.

**Impacto:** alto · **Esforço:** baixo-médio

### 3.4 — Sem indicador de scroll
**Diagnóstico.** Hero tem 100vh mas não há nenhuma pista de que há mais conteúdo abaixo. Em primeira visita, parte dos usuários não rola.

**Recomendação.** Adicionar um indicador discreto na base do Hero: ícone ↓ animado com *fade in/out* infinito, label "Role para descobrir" em Sora 11px.

**Impacto:** médio · **Esforço:** baixo

---

## 4. Header & Navegação

### 4.1 — Sem "Falar com a SWN" em mobile
**Diagnóstico.** O `header-button` está oculto em `<768px` ([index.css:?](../src/index.css)). O usuário mobile só vê o ícone de menu — perde o CTA principal de cima.

**Recomendação.** Adicionar um botão "WhatsApp" (ícone só) ao lado do ícone de menu em mobile. Sempre visível, sempre conversor.

**Impacto:** alto (conversão mobile) · **Esforço:** baixo

### 4.2 — Hover dos itens de nav é discreto demais
**Diagnóstico.** Apenas troca de cor. Para um nav-pill premium, falta micro-interação.

**Recomendação.** Adicionar **indicador animado** (uma "pílula" cyan que desliza entre os itens via `layoutId` do framer-motion). Padrão Linear/Vercel.

**Impacto:** médio · **Esforço:** médio

### 4.3 — Drawer mobile sem backdrop
**Diagnóstico.** O drawer cobre apenas o topo; o resto da página continua interativo. Pode causar scroll acidental por trás do menu.

**Recomendação.** Adicionar overlay escuro (`rgba(0,0,0,0.6)` + `backdrop-filter: blur(8px)`) que cubra todo o restante quando o menu mobile estiver aberto, com `body { overflow: hidden }` aplicado via efeito.

**Impacto:** médio · **Esforço:** baixo

### 4.4 — Falta destaque de seção ativa em mobile
**Diagnóstico.** A lógica de `IntersectionObserver` está pronta no [Header.jsx](../src/components/Header.jsx), mas o menu mobile só mostra hover, não estado ativo persistente. Confirmar que a classe `.active` está sendo aplicada também no drawer.

**Recomendação.** Auditar e garantir paridade de UX entre nav desktop e mobile.

**Impacto:** baixo · **Esforço:** baixo

---

## 5. Seção Sobre

### 5.1 — Pillars são lista, mas têm potencial de motion
**Diagnóstico.** Os 3 pilares (Sutileza, Beleza, Performance) entram com fade simples e ficam estáticos. Eles são **conceitos centrais da marca** — merecem mais protagonismo.

**Recomendação.**
- Cada pilar deveria ter uma **micro-animação loop infinito** que ilustra o conceito:
  - **Sutileza** — uma linha fina sendo desenhada e apagada continuamente
  - **Beleza** — um shape morphing suave (círculo → quadrado → triângulo arredondado)
  - **Performance** — um pulso/onda batendo em ritmo cardíaco
- Posicionados no `pillar-icon` (substituem os ícones Feather genéricos).

**Impacto:** alto (reforça a marca) · **Esforço:** médio

### 5.2 — `OrbitalRings` decorativo demais, sem semântica
**Diagnóstico.** As órbitas giram, mas não comunicam nada. Em uma marca "performance", isso é oportunidade perdida.

**Recomendação.** Substituir por uma visualização que **conta uma história**:
- Opção A: **dataviz fictícia mas elegante** — barras animadas representando "antes/depois" de um cliente.
- Opção B: **contador animado triplo** — "Projetos entregues / Setores atendidos / Países".
- Opção C: manter as órbitas, mas com cada órbita representando um pilar, com tooltip ao hover.

**Impacto:** médio · **Esforço:** médio

---

## 6. Seção Swan Scroll Draw

### 6.1 — Pode ganhar contexto de marca
**Diagnóstico.** O cisne aparece, é desenhado, e a tela continua. É bonito, mas frio.

**Recomendação.**
- Após o desenho terminar (>92% scroll), revelar um **trecho curto da história da marca** abaixo do cisne, em fade-in: *"Cada solução que entregamos é desenhada com a mesma atenção. Linha por linha. Projeto por projeto."*
- Faz a animação ter um *propósito* além de visual.

**Impacto:** alto · **Esforço:** baixo

### 6.2 — Sem fallback para `prefers-reduced-motion`
**Diagnóstico.** Usuários com sensibilidade a movimento veem o site rolar sem o cisne aparecer (porque o desenho exige scroll). Acessibilidade quebrada.

**Recomendação.** Detectar `prefers-reduced-motion: reduce` e renderizar o cisne **já completo** (modo `fill`) sem animação de scroll.

**Impacto:** acessibilidade crítica · **Esforço:** baixo

---

## 7. Seção Serviços

### 7.1 — Cards são iguais demais
**Diagnóstico.** Os 3 cards (Software, Web, Design) têm exatamente o mesmo layout. Em uma seção pivô como essa, **pelo menos um deveria ser destacado** como serviço carro-chefe.

**Recomendação.**
- Marcar 1 card como "Mais procurado" (badge cyan no canto superior).
- Ou usar grid asimétrico: card central maior, dois laterais menores.

**Impacto:** médio · **Esforço:** baixo

### 7.2 — Lista de subitens sem nenhuma interação
**Diagnóstico.** Os subitens são só dots + texto. Para B2B, o usuário quer **entender o que é cada serviço** sem precisar abrir 5 páginas.

**Recomendação.**
- Hover em cada subitem revela uma **descrição inline** (~1 linha) com transição altura.
- Ou: adicionar `<details>` por subitem para expandir/recolher.
- Ou: criar página dedicada por serviço (`/servicos/saas`, `/servicos/branding`).

**Impacto:** alto · **Esforço:** médio

### 7.3 — Falta CTA dentro de cada card
**Diagnóstico.** O card mostra o que é, mas não convida à ação.

**Recomendação.** Adicionar no rodapé de cada card um link discreto *"Saber mais →"* ou *"Falar sobre [Serviço]"* que rola até `#contact` e **pré-preenche o `<select>` de interesse no formulário**.

**Impacto:** alto · **Esforço:** baixo

---

## 8. Seção Processo

### 8.1 — Cards estáticos, sem progresso visual
**Diagnóstico.** Os 4 passos são apenas paralelos. Falta sensação de **fluxo** (já que removemos o `ProcessConnector`).

**Recomendação.**
- Em cada card, adicionar **timeline mini** acima do número (uma barra fina cyan que se preenche conforme o card entra no viewport).
- Ou: numerar como "01 → 02 → 03 → 04" com uma seta sutil entre cards (não a linha animada que tinha problema, mas estática + opacidade baixa).

**Impacto:** médio · **Esforço:** baixo

### 8.2 — Falta a duração esperada de cada etapa
**Diagnóstico.** Cliente premium quer saber **quanto tempo cada fase leva**. Sem isso, o "Processo" parece teórico.

**Recomendação.** Adicionar abaixo do título de cada card: *"~3 dias"*, *"~1 semana"*, *"4-12 semanas"*, *"contínuo"*. Em fonte pequena, cyan, eyebrow-style.

**Impacto:** alto · **Esforço:** baixo

---

## 9. Portfolio

### 9.1 — SVG decorativo bom, mas não escala
**Diagnóstico.** Decorações SVG são únicas para os 4 cards atuais — quando o portfolio crescer (10, 15 cases), vira repetição visível.

**Recomendação.** Substituir por **imagens reais** dos projetos (com tratamento: tint cyan, blur sutil, hover revela cor real).

**Impacto:** alto · **Esforço:** médio (depende de assets)

### 9.2 — Sem filtros por categoria
**Diagnóstico.** Quando houver 10+ cases, o usuário não consegue navegar.

**Recomendação.** Adicionar tabs no topo do grid: *"Todos · Software · Web · Branding"* com filtro animado via `AnimatePresence + layout`.

**Impacto:** médio (futuro) · **Esforço:** médio

---

## 10. Contato

### 10.1 — Formulário sem validação visual
**Diagnóstico.** O `<input>` usa apenas `required` HTML5. Sem feedback de erro estilizado, sem máscara, sem indicação de campos opcionais vs obrigatórios.

**Recomendação.**
- Validação inline com mensagens em cyan (não vermelho — fora da paleta).
- Indicação visual: campos obrigatórios com asterisco discreto, opcionais com tag `(opcional)`.
- Considerar usar [react-hook-form](https://react-hook-form.com/) para validação leve.

**Impacto:** alto · **Esforço:** médio

### 10.2 — Submit abre WhatsApp em nova aba — sem confirmação
**Diagnóstico.** O `submit` faz `window.open(wa.me/...)` mas o número de telefone não está preenchido (`https://wa.me/?text=...`). **Vai abrir uma tela em branco no WhatsApp**.

**Recomendação.** Substituir por:
- Um número real: `https://wa.me/55XXXXXXXXXX?text=...`
- Ou uma integração real (Resend, Formspree, EmailJS) que envie o e-mail de verdade + mostra um toast de confirmação.

**Impacto:** crítico (está quebrado em produção) · **Esforço:** baixo

### 10.3 — Sem opção de "agendar reunião"
**Diagnóstico.** Para tickets B2B premium, formulário de texto é fricção. **Calendário direto é o padrão moderno** (Cal.com, Calendly).

**Recomendação.** Adicionar um botão *"Agendar reunião (15 min)"* abaixo do formulário, embedando Cal.com ou similar.

**Impacto:** alto · **Esforço:** baixo (Cal.com tem widget pronto)

### 10.4 — Canais sem ícones de "abrir externamente"
**Diagnóstico.** WhatsApp/Instagram abrem em nova aba mas não há sinal visual. Convenção UX: `↗` ao lado.

**Recomendação.** Adicionar `<FiArrowUpRight>` discreto no canto direito de cada canal externo.

**Impacto:** baixo · **Esforço:** baixo

---

## 11. Final CTA

### 11.1 — Botão único — falta opção mais leve
**Diagnóstico.** Só "Falar com a SWN Studio" como opção. Para visitante que ainda não está pronto pra conversar, não há "saída".

**Recomendação.** Adicionar CTA secundário menor: *"Ver cases primeiro"* ou *"Receber portfolio por e-mail"* (lead magnet leve).

**Impacto:** médio · **Esforço:** baixo (alto se for lead magnet)

---

## 12. Footer

### 12.1 — Sem newsletter
**Diagnóstico.** O footer só tem links. Para um estúdio que faz Motion + Branding, **uma newsletter** é canal direto de relacionamento (e captura leads frios).

**Recomendação.** Coluna nova no footer: campo de e-mail + botão "Receber insights mensais sobre design e tecnologia". Conectar com Resend Audience ou Mailchimp.

**Impacto:** médio-alto · **Esforço:** médio

### 12.2 — Slogan repetido no footer e em vários lugares
**Diagnóstico.** "Onde a beleza encontra a performance" aparece no Hero, no `<title>`, no footer. Pode causar fadiga.

**Recomendação.** No footer, usar uma variação: *"Movimento silencioso. Resultado preciso."* — reforça a metáfora cisne sem soar repetitivo.

**Impacto:** baixo · **Esforço:** trivial

### 12.3 — Footer pode incluir endereço fiscal/CNPJ
**Diagnóstico.** Para B2B brasileiro, CNPJ no footer transmite legitimidade (alguns clientes verificam antes de fechar contrato).

**Recomendação.** Linha discreta no `footer-bottom`: *"SWN Studio LTDA · CNPJ XX.XXX.XXX/0001-XX"*.

**Impacto:** baixo (mas perceptível para enterprise) · **Esforço:** trivial

---

## 13. Performance

### 13.1 — Bundle JS está em ~318kb (gzip ~101kb)
**Diagnóstico.** Aceitável, mas não ótimo. `framer-motion` é a maior parte. `react-icons/fi` carrega o pacote inteiro.

**Recomendação.**
- Trocar imports de `react-icons/fi` por imports diretos de cada ícone via `react-icons/fi/index.esm.js` (tree-shaking não funciona com import comum).
- Code-split por seção via `React.lazy` (Hero, About no bundle inicial; Portfolio, Testimonials, Contact em chunks separados).
- Considerar substituir `framer-motion` por `motion` (a versão "vanilla mini" — `motion/react` lite, ~30kb).

**Impacto:** médio · **Esforço:** médio

### 13.2 — Sem lazy loading de imagens
**Diagnóstico.** As logos PNG são pequenas, mas quando entrar mockups de portfolio, vai pesar.

**Recomendação.** Já adicionar `loading="lazy"` + `decoding="async"` em qualquer `<img>` que apareça abaixo do hero.

**Impacto:** alto (para o futuro com mockups) · **Esforço:** trivial

### 13.3 — Fontes carregando sem `font-display: swap`
**Diagnóstico.** O Google Fonts já vem com swap por padrão, mas vale auditar com Lighthouse para confirmar que não há FOIT.

**Recomendação.** Considerar **self-hosting das fontes** (download + `@font-face` local) — elimina dependência de terceiros e melhora LCP em ~200ms.

**Impacto:** médio · **Esforço:** baixo

### 13.4 — Animações framer-motion sem `will-change`
**Diagnóstico.** Em mobile mid-tier, o cisne sendo desenhado + halo + scroll smooth pode causar jank.

**Recomendação.** Adicionar `will-change: transform, opacity` nos elementos com motion mais pesado (cisne, aurora, partículas). Apenas durante a animação — não constante.

**Impacto:** médio · **Esforço:** baixo

### 13.5 — Body tem 4 camadas fixed sobrepostas (`::before`, `::after`, swan-layer, header)
**Diagnóstico.** Cada camada fixa força um composite layer no GPU. Aceitável em desktop, mas em mobile baixa-end pode sobrecarregar.

**Recomendação.** Avaliar se o grid (`body::after`) e o gradiente (`body::before`) podem virar um único SVG fixed, ou ser pintado em canvas único. Otimização avançada.

**Impacto:** baixo (a menos que apareçam relatos de lentidão) · **Esforço:** alto

---

## 14. Acessibilidade (a11y)

### 14.1 — Sem `prefers-reduced-motion`
**Diagnóstico.** Crítico — o site é totalmente animado. Usuários com sensibilidade a movimento (vestibular, enxaqueca) terão experiência ruim ou nauseante.

**Recomendação.**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
+ no JS, detectar e renderizar versão estática do cisne.

**Impacto:** crítico (acessibilidade WCAG) · **Esforço:** baixo

### 14.2 — Contraste de texto secundário
**Diagnóstico.** `--text-mute: rgba(255,255,255,0.48)` em fundo `#050708` dá contraste ~5.5:1 — passa AA mas não AAA.

**Recomendação.** Auditar com Axe ou Lighthouse. Subir mute para `0.55` se necessário.

**Impacto:** médio · **Esforço:** trivial

### 14.3 — Skip link ausente
**Diagnóstico.** Usuários de teclado precisam tabular pelo header inteiro antes de chegar ao conteúdo.

**Recomendação.** Adicionar `<a class="skip-link" href="#hero">Pular para o conteúdo</a>` no topo do `<body>`, escondido visualmente até receber foco.

**Impacto:** acessibilidade · **Esforço:** trivial

### 14.4 — Foco de teclado quase invisível
**Diagnóstico.** Botões e links não têm `:focus-visible` estilizado; o anel padrão do navegador foi resetado pelo `*` reset.

**Recomendação.**
```css
:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 3px;
  border-radius: 4px;
}
```

**Impacto:** acessibilidade crítica · **Esforço:** trivial

### 14.5 — Inputs do formulário sem `aria-describedby`
**Diagnóstico.** Quando houver erros de validação (item 10.1), leitor de tela precisa saber qual erro corresponde a qual campo.

**Recomendação.** Cada `<input>` com erro deve apontar `aria-describedby="erro-nome"` para o `<span>` da mensagem.

**Impacto:** acessibilidade · **Esforço:** baixo

### 14.6 — `AnimatedText` morto
**Diagnóstico.** [AnimatedText.jsx](../src/components/AnimatedText.jsx) existe mas não é usado em lugar nenhum. Código morto no bundle.

**Recomendação.** Deletar o arquivo.

**Impacto:** baixo · **Esforço:** trivial

---

## 15. SEO & Compartilhamento

### 15.1 — Sem `sitemap.xml` nem `robots.txt`
**Recomendação.** Gerar ambos no build. Vite tem plugins prontos (`vite-plugin-sitemap`).

**Impacto:** SEO · **Esforço:** baixo

### 15.2 — OG image atual é a logo, não uma "card image"
**Diagnóstico.** Quando alguém compartilha o link no LinkedIn/WhatsApp, aparece a logo isolada — pouco atrativo.

**Recomendação.** Criar um OG image dedicado (1200×630): cisne ciano com glow + tagline + URL. Salvar em `/public/og.png`.

**Impacto:** médio · **Esforço:** baixo

### 15.3 — Sem JSON-LD estruturado
**Diagnóstico.** Google entende melhor sites de empresas com Schema.org `Organization` ou `LocalBusiness`.

**Recomendação.** Adicionar no `index.html`:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SWN Studio",
  "url": "https://swnstudio.com",
  "logo": "https://swnstudio.com/logo-ciano.png",
  "sameAs": ["https://instagram.com/swnstudio", ...]
}
</script>
```

**Impacto:** SEO médio · **Esforço:** trivial

### 15.4 — Sem canonical URL
**Recomendação.** `<link rel="canonical" href="https://swnstudio.com/" />` no `<head>`.

**Impacto:** SEO baixo (importa quando houver múltiplas URLs) · **Esforço:** trivial

---

## 16. Conversão (CRO)

### 16.1 — Sem WhatsApp flutuante
**Diagnóstico.** Padrão B2B brasileiro. Aumenta conversão mensurável.

**Recomendação.** Botão fixo no canto inferior direito (cyan, redondo, ícone WhatsApp), aparece após scroll de 100vh, anima entrada com bounce.

**Impacto:** alto · **Esforço:** baixo

### 16.2 — Sem analytics
**Diagnóstico.** Sem Plausible/Umami/GA, é impossível saber quais CTAs funcionam, onde os usuários abandonam, qual seção é mais lida.

**Recomendação.** Adicionar Plausible (privacy-first, sem banner de cookies, leve).

**Impacto:** essencial para iterar · **Esforço:** baixo

### 16.3 — Sem pixel para retargeting
**Diagnóstico.** Visitas perdidas não retornam. Para B2B premium com ciclo de venda longo, retargeting funciona.

**Recomendação.** Adicionar Meta Pixel + LinkedIn Insight Tag (com consentimento via banner LGPD).

**Impacto:** alto (médio prazo) · **Esforço:** médio

### 16.4 — Sem prova social no Hero
**Diagnóstico.** O Hero não mostra **nenhuma evidência de credibilidade** antes do scroll.

**Recomendação.** Logo bar discreto abaixo dos botões: *"Confiam na SWN"* + 4-5 logos de clientes (em escala de cinza, opacity 0.5, hover anima para colorido).

**Impacto:** muito alto · **Esforço:** baixo

---

## 17. Refinos visuais finais

### 17.1 — Wave dividers podem ficar sutis demais
**Diagnóstico.** Em mobile, as ondas quase desaparecem.

**Recomendação.** Aumentar opacity do stroke em mobile via media query.

**Impacto:** baixo · **Esforço:** trivial

### 17.2 — Glow dos cards às vezes "lava" o conteúdo
**Diagnóstico.** Em hover, a borda conic-gradient dos `glow-card` pode reduzir contraste do título.

**Recomendação.** Garantir `z-index` correto + adicionar uma sutileza: o título ganha `text-shadow: 0 0 24px rgba(0,0,0,0.6)` no hover para preservar leitura.

**Impacto:** baixo · **Esforço:** trivial

### 17.3 — Botões secondary "somem" sobre o background dos cards
**Diagnóstico.** O `btn-secondary` no Hero tem border `rgba(255,255,255,0.14)` que fica quase invisível em fundo escuro com glow.

**Recomendação.** Subir a borda para `0.22` ou adicionar `backdrop-filter: blur(4px)` para "encorpar" o botão.

**Impacto:** médio · **Esforço:** trivial

### 17.4 — Falta tratamento para texto em telas ultra-wide (>1920px)
**Diagnóstico.** O conteúdo cola no `max-width: 1200px` e desperdiça espaço lateral.

**Recomendação.** Subir `--container-wide` para `1440px` e em viewport `>1920px`, aumentar tamanhos de tipografia em ~10%.

**Impacto:** baixo (público restrito) · **Esforço:** baixo

### 17.5 — Dark mode é assumido, sem `color-scheme`
**Recomendação.** Adicionar `color-scheme: dark` no `:root` — melhora scrollbars e form controls nativos.

**Impacto:** baixo · **Esforço:** trivial

---

## 18. Pequenos bugs / dívidas técnicas

| # | Onde | Problema | Correção |
|---|---|---|---|
| 1 | [Contact.jsx](../src/components/Contact.jsx) | `wa.me/` sem número quebra produção | Adicionar número real |
| 2 | [Hero.jsx:48-79](../src/components/Hero.jsx#L48-L79) | Indentação do JSX está fora de padrão (motion.div fora do `<div className="hero-bg">`) | Reindentar |
| 3 | [AnimatedText.jsx](../src/components/AnimatedText.jsx) | Componente não usado | Deletar |
| 4 | [Footer.jsx](../src/components/Footer.jsx) | Links sociais apontam para `instagram.com/`, `linkedin.com/` (sem handle) | Substituir por URLs reais |
| 5 | `index.html` | `og:url` ausente | Adicionar `<meta property="og:url" content="https://swnstudio.com">` |
| 6 | [Header.jsx](../src/components/Header.jsx) | `IntersectionObserver` não desconecta no menu mobile (memory leak teórico) | Auditar |

---

## 19. Roadmap sugerido (ordenado por ROI)

### Sprint 1 — Correções críticas (1-2 dias)
1. Consertar form de contato (WhatsApp real ou EmailJS) — **bloqueador de conversão**
2. Adicionar `prefers-reduced-motion` — **acessibilidade**
3. `:focus-visible` nos botões — **acessibilidade**
4. Atualizar links sociais reais — **credibilidade**
5. Deletar `AnimatedText` morto — **higiene**

### Sprint 2 — Conversão (3-5 dias)
6. WhatsApp flutuante
7. Logos de clientes no Hero (mesmo que com permissão básica)
8. Métricas reais nos cards de Portfolio
9. CTA com pré-preenchimento do formulário (cards de serviço)
10. Indicador de scroll no Hero
11. Stats bar com números

### Sprint 3 — Profundidade (1-2 semanas)
12. Páginas individuais de case (`/cases/[slug]`)
13. Páginas individuais de serviço (`/servicos/[slug]`)
14. FAQ
15. Newsletter no footer
16. Calendário Cal.com no Contato
17. Plausible + Meta Pixel

### Sprint 4 — Refino premium (contínuo)
18. Pillars com micro-animações ilustrativas
19. OrbitalRings → dataviz com narrativa
20. SwanScrollDraw com história após desenho
21. Code-splitting por seção
22. Self-hosting de fontes
23. Sitemap + Schema.org

---

## 20. Princípios de design para futuras iterações

Para manter coerência ao longo do tempo, sugiro fixar 5 princípios:

1. **Sutileza > Show-off.** Toda animação precisa servir à comunicação, nunca ser decorativa pura.
2. **Cyan é assinatura, não inundação.** Cyan deve aparecer em ~10% dos pixels da tela. Mais que isso, vira ruído.
3. **Cisne presente, não onipresente.** A marca aparece em momentos calculados (Hero, Sobre, FinalCTA), não em toda seção.
4. **Tipografia faz o trabalho pesado.** Antes de adicionar gráficos, perguntar: posso resolver com hierarquia tipográfica?
5. **Mobile primeiro como filosofia, mesmo entregando desktop primeiro como prática.** Toda decisão deve ter "como isso colapsa em 360px?" respondida.

---

*Documento vivo. Atualizar conforme decisões forem tomadas.*

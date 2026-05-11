# Páginas de Cases — Especificação & Sugestões

> Documento de planejamento para criar páginas individuais de cases de portfólio. Hoje os cases vivem só no carrossel da landing (`#portfolio`), com botão "Conheça nossos cases" que aponta de volta pra `#services`. A proposta: cada card do carrossel ter sua própria página detalhada, acessível via URL única, com botão de voltar visível, e narrativa que vende.

---

## 1. Estado atual

**O que já existe:**
- Carrossel horizontal em [src/components/Portfolio.jsx](../src/components/Portfolio.jsx) com 5 cases em array local
- Cada case tem: `id`, `tag`, `boldLead`, `text`, `metric`, `stack`, `mockup`, `accent`
- O CTA dentro do card aponta pra `#services` (placeholder)
- O link no header da seção também é placeholder

**O que falta:**
- Roteamento (não há React Router, Wouter, nem nada similar instalado)
- Páginas individuais por case
- Botão de voltar
- Estrutura de dados expandida (cada case precisa de mais conteúdo pra justificar uma página inteira)

---

## 2. Decisões a tomar (estrutura técnica)

### 2.1 Como rotear?

#### 🅰 React Router DOM (recomendado)
Padrão da indústria, comunidade gigante, documentação acessível.

```bash
npm install react-router-dom
```

Estrutura:
```
/                       → Landing (App.jsx atual)
/cases/:slug            → Página individual de case
/cases                  → (opcional) Listagem completa
```

**Pros:** robusto, suporta navegação programática, scroll restoration, params dinâmicos.
**Cons:** adiciona ~10kb gzip ao bundle. Mas é o trade-off correto pra o que vamos construir.

#### 🅱 Wouter (alternativa minimalista)
Router de 1.6kb, API similar mas mais simples.
**Cons:** comunidade menor, menos features (sem nested routing nativo, scroll restoration manual).

#### 🅲 Hash routing manual
Sem dependência. Lê `window.location.hash` e troca o componente.
**Cons:** sem deep linking real (URLs com hash são pior pra SEO), falta scroll restoration, complexidade cresce rápido.

**Recomendação:** **🅰 React Router DOM**. Bundle não é problema (já temos 109kb gzip JS), e a robustez compensa.

### 2.2 Onde os dados dos cases vivem?

Hoje o array `cases` está hard-coded dentro de [Portfolio.jsx](../src/components/Portfolio.jsx). Vamos mover pra:

```
src/data/cases.js
```

Cada case ganha um schema rico (ver seção 4). Usado tanto pelo carrossel da landing quanto pelas páginas individuais.

### 2.3 Slug nas URLs

Em vez de `/cases/vexa` (id curto), usar slug legível: `/cases/vexa-group-plataforma-gestao`. Melhor pra SEO, link sharing e legibilidade.

---

## 3. Variações de design da página de case (escolha 1)

Hoje você não sabe o que quer. Trago **5 variações com personalidades diferentes**. Cada uma resolve o mesmo problema (apresentar o case) mas com tom diferente.

### 🎬 Variação A — "Cinematográfica" (estilo Apple/Linear)

**Estrutura vertical, scroll narrativo:**

```
┌────────────────────────────────────────────────────────┐
│ ← Voltar para os cases                                 │ ← Header sticky
├────────────────────────────────────────────────────────┤
│                                                        │
│  SAAS · SOFTWARE                                       │ ← Tag (eyebrow)
│                                                        │
│  Vexa Group                                            │ ← Cliente (display)
│  Plataforma de gestão                                  │
│  multitenant para logística.                           │ ← Headline gigante
│                                                        │
│  [ MOCKUP / IMAGEM HERO — full width, alto ]           │ ← Imagem grande
│                                                        │
├────────────────────────────────────────────────────────┤
│  3 colunas com métricas grandes:                       │
│  −38%        2.5x        14k                           │
│  tempo op.   produtividade usuários                    │
├────────────────────────────────────────────────────────┤
│  Desafio                                               │
│  Texto narrativo grande...                             │ ← Storytelling
├────────────────────────────────────────────────────────┤
│  Solução                                               │
│  Como resolvemos...                                    │
│  [ Mockup secundário com detalhe ]                     │
├────────────────────────────────────────────────────────┤
│  Resultado                                             │
│  Texto + call to action                                │
├────────────────────────────────────────────────────────┤
│  Stack utilizada · React, Next, Postgres, Vercel       │
│  Duração · 4 meses · Equipe · 3 pessoas                │
├────────────────────────────────────────────────────────┤
│  Próximo case →  Casa Plena (preview card)            │ ← Continuidade
└────────────────────────────────────────────────────────┘
```

**Por que é premium:** narrativa em ato 1 (desafio), 2 (solução), 3 (resultado). Cada seção tem espaço pra respirar. Métricas grandes geram impacto. Footer com "próximo case" mantém o usuário no funil.

**Custo:** alto (~6h). Cada case precisa de ~6 blocos de texto + 2-3 imagens.

---

### 🪟 Variação B — "Editorial" (estilo Stripe Customers)

**Layout 2 colunas, mais denso:**

```
┌────────────────────────────────────────────────────────┐
│ ← Voltar                                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────┐  ┌────────────────────────┐ │
│  │                      │  │  SAAS · SOFTWARE       │ │
│  │  MOCKUP / IMAGEM     │  │  Vexa Group            │ │
│  │  GRANDE STICKY       │  │                        │ │
│  │  (acompanha scroll)  │  │  Plataforma SaaS       │ │
│  │                      │  │  para logística.       │ │
│  │                      │  │                        │ │
│  │                      │  │  Lead 2-3 linhas       │ │
│  │                      │  │  vendendo o resultado. │ │
│  └──────────────────────┘  │                        │ │
│                             │  ──────────────        │ │
│                             │  −38% tempo            │ │
│                             │  +2.5x produtividade   │ │
│                             │  ──────────────        │ │
│                             │  ## O desafio          │ │
│                             │  Texto descritivo      │ │
│                             │  ## A solução          │ │
│                             │  Texto descritivo      │ │
│                             │  ## O resultado        │ │
│                             │  Texto descritivo      │ │
│                             │  ──────────────        │ │
│                             │  [ Falar com a SWN ]   │ │
│                             └────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Por que é premium:** imagem grande sticky à esquerda gera profundidade visual. Texto à direita rola normalmente. O mockup "acompanha" a leitura. Stripe usa exatamente isso em stripe.com/customers.

**Custo:** médio (~4h). Menos texto que a A.

---

### 📑 Variação C — "Documentação" (estilo Vercel/Linear)

**Layout 3 colunas: nav + conteúdo + meta:**

```
┌─────────┬────────────────────────────────┬─────────────┐
│ Cases   │ ← Voltar                       │ INFO        │
│         │                                │             │
│ • Vexa  │ Vexa Group                     │ Cliente     │
│ ◦ Casa  │ Plataforma SaaS                │ Vexa Group  │
│ ◦ Nordi │ ──────────────                 │             │
│ ◦ Marche│ [ Mockup hero ]                │ Setor       │
│ ◦ Lumen │                                │ Logística   │
│         │ ## Sobre                       │             │
│         │ ## Desafio                     │ Stack       │
│         │ ## Solução                     │ Next, PG... │
│         │ ## Resultados                  │             │
│         │ ## Stack & Time                │ Duração     │
│         │                                │ 4 meses     │
│         │                                │             │
│         │                                │ [ ↗ Site ]  │
└─────────┴────────────────────────────────┴─────────────┘
```

**Por que é premium:** sensação de "biblioteca técnica" — usuário pode pular entre cases sem voltar. Side nav fixa convida a explorar. Coluna direita com metadados é o estilo Vercel/Linear documentation.

**Custo:** alto (~7h). Side nav com active state, design responsivo das 3 colunas, coluna direita sticky.

---

### 🎯 Variação D — "Marketing landing" (mais comercial)

**Cada case é uma mini landing page completa:**

```
┌────────────────────────────────────────────────────────┐
│ ← Voltar                                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Hero: nome do cliente + headline + CTA                │
│  [ Imagem hero gigante 100vh com mockup flutuando ]    │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Faixa de logos das integrações usadas                 │
├────────────────────────────────────────────────────────┤
│  Features grid (3 colunas):                            │
│  ⚡ Performance  🎯 Precisão  📈 Resultado             │
│  Cada um com bullet points                             │
├────────────────────────────────────────────────────────┤
│  Big metric block (números enormes):                   │
│  -38%   2.5x   14k                                     │
│  Background com gradient ciano                         │
├────────────────────────────────────────────────────────┤
│  Quote do cliente (testimonial gigante)                │
│  "A SWN traduziu nossa marca..."                       │
│  — Nome, Cargo, Empresa                                │
├────────────────────────────────────────────────────────┤
│  Galeria de screenshots (4 imagens grandes)            │
├────────────────────────────────────────────────────────┤
│  CTA final: "Quer um resultado parecido?"              │
│  [ Falar com a SWN ]                                   │
└────────────────────────────────────────────────────────┘
```

**Por que é premium:** cada case parece **um produto sendo vendido**. Cliente que entra na página sai querendo contratar. Trabalha como prova social ativa, não passiva.

**Custo:** muito alto (~10h por case configurado). Mas o template é reutilizável.

---

### 🎨 Variação E — "Minimalista" (estilo Aesop/A24)

**Foco absoluto no visual, texto curto:**

```
┌────────────────────────────────────────────────────────┐
│ ←                                          → próximo   │ ← Nav minimalista
├────────────────────────────────────────────────────────┤
│                                                        │
│                                                        │
│         Vexa Group                                     │
│         Plataforma de gestão.                          │
│                                                        │
│         Logística · 2024                               │
│                                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [ IMAGEM GIGANTE — full bleed, 100vh ]                │
│                                                        │
├────────────────────────────────────────────────────────┤
│         3-4 frases curtas. Apenas o essencial.         │
│         Quase poético.                                 │
├────────────────────────────────────────────────────────┤
│  [ IMAGEM 2 ]                                          │
├────────────────────────────────────────────────────────┤
│         Métricas em tipografia editorial               │
│         menor, sem destaque                            │
├────────────────────────────────────────────────────────┤
│  [ IMAGEM 3 ]                                          │
├────────────────────────────────────────────────────────┤
│         ← Voltar    Próximo: Casa Plena →              │
└────────────────────────────────────────────────────────┘
```

**Por que é premium:** confiança absoluta. Marca não precisa explicar — mostra. Funciona muito bem se você tiver mockups/screenshots de altíssima qualidade. Estilo editorial de magazine premium.

**Custo:** baixo-médio (~3h). Pouco texto, muita imagem. Ponto crítico: depende de boa direção visual.

---

## 4. Schema de dados sugerido

Independente da variação escolhida, cada case precisa desses campos. Coloque em [src/data/cases.js](../src/data/cases.js):

```js
export const cases = [
  {
    /* ─── Identificação ─── */
    id: 'vexa-group',
    slug: 'vexa-group-plataforma-gestao',
    client: 'Vexa Group',
    sector: 'Logística B2B',
    year: 2024,
    duration: '4 meses',
    teamSize: 3,

    /* ─── Card no carrossel da landing ─── */
    tag: 'SaaS · Software',
    boldLead: 'Plataforma de gestão.',
    cardText: 'SaaS multitenant que automatizou fluxos operacionais...',
    mockup: 'dashboard',
    accent: 'linear-gradient(135deg, ...)',

    /* ─── Métricas (até 3) ─── */
    metrics: [
      { value: '−38%', label: 'tempo operacional' },
      { value: '2.5x', label: 'produtividade' },
      { value: '14k', label: 'usuários ativos' }
    ],

    /* ─── Página individual: hero ─── */
    headline: 'Plataforma SaaS multitenant para logística B2B.',
    subhead: 'Reescrevemos o sistema interno em 4 meses, automatizando processos que consumiam o time inteiro.',
    heroImage: '/cases/vexa/hero.png',  // se decidir usar imagens reais

    /* ─── Conteúdo narrativo (3 atos) ─── */
    challenge: {
      title: 'O desafio',
      text: 'A Vexa cresceu 4x em 2 anos, mas o sistema interno...'
    },
    solution: {
      title: 'A solução',
      text: 'Reescrevemos como SaaS multitenant em Next.js + tRPC...',
      features: [
        'Multitenant com isolamento por cliente',
        'Real-time updates via WebSocket',
        'Auditoria completa de operações',
        'Permissões granulares por equipe'
      ]
    },
    result: {
      title: 'O resultado',
      text: 'O time operacional reduziu o tempo de resposta em 38%...'
    },

    /* ─── Stack & créditos ─── */
    stack: ['Next.js', 'TypeScript', 'tRPC', 'Postgres', 'Prisma', 'Vercel'],
    integrations: ['Stripe', 'Twilio', 'AWS S3'],

    /* ─── Galeria (opcional) ─── */
    gallery: [
      { src: '/cases/vexa/dashboard.png', alt: 'Tela do dashboard' },
      { src: '/cases/vexa/admin.png', alt: 'Painel administrativo' }
    ],

    /* ─── Testimonial específico do case (opcional) ─── */
    testimonial: {
      text: 'Saímos do improviso...',
      author: 'Rafael Lima',
      role: 'COO',
      avatar: 'RL'
    },

    /* ─── Link externo opcional ─── */
    liveUrl: null,  // ou 'https://app.vexa.com'

    /* ─── Próximo case (auto-calculado em runtime, mas pode ser manual) ─── */
    nextCaseId: 'casa-plena'
  }
  // ... outros cases
];
```

---

## 5. Botão de voltar — variações

Você pediu "bem visível no canto superior esquerdo". Trago 3 estilos compatíveis com a paleta SWN:

### 5.1 Padrão minimalista (recomendado)
```
┌──────────────────────────────────┐
│ ← Voltar para os cases           │
└──────────────────────────────────┘
```
- Sticky no topo (`position: sticky; top: header_height`)
- Background blur (`backdrop-filter: blur(14px)`)
- Hover: ícone desliza pra esquerda + cor vira ciano
- Mesmo estilo do `.form-wizard-back` que já existe

### 5.2 Botão circular flutuante
```
   ╭───╮
   │ ← │       Vexa Group
   ╰───╯       Plataforma SaaS...
```
- Botão circular `48px` no canto superior esquerdo
- Mesmo estilo dos `.cases-nav-btn` do carrossel (cyan-line + hover ciano)
- Mais "premium discreto", menos verbal

### 5.3 Breadcrumb
```
SWN Studio · Cases · Vexa Group
```
- Mais informativo, menos "botão" e mais navegação contextual
- Cada item clicável (volta home, volta listagem, atual)

**Recomendação:** **5.1 + 5.2 combinados** — breadcrumb tipográfico no top da página + botão circular para clique rápido. Mas se for escolher só um, **5.1**.

---

## 6. Como o usuário chega na página

### Da landing
- Botão "Conheça nossos cases" do header da seção #portfolio → leva para `/cases` (listagem)
- CTA "Conheça nossos serviços" dentro de cada card do carrossel **deveria mudar** para "Conheça este case" → leva para `/cases/vexa-group-...`

### Diretamente
- URL compartilhada (link no LinkedIn, e-mail, etc.)
- SEO orgânico

### Listagem `/cases` (opcional, decidir)
- Grid completo dos 5 cases (não rolagem horizontal)
- Filtros por categoria (Software / Web / Mobile / E-commerce)
- Mesma estética dos cards do carrossel mas em grid 2-3 colunas

---

## 7. Roadmap de implementação

Assumindo aprovação da **Variação B (Editorial)** + **5.1 (botão minimalista)**:

| Sprint | O que entra | Tempo |
|---|---|---|
| 1 | Instalar `react-router-dom` + reorganizar `App.jsx` em `<BrowserRouter>` | 30min |
| 2 | Mover dados de `cases` para `src/data/cases.js` com schema novo | 45min |
| 3 | Criar componente `<CasePage />` com layout B + botão voltar | 2h |
| 4 | Criar componente `<CasesIndex />` (listagem em `/cases`) | 1h |
| 5 | Atualizar `Portfolio.jsx` para linkar nos novos slugs | 30min |
| 6 | Scroll restoration (rolar pro topo ao entrar em case) | 15min |
| 7 | Meta tags dinâmicas por case (Helmet ou react-helmet-async) | 45min |
| 8 | QA: testar navegação, voltar do browser, deep links | 30min |

**Total: ~6h** para entregar Variação B funcional com 5 cases populados.

---

## 8. Considerações futuras

- **CMS-ready:** o schema da seção 4 é compatível com qualquer headless CMS (Sanity, Contentful, Notion) — basta substituir o array por um fetch quando crescer
- **Imagens reais:** as variações C, D, E pedem imagens de qualidade. Hoje os mockups são SVG genéricos. Vale orçar fotografia/screenshot real
- **i18n:** se houver intenção de site bilíngue, o schema precisa incluir `pt` e `en` — fácil de adicionar depois, mas pensar agora evita refactor
- **Compartilhamento:** cada case deve ter `og:image` próprio gerado dinamicamente (Vercel OG image, por exemplo) — bom pra LinkedIn

---

## 9. Decisões pendentes (preciso da sua resposta)

1. **Roteador:** React Router DOM (recomendado), Wouter, ou hash-only?
2. **Variação de design:** A (Cinematográfica), B (Editorial), C (Documentação), D (Marketing), E (Minimalista) — ou híbrido?
3. **Botão de voltar:** 5.1 (texto), 5.2 (circular), 5.3 (breadcrumb) — ou combinado?
4. **Listagem `/cases`:** quer uma página índice, ou o usuário sempre chega via carrossel da home?
5. **Conteúdo dos cases:** todos os 5 já têm conteúdo real ou são placeholders? Quem escreve os textos de Desafio/Solução/Resultado?
6. **Imagens:** SVG mockup atual continua, ou vamos usar screenshots reais? (impacta variação D e E)
7. **Linhas externas:** algum case tem URL pública (`liveUrl`) que vamos linkar?

---

*Documento de planejamento. Nenhum código foi alterado — aguardando aprovação das decisões da seção 9.*

# Envio de case — guia de materiais

> Como me enviar as informações e as imagens de um projeto novo para que ele entre no site **completo, bonito e no mesmo padrão** dos cases atuais.
>
> Última atualização: 23/09/2026 — reflete a estrutura atual das páginas de cases. Se o layout mudar, este guia deve ser atualizado junto.

---

## Resumo em 30 segundos

1. Crie uma pasta para o case (ex.: `SWN-CODE/envios/nome-do-cliente/`).
2. Copie o [template](#9-template-para-preencher) para um arquivo `case.md` dentro dela e preencha.
3. Coloque as imagens **originais** numa subpasta `imagens/`, com os nomes da [seção 8](#8-como-enviar).
4. Me mande: **"Implemente o case que está em `<caminho da pasta>`"**.

Pode mandar os textos em tópicos ou rascunho: eu redijo no padrão e te mostro antes de publicar. O que **não** dá para eu inventar são os fatos: números, prazos, nomes, depoimentos e imagens.

---

## Sumário

1. [Onde o case aparece no site](#1-onde-o-case-aparece-no-site)
2. [Categorias](#2-categorias)
3. [Obrigatório × opcional](#3-obrigatório--opcional)
4. [Informações do projeto, campo a campo](#4-informações-do-projeto-campo-a-campo)
5. [Tom de voz](#5-tom-de-voz)
6. [Imagens](#6-imagens)
7. [Permissões e confidencialidade](#7-permissões-e-confidencialidade)
8. [Como enviar](#8-como-enviar)
9. [Template para preencher](#9-template-para-preencher)
10. [Exemplo preenchido](#10-exemplo-preenchido)
11. [Checklist antes de enviar](#11-checklist-antes-de-enviar)
12. [O que eu faço quando recebo o material](#12-o-que-eu-faço-quando-recebo-o-material)
13. [Perguntas frequentes](#13-perguntas-frequentes)

---

## 1. Onde o case aparece no site

O fluxo do site é: **`/cases`** (categorias) → **`/cases/<categoria>`** (galeria de projetos) → **`/cases/<categoria>/<case>`** (página do case).

Um case novo aparece em quatro lugares:

| Lugar | O que mostra |
|---|---|
| Galeria da categoria (`/cases/saas`) | Card com capa, tag, nome do cliente, frase de destaque e texto |
| Página do case | Tudo: topo, métricas, desafio, solução, resultado, depoimento, stack e ficha técnica |
| Lateral "Nesta categoria" (páginas dos outros cases da mesma categoria) | Nome do cliente + tag |
| "Próximo case" (fim da página do case anterior da mesma categoria) | Nome do cliente + tag |

> O carrossel da home mostra as **categorias**, não os cases. Um case novo não aparece direto na home.
> Quando uma categoria recebe o primeiro case, o aviso "Novos projetos em breve" some sozinho e o contador ("01 projeto") aparece.

### Card na galeria

```
┌─────────────────────────────────────┐
│ [SAAS · SOFTWARE]      ← tag        │
│                                     │
│        imagem de capa (1:1)         │
│                                     │
└─────────────────────────────────────┘
 Vexa Group                        ↗    ← nome do cliente
 Plataforma de gestão.                  ← frase de destaque (branco)
 SaaS multitenant que automatizou…      ← texto do card (cinza)
```

### Página do case

```
┌─ lateral ──────┐ ┌─ conteúdo ──────────────────────┐ ┌─ ficha ───────┐
│ VOLTAR PARA    │ │ [SAAS · SOFTWARE]     ← tag     │ │ Cliente       │
│ ← SaaS         │ │ Vexa Group            ← cliente │ │ Setor         │
│ ← Todos        │ │ Headline                        │ │ Ano           │
│                │ │ Subtítulo                       │ │ Duração       │
│ NESTA PÁGINA   │ │ ┌─────────────────────────────┐ │ │ Time SWN      │
│ Sobre          │ │ │ imagem principal (16:10)    │ │ │ [Ver ao vivo] │
│ Desafio        │ │ └─────────────────────────────┘ │ └───────────────┘
│ Solução        │ │  −38%       2.5x       14k      │
│ Resultado      │ │  (3 métricas)                   │
│ Stack & Time   │ │ 01 · O desafio                  │
│                │ │ 02 · A solução + entregas       │
│ NESTA          │ │ 03 · O resultado                │
│ CATEGORIA      │ │ "Depoimento" — nome, cargo      │
│ outros cases   │ │ 04 · Stack & Time               │
│                │ │ Próximo case →                  │
└────────────────┘ └─────────────────────────────────┘
```

No celular as três colunas viram uma só (lateral → conteúdo → ficha). Os títulos das seções ("O desafio", "A solução", "O resultado", "Como foi construído") são fixos. Você não precisa mandar.

---

## 2. Categorias

Todo case precisa de **pelo menos uma** categoria. Ele aparece na galeria de cada categoria informada.

| Categoria | Slug (URL) | Use quando o projeto for… |
|---|---|---|
| SaaS | `saas` | software na nuvem, acessado por assinatura |
| Site institucional | `site-institucional` | site oficial da empresa (quem somos, serviços, contato) |
| Landing page | `landing-page` | página única focada em uma conversão (lead, venda, inscrição) |
| E-commerce | `e-commerce` | loja virtual com catálogo, carrinho e pagamento |
| CRM | `crm` | funil de vendas, relacionamento ou fidelização de clientes |
| Chatbot | `chatbot` | assistente automático no WhatsApp, site ou redes |
| Social Media | `social-media` | gestão de redes: planejamento, posts, reels, stories |
| Tráfego pago | `trafego-pago` | campanhas de anúncios (Google, Meta, LinkedIn…) |
| Sistema de gestão | `sistema-de-gestao` | software interno sob medida (ERP, BI, operação) |

**Regras**

- **A primeira categoria da lista é a principal**: ela define a URL do case (`/cases/saas/vexa-group-…`). As outras só fazem o case aparecer também nessas galerias.
- Exemplo: a Vexa Group é `SaaS` (principal) + `Sistema de gestão`.
- Se o projeto não se encaixa em nenhuma, me avise. Criar categoria nova é uma mudança maior: card no `/cases`, card no carrossel da home e ilustração própria.

---

## 3. Obrigatório × opcional

| Campo | Status | Onde aparece |
|---|---|---|
| Nome do cliente | **Obrigatório** | card, título da página, ficha, lateral |
| Categoria(s) | **Obrigatório** | em quais galerias o case aparece |
| Setor do cliente | **Obrigatório** | ficha técnica |
| Ano | **Obrigatório** | ficha técnica |
| Duração | **Obrigatório** | ficha técnica |
| Time SWN | **Obrigatório** | ficha técnica |
| Tag | **Obrigatório** | card, topo da página, lateral, "Próximo case" |
| Frase de destaque | **Obrigatório** | card |
| Texto do card | **Obrigatório** | card |
| Headline | **Obrigatório** | topo da página |
| Subtítulo | **Obrigatório** | topo da página |
| 3 métricas | **Obrigatório** | faixa de números |
| O desafio | **Obrigatório** | seção 01 |
| A solução | **Obrigatório** | seção 02 |
| Entregas da solução (lista) | Recomendado | seção 02 |
| O resultado | **Obrigatório** | seção 03 |
| Stack / ferramentas | **Obrigatório** | seção 04 |
| Integrações | Opcional | seção 04 |
| Depoimento | Recomendado | bloco de citação |
| Link ao vivo | Opcional | botão "Ver projeto ao vivo" na ficha |
| Imagem principal | Recomendado | capa do card e topo da página |
| Telas extras | Opcional | capa alternativa e futura galeria |

> **Sem imagens**, o case usa a ilustração padrão da categoria (as mesmas dos cards atuais). Funciona, mas imagem real valoriza muito mais o trabalho.

---

## 4. Informações do projeto, campo a campo

Os limites abaixo foram medidos nos cases que já estão no site. Dentro deles, o case novo fica com o mesmo ritmo visual: cards da mesma altura, títulos em uma linha, blocos equilibrados. Se passar do limite, eu ajusto e te mostro.

### 4.1 Identificação e ficha técnica

| Campo | O que é | Limite | Exemplos |
|---|---|---|---|
| **Cliente** | Nome como deve aparecer (grafia oficial, maiúsculas e acentos) | até ~24 caracteres | `Vexa Group`, `Atelier Nordi` |
| **Setor** | Segmento de mercado do cliente. Use ` · ` para detalhar | até 22 caracteres | `Logística B2B`, `Varejo · Fidelidade`, `Moda · B2B` |
| **Ano** | Ano de entrega ou de lançamento | 4 dígitos | `2025` |
| **Duração** | Tempo total do projeto, por extenso | curto | `6 semanas`, `4 meses` |
| **Time SWN** | Nº de pessoas da SWN no projeto (o site escreve "pessoa"/"pessoas") | número | `3` |
| **Link ao vivo** *(opcional)* | URL pública e estável (site no ar, app na loja) | — | `https://…` |

> O endereço (slug) do case eu crio a partir do nome: `vexa-group-plataforma-gestao`. Não precisa mandar.

### 4.2 Card da galeria

| Campo | O que é | Limite | Exemplos |
|---|---|---|---|
| **Tag** | Rótulo sobre a imagem, no formato `Tipo · Subtipo`. O site deixa em maiúsculas | **12 a 22** caracteres (acima disso corta com "…" no celular) | `SaaS · Software`, `Mobile · App nativo`, `E-commerce · Web` |
| **Frase de destaque** | O que é o projeto em 2 a 5 palavras, **terminando com ponto** (texto em branco e negrito) | **15 a 32** caracteres | `Plataforma de gestão.`, `Loja virtual de alta conversão.` |
| **Texto do card** | Uma frase: o que foi feito + o principal ganho (texto em cinza) | **95 a 125** caracteres (os atuais têm 105–111) | `SaaS multitenant que automatizou fluxos operacionais e reduziu o tempo de resposta interna em mais de um terço.` |

> A tag é livre e **não precisa** repetir a categoria. A Casa Plena está na categoria CRM, mas a tag dela é `Mobile · App nativo`.

### 4.3 Topo da página

| Campo | O que é | Limite | Exemplo |
|---|---|---|---|
| **Headline** | O projeto em uma frase, com ponto final | **35 a 60** caracteres | `Plataforma SaaS multitenant para logística B2B.` |
| **Subtítulo** | 1 ou 2 frases vendendo o resultado | **80 a 130** caracteres | `Reescrevemos o sistema interno em 4 meses, automatizando processos que consumiam o time inteiro.` |

### 4.4 Métricas — exatamente 3

A faixa de números foi desenhada para **3 métricas** lado a lado (no celular ficam empilhadas).

| Parte | Limite | Exemplos |
|---|---|---|
| **Valor** | até **6** caracteres | `−38%`, `2.5x`, `14k`, `4.8★`, `0.8s`, `+72%`, `60+` |
| **Rótulo** | minúsculas, até **22** caracteres | `tempo operacional`, `downloads em 90 dias`, `leads qualificados` |

- **Números reais e aprovados pelo cliente.** Me diga também a **base e o período** (ex.: "comparado ao trimestre anterior ao lançamento"). Isso fica só comigo, para eu escrever o resultado com precisão.
- Sem números de resultado? Use números **do projeto**, que são igualmente verdadeiros: `5` módulos, `3` integrações, `6` semanas, `12` telas, `4` idiomas.
- Tendo só 1 ou 2 números, me avise: eu adapto a faixa. Mas o padrão ideal é 3.
- Os mesmos números devem aparecer no texto de **O resultado** (4.7).

### 4.5 O desafio — seção 01

**Limite:** 200 a 350 caracteres (2 a 4 frases).

Perguntas que ajudam:

- Quem é o cliente e em que momento ele estava (crescendo, lançando, reposicionando)?
- Qual era o problema concreto? (processo manual, conversão baixa, marca desatualizada, atendimento lento…)
- Quanto esse problema custava? (tempo, dinheiro, clientes perdidos, retrabalho)
- O que já tinha sido tentado antes?

> **Exemplo:** "A Vexa cresceu 4x em dois anos, mas o sistema interno não acompanhou. Equipe operacional gastava horas em tarefas repetitivas, ferramentas isoladas geravam erro de digitação e o time não tinha visibilidade do que acontecia em tempo real."

### 4.6 A solução — seção 02

**Texto:** 150 a 250 caracteres. O que construímos e qual foi a abordagem, em linguagem de negócio (a tecnologia pode aparecer, mas o foco é o que ela resolve).

**Entregas (lista com ✓):** 3 a 5 itens (os cases atuais usam 5), **até 45 caracteres cada**, começando por substantivo:

- `Multitenant com isolamento por cliente`
- `Push notifications segmentadas`
- `Check-out em 2 etapas com pagamento integrado`

### 4.7 O resultado — seção 03

**Limite:** 150 a 250 caracteres. Traga os números das métricas com contexto + o impacto no negócio + como o projeto está hoje.

> **Exemplo:** "Leads qualificados subiram 72%. LCP médio em 0.8s, score Lighthouse 94. O time comercial passou a fechar pedidos no preço-alvo desde a primeira reunião."

### 4.8 Depoimento (recomendado)

| Campo | Limite / regra |
|---|---|
| **Texto** | 80 a 140 caracteres, 1 ou 2 frases, na voz do cliente |
| **Nome** | Nome e sobrenome do autor |
| **Cargo** | Curto: `COO`, `Founder`, `Head de Marketing`, `CEO` |

- A empresa exibida é o próprio cliente, e o avatar é gerado com as iniciais do nome. Você não precisa mandar.
- **O autor precisa ter aprovado o texto.** Confirme isso no template.
- Quer que o depoimento entre também no **carrossel de depoimentos da home**? Marque no template.

### 4.9 Stack e integrações — seção 04 ("Como foi construído")

| Campo | Quantidade | Exemplos |
|---|---|---|
| **Stack / ferramentas** | 4 a 6 itens, com o nome oficial | `Next.js`, `React Native`, `TypeScript`, `Postgres`, `Shopify`, `Figma` |
| **Integrações** *(opcional)* | 0 a 4 itens | `Stripe`, `WhatsApp Business API`, `HubSpot`, `GA4` |

> **Projetos de marketing e design** (Social Media, Tráfego pago, identidade visual) também usam essa seção: liste **ferramentas e plataformas**.
> Ex.: Stack: `Meta Ads`, `Google Ads`, `Figma`, `Premiere`, `CapCut` · Integrações: `GA4`, `Pixel da Meta`, `RD Station`.

---

## 5. Tom de voz

- Português do Brasil, **1ª pessoa do plural**: "Reescrevemos…", "Construímos…", "Migramos…".
- Frases curtas, voz ativa, concretas. **Números no lugar de adjetivos.**
- Evite superlativos vazios ("incrível", "revolucionário"), jargão sem explicação, emojis e CAIXA ALTA.
- O cliente é o protagonista do desafio; a SWN é protagonista da solução; o resultado é do cliente.

---

## 6. Imagens

### 6.1 Como as imagens entram no site

- Hoje todos os cases usam **ilustrações desenhadas em código** (os mockups dos cards). Imagens reais substituem a ilustração daquele case.
- **Padrão visual:** a imagem entra dentro do quadro do site, com fundo em gradiente ciano, brilho e sombra, numa **moldura de navegador** (telas desktop) ou **de celular** (telas mobile), igual às ilustrações atuais. Assim todos os cases ficam com a mesma cara, mesmo com prints de origens diferentes.
- Por isso **não precisa** mandar fundo, moldura, sombra nem montagem: mande a tela limpa.
- **Na primeira vez:** o suporte a imagens reais ainda não existe no código. Eu implemento uma única vez, no primeiro case com imagens, e a partir daí vale para todos.

### 6.2 Imagem principal (a mais importante)

É usada no **topo da página do case** e, por padrão, também na **capa do card**.

- **1 tela** que melhor representa o projeto: o dashboard principal, a home do site, a tela-chave do app.
- **Desktop:** proporção **16:10**, ideal **2560×1600 px** (mínimo 1920×1200).
- **Mobile** (apps, chatbot, social): tela vertical, ideal **1170×2532 px** (mínimo 1080×2340).
- O nome do cliente aparece como marca d'água discreta no canto do quadro, fora da imagem.

### 6.3 Capa do card (quadrada)

Duas opções:

- **Opção A (recomendada):** não mande capa. Eu monto a capa com a imagem principal, no padrão.
- **Opção B:** capa já pronta, feita por designer:
  - proporção **1:1**, ideal **1600×1600 px** (mínimo 1200×1200);
  - fundo escuro na paleta do site (`#050708` a `#0B1316`), com toques de ciano `#83DFE9`;
  - **margem de segurança de 10%** em todas as bordas (os cantos são arredondados);
  - **canto superior esquerdo livre**: a tag ocupa até ~55% da largura × 12% da altura ali;
  - sem texto, logo grande ou moldura própria.

### 6.4 Telas extras (opcional)

- 2 a 6 telas adicionais, cada uma com uma frase dizendo o que mostra.
- Hoje a página do case **não tem galeria de imagens**. As extras servem para escolher uma capa diferente da imagem principal e para uma futura seção "Galeria", que eu posso adicionar (e aí vale para todos os cases).

### 6.5 O que enviar por categoria

| Categoria | Imagem principal | Extras sugeridos |
|---|---|---|
| SaaS | dashboard / tela principal (desktop) | 2 a 4 módulos, versão mobile se houver |
| Sistema de gestão | tela principal (desktop) | relatórios, cadastros, permissões |
| CRM | funil / pipeline (desktop) | ficha do cliente, relatórios, app mobile |
| Site institucional | topo da home (desktop) | páginas internas, versão mobile |
| Landing page | topo da página (desktop) | formulário, página inteira, versão mobile |
| E-commerce | home da loja (desktop) | página de produto, carrinho/checkout, mobile |
| Chatbot | conversa no celular (vertical) | fluxo da conversa, painel de atendimento |
| Social Media | grade do perfil (celular) | 6 a 9 posts, capas de reels/stories, print de alcance |
| Tráfego pago | criativo principal ou painel de resultados | 3 a 6 criativos, print do gerenciador de anúncios |

### 6.6 Especificações técnicas

| Tipo | Proporção | Ideal | Mínimo | Formato |
|---|---|---|---|---|
| Tela desktop | 16:10 | 2560×1600 | 1920×1200 | PNG |
| Tela mobile | ~9:19,5 | 1170×2532 | 1080×2340 | PNG |
| Capa pronta (opção B) | 1:1 | 1600×1600 | 1200×1200 | PNG ou JPG |
| Post de feed | 4:5 | 1080×1350 | — | JPG ou PNG |
| Post quadrado | 1:1 | 1080×1080 | — | JPG ou PNG |
| Story / Reels | 9:16 | 1080×1920 | — | JPG ou PNG |
| Logo do cliente *(opcional)* | livre | SVG | PNG 1000 px, fundo transparente | SVG ou PNG |
| Foto do autor do depoimento *(opcional)* | 1:1 | 800×800 | 400×400 | JPG |

**Regras gerais**

- **Arquivos originais.** Nada de print enviado por WhatsApp, foto da tela ou imagem baixada de rede social: tudo isso comprime e perde nitidez.
- Cor **sRGB**. Sem bordas, sombras, molduras, textos sobrepostos ou marca d'água.
- Pode mandar arquivos pesados: eu redimensiono e converto para **WebP** antes de publicar, e no site cada imagem fica leve.

### 6.7 Como tirar screenshots perfeitos

**Tela desktop 16:10 em alta definição (Chrome):**

1. Abra a página e aperte `F12` (DevTools).
2. Aperte `Ctrl + Shift + M` (modo dispositivo).
3. No topo, escolha **Responsive** e digite **1440 × 900**.
4. Em **DPR** (menu `⋮` da barra do modo dispositivo → "Add device pixel ratio"), escolha **2**.
5. No menu `⋮` da barra, clique em **"Capture screenshot"** → sai um PNG de **2880×1800**, limpo e sem barra do navegador.
6. Para a página inteira (landing, site), use **"Capture full size screenshot"**.

> Com o Chrome em português, os nomes dos menus vêm traduzidos, mas as opções ficam no mesmo lugar: o menu `⋮` da barra do modo dispositivo.

**Tela mobile:** no mesmo modo dispositivo, escolha **iPhone 14 Pro Max** (ou similar) e capture. Ou tire o print direto no celular: bateria cheia, sem notificações, modo não perturbe ligado.

**Deixe a tela no estado "bonito":**

- dados fictícios **realistas** (nada de "teste 123" ou "lorem ipsum");
- gráficos e listas preenchidos, sem erros, carregamentos ou telas vazias;
- sem pop-ups de cookies, chat ou newsletter, sem cursor e sem barra de favoritos;
- **modo escuro**, se o produto tiver: combina com o site.

### 6.8 Dados sensíveis (LGPD)

- Nenhum dado pessoal real de clientes do seu cliente: nomes, e-mails, telefones, CPF/CNPJ, endereços, valores financeiros.
- Em painéis de anúncios: oculte ID da conta e valores investidos (se o cliente não autorizar mostrar).
- **Mande as imagens já tratadas.** Se não der, me diga exatamente o que ocultar (ex.: "coluna E-mail na tela-02") e eu aplico o desfoque antes de publicar.

### 6.9 Opcionais para o futuro

| Material | Situação hoje |
|---|---|
| Logo do cliente (SVG, versão branca/monocromática) | não aparece no case; útil para uma futura faixa de logos |
| Foto do autor do depoimento | hoje o avatar usa as iniciais; posso trocar por foto |
| Vídeo curto (MP4, até 20 s, sem áudio) — motion, reels | não suportado ainda; posso adicionar |

---

## 7. Permissões e confidencialidade

Antes de publicar, confirme com o cliente:

- [ ] Podemos **citar o nome** da empresa?
- [ ] Podemos **mostrar as telas** / criativos?
- [ ] Podemos **publicar as métricas**?
- [ ] O **depoimento** (texto, nome e cargo) está aprovado pelo autor?

**Projeto sob confidencialidade (NDA)?** Dá para publicar mesmo assim:

- no lugar do nome, uma descrição: `Fintech de pagamentos`, `Rede de clínicas em SP`;
- telas com a marca do cliente ocultada;
- métricas em percentual em vez de valores absolutos.

> Boa prática: guarde a autorização (e-mail ou mensagem) junto com os arquivos do case.

---

## 8. Como enviar

### Estrutura da pasta

Uma pasta por case, **fora do repositório do site** (os originais são pesados e não devem ir para o git). Sugestão: ao lado da pasta `SWN-SITE`.

```
SWN-CODE/
├── SWN-SITE/                  ← o site (não coloque os originais aqui)
└── envios/
    └── vexa-group/
        ├── case.md            ← template preenchido
        └── imagens/
            ├── principal-desktop.png
            ├── capa.png               (só se for capa pronta — opção B)
            ├── tela-01-relatorios.png
            ├── tela-02-permissoes.png
            ├── mobile-01-home.png
            ├── logo.svg               (opcional)
            └── autor.jpg              (opcional)
```

**Nomes de arquivo:** minúsculas, sem espaços e sem acentos, palavras separadas por hífen, numerados na ordem em que devem aparecer.

### A mensagem

> Implemente o case que está em `C:\Users\eduar\Desktop\Code\SWN-CODE\envios\vexa-group`.

Acrescente o que for especial: ordem na galeria, destaque, prazo etc.

**Alternativa rápida:** colar o template preenchido direto na conversa e anexar as imagens. Funciona para referência, mas **imagens anexadas no chat podem perder resolução**. Para as imagens finais, prefira a pasta.

### Atualizar um case que já está no site

Mande o nome do case e **só os campos que mudaram** (ex.: "Vexa Group: trocar a métrica 14k por 18k usuários ativos").

---

## 9. Template para preencher

Copie o bloco abaixo para `case.md` e preencha. Os números entre parênteses são os limites de caracteres.

```markdown
# Case: <Nome do cliente>

## 1. Identificação
- Cliente:
- Posso citar o nome do cliente? (sim / não — se não, como chamar):
- Categoria principal:
- Outras categorias (opcional):
- Setor do cliente (até 22):
- Ano de entrega:
- Duração do projeto:
- Time SWN (nº de pessoas):
- Link ao vivo (opcional):
- Posição na galeria (último / primeiro / depois de ___):

## 2. Card
- Tag — Tipo · Subtipo (12–22):
- Frase de destaque — com ponto final (15–32):
- Texto do card (95–125):

## 3. Topo da página
- Headline (35–60):
- Subtítulo (80–130):

## 4. Métricas (exatamente 3)
| Valor (até 6) | Rótulo (até 22) | Base / período (só para mim) |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

## 5. O desafio (200–350)


## 6. A solução (150–250)


Entregas (3–5 itens, até 45 cada):
-
-
-

## 7. O resultado (150–250)


## 8. Depoimento (recomendado)
- Texto (80–140):
- Nome:
- Cargo:
- O autor aprovou o texto? (sim / não):
- Incluir também nos depoimentos da home? (sim / não):

## 9. Stack e integrações
- Stack / ferramentas (4–6):
- Integrações (0–4):

## 10. Imagens
- Pasta:
- Imagem principal (arquivo):
- Capa pronta? (não / sim — arquivo):
- Telas extras (arquivo → o que mostra):
- Algo precisa ser ocultado nas imagens?:

## 11. Autorizações
- Nome, telas, métricas e depoimento autorizados? (sim / não / parcial — detalhe):

## 12. Observações
```

---

## 10. Exemplo preenchido

<details>
<summary>Ver o template preenchido com o case Vexa Group (textos iguais aos do site; base das métricas, imagens e autorização são ilustrativas)</summary>

```markdown
# Case: Vexa Group

## 1. Identificação
- Cliente: Vexa Group
- Posso citar o nome do cliente? sim
- Categoria principal: SaaS
- Outras categorias: Sistema de gestão
- Setor do cliente: Logística B2B
- Ano de entrega: 2024
- Duração do projeto: 4 meses
- Time SWN: 3
- Link ao vivo: —
- Posição na galeria: primeiro

## 2. Card
- Tag: SaaS · Software
- Frase de destaque: Plataforma de gestão.
- Texto do card: SaaS multitenant que automatizou fluxos operacionais e reduziu o tempo de resposta interna em mais de um terço.

## 3. Topo da página
- Headline: Plataforma SaaS multitenant para logística B2B.
- Subtítulo: Reescrevemos o sistema interno em 4 meses, automatizando processos que consumiam o time inteiro.

## 4. Métricas
| Valor | Rótulo | Base / período |
|---|---|---|
| −38% | tempo operacional | tempo médio de resposta, antes × 3 meses após o lançamento |
| 2.5x | produtividade | tarefas concluídas por pessoa/dia |
| 14k | usuários ativos | usuários ativos mensais atuais |

## 5. O desafio
A Vexa cresceu 4x em dois anos, mas o sistema interno não acompanhou. Equipe operacional gastava horas em tarefas repetitivas, ferramentas isoladas geravam erro de digitação e o time não tinha visibilidade do que acontecia em tempo real. Cada nova cliente exigia uma cópia manual da configuração, com retrabalho e inconsistência.

## 6. A solução
Reescrevemos a plataforma como SaaS multitenant em Next.js + tRPC, com isolamento por cliente e dashboard único para toda a operação. Cada fluxo crítico foi mapeado e automatizado, com auditoria completa e permissões granulares.

Entregas:
- Multitenant com isolamento por cliente
- Real-time updates via WebSocket
- Auditoria completa de operações
- Permissões granulares por equipe
- Onboarding automatizado de novas contas

## 7. O resultado
O time operacional reduziu o tempo de resposta em 38%. A produtividade média subiu 2.5x. Hoje a plataforma atende 14 mil usuários ativos e a Vexa abriu uma nova vertical de produto sem aumentar o headcount técnico.

## 8. Depoimento
- Texto: Saímos do improviso. O sistema construído pela SWN automatizou processos que consumiam o nosso time inteiro.
- Nome: Rafael Lima
- Cargo: COO
- O autor aprovou o texto? sim
- Incluir também nos depoimentos da home? sim

## 9. Stack e integrações
- Stack: Next.js, TypeScript, tRPC, Postgres, Prisma, Vercel
- Integrações: Stripe, Twilio, AWS S3

## 10. Imagens
- Pasta: envios/vexa-group/imagens
- Imagem principal: principal-desktop.png (dashboard da operação)
- Capa pronta? não
- Telas extras: tela-01-relatorios.png → relatórios · tela-02-permissoes.png → gestão de permissões
- Algo precisa ser ocultado? nomes de motoristas na tela-01

## 11. Autorizações
- Tudo autorizado por e-mail em 12/03/2025.

## 12. Observações
—
```

</details>

---

## 11. Checklist antes de enviar

- [ ] Autorização do cliente (nome, telas, métricas, depoimento)
- [ ] Categoria(s) escolhida(s): a primeira é a principal
- [ ] Todos os campos **obrigatórios** preenchidos ([seção 3](#3-obrigatório--opcional))
- [ ] Textos dentro dos limites (ou pedido para eu ajustar)
- [ ] 3 métricas reais, com base e período
- [ ] Depoimento aprovado pelo autor (se houver)
- [ ] Imagem principal no tamanho mínimo (1920×1200 desktop · 1080×2340 mobile)
- [ ] Imagens originais, sem moldura, sem compressão de WhatsApp e **sem dados sensíveis**
- [ ] Arquivos com nomes padronizados, numa pasta só
- [ ] Link ao vivo testado (se houver)

---

## 12. O que eu faço quando recebo o material

1. **Confiro** tudo com este guia e aviso o que faltar **antes** de começar.
2. **Ajusto os textos** aos limites (se preciso) e te mostro o que mudou.
3. **Crio o slug** do case: `cliente-resumo` (ex.: `vexa-group-plataforma-gestao`).
4. **Trato as imagens:** redimensiono, converto para WebP e salvo em `public/cases/<slug>/`.
5. **Cadastro o case** em `src/data/cases.js` nas categorias informadas (e o depoimento na home, se pedido).
6. **Sem imagens reais:** uso a ilustração da categoria e o gradiente padrão.
7. **Testo** desktop, tablet e celular, confiro os links e gero o build (`dist/`).
8. **Você revisa** no navegador e faz o commit e o deploy.

---

## 13. Perguntas frequentes

**Posso mandar os textos em rascunho ou tópicos?**
Pode. Eu redijo no padrão e te mostro antes de publicar. Só não posso inventar fatos: números, prazos, nomes, depoimentos.

**Posso mandar só uma parte agora e o resto depois?**
Pode. O case só entra no site quando os campos obrigatórios estiverem completos.

**Um case pode estar em duas categorias?**
Sim. Ele aparece nas duas galerias, e a URL usa a categoria principal (a primeira da lista).

**E se o projeto não tiver números de resultado?**
Use números do próprio projeto: telas, módulos, integrações, semanas de entrega.

**Posso escolher a ordem dos cases na galeria?**
Sim. Por padrão o case novo entra por último; é só dizer se deve ser o primeiro ou ficar depois de outro.

**Como removo um case?**
É só pedir. Quem acessar o link antigo é levado para a galeria da categoria.

**A imagem do cliente é clara e o site é escuro. Tem problema?**
Não. A moldura e o fundo do padrão seguram o contraste. Se o produto tiver modo escuro, ele fica ainda melhor.

**Posso mandar vídeo?**
Hoje não há espaço para vídeo na página do case. Se for importante (motion, reels), me avise que eu adiciono o suporte, e ele passa a valer para todos os cases.

# Form em 2 Passos — "Faça a Avaliação" / SWN

> Documento de especificação para um formulário de contato em 2 passos, inspirado no padrão da imagem de referência (ImpactOut). Adaptado à identidade visual da SWN: paleta ciano `#83DFE9` em fundo preto, Sora + Manrope, clamps fluidos, glow sutil. Substitui (ou convive com) o formulário atual em [src/components/Contact.jsx](../src/components/Contact.jsx).

---

## 1. Conceito

Em vez de despejar o formulário inteiro de uma vez, o usuário primeiro **declara o que precisa** (5 opções clicáveis) e só depois preenche os dados. Isso reduz fricção visual, qualifica o lead e cria sensação de "atendimento personalizado".

**Fluxo:**

```
PASSO 1 — "Faça a Avaliação"            PASSO 2 — Formulário
┌────────────────────────────┐          ┌────────────────────────────┐
│ ⬛ Web Development          │          │ Nome *                     │
│ ⬛ Software Development     │   →      │ E-mail *                   │
│ ⬛ Designer                 │          │ Empresa                    │
│ ⬛ Todas as opções          │          │ Mensagem *                 │
│ ⬛ Não sei o que preciso    │          │                            │
└────────────────────────────┘          │ [ ← Voltar ] [ Enviar → ]  │
                                        └────────────────────────────┘
```

A escolha do passo 1 é **levada como contexto** para o passo 2 (preenche o campo `service` automaticamente, igual ao bridge atual via `contactBridge.js`).

---

## 2. Análise visual da referência

Pontos do print da ImpactOut que **mantemos** (adaptados à SWN):

- **Header pequeno** com `PASSO X DE 2` em uppercase + tracking alto, do lado esquerdo
- **Indicador de progresso** à direita (2 segmentos, o ativo destacado em magenta — na SWN será **ciano**)
- **Título grande** em peso pesado (display)
- **Subtítulo** explicando o que vai acontecer
- **Lista de cards verticais** com:
  - Ícone colorido em quadradinho à esquerda (background sutil, borda)
  - Título do card em peso médio-alto
  - Descrição abaixo em cor mais suave
  - Seta no canto direito (chevron-right)
- Cards com **hover sutil** (border ciano + leve translate)

Pontos da referência que **trocamos**:

- ❌ Magenta agressivo das cores → ✅ Ciano `#83DFE9` da SWN
- ❌ Fundo card com cor cheia e sombra forte → ✅ Surface translúcido com border ciano-line (estilo glow-card)
- ❌ Ícones em fundo magenta saturado → ✅ Ícones em fundo `rgba(131,223,233,0.08)` com borda ciano-line, idênticos ao padrão dos `glow-card-icon` e `pillar-icon` que já usamos

---

## 3. Estrutura de DOM

```jsx
<section id="contact" className="form-wizard">
  <div className="form-wizard-shell">
    {/* Header: passo + indicador */}
    <div className="form-wizard-head">
      <span className="form-wizard-step-label">PASSO {step} DE 2</span>
      <div className="form-wizard-progress" aria-hidden="true">
        <span className={`form-wizard-progress-seg ${step >= 1 ? 'is-active' : ''}`} />
        <span className={`form-wizard-progress-seg ${step >= 2 ? 'is-active' : ''}`} />
      </div>
    </div>

    {/* Conteúdo do passo */}
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div key="s1" {...slideVariants}>
          <h2 className="form-wizard-title">
            Faça a <span className="cyan">Avaliação</span>
          </h2>
          <p className="form-wizard-subtitle">
            Conte com o que podemos te ajudar. Em até 24h respondemos com uma
            proposta estratégica para o seu momento.
          </p>

          <ul className="form-wizard-options">
            {OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  className="form-wizard-option"
                  onClick={() => selectOption(opt)}
                >
                  <span className="form-wizard-option-icon">
                    <opt.Icon size={20} />
                  </span>
                  <span className="form-wizard-option-body">
                    <strong>{opt.title}</strong>
                    <span>{opt.desc}</span>
                  </span>
                  <FiArrowRight className="form-wizard-option-arrow" size={18} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div key="s2" {...slideVariants}>
          <button className="form-wizard-back" onClick={() => setStep(1)}>
            <FiArrowLeft size={14} /> Voltar
          </button>

          <h2 className="form-wizard-title">
            Conte sobre <span className="cyan">o seu projeto</span>
          </h2>
          <p className="form-wizard-subtitle">
            Você escolheu: <strong>{selected.title}</strong>. Agora os dados pra
            gente continuar a conversa.
          </p>

          {/* Form fields — reaproveita estrutura do Contact.jsx atual */}
          <form className="contact-form" onSubmit={submit} noValidate>
            {/* ... mesmos campos: Nome, E-mail, Empresa, Mensagem ... */}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>
```

---

## 4. As 5 opções

```js
import { FiGlobe, FiCode, FiPenTool, FiLayers, FiHelpCircle } from 'react-icons/fi';

const OPTIONS = [
  {
    id: 'web',
    title: 'Web Development',
    desc: 'Landing pages, sites institucionais e plataformas web sob medida.',
    Icon: FiGlobe
  },
  {
    id: 'software',
    title: 'Software Development',
    desc: 'SaaS, sistemas internos, automações e integrações via API.',
    Icon: FiCode
  },
  {
    id: 'design',
    title: 'Designer',
    desc: 'Identidade visual, UI/UX e direção de arte para marcas premium.',
    Icon: FiPenTool
  },
  {
    id: 'all',
    title: 'Todas as opções',
    desc: 'Quero combinar mais de uma frente — projeto integrado de ponta a ponta.',
    Icon: FiLayers
  },
  {
    id: 'unsure',
    title: 'Não sei o que preciso',
    desc: 'Quero uma conversa aberta para entender por onde começar.',
    Icon: FiHelpCircle
  }
];
```

---

## 5. CSS (estilo SWN)

### 5.1 Container

```css
.form-wizard {
  padding: clamp(5rem, 10vh, 8rem) 1.5rem;
  position: relative;
}

.form-wizard-shell {
  max-width: 760px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(131, 223, 233, 0.04), rgba(255, 255, 255, 0.01));
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  padding: clamp(2rem, 4vw, 3rem);
  position: relative;
  overflow: hidden;
}

.form-wizard-shell::before {
  /* Aurora ciano discreta no topo direito (igual ao .contact-wrap) */
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 60%;
  height: 140%;
  background: radial-gradient(circle, rgba(131, 223, 233, 0.18), transparent 60%);
  pointer-events: none;
  filter: blur(40px);
}
```

### 5.2 Header (passo + progresso)

```css
.form-wizard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(1.5rem, 3vh, 2.5rem);
  position: relative;
}

.form-wizard-step-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.form-wizard-progress {
  display: flex;
  gap: 6px;
}

.form-wizard-progress-seg {
  width: 32px;
  height: 3px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.5s var(--ease-swan), box-shadow 0.5s ease;
}

.form-wizard-progress-seg.is-active {
  background: var(--cyan);
  box-shadow: 0 0 12px var(--cyan-glow);
}
```

### 5.3 Título e subtítulo

```css
.form-wizard-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin: 0 0 0.85rem;
}

.form-wizard-title .cyan {
  color: var(--cyan);
}

.form-wizard-subtitle {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.65;
  color: var(--text-soft);
  margin: 0 0 clamp(1.5rem, 3vh, 2.25rem);
  max-width: 56ch;
}

.form-wizard-subtitle strong {
  color: var(--cyan);
  font-weight: 600;
}
```

### 5.4 Cards de opção (o ponto crítico)

```css
.form-wizard-options {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.form-wizard-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-align: left;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  cursor: pointer;
  transition:
    border-color 0.4s var(--ease-swan),
    background 0.3s ease,
    transform 0.4s var(--ease-swan);
  position: relative;
  isolation: isolate;
}

.form-wizard-option:hover,
.form-wizard-option:focus-visible {
  border-color: var(--cyan-line);
  background: var(--surface-hover);
  transform: translateX(4px);
  outline: none;
}

.form-wizard-option:focus-visible {
  box-shadow: 0 0 0 3px rgba(131, 223, 233, 0.18);
}

/* Spotlight interno revelado no hover */
.form-wizard-option::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    240px circle at 0% 50%,
    rgba(131, 223, 233, 0.10),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: -1;
}

.form-wizard-option:hover::before {
  opacity: 1;
}

.form-wizard-option-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(131, 223, 233, 0.08);
  border: 1px solid var(--cyan-line);
  color: var(--cyan);
  transition: background 0.4s var(--ease-swan), border-color 0.4s ease;
}

.form-wizard-option:hover .form-wizard-option-icon {
  background: rgba(131, 223, 233, 0.14);
  border-color: var(--cyan);
}

.form-wizard-option-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.form-wizard-option-body strong {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.01em;
  color: var(--white);
}

.form-wizard-option-body span {
  font-family: 'Manrope', sans-serif;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.form-wizard-option-arrow {
  flex-shrink: 0;
  color: var(--text-mute);
  transition: transform 0.4s var(--ease-swan), color 0.3s ease;
}

.form-wizard-option:hover .form-wizard-option-arrow {
  transform: translateX(4px);
  color: var(--cyan);
}
```

### 5.5 Voltar (passo 2)

```css
.form-wizard-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-mute);
  background: transparent;
  border: 0;
  padding: 0;
  margin-bottom: 1.25rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s var(--ease-swan);
}

.form-wizard-back:hover {
  color: var(--cyan);
  transform: translateX(-3px);
}
```

### 5.6 Responsivo

```css
@media (max-width: 768px) {
  .form-wizard-option {
    padding: 0.85rem 1rem;
    gap: 0.85rem;
  }
  .form-wizard-option-icon {
    width: 38px;
    height: 38px;
  }
  .form-wizard-option-body strong {
    font-size: 0.94rem;
  }
  .form-wizard-option-body span {
    font-size: 0.82rem;
  }
}
```

---

## 6. Comportamento (lógica React)

### 6.1 Estado central

```jsx
const [step, setStep] = useState(1);
const [selected, setSelected] = useState(null);
// ... resto do estado do form (data, errors, touched, sent) idêntico ao Contact.jsx atual
```

### 6.2 Seleção do passo 1

```jsx
const selectOption = (opt) => {
  setSelected(opt);
  setData((d) => ({ ...d, service: opt.title }));
  setStep(2);
  // pequeno scroll de cortesia para reposicionar no topo do formulário
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
```

### 6.3 Voltar para passo 1

```jsx
const goBack = () => setStep(1);
```

> **Não resetar o estado dos campos do passo 2** ao voltar — o usuário pode trocar de opção no passo 1 e voltar pro 2 sem perder o que já preencheu.

### 6.4 Transição entre passos (Framer Motion)

```js
const slideVariants = {
  initial: { opacity: 0, x: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, x: -24, filter: 'blur(6px)' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
};
```

Envolve cada passo em `<motion.div {...slideVariants}>` dentro de `<AnimatePresence mode="wait">`.

### 6.5 Integração com `contactBridge.js` existente

Os service cards do site já disparam `prefillContact({ interest })` via `contactBridge.js`. No novo wizard:

```jsx
useEffect(() => {
  return onContactPrefill(({ interest }) => {
    if (!interest) return;
    const match = OPTIONS.find(
      (o) => o.title.toLowerCase() === String(interest).toLowerCase()
    );
    if (match) {
      setSelected(match);
      setData((d) => ({ ...d, service: match.title }));
      setStep(2); // pula direto pro formulário
    }
  });
}, []);
```

Ou seja: clicar em um service card no Services pula automaticamente para o passo 2 com a opção já selecionada.

---

## 7. Acessibilidade

- O header `<div role="presentation">` com `<span aria-live="polite">PASSO X DE 2</span>` notifica leitores de tela quando o passo muda
- `.form-wizard-progress` é decorativo: `aria-hidden="true"`
- Cada `.form-wizard-option` é um `<button type="button">` (não `<div>`) — recebe foco com Tab, ativa com Enter/Space nativo
- `:focus-visible` ring ciano para navegação por teclado
- `<AnimatePresence mode="wait">` evita que dois passos coexistam no DOM (impede leitura confusa)
- O botão "Voltar" no passo 2 tem rótulo explícito ("Voltar"), não só ícone

---

## 8. Mudanças no projeto (arquivos afetados)

| Arquivo | O que muda |
|---|---|
| **NOVO** `src/components/FormWizard.jsx` | Componente principal do wizard de 2 passos |
| `src/components/Contact.jsx` | Substituído pelo FormWizard, OU mantido como fallback se preferir manter ambas as variantes |
| `src/App.jsx` | Trocar `<Contact />` por `<FormWizard />` (ou ambos durante transição) |
| `src/index.css` | Adicionar bloco `/* ---------- Form Wizard ---------- */` com todo o CSS da seção 5 |
| `src/lib/contactBridge.js` | Sem mudanças — a API permanece a mesma |
| `src/lib/contact.js` | Sem mudanças — `EMAIL`, `INSTAGRAM`, `buildWhatsAppLink` continuam |

---

## 9. Decisões a confirmar antes de implementar

1. **Substitui ou convive?** O `Contact.jsx` atual é mantido como página alternativa, ou é totalmente substituído pelo wizard?
2. **Passo 2 idêntico ao form atual?** Mantemos os 4 campos (Nome, E-mail, Empresa, Mensagem) + envio para WhatsApp via `buildWhatsAppLink`?
3. **Painel lateral de canais (e-mail, WhatsApp, Instagram)** — manter visível no passo 1 ou só aparecer no passo 2 como opção alternativa?
4. **"Todas as opções" e "Não sei o que preciso"** — ambas seguem para o mesmo passo 2 com `service` setado, ou "Não sei" abre uma variante mais simples (só Nome + Mensagem)?

---

## 10. Estimativa

- Componente novo `FormWizard.jsx`: ~1.5h
- CSS completo: ~45min
- Integração com bridge + testes: ~30min
- QA visual desktop/tablet/mobile: ~30min

**Total: ~3h**

---

*Documento de especificação. Nenhum código foi alterado ainda — aguardando aprovação.*

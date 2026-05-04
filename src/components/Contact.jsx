import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiMail,
  FiMessageCircle,
  FiInstagram,
  FiArrowRight,
  FiArrowLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiGlobe,
  FiCode,
  FiPenTool,
  FiLayers,
  FiHelpCircle
} from 'react-icons/fi';
import { onContactPrefill } from '../lib/contactBridge';
import { EMAIL, INSTAGRAM, buildWhatsAppLink } from '../lib/contact';

const swanEase = [0.22, 1, 0.36, 1];

/* Google Apps Script endpoint — receives form submissions and writes to Sheets */
const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxOX2ImVx4kw-8ryCK2xbyxOn7bRS-P8Fmz5FFfTeTbOVRu4l520bkaKsR25eeRfYsdbw/exec';

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

const initialData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: ''
};

/**
 * Formata o telefone brasileiro como o usuário digita.
 *  - Mantém só dígitos (máx 11)
 *  - 0 dígitos → '' (mostra placeholder)
 *  - 1-2 dígitos → '(XX'
 *  - 3-6 dígitos → '(XX) XXXX'
 *  - 7-10 dígitos → '(XX) XXXX-XXXX'  (fixo, 8 dígitos no número)
 *  - 11 dígitos → '(XX) XXXXX-XXXX'   (celular, 9 dígitos no número)
 */
const formatPhone = (raw) => {
  const digits = String(raw).replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  /* 9 dígitos no número (celular) */
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
};

const phoneDigits = (formatted) => String(formatted).replace(/\D/g, '');

const validate = (data) => {
  const errors = {};
  if (!data.name.trim()) {
    errors.name = 'Como podemos te chamar?';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Use ao menos 2 caracteres.';
  }

  if (!data.email.trim()) {
    errors.email = 'Precisamos de um e-mail para responder.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Confira o formato do e-mail.';
  }

  const digits = phoneDigits(data.phone);
  if (!digits) {
    errors.phone = 'Informe um telefone para contato.';
  } else if (digits.length < 10) {
    errors.phone = 'Telefone incompleto — DDD + 8 ou 9 dígitos.';
  } else if (digits.length > 11) {
    errors.phone = 'Confira o número — máximo 11 dígitos.';
  }

  if (!data.message.trim()) {
    errors.message = 'Conte um pouco sobre o projeto.';
  } else if (data.message.trim().length < 12) {
    errors.message = 'Algumas linhas a mais nos ajudam a responder melhor.';
  }
  return errors;
};

const slideVariants = {
  initial: { opacity: 0, x: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, x: -24, filter: 'blur(6px)' }
};

const Contact = () => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  /* External prefill (e.g. service card click) jumps straight to step 2 */
  useEffect(() => {
    return onContactPrefill(({ interest }) => {
      if (!interest) return;
      const match = OPTIONS.find(
        (o) => o.title.toLowerCase() === String(interest).toLowerCase()
      );
      if (match) {
        setSelected(match);
        setStep(2);
      } else {
        /* Unknown interest — still prefill via "Todas as opções" so user can edit */
        setSelected({ ...OPTIONS[3], title: interest });
        setStep(2);
      }
    });
  }, []);

  const selectOption = (opt) => {
    setSelected(opt);
    setStep(2);
  };

  const goBack = () => setStep(1);

  const update = (k) => (e) => {
    const raw = e.target.value;
    const value = k === 'phone' ? formatPhone(raw) : raw;
    setData((d) => ({ ...d, [k]: value }));
    if (touched[k]) {
      setErrors((prev) => {
        const next = validate({ ...data, [k]: value });
        return { ...prev, [k]: next[k] };
      });
    }
  };

  /* Phone field shows "(" as soon as it gets focus, even before typing */
  const handlePhoneFocus = () => {
    if (!data.phone) {
      setData((d) => ({ ...d, phone: '(' }));
    }
  };

  const handlePhoneBlur = () => {
    /* If only "(" is left, clear it back to empty so placeholder reappears */
    if (data.phone === '(') {
      setData((d) => ({ ...d, phone: '' }));
    }
    handleBlur('phone')();
  };

  const handleBlur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    const next = validate(data);
    setErrors((prev) => ({ ...prev, [k]: next[k] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = validate(data);
    setErrors(next);
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.values(next).some(Boolean)) return;
    if (sending) return;

    setSending(true);

    const servico = selected?.title || 'Conversa aberta';

    /* 1) Send to Google Sheets via Apps Script.
       Uses no-cors so the response is opaque — fire-and-forget on the client.
       Failure here should NOT block the WhatsApp handoff. */
    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.name,
          email: data.email,
          telefone: data.phone,
          empresa: data.company,
          servico,
          descricao: data.message
        })
      });
    } catch (err) {
      /* Silent — sheet write is best-effort, the WhatsApp link is the
         primary handoff and must always run. */
      console.warn('Sheets submission failed:', err);
    }

    /* 2) Hand off to WhatsApp with a pre-filled message */
    const text =
      `Olá SWN! Sou ${data.name} (${data.email})` +
      (data.company ? `, da ${data.company}` : '') +
      `.\nTelefone: ${data.phone}` +
      `\nTenho interesse em: ${servico}.\n\n${data.message}`;

    window.open(buildWhatsAppLink(text), '_blank', 'noopener');
    setSent(true);
    setSending(false);
  };

  const fieldStatus = (k) => (touched[k] && errors[k] ? 'invalid' : '');

  return (
    <section id="contact" className="form-wizard">
      <motion.div
        className="form-wizard-shell"
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: swanEase }}
      >
        {/* Header: passo + indicador */}
        <div className="form-wizard-head">
          <span className="form-wizard-step-label" aria-live="polite">
            Passo {step} de 2
          </span>
          <div className="form-wizard-progress" aria-hidden="true">
            <span className={`form-wizard-progress-seg ${step >= 1 ? 'is-active' : ''}`} />
            <span className={`form-wizard-progress-seg ${step >= 2 ? 'is-active' : ''}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.55, ease: swanEase }}
            >
              <h2 className="form-wizard-title">
                Faça a <span className="cyan">avaliação</span>
              </h2>
              <p className="form-wizard-subtitle">
                Conte com o que podemos te ajudar. Em até 24h respondemos com uma
                proposta estratégica para o seu momento.
              </p>

              <ul className="form-wizard-options">
                {OPTIONS.map((opt, i) => (
                  <motion.li
                    key={opt.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.06, ease: swanEase }}
                  >
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
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.55, ease: swanEase }}
            >
              <button
                type="button"
                className="form-wizard-back"
                onClick={goBack}
              >
                <FiArrowLeft size={14} aria-hidden="true" /> Voltar
              </button>

              <h2 className="form-wizard-title">
                Conte sobre <span className="cyan">o seu projeto</span>
              </h2>
              <p className="form-wizard-subtitle">
                Você escolheu: <strong>{selected?.title || 'Conversa aberta'}</strong>.
                Agora os dados pra gente continuar.
              </p>

              <form className="contact-form" onSubmit={submit} noValidate>
                <div className="row">
                  <div className={`field ${fieldStatus('name')}`}>
                    <label htmlFor="name">
                      Nome <span className="field-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      value={data.name}
                      onChange={update('name')}
                      onBlur={handleBlur('name')}
                      placeholder="Seu nome"
                      autoComplete="name"
                      aria-required="true"
                      aria-invalid={!!(touched.name && errors.name)}
                      aria-describedby={errors.name ? 'err-name' : undefined}
                    />
                    {touched.name && errors.name && (
                      <span id="err-name" className="field-error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div className={`field ${fieldStatus('email')}`}>
                    <label htmlFor="email">
                      E-mail <span className="field-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={update('email')}
                      onBlur={handleBlur('email')}
                      placeholder="voce@empresa.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={!!(touched.email && errors.email)}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                    />
                    {touched.email && errors.email && (
                      <span id="err-email" className="field-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label htmlFor="company">
                      Empresa <span className="field-optional">(opcional)</span>
                    </label>
                    <input
                      id="company"
                      value={data.company}
                      onChange={update('company')}
                      placeholder="Sua empresa"
                      autoComplete="organization"
                    />
                  </div>
                  <div className={`field ${fieldStatus('phone')}`}>
                    <label htmlFor="phone">
                      Telefone <span className="field-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      value={data.phone}
                      onChange={update('phone')}
                      onFocus={handlePhoneFocus}
                      onBlur={handlePhoneBlur}
                      placeholder="Seu número"
                      autoComplete="tel"
                      maxLength={15}
                      aria-required="true"
                      aria-invalid={!!(touched.phone && errors.phone)}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                    />
                    {touched.phone && errors.phone && (
                      <span id="err-phone" className="field-error" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`field ${fieldStatus('message')}`}>
                  <label htmlFor="message">
                    Sobre o projeto <span className="field-required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={data.message}
                    onChange={update('message')}
                    onBlur={handleBlur('message')}
                    placeholder="Conte um pouco sobre o que você precisa, prazo e contexto."
                    aria-required="true"
                    aria-invalid={!!(touched.message && errors.message)}
                    aria-describedby={errors.message ? 'err-message' : undefined}
                  />
                  {touched.message && errors.message && (
                    <span id="err-message" className="field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {sent && (
                  <p className="form-status" role="status">
                    <FiCheckCircle size={16} aria-hidden="true" />
                    Mensagem preparada — abrimos o WhatsApp para você concluir.
                  </p>
                )}

                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending
                    ? 'Enviando…'
                    : sent
                      ? 'Mensagem preparada'
                      : 'Enviar mensagem'}
                  <FiArrowRight className="btn-arrow" size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channels — visíveis em ambos os passos como alternativa de contato */}
        <div className="form-wizard-channels">
          <span className="form-wizard-channels-label">ou fale direto</span>
          <div className="form-wizard-channels-list">
            <a className="form-wizard-channel" href={`mailto:${EMAIL}`} aria-label="E-mail">
              <FiMail size={14} aria-hidden="true" />
              <span>{EMAIL}</span>
            </a>
            <a
              className="form-wizard-channel"
              href={buildWhatsAppLink('Olá SWN! Vim pelo site.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FiMessageCircle size={14} aria-hidden="true" />
              <span>WhatsApp</span>
              <FiArrowUpRight size={12} aria-hidden="true" />
            </a>
            <a
              className="form-wizard-channel"
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FiInstagram size={14} aria-hidden="true" />
              <span>@swnstudio</span>
              <FiArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;

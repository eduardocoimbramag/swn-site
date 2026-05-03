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
  message: ''
};

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
    const value = e.target.value;
    setData((d) => ({ ...d, [k]: value }));
    if (touched[k]) {
      setErrors((prev) => {
        const next = validate({ ...data, [k]: value });
        return { ...prev, [k]: next[k] };
      });
    }
  };

  const handleBlur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    const next = validate(data);
    setErrors((prev) => ({ ...prev, [k]: next[k] }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = validate(data);
    setErrors(next);
    setTouched({ name: true, email: true, message: true });
    if (Object.values(next).some(Boolean)) return;

    const text =
      `Olá SWN! Sou ${data.name} (${data.email})` +
      (data.company ? `, da ${data.company}` : '') +
      `.\nTenho interesse em: ${selected?.title || 'Conversa aberta'}.\n\n${data.message}`;

    window.open(buildWhatsAppLink(text), '_blank', 'noopener');
    setSent(true);
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

                <button type="submit" className="btn-primary">
                  {sent ? 'Mensagem preparada' : 'Enviar mensagem'}
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

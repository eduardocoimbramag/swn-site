import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiMessageCircle,
  FiInstagram,
  FiArrowRight,
  FiArrowUpRight,
  FiCheckCircle
} from 'react-icons/fi';
import { onContactPrefill } from '../lib/contactBridge';
import { EMAIL, INSTAGRAM, buildWhatsAppLink } from '../lib/contact';

const swanEase = [0.22, 1, 0.36, 1];

const SERVICES = [
  'Software Development',
  'Web Development',
  'Design & Social Media',
  'Branding / Identidade',
  'Não sei ainda — quero conversar'
];

const initialData = {
  name: '',
  email: '',
  company: '',
  service: 'Web Development',
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

const Contact = () => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    return onContactPrefill(({ interest }) => {
      if (!interest) return;
      const match = SERVICES.find(
        (s) => s.toLowerCase() === String(interest).toLowerCase()
      );
      setData((d) => ({ ...d, service: match || interest }));
    });
  }, []);

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
      `.\nTenho interesse em: ${data.service}.\n\n${data.message}`;

    window.open(buildWhatsAppLink(text), '_blank', 'noopener');
    setSent(true);
  };

  const fieldStatus = (k) => (touched[k] && errors[k] ? 'invalid' : '');

  return (
    <section id="contact" className="contact">
      <div className="contact-wrap">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: swanEase }}
        >
          <h2>
            Pronto para crescer com <span className="cyan">sofisticação?</span>
          </h2>
          <p>
            Conte sobre o seu projeto. Em até 24h respondemos com uma proposta
            estratégica desenhada especificamente para o seu momento.
          </p>

          <div className="contact-channels">
            <a className="contact-channel" href={`mailto:${EMAIL}`}>
              <span className="contact-channel-icon"><FiMail size={16} /></span>
              <div>
                <strong>{EMAIL}</strong>
                <span>Resposta em até 24h</span>
              </div>
              <FiArrowUpRight className="contact-channel-ext" size={14} aria-hidden="true" />
            </a>
            <a
              className="contact-channel"
              href={buildWhatsAppLink('Olá SWN! Vim pelo site.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><FiMessageCircle size={16} /></span>
              <div>
                <strong>WhatsApp</strong>
                <span>Atendimento direto com a equipe</span>
              </div>
              <FiArrowUpRight className="contact-channel-ext" size={14} aria-hidden="true" />
            </a>
            <a
              className="contact-channel"
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><FiInstagram size={16} /></span>
              <div>
                <strong>@swnstudio</strong>
                <span>Inspirações e bastidores</span>
              </div>
              <FiArrowUpRight className="contact-channel-ext" size={14} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.15, ease: swanEase }}
        >
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
            <div className="field">
              <label htmlFor="service">Interesse</label>
              <select id="service" value={data.service} onChange={update('service')}>
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
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

          <button type="submit" className="btn-primary">
            {sent ? 'Mensagem preparada' : 'Enviar mensagem'}
            <FiArrowRight className="btn-arrow" size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;

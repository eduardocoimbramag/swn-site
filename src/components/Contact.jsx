import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiMessageCircle,
  FiInstagram,
  FiArrowRight
} from 'react-icons/fi';

const swanEase = [0.22, 1, 0.36, 1];

const Contact = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Web Development',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Olá SWN! Sou ${data.name} (${data.email})${data.company ? `, da ${data.company}` : ''}.\n` +
        `Tenho interesse em: ${data.service}.\n\n${data.message}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
    setSent(true);
  };

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
            <a className="contact-channel" href="mailto:contato@swnstudio.com">
              <span className="contact-channel-icon"><FiMail size={16} /></span>
              <div>
                <strong>contato@swnstudio.com</strong>
                <span>Resposta em até 24h</span>
              </div>
            </a>
            <a
              className="contact-channel"
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><FiMessageCircle size={16} /></span>
              <div>
                <strong>WhatsApp</strong>
                <span>Atendimento direto com a equipe</span>
              </div>
            </a>
            <a
              className="contact-channel"
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-channel-icon"><FiInstagram size={16} /></span>
              <div>
                <strong>@swnstudio</strong>
                <span>Inspirações e bastidores</span>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={submit}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.15, ease: swanEase }}
        >
          <div className="row">
            <div>
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                required
                value={data.name}
                onChange={update('name')}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                value={data.email}
                onChange={update('email')}
                placeholder="voce@empresa.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="company">Empresa</label>
              <input
                id="company"
                value={data.company}
                onChange={update('company')}
                placeholder="Sua empresa (opcional)"
                autoComplete="organization"
              />
            </div>
            <div>
              <label htmlFor="service">Interesse</label>
              <select id="service" value={data.service} onChange={update('service')}>
                <option>Software Development</option>
                <option>Web Development</option>
                <option>Design & Social Media</option>
                <option>Branding / Identidade</option>
                <option>Não sei ainda — quero conversar</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message">Sobre o projeto</label>
            <textarea
              id="message"
              required
              value={data.message}
              onChange={update('message')}
              placeholder="Conte um pouco sobre o que você precisa, prazo e contexto."
            />
          </div>

          <button type="submit" className="btn-primary">
            {sent ? 'Mensagem preparada!' : 'Enviar mensagem'}
            <FiArrowRight className="btn-arrow" size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;

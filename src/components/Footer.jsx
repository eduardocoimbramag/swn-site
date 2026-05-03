import React from 'react';
import { FiInstagram, FiLinkedin, FiMail, FiYoutube } from 'react-icons/fi';
import { EMAIL, INSTAGRAM, LINKEDIN, YOUTUBE } from '../lib/contact';

const Footer = () => {
  const year = new Date().getFullYear();

  const goTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo-branca.png" alt="SWN Studio" width="120" height="28" loading="lazy" decoding="async" />
            <p>
              Estúdio digital premium especializado em software, web e design.
              Onde a beleza encontra a performance.
            </p>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><a href="#services" onClick={goTo('services')}>Software Development</a></li>
              <li><a href="#services" onClick={goTo('services')}>Web Development</a></li>
              <li><a href="#services" onClick={goTo('services')}>Design & Social Media</a></li>
              <li><a href="#services" onClick={goTo('services')}>Branding</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Estúdio</h4>
            <ul>
              <li><a href="#about" onClick={goTo('about')}>Sobre</a></li>
              <li><a href="#process" onClick={goTo('process')}>Processo</a></li>
              <li><a href="#portfolio" onClick={goTo('portfolio')}>Cases</a></li>
              <li><a href="#testimonials" onClick={goTo('testimonials')}>Depoimentos</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a href="#contact" onClick={goTo('contact')}>Solicitar proposta</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">© {year} SWN Studio. Todos os direitos reservados.</p>
          <p className="footer-slogan">Onde a beleza encontra a performance.</p>
          <div className="footer-socials">
            <a className="footer-social" href={INSTAGRAM} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FiInstagram size={16} /></a>
            <a className="footer-social" href={LINKEDIN} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FiLinkedin size={16} /></a>
            <a className="footer-social" href={YOUTUBE} aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FiYoutube size={16} /></a>
            <a className="footer-social" href={`mailto:${EMAIL}`} aria-label="E-mail"><FiMail size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

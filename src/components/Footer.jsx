import React from 'react';
import { FiInstagram, FiLinkedin, FiMail, FiYoutube } from 'react-icons/fi';
import { EMAIL, INSTAGRAM, LINKEDIN, YOUTUBE } from '../lib/contact';
import { useSectionNav } from '../hooks/useSectionNav';

const Footer = () => {
  const year = new Date().getFullYear();
  const { hrefFor, goTo } = useSectionNav();

  /* Link props for a home section — works from any route */
  const section = (id) => ({
    href: hrefFor(id),
    onClick: (e) => {
      e.preventDefault();
      goTo(id);
    }
  });

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo-branca.png" alt="SWN Studio" className="footer-logo" loading="lazy" decoding="async" />
            <p>
              Estúdio digital premium especializado em software, web e design.
              Onde a beleza encontra a performance.
            </p>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><a {...section('services')}>Software Development</a></li>
              <li><a {...section('services')}>Web Development</a></li>
              <li><a {...section('services')}>Design & Social Media</a></li>
              <li><a {...section('services')}>Branding</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Estúdio</h4>
            <ul>
              <li><a {...section('about')}>Sobre</a></li>
              <li><a {...section('team')}>Nosso time</a></li>
              <li><a {...section('process')}>Processo</a></li>
              <li><a {...section('portfolio')}>Cases</a></li>
              <li><a {...section('testimonials')}>Depoimentos</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li><a {...section('contact')}>Solicitar proposta</a></li>
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

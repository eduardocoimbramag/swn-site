import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src="/logo-branca.png" alt="SWN Studio" className="footer-logo" />
        <div className="footer-links">
          <ul>
            <li><a href="#hero">Início</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#process">Processo</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </div>
        <p className="footer-slogan">Onde a beleza encontra a performance</p>
        <p className="footer-text">© 2026 SWN Studio. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/logo-branca.png" alt="SWN Studio" className="header-logo" />
        <nav className="header-nav">
          <ul>
            <li><a href="#hero">Início</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#process">Processo</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </nav>
        <button className="header-button">Falar com a SWN</button>
        <button className="header-menu-toggle" aria-label="Abrir menu">
          <FiMenu />
        </button>
      </div>
    </header>
  );
};

export default Header;
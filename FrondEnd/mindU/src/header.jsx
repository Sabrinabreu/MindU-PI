import React, { useState } from 'react';
import './css/header.css'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">

        <a href="/" className="logo">MindU</a>

        {/* Botão Mobile */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#">Início</a>
          <a href="#contato">Contato</a>
          <a href="#cadastro">Cadastro</a>
          <a href="#login" className="mobile-only">Login</a>
        </nav>

        <div className="header-actions">
          <a href="#login" className="btn-primary">Login</a>
        </div>
        
      </div>
    </header>
  );
}
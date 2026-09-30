import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">

        <Link to="/" className="logo" onClick={closeMenu}>MindU</Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Início</Link>

          <Link to="/contato" onClick={closeMenu}>Contato</Link>

          <Link to="/cadastro" onClick={closeMenu}>Cadastro</Link>

          <Link to="/login" className="mobile-only" onClick={closeMenu}>
            Login
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn-primary">Login</Link>
        </div>

      </div>
    </header>
  );
}
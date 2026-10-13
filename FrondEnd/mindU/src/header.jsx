import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';

export function Header({ usuario, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          MindU
        </Link>

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

          {!usuario && (
            <Link to="/cadastro" onClick={closeMenu}>
              Cadastro
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {usuario ? (
            <button
              type="button"
              className="header-user-btn"
              onClick={onToggleSidebar}
              aria-label="Abrir menu da conta"
            >
              <div className="header-user-avatar">
                {usuario.foto ? (
                  <img src={usuario.foto} alt={usuario.nome} />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              <div className="header-user-info">
                <span className="header-user-name">
                  {usuario.nome || 'Minha conta'}
                </span>
                <span className="header-user-tipo">
                  {formatarTipo(usuario.tipo)}
                </span>
              </div>
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function formatarTipo(tipo) {
  return (
    {
      BENEFICIARIO: 'Beneficiário',
      PROFISSIONAL: 'Profissional',
      EMPRESA: 'Empresa',
      ADMIN: 'Administrador',
    }[tipo] || ''
  );
}
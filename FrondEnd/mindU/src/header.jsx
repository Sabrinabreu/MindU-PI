import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';
import { getIniciais, getFotoUrl } from './api';

export function Header({ usuario, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fotoErro, setFotoErro] = useState(false);

  useEffect(() => {
    setFotoErro(false);
  }, [usuario?.id, usuario?.foto]);

  const closeMenu = () => setIsMenuOpen(false);

  // Foto do profissional vem do endpoint /v1/profissionais/{id}/foto.
  // Os outros tipos caem em iniciais.
  const fotoSrc =
    usuario?.tipo === 'PROFISSIONAL'
      ? getFotoUrl(usuario.id)
      : usuario?.foto;

  const mostrarFoto = fotoSrc && !fotoErro;

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          MindU
        </Link>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Início</Link>
          <Link to="/contato" onClick={closeMenu}>Contato</Link>
          {!usuario && (
            <Link to="/cadastro" onClick={closeMenu}>Cadastro</Link>
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
                {mostrarFoto ? (
                  <img
                    src={fotoSrc}
                    alt={usuario.nome}
                    onError={() => setFotoErro(true)}
                  />
                ) : (
                  <span className="avatar-text">{getIniciais(usuario.nome)}</span>
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
            <Link to="/login" className="btn-header-action">Login</Link>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}

function formatarTipo(tipo) {
  return {
    BENEFICIARIO: 'Beneficiário',
    PROFISSIONAL: 'Profissional',
    EMPRESA: 'Empresa',
    ADMIN: 'Administrador',
  }[tipo] || '';
}
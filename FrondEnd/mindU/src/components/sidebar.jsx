import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { limparSessao } from '../api';
import '../css/sidebar.css';

// Links de exemplo (substituir depois)
const MENUS_POR_TIPO = {
  BENEFICIARIO: [
    { icon: 'person', label: 'Meu Perfil', to: '/perfil' },
    { icon: 'event', label: 'Agendamentos', to: '/agendamentos' },
    { icon: 'search', label: 'Profissionais', to: '/profissionais' },
    { icon: 'history', label: 'Histórico', to: '/historico' },
  ],
  PROFISSIONAL: [
    { icon: 'person', label: 'Meu Perfil', to: '/perfil' },
    { icon: 'calendar_month', label: 'Agenda', to: '/agenda' },
    { icon: 'group', label: 'Consultas', to: '/consultas' },
    { icon: 'schedule', label: 'Disponibilidade', to: '/disponibilidade' },
    { icon: 'location_on', label: 'Locais', to: '/locais' },
  ],
  EMPRESA: [
    { icon: 'person', label: 'Meu Perfil', to: '/perfil' },
    { icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { icon: 'group', label: 'Colaboradores', to: '/colaboradores' },
    { icon: 'badge', label: 'Matrículas', to: '/matriculas' },
    { icon: 'bar_chart', label: 'Relatórios', to: '/relatorios' },
  ],
  ADMIN: [
    { icon: 'person', label: 'Meu Perfil', to: '/perfil' },
    { icon: 'apartment', label: 'Empresas', to: '/admin/empresas' },
    { icon: 'medical_services', label: 'Profissionais', to: '/admin/profissionais' },
    { icon: 'group', label: 'Clientes', to: '/admin/clientes' },
    { icon: 'bar_chart', label: 'Relatórios', to: '/admin/relatorios' },
    { icon: 'settings', label: 'Configurações', to: '/admin/config' },
  ],
};

export function Sidebar({ usuario, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!usuario) return null;

  const links = MENUS_POR_TIPO[usuario.tipo] || [];

  const handleLogout = () => {
    limparSessao();
    onClose?.();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'active' : ''}`} aria-hidden={!isOpen}>
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {usuario.foto ? (
              <img src={usuario.foto} alt={usuario.nome} />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <strong>{usuario.nome || 'Usuário MindU'}</strong>
            <small>{formatarTipo(usuario.tipo)}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          Sair da conta
        </button>
      </aside>
    </>
  );
}

function formatarTipo(tipo) {
  return (
    {
      BENEFICIARIO: 'Beneficiário',
      PROFISSIONAL: 'Profissional',
      EMPRESA: 'Empresa',
      ADMIN: 'Administrador',
    }[tipo] || tipo
  );
}
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUsuario } from '../hooks/useUsuario';

export function RotaProtegida({ children, tipos }) {
  const usuario = useUsuario();
  const location = useLocation();

  if (!usuario) return <Navigate to="/login" replace />;
  if (tipos && !tipos.includes(usuario.tipo)) return <Navigate to="/" replace />;

  // Se o perfil estiver incompleto, trava tudo, menos a tela de perfil
  const isIncompleto = localStorage.getItem('mindu_perfil_incompleto') === 'true';
  if (isIncompleto && location.pathname !== '/perfil') {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}
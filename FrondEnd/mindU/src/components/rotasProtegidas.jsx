import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUsuario } from '../hooks/useUsuario';

/**
 * <RotaProtegida tipos={['EMPRESA', 'ADMIN']}>
 *   <Dashboard />
 * </RotaProtegida>
 */

export function RotaProtegida({ children, tipos }) {
  const usuario = useUsuario();

  // Não logado → vai pro login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Logado mas tipo não permitido → volta pra home
  if (tipos && !tipos.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
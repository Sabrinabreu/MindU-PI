import { useState, useEffect } from 'react';
import { getUsuario } from '../api';

export function useUsuario() {
  const [usuario, setUsuario] = useState(() => getUsuario());

  useEffect(() => {
    const handler = () => setUsuario(getUsuario());
    window.addEventListener('usuario-mudou', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('usuario-mudou', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return usuario;
}
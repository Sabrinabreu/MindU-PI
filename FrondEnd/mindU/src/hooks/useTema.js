import { useState, useEffect } from 'react';

const STORAGE_KEY = 'mindu_tema';

function getTemaInicial() {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo === 'light' || salvo === 'dark') return salvo;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTema() {
  const [tema, setTema] = useState(() => getTemaInicial());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(STORAGE_KEY, tema);
  }, [tema]);

  const toggleTema = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'));

  return { tema, toggleTema };
}
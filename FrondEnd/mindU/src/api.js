const BASE_URL = "http://localhost:8080"; // trocar para https://mindu-api.onrender.com no projeto final!!

export function getToken() {
  return localStorage.getItem("mindu_token");
}

export function getUsuario() {
  const id = localStorage.getItem('mindu_user_id');
  const tipo = localStorage.getItem('mindu_tipo');
  if (!id || !tipo) return null;
  return {
    id,
    tipo,
    nome: localStorage.getItem('mindu_user_nome') || '',
    foto: localStorage.getItem('mindu_user_foto') || '',
  };
}

export function salvarSessao({ token, tipo, id, nome, foto }) {
  if (token) localStorage.setItem('mindu_token', token);
  if (tipo) localStorage.setItem('mindu_tipo', tipo);
  if (id) localStorage.setItem('mindu_user_id', id);
  if (nome) localStorage.setItem('mindu_user_nome', nome);
  if (foto) localStorage.setItem('mindu_user_foto', foto);

  window.dispatchEvent(new Event('usuario-mudou'));
}

export function limparSessao() {
  localStorage.removeItem('mindu_token');
  localStorage.removeItem('mindu_tipo');
  localStorage.removeItem('mindu_user_id');
  localStorage.removeItem('mindu_user_nome');
  localStorage.removeItem('mindu_user_foto');

  window.dispatchEvent(new Event('usuario-mudou'));
}

export async function api(path, { method = "GET", body, isFormData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || `Erro ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}